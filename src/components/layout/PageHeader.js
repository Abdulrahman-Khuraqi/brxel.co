import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";

/** Compact page banner shared by every route below the home page. */
export default function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-navy">
      <div className="aurora absolute inset-0" aria-hidden="true" />
      <div className="hatch absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-16 -top-24 text-brand/10" aria-hidden="true">
        <Spark className="h-64 w-64" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 py-16 text-center sm:px-6 sm:py-20">
        <Reveal>
          {eyebrow ? (
            <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright">
              <Spark className="h-3 w-3" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-[1.75rem] font-bold leading-[1.3] tracking-tight text-ice sm:text-5xl sm:leading-[1.2]">
            {title}
          </h1>
          {lead ? <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ice-muted">{lead}</p> : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
