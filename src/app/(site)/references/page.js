import PageHeader from "@/components/layout/PageHeader";
import ReferenceLibrary from "@/components/references/ReferenceLibrary";
import { referenceCount, referenceGroups } from "@/lib/references";

export const metadata = {
  robots: { index: false, follow: false },
  title: "مراجع المواقع",
  description: "قائمة BRXEL المعتمدة لمراجع وإلهام تصميم الموقع.",
};

export default function ReferencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Website References"
        title="مراجع مواقع نعود إليها عندما نريد رفع مستوى الفكرة"
        lead={`${referenceCount} مراجع مختارة تشكّل الاتجاه البصري والإبداعي للموقع.`}
      >
        <nav aria-label="أقسام مراجع المواقع" className="mt-7 flex flex-wrap justify-center gap-2">
          {referenceGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="inline-flex min-h-11 items-center rounded-full border border-hairline-strong bg-surface px-4 text-sm font-semibold text-ice transition duration-200 hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              {group.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <div className="bg-void">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <aside className="mb-16 rounded-2xl border border-brand/25 bg-brand/10 p-6 sm:p-8" aria-label="طريقة استخدام القائمة">
            <p className="text-sm font-semibold text-brand-bright">طريقة الاستخدام</p>
            <p className="mt-3 max-w-4xl text-sm leading-8 text-ice-muted sm:text-base">
              خذ من كل مرجع فكرة محددة: شبكة من موقع، طريقة عرض مشروع من آخر، وحركة واحدة مميزة. لا تجمع كل المؤثرات في صفحة واحدة؛ الأفضل أن يبقى الموقع واضحًا بنسبة كبيرة مع لحظة أو لحظتين بصريتين لا تُنسى.
            </p>
          </aside>

          <ReferenceLibrary locale="ar" />
        </div>
      </div>
    </>
  );
}
