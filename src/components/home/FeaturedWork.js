import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ProjectCard from "@/components/work/ProjectCard";
import { featuredProjects, projectCount } from "@/lib/projects";

/** Six featured projects, one discipline after another, linking through to the full portfolio. */
export default function FeaturedWork() {
  const picks = featuredProjects.slice(0, 6);

  return (
    <Section
      id="work"
      eyebrow="أعمال مختارة"
      title="مشاريع حقيقية لعلامات حقيقية"
      align="start"
      className="border-t border-hairline"
      action={
        <Link
          href="/work/"
          className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline-strong px-5 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
        >
          كل الأعمال
          <span className="latin text-xs text-ice-faint">{projectCount}</span>
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
        </Link>
      }
    >
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
        {picks.map((project, index) => (
          <Reveal key={project.id} delay={(index % 3) * 60}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
