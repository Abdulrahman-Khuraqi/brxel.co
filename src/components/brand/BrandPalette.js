import { Palette } from "lucide-react";

const primaryColors = [
  {
    hex: "#E85A24",
    ar: { name: "برتقالي بركسل", role: "لون الرمز أو التفصيل المميّز" },
    en: { name: "Ember", role: "Signature brand color" },
  },
  {
    hex: "#150C09",
    ar: { name: "حبر داكن", role: "نسخة الشعار الداكنة على خلفية فاتحة" },
    en: { name: "Ink", role: "Dark mark on a light background" },
  },
  {
    hex: "#F7F1E6",
    ar: { name: "كريمي فاتح", role: "نسخة الشعار الفاتحة على خلفية داكنة" },
    en: { name: "Cream", role: "Light mark on a dark background" },
  },
];

const colorGroups = [
  {
    ar: { title: "ألوان مساندة", description: "بدائل محدودة للتفاصيل؛ لا تنافس البرتقالي المميّز." },
    en: { title: "Supporting colors", description: "Limited alternatives for details; keep Ember primary." },
    colors: [
      { hex: "#F2A12C", ar: { name: "ذهبي شمسي", role: "إبراز محدود" }, en: { name: "Sun", role: "Limited highlights" } },
      { hex: "#BF3712", ar: { name: "قرميدي داكن", role: "تباين برتقالي داكن" }, en: { name: "Deep Ember", role: "Dark orange contrast" } },
    ],
  },
];

const copy = {
  ar: {
    direction: "rtl",
    primaryTitle: "ألوان الشعار الأساسية",
    primaryDescription: "النسخ المعتمدة للشعار على الخلفيات الفاتحة والداكنة.",
    primaryBadge: "رئيسية",
    removed: "استُبعد الوردي الفاتح لتجنب تكرار الدرجات الدافئة. يبقى البرتقالي لون الشعار المميّز، ويُستخدم الذهبي والقرميدي للتفاصيل فقط.",
  },
  en: {
    direction: "ltr",
    primaryTitle: "Primary logo colors",
    primaryDescription: "Approved logo versions for light and dark backgrounds.",
    primaryBadge: "PRIMARY",
    removed: "Peach was removed to avoid duplicating warm tones. Keep Ember as the signature logo color; reserve Sun and Deep Ember for details.",
  },
};

export default function BrandPalette({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const text = copy[language];

  return (
    <div dir={text.direction} lang={language}>
      <div className="mt-12 rounded-3xl border border-brand/25 bg-[#0C0705] p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-start">
            <h3 className="text-lg font-semibold text-ice">{text.primaryTitle}</h3>
            <p className="mt-1 text-sm text-ice-muted">{text.primaryDescription}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand-bright">
            <Palette className="h-3.5 w-3.5" aria-hidden="true" />
            {text.primaryBadge}
          </span>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryColors.map((color) => {
            const label = color[language];
            return (
              <li key={color.hex} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                <div className="h-28 border-b border-white/10" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                <div className="grid min-h-24 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 p-4">
                  <div className="min-w-0 text-start">
                    <p className="text-sm font-semibold text-ice">{label.name}</p>
                    <p className="mt-1 text-xs leading-5 text-ice-muted">{label.role}</p>
                  </div>
                  <code dir="ltr" className="latin whitespace-nowrap rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-ice-muted">{color.hex}</code>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {colorGroups.map((group) => {
          const groupText = group[language];
          return (
            <section key={groupText.title} aria-label={groupText.title} className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
              <h3 className="text-start text-base font-semibold text-ice">{groupText.title}</h3>
              <p className="mt-1 text-start text-xs leading-6 text-ice-muted">{groupText.description}</p>
              <ul className="mt-4 grid gap-2.5">
                {group.colors.map((color) => {
                  const label = color[language];
                  return (
                    <li key={color.hex} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/10 bg-[#0C0705]/60 p-3">
                      <span className="h-10 w-10 shrink-0 rounded-lg border border-white/15" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                      <span className="min-w-0 text-start">
                        <span className="block text-sm font-semibold text-ice">{label.name}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-ice-muted">{label.role}</span>
                      </span>
                      <code dir="ltr" className="latin whitespace-nowrap text-[11px] text-ice-muted">{color.hex}</code>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-start text-xs leading-6 text-ice-muted">
        {text.removed}
      </p>
    </div>
  );
}
