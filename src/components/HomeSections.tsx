import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  ClipboardCheck,
  FileText,
  Flag,
  Headphones,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from 'lucide-react';
import type {
  Breed,
  Category,
  Listing,
  SellerProfile,
} from '../types/marketplace';
import type { DirectoryFilters } from '../lib/listing-search';
import { SafeImage } from './SafeImage';
import { VerifiedSellerBadge } from './VerifiedSellerBadge';

interface HomeCategoriesSectionProps {
  categories: Category[];
  publishedListings: Listing[];
  onFilterListings: (patch: Partial<DirectoryFilters>) => void;
  onBrowseAll: () => void;
}

function OliveDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 sm:gap-7 ${className}`} aria-hidden="true">
      <span className="block w-16 sm:w-44 h-px bg-[#d6b676]/80" />
      <svg
        viewBox="0 0 40 40"
        className="w-7 h-7 sm:w-9 sm:h-9 text-[#0B3A29] dark:text-[#5ED1A1] shrink-0"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M20 36V20" fill="none" />
        <path d="M20 22C11 22 7 16 7 9c8.5 0 13 5 13 13Z" />
        <path d="M20 19c0-8 5-13 14-13 0 7-5 13-14 13Z" />
      </svg>
      <span className="block w-16 sm:w-44 h-px bg-[#d6b676]/80" />
    </div>
  );
}

function CategoryAnimalEmblem({ category, active }: { category: Category; active: boolean }) {
  const name = category.name.trim();
  const colorCls = active
    ? 'text-white'
    : 'text-[#0B3A29] dark:text-[#5ED1A1] group-hover:text-[#0B3A29] dark:group-hover:text-white';

  // Camel / إبل
  if (name.includes('إبل') || name.includes('ابل') || name.includes('بعير') || name.includes('جمل')) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${colorCls}`}
        aria-hidden="true"
      >
        <path d="M12 48V34c0-5 4-9 8-9 3 0 4-7 9-7 5 0 6 7 9 7 4 0 8 2 10-4l2-8c1-3 5-3 6 0l1 4-5 2c-1 5-1 11-5 15v14" />
        <path d="M18 48v-8m14 8v-8m10 8v-8" />
        <path d="M12 36l-3 5" />
      </svg>
    );
  }

  // Goat / ماعز
  if (name.includes('ماعز') || name.includes('تيس') || name.includes('عارضي')) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${colorCls}`}
        aria-hidden="true"
      >
        <path d="M14 48V34c0-6 4-10 10-10h16l7-9c1.5-2 4-1 4 1.5L49 23l5 3-3 5-6-1-3 8v10" />
        <path d="M44 17c-2-5-6-8-11-7M48 16c0-4 2-7 5-8" />
        <path d="M21 48v-9m15 9v-9" />
        <path d="M46 31l-2 4" />
      </svg>
    );
  }

  // Cattle / أبقار / عجول
  if (name.includes('بقر') || name.includes('أبقار') || name.includes('عجل') || name.includes('عجول')) {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${colorCls}`}
        aria-hidden="true"
      >
        <path d="M13 48V31c0-5 4-9 10-9h18l8-4 4 6-3 7-7 1-2 16" />
        <path d="M46 18c-1-4-3-6-6-6M52 17c1-3 3-5 5-5" />
        <path d="M20 48v-9m16 9v-9" />
        <path d="M13 30l-3 7" />
      </svg>
    );
  }

  // Default Sheep / أغنام / ضأن
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${colorCls}`}
      aria-hidden="true"
    >
      <path d="M16 39c-4-1-6-5-4-9 1-4 4-7 8-7 2-4 7-6 12-5 5-2 10 0 13 4 4 1 6 5 5 9-1 5-5 8-9 8H20" />
      <path d="M45 25c4 0 8 3 8 7s-3 7-7 7" />
      <path d="M49 23c1.5-2.5 4-3 6-1" />
      <path d="M22 39v9m8-9v9m9-9v9m7-9v9" />
    </svg>
  );
}

export function HomeCategoriesSection({
  categories,
  publishedListings,
  onFilterListings,
  onBrowseAll,
}: HomeCategoriesSectionProps) {
  const mainCategories = useMemo(
    () => categories.filter((c) => c.parentId === null),
    [categories]
  );

  const subCategories = useMemo(
    () => categories.filter((c) => c.parentId !== null),
    [categories]
  );

  const [highlightedId, setHighlightedId] = useState<string | null>(
    () => mainCategories[0]?.id ?? null
  );

  const countByMainCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of publishedListings) {
      counts.set(listing.categoryId, (counts.get(listing.categoryId) || 0) + 1);
    }
    return counts;
  }, [publishedListings]);

  const countBySubCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of publishedListings) {
      if (listing.subCategoryId) {
        counts.set(listing.subCategoryId, (counts.get(listing.subCategoryId) || 0) + 1);
      }
    }
    return counts;
  }, [publishedListings]);

  if (mainCategories.length === 0 && subCategories.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-categories-heading"
      className="relative overflow-hidden bg-[#fbfaf6] dark:bg-[var(--color-cream)]/45 border-b border-[var(--color-border)] py-10 sm:py-12 lg:py-14 transition-colors"
    >
      {/* Subtle botanical radial ambiance */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(45% 55% at 0% 100%, rgba(190,214,172,0.38), transparent 70%), radial-gradient(40% 50% at 100% 100%, rgba(190,214,172,0.32), transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <OliveDivider />

        <div className="text-center max-w-2xl mx-auto">
          <h2
            id="home-categories-heading"
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B3A29] dark:text-[var(--color-ink)]"
          >
            تصفح السوق حسب التصنيف والغرض
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[var(--color-muted)]">
            اختر نوع الأنعام أو الغرض من الشراء للانتقال مباشرة إلى الإعلانات المطابقة
          </p>
        </div>

        {/* Circular Disc Emblem Categories */}
        {mainCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-start justify-items-center sm:justify-center gap-5 sm:gap-10 lg:gap-14 pt-3">
            {mainCategories.map((cat, idx) => {
              const count = countByMainCategory.get(cat.id) || 0;
              const isHighlighted = highlightedId ? highlightedId === cat.id : idx === 0;
              const childNames = subCategories
                .filter((sub) => sub.parentId === cat.id)
                .map((sub) => sub.name);

              return (
                <button
                  key={cat.id}
                  type="button"
                  onMouseEnter={() => setHighlightedId(cat.id)}
                  onFocus={() => setHighlightedId(cat.id)}
                  onClick={() => onFilterListings({ categoryId: cat.id })}
                  className="group flex flex-col items-center text-center w-full max-w-[148px] sm:w-[160px] sm:max-w-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] rounded-2xl p-1"
                >
                  {/* Circular Disc with Orbital Gold & Green Ring */}
                  <span
                    className={`relative grid place-items-center w-24 h-24 sm:w-36 sm:h-36 rounded-full transition-all duration-200 ${
                      isHighlighted
                        ? 'bg-[#104a34] scale-105 shadow-[0_0_0_6px_rgba(255,255,255,0.85),0_14px_30px_rgba(11,58,41,0.28)] dark:shadow-[0_0_0_5px_rgba(24,38,32,0.9),0_14px_30px_rgba(0,0,0,0.4)]'
                        : 'bg-[var(--color-surface)] group-hover:-translate-y-1 shadow-[0_0_0_6px_rgba(255,255,255,0.75),0_12px_28px_rgba(70,84,44,0.16)] dark:shadow-[0_0_0_5px_rgba(37,56,47,0.7),0_12px_24px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    {/* Top Active Olive Sprig */}
                    {isHighlighted && (
                      <svg
                        viewBox="0 0 24 20"
                        aria-hidden="true"
                        className="absolute -top-4 left-1/2 -translate-x-1/2 w-7 h-6 text-[#0B3A29] dark:text-[#D79A3D] z-10"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      >
                        <path d="M12 19V9" fill="none" />
                        <path d="M12 12C6 12 3.5 8 3.5 3.5 9 3.5 12 6.5 12 12Z" />
                        <path d="M12 10c0-4.5 3-7.5 8.5-7.5 0 4.5-3 7.5-8.5 7.5Z" />
                      </svg>
                    )}

                    {/* Double Gold + Green Orbital Arcs */}
                    <svg
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                      className="absolute inset-[3%] w-[94%] h-[94%] fill-none overflow-visible"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        stroke={isHighlighted ? '#d79a3d' : '#ece6d3'}
                        strokeWidth={isHighlighted ? '1.3' : '0.9'}
                      />
                      <path
                        d="M41.8 96.3A47 47 0 0 1 5.8 33.9"
                        stroke="#d79a3d"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                      <path
                        d="M80.2 14.0A47 47 0 0 1 86.0 80.2"
                        stroke={isHighlighted ? '#d79a3d' : '#17513b'}
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      />
                    </svg>

                    <CategoryAnimalEmblem category={cat} active={isHighlighted} />
                  </span>

                  <span
                    className={`mt-4 font-display text-base sm:text-lg font-extrabold text-[#0B3A29] dark:text-[var(--color-ink)] pb-0.5 border-b-2 transition-colors ${
                      isHighlighted ? 'border-[#d79a3d]' : 'border-transparent'
                    }`}
                  >
                    {cat.name}
                  </span>

                  <span
                    className={`mt-1 text-xs font-medium text-[var(--color-muted)] tabular-nums pb-0.5 border-b-2 transition-colors ${
                      isHighlighted ? 'border-[#d79a3d]' : 'border-transparent'
                    }`}
                  >
                    {count > 0 ? `+${count} إعلان متاح` : 'تصفح القسم'}
                  </span>

                  {childNames.length > 0 && (
                    <span className="mt-1 text-[11px] text-[var(--color-muted)] line-clamp-1 max-w-full">
                      {childNames.join(' · ')}
                    </span>
                  )}

                  <span
                    className={`mt-2.5 w-9 h-9 rounded-full grid place-items-center transition-colors ${
                      isHighlighted
                        ? 'bg-[#0B3A29] text-white dark:bg-[#D79A3D] dark:text-[#14261D]'
                        : 'bg-[#f1eee2] dark:bg-[var(--color-surface)] text-[#0B3A29] dark:text-[var(--color-ink)] border border-[var(--color-border)] group-hover:bg-[#0B3A29] group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowLeft size={16} />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-Categories (Purpose Filters) */}
        {subCategories.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between gap-4 mb-3.5">
              <p className="text-xs sm:text-sm font-bold text-[var(--color-muted)]">
                أو اختر حسب الغرض من الشراء:
              </p>
              <button
                type="button"
                onClick={onBrowseAll}
                className="text-xs sm:text-sm font-bold text-[var(--color-green-ink)] hover:underline whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>استعراض جميع التصنيفات</span>
                <ArrowLeft size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-1 gap-3 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3.5 sm:overflow-visible">
              {subCategories.map((sub) => {
                const parent = mainCategories.find((m) => m.id === sub.parentId);
                const count = countBySubCategory.get(sub.id) || 0;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      onFilterListings({
                        categoryId: sub.parentId || 'all',
                        subCategoryId: sub.id,
                      })
                    }
                    className="w-[238px] shrink-0 snap-start sm:w-auto text-right bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] hover:border-[#d79a3d] px-4 py-3.5 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                        {parent && (
                          <>
                            <span>{parent.name}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span className="tabular-nums">
                          {count > 0 ? `${count} إعلان` : 'تصفية سريعة'}
                        </span>
                      </div>
                      <p className="font-display text-sm font-bold text-[var(--color-ink)] mt-0.5">
                        {sub.name}
                      </p>
                      {sub.description && (
                        <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-1">
                          {sub.description}
                        </p>
                      )}
                    </div>
                    <span className="w-8 h-8 rounded-full bg-[var(--color-cream)] text-[var(--color-green-ink)] flex items-center justify-center shrink-0">
                      <ArrowLeft size={14} aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <OliveDivider className="pt-2" />
      </div>
    </section>
  );
}

interface HomeBreedsSectionProps {
  breeds: Breed[];
  onFilterByBreed: (breedId: string) => void;
  onOpenBreedsDirectory: () => void;
}

export function HomeBreedsSection({
  breeds,
  onFilterByBreed,
  onOpenBreedsDirectory,
}: HomeBreedsSectionProps) {
  return (
    <section
      aria-labelledby="home-breeds-heading"
      className="bg-[var(--color-cream)] border-y border-[var(--color-border)] py-14 lg:py-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2
              id="home-breeds-heading"
              className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]"
            >
              دليل السلالات والأسعار الاسترشادية
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-muted)]">
              تعرّف على خصائص أشهر السلالات السعودية ومتوسطات أسعارها الاسترشادية في السوق
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenBreedsDirectory}
            className="text-sm font-semibold text-[var(--color-green-ink)] hover:underline whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>استعراض الدليل والأسعار كاملة</span>
            <ArrowLeft size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4 sm:overflow-visible">
          {breeds.slice(0, 5).map((breed) => (
            <article
              key={breed.id}
              className="w-[230px] shrink-0 snap-start sm:w-auto group bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-[var(--color-cream)] overflow-hidden">
                <SafeImage
                  src={breed.imageUrl}
                  alt={breed.name}
                  width={800}
                  height={597}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-[11px] text-[var(--color-muted)]">
                    {breed.origin} · {breed.avgWeightKg}
                  </p>
                  <h3 className="font-display text-base font-extrabold text-[var(--color-ink)] mt-0.5">
                    {breed.name}
                  </h3>
                  <p className="mt-1.5 font-display text-sm font-extrabold text-[var(--color-green-ink)] tabular-nums">
                    {breed.priceRangeSar}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFilterByBreed(breed.id)}
                  className="min-h-[44px] sm:min-h-[36px] pt-2.5 border-t border-[var(--color-border)]/70 text-xs font-semibold text-[var(--color-green-ink)] hover:underline text-right inline-flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span>تصفح عروض {breed.name}</span>
                  <ArrowLeft size={13} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface HomeBreedersSectionProps {
  verifiedSellers: SellerProfile[];
  otherSellers: SellerProfile[];
  onSelectSeller: (sellerId: string) => void;
  onOpenBreedersDirectory: () => void;
  onOpenPricing?: () => void;
}

export function HomeBreedersSection({
  verifiedSellers,
  otherSellers,
  onSelectSeller,
  onOpenBreedersDirectory,
  onOpenPricing,
}: HomeBreedersSectionProps) {
  const totalBreedersCount = verifiedSellers.length + otherSellers.length;

  return (
    <section
      aria-labelledby="home-breeders-heading"
      className="relative bg-[#0B3A29] dark:bg-[#081F17] text-white py-14 lg:py-16 overflow-hidden transition-colors"
    >
      {/* Subtle Radial Warm Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(60% 50% at 15% 15%, rgba(215,154,61,0.28), transparent 70%), radial-gradient(45% 50% at 90% 90%, rgba(26,92,66,0.6), transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Centered Header + Action Button Matching Attached Breeders Design */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-5">
          <div className="hidden lg:block" aria-hidden="true" />

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#D79A3D] mb-1.5">
              <span className="hidden sm:inline-block w-9 h-px bg-[#D79A3D]/60" aria-hidden="true" />
              <Award size={16} aria-hidden="true" />
              <span>مزارع مرخصة وموثوقة</span>
              <span className="hidden sm:inline-block w-9 h-px bg-[#D79A3D]/60" aria-hidden="true" />
            </div>
            <h2
              id="home-breeders-heading"
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white"
            >
              مربون معتمدون في المملكة
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-white/85">
              تسوق بثقة من مزارع موثوقة ومعتمدة بجودة عالية وخدمة مميزة
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5">
            <button
              type="button"
              onClick={onOpenBreedersDirectory}
              className="min-h-[42px] inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1 rounded-full border border-white/40 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full border border-white/40 grid place-items-center shrink-0">
                <ArrowLeft size={15} aria-hidden="true" />
              </span>
              <span>عرض جميع المربين ({totalBreedersCount})</span>
            </button>

            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D79A3D] hover:bg-[#C4882D] text-[#14261D] text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer"
              >
                <span>باقات المربين والأسعار</span>
              </button>
            )}
          </div>
        </div>

        {/* Verified Breeder Cards */}
        {verifiedSellers.length === 0 ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-white">
              لا يوجد مربون موثقون معروضون حالياً.
            </p>
            <button
              type="button"
              onClick={onOpenBreedersDirectory}
              className="mt-3 text-xs font-semibold text-[#D79A3D] hover:underline cursor-pointer"
            >
              استعراض دليل المربين والأسعار
            </button>
          </div>
        ) : (
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3.5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:overflow-visible">
            {verifiedSellers.map((seller, index) => {
              const starPct = Math.min(100, Math.max(0, (seller.rating / 5) * 100));
              const isGoldBtn = index % 2 === 1;
              return (
                <article
                  key={seller.userId}
                  className="w-[84vw] max-w-[335px] shrink-0 snap-start md:w-auto md:max-w-none bg-white dark:bg-[var(--color-surface)] text-[var(--color-ink)] rounded-[20px] p-4 sm:p-6 shadow-xl border border-[#ece4d2] dark:border-[var(--color-border)] flex flex-col justify-between gap-4 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Row: Name + Verified Badge + Action Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-extrabold text-[var(--color-ink)] leading-snug">
                            {seller.displayName}
                          </h3>
                          <VerifiedSellerBadge variant="badge" />
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-[#d49625] tabular-nums">
                            {seller.rating.toFixed(1)}
                          </span>
                          <span
                            className="relative inline-block text-sm leading-none tracking-wider text-[#ddd6c4] select-none"
                            aria-hidden="true"
                          >
                            ★★★★★
                            <span
                              className="absolute inset-0 overflow-hidden text-[#d79a3d]"
                              style={{ width: `${starPct}%` }}
                            >
                              ★★★★★
                            </span>
                          </span>
                          <span className="text-[var(--color-muted)] font-semibold">
                            · {seller.city}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectSeller(seller.userId)}
                        className={`min-h-[38px] px-4 rounded-xl text-xs font-bold text-white transition-colors shrink-0 cursor-pointer ${
                          isGoldBtn
                            ? 'bg-[#a97a1d] hover:bg-[#916717]'
                            : 'bg-[#0B3A29] hover:bg-[#145C42]'
                        }`}
                      >
                        ملف المربي
                      </button>
                    </div>

                    <p className="mt-2.5 text-xs font-semibold text-[var(--color-green-ink)]">
                      التخصص: {seller.specialty}
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">
                      {seller.bio}
                    </p>
                  </div>

                  {/* Card Footer Metrics */}
                  <div className="pt-3.5 border-t border-[#e6e0cf] dark:border-[var(--color-border)] flex items-center justify-between gap-3 text-xs font-semibold">
                    <div className="flex items-center gap-3.5 flex-wrap">
                      <span className="inline-flex items-center gap-2 text-[var(--color-ink)] tabular-nums">
                        <span className="w-7 h-6 rounded-md border border-[#1d7a4b]/60 bg-[#e8f3ea] dark:bg-[#145C42]/30 text-[#1d7a4b] dark:text-[#5ED1A1] grid place-items-center shrink-0">
                          <FileText size={13} aria-hidden="true" />
                        </span>
                        <span>{seller.totalSales} عملية بيع</span>
                      </span>

                      <span className="w-px h-5 bg-[#e6e0cf] dark:bg-[var(--color-border)]" aria-hidden="true" />

                      <span className="inline-flex items-center gap-1.5 text-[var(--color-ink)] tabular-nums">
                        <Users size={15} className="text-[#1d7a4b] dark:text-[#5ED1A1]" aria-hidden="true" />
                        <span>
                          خبرة {seller.yearsExperience} سنة
                          {seller.ratingCount !== undefined ? ` (${seller.ratingCount} تقييم)` : ''}
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectSeller(seller.userId)}
                      aria-label={`عرض ملف ${seller.displayName}`}
                      className="w-9 h-9 rounded-full bg-[#f4e7cd] dark:bg-[var(--color-cream)] hover:bg-[#0B3A29] hover:text-white text-[#14261D] dark:text-[var(--color-ink)] grid place-items-center transition-colors shrink-0 cursor-pointer"
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom 4-Pillar Trust Bar */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/15">
          {[
            { icon: Star, label: 'تقييمات حقيقية', filled: true },
            { icon: Headphones, label: 'دعم دائم', filled: false },
            { icon: Truck, label: 'خدمة نقل موثوقة', filled: false },
            { icon: ShieldCheck, label: 'مزارع معتمدة', filled: false },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <li
                key={feat.label}
                className={`flex items-center justify-center gap-2.5 py-2 px-3 text-sm sm:text-base font-semibold text-white/95 ${
                  idx > 0 ? 'lg:border-r lg:border-white/15' : ''
                }`}
              >
                <Icon
                  size={22}
                  className={`text-[#D79A3D] shrink-0 ${feat.filled ? 'fill-[#D79A3D]' : ''}`}
                  aria-hidden="true"
                />
                <span>{feat.label}</span>
              </li>
            );
          })}
        </ul>

        {/* Other (Unverified / Pending) Sellers */}
        {otherSellers.length > 0 && (
          <div className="pt-8 border-t border-white/15">
            <div className="mb-5">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                مربون وبائعون آخرون في السوق
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-white/75">
                حسابات مسجلة يمكنك تصفح مراحاتها وإعلاناتها، ولم تُستكمل إجراءات توثيقها المعتمدة بعد
              </p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3.5 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
              {otherSellers.map((seller) => (
                <article
                  key={seller.userId}
                  className="w-[82vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none bg-white/95 dark:bg-[var(--color-surface)] text-[var(--color-ink)] rounded-2xl border border-[#ece4d2] dark:border-[var(--color-border)] p-4 sm:p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                      <span>{seller.city}</span>
                      <span className="text-[11px] font-medium text-[var(--color-muted)]">
                        {seller.verificationStatus === 'Pending'
                          ? 'قيد مراجعة التوثيق'
                          : 'حساب غير موثق بعد'}
                      </span>
                    </div>
                    <h4 className="mt-2 font-display text-lg font-bold text-[var(--color-ink)]">
                      {seller.displayName}
                    </h4>
                    <p className="mt-1.5 text-sm text-[var(--color-muted)] line-clamp-2">
                      {seller.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs gap-2">
                    <span className="text-[var(--color-muted)] tabular-nums inline-flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 font-bold text-[var(--color-ink)]">
                        <Star
                          size={13}
                          className="text-[var(--color-gold)] fill-[var(--color-gold)]"
                          aria-hidden="true"
                        />
                        <span>{seller.rating.toFixed(1)}</span>
                        {seller.ratingCount !== undefined && (
                          <span className="font-normal text-[var(--color-muted)]">
                            ({seller.ratingCount})
                          </span>
                        )}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        خبرة {seller.yearsExperience} سنة · {seller.totalSales} بيعة
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectSeller(seller.userId)}
                      className="min-h-[44px] sm:min-h-[36px] px-2 font-semibold text-[var(--color-green-ink)] hover:underline shrink-0 cursor-pointer"
                    >
                      ملف المربي
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface HomeTrustSectionProps {
  onOpenBreedersDirectory: () => void;
  onAddListing: () => void;
}

export function HomeTrustSection({
  onOpenBreedersDirectory,
  onAddListing,
}: HomeTrustSectionProps) {
  const pillars = [
    {
      icon: ClipboardCheck,
      title: 'مراجعة الإعلانات واكتمال المواصفات',
      body: 'يمر كل إعلان جديد بمراجعة إدارية للتأكد من وضوح الصور ومطابقة البيانات الأساسية: السلالة، العمر بالأشهر، الوزن التقريبي، حالة التحصين، والسعر بالريال السعودي.',
    },
    {
      icon: ShieldCheck,
      title: 'توثيق حسابات المربين المعتمدين',
      body: 'يُمنح شعار «مربي موثق» فقط بعد تحقق إدارة المنصة من طلب التوثيق وبيانات المراح ورقم الجوال، مع فصل واضح بين الحسابات الموثقة والحسابات قيد المراجعة.',
    },
    {
      icon: Flag,
      title: 'تواصل مباشر ونظام إبلاغ فعّال',
      body: 'أجرِ محادثاتك وقدّم عروض السعر أو استفسر في التعليقات مباشرة مع المربي، مع إمكانية الإبلاغ الفوري عن أي إعلان أو تعليق مخالف لمراجعته.',
    },
  ];

  return (
    <section
      aria-labelledby="home-trust-heading"
      className="bg-[var(--color-cream)] border-y border-[var(--color-border)] py-14 lg:py-16 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-9">
          <div className="max-w-2xl">
            <h2
              id="home-trust-heading"
              className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-ink)]"
            >
              معايير الأمان والموثوقية في سوق الغنم
            </h2>
            <p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
              تعتمد المنصة إجراءات واضحة لتنظيم العرض والطلب بين المربين والمشترين داخل المملكة دون وسطاء عشوائيين
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenBreedersDirectory}
              className="min-h-[44px] px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-cream-hover)] text-xs font-semibold text-[var(--color-ink)] transition-colors cursor-pointer"
            >
              دليل المربين والأسئلة الشائعة
            </button>
            <button
              type="button"
              onClick={onAddListing}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              انشر إعلانك الآن
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-green-ink)]">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{pillar.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
