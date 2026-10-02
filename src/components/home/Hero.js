import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";

/** Five real projects fanned under the headline; `i` is the offset from the centre card. */
const FAN = [
  { i: -2, src: "/work/print/print-1.png", alt: "بطاقات أعمال معهد ليلون" },
  { i: -1, src: "/work/social/chocosarayi.webp", alt: "تصميم سوشيال ميديا لشوكولاتة سرايا" },
  { i: 0, src: "/work/web/hm.webp", alt: "واجهات موقع استوديو هيفاء المعمر" },
  { i: 1, src: "/work/social/pegas.webp", alt: "منشور سوشيال ميديا لوكالة بيغاس" },
  { i: 2, src: "/work/web/ensha.webp", alt: "واجهات منصة إنشاء العقارية" },
];

/** A slowly turning seal that links to the brief form. */
function Seal() {
  return (
    <a
      href="/contact/"
      aria-label="ابدأ مشروعك"
      className="group absolute -left-10 -top-10 z-20 flex h-28 w-28 items-center justify-center rounded-full bg-void/85 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.9)] backdrop-blur-sm sm:-left-14 sm:-top-14 sm:h-36 sm:w-36"
    >
      <svg viewBox="0 0 160 160" className="seal-spin absolute inset-0 h-full w-full text-ice-muted" aria-hidden="true">
        <defs>
          <path id="seal-ring" d="M80 80 m-62 0 a62 62 0 1 1 124 0 a62 62 0 1 1 -124 0" />
        </defs>
        <text fontSize="11.5" fontWeight="600" fill="currentColor" style={{ direction: "ltr" }}>
          <textPath href="#seal-ring" textLength="386" lengthAdjust="spacing">BRXEL · GRAPHIC DESIGN · SAUDI ARABIA ·</textPath>
        </text>
      </svg>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand sm:h-16 sm:w-16 text-[#150C09] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
        <ArrowUpLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.25} aria-hidden="true" />
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-void">
      {/* Ground: ink, a gold glow from above, and faint 66° rules — the angle of the X. */}
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_-5%,rgb(242_161_44/0.2),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="slash-rules absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 pt-14 text-center sm:px-6 sm:pt-20">
        <Reveal>
          <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline-strong bg-surface px-4 py-1.5 text-xs font-semibold text-ice-muted">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="pulse-dot absolute inset-0 rounded-full bg-brand" />
              <span className="relative h-2 w-2 rounded-full bg-brand" />
            </span>
            متاحون لمشاريع جديدة هذا الشهر
          </p>
        </Reveal>

        <Reveal delay={90}>
          <div className="mt-8">
            <h1 className="text-[clamp(3.1rem,11vw,8.75rem)] font-bold leading-[1.28] tracking-[-0.01em] text-ice">
              فنٌّ في
              <span className="flex items-center justify-center gap-[0.12em]">
                <Spark className="h-[0.62em] w-[0.62em] shrink-0 text-brand" />
                <span className="headline-accent">كل بكسل</span>
              </span>
            </h1>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-ice-muted sm:text-lg">
            تصميم جرافيكي سعودي: هوية بصرية، سوشيال ميديا، مطبوعات وواجهات، بنطاق عمل مكتوب
            وملفات تسليم تملكها بالكامل.
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact/" className="px-7 py-3.5 text-base">
              ابدأ مشروعك
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <a
              href="/work/"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-sm font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
            >
              تصفّح الأعمال
            </a>
          </div>
        </Reveal>
      </div>

      {/* The fan: real work, not stock. */}
      <div className="hero-fan relative mx-auto mt-10 h-[clamp(18rem,47vw,35rem)] max-w-7xl sm:mt-12" aria-label="من أعمالنا">
        {FAN.map((card, n) => (
          <figure
            key={card.src}
            className={`hero-fan-card ${Math.abs(card.i) === 2 ? "hidden sm:block" : ""}`}
            style={{ "--i": card.i, "--a": Math.abs(card.i), "--n": n }}
          >
            {card.i === 0 ? <Seal /> : null}
            <div className="hero-fan-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.alt}
                width={600}
                height={600}
                loading={card.i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          </figure>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-b from-transparent to-void" aria-hidden="true" />
      </div>
    </section>
  );
}
