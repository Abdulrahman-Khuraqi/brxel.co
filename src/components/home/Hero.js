import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";
import { featuredProjects } from "@/lib/projects";

const STATS = [
  { value: "+380", label: "مشروع مُنجز" },
  { value: "+120", label: "عميل" },
  { value: "+60", label: "هوية بصرية" },
];

/** Headline, one line of pitch, two actions — and four real projects beside it. */
export default function Hero() {
  const mosaic = featuredProjects.slice(0, 4);

  return (
    <section className="relative isolate overflow-hidden bg-void">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_80%_-10%,rgb(242_161_44/0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface px-3.5 py-1.5 text-xs font-semibold text-ice-muted">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="pulse-dot absolute inset-0 rounded-full bg-success" />
                <span className="relative h-2 w-2 rounded-full bg-success" />
              </span>
              متاحون لمشاريع جديدة
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-[clamp(2.5rem,6.2vw,4.5rem)] font-bold leading-[1.25] text-ice">
              فنٌّ في
              <span className="flex items-center gap-[0.15em]">
                <span className="headline-accent">كل بكسل</span>
                <Spark className="h-[0.5em] w-[0.5em] shrink-0 text-brand" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-lg text-base leading-8 text-ice-muted sm:text-lg sm:leading-9">
              استوديو تصميم جرافيكي: هوية بصرية، سوشيال ميديا، مطبوعات وواجهات مواقع. نطاق عمل مكتوب، وملفات
              تسليم تملكها بالكامل.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-6 text-base font-bold text-[#150C09] transition hover:bg-brand-bright motion-reduce:transition-none"
              >
                احصل على عرضك
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/work/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
              >
                شاهد أعمالنا
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-hairline border-t border-hairline pt-6">
              {STATS.map((stat, index) => (
                <div key={stat.label} className={index === 0 ? "pe-4" : "px-4"}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="latin block text-2xl font-bold text-ice sm:text-3xl">{stat.value}</span>
                    <span className="mt-1 block text-xs text-ice-faint">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4" aria-label="من أعمالنا">
            {mosaic.map((project, index) => (
              <Link
                key={project.id}
                href="/work/"
                className={`group relative block aspect-square overflow-hidden rounded-2xl border border-hairline bg-navy-raised ${
                  index % 2 === 1 ? "translate-y-6 sm:translate-y-10" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.categoryLabel}`}
                  width={600}
                  height={600}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                />
                <span className="absolute bottom-2.5 start-2.5 rounded-full bg-[#0c0705]/75 px-2.5 py-1 text-[11px] font-semibold text-[#F7F1E6] backdrop-blur-sm">
                  {project.categoryLabel}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
