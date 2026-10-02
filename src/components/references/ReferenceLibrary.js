import { ArrowUpLeft, ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { referenceGroups } from "@/lib/references";

const groupIcons = {
  inspiration: Sparkles,
};

export default function ReferenceLibrary({ locale = "ar" }) {
  const isEnglish = locale === "en";
  const Arrow = isEnglish ? ArrowUpRight : ArrowUpLeft;

  return (
    <div className="space-y-20 sm:space-y-24">
      {referenceGroups.map((group, groupIndex) => {
        const Icon = groupIcons[group.id];
        const title = isEnglish ? group.titleEn : group.title;
        const description = isEnglish ? group.descriptionEn : group.description;

        return (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
            <Reveal>
              <div className="grid gap-5 border-b border-hairline pb-7 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                <div>
                  <div className="flex items-center gap-3 text-brand-bright">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="latin text-xs font-semibold tracking-[0.22em]">0{groupIndex + 1}</span>
                  </div>
                  <h2 id={`${group.id}-title`} className="mt-5 text-2xl font-bold tracking-tight text-ice sm:text-3xl">
                    {title}
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-ice-muted sm:text-base sm:leading-8">{description}</p>
              </div>
            </Reveal>

            <ol className="divide-y divide-hairline">
              {group.items.map((item, index) => (
                <Reveal key={item.url} as="li" delay={Math.min(index, 5) * 45}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${isEnglish ? "Open" : "فتح"} ${item.name}`}
                    className="group grid min-h-32 gap-5 py-7 transition-colors duration-200 hover:bg-surface focus-visible:bg-surface motion-reduce:transition-none sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:items-center sm:px-5"
                  >
                    <span className="latin text-sm font-semibold text-ice-faint transition-colors duration-200 group-hover:text-brand-bright">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="latin text-xl font-bold tracking-tight text-ice sm:text-2xl">{item.name}</span>
                        <span className="text-xs font-semibold text-brand-bright">
                          {isEnglish ? item.focusEn : item.focus}
                        </span>
                      </span>
                      <span className="mt-2 block max-w-2xl text-sm leading-7 text-ice-muted">
                        {isEnglish ? item.noteEn : item.note}
                      </span>
                    </span>

                    <span className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-hairline-strong px-4 text-sm font-semibold text-ice transition duration-200 group-hover:border-brand group-hover:text-brand-bright motion-reduce:transition-none sm:self-center">
                      {isEnglish ? "Visit" : "زيارة"}
                      <Arrow className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
