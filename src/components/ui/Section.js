import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Vertical rhythm, max width and heading treatment for every band on the site.
 *
 * `tone="light"` swaps the band onto the cream ground (see `.on-light` in
 * globals.css); the children need no changes either way. The coloured element
 * is the outer section so the ground runs full-bleed, while the content stays
 * inside the shared container width.
 */
export default function Section({
  id,
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "dark",
  action = null,
  className = "",
  children,
}) {
  const centered = align === "center";

  return (
    <section id={id} className={cn(tone === "light" ? "on-light" : "bg-void", "scroll-mt-20", className)}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        {title ? (
          <Reveal
            className={
              centered
                ? "mx-auto max-w-2xl text-center"
                : "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            }
          >
            <div className="max-w-2xl">
              {eyebrow ? <p className="text-sm font-semibold text-brand-bright">{eyebrow}</p> : null}
              <h2 className="mt-3 text-[1.75rem] font-bold leading-[1.4] text-ice sm:text-[2.25rem]">{title}</h2>
              {lead ? <p className="mt-4 text-base leading-8 text-ice-muted">{lead}</p> : null}
            </div>
            {action && !centered ? <div className="shrink-0">{action}</div> : null}
          </Reveal>
        ) : null}

        {children}
      </div>
    </section>
  );
}
