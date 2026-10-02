import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { legal, legalOrder, LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/format";

export default function LegalPage({ slug }) {
  const doc = legal[slug];

  return (
    <>
      <PageHeader eyebrow="السياسات" title={doc.title} lead={doc.intro}>
        <p className="mt-6 text-sm text-ice-faint">آخر تحديث: {formatDate(LEGAL_UPDATED)}</p>
      </PageHeader>

      {/* Long-form legal text reads better on the light ground. */}
      <div className="on-light">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-16">
          <nav aria-label="السياسات" className="mb-12 flex flex-wrap gap-2">
            {legalOrder.map((key) => {
              const active = key === slug;
              return (
                <Link
                  key={key}
                  href={`/${key}/`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-9 items-center rounded-lg px-3.5 py-2 text-sm font-medium transition motion-reduce:transition-none ${
                    active
                      ? "brand-gradient text-[#150C09]"
                      : "border border-hairline bg-surface text-ice-muted hover:border-brand hover:text-brand-bright"
                  }`}
                >
                  {legal[key].label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-10">
            {doc.sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-lg font-bold leading-8 text-ice">{section.h}</h2>

                {section.p?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-8 text-ice-muted">
                    {paragraph}
                  </p>
                ))}

                {section.list ? (
                  <ul className="mt-4 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="relative ps-5 text-sm leading-8 text-ice-muted before:absolute before:top-[0.95rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-bright before:content-[''] before:start-0"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
