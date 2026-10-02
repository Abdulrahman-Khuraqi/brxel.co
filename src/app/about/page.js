import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ContactCta from "@/components/ContactCta";
import { services } from "@/lib/services";
import { licence } from "@/lib/site";
import { BadgeCheck, FileText } from "lucide-react";

export const metadata = {
  title: "من نحن",
  description:
    "BRXEL خدمات تصميم جرافيكي سعودية متخصصة في الهوية البصرية والسوشيال ميديا والمطبوعات والواجهات.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="من نحن"
        title="تصميم جرافيكي بنظام واضح"
        lead="BRXEL خدمات تصميم جرافيكي سعودية متخصصة في الهوية البصرية والسوشيال ميديا والمطبوعات والواجهات."
      />

      <Section
        title="نصمّم أنظمة بصرية، لا تصاميم مفردة"
        lead="أغلب العلامات لا تعاني من نقص التصاميم، بل من غياب نظام يجمعها."
        align="center"
        tone="light"
      >
        <Reveal delay={80}>
          <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-9 text-ice-muted">
            <p>
              لذلك نبدأ كل مشروع بنطاق عمل مكتوب: ما الذي سيُسلَّم بالضبط، بأي مقاسات، وفي كم من الوقت،
              وبأي جدول زمني. يعتمده العميل قبل بدء التنفيذ، ويبقى مرجعًا للطرفين حتى التسليم.
            </p>
            <p>
              نبني قوالب وأنظمة قابلة لإعادة الاستخدام: ألوان وخطوط ومكوّنات وقواعد، حتى يبقى شكل علامتك
              ثابتًا سواء صمّمنا نحن المحتوى القادم أو صمّمه فريقك الداخلي.
            </p>
            <p>
              ملفات التصميم المصدر تُسلَّم للعميل كاملة ومنظّمة مع نهاية المشروع. لا نحتجز ملفات عملائنا،
              ولا نجعل استمرارهم معنا شرطًا لاستخدام مخرجات مشاريعهم.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="الترخيص"
        title="مسجّل رسميًا كممارس حر"
        lead={`نعمل بوثيقة عمل حر صادرة من ${licence.issuer}، في تخصص ${licence.speciality}.`}
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-brand/25 bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand-bright">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-base font-semibold text-ice">وثيقة ممارس حر</p>
            </div>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {[
                ["اسم صاحب الوثيقة", licence.holder],
                ["رمز الوثيقة", licence.documentId, true],
                ["الفئة", licence.category],
                ["المهنة", licence.speciality],
                ["تاريخ الإصدار", licence.issued, true],
                ["تاريخ الانتهاء", licence.expires, true],
              ].map(([label, value, latin]) => (
                <div key={label} className="border-t border-hairline pt-4">
                  <dt className="text-xs font-semibold text-ice-faint">{label}</dt>
                  <dd className={`mt-1.5 text-sm font-semibold text-ice ${latin ? "latin" : ""}`}>
                    {value === licence.documentId ? (
                      <a
                        href={licence.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-bright underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={licence.file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline-strong px-4 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              عرض ملف الوثيقة (PDF)
            </a>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="ماذا نصمّم" title="سبع خدمات تحت سقف واحد" tone="light">
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index, 5) * 60} as="li" className="h-full">
              <div className="flex h-full items-center gap-4 rounded-xl border border-hairline bg-surface p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand-bright">
                  <ServiceIcon name={service.icon} />
                </span>
                <p className="text-sm font-medium leading-7 text-ice">{service.title}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <ContactCta />
    </>
  );
}
