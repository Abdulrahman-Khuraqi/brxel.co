import Link from "next/link";
import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";
import { projects, projectCount } from "@/lib/projects";

/** Hand-picked work for the home page, laid out as an editorial grid (row by row). */
const PICKS = [
  { id: "hm-architect", span: "lg:col-span-7", height: "h-80 sm:h-[28rem]" },
  { id: "chocosarayi", span: "lg:col-span-5", height: "h-80 sm:h-[28rem]" },
  { id: "ensha", span: "lg:col-span-4", height: "h-72 sm:h-[22rem]" },
  { id: "mshwar", span: "lg:col-span-4", height: "h-72 sm:h-[22rem]" },
  { id: "print-menu", span: "lg:col-span-4", height: "h-72 sm:h-[22rem]" },
  { id: "print-lelon-cards", span: "lg:col-span-5", height: "h-80 sm:h-[26rem]" },
  { id: "cgene", span: "lg:col-span-7", height: "h-80 sm:h-[26rem]" },
];

const byId = Object.fromEntries(projects.map((project) => [project.id, project]));

function WorkCard({ project, span, height }) {
  return (
    <Link
      href={`/work/#work-${project.category}`}
      className={`group relative block overflow-hidden rounded-[1.75rem] border border-hairline bg-navy-raised ${height}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={`${project.title} — ${project.categoryLabel}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-[#0c0705]/90 via-[#0c0705]/15 to-transparent" aria-hidden="true" />

      <span className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-[#150C09] opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
        <ArrowUpLeft className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 sm:p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0c0705]/70 px-3 py-1 text-[11px] font-semibold text-brand-bright backdrop-blur-sm">
          <Spark className="h-2.5 w-2.5" />
          {project.categoryLabel}
        </span>
        <span className="text-xl font-bold leading-[1.5] text-[#F7F1E6] sm:text-2xl">{project.title}</span>
        <span className="text-xs text-[#C9BCAC]">{project.sector}</span>
      </span>
    </Link>
  );
}

export default function WorkGrid() {
  const picks = PICKS.map((pick) => ({ ...pick, project: byId[pick.id] })).filter((pick) => pick.project);

  return (
    <section id="work" aria-labelledby="work-title" className="relative bg-void">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright">
                <Spark className="h-3 w-3" />
                أعمال مختارة
              </p>
              <h2 id="work-title" className="mt-3 text-3xl font-bold leading-[1.45] text-ice sm:text-5xl">
                مشاريع حقيقية، <span className="headline-accent">لعلامات حقيقية</span>
              </h2>
            </div>
            <Link
              href="/work/"
              className="group inline-flex min-h-12 items-center gap-2 self-start rounded-xl border border-hairline-strong px-5 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright sm:self-auto motion-reduce:transition-none"
            >
              كل الأعمال
              <span className="latin rounded-full bg-surface px-2 py-0.5 text-xs text-ice-muted">{projectCount}</span>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-12">
          {picks.map(({ project, span, height }, index) => (
            <Reveal key={project.id} delay={(index % 3) * 70} className={span}>
              <WorkCard project={project} span={span} height={height} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
