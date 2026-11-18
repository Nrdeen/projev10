import { useState } from 'react';
import { Mail } from 'lucide-react';
import type { Breed, User } from '../types/marketplace';
import { getRoleAwareFooterAccountLinks } from '../lib/marketplace-helpers';
import type { AuthMode, DashboardTab, PageView } from '../lib/router';

interface FooterProps {
  currentUser: User | null;
  breeds?: Breed[];
  onNavigate: (
    page: PageView,
    options?: {
      authMode?: AuthMode;
      dashboardTab?: DashboardTab;
      listingFilters?: { breedId?: string };
    }
  ) => void;
}

export function Footer({ currentUser, breeds = [], onNavigate }: FooterProps) {
  const accountLinks = getRoleAwareFooterAccountLinks(currentUser?.role ?? null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newsletterEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setNewsletterError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    setNewsletterError('');
    setSubscribedEmail(trimmed);
    setNewsletterEmail('');
  };

  return (
    <div className="mt-16">
      {/* Saudi Cultural Heritage Horizon: Softly Faded Palm Oasis & Desert Dunes + Non-Wavy Najdi Architectural Crown */}
      <div
        aria-hidden="true"
        className="relative h-28 sm:h-36 overflow-hidden bg-gradient-to-b from-[var(--color-canvas)] via-[#f4eedc] to-[#eae0c4] dark:from-[var(--color-canvas)] dark:via-[#0d1c16] dark:to-[#081510]"
      >
        {/* Subtle Soft Sunlit Glow in Center Horizon */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_75%_at_50%_75%,rgba(255,250,235,0.85),transparent)] dark:bg-[radial-gradient(ellipse_65%_75%_at_50%_75%,rgba(20,92,66,0.22),transparent)]" />

        {/* Left Side: Saudi Date Palms & Desert Dunes (fades gently toward center) */}
        <svg
          viewBox="0 0 420 150"
          preserveAspectRatio="xMinYMax meet"
          className="pointer-events-none absolute left-0 bottom-2 w-[48%] max-w-[440px] h-full opacity-75 dark:opacity-45"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 96%)',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 96%)',
          }}
        >
          {/* Distant Sand Dunes */}
          <path d="M0 150V96C64 76 142 74 225 98C296 118 355 128 420 150Z" fill="#cbb98f" fillOpacity="0.45" />
          <path d="M0 150V114C78 96 168 106 270 132L350 150Z" fill="#899e82" fillOpacity="0.38" />
          {/* Tall Saudi Date Palm 1 */}
          <g fill="#2e5942" fillOpacity="0.72">
            <path d="M56 150Q64 96 74 52L81 54Q72 98 66 150Z" />
            <path d="M77 52C52 38 24 44 8 60C28 52 52 50 74 56Z" />
            <path d="M77 50C54 24 26 20 8 30C30 28 54 34 74 52Z" />
            <path d="M78 49C68 20 50 8 32 10C52 16 66 30 75 50Z" />
            <path d="M79 49C94 20 116 12 134 20C114 22 96 32 82 52Z" />
            <path d="M80 51C106 34 134 38 152 54C130 46 104 46 82 55Z" />
            <path d="M78 55C96 58 114 70 124 86C108 72 94 64 80 58Z" />
            <path d="M75 55C54 60 36 74 26 92C42 76 58 65 74 59Z" />
          </g>
          {/* Secondary Palm 2 */}
          <g fill="#426b53" fillOpacity="0.58">
            <path d="M134 150Q138 116 144 88L149 89Q144 118 141 150Z" />
            <path d="M146 88C128 76 108 80 96 92C112 86 128 86 144 91Z" />
            <path d="M146 87C134 68 116 64 102 72C118 72 132 76 144 88Z" />
            <path d="M147 87C162 68 180 66 192 76C176 76 162 80 150 89Z" />
            <path d="M148 89C168 80 188 84 198 96C182 90 164 88 150 92Z" />
          </g>
        </svg>

        {/* Right Side: Saudi Date Palms, Desert Dunes & Subtle Najdi Mudbrick Watchtower (fades gently toward center) */}
        <svg
          viewBox="0 0 420 150"
          preserveAspectRatio="xMaxYMax meet"
          className="pointer-events-none absolute right-0 bottom-2 w-[48%] max-w-[440px] h-full opacity-75 dark:opacity-45"
          style={{
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 96%)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 42%, rgba(0,0,0,0) 96%)',
          }}
        >
          {/* Distant Sand Dunes */}
          <path d="M420 150V94C352 72 270 76 184 102C116 122 58 134 0 150Z" fill="#cbb98f" fillOpacity="0.45" />
          <path d="M420 150V116C340 98 250 110 154 134L84 150Z" fill="#899e82" fillOpacity="0.38" />
          {/* Traditional Najdi Mudbrick Silhouette */}
          <g fill="#7c6c4d" fillOpacity="0.36">
            <path d="M276 150V108L282 100L288 108L294 100L300 108L306 100L312 108V150Z" />
            <rect x="288" y="122" width="4" height="8" rx="1" fill="#f4eedc" fillOpacity="0.65" />
            <rect x="298" y="122" width="4" height="8" rx="1" fill="#f4eedc" fillOpacity="0.65" />
          </g>
          {/* Tall Saudi Date Palm 1 */}
          <g fill="#2e5942" fillOpacity="0.72">
            <path d="M364 150Q356 96 346 52L339 54Q348 98 354 150Z" />
            <path d="M343 52C368 38 396 44 412 60C392 52 368 50 346 56Z" />
            <path d="M343 50C366 24 394 20 412 30C390 28 366 34 346 52Z" />
            <path d="M342 49C352 20 370 8 388 10C368 16 354 30 345 50Z" />
            <path d="M341 49C326 20 304 12 286 20C306 22 324 32 338 52Z" />
            <path d="M340 51C314 34 286 38 268 54C290 46 316 46 338 55Z" />
            <path d="M342 55C324 58 306 70 296 86C312 72 326 64 340 58Z" />
            <path d="M345 55C366 60 384 74 394 92C378 76 362 65 346 59Z" />
          </g>
          {/* Secondary Palm 2 */}
          <g fill="#426b53" fillOpacity="0.58">
            <path d="M250 150Q246 118 240 92L235 93Q240 120 243 150Z" />
            <path d="M238 92C256 80 276 84 288 96C272 90 256 90 240 95Z" />
            <path d="M238 91C250 72 268 68 282 76C266 76 252 80 240 92Z" />
            <path d="M237 91C222 72 204 70 192 80C208 80 222 84 234 93Z" />
            <path d="M236 93C216 84 196 88 186 100C202 94 220 92 234 96Z" />
          </g>
        </svg>

        {/* Crisp Non-Wavy Najdi / Sadu Architectural Crown Transition into Footer */}
        <div className="absolute inset-x-0 bottom-0">
          {/* Traditional Saudi Najdi Stepped Crenellations (Shurfat) */}
          <svg
            viewBox="0 0 1200 22"
            preserveAspectRatio="none"
            className="w-full h-4 sm:h-[22px] block"
          >
            <defs>
              <pattern id="najdi-shurfat" width="40" height="22" patternUnits="userSpaceOnUse">
                <path d="M0 22L10 10L20 22L30 10L40 22Z" fill="#145C42" fillOpacity="0.72" />
                <path d="M5 22L10 15L15 22M25 22L30 15L35 22" fill="var(--color-footer)" />
                <polygon points="20,4 23,8 20,12 17,8" fill="#D79A3D" fillOpacity="0.85" />
              </pattern>
            </defs>
            <rect width="1200" height="22" fill="url(#najdi-shurfat)" />
            <rect y="19" width="1200" height="3" fill="var(--color-footer)" />
          </svg>
          {/* Thin Saudi Gold Sadu Accent Line */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#D79A3D]/45 via-[#D79A3D] to-[#D79A3D]/45" />
        </div>
      </div>

      <footer className="relative bg-[var(--color-footer)] text-[#FAF6EC] transition-colors overflow-hidden">
        {/* Saudi Cultural Heritage Watermark: Najdi Al-Sadu Geometric Weave + Palm & Diriyah Archway (No Stars) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 w-full h-full text-white/[0.045]"
        >
          <defs>
            <pattern id="saudi-sadu-band" width="48" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M0 12L12 2L24 12L36 2L48 12L36 22L24 12L12 22Z"
                fill="none"
                stroke="#D79A3D"
                strokeOpacity="0.16"
                strokeWidth="1"
              />
              <path d="M12 7L17 12L12 17L7 12Z" fill="#D79A3D" fillOpacity="0.09" />
              <path d="M36 7L41 12L36 17L31 12Z" fill="currentColor" />
            </pattern>
          </defs>
          {/* Subtle Sadu Heritage Band across Upper Edge */}
          <rect x="0" y="6" width="1200" height="24" fill="url(#saudi-sadu-band)" />
          {/* Saudi Date Palm & Najdi Archway Cultural Silhouette on Left Background */}
          <g transform="translate(36 84)" fill="none" stroke="currentColor" strokeWidth="1.6">
            {/* Najdi Archway */}
            <path d="M16 210V92C16 48 52 22 86 22C120 22 156 48 156 92V210" stroke="#D79A3D" strokeOpacity="0.16" />
            <path d="M34 210V100C34 66 58 44 86 44C114 44 138 66 138 100V210" />
            {/* Stepped Najdi Triangles on Arch Top */}
            <path d="M24 22L36 8L48 22L60 8L72 22L86 6L100 22L112 8L124 22L136 8L148 22" stroke="#D79A3D" strokeOpacity="0.16" />
            {/* Stylized Saudi Date Palm inside Arch */}
            <path d="M86 210V108" strokeWidth="2.4" />
            <path d="M86 112C64 98 44 102 32 116" />
            <path d="M86 108C66 84 46 82 32 92" />
            <path d="M86 106C76 80 64 70 50 70" />
            <path d="M86 106C96 80 108 70 122 70" />
            <path d="M86 108C106 84 126 82 140 92" />
            <path d="M86 112C108 98 128 102 140 116" />
          </g>
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-white/10">
            {/* Brand Column + Social Media Links */}
            <div className="sm:col-span-2 lg:col-span-5 space-y-4">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="inline-flex items-center gap-2.5 text-white font-display text-xl font-extrabold cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <rect width="32" height="32" rx="8" fill="#145C42" />
                  <rect
                    x="0.75"
                    y="0.75"
                    width="30.5"
                    height="30.5"
                    rx="7.25"
                    stroke="#D79A3D"
                    strokeOpacity="0.6"
                    strokeWidth="1.25"
                  />
                  <path
                    d="M9.5 18.5C9.5 14.5 12.4 11.5 16 11.5C19.6 11.5 22.5 14.5 22.5 18.5C22.5 21 20.6 22.5 18.5 22.5H13.5C11.4 22.5 9.5 21 9.5 18.5Z"
                    stroke="#FAF6EC"
                    strokeWidth="1.75"
                  />
                  <path
                    d="M11.5 12.5C9.2 11.2 8 12.6 8.5 14.8M20.5 12.5C22.8 11.2 24 12.6 23.5 14.8"
                    stroke="#D79A3D"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
                <span>سوق الغنم</span>
              </button>
              <p className="text-sm text-[#FAF6EC]/80 max-w-md leading-relaxed">
                منصة سعودية متخصصة لإعلانات المواشي، تجمع المربين والبائعين والمشترين في بيئة منظمة بمواصفات واضحة للعمر والوزن والتحصين والأسعار الاسترشادية بالريال السعودي.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2.5 pt-1" aria-label="حسابات المنصة الاجتماعية">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="يوتيوب"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/5 hover:bg-white/15 hover:border-[#D79A3D] grid place-items-center text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="6" width="18" height="12" rx="4" />
                    <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تيك توك"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/5 hover:bg-white/15 hover:border-[#D79A3D] grid place-items-center text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.5 2 4 4.5 4.2" />
                  </svg>
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إكس"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/5 hover:bg-white/15 hover:border-[#D79A3D] grid place-items-center text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4l14 16M19 4 5 20" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="إنستغرام"
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/25 bg-white/5 hover:bg-white/15 hover:border-[#D79A3D] grid place-items-center text-white/90 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="5" />
                    <circle cx="12" cy="12" r="3.8" />
                    <circle cx="17" cy="7" r="0.6" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Marketplace Sections (including Pricing & Packages) */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-bold text-[var(--color-gold)] mb-3.5">أقسام المنصة</h2>
              <ul className="space-y-2 text-sm text-[#FAF6EC]/85">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('listings')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    جميع الإعلانات
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('breeds')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    دليل السلالات والأسعار
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('breeders')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    دليل المربين
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('pricing')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-[var(--color-gold)] transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    الباقات والأسعار
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('add')}
                    className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    أضف إعلانك
                  </button>
                </li>
              </ul>
            </div>

            {/* Breeds Directory Quick Links */}
            <div className="lg:col-span-2">
              <h2 className="text-sm font-bold text-[var(--color-gold)] mb-3.5">السلالات الشائعة</h2>
              <ul className="space-y-2 text-sm text-[#FAF6EC]/85">
                {(breeds.length > 0
                  ? breeds.slice(0, 5)
                  : [
                      { id: 'brd_naimi', name: 'نعيمي' },
                      { id: 'brd_najdi', name: 'نجدي' },
                      { id: 'brd_harri', name: 'حري' },
                      { id: 'brd_ardhi', name: 'عارضي' },
                      { id: 'brd_sawakni', name: 'سواكني' },
                    ]
                ).map((breed) => (
                  <li key={breed.id}>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate('listings', { listingFilters: { breedId: breed.id } })
                      }
                      className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      إعلانات {breed.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Role-Aware Account Links */}
            <div className="lg:col-span-3">
              <h2 className="text-sm font-bold text-[var(--color-gold)] mb-3.5">
                {currentUser ? 'الحساب والخدمات' : 'حسابك في السوق'}
              </h2>
              <ul className="space-y-2 text-sm text-[#FAF6EC]/85">
                {accountLinks.map((link) => (
                  <li key={link.key}>
                    <button
                      type="button"
                      onClick={() =>
                        onNavigate(link.page, {
                          authMode: link.authMode,
                          dashboardTab: link.dashboardTab,
                        })
                      }
                      className="min-h-[44px] sm:min-h-[32px] inline-flex items-center py-1 hover:text-white transition-colors cursor-pointer text-right rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription Strip */}
          <div className="py-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white">
                النشرة البريدية وتنبيهات السوق
              </h3>
              <p className="mt-0.5 text-xs text-[#FAF6EC]/75">
                اشترك ليصلك تحديث الأسعار الاسترشادية وأبرز عروض المربين المعتمدين
              </p>
            </div>

            {subscribedEmail ? (
              <p
                role="status"
                className="text-sm font-bold text-[#D79A3D] bg-white/10 border border-[#D79A3D]/40 rounded-full px-5 py-2.5"
              >
                تم الاشتراك بنجاح ({subscribedEmail})، شكراً لك.
              </p>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-2.5 h-11 rounded-full border border-white/30 bg-white/5 px-4 focus-within:border-[#D79A3D]">
                    <Mail size={17} className="text-white/80 shrink-0" aria-hidden="true" />
                    <span className="sr-only">البريد الإلكتروني للاشتراك في النشرة</span>
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (newsletterError) setNewsletterError('');
                      }}
                      placeholder="أدخل بريدك الإلكتروني..."
                      autoComplete="email"
                      className="w-full sm:w-64 bg-transparent border-0 outline-none text-sm text-white placeholder:text-white/65"
                    />
                  </label>
                  {newsletterError && (
                    <span className="text-xs text-[#f4c569] pr-3">{newsletterError}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="h-11 px-7 rounded-full bg-gradient-to-b from-[#e0a64c] to-[#c98f33] hover:brightness-105 text-white font-bold text-sm whitespace-nowrap cursor-pointer transition-all shrink-0"
                >
                  اشترك الآن
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FAF6EC]/70 text-center sm:text-right">
            <p>© 2026 سوق الغنم — المملكة العربية السعودية. جميع الأسعار بالريال السعودي.</p>
            <p>تواصل مباشر بين المربين والمشترين · إعلانات خاضعة لمراجعة الإدارة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
