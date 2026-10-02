import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";

const STATS = [
  { value: 380, prefix: "+", label: "مشروعًا مُنجزًا", note: "هويات، حملات، مطبوعات، وواجهات" },
  { value: 120, prefix: "+", label: "عميلًا في السعودية والخليج", note: "من مشاريع ناشئة إلى علامات قائمة" },
  { value: 60, prefix: "+", label: "علامة بنينا هويتها", note: "بأسلوب يناسب كل نشاط" },
  { value: 7, label: "تخصصات تصميم", note: "من الشعار إلى الموشن جرافيك" },
];

export default function Stats() {
  return (
    <section
      id="studio-impact"
      aria-labelledby="studio-impact-title"
      className="relative overflow-hidden border-y border-hairline bg-navy text-ice"
    >
      <div className="slash-rules pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-hairline" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12">
        <Reveal>
          <div className="flex flex-col gap-3 border-b border-hairline pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-brand-bright">بالأرقام</p>
              <h2 id="studio-impact-title" className="mt-2 text-2xl font-bold leading-9 sm:text-3xl">
                أثرٌ يُقاس، لا يُقال.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-ice-muted">
              خلف كل رقم عميل، وملف مُسلّم، وعلامة تعمل في السوق.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ value, prefix, suffix, label, note }, index) => (
            <Reveal key={label} delay={index * 70} className="h-full">
              <div
                className={`relative flex h-full min-h-48 flex-col justify-between py-7 sm:min-h-56 sm:py-9 ${
                  index % 2 === 0 ? "ps-0 pe-5 sm:pe-8" : "border-s border-hairline ps-5 pe-0 sm:ps-8"
                } ${index >= 2 ? "border-t border-hairline lg:border-t-0" : ""} ${
                  index > 0 ? "lg:border-s lg:border-hairline lg:ps-8" : "lg:border-s-0 lg:ps-0"
                } lg:pe-8`}
              >
                <span className="latin self-start text-[10px] font-semibold tracking-[0.25em] text-ice-faint" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <CountUp
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  delay={index * 100}
                  className="headline-accent mt-5 block self-start text-5xl font-extrabold tracking-[-0.06em] sm:text-7xl"
                />
                <div className="mt-5">
                  <p className="text-sm font-bold leading-6 text-ice sm:text-base">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-ice-muted">{note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
