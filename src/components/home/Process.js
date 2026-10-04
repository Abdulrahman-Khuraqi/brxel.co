import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";

export const PROCESS = [
  { title: "نسمع منك", body: "تخبرنا عن علامتك وجمهورك وما تريد الوصول إليه، في نموذج قصير أو مكالمة." },
  { title: "نطاق وعرض مكتوب", body: "نرسل المخرجات والمدة والتكلفة كتابيًا، ولا يبدأ العمل إلا بعد اعتمادك." },
  { title: "تصميم ومراجعات", body: "نعرض الاتجاهات ونطوّر المختار منها عبر جولات تعديل محددة مسبقًا." },
  { title: "تسليم كامل", body: "تستلم كل الملفات المصدرية بصيغها المفتوحة والجاهزة، وتملكها بالكامل." },
];

/** Four steps from first message to final files. */
export default function Process({ tone = "light" }) {
  return (
    <Section
      id="process"
      eyebrow="كيف نعمل"
      title="أربع خطوات واضحة، بلا مفاجآت"
      align="start"
      tone={tone}
    >
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS.map((step, index) => (
          <Reveal key={step.title} as="li" delay={index * 60} className="h-full">
            <div className="h-full rounded-2xl border border-hairline bg-surface p-6">
              <span className="latin flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-sm font-bold text-brand-bright">
                {index + 1}
              </span>
              <h3 className="mt-5 text-h3 font-bold text-ice">{step.title}</h3>
              <p className="mt-2 text-sm text-ice-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
