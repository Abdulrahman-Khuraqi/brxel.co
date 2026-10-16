import Logo from "@/components/brand/BrxelLogo";
import OptionNumber from "@/components/brand/OptionNumber";

const J = "/brand/journey";

// Every stage of the mark, oldest first. Images are web copies of the files named in `files`
// (paths inside the brand-brinding working folder).
const STAGES = [
  {
    id: "pixel",
    files: ["ref/brxel-logo.svg", "ref/brxel-logo-dark.svg", "NEW-VERSIONS-TRY/brxel-logo.png", "ref/*.png"],
    ar: {
      date: "8 سبتمبر 2026",
      title: "اتجاه البيكسل",
      body: "حروف مبنية من مربعات، ومربع برتقالي واحد يمثّل البيكسل: مرّة فوق الـx ومرّة داخل الـB. منه خرجت أول نسخة متجهة، وملفاتها تحمل ألوان الهوية الحالية: برتقالي وداكن وكريمي.",
    },
    en: {
      date: "8 September 2026",
      title: "The pixel direction",
      body: "Letters built from squares, with one Ember square standing for the pixel: on the x in some versions, inside the B in others. It produced the first vector mark, and its vector files already carry today's palette: Ember, Ink and Cream.",
    },
    media: [
      { no: 12, src: "/brand/brxel-logo-transparent.svg", w: 715, h: 158, ground: "dark", fit: "logo", span: "col-span-full", ar: "النسخة المتجهة", en: "Vector mark" },
      { no: 13, src: `${J}/pixel-concept-3.webp`, w: 900, h: 900, ar: "تصوّر مولّد 1", en: "Generated concept 1" },
    ],
  },
  {
    id: "caps",
    files: ["NEW-VERSIONS-TRY/ChatGPT Image Sep 23 *.png", "ref/ChatGPT Image Sep 29 *.png"],
    ar: {
      date: "23 – 29 سبتمبر 2026",
      title: "العودة إلى الحروف الكبيرة",
      body: "أربعة تصوّرات مولّدة بحروف كبيرة ممتدة. انتقل البرتقالي من المربع إلى الـX، وصار الـX مركز الكلمة.",
    },
    en: {
      date: "23 – 29 September 2026",
      title: "Back to capitals",
      body: "Four generated concepts in extended capitals. Ember moved from the square to the X, and the X became the centre of the word.",
    },
    media: [
      { no: 19, src: `${J}/caps-concept-1.webp`, w: 900, h: 900, ar: "23 سبتمبر · 1", en: "23 Sep · 1" },
      { no: 20, src: `${J}/caps-concept-2.webp`, w: 900, h: 900, ar: "23 سبتمبر · 2", en: "23 Sep · 2" },
      { no: 22, src: `${J}/caps-draft-1.webp`, w: 900, h: 300, ground: "dark", fit: "contain", ar: "29 سبتمبر · مسودة 1", en: "29 Sep · draft 1" },
      { no: 23, src: `${J}/caps-draft-2.webp`, w: 900, h: 360, ar: "29 سبتمبر · مسودة 2", en: "29 Sep · draft 2" },
    ],
  },
  {
    id: "v2",
    files: ["v2/svg/", "v2/png/", "v2/boards/", "v2/build_logo_v2.py"],
    ar: {
      date: "29 سبتمبر 2026 · v2",
      title: "الخط البرتقالي يقطع الكلمة",
      body: "الشعار مرسوم بالكود لا باليد، وكل قطر وكل قصّة بزاوية \u200E66°. الخط الصاعد في الـX برتقالي كامل ويقطع الكلمة.",
    },
    en: {
      date: "29 September 2026 · v2",
      title: "The Ember stroke cuts through",
      body: "The mark is drawn in code, not by hand, and every diagonal and every cut runs at 66°. The rising stroke of the X is fully Ember and cuts through the word.",
    },
    media: [
    ],
  },
  {
    id: "final",
    current: true,
    files: ["svg/", "png/", "boards/", "build_logo.py"],
    ar: {
      date: "29 سبتمبر 2026 · الحالي",
      title: "الشعار المعتمد",
      body: "حروف ممتدة وثقيلة. القصّات صارت \u200E45° وكلها تتجه نحو الـX، وقطرا الـX \u200E50°. من أربعة أشكال للـX اختير الأول: خط برتقالي كامل، والخط الكريمي يتوقف قبله من الجهتين.",
    },
    en: {
      date: "29 September 2026 · current",
      title: "The approved logo",
      body: "Extended, heavy letters. The cuts became 45° and all face the X, with the X diagonals at 50°. Of four shapes for the X, the first was chosen: a whole Ember stroke, with the cream stroke stopping short of it on both sides.",
    },
    media: [
      { logo: true, span: "col-span-full", ar: "الشعار الحالي", en: "Current logo" },
      { no: 27, src: `${J}/x-options.webp`, w: 1385, h: 1400, fit: "natural", span: "col-span-full", ar: "أربعة خيارات للـX · المعتمد رقم 1", en: "Four options for the X · no. 1 approved" },
    ],
  },
];

const GROUNDS = {
  dark: "bg-[#150C09]",
  light: "bg-[#F7F1E6]",
};

function Shot({ item, language }) {
  const label = item[language];
  const ground = GROUNDS[item.ground] ?? GROUNDS.dark;

  let picture;
  if (item.logo) {
    picture = (
      <div className={`flex min-h-36 items-center justify-center px-6 py-10 text-[#F7F1E6] ${ground}`} dir="ltr">
        <Logo className="h-9 w-auto max-w-full sm:h-12" />
      </div>
    );
  } else if (item.fit === "logo") {
    picture = (
      <div className={`flex min-h-36 items-center justify-center px-6 py-10 ${ground}`} dir="ltr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.src} alt={label} width={item.w} height={item.h} loading="lazy" className="h-9 w-auto max-w-full sm:h-12" />
      </div>
    );
  } else if (item.fit === "natural") {
    picture = (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={item.src} alt={label} width={item.w} height={item.h} loading="lazy" className="h-auto w-full" />
    );
  } else {
    picture = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.src}
        alt={label}
        width={item.w}
        height={item.h}
        loading="lazy"
        className={`w-full ${item.crop ?? "aspect-[4/3]"} ${item.fit === "contain" ? "object-contain p-5" : "object-cover"} ${ground}`}
      />
    );
  }

  return (
    <figure className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0C0705] ${item.span ?? ""}`}>
      {item.no ? <OptionNumber no={item.no} className="absolute start-2 top-2 z-10" /> : null}
      {picture}
      <figcaption className="border-t border-white/10 px-3 py-2 text-xs text-ice-muted">{label}</figcaption>
    </figure>
  );
}

/** The logo's history, oldest first: one card per stage with what changed and the files behind it. */
export default function LogoJourney({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const filesLabel = language === "en" ? "Files" : "الملفات";
  const currentLabel = language === "en" ? "Current" : "الحالي";

  return (
    <ol dir={language === "en" ? "ltr" : "rtl"} lang={language} className="mt-12 grid gap-5">
      {STAGES.map((stage, index) => {
        const text = stage[language];
        return (
          <li
            key={stage.id}
            className={`grid gap-6 rounded-3xl border p-5 sm:p-7 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-8 ${stage.current ? "border-brand/35 bg-[#0C0705]" : "border-hairline bg-surface"}`}
          >
            <div className="text-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
                <span className="text-xs font-medium text-ice-muted">{text.date}</span>
                {stage.current ? (
                  <span className="rounded-full border border-brand/35 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-bright">{currentLabel}</span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-bold text-ice">{text.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ice-muted">{text.body}</p>
              <p className="mt-5 text-xs font-semibold text-ice-faint">{filesLabel}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" dir="ltr">
                {stage.files.map((file) => (
                  <li key={file}>
                    <code className="latin rounded-md border border-white/10 bg-black/20 px-2 py-1 text-[11px] text-ice-muted">{file}</code>
                  </li>
                ))}
              </ul>
            </div>

            {stage.media.length ? (
              <div className="grid grid-cols-2 content-start gap-3 sm:grid-cols-3">
                {stage.media.map((item) => (
                  <Shot key={item.src ?? "logo"} item={item} language={language} />
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
