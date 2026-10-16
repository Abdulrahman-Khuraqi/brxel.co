// What is inside the brand-brinding working folder, as counted on 14 Oct 2026.
const STATS = [
  { value: "313", ar: "ملفًا", en: "files" },
  { value: "20 MB", ar: "الحجم", en: "on disk" },
  { value: "3", ar: "نسخ هندسية", en: "geometric builds" },
  { value: "44", ar: "مرجعًا بلا تكرار", en: "unique references" },
];

const ROWS = [
  {
    path: "svg/",
    count: 10,
    ar: "الشعار المعتمد كمتجهات: خلفية داكنة وفاتحة، لون واحد (كريمي وداكن)، الشعار مع الاسم العربي، الرمز، الأيقونة، وصورة الحساب.",
    en: "The approved logo as vectors: on dark and on light, one colour (cream and ink), the bilingual lockup, the symbol, the icon and the avatar.",
  },
  {
    path: "png/",
    count: 17,
    ar: "تصدير الشعار المعتمد: نسخ \u200E@4x\u200E، أيقونات 32 و180 و192 و512 بكسل بلونين، وfavicon.ico.",
    en: "Exports of the approved logo: @4x versions, icons at 32, 180, 192 and 512 px in two colours, and favicon.ico.",
  },
  {
    path: "boards/",
    count: 7,
    ar: "لوحات العرض: النظرة العامة، شبكة البناء (بنسختين)، وخيارات الـX الأربعة.",
    en: "Presentation boards: the overview, the construction grid (two versions) and the four X options.",
  },
  {
    path: "v1/",
    count: 34,
    ar: "شعار 2021 الأصلي (PNG وملف Illustrator)، وأول نسخة هندسية كاملة مع لوحاتها والكود الذي يرسمها.",
    en: "The original 2021 logo (PNG and Illustrator file), plus the first full geometric build with its boards and the code that draws it.",
  },
  {
    path: "v2/",
    count: 35,
    ar: "النسخة الهندسية الثانية كاملة، مع لوحة خيارات الـB ولوحة مقارنة v1 بـv2.",
    en: "The second full geometric build, with the B options board and the v1-versus-v2 comparison.",
  },
  {
    path: "core/",
    count: 29,
    ar: "الخيار 83، «النواة»: حروف كبيرة ثقيلة يتبع كل فراغ فيها انحناءة حرفه. الملفات: الشعار بأربع نسخ، الرمز، الأيقونة، الشبكة، مخطط المسافات، لوحة العرض، وتصدير PNG، مع الكود.",
    en: "Option 83, Core: heavy capitals whose inner spaces follow the curve of each letter. Its files: the logo in four versions, the symbol, the icon, the grid, the spacing chart, the overview board and PNG exports, with the code.",
  },
  {
    path: "blade/",
    count: 29,
    ar: "الخيار 84، «النصل»: الخط البرتقالي يخرج من الكلمة، وكل حرف مقطوع من زاويتين متقابلتين بزاوية ‎66°. الملفات نفسها التي في الخيار 83: الشعار بأربع نسخ، الرمز، الأيقونة، الشبكة، مخطط المسافات، لوحة العرض، وتصدير PNG، مع الكود.",
    en: "Option 84, Blade: the Ember stroke runs out of the word, and every letter has two opposite corners cut at 66°. The same set of files as option 83: the logo in four versions, the symbol, the icon, the grid, the spacing chart, the overview board and PNG exports, with the code.",
  },
  {
    path: "options-66/",
    count: 13,
    ar: "خيارات 14 أكتوبر على زاوية \u200E66°: شكلان للاسم ورمزان للـB، مع لوحة المراجعة والكود الذي يرسمها.",
    en: "The 14 October options on the 66° angle: two wordmarks and two B marks, with the review board and the code that draws them.",
  },
  {
    path: "NEW-VERSIONS-TRY/",
    count: 12,
    ar: "تجارب سبتمبر: شعار البيكسل (3 ملفات SVG وPNG)، ثلاثة تصوّرات مولّدة بحروف كبيرة، ونسخ من ملفات الشعار المعتمد.",
    en: "The September trials: the pixel wordmark (3 SVGs and a PNG), three generated concepts in capitals, and copies of the approved logo files.",
  },
  {
    path: "ref/",
    count: 50,
    ar: "كل المراجع: 29 صورة لشعارات أخرى غير المختارة، 9 صور مولّدة أغلبها تصوّرات لـBRXEL، ملفات شعار البيكسل، وبعض النسخ المكررة.",
    en: "Every reference: 29 images of other logos beyond the picks, 9 generated images (mostly BRXEL concepts), the pixel wordmark files, and a few duplicates.",
  },
  {
    path: "ref/best/",
    count: 15,
    ar: "المراجع المختارة، وهي الأقرب للاتجاه الحالي.",
    en: "The picked references, the ones closest to the current direction.",
  },
  {
    path: "build_logo.py · build_boards.py · README.md",
    count: 3,
    ar: "مصدر الشعار: هندسة الحروف بالأرقام، وكود اللوحات، وقواعد الاستخدام. أي تعديل يبدأ من هنا ثم يُعاد التصدير.",
    en: "The logo's source: the letter geometry in numbers, the board code and the usage rules. Any change starts here, then everything is re-exported.",
  },
];

const RULES = {
  ar: [
    "مساحة فارغة حول الشعار تساوي نصف ارتفاع الحرف من كل جهة.",
    "أصغر حجم للشعار: 14 بكسل ارتفاعًا على الشاشة أو 5 مم في الطباعة؛ وما دون ذلك تُستخدم الأيقونة.",
    "الخط البرتقالي هو الجزء الملوّن الوحيد. لا تُلوَّن بقية الحروف ولا يُحرَّك الخط.",
    "على خلفية برتقالية تُستخدم نسخة اللون الواحد: كريمي أو داكن.",
  ],
  en: [
    "Keep clear space of half the cap height on every side.",
    "Minimum size: 14 px tall on screen or 5 mm in print; below that, use the icon.",
    "The Ember stroke is the only coloured part. Don't recolour other letters or move the stroke.",
    "On an Ember background use the one-colour version: cream or ink.",
  ],
};

const copy = {
  ar: { direction: "rtl", folder: "المجلد", contents: "المحتوى", files: "الملفات", rulesTitle: "قواعد الاستخدام من ملف README" },
  en: { direction: "ltr", folder: "Folder", contents: "Contents", files: "Files", rulesTitle: "Usage rules from the README" },
};

/** Inventory of the logo working folder, plus the usage rules its README sets. */
export default function BrandFolder({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const text = copy[language];

  return (
    <div dir={text.direction} lang={language} className="mt-12">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.en} className="rounded-xl border border-white/10 bg-[#0C0705]/70 p-4 text-start">
            <dd className="latin text-2xl font-bold text-brand-bright" dir="ltr">{stat.value}</dd>
            <dt className="mt-1 text-xs font-semibold text-[#C9BCAC]">{stat[language]}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-4 overflow-hidden rounded-2xl border border-hairline bg-surface">
        <table className="w-full text-start text-sm">
          <thead className="hidden border-b border-hairline text-xs font-semibold text-ice-faint sm:table-header-group">
            <tr>
              <th scope="col" className="px-5 py-3 text-start font-semibold">{text.folder}</th>
              <th scope="col" className="px-5 py-3 text-start font-semibold">{text.contents}</th>
              <th scope="col" className="px-5 py-3 text-end font-semibold">{text.files}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, index) => (
              <tr key={row.path} className={`grid gap-2 p-5 sm:table-row sm:p-0 ${index ? "border-t border-hairline" : ""}`}>
                <th scope="row" className="text-start align-top font-normal sm:w-64 sm:px-5 sm:py-4">
                  <code dir="ltr" className="latin inline-block rounded-md border border-white/10 bg-black/20 px-2 py-1 text-xs text-ice">{row.path}</code>
                </th>
                <td className="align-top leading-7 text-ice-muted sm:px-5 sm:py-4">{row[language]}</td>
                <td className="latin align-top text-xs font-semibold text-brand-bright sm:px-5 sm:py-4 sm:text-end sm:text-sm">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section aria-labelledby="logo-rules-title" className="mt-6 rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
        <h3 id="logo-rules-title" className="text-start text-base font-semibold text-ice">{text.rulesTitle}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {RULES[language].map((rule, index) => (
            <li key={rule} className="flex gap-3 rounded-xl border border-white/10 bg-[#0C0705]/60 p-4 text-start">
              <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
              <p className="text-sm leading-7 text-ice-muted">{rule}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
