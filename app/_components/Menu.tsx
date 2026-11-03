"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';

export type MenuSection = 'drinks' | 'kitchen';

export type MenuItem = {
  id: string;
  name: string;
  image: string;
  price: string;
};

export type MenuCategory = {
  id: string;
  section: MenuSection;
  category: string;
  items: MenuItem[];
};

const SECTION_LABELS: Record<MenuSection, string> = {
  drinks: 'Drinks',
  kitchen: 'Kitchen',
};

function anchorFor(category: MenuCategory) {
  return `${category.section}-${category.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export default function Menu({ categories }: Readonly<{ categories: MenuCategory[] }>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);
  const [preview, setPreview] = useState<MenuItem | null>(null);
  const chipRefs = useRef(new Map<string, HTMLAnchorElement>());

  const search = searchTerm.trim().toLowerCase();

  const visibleCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: search
            ? category.items.filter((item) => `${item.name} ${item.price}`.toLowerCase().includes(search))
            : category.items,
        }))
        .filter((category) => category.items.length > 0),
    [categories, search]
  );

  const sections = (Object.keys(SECTION_LABELS) as MenuSection[]).filter((section) =>
    visibleCategories.some((category) => category.section === section)
  );
  const activeSection =
    visibleCategories.find((category) => anchorFor(category) === activeAnchor)?.section ?? sections[0];

  // Highlight the category currently under the sticky bar.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActiveAnchor(hit.target.id);
      },
      { rootMargin: '-140px 0px -65% 0px' }
    );
    visibleCategories.forEach((category) => {
      const el = document.getElementById(anchorFor(category));
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visibleCategories]);

  // Keep the active chip in view inside the horizontal chip rail.
  useEffect(() => {
    if (activeAnchor) {
      chipRefs.current.get(activeAnchor)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }, [activeAnchor]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setPreview(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

  // Section switches cover the whole drinks list, so they jump; nearby chips glide.
  function jumpTo(anchor: string, instant = false, target = anchor) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setActiveAnchor(anchor);
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: instant || reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  return (
    <section aria-label="Menu" className="pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <label className="relative block">
          <span className="sr-only">Search the menu</span>
          <svg aria-hidden viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-mist" strokeWidth={1.6}>
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search drinks, dishes or prices"
            className="h-12 w-full rounded-full border border-brass/25 bg-ink-raised pl-11 pr-4 text-[15px] text-cream placeholder:text-mist/80 focus:border-brass/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/40 lg:max-w-md"
          />
        </label>
      </div>

      {/* Sticky navigation: section switch + category rail */}
      <nav aria-label="Menu categories" className="sticky top-0 z-40 mt-6 border-b border-brass/15 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 pt-3 lg:px-10">
          {sections.length > 1 ? (
            <div role="tablist" className="inline-flex rounded-full border border-brass/25 p-1">
              {sections.map((section) => {
                const first = visibleCategories.find((category) => category.section === section);
                const selected = section === activeSection;
                return (
                  <button
                    key={section}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => first && jumpTo(anchorFor(first), true, `section-${section}`)}
                    className={`rounded-full px-5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 ${
                      selected ? 'bg-brass text-ink' : 'text-mist hover:text-cream'
                    }`}
                  >
                    {SECTION_LABELS[section]}
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="-mx-6 mt-2 flex gap-1 overflow-x-auto px-6 pb-2 [scrollbar-width:none] lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden">
            {visibleCategories
              .filter((category) => category.section === activeSection)
              .map((category) => {
                const anchor = anchorFor(category);
                const active = anchor === activeAnchor;
                return (
                  <a
                    key={category.id}
                    href={`#${anchor}`}
                    ref={(el) => {
                      if (el) chipRefs.current.set(anchor, el);
                      else chipRefs.current.delete(anchor);
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      jumpTo(anchor);
                    }}
                    className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 ${
                      active ? 'border-brass text-cream' : 'border-transparent text-mist hover:text-cream'
                    }`}
                  >
                    {category.category}
                  </a>
                );
              })}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {visibleCategories.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl italic text-cream">Nothing matches &ldquo;{searchTerm.trim()}&rdquo;</p>
            <p className="mt-2 text-mist">Try a shorter word, or a brand name.</p>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="mt-6 rounded-full border border-brass/40 px-5 py-2 text-sm text-brass hover:bg-brass hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
            >
              Clear search
            </button>
          </div>
        ) : null}

        {visibleCategories.map((category, index) => {
          const startsSection = index === 0 || visibleCategories[index - 1].section !== category.section;
          return (
            <React.Fragment key={category.id}>
              {startsSection && sections.length > 1 ? (
                <h2 id={`section-${category.section}`} className="mt-20 scroll-mt-32 font-display text-5xl font-medium tracking-[-0.01em] text-cream first:mt-14 lg:text-6xl">
                  {SECTION_LABELS[category.section]}
                </h2>
              ) : null}

              <section id={anchorFor(category)} aria-labelledby={`${anchorFor(category)}-title`} className="scroll-mt-32 pt-12">
                <div className="flex items-baseline justify-between gap-4 border-b border-brass/20 pb-3">
                  <h3 id={`${anchorFor(category)}-title`} className="font-display text-[1.75rem] italic text-brass lg:text-[2rem]">
                    {category.category}
                  </h3>
                  <span className="text-sm text-mist">
                    {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <ul className="grid gap-x-14 lg:grid-cols-2">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => item.image && setPreview(item)}
                        className="group flex w-full items-center gap-4 rounded-md py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
                      >
                        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-plate ring-1 ring-cream/10">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              width={64}
                              height={64}
                              loading="lazy"
                              className="h-full w-full object-contain p-1"
                            />
                          ) : null}
                        </span>
                        <span className="flex min-w-0 flex-1 items-baseline gap-3">
                          <span className="text-[15px] font-medium leading-snug tracking-[0.02em] text-cream group-hover:text-brass">
                            {item.name}
                          </span>
                          <span aria-hidden className="mb-1 min-w-6 flex-1 border-b border-dotted border-brass/35" />
                          <span className="shrink-0 text-[15px] tabular-nums text-brass">{item.price}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            </React.Fragment>
          );
        })}
      </div>

      {preview ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={preview.name}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/80 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-brass/20 bg-ink-raised"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid aspect-square place-items-center border-b border-cream/10 bg-plate">
              <img src={preview.image} alt={preview.name} className="h-full w-full object-contain p-6" />
            </div>
            <div className="flex items-baseline justify-between gap-4 p-5">
              <p className="font-medium tracking-[0.02em] text-cream">{preview.name}</p>
              <p className="shrink-0 tabular-nums text-brass">{preview.price}</p>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => setPreview(null)}
              className="w-full border-t border-brass/15 py-3.5 text-sm text-mist hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass/60"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
