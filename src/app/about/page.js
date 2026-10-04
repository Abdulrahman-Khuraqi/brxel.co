import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ContactSection from "@/components/contact/ContactSection";
import { services } from "@/lib/services";

export const metadata = {
  title: "من نحن",
  description: "BRXEL استوديو تصميم جرافيكي متخصص في الهوية البصرية والسوشيال ميديا والمطبوعات والواجهات.",
};

const PRINCIPLES = [
  {
    title: "نطاق مكتوب قبل البدء",
    body: "ما الذي سيُسلَّم بالضبط، بأي مقاسات، وفي كم من الوقت. يعتمده العميل قبل التنفيذ، ويبقى مرجعًا للطرفين حتى التسليم.",
  },
  {
    title: "أنظمة، لا تصاميم مفردة",
    body: "نبني ألوانًا وخطوطًا ومكوّنات وقواعد قابلة لإعادة الاستخدام، حتى يبقى شكل علامتك ثابتًا أيًّا كان من يصمّم بعدنا.",
  },
  {
    title: "ملفاتك ملكك",
    body: "تُسلَّم الملفات المصدرية كاملة ومنظّمة مع نهاية المشروع. لا نحتجز ملفات عملائنا، ولا نجعل استمرارهم معنا شرطًا لاستخدامها.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="من نحن"
        title="تصميم جرافيكي بنظام واضح"
        lead="BRXEL استوديو تصميم جرافيكي متخصص في الهوية البصرية والسوشيال ميديا والمطبوعات والواجهات. أغلب العلامات لا تعاني من نقص التصاميم، بل من غياب نظام يجمعها."
      />

      <Section eyebrow="ما نؤمن به" title="ثلاثة مبادئ في كل مشروع" align="start" tone="light">
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((item, index) => (
            <Reveal key={item.title} as="li" delay={index * 70} className="h-full">
              <div className="h-full rounded-2xl border border-hairline bg-surface p-7">
                <span className="latin text-sm font-bold text-brand-bright">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-bold text-ice">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ice-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section eyebrow="ماذا نصمّم" title="سبع خدمات تحت سقف واحد" align="start">
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index, 5) * 50} as="li" className="h-full">
              <a
                href={`/services/#${service.id}`}
                className="flex h-full items-center gap-4 rounded-2xl border border-hairline bg-surface p-5 transition hover:border-hairline-strong hover:bg-surface-hover motion-reduce:transition-none"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-bright">
                  <ServiceIcon name={service.icon} />
                </span>
                <span className="text-sm font-semibold leading-7 text-ice">{service.title}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <ContactSection location="about" />
    </>
  );
}
