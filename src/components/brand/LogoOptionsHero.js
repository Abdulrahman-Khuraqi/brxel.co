"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import OptionNumber from "@/components/brand/OptionNumber";

const J = "/brand/journey";
const DURATION = 4500;

// Every logo option on the brand page, oldest first, each with the number it carries on the page.
// Left out: the references (28–71) and the Nexa weights (72–80). Option 27 is a sheet of four X shapes,
// so the approved one (the current logo) stands for it.
// kind: "word" = vector wordmark, "mark" = vector symbol, "cover" = square concept that fills the stage,
// "wide" = raster wordmark shown whole.
const GROUPS = [
  {
    ar: { date: "8 سبتمبر", title: "اتجاه البيكسل" },
    en: { date: "8 Sep", title: "The pixel direction" },
    items: [
      { no: 12, kind: "word", src: "/brand/brxel-logo-transparent.svg", ar: "النسخة المتجهة", en: "Vector mark" },
      { no: 13, kind: "cover", src: `${J}/pixel-concept-3.webp`, ar: "تصوّر مولّد", en: "Generated concept" },
    ],
  },
  {
    ar: { date: "23 – 29 سبتمبر", title: "العودة إلى الحروف الكبيرة" },
    en: { date: "23 – 29 Sep", title: "Back to capitals" },
    items: [
      { no: 19, kind: "cover", src: `${J}/caps-concept-1.webp`, ar: "تصوّر 23 سبتمبر · 1", en: "23 Sep concept 1" },
      { no: 20, kind: "cover", src: `${J}/caps-concept-2.webp`, ar: "تصوّر 23 سبتمبر · 2", en: "23 Sep concept 2" },
      { no: 22, kind: "wide", src: `${J}/caps-draft-1.webp`, ar: "مسودة 29 سبتمبر · 1", en: "29 Sep draft 1" },
      { no: 23, kind: "wide", src: `${J}/caps-draft-2.webp`, ar: "مسودة 29 سبتمبر · 2", en: "29 Sep draft 2" },
    ],
  },
  {
    ar: { date: "29 سبتمبر", title: "الشعار المعتمد" },
    en: { date: "29 Sep", title: "The approved logo" },
    items: [
      { no: 27, kind: "word", src: "/brand/logo/brxel-logo-on-dark.svg", current: true, ar: "الخط البرتقالي يقطع الكلمة", en: "The Ember stroke cuts through" },
    ],
  },
  {
    ar: { date: "14 أكتوبر", title: "قاعدة الـ‎66°" },
    en: { date: "14 Oct", title: "The 66° rule" },
    items: [
      { no: 10, kind: "mark", src: "/brand/options/brxel-66-mark-forward-on-dark.svg", ar: "الخط ثم B", en: "Stroke, then B" },
    ],
  },
  {
    ar: { date: "14 أكتوبر", title: "شبكة الـ17 وحدة" },
    en: { date: "14 Oct", title: "The 17-unit grid" },
    items: [
      { no: 83, kind: "word", src: "/brand/core/brxel-core-logo-on-dark.svg", ar: "النواة", en: "Core", href: "#core" },
      { no: 84, kind: "word", src: "/brand/blade/brxel-blade-logo-on-dark.svg", ar: "النصل", en: "Blade", href: "#blade" },
    ],
  },
  {
    ar: { date: "15 أكتوبر", title: "من الخيار 27" },
    en: { date: "15 Oct", title: "From option 27" },
    items: [
      { no: 85, kind: "word", src: "/brand/pixel-x/brxel-pixelx-logo-on-dark.svg", ar: "X البيكسل", en: "Pixel X" },
    ],
  },
];

const OPTIONS = GROUPS.flatMap((group, groupIndex) => group.items.map((item) => ({ ...item, groupIndex })));
const START = OPTIONS.findIndex((item) => item.current);

/** "11 خيارًا", "3 خيارات": Arabic counts take the plural from 3 to 10 and the singular from 11 up. */
function arabicCount(n) {
  if (n === 1) return "خيار واحد";
  if (n === 2) return "خياران";
  return n <= 10 ? `${n} خيارات` : `${n} خيارًا`;
}

const COPY = {
  ar: {
    dir: "rtl",
    eyebrow: "بناء شعار BRXEL",
    title: ["عنصر العلامة،", `في ${arabicCount(OPTIONS.length)}`],
    lead: "BRXEL مستوحى من Brand Element، كما جاءت Pixel من Picture Element. هنا كل شعار رسمناه له، برقمه، من الأقدم إلى الأحدث. اطلب أي تعديل بالرقم.",
    stats: [
      { value: OPTIONS.length, label: "خيارًا للشعار" },
      { value: GROUPS.length, label: "مراحل" },
    ],
    range: "8 سبتمبر – 15 أكتوبر 2026",
    strip: "خيارات الشعار",
    prev: "الخيار السابق",
    next: "الخيار التالي",
    play: "تشغيل العرض",
    pause: "إيقاف العرض",
    current: "المعتمد",
    details: "التفاصيل",
  },
  en: {
    dir: "ltr",
    eyebrow: "Building the BRXEL logo",
    title: ["The brand element,", `in ${OPTIONS.length} options`],
    lead: "BRXEL comes from Brand Element, the way pixel comes from Picture Element. Here is every logo we drew for it, numbered and oldest first. Ask for any change by number.",
    stats: [
      { value: OPTIONS.length, label: "logo options" },
      { value: GROUPS.length, label: "stages" },
    ],
    range: "8 Sep – 15 Oct 2026",
    strip: "Logo options",
    prev: "Previous option",
    next: "Next option",
    play: "Play the slideshow",
    pause: "Pause the slideshow",
    current: "Approved",
    details: "Details",
  },
};

const pad = (n) => String(n).padStart(2, "0");

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => window.matchMedia(MOTION_QUERY).matches;
function subscribeMotion(onChange) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The option itself, sized for its kind. Rasters fade out at the edges so they sit in the stage. */
function Artwork({ item, size }) {
  const stage = size === "stage";
  const fade = "[mask-image:radial-gradient(closest-side,#000_70%,transparent)]";
  const classes = {
    word: stage ? "h-auto max-h-[44%] w-[min(74%,52rem)] object-contain" : "h-auto w-[78%] object-contain",
    mark: stage ? "h-[52%] w-auto object-contain" : "h-[58%] w-auto object-contain",
    cover: stage ? `absolute inset-0 h-full w-full object-cover ${fade}` : "absolute inset-0 h-full w-full object-cover",
    wide: stage ? `h-auto w-[min(86%,56rem)] object-contain ${fade}` : "h-auto w-full object-contain",
  };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.src} alt="" className={classes[item.kind]} draggable={false} />
  );
}

/**
 * The brand page's hero: every logo option on one stage. The selected option fills the stage with its
 * number set huge behind it; a numbered strip below holds every option, grouped by stage. It plays
 * through on its own until someone picks an option (or prefers reduced motion), and pauses while hovered
 * or focused.
 */
export default function LogoOptionsHero({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const text = COPY[language];
  const rtl = text.dir === "rtl";

  const [index, setIndex] = useState(START);
  // null until someone presses play or pause: then it plays unless they prefer reduced motion.
  const [choice, setPlaying] = useState(null);
  const reduceMotion = useSyncExternalStore(subscribeMotion, prefersReducedMotion, () => false);
  const playing = choice ?? !reduceMotion;
  const [hold, setHold] = useState(false);
  const stripRef = useRef(null);
  const tabRefs = useRef([]);

  const item = OPTIONS[index];
  const group = GROUPS[item.groupIndex][language];
  const go = (next) => setIndex((next + OPTIONS.length) % OPTIONS.length);

  useEffect(() => {
    if (!playing || hold) return undefined;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % OPTIONS.length), DURATION);
    return () => clearTimeout(timer);
  }, [playing, hold, index]);

  // Keep the selected thumbnail in view by scrolling the strip only, never the page.
  useEffect(() => {
    const strip = stripRef.current;
    const tab = tabRefs.current[index];
    if (!strip || !tab) return;
    const box = strip.getBoundingClientRect();
    const r = tab.getBoundingClientRect();
    const margin = 32;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (r.left < box.left + margin) strip.scrollBy({ left: r.left - box.left - margin, behavior });
    else if (r.right > box.right - margin) strip.scrollBy({ left: r.right - box.right + margin, behavior });
  }, [index]);

  const pick = (next, focus = false) => {
    setPlaying(false);
    go(next);
    if (focus) tabRefs.current[(next + OPTIONS.length) % OPTIONS.length]?.focus();
  };

  const onKeyDown = (event) => {
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const moves = { [forward]: index + 1, [back]: index - 1, Home: 0, End: OPTIONS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    pick(moves[event.key], true);
  };

  const holdOn = (event) => {
    if (event.pointerType === "mouse") setHold(true);
  };
  const holdOff = (event) => {
    if (event.pointerType === "mouse") setHold(false);
  };

  const Prev = rtl ? ChevronRight : ChevronLeft;
  const Next = rtl ? ChevronLeft : ChevronRight;
  const control =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong bg-[#0C0705]/70 text-ice backdrop-blur transition duration-200 hover:border-brand hover:text-brand-bright motion-reduce:transition-none";

  return (
    <section
      lang={language}
      dir={text.dir}
      aria-labelledby="options-hero-title"
      className="relative isolate overflow-hidden bg-void"
    >
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgb(242_161_44/0.2),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(rgb(247_241_230/0.55)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(70%_55%_at_50%_25%,#000,transparent)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-brand-bright">{text.eyebrow}</p>
            <h1 id="options-hero-title" className="mt-2 text-h1 font-bold text-ice">
              {text.title[0]} <span className="headline-accent">{text.title[1]}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base text-ice-muted">{text.lead}</p>
          </div>
          <div className="hidden shrink-0 border-s border-hairline ps-6 sm:block">
            <div className="flex items-end gap-7">
              {text.stats.map((stat) => (
                <p key={stat.label} className="flex flex-col">
                  <span className="latin text-4xl font-bold leading-none text-ice">{stat.value}</span>
                  <span className="mt-1.5 text-xs text-ice-muted">{stat.label}</span>
                </p>
              ))}
            </div>
            <p className="mt-2 text-xs text-ice-faint">{text.range}</p>
          </div>
        </div>

        <div
          className="mt-7"
          onPointerEnter={holdOn}
          onPointerLeave={holdOff}
          onFocus={() => setHold(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHold(false);
          }}
        >
          <div
            role="tabpanel"
            id="options-hero-stage"
            aria-labelledby={`options-hero-tab-${item.no}`}
            className="relative overflow-hidden rounded-[28px] border border-hairline bg-[#0C0705] shadow-[0_50px_120px_-60px_rgb(242_161_44/0.45)]"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[11/4]" dir="ltr">
              <div
                className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(114deg,#F7F1E6_0_1px,transparent_1px_64px)]"
                aria-hidden="true"
              />
              <span
                key={`number-${item.no}`}
                aria-hidden="true"
                className="options-hero-number pointer-events-none absolute -left-[0.04em] -top-[0.16em] select-none text-[clamp(9rem,30vw,24rem)] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(247_241_230/0.16)]"
                style={{ fontFamily: '"Nexa Trial", sans-serif' }}
              >
                {item.no}
              </span>
              <div
                key={item.no}
                className="options-hero-art absolute inset-0 flex items-center justify-center sm:pb-20"
              >
                <Artwork item={item} size="stage" />
              </div>

              {playing && !hold ? (
                <span
                  key={`progress-${index}`}
                  className="options-hero-progress absolute bottom-0 left-0 h-[3px] bg-brand"
                  style={{ animationDuration: `${DURATION}ms` }}
                  aria-hidden="true"
                />
              ) : null}
            </div>

            <div
              dir={text.dir}
              className="flex flex-wrap items-end justify-between gap-4 border-t border-hairline p-4 sm:absolute sm:inset-x-0 sm:bottom-0 sm:border-0 sm:bg-gradient-to-t sm:from-[#0C0705] sm:via-[#0C0705]/85 sm:to-transparent sm:p-6 sm:pt-16"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <OptionNumber no={item.no} />
                  {item.current ? (
                    <span className="rounded-full border border-brand/50 px-2.5 text-[11px] font-bold leading-6 text-brand-bright">
                      {text.current}
                    </span>
                  ) : null}
                  {item.href ? (
                    <a href={item.href} className="text-xs font-semibold text-ice-muted underline-offset-4 hover:text-brand-bright hover:underline">
                      {text.details}
                    </a>
                  ) : null}
                </div>
                <p className="mt-2 text-xl font-bold text-ice sm:text-2xl">{item[language]}</p>
                <p className="text-sm text-ice-muted">
                  {group.title} · {group.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="latin me-2 text-sm tabular-nums text-ice-muted">
                  {pad(index + 1)} / {pad(OPTIONS.length)}
                </span>
                <button type="button" className={control} onClick={() => pick(index - 1)} aria-label={text.prev}>
                  <Prev className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={control}
                  onClick={() => setPlaying(!playing)}
                  aria-label={playing ? text.pause : text.play}
                  aria-pressed={playing}
                >
                  {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
                </button>
                <button type="button" className={control} onClick={() => pick(index + 1)} aria-label={text.next}>
                  <Next className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={stripRef}
            role="tablist"
            aria-label={text.strip}
            onKeyDown={onKeyDown}
            className="mt-4 flex gap-3 overflow-x-auto pb-3 [scrollbar-color:rgb(247_241_230/0.2)_transparent] [scrollbar-width:thin]"
          >
            {GROUPS.map((stageGroup, groupIndex) => (
              <Fragment key={stageGroup.en.title}>
                <div className="flex w-24 shrink-0 flex-col justify-end pb-1" aria-hidden="true">
                  <span className="text-[11px] font-bold text-brand-bright">{stageGroup[language].date}</span>
                  <span className="text-xs leading-5 text-ice-muted">{stageGroup[language].title}</span>
                </div>
                {OPTIONS.map((option, optionIndex) =>
                  option.groupIndex !== groupIndex ? null : (
                    <button
                      key={option.no}
                      ref={(node) => {
                        tabRefs.current[optionIndex] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`options-hero-tab-${option.no}`}
                      aria-selected={optionIndex === index}
                      aria-controls="options-hero-stage"
                      aria-label={`${option.no} · ${option[language]}`}
                      tabIndex={optionIndex === index ? 0 : -1}
                      onClick={() => pick(optionIndex)}
                      className={`relative flex aspect-[4/3] w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#0C0705] transition duration-200 motion-reduce:transition-none sm:w-36 ${
                        optionIndex === index
                          ? "border-brand shadow-[0_0_0_1px_var(--color-brand),0_14px_30px_-16px_rgb(242_161_44/0.7)]"
                          : "border-hairline opacity-60 hover:border-hairline-strong hover:opacity-100"
                      }`}
                    >
                      <span className="flex h-full w-full items-center justify-center" dir="ltr">
                        <Artwork item={option} size="thumb" />
                      </span>
                      <OptionNumber no={option.no} className="absolute start-2 top-2 z-10 scale-90" />
                    </button>
                  ),
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
