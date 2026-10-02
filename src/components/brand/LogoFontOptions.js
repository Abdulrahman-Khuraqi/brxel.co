const fontOptions = [
  {
    name: "Nexa",
    selected: true,
    style: '"Nexa Trial", sans-serif',
    url: "https://fonts.adobe.com/fonts/nexa",
    ar: "معاينة محلية من ملف Nexa التجريبي المرفق؛ ترخيص الملف للاستخدام الشخصي فقط.",
    en: "Local preview from the attached Nexa trial file; its license is for personal use only.",
  },
];

const nexaWeights = [
  { weight: 100, ar: "رفيع", en: "Thin" },
  { weight: 200, ar: "خفيف جدًا", en: "ExtraLight" },
  { weight: 300, ar: "خفيف", en: "Light" },
  { weight: 400, ar: "عادي", en: "Regular" },
  { weight: 500, ar: "متوسط", en: "Book" },
  { weight: 700, ar: "عريض", en: "Bold" },
  { weight: 800, ar: "عريض جدًا", en: "ExtraBold" },
  { weight: 900, ar: "ثقيل", en: "Heavy" },
  { weight: 950, ar: "أسود", en: "Black" },
];

export default function LogoFontOptions({ locale = "ar" }) {
  const isEnglish = locale === "en";

  return (
    <div lang={isEnglish ? "en" : "ar"} dir={isEnglish ? "ltr" : "rtl"}>
      <div className="max-w-4xl">
        {fontOptions.map((font) => (
          <figure key={font.name} className="overflow-hidden rounded-2xl border border-brand/35 bg-[#0C0705] p-6 shadow-[0_12px_40px_-28px_rgba(232,90,36,0.7)] sm:p-8">
            <figcaption className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ice">{font.name}</span>
              {font.selected ? (
                <span className="rounded-full border border-brand/35 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand-bright">{isEnglish ? "Selected" : "مختار للإنجليزية"}</span>
              ) : (
                <span className="text-xs font-medium text-brand-bright">{isEnglish ? "Selected" : "مختار للإنجليزية"}</span>
              )}
            </figcaption>
            <p lang="en" dir="ltr" className="mt-7 whitespace-nowrap text-center text-4xl font-bold tracking-[0.04em] text-ice sm:text-5xl" style={{ fontFamily: font.style }}>
              BRXEL
            </p>
            <p className="mt-5 min-h-12 text-sm leading-6 text-ice-muted">{font[isEnglish ? "en" : "ar"]}</p>
            {font.url && (
              <a href={font.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center text-xs font-semibold text-brand-bright underline underline-offset-4 hover:text-ice">
                {isEnglish ? "Adobe Fonts web option ↗" : "خيار Nexa عبر Adobe Fonts ↗"}
              </a>
            )}
          </figure>
        ))}
      </div>
      <section className="mt-8 rounded-3xl border border-brand/20 bg-[#0C0705] p-5 sm:p-7" aria-labelledby="nexa-weights-title">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 id="nexa-weights-title" className="text-base font-semibold text-ice">{isEnglish ? "Nexa weight comparison" : "مقارنة أوزان Nexa"}</h3>
            <p className="mt-1 text-sm leading-6 text-ice-muted">{isEnglish ? "The same wordmark in every upright weight included in your file." : "معاينة الاسم بالخط نفسه في جميع الأوزان المستقيمة الموجودة في الملف."}</p>
          </div>
          <span className="text-xs font-medium text-brand-bright">{isEnglish ? "9 weights" : "٩ أوزان"}</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {nexaWeights.map((item) => (
            <figure key={item.weight} className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
              <figcaption className="flex items-center justify-between gap-2 text-xs text-ice-muted">
                <span>{item[isEnglish ? "en" : "ar"]}</span>
                <span className="latin">{item.weight}</span>
              </figcaption>
              <p lang="en" dir="ltr" className="mt-2 whitespace-nowrap text-3xl leading-tight tracking-[0.03em] text-ice" style={{ fontFamily: '"Nexa Trial", sans-serif', fontWeight: item.weight }}>
                BRXEL
              </p>
            </figure>
          ))}
        </div>
      </section>
      <p className="mt-4 text-xs leading-6 text-ice-muted">
        {isEnglish
          ? "The attached Nexa trial is for personal-use preview. Use an Adobe Fonts web project for the site’s licensed webfont."
          : "ملف Nexa المرفق للمعاينة بترخيص شخصي فقط. استخدم مشروع ويب من Adobe Fonts إذا أردت تضمين الخط المرخّص في الموقع."}
      </p>
    </div>
  );
}
