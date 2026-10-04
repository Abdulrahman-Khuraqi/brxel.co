import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Images } from "lucide-react";

/**
 * One piece of delivered work: a square cover with the caption underneath, so
 * the work itself is never covered. Web projects with a live site link out;
 * social projects open their full gallery.
 */
export default function ProjectCard({ project, priority = false, showCategory = true }) {
  const hasWebsiteLink = project.category === "web" && Boolean(project.link);
  const hasSocialGallery = project.category === "social" && project.gallery.length > 0;
  const isInteractive = hasWebsiteLink || hasSocialGallery;
  const Tag = hasWebsiteLink ? "a" : hasSocialGallery ? Link : "div";
  const linkProps = hasWebsiteLink
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : hasSocialGallery
      ? { href: `/work/social/${project.id}/` }
      : {};
  const Arrow = hasWebsiteLink ? ArrowUpLeft : ArrowLeft;
  const action = hasWebsiteLink ? "زيارة الموقع" : hasSocialGallery ? "شاهد التصاميم" : "";

  return (
    <article className="h-full">
      <Tag {...linkProps} className="group block h-full">
        <span className="relative block aspect-square overflow-hidden rounded-2xl border border-hairline bg-navy-raised">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} — ${project.categoryLabel}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          {hasSocialGallery ? (
            <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0c0705]/75 px-2.5 py-1 text-xs font-semibold text-[#F7F1E6] backdrop-blur-sm">
              <Images className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="latin">{project.gallery.length}</span>
            </span>
          ) : null}
          {isInteractive ? (
            <span className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[#150C09] opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
              <Arrow className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
            </span>
          ) : null}
        </span>
        <span className="mt-3 block px-0.5">
          <span className="block text-base font-bold leading-7 text-ice transition-colors group-hover:text-brand-bright sm:text-lg">
            {project.title}
          </span>
          <span className="mt-0.5 block text-xs text-ice-faint">
            {showCategory ? project.categoryLabel : project.sector}
            {action ? <span className="text-ice-muted"> · {action}</span> : null}
          </span>
        </span>
      </Tag>
    </article>
  );
}
