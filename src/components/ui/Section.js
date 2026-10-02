import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";

/**
 * Vertical rhythm, max width and heading treatment for every band on the site.
 *
 * `tone="light"` swaps the band onto the ice-white ground (see `.on-light` in
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
  className = "",
  headingClassName = "",
  children,
}) {
  const centered = align === "center";

  return (
    <section id={id} className={`${tone === "light" ? "on-light" : ""} ${className}`}>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        {title ? (
          <Reveal
            className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${headingClassName}`}
          >
            {eyebrow ? (
              <p
                className={`flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright ${
                  centered ? "justify-center" : ""
                }`}
              >
                <Spark className="h-3 w-3" />
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-3 text-2xl font-bold leading-[1.35] tracking-tight text-ice sm:text-4xl">
              {title}
            </h2>
            {lead ? <p className="mt-4 text-base leading-8 text-ice-muted">{lead}</p> : null}
          </Reveal>
        ) : null}

        {children}
      </div>
    </section>
  );
}
