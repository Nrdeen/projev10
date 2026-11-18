import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Search, ShieldCheck, Sprout, Users } from 'lucide-react';
import type { Breed, Category, Region } from '../types/marketplace';
import { SafeImage } from './SafeImage';

export interface QuickFilterValues {
  q: string;
  categoryId: string;
  breedId: string;
  regionId: string;
  maxPrice: string;
}

interface HeroSearchProps {
  categories: Category[];
  breeds: Breed[];
  regions: Region[];
  onSearch: (filters: QuickFilterValues) => void;
  onBrowseAll: () => void;
  onAddListing?: () => void;
}

const HERO_MAX_PRICE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'بدون حد' },
  { value: '1500', label: 'حتى 1,500 ر.س' },
  { value: '3000', label: 'حتى 3,000 ر.س' },
  { value: '5000', label: 'حتى 5,000 ر.س' },
  { value: '10000', label: 'حتى 10,000 ر.س' },
  { value: '25000', label: 'حتى 25,000 ر.س' },
  { value: '50000', label: 'حتى 50,000 ر.س' },
  { value: '100000', label: 'حتى 100,000 ر.س' },
];

export function HeroSearch({
  categories,
  breeds,
  regions,
  onSearch,
  onBrowseAll,
  onAddListing,
}: HeroSearchProps) {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [breedId, setBreedId] = useState('all');
  const [regionId, setRegionId] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  const mainCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  const availableBreeds = useMemo(() => {
    if (categoryId === 'all') return breeds;
    return breeds.filter((b) => b.categoryId === categoryId);
  }, [breeds, categoryId]);

  const handleCategoryChange = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    if (nextCategoryId !== 'all' && breedId !== 'all') {
      const stillMatches = breeds.some(
        (b) => b.id === breedId && b.categoryId === nextCategoryId
      );
      if (!stillMatches) {
        setBreedId('all');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ q: q.trim(), categoryId, breedId, regionId, maxPrice });
  };

  const handleQuickBreed = (targetBreedId: string) => {
    onSearch({
      q: '',
      categoryId: 'all',
      breedId: targetBreedId,
      regionId: 'all',
      maxPrice: '',
    });
  };

  return (
    <div className="bg-[var(--color-canvas)] transition-colors">
      {/* Scenic Pastoral Hero Banner — subtle Saudi green tint & compact right-edge copy so shepherd, oasis, cliffs, and sheep shine */}
      <section className="relative overflow-hidden bg-[#0B3A29] min-h-[260px] sm:min-h-[450px] lg:min-h-[510px] flex items-center">
        {/* Background Pastoral Imagery at Full Clarity */}
        <div className="absolute inset-0">
          <SafeImage
            src="/src/assets/images/hero_saudi_livestock_1794608168927.jpg"
            alt="راعي أغنام سعودي مع قطيع من الأغنام النعيمية وسط الطبيعة الجبلية والواحات في المملكة العربية السعودية"
            width={1920}
            height={819}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            className="w-full h-full object-cover object-[22%_48%] sm:object-[25%_50%]"
          />
          {/* Single Precision Directional Scrim: keeps shepherd, oasis, cliffs, and sheep brightly visible while anchoring right-edge text */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute inset-0 bg-[linear-gradient(to_left,rgba(6,31,22,0.56)_0%,rgba(6,31,22,0.34)_22%,rgba(6,31,22,0.08)_38%,transparent_48%)]"
          />
          <div
            aria-hidden="true"
            className="sm:hidden absolute inset-0 bg-[linear-gradient(to_top,rgba(6,31,22,0.58)_0%,rgba(6,31,22,0.32)_52%,rgba(6,31,22,0.16)_100%)]"
          />
        </div>

        {/* Compact Curved Corner Accent Ribbon ("من أرضنا .. لأهلنا") */}
        <div
          aria-hidden="true"
          className="hidden sm:block pointer-events-none absolute left-0 bottom-0 w-[21%] max-w-[290px] z-10"
        >
          <svg viewBox="0 0 560 220" preserveAspectRatio="xMinYMax meet" className="w-full h-auto block">
            <path
              d="M0 0C130 4 300 70 440 148 490 176 530 204 560 220H0Z"
              fill="#0b3a29"
              fillOpacity="0.92"
            />
            <path
              d="M0 8C128 12 292 76 430 152 478 178 516 202 546 220"
              fill="none"
              stroke="#d79a3d"
              strokeWidth="2.5"
              opacity="0.92"
            />
          </svg>
          <div className="absolute left-[10%] bottom-[15%] text-center text-white font-display font-bold leading-snug text-xs lg:text-base">
            <span>من أرضنا ..</span>
            <br />
            <span>لأهلنا</span>
            <svg
              viewBox="0 0 120 14"
              fill="none"
              stroke="#d79a3d"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="w-16 lg:w-22 mt-0.5 mx-auto"
            >
              <path d="M2 11C30 3 70 2 118 6" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-11 lg:py-12">
          <div className="max-w-md lg:max-w-[29rem]">
            <p className="text-[11px] sm:text-xs font-extrabold text-[#FCD783] mb-1.5 sm:mb-2 tracking-wide drop-shadow-[0_2px_10px_rgba(4,20,14,0.95)]">
              سوق المواشي السعودي · إرث المربين الأصيل
            </p>
            <h1 className="font-display text-xl sm:text-3xl lg:text-[2.15rem] font-extrabold text-white leading-[1.28] text-balance drop-shadow-[0_2px_14px_rgba(4,20,14,0.94)]">
              منصة المربين والمشترين{' '}
              <span className="text-[#FCD783]">للأنعام والسلالات الأصيلة</span>
            </h1>
            <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm text-white leading-relaxed max-w-md font-semibold drop-shadow-[0_2px_12px_rgba(4,20,14,0.95)]">
              تصفّح إعلانات النعيمي والنجدي والحري والعارضي بمواصفات دقيقة، وتواصل مباشرة مع المربين الموثقين في المملكة.
            </p>

            <div className="mt-3.5 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <button
                type="button"
                onClick={onBrowseAll}
                className="min-h-[44px] sm:min-h-[42px] px-4 sm:px-5 py-2 rounded-full bg-[#FCD783] hover:bg-[#FFE29E] text-[#072419] text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>تصفّح المواشي المتاحة</span>
                <ArrowLeft size={15} aria-hidden="true" />
              </button>

              {onAddListing && (
                <button
                  type="button"
                  onClick={onAddListing}
                  className="min-h-[44px] sm:min-h-[42px] px-4 sm:px-5 py-2 rounded-full bg-[#07281C]/90 backdrop-blur-[3px] hover:bg-[#0F4A35] border border-[#FCD783]/85 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCD783]"
                >
                  <Plus size={15} aria-hidden="true" />
                  <span>أضف إعلانك الآن</span>
                </button>
              )}
            </div>

            <ul className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 sm:gap-x-3.5 gap-y-1 text-[11px] sm:text-xs font-bold text-white drop-shadow-[0_1px_8px_rgba(4,20,14,0.88)]">
              <li className="inline-flex items-center gap-1.5">
                <Sprout size={14} className="text-[#FCD783] shrink-0" aria-hidden="true" />
                <span>مربون موثقون</span>
              </li>
              <li className="text-white/65" aria-hidden="true">
                ·
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users size={14} className="text-[#FCD783] shrink-0" aria-hidden="true" />
                <span>مواصفات دقيقة</span>
              </li>
              <li className="text-white/65" aria-hidden="true">
                ·
              </li>
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#FCD783] shrink-0" aria-hidden="true" />
                <span>تواصل مباشر</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dedicated Quick Search Band — cleanly separated below the hero banner with zero overlap */}
      <section
        aria-label="منطقة البحث السريع في إعلانات المواشي"
        className="bg-[var(--color-cream)]/55 border-y border-[var(--color-border)] py-4 sm:py-7 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <form
            onSubmit={handleSubmit}
            aria-label="البحث السريع في إعلانات المواشي"
            className="bg-[var(--color-surface)] rounded-2xl p-3.5 sm:p-5 lg:p-6 shadow-md border border-[var(--color-border)] transition-colors"
          >
          <div className="grid grid-cols-2 lg:grid-cols-[minmax(220px,1.65fr)_1fr_1fr_1fr_1fr_auto] gap-2.5 sm:gap-3 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label
                htmlFor="hero-search-q"
                className="block text-xs font-semibold text-[var(--color-ink)]/85 mb-1.5"
              >
                ابحث عن سلالة أو مدينة أو مواصفات
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="hero-search-q"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  maxLength={120}
                  placeholder="مثال: جذعان نعيمي، فحل، حفر الباطن..."
                  className="w-full h-11 pr-10 pl-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream)]/60 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:outline-none focus:border-[var(--color-green-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="hero-cat"
                className="block text-xs font-semibold text-[var(--color-ink)]/85 mb-1.5"
              >
                التصنيف
              </label>
              <select
                id="hero-cat"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40"
              >
                <option value="all">جميع التصنيفات</option>
                {mainCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hero-breed"
                className="block text-xs font-semibold text-[var(--color-ink)]/85 mb-1.5"
              >
                السلالة
              </label>
              <select
                id="hero-breed"
                value={breedId}
                onChange={(e) => setBreedId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40"
              >
                <option value="all">جميع السلالات</option>
                {availableBreeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hero-reg"
                className="block text-xs font-semibold text-[var(--color-ink)]/85 mb-1.5"
              >
                المنطقة
              </label>
              <select
                id="hero-reg"
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-green-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40"
              >
                <option value="all">كل المناطق</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="hero-price"
                className="block text-xs font-semibold text-[var(--color-ink)]/85 mb-1.5"
              >
                السعر الأقصى (ر.س)
              </label>
              <select
                id="hero-price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-ink)] tabular-nums focus:outline-none focus:border-[var(--color-green-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]/40"
              >
                {HERO_MAX_PRICE_OPTIONS.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <button
                type="submit"
                className="w-full lg:w-auto min-h-[44px] h-11 px-6 rounded-xl bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] shadow-xs"
              >
                <Search size={16} aria-hidden="true" />
                <span>ابحث الآن</span>
              </button>
            </div>
          </div>

          {breeds.length > 0 && (
            <div className="mt-3.5 sm:mt-4 pt-3 border-t border-[var(--color-border)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--color-muted)] overflow-x-auto no-scrollbar pb-0.5">
                <span className="font-semibold text-[var(--color-ink)] whitespace-nowrap shrink-0">
                  تصفح سريع بالسلالة:
                </span>
                {breeds.slice(0, 5).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleQuickBreed(b.id)}
                    className="min-h-[38px] sm:min-h-[32px] px-2.5 sm:px-1.5 rounded-lg sm:rounded-none bg-[var(--color-cream)] sm:bg-transparent inline-flex items-center font-medium text-[var(--color-green-ink)] hover:text-[var(--color-gold)] hover:underline transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onBrowseAll}
                className="min-h-[38px] sm:min-h-[32px] px-1.5 inline-flex items-center self-start sm:self-auto font-semibold text-[var(--color-green-ink)] hover:underline cursor-pointer whitespace-nowrap shrink-0"
              >
                عرض جميع الإعلانات المتاحة
              </button>
            </div>
          )}
        </form>
        </div>
      </section>
    </div>
  );
}
