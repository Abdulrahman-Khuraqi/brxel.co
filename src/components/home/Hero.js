import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";
import { featuredProjects } from "@/lib/projects";

const STATS = [
  { value: "+380", label: "مشروع مُنجز" },
  { value: "+120", label: "عميل" },
  { value: "+60", label: "هوية بصرية" },
];

/** The rise of the brand's 66° slash (see `Spark`): horizontal run per unit of height. */
const SLANT = 114 / 256;

/** A slash-shaped band: bottom-left corner at (x, bottom), `width` across, `height` tall. */
function slash({ x, bottom, width, height }) {
  const run = height * SLANT;
  const top = bottom - height;
  return {
    points: `${x},${bottom} ${x + width},${bottom} ${x + width + run},${top} ${x + run},${top}`,
    box: { x, y: top, width: width + run, height },
  };
}

/** Three windows onto real work, cut in the shape of the brand's slash. */
const WINDOWS = [
  { x: -20, bottom: 600, width: 140, height: 440 },
  { x: 190, bottom: 500, width: 140, height: 440 },
  { x: 301, bottom: 620, width: 140, height: 400 },
].map(slash);

/** Strokes of the same slash: the gold accent, a cream outline, and a thin echo. */
const STROKES = [
  { ...slash({ x: 40, bottom: 300, width: 26, height: 160 }), fill: "var(--color-brand)" },
  { ...slash({ x: 470, bottom: 230, width: 34, height: 200 }), fill: "none", stroke: "var(--color-ice)" },
  { ...slash({ x: 470, bottom: 640, width: 10, height: 110 }), fill: "var(--color-brand-bright)" },
];

/** Single gold "pixels": art in every pixel, quite literally. */
const PIXELS = [
  [575, 470, 14],
  [552, 520, 8],
  [60, 380, 14],
  [24, 410, 8],
  [250, 24, 10],
  [140, 616, 12],
];

/**
 * The visual half of the hero: a composition built from the brand's slash,
 * with three featured projects showing through slash-shaped windows over a
 * faint pixel grid. Decorative as a whole; the link names where it goes.
 */
function HeroArt({ projects }) {
  return (
    <Link href="/work/" aria-label="شاهد أعمالنا" className="group relative block">
      <svg viewBox="0 0 600 640" className="h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <pattern id="hero-pixels" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect x="11" y="11" width="2" height="2" fill="var(--color-ice)" />
          </pattern>
          <radialGradient id="hero-fade" cx="50%" cy="50%" r="55%">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-grid-mask">
            <rect width="600" height="640" fill="url(#hero-fade)" />
          </mask>
          <linearGradient id="hero-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="#0c0705" stopOpacity="0" />
            <stop offset="1" stopColor="#0c0705" stopOpacity="0.55" />
          </linearGradient>
          {WINDOWS.map((frame, index) => (
            <clipPath key={index} id={`hero-window-${index}`}>
              <polygon points={frame.points} />
            </clipPath>
          ))}
        </defs>

        <rect width="600" height="640" fill="url(#hero-pixels)" opacity="0.3" mask="url(#hero-grid-mask)" />

        {WINDOWS.map((frame, index) => {
          const project = projects[index];
          if (!project) return null;
          return (
            <g key={project.id} clipPath={`url(#hero-window-${index})`}>
              <rect {...frame.box} fill="var(--color-navy-raised)" />
              <image
                href={project.image}
                {...frame.box}
                preserveAspectRatio="xMidYMid slice"
                className="hero-art-image"
              />
              <rect {...frame.box} fill="url(#hero-shade)" />
            </g>
          );
        })}

        {WINDOWS.map((frame, index) => (
          <polygon
            key={index}
            points={frame.points}
            fill="none"
            stroke="var(--color-ice)"
            strokeOpacity="0.14"
            strokeWidth="1"
          />
        ))}

        {STROKES.map((stroke, index) => (
          <polygon
            key={index}
            points={stroke.points}
            fill={stroke.fill}
            stroke={stroke.stroke}
            strokeWidth={stroke.stroke ? 1.5 : undefined}
            strokeOpacity={stroke.stroke ? 0.6 : undefined}
            className="hero-art-stroke"
            style={{ animationDelay: `${index * 1.3}s` }}
          />
        ))}

        {PIXELS.map(([x, y, size]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={size} height={size} fill="var(--color-brand)" />
        ))}
      </svg>

    </Link>
  );
}

/** Headline, one line of pitch, two actions — and a composition of real work beside it. */
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-void">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_80%_-10%,rgb(242_161_44/0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface px-4 py-1.5 text-sm font-medium text-ice-muted">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="pulse-dot absolute inset-0 rounded-full bg-success" />
                <span className="relative h-2 w-2 rounded-full bg-success" />
              </span>
              متاحون لمشاريع جديدة
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-display font-bold text-ice">
              تصميم يُطلق
              <span className="flex items-center gap-[0.15em]">
                <span className="headline-accent">علامتك</span>
                <Spark className="h-[0.5em] w-[0.5em] shrink-0 text-brand" />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lead text-ice-muted">
              من الشعار إلى المنشور إلى متجرك على سلة أو زد: نظام بصري واحد لكل ما تظهر به علامتك، بنطاق مكتوب قبل
              البدء وملفات تملكها بالكامل.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-6 text-base font-bold text-[#150C09] transition hover:bg-brand-bright motion-reduce:transition-none"
              >
                اطلب عرض سعر
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/work/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-hairline-strong px-6 text-base font-semibold text-ice transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
              >
                شاهد أعمالنا
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="mt-12 grid max-w-md grid-cols-3 divide-x divide-hairline border-t border-hairline pt-6">
              {STATS.map((stat, index) => (
                <div key={stat.label} className={index === 0 ? "pe-4" : "px-4"}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="latin block text-2xl font-bold leading-tight text-ice sm:text-3xl">{stat.value}</span>
                    <span className="mt-1.5 block text-xs text-ice-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <HeroArt projects={featuredProjects.slice(0, 3)} />
        </Reveal>
      </div>
    </section>
  );
}
