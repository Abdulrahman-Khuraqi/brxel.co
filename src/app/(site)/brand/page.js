import { Type } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import BrandPalette from "@/components/brand/BrandPalette";
import LogoFontOptions from "@/components/brand/LogoFontOptions";
import LogoShowcase from "@/components/brand/LogoShowcase";
import Logo from "@/components/brand/BrxelLogo";

export const metadata = {
  robots: { index: false, follow: false },
  title: "شعار BRXEL",
  description: "مرجع بناء شعار BRXEL: الفكرة، والهندسة، والألوان، والخطوط.",
};

const WEIGHTS = [
  { weight: 400, label: "عادي", sample: "بركسل" },
  { weight: 500, label: "متوسط", sample: "بركسل" },
  { weight: 600, label: "شبه عريض", sample: "بركسل" },
  { weight: 700, label: "عريض", sample: "بركسل" },
];

export default function BrandPage() {
  return (
    <>
      <PageHeader
        eyebrow="بناء شعار BRXEL"
        title="عنصر العلامة"
        lead="BRXEL مستوحى من Brand Element، على غرار Pixel (Picture Element). يوجّه هذا المعنى بناء شعار يجمع الاسم والرمز واللون والخط في علامة واحدة."
      >
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-[#0C0705]/70 px-5 py-4">
              <span className="text-[11px] font-semibold tracking-wide text-[#C9BCAC]">عنصر الصورة</span>
              <span className="text-2xl font-bold tracking-tight text-[#F7F1E6]">بيكسل</span>
            </div>
            <div className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-brand/35 bg-[#0C0705]/70 px-5 py-4 shadow-[0_12px_40px_-24px_rgba(232,90,36,0.8)]">
              <span className="text-[11px] font-semibold tracking-wide text-[#F2A12C]">عنصر العلامة</span>
              <span className="mt-1 text-[#F7F1E6]" dir="ltr">
                <Logo className="h-6 w-auto" />
              </span>
            </div>
          </div>
          <ul aria-label="عناصر الهوية" className="mt-4 flex flex-wrap justify-center gap-2">
            {["الاسم", "الرمز", "اللون", "الخط"].map((element) => (
              <li key={element} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#F7F1E6]/85">
                {element}
              </li>
            ))}
          </ul>
        </div>
      </PageHeader>

      <Section
        eyebrow="الشعار"
        title="الكلمة كلها تتجه نحو عنصر العلامة"
        lead="حروف ممتدة وثقيلة، وكل قصّة فيها تتجه نحو الـX، وخط برتقالي واحد يقطع الكلمة: هذا هو عنصر العلامة."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <LogoShowcase locale="ar" />
        </Reveal>
      </Section>

      <Section
        eyebrow="سمات الشعار · مقترح"
        title="قوي، حديث، دقيق، ومتوازن"
        lead="سمات تُستخدم لتقييم شكل الشعار: حضور قوي، هندسة معاصرة، تنفيذ دقيق، وعلامة تعمل بوضوح مع الاسم."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              {["قوي", "حديث", "دقيق", "متوازن"].map((trait, index) => (
                <div key={trait} className="rounded-2xl border border-white/10 bg-[#0C0705] p-5 sm:p-6">
                  <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
                  <p className="mt-4 text-lg font-semibold text-ice">{trait}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-wide text-brand-bright">ترجمتها بصريًا</p>
              <p className="mt-4 text-base leading-8 text-ice-muted">
                حروف هندسية مقروءة، زوايا مضبوطة، وتباين واضح بين الاسم والرمز؛ من دون تفاصيل تعيق الرسم أو التصغير.
              </p>
              <p className="mt-6 border-t border-white/10 pt-5 text-sm font-semibold leading-7 text-ice">هندسة دقيقة. قراءة سريعة. تطبيق واضح.</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="هندسة الشعار"
        title="كل القصّات تتجه نحو الـX"
        lead="زوايا الحروف كلها 45°: الـB والـR تُقصّ من اليمين، والـE والـL من اليسار، فتلتقي الكلمة عند الـX. وقطرا الـX بزاوية 50° ليبقى عرضه قريبًا من عرض بقية الحروف."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <figure className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#150C09]" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo/brxel-logo-construction.svg"
              alt="شبكة بناء شعار BRXEL: قصّات 45° عند الـB والـE، وقطر الـX بزاوية 50°."
              width={1600}
              height={560}
              className="h-auto w-full"
            />
          </figure>
        </Reveal>
        <Reveal delay={80}>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "قصّات الحروف", value: "45°" },
              { label: "قطرا الـX", value: "50°" },
              { label: "سماكة الجذع / الشريط", value: "23 / 21" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-[#0C0705]/70 p-4">
                <dt className="text-xs font-semibold text-[#C9BCAC]">{item.label}</dt>
                <dd className="latin mt-2 text-2xl font-bold text-brand-bright">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-7 text-ice-muted">
            القيم على ارتفاع حرف يساوي 100 وحدة. المسافات بين الحروف محسوبة بصريًا لا بالأرقام، حتى تبدو متساوية رغم اختلاف أشكال الحروف المفتوحة مثل الـX والـE.
          </p>
        </Reveal>
      </Section>

      <Section
        eyebrow="لوحة الألوان"
        title="ألوان الشعار وأدوارها"
        lead="تحدد هذه الألوان النسخ الأساسية والمساندة للشعار، مع تباين واضح على الخلفيات الفاتحة والداكنة."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <BrandPalette locale="ar" />
        </Reveal>
      </Section>

      <Section
        eyebrow="الخط"
        title="آي بي إم بلكس سانس العربي"
        lead="عائلة واحدة للعربية واللاتينية، تحافظ على نبرة تقنية واضحة وتمنح المحتوى إيقاعًا متماسكًا عبر جميع الشاشات."
        tone="light"
        align="start"
      >
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <div className="flex min-h-80 flex-col justify-between rounded-2xl bg-[#150C09] p-8 text-[#F7F1E6] sm:p-10">
              <Type className="h-7 w-7 text-[#E85A24]" aria-hidden="true" strokeWidth={1.75} />
              <div>
                <p className="text-7xl font-bold leading-none sm:text-8xl">بر</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight">بركسل</p>
              </div>
              <p className="text-xs text-[#C9BCAC]">آي بي إم بلكس سانس العربي</p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
              {WEIGHTS.map((item, index) => (
                <div
                  key={item.weight}
                  className={`grid gap-3 p-5 sm:grid-cols-[7rem_1fr] sm:items-center sm:p-6 ${index ? "border-t border-hairline" : ""}`}
                >
                  <div>
                    <p className="latin text-xs font-semibold text-brand-bright">{item.label}</p>
                    <p className="latin mt-1 text-xs text-ice-faint">{item.weight}</p>
                  </div>
                  <p className="text-xl leading-relaxed text-ice sm:text-2xl" style={{ fontWeight: item.weight }}>
                    {item.sample}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-6 rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
            <p className="text-xs font-semibold text-brand-bright">عينة اسم الشعار</p>
            <p className="mt-4 max-w-4xl text-2xl font-bold leading-[1.6] tracking-tight text-ice sm:text-4xl">
              بركسل · BRXEL
            </p>
            <p className="latin mt-6 text-lg leading-8 text-ice-muted">
              عينة الاسم في الخط المقترح
            </p>
          </div>
        </Reveal>
      </Section>

      <Section
        eyebrow="خيارات الخط الإنجليزي"
        title="اختر شكل حروف BRXEL"
        lead="اعتمدنا Nexa للاسم اللاتيني في الشعار. استعرض أوزانه التسعة أدناه."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoFontOptions locale="ar" />
      </Section>
    </>
  );
}
