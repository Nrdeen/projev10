import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { formatPriceSar } from '../lib/format';
import type { AiChatHistoryItem, AiListingCard, AiUsageSnapshot } from '../types/marketplace';
import { SafeImage } from './SafeImage';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  cards?: AiListingCard[];
  suggestedFollowUps?: string[];
  isError?: boolean;
  retryPrompt?: string;
}

interface AiAssistantWidgetProps {
  onSelectListing: (listingId: string) => void;
  userId?: string | null;
  offsetForBottomBar?: boolean | 'nav' | 'detail';
}

const STARTER_PROMPTS = [
  'أبي نعيمي بالرياض',
  'كم أسعار الحري والنجدي؟',
  'عوارض دفيع بالطايف',
  'كيف أقدم سوم؟',
] as const;

/**
 * Simple, crisp gold AI emblem:
 * Geometric 4-point AI star with a subtle secondary spark, fitting the Saudi emerald aesthetic.
 */
function SaudiMinimalAiMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M11.5 3C12.35 7.95 15.05 10.65 20 11.5C15.05 12.35 12.35 15.05 11.5 20C10.65 15.05 7.95 12.35 3 11.5C7.95 10.65 10.65 7.95 11.5 3Z"
        fill="currentColor"
      />
      <path
        d="M18.5 15.5C18.85 17.2 19.8 18.15 21.5 18.5C19.8 18.85 18.85 19.8 18.5 21.5C18.15 19.8 17.2 18.85 15.5 18.5C17.2 18.15 18.15 17.2 18.5 15.5Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  );
}

export function AiAssistantWidget({
  onSelectListing,
  userId,
  offsetForBottomBar = false,
}: AiAssistantWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [maxMessageLength, setMaxMessageLength] = useState(600);
  const [usage, setUsage] = useState<AiUsageSnapshot | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [mobileViewportHeight, setMobileViewportHeight] = useState<number | null>(null);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const launcherRef = useRef<HTMLButtonElement | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const status = await api.getAiStatus();
      setEnabled(status.enabled);
      setMaxMessageLength(status.maxMessageLength || 600);
      setUsage(status.usage);
    } catch {
      // Keep default widget readiness if status check fails transiently
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void fetchStatus();
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [open, userId, fetchStatus]);

  useEffect(() => {
    if (!open || messages.length === 0) return;
    listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open, sending]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Lock page scroll on mobile while full-viewport AI workspace is open
  useEffect(() => {
    if (!open || window.innerWidth >= 640) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Sync height with mobile soft keyboard viewport
  useEffect(() => {
    if (!open || window.innerWidth >= 640 || !window.visualViewport) {
      setMobileViewportHeight(null);
      return;
    }
    const vv = window.visualViewport;
    const syncHeight = () => {
      setMobileViewportHeight(vv.height);
    };
    syncHeight();
    vv.addEventListener('resize', syncHeight);
    return () => {
      vv.removeEventListener('resize', syncHeight);
      setMobileViewportHeight(null);
    };
  }, [open]);

  // Auto-resize composer cleanly up to ~3 lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 88)}px`;
  }, [input, open]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessageItem = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const history: AiChatHistoryItem[] = messages
      .filter((m) => !m.isError)
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await api.sendAiChat({ message: trimmed, history });
      setUsage(res.usage);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          cards: res.cards,
          suggestedFollowUps: res.suggestedFollowUps,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: err?.message || 'تعذر الحصول على رد الآن، يرجى المحاولة بعد لحظات.',
          isError: true,
          retryPrompt: trimmed,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  const handleCardClick = (listingId: string) => {
    onSelectListing(listingId);
    if (window.innerWidth < 640) {
      setOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  };

  if (!enabled) return null;

  const showCharCounter = input.length >= Math.floor(maxMessageLength * 0.7);

  return (
    <>
      {/* Minimalist 50px Circular AI Launcher — Zero Text, Bottom-Left */}
      {!open && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="مساعد السوق الذكي"
          title="مساعد السوق الذكي"
          data-testid="ai-assistant-launcher"
          className={`ai-launcher-enter fixed left-4 sm:left-6 z-30 w-[50px] h-[50px] rounded-full p-0 bg-[#0B3A29] hover:bg-[#0F4934] text-[#D6AC58] border border-[#D6AC58]/25 flex items-center justify-center shadow-[0_6px_18px_-4px_rgba(7,34,24,0.35)] transition-transform duration-150 hover:scale-[1.04] active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#D6AC58] ${
            offsetForBottomBar === 'detail'
              ? 'bottom-[calc(4.85rem+env(safe-area-inset-bottom))] lg:bottom-6'
              : offsetForBottomBar
              ? 'bottom-[calc(4.85rem+env(safe-area-inset-bottom))] md:bottom-6'
              : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))] sm:bottom-6'
          }`}
        >
          <SaudiMinimalAiMark className="w-[22px] h-[22px]" />
        </button>
      )}

      {/* Modern Compact AI Workspace (330px × 440px Desktop, Responsive Sheet Mobile) */}
      {open && (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="مساعد السوق"
          data-testid="ai-assistant-dialog"
          dir="rtl"
          style={mobileViewportHeight ? { height: `${mobileViewportHeight}px` } : undefined}
          className="ai-panel-enter fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-50 w-full sm:w-[330px] h-[100dvh] sm:h-[440px] sm:max-h-[calc(100dvh-2.5rem)] flex flex-col bg-[#FAF8F4] dark:bg-[#0E1914] text-[#14261D] dark:text-[#EDF3EF] rounded-none sm:rounded-[20px] sm:border sm:border-[#E5DFD2] dark:sm:border-[#23372E] sm:shadow-[0_20px_50px_-14px_rgba(11,58,41,0.22)] overflow-hidden"
        >
          {/* Compact Editorial Header */}
          <header className="shrink-0 bg-[#FAF8F4] dark:bg-[#0E1914] px-3.5 pt-[max(0.65rem,env(safe-area-inset-top))] pb-2.5 sm:py-2.5 border-b border-[#EAE4D7] dark:border-[#1E3129] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-full bg-[#0B3A29] text-[#D6AC58] flex items-center justify-center shrink-0">
                <SaudiMinimalAiMark className="w-4 h-4" />
              </span>
              <h2 className="font-display text-[14px] font-bold text-[#0B3A29] dark:text-[#F4EFE4] leading-none truncate">
                مساعد السوق
              </h2>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={handleResetChat}
                disabled={sending && messages.length === 0}
                aria-label="إعادة بدء المحادثة"
                title="محادثة جديدة"
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#5A6C63] dark:text-[#98ABA1] hover:text-[#0B3A29] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#192B23] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B3A29] dark:focus-visible:outline-[#D6AC58]"
              >
                <RotateCcw size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcherRef.current?.focus();
                }}
                aria-label="إغلاق مساعد السوق"
                title="إغلاق"
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[#5A6C63] dark:text-[#98ABA1] hover:text-[#0B3A29] dark:hover:text-white hover:bg-[#EFECE3] dark:hover:bg-[#192B23] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B3A29] dark:focus-visible:outline-[#D6AC58]"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Conversation Canvas */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-3.5 flex flex-col"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <div className="mt-auto space-y-4 pb-1">
                <div className="space-y-1">
                  <h3 className="font-display text-[17px] font-extrabold text-[#0B3A29] dark:text-white leading-snug text-balance">
                    كيف أقدر أخدمك اليوم؟
                  </h3>
                  <p className="text-xs text-[#5A6C63] dark:text-[#9CB0A5] leading-relaxed">
                    ابحث في عروض الحلال المباشرة أو استفسر عن الأسعار والسلالات.
                  </p>
                </div>

                {/* Minimal Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="اقتراحات سريعة">
                  {STARTER_PROMPTS.map((promptText) => (
                    <button
                      key={promptText}
                      type="button"
                      disabled={sending}
                      onClick={() => void sendMessage(promptText)}
                      className="min-h-[36px] sm:min-h-[32px] px-3 py-1.5 rounded-lg border border-[#E2DCCB] dark:border-[#24382F] bg-white dark:bg-[#14231C] hover:border-[#0B3A29]/50 dark:hover:border-[#D6AC58]/70 hover:bg-[#F5F1E8] dark:hover:bg-[#1A2D24] text-xs font-medium text-[#14261D] dark:text-[#EDF3EF] transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`ai-msg-enter flex flex-col gap-2 ${
                      msg.role === 'user' ? 'items-start' : 'items-end'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <div className="max-w-[84%] rounded-2xl rounded-tr-xs bg-[#0B3A29] text-[#FAF8F4] px-3.5 py-2 text-[13px] leading-[1.65] whitespace-pre-line break-words [overflow-wrap:anywhere]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-end gap-2">
                        <div className="w-full flex items-start justify-end gap-2">
                          <div
                            className={`max-w-[90%] rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-[13px] leading-[1.7] whitespace-pre-line break-words [overflow-wrap:anywhere] ${
                              msg.isError
                                ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 border border-red-200 dark:border-red-800/70'
                                : 'bg-white dark:bg-[#14231C] text-[#14261D] dark:text-[#EDF3EF] border border-[#EAE4D7] dark:border-[#22352C]'
                            }`}
                          >
                            <p>{msg.content}</p>
                            {msg.isError && msg.retryPrompt && (
                              <button
                                type="button"
                                disabled={sending}
                                onClick={() => void sendMessage(msg.retryPrompt!)}
                                className="mt-2 min-h-[34px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A2D24] border border-red-200 dark:border-red-800 text-xs font-semibold text-red-800 dark:text-red-200 hover:bg-red-100/70 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <RotateCcw size={12} aria-hidden="true" />
                                <span>إعادة المحاولة</span>
                              </button>
                            )}
                          </div>
                          <span
                            aria-hidden="true"
                            className="w-6 h-6 rounded-full bg-[#0B3A29] text-[#D6AC58] flex items-center justify-center shrink-0 mt-0.5"
                          >
                            <SaudiMinimalAiMark className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        {/* Compact Real Marketplace Listing Cards */}
                        {msg.cards && msg.cards.length > 0 && (
                          <div className="w-full space-y-1.5 pl-0 pr-0" data-testid="ai-listing-cards">
                            {msg.cards.map((card) => {
                              const metaParts = [card.categoryName, card.breedName, card.city]
                                .filter(Boolean)
                                .join(' · ');
                              return (
                                <button
                                  key={card.id}
                                  type="button"
                                  onClick={() => handleCardClick(card.id)}
                                  data-testid={`ai-listing-card-${card.id}`}
                                  className="group w-full text-right bg-white dark:bg-[#14231C] border border-[#EAE4D7] dark:border-[#22352C] hover:border-[#C89B3C] rounded-xl p-2 flex items-center gap-2.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B3A29] dark:focus-visible:outline-[#D6AC58]"
                                >
                                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F3EFE6] dark:bg-[#1A2D24] shrink-0">
                                    {card.imageUrl ? (
                                      <SafeImage
                                        src={card.imageUrl}
                                        alt={card.title}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[#5A6C63] dark:text-[#98ABA1]">
                                        <SaudiMinimalAiMark className="w-5 h-5 opacity-60" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0 space-y-0.5">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <span className="font-display text-xs font-bold text-[#14261D] dark:text-white truncate">
                                        {card.title}
                                      </span>
                                      {card.sellerVerified && (
                                        <ShieldCheck
                                          size={12}
                                          className="text-[#0B3A29] dark:text-[#5ED1A1] shrink-0"
                                          aria-label="مربي موثق"
                                        />
                                      )}
                                    </div>

                                    {metaParts && (
                                      <p className="text-[11px] text-[#5A6C63] dark:text-[#9CB0A5] truncate">
                                        {metaParts}
                                      </p>
                                    )}

                                    <div className="flex items-center justify-between gap-2 pt-0.5">
                                      <span className="font-display text-xs font-extrabold text-[#0B3A29] dark:text-[#5ED1A1] tabular-nums">
                                        {formatPriceSar(card.priceAmount)}
                                      </span>
                                      <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-[#9E731D] dark:text-[#D6AC58] group-hover:underline whitespace-nowrap shrink-0">
                                        <span>عرض</span>
                                        <ArrowLeft size={11} aria-hidden="true" />
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Minimal Follow-up Chips */}
                        {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                          <div className="w-full flex flex-wrap gap-1.5 pt-0.5">
                            {msg.suggestedFollowUps.map((promptText) => (
                              <button
                                key={promptText}
                                type="button"
                                disabled={sending}
                                onClick={() => void sendMessage(promptText)}
                                className="min-h-[32px] text-[11.5px] font-medium px-2.5 py-1 rounded-lg border border-[#E2DCCB] dark:border-[#24382F] bg-white dark:bg-[#14231C] hover:border-[#C89B3C] text-[#14261D] dark:text-[#EDF3EF] transition-colors cursor-pointer disabled:opacity-50 text-right"
                              >
                                {promptText}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="ai-msg-enter w-full flex items-center justify-end gap-2">
                    <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-[#14231C] border border-[#EAE4D7] dark:border-[#22352C] px-3 py-2 text-xs text-[#5A6C63] dark:text-[#9CB0A5] inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1" aria-hidden="true">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B3A29] dark:bg-[#D6AC58] animate-bounce [animation-delay:-0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B3A29] dark:bg-[#D6AC58] animate-bounce [animation-delay:-0.1s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6AC58] animate-bounce" />
                      </span>
                      <span>جاري البحث...</span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-6 h-6 rounded-full bg-[#0B3A29] text-[#D6AC58] flex items-center justify-center shrink-0"
                    >
                      <SaudiMinimalAiMark className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                <div ref={listEndRef} />
              </div>
            )}
          </div>

          {/* Clean Modern AI Composer */}
          <form
            onSubmit={handleSubmit}
            className="shrink-0 bg-[#FAF8F4] dark:bg-[#0E1914] border-t border-[#EAE4D7] dark:border-[#1E3129] px-3 pt-2 pb-[max(0.65rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-end gap-1.5 rounded-xl border border-[#DFD8C8] dark:border-[#253A30] bg-white dark:bg-[#14231C] p-1 transition-colors focus-within:border-[#0B3A29] dark:focus-within:border-[#D6AC58]">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={maxMessageLength}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="اكتب سؤالك أو نوع الحلال..."
                aria-label="رسالة مساعد السوق"
                data-testid="ai-assistant-input"
                className="flex-1 min-w-0 max-h-[88px] resize-none bg-transparent px-2.5 py-1.5 text-[13px] text-[#14261D] dark:text-white placeholder:text-[#73847B] dark:placeholder:text-[#8DA196] focus:outline-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="إرسال الرسالة"
                data-testid="ai-assistant-send"
                className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg bg-[#0B3A29] hover:bg-[#0F4934] text-[#D6AC58] disabled:bg-[#EDE8DC] disabled:text-[#9CA7A0] dark:disabled:bg-[#1C2E26] dark:disabled:text-[#5B7065] flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#D6AC58]"
              >
                <ArrowUp size={16} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>

            {(usage || showCharCounter) && (
              <div className="mt-1 px-0.5 flex items-center justify-between gap-2 text-[10.5px] text-[#6B7C73] dark:text-[#8DA196]">
                <span className="truncate tabular-nums">
                  {usage ? `المتبقي اليوم: ${usage.remainingToday} من ${usage.dailyLimit}` : ''}
                </span>
                {showCharCounter && (
                  <span className="tabular-nums shrink-0">
                    {input.length}/{maxMessageLength}
                  </span>
                )}
              </div>
            )}
          </form>
        </section>
      )}
    </>
  );
}
