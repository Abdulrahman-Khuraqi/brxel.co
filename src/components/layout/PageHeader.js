import Reveal from "@/components/ui/Reveal";

/** Compact page banner shared by every route below the home page. */
export default function PageHeader({ eyebrow, title, lead, align = "center", children }) {
  const centered = align === "center";

  return (
    <section className="relative isolate overflow-hidden bg-void">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_-10%,rgb(242_161_44/0.13),transparent_70%)]"
        aria-hidden="true"
      />
      <div className={`mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 ${centered ? "text-center" : ""}`}>
        <Reveal className={centered ? "mx-auto max-w-3xl" : "max-w-3xl"}>
          {eyebrow ? <p className="text-sm font-semibold text-brand-bright">{eyebrow}</p> : null}
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.35] text-ice sm:text-[2.75rem] sm:leading-[1.3]">
            {title}
          </h1>
          {lead ? (
            <p className={`mt-4 max-w-2xl text-base leading-8 text-ice-muted sm:text-lg ${centered ? "mx-auto" : ""}`}>{lead}</p>
          ) : null}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
