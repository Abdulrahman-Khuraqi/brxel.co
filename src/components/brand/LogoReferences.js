import OptionNumber from "@/components/brand/OptionNumber";

// Web copies of brand-brinding/ref, deduplicated: `best` is ref/best, `more` is the rest of ref.
// One row per image: its fixed page number, its file (01.webp, 02.webp, …) and its size.
const BEST = [
  { no: 28, file: "01", w: 720, h: 720 },
  { no: 29, file: "02", w: 720, h: 720 },
  { no: 30, file: "03", w: 405, h: 720 },
  { no: 31, file: "04", w: 680, h: 720 },
  { no: 32, file: "05", w: 720, h: 720 },
  { no: 33, file: "06", w: 720, h: 720 },
  { no: 34, file: "07", w: 720, h: 720 },
  { no: 35, file: "08", w: 720, h: 480 },
  { no: 36, file: "09", w: 720, h: 540 },
  { no: 37, file: "10", w: 720, h: 540 },
  { no: 38, file: "11", w: 720, h: 540 },
  { no: 39, file: "12", w: 720, h: 720 },
  { no: 40, file: "13", w: 405, h: 720 },
  { no: 41, file: "14", w: 720, h: 720 },
  { no: 42, file: "15", w: 576, h: 720 },
];
const MORE = [
  { no: 43, file: "01", w: 720, h: 720 },
  { no: 44, file: "02", w: 720, h: 720 },
  { no: 45, file: "03", w: 600, h: 601 },
  { no: 46, file: "04", w: 720, h: 458 },
  { no: 47, file: "05", w: 720, h: 720 },
  { no: 48, file: "06", w: 720, h: 463 },
  { no: 49, file: "07", w: 720, h: 456 },
  { no: 50, file: "08", w: 540, h: 720 },
  { no: 51, file: "09", w: 720, h: 720 },
  { no: 52, file: "10", w: 602, h: 720 },
  { no: 53, file: "11", w: 720, h: 416 },
  { no: 54, file: "12", w: 720, h: 556 },
  { no: 55, file: "13", w: 720, h: 540 },
  { no: 56, file: "14", w: 400, h: 300 },
  { no: 57, file: "15", w: 576, h: 720 },
  { no: 58, file: "16", w: 700, h: 700 },
  { no: 59, file: "17", w: 720, h: 480 },
  { no: 60, file: "18", w: 720, h: 405 },
  { no: 61, file: "19", w: 720, h: 405 },
  { no: 62, file: "20", w: 720, h: 540 },
  { no: 63, file: "21", w: 720, h: 355 },
  { no: 64, file: "22", w: 576, h: 720 },
  { no: 65, file: "23", w: 720, h: 480 },
  { no: 66, file: "24", w: 720, h: 540 },
  { no: 67, file: "25", w: 576, h: 720 },
  { no: 68, file: "26", w: 720, h: 720 },
  { no: 69, file: "27", w: 720, h: 540 },
  { no: 70, file: "28", w: 541, h: 720 },
  { no: 71, file: "29", w: 720, h: 593 },
];

const copy = {
  ar: {
    direction: "rtl",
    bestTitle: "المختارة",
    bestNote: "مجلد ref/best: المراجع الأقرب لما نريده.",
    moreTitle: "بقية المراجع",
    moreNote: "مجلد ref: كل ما جُمع أثناء البحث.",
    count: (n) => `${n} مرجعًا`,
    alt: (n) => `مرجع ${n}`,
    patternsTitle: "ما يتكرر في المراجع",
    patterns: [
      { title: "حروف كبيرة ممتدة وثقيلة", body: "الاسم كله هو الشعار، بحروف عريضة هندسية.", names: "EQUIP · UNIQOS · ROZER · QUEST · SIVOX · VIKAS" },
      { title: "لون واحد على أرضية داكنة", body: "أسود أو شبه أسود، ولون مميّز واحد فقط.", names: "Koff · Roft · ridr · lab's · ROZER" },
      { title: "عنصر مميّز داخل الكلمة", body: "نقطة أو خط مائل أو قصّة تحمل اللون وتصير هي العلامة.", names: "Koff. · ridr. · lab's · SCORX · adlore · thrive" },
      { title: "حرف B كرمز مستقل", body: "حرف واحد مقصوص من أشكال هندسية، يصلح أيقونةً.", names: "9 مراجع لحرف الـB" },
      { title: "الشعار مع شبكة بنائه", body: "عرض الخطوط والقياسات مع الشعار نفسه.", names: "Praxen · Nestara · UNIQOS · FOLC" },
    ],
    credit: "هذه أعمال لمصممين وعلامات أخرى، جُمعت للاستلهام الداخلي فقط. ليست من أعمال BRXEL ولا تُستخدم خارج هذه الصفحة.",
  },
  en: {
    direction: "ltr",
    bestTitle: "The picks",
    bestNote: "The ref/best folder: the references closest to what we want.",
    moreTitle: "The rest",
    moreNote: "The ref folder: everything collected during research.",
    count: (n) => `${n} references`,
    alt: (n) => `Reference ${n}`,
    patternsTitle: "What repeats across the references",
    patterns: [
      { title: "Extended, heavy capitals", body: "The whole name is the logo, in wide geometric letters.", names: "EQUIP · UNIQOS · ROZER · QUEST · SIVOX · VIKAS" },
      { title: "One colour on a dark ground", body: "Black or near-black, and a single signature colour.", names: "Koff · Roft · ridr · lab's · ROZER" },
      { title: "An accent inside the word", body: "A dot, a slash or a cut carries the colour and becomes the mark.", names: "Koff. · ridr. · lab's · SCORX · adlore · thrive" },
      { title: "The B as a standalone symbol", body: "A single letter cut from geometric shapes, usable as an icon.", names: "9 references for the B" },
      { title: "The logo with its construction grid", body: "Lines and measurements shown alongside the mark itself.", names: "Praxen · Nestara · UNIQOS · FOLC" },
    ],
    credit: "These are works by other designers and brands, collected for internal inspiration only. They are not BRXEL work and are not used outside this page.",
  },
};

function Board({ group, items, columns, altFor }) {
  return (
    <ul className={`mt-5 gap-3 ${columns}`}>
      {items.map((item) => (
        <li key={item.no} className="relative mb-3 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-[#0C0705]">
          <OptionNumber no={item.no} className="absolute start-2 top-2" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/brand/ref/${group}/${item.file}.webp`} alt={altFor(item.no)} width={item.w} height={item.h} loading="lazy" className="h-auto w-full" />
        </li>
      ))}
    </ul>
  );
}

function Heading({ title, note, count }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 text-start">
      <div>
        <h3 className="text-lg font-semibold text-ice">{title}</h3>
        <p className="mt-1 text-sm text-ice-muted">{note}</p>
      </div>
      <span className="text-xs font-medium text-brand-bright">{count}</span>
    </div>
  );
}

/** The reference board behind the logo: the picks, what they have in common, then everything else. */
export default function LogoReferences({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const text = copy[language];

  return (
    <div dir={text.direction} lang={language} className="mt-12">
      <Heading title={text.bestTitle} note={text.bestNote} count={text.count(BEST.length)} />
      <Board group="best" items={BEST} columns="columns-2 sm:columns-3 lg:columns-4" altFor={text.alt} />

      <section aria-labelledby="reference-patterns-title" className="mt-8 rounded-3xl border border-brand/20 bg-[#0C0705] p-5 sm:p-7">
        <h3 id="reference-patterns-title" className="text-start text-base font-semibold text-ice">{text.patternsTitle}</h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {text.patterns.map((pattern, index) => (
            <li key={pattern.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-start">
              <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
              <p className="mt-2 text-sm font-semibold text-ice">{pattern.title}</p>
              <p className="mt-1 text-sm leading-6 text-ice-muted">{pattern.body}</p>
              <p className="mt-3 text-xs leading-5 text-ice-faint" dir="auto">{pattern.names}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Heading title={text.moreTitle} note={text.moreNote} count={text.count(MORE.length)} />
        <Board group="more" items={MORE} columns="columns-3 sm:columns-4 lg:columns-6" altFor={text.alt} />
      </div>

      <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-start text-xs leading-6 text-ice-muted">{text.credit}</p>
    </div>
  );
}
