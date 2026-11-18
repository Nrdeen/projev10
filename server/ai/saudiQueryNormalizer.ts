import { normalizeArabicSearchText } from '../../src/lib/listing-search';
import type { AiIntent, NormalizedSaudiQuery } from './types';

interface TermRule<T extends string> {
  value: T;
  label: string;
  terms: string[];
}

const BREED_RULES: TermRule<string>[] = [
  {
    value: 'brd_naimi',
    label: 'نعيمي',
    terms: ['نعيمي', 'نعيميه', 'نعيميات', 'نعيم', 'النعيمي', 'النعيم'],
  },
  {
    value: 'brd_najdi',
    label: 'نجدي',
    terms: ['نجدي', 'نجديه', 'نجديات', 'النجدي', 'النجديات'],
  },
  {
    value: 'brd_harri',
    label: 'حري',
    terms: ['حري', 'حريه', 'حريات', 'الحري', 'الحريات'],
  },
  {
    value: 'brd_ardhi',
    label: 'عارضي',
    terms: ['عارضي', 'عارضيه', 'عوارض', 'عارضيات', 'العارضي', 'العوارض'],
  },
  {
    value: 'brd_sawakni',
    label: 'سواكني',
    terms: ['سواكني', 'سواكن', 'السواكني'],
  },
];

const SUBCATEGORY_RULES: TermRule<string>[] = [
  {
    value: 'sub_slaughter',
    label: 'ذبائح',
    terms: [
      'ذبيحه',
      'ذبايح',
      'ذبائح',
      'طلي',
      'طليان',
      'جذع',
      'جذعان',
      'هرفي',
      'هرافي',
      'بهم',
      'وليمه',
      'عزيمه',
      'اضحيه',
      'اضاحي',
      'ثلاجه',
      'مناسبات',
    ],
  },
  {
    value: 'sub_breeding',
    label: 'تربية',
    terms: [
      'تربيه',
      'دفيع',
      'مضاريع',
      'متابيع',
      'رخال',
      'رخل',
      'حلوب',
      'جفره',
      'جفرتين',
      'جفرات',
      'انتاج',
      'مقاريب',
    ],
  },
  {
    value: 'sub_show',
    label: 'عرض/فحول',
    terms: ['فحل', 'فحول', 'صنف', 'ناهي', 'نسف', 'ابرص', 'مزاين'],
  },
];

const CATEGORY_RULES: TermRule<string>[] = [
  {
    value: 'cat_breeding',
    label: 'فحول الإنتاج',
    terms: ['فحل', 'فحول'],
  },
  {
    value: 'cat_goats',
    label: 'الماعز',
    terms: ['ماعز', 'معزا', 'تيس', 'تيوس', 'جفره', 'جفرات', 'جفرتين', 'عوارض', 'عارضي'],
  },
  {
    value: 'cat_sheep',
    label: 'الأغنام',
    terms: ['غنم', 'اغنام', 'ضان', 'ضأن', 'خروف', 'خرفان', 'طلي', 'طليان', 'جذعان', 'هرفي', 'بهم', 'نعيمي', 'نجدي', 'حري', 'سواكني'],
  },
];

const REGION_RULES: Array<{ regionId: string; city?: string; terms: string[] }> = [
  { regionId: 'reg_riyadh', city: 'المزاحمية', terms: ['المزاحميه', 'مزاحميه'] },
  { regionId: 'reg_riyadh', city: 'الخرج', terms: ['الخرج', 'خرج'] },
  { regionId: 'reg_riyadh', terms: ['الرياض', 'رياض', 'الدوادمي', 'المجمعه', 'رماح'] },
  { regionId: 'reg_makkah', city: 'الطائف', terms: ['الطايف', 'الطائف', 'طايف'] },
  { regionId: 'reg_makkah', terms: ['مكه', 'جده', 'الحجاز', 'رابغ'] },
  { regionId: 'reg_qassim', city: 'بريدة', terms: ['بريده'] },
  { regionId: 'reg_qassim', terms: ['القصيم', 'قصيم', 'عنيزه', 'الرس'] },
  { regionId: 'reg_eastern', city: 'الدمام', terms: ['الدمام', 'دمام'] },
  { regionId: 'reg_eastern', terms: ['الشرقيه', 'الخبر', 'الاحساء', 'الجبيل', 'حفر الباطن'] },
  { regionId: 'reg_madinah', terms: ['المدينه', 'مدينه', 'ينبع'] },
  { regionId: 'reg_asir', terms: ['عسير', 'ابها', 'خميس مشيط'] },
  { regionId: 'reg_hail', terms: ['حايل', 'حائل'] },
  { regionId: 'reg_tabuk', terms: ['تبوك'] },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsTerm(normalizedSentence: string, term: string): boolean {
  const normTerm = normalizeArabicSearchText(term);
  if (!normTerm) return false;
  const cleanedSentence = normalizedSentence.replace(/[؟?!.,،؛:()«»"']/g, ' ');
  const base = normTerm.startsWith('ال') ? normTerm.slice(2) : normTerm;
  const escapedFull = escapeRegex(normTerm);
  const escapedBase = escapeRegex(base);
  const re = new RegExp(
    `(?:^|\\s)(?:[بو]?(?:ال)?${escapedBase}|[بو]?${escapedFull})(?:$|\\s)`
  );
  return re.test(cleanedSentence);
}

function extractPriceBounds(normalizedText: string): {
  minPrice?: number;
  maxPrice?: number;
  detectedTerms: string[];
} {
  const detectedTerms: string[] = [];
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  const rangeMatch = normalizedText.match(
    /(?:من|بين)\s+(\d{2,6})\s+(?:الى|إلى|و|-)\s+(\d{2,6})/
  );
  if (rangeMatch) {
    const a = Number(rangeMatch[1]);
    const b = Number(rangeMatch[2]);
    if (Number.isFinite(a) && Number.isFinite(b) && a > 0 && b >= a) {
      minPrice = a;
      maxPrice = b;
      detectedTerms.push(`سعر ${a}-${b}`);
      return { minPrice, maxPrice, detectedTerms };
    }
  }

  const maxMatch = normalizedText.match(
    /(?:تحت|اقل من|بحدود|حول|ما يتعدى|لا يتعدى|لا يزيد عن|ميزانيتي|ميزانيه|سقف)\s+(\d{2,6})/
  );
  if (maxMatch) {
    const v = Number(maxMatch[1]);
    if (Number.isFinite(v) && v >= 100 && v <= 500_000) {
      maxPrice = v;
      detectedTerms.push(`سقف السعر ${v}`);
    }
  }

  const minMatch = normalizedText.match(/(?:فوق|اكثر من|يبدأ من|من)\s+(\d{3,6})/);
  if (minMatch && !maxMatch) {
    const v = Number(minMatch[1]);
    if (Number.isFinite(v) && v >= 100 && v <= 500_000) {
      minPrice = v;
      detectedTerms.push(`الحد الأدنى ${v}`);
    }
  }

  return { minPrice, maxPrice, detectedTerms };
}

export function normalizeSaudiQuery(rawQuery: string): NormalizedSaudiQuery {
  const normalizedText = normalizeArabicSearchText(rawQuery);
  const detectedDialectTerms: string[] = [];

  let breedId: string | undefined;
  for (const rule of BREED_RULES) {
    if (rule.terms.some((t) => containsTerm(normalizedText, t))) {
      breedId = rule.value;
      detectedDialectTerms.push(rule.label);
      break;
    }
  }

  let subCategoryId: string | undefined;
  for (const rule of SUBCATEGORY_RULES) {
    if (rule.terms.some((t) => containsTerm(normalizedText, t))) {
      subCategoryId = rule.value;
      detectedDialectTerms.push(rule.label);
      break;
    }
  }

  let categoryId: string | undefined;
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((t) => containsTerm(normalizedText, t))) {
      categoryId = rule.value;
      break;
    }
  }

  let regionId: string | undefined;
  let city: string | undefined;
  for (const rule of REGION_RULES) {
    if (rule.terms.some((t) => containsTerm(normalizedText, t))) {
      regionId = rule.regionId;
      if (rule.city) city = rule.city;
      detectedDialectTerms.push(rule.city || rule.terms[0]);
      break;
    }
  }

  const priceInfo = extractPriceBounds(normalizedText);
  detectedDialectTerms.push(...priceInfo.detectedTerms);

  let vaccinatedOnly: boolean | undefined;
  if (
    containsTerm(normalizedText, 'محصن') ||
    containsTerm(normalizedText, 'محصنه') ||
    containsTerm(normalizedText, 'مطعم') ||
    containsTerm(normalizedText, 'تحصين')
  ) {
    vaccinatedOnly = true;
    detectedDialectTerms.push('محصن');
  }

  let acceptsOffersOnly: boolean | undefined;
  if (
    containsTerm(normalizedText, 'سوم') ||
    containsTerm(normalizedText, 'عروض') ||
    containsTerm(normalizedText, 'يسام')
  ) {
    acceptsOffersOnly = true;
    detectedDialectTerms.push('يقبل السوم');
  }

  let negotiableOnly: boolean | undefined;
  if (
    containsTerm(normalizedText, 'تفاوض') ||
    containsTerm(normalizedText, 'سمح') ||
    containsTerm(normalizedText, 'قابل للتفاوض')
  ) {
    negotiableOnly = true;
  }

  let sort: NormalizedSaudiQuery['sort'];
  if (
    containsTerm(normalizedText, 'ارخص') ||
    containsTerm(normalizedText, 'الارخص') ||
    containsTerm(normalizedText, 'اقتصادي') ||
    containsTerm(normalizedText, 'رخيص')
  ) {
    sort = 'price_asc';
  } else if (containsTerm(normalizedText, 'اغلى') || containsTerm(normalizedText, 'الاغلى')) {
    sort = 'price_desc';
  } else if (containsTerm(normalizedText, 'الافضل') || containsTerm(normalizedText, 'مميز')) {
    sort = 'most_liked';
  }

  // Keep concise search keywords only when structured filters aren't sufficient on their own
  const keywordTokens: string[] = [];
  if (containsTerm(normalizedText, 'جذعان') || containsTerm(normalizedText, 'جذع')) {
    keywordTokens.push('جذعان');
  }
  if (containsTerm(normalizedText, 'هرفي') || containsTerm(normalizedText, 'هرافي')) {
    keywordTokens.push('هرفي');
  }
  if (containsTerm(normalizedText, 'فحل') || containsTerm(normalizedText, 'فحول')) {
    keywordTokens.push('فحل');
  }
  if (containsTerm(normalizedText, 'دفيع') || containsTerm(normalizedText, 'مضاريع')) {
    keywordTokens.push('دفيع');
  }
  if (containsTerm(normalizedText, 'بهم')) {
    keywordTokens.push('بهم');
  }

  return {
    rawQuery,
    normalizedText,
    searchKeywords: keywordTokens.join(' ').trim(),
    breedId,
    categoryId,
    subCategoryId,
    regionId,
    city,
    minPrice: priceInfo.minPrice,
    maxPrice: priceInfo.maxPrice,
    vaccinatedOnly,
    negotiableOnly,
    acceptsOffersOnly,
    sort,
    detectedDialectTerms,
  };
}

export function classifyAiIntent(rawQuery: string, normalized: NormalizedSaudiQuery): AiIntent {
  const norm = normalized.normalizedText;

  // Greetings only
  if (
    /^(?:السلام عليكم|اهلا|مرحبا|هلا|حياك|صباح الخير|مساء الخير|كيف حالك|وش اخبارك|سلام)(?:\s+.*)?$/u.test(
      norm
    ) &&
    norm.split(' ').length <= 5 &&
    !normalized.breedId &&
    !normalized.regionId &&
    !normalized.subCategoryId &&
    !normalized.maxPrice
  ) {
    return 'greeting';
  }

  // Help / how-to questions about using SouqAlGhanam 2.0
  if (
    /(?:كيف\s+(?:اضيف|انشر|اسجل|اوثق|اتواصل|اسوم|اقدم|احذف|ادخل)|وشلون\s+(?:اضيف|اسوم|اوثق)|طريقه\s+(?:التسجيل|النشر|التوثيق|السوم|الدفع)|هل\s+يوجد\s+دفع|الدفع\s+الالكتروني|العموله|توثيق\s+(?:المربي|الحساب)|لوحه\s+التحكم|شروط\s+الاستخدام|استرجاع\s+الرقم)/u.test(
      norm
    )
  ) {
    return 'marketplace_help';
  }

  // Asking specifically about indicative prices / breed comparison (without city/budget listing search)
  if (
    /(?:كم\s+(?:اسعار|سعر)|متوسط\s+سعر|دليل\s+(?:السلالات|الاسعار)|الاسعار\s+الاسترشاديه|وش\s+الفرق\s+بين|ايهما\s+افضل|افضل\s+سلاله)/u.test(
      norm
    ) &&
    !normalized.regionId &&
    !normalized.maxPrice &&
    !/ابي|ابغى|اريد|بغيت|توصي|اعرض\s+لي|ورني|ابحث/u.test(norm)
  ) {
    return 'breed_prices';
  }

  // Explicit listing search signals
  if (
    normalized.breedId ||
    normalized.regionId ||
    normalized.subCategoryId ||
    normalized.categoryId ||
    normalized.maxPrice !== undefined ||
    normalized.minPrice !== undefined ||
    normalized.vaccinatedOnly ||
    normalized.acceptsOffersOnly ||
    /(?:ابي|ابغى|اريد|بغيت|ابحث|دور\s+لي|اعرض|ورني|فيه\s+(?:غنم|نعيمي|نجدي|حري|عارضي|سواكني|حلال)|اعلانات|عروض\s+حلال)/u.test(
      norm
    )
  ) {
    return 'marketplace_search';
  }

  return 'general_livestock';
}
