"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/work/ProjectCard";
import { projects, categoryOrder, CATEGORIES, categoryCounts } from "@/lib/projects";

const FILTERS = [
  { key: "all", label: "الكل", count: projects.length },
  ...categoryOrder.map((key) => ({ key, label: CATEGORIES[key], count: categoryCounts[key] })),
];

/** Bento grid: the first project of a group takes a 2 × 2 square, the rest fill around it. */
function Grid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((project, index) => {
        const large = index === 0;
        return (
          <Reveal
            key={project.id}
            delay={Math.min(index, 5) * 45}
            className={large ? "col-span-2 row-span-2" : ""}
          >
            <ProjectCard project={project} priority={index < 3} large={large} />
          </Reveal>
        );
      })}
    </div>
  );
}

export default function WorkGallery() {
  const [active, setActive] = useState("all");

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 border-b border-hairline bg-void/85 px-5 py-3 backdrop-blur-xl sm:top-[4.5rem] sm:-mx-6 sm:px-6">
        <div role="tablist" aria-label="تصفية الأعمال" className="flex gap-2 overflow-x-auto [scrollbar-width:none]">
          {FILTERS.map((filter) => {
            const selected = filter.key === active;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(filter.key)}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 motion-reduce:transition-none ${
                  selected
                    ? "bg-brand text-[#150C09]"
                    : "border border-hairline-strong text-ice-muted hover:border-brand hover:text-brand-bright"
                }`}
              >
                {filter.label}
                <span className={`latin text-xs ${selected ? "text-[#150C09]/65" : "text-ice-faint"}`}>{filter.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {active === "all" ? (
        <div className="mt-14 space-y-20">
          {categoryOrder.map((key, index) => (
            <section key={key} id={`work-${key}`} aria-labelledby={`work-${key}-title`} className="scroll-mt-40">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-hairline pb-5">
                <div className="flex items-baseline gap-4">
                  <span className="latin text-sm font-semibold text-brand-bright">{String(index + 1).padStart(2, "0")}</span>
                  <h2 id={`work-${key}-title`} className="text-3xl font-bold leading-[1.45] text-ice sm:text-4xl">
                    {CATEGORIES[key]}
                  </h2>
                </div>
                <span className="shrink-0 text-sm text-ice-faint">
                  <span className="latin">{categoryCounts[key]}</span> مشروعًا
                </span>
              </div>
              <Grid items={projects.filter((p) => p.category === key)} />
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <Grid items={projects.filter((p) => p.category === active)} />
        </div>
      )}
    </div>
  );
}
