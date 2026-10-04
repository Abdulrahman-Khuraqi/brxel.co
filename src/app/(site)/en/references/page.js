import PageHeader from "@/components/layout/PageHeader";
import ReferenceLibrary from "@/components/references/ReferenceLibrary";
import { referenceCount, referenceGroups } from "@/lib/references";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Website References",
  description: "BRXEL's approved website-design inspiration references.",
};

export default function ReferencesPageEnglish() {
  return (
    <div lang="en" dir="ltr">
      <PageHeader
        eyebrow="Website References"
        title="Websites we return to when an idea needs a higher bar"
        lead={`${referenceCount} selected references shaping the website's visual and creative direction.`}
      >
        <nav aria-label="Website reference sections" className="mt-7 flex flex-wrap justify-center gap-2">
          {referenceGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong bg-surface px-4 text-sm font-semibold text-ice transition duration-200 hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              {group.titleEn}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="bg-void">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <aside className="mb-16 rounded-2xl border border-brand/25 bg-brand/10 p-6 sm:p-8" aria-label="How to use this library">
            <p className="text-sm font-semibold text-brand-bright">How to use the library</p>
            <p className="mt-3 max-w-4xl text-sm leading-8 text-ice-muted sm:text-base">
              Take one focused idea from each reference: a grid from one site, a case-study pattern from another, and one signature interaction. A strong agency site stays mostly clear and reserves spectacle for one or two memorable moments.
            </p>
          </aside>

          <ReferenceLibrary locale="en" />
        </div>
      </div>
    </div>
  );
}
