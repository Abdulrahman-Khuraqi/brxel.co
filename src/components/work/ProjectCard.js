import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Images } from "lucide-react";
import { Spark } from "@/components/ui/Logo";

/**
 * One piece of delivered work, image first: the cover fills the card and the
 * title, sector and discipline sit on a dark fade at the bottom. Covers are all
 * square, so the frame is square too; `large` cards simply span more grid cells.
 *
 * Web projects with a live site link out; social projects open their gallery.
 */
export default function ProjectCard({ project, priority = false, large = false }) {
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

  const note = hasWebsiteLink ? "زيارة الموقع" : hasSocialGallery ? "شاهد التصاميم" : "";

  const badges = (
    <>
      {hasSocialGallery ? (
        <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0c0705]/75 px-3 py-1.5 text-xs font-semibold text-[#F7F1E6] backdrop-blur-sm">
          <Images className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="latin">{project.gallery.length}</span> تصميمًا
        </span>
      ) : null}
      {isInteractive ? (
        <span className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-[#150C09] opacity-0 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <Arrow className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.image}
      alt={`عمل ${project.title}`}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  );

  // The lead card of a group: text laid over a dark fade on the image.
  if (large) {
    return (
      <article className="h-full">
        <Tag
          {...linkProps}
          className="group relative block aspect-square h-full overflow-hidden lg:aspect-auto rounded-[1.5rem] border border-hairline bg-navy-raised sm:rounded-[1.75rem]"
        >
          {image}
          <span className="absolute inset-0 bg-gradient-to-t from-[#0c0705]/95 via-[#0c0705]/20 to-transparent" aria-hidden="true" />
          {badges}
          <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6 sm:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0c0705]/70 px-3 py-1 text-[11px] font-semibold text-brand-bright backdrop-blur-sm">
              <Spark className="h-2.5 w-2.5" />
              {project.categoryLabel}
            </span>
            <span className="text-2xl font-bold leading-[1.5] text-[#F7F1E6] sm:text-3xl">{project.title}</span>
            <span className="text-xs text-[#C9BCAC]">
              {project.sector}
              {note ? ` · ${note}` : ""}
            </span>
            <span className="mt-1 hidden max-w-md text-sm leading-7 text-[#C9BCAC] sm:block">{project.summary}</span>
          </span>
        </Tag>
      </article>
    );
  }

  // Every other card: a clean image, the caption underneath, so the work is never covered.
  return (
    <article>
      <Tag {...linkProps} className="group block">
        <span className="relative block aspect-square overflow-hidden rounded-[1.25rem] border border-hairline bg-navy-raised sm:rounded-[1.5rem]">
          {image}
          {badges}
        </span>
        <span className="mt-3 block px-1">
          <span className="block text-sm font-bold leading-6 text-ice transition-colors group-hover:text-brand-bright sm:text-base">
            {project.title}
          </span>
          <span className="mt-0.5 block text-xs text-ice-faint">
            {project.sector}
            {note ? ` · ${note}` : ""}
          </span>
        </span>
      </Tag>
    </article>
  );
}
