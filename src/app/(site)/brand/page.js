import { Type } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import BrandPalette from "@/components/brand/BrandPalette";
import LogoFontOptions from "@/components/brand/LogoFontOptions";
import LogoOptionsHero from "@/components/brand/LogoOptionsHero";
import LogoShowcase from "@/components/brand/LogoShowcase";
import LogoStudy from "@/components/brand/LogoStudy";
import LogoOptions66 from "@/components/brand/LogoOptions66";
import LogoJourney from "@/components/brand/LogoJourney";
import LogoReferences from "@/components/brand/LogoReferences";
import BrandFolder from "@/components/brand/BrandFolder";

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
      <LogoOptionsHero locale="ar" />

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
        id="core"
        eyebrow="خيار أول · جدران متساوية"
        title="النواة: الداخل يتبع الخارج"
        lead="حروف كبيرة ثقيلة على شبكة من 17 وحدة. كل فراغ داخلي يكرر انحناءة حرفه، فتبقى الجدران متساوية، وكل زاوية مستديرة تتجه نحو الـX البرتقالي."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoStudy study="core" locale="ar" />
      </Section>

      <Section
        id="blade"
        eyebrow="خيار ثانٍ · أكثر قوة"
        title="النصل: كل حرف قطعه الخط البرتقالي"
        lead="حروف كبيرة ثقيلة على الشبكة نفسها. الخط البرتقالي نصلٌ يخرج من الكلمة فوق الحروف وتحتها، وكل حرف يحمل أثره: زاويتان مقطوعتان بزاوية &lrm;66° توازيانه."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoStudy study="blade" locale="ar" />
      </Section>

      <Section
        id="options"
        eyebrow="خيارات جديدة"
        title="خيارات جديدة على زاوية &lrm;66°"
        lead="الزاوية مأخوذة من الحرف B نفسه: رمزه في ASCII هو 66. نستخدم الرقم زاويةً فقط، ولا نرسمه شكلًا. هذه خيارات للمراجعة، والشعار المعتمد أعلاه باقٍ كما هو."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoOptions66 locale="ar" />
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
        lead="زوايا الحروف كلها &lrm;45°: الـB والـR تُقصّ من اليمين، والـE والـL من اليسار، فتلتقي الكلمة عند الـX. وقطرا الـX بزاوية &lrm;50° ليبقى عرضه قريبًا من عرض بقية الحروف."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <figure className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#150C09]" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo/brxel-logo-construction.svg"
              alt="شبكة بناء شعار BRXEL: قصّات &lrm;45° عند الـB والـE، وقطر الـX بزاوية &lrm;50°."
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
        eyebrow="مسار الشعار"
        title="من اتجاه البيكسل إلى الشعار المعتمد"
        lead="أربع مراحل مرّ بها الشعار، مرتّبة من الأقدم إلى الأحدث، مع ما تغيّر في كل مرحلة والملفات التي تخصّها في مجلد العمل."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoJourney locale="ar" />
      </Section>

      <Section
        eyebrow="المراجع"
        title="لوحة الإلهام"
        lead="44 مرجعًا جُمعت أثناء العمل على الشعار: 15 مختارة، و29 أخرى. تحتها ما يتكرر فيها ويفسّر اتجاه الشعار الحالي."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoReferences locale="ar" />
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

      <Section
        eyebrow="مجلد العمل"
        title="كل ما في مجلد الهوية"
        lead="جرد لمحتويات مجلد brand-brinding: أين يوجد كل ملف، وما الذي يُستخدم منه اليوم."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <BrandFolder locale="ar" />
        </Reveal>
      </Section>
    </>
  );
}
