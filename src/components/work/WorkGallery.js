"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProjectCard from "@/components/work/ProjectCard";
import { projects, projectsByCategory, categoryOrder, CATEGORIES, categoryCounts } from "@/lib/projects";

const PAGE_SIZE = 12;

const FILTERS = [
  { key: "all", label: "الكل", count: projects.length },
  ...categoryOrder.map((key) => ({ key, label: CATEGORIES[key], count: categoryCounts[key] })),
];

/** Reads "#work-social" style links so other pages can open a filtered view. */
function filterFromHash() {
  const key = window.location.hash.replace("#work-", "");
  return categoryOrder.includes(key) ? key : null;
}

/**
 * The portfolio: one even grid, filtered by discipline. "All" mixes the
 * disciplines best-first; a filter shows that discipline best-first.
 * Twelve at a time, so the page stays light as the portfolio grows.
 */
export default function WorkGallery() {
  const [active, setActive] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const sync = () => {
      const key = filterFromHash();
      if (key) {
        setActive(key);
        setVisible(PAGE_SIZE);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (key) => {
    setActive(key);
    setVisible(PAGE_SIZE);
    // Keep the URL shareable without jumping the page.
    window.history.replaceState(null, "", key === "all" ? window.location.pathname : `#work-${key}`);
  };

  const items = active === "all" ? projects : projectsByCategory[active];
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <div id="gallery" className="scroll-mt-24">
      <div className="sticky top-16 z-30 -mx-5 border-b border-hairline bg-void/90 px-5 py-3 backdrop-blur-xl sm:top-[4.5rem] sm:-mx-8 sm:px-8">
        <div role="tablist" aria-label="تصفية الأعمال" className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {FILTERS.map((filter) => {
            const selected = filter.key === active;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="work-grid"
                onClick={() => select(filter.key)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200 motion-reduce:transition-none ${
                  selected
                    ? "bg-ice text-[#150C09]"
                    : "border border-hairline text-ice-muted hover:border-hairline-strong hover:text-ice"
                }`}
              >
                {filter.label}
                <span className={`latin text-xs ${selected ? "text-[#150C09]/60" : "text-ice-faint"}`}>{filter.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div id="work-grid" role="tabpanel" className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
        {shown.map((project, index) => (
          <ProjectCard key={project.id} project={project} priority={index < 4} showCategory={active === "all"} />
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-3 text-center">
        {remaining > 0 ? (
          <button
            type="button"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            عرض المزيد
            <span className="latin text-xs text-ice-faint">{remaining}</span>
          </button>
        ) : null}
        <p className="text-sm text-ice-muted">نضيف أعمالًا جديدة باستمرار.</p>
      </div>
    </div>
  );
}
