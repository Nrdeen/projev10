import { FunctionDeclaration, GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { MarketplaceRepository } from '../repositories/types';
import {
  executeGetBreedPriceGuidesTool,
  executeSearchPublishedListingsTool,
} from './marketplaceTools';
import type { AiConfig, AiListingCard, AiProvider, AiProviderInput, AiProviderOutput } from './types';

export class AiProviderUpstreamError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'AiProviderUpstreamError';
  }
}

const searchPublishedListingsDeclaration: FunctionDeclaration = {
  name: 'searchPublishedListings',
  description:
    'Search currently published Saudi livestock marketplace listings with optional breed, region, city, price range, vaccination, and sorting filters. Returns only public listing summaries.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'Free-text Saudi dialect search hint (e.g., جذعان نعيمي، هرفي حري، عوارض دفيع).',
      },
      breed: {
        type: Type.STRING,
        description: 'Saudi livestock breed name (e.g., نعيمي، نجدي، حري، عارضي، سواكني).',
      },
      region: {
        type: Type.STRING,
        description: 'Saudi region name (e.g., الرياض، مكة المكرمة، القصيم، المنطقة الشرقية).',
      },
      city: {
        type: Type.STRING,
        description: 'City name (e.g., الرياض، المزاحمية، بريدة، الطائف، جدة).',
      },
      minPrice: {
        type: Type.NUMBER,
        description: 'Minimum price in SAR.',
      },
      maxPrice: {
        type: Type.NUMBER,
        description: 'Maximum price in SAR.',
      },
      vaccinatedOnly: {
        type: Type.BOOLEAN,
        description: 'Set true to return only vaccinated livestock listings.',
      },
      negotiableOnly: {
        type: Type.BOOLEAN,
        description: 'Set true to return only negotiable listings.',
      },
      sort: {
        type: Type.STRING,
        description: 'Sort order: newest, price_asc, price_desc, or most_liked.',
      },
      limit: {
        type: Type.INTEGER,
        description: 'Maximum number of listings to return (1 to 4).',
      },
    },
  },
};

const getBreedPriceGuidesDeclaration: FunctionDeclaration = {
  name: 'getBreedPriceGuides',
  description:
    'Get indicative Saudi market price guides, average weights, and breed details for Saudi livestock breeds.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      breed: {
        type: Type.STRING,
        description: 'Optional breed name to filter guides (e.g., نعيمي، حري، نجدي، عارضي، سواكني).',
      },
    },
  },
};

function mapGeminiError(err: unknown): AiProviderUpstreamError {
  const status = Number((err as any)?.status || (err as any)?.statusCode || 502);
  const msg = String((err as any)?.message || '');

  if (status === 404 || /NOT_FOUND/i.test(msg)) {
    return new AiProviderUpstreamError(
      502,
      'معرف نموذج المساعد الذكي المحدد غير متاح حالياً، يرجى مراجعة إعدادات النموذج.',
      'ai_model_not_found'
    );
  }
  if (status === 400 || status === 401 || status === 403 || /API_KEY_INVALID|PERMISSION_DENIED/i.test(msg)) {
    return new AiProviderUpstreamError(
      503,
      'تعذر التحقق من خدمة المساعد الذكي حالياً، يرجى مراجعة إعدادات الخدمة.',
      'ai_auth_error'
    );
  }
  if (status === 429 || /RESOURCE_EXHAUSTED/i.test(msg)) {
    return new AiProviderUpstreamError(
      429,
      'خدمة المساعد الذكي مشغولة حالياً، يرجى المحاولة بعد قليل.',
      'ai_upstream_rate_limited'
    );
  }
  if (/AbortError|timeout/i.test(msg)) {
    return new AiProviderUpstreamError(
      504,
      'استغرقت استجابة المساعد الذكي وقتاً أطول من المعتاد، حاول مرة أخرى.',
      'ai_timeout'
    );
  }
  return new AiProviderUpstreamError(
    502,
    'تعذر الاتصال بخدمة المساعد الذكي مؤقتاً، حاول مرة أخرى بعد لحظات.',
    'ai_upstream_error'
  );
}

export class GeminiAiProvider implements AiProvider {
  readonly name = 'gemini' as const;
  private readonly client: GoogleGenAI;

  constructor(
    private readonly config: AiConfig,
    private readonly repo?: MarketplaceRepository
  ) {
    if (!config.geminiApiKey) {
      throw new Error('GeminiAiProvider requires a configured GEMINI_API_KEY.');
    }
    this.client = new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  private async runWithDeadline<T>(promise: Promise<T>, deadlineMs: number): Promise<T> {
    const remainingMs = deadlineMs - Date.now();
    if (remainingMs <= 0) {
      throw new Error('Gemini request timeout');
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Gemini request timeout')), remainingMs);
          timer.unref?.();
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async generateReply(input: AiProviderInput): Promise<AiProviderOutput> {
    const contents: any[] = [
      ...input.history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: input.userMessage }] },
    ];

    const tools = this.repo
      ? [{ functionDeclarations: [searchPublishedListingsDeclaration, getBreedPriceGuidesDeclaration] }]
      : undefined;

    const deadlineMs = Date.now() + this.config.timeoutMs;
    const collectedCards: AiListingCard[] = [];

    try {
      let response = await this.runWithDeadline(
        this.client.models.generateContent({
          model: this.config.model,
          contents,
          config: {
            systemInstruction: input.systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            ...(tools ? { tools } : {}),
          },
        }),
        deadlineMs
      );

      // Bounded function-calling rounds (max 2)
      for (let round = 0; round < 2; round += 1) {
        const functionCalls = response.functionCalls;
        const previousContent = response.candidates?.[0]?.content;
        if (!functionCalls || functionCalls.length === 0 || !previousContent || !this.repo) {
          break;
        }

        const responseParts: any[] = [];
        for (const call of functionCalls) {
          const callArgs = (call.args && typeof call.args === 'object' ? call.args : {}) as Record<
            string,
            unknown
          >;

          if (call.name === 'searchPublishedListings') {
            const searchRes = await executeSearchPublishedListingsTool(this.repo, callArgs);
            if (searchRes.cards.length > 0) {
              collectedCards.splice(0, collectedCards.length, ...searchRes.cards);
            }
            responseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: {
                  totalMatchingListings: searchRes.totalMatchingListings,
                  listings: searchRes.listingsSummary,
                },
              },
            });
          } else if (call.name === 'getBreedPriceGuides') {
            const guidesRes = await executeGetBreedPriceGuidesTool(this.repo, callArgs);
            responseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: guidesRes,
              },
            });
          } else {
            responseParts.push({
              functionResponse: {
                id: call.id,
                name: call.name,
                response: { error: 'Unsupported tool' },
              },
            });
          }
        }

        contents.push(previousContent);
        contents.push({ role: 'user', parts: responseParts });

        response = await this.runWithDeadline(
          this.client.models.generateContent({
            model: this.config.model,
            contents,
            config: {
              systemInstruction: input.systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
              ...(tools ? { tools } : {}),
            },
          }),
          deadlineMs
        );
      }

      const text = (response.text || '').trim();
      if (!text) {
        throw new AiProviderUpstreamError(
          502,
          'لم يتمكن المساعد من توليد رد واضح، يرجى إعادة صياغة سؤالك.',
          'ai_empty_response'
        );
      }

      return {
        text,
        provider: 'gemini',
        ...(collectedCards.length > 0 ? { cards: collectedCards } : {}),
      };
    } catch (err) {
      if (err instanceof AiProviderUpstreamError) throw err;
      throw mapGeminiError(err);
    }
  }
}
