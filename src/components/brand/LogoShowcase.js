import { Download } from "lucide-react";
import Logo from "@/components/brand/BrxelLogo";

const FILES = [
  { href: "/brand/logo/brxel-logo-on-dark.svg", ar: "الشعار · خلفية داكنة", en: "Logo · dark background" },
  { href: "/brand/logo/brxel-logo-on-light.svg", ar: "الشعار · خلفية فاتحة", en: "Logo · light background" },
  { href: "/brand/logo/brxel-logo-mono-cream.svg", ar: "لون واحد · كريمي", en: "One colour · cream" },
  { href: "/brand/logo/brxel-logo-mono-ink.svg", ar: "لون واحد · داكن", en: "One colour · ink" },
  { href: "/brand/logo/brxel-lockup-ar-on-light.svg", ar: "الشعار مع الاسم العربي", en: "Bilingual lockup" },
  { href: "/brand/logo/brxel-icon.svg", ar: "الأيقونة", en: "Icon" },
];

const copy = {
  ar: {
    direction: "rtl",
    iconCaption: "الأيقونة: الـX وحده، وزاوية المربع مقصوصة 45° مثل الحروف.",
    avatar: "صورة الحساب",
    lockupCaption: "الشعار مع الاسم العربي بخط آي بي إم بلكس سانس العربي العريض.",
    notes: [
      "كل قصّات الحروف بزاوية 45° وتتجه نحو الـX: الـB والـR من اليمين، والـE والـL من اليسار.",
      "الخط الصاعد في الـX برتقالي ويقطع الكلمة كاملًا؛ هو عنصر العلامة.",
      "الحروف ممتدة وثقيلة، والمسافات بينها محسوبة بصريًا لتبدو متساوية.",
    ],
    downloads: "تنزيل ملفات الشعار (SVG)",
  },
  en: {
    direction: "ltr",
    iconCaption: "Icon: the X on its own, with the tile's corner cut at 45° like the letters.",
    avatar: "Avatar",
    lockupCaption: "Bilingual lockup, Arabic set in IBM Plex Sans Arabic Bold.",
    notes: [
      "Every corner cut is 45° and faces the X: B and R are cut on the right, E and L on the left.",
      "The rising stroke of the X is Ember and runs whole through the word: the brand element.",
      "Extended, heavy letters, spaced optically so the gaps read even.",
    ],
    downloads: "Download logo files (SVG)",
  },
};

/** Small download chip pinned to a logo panel's corner. `tone` matches the panel ground. */
function DownloadChip({ href, label, tone = "dark" }) {
  const tones = {
    dark: "border-white/15 bg-white/5 text-[#F7F1E6] hover:border-[#E85A24] hover:text-[#F2A12C]",
    light: "border-[#150C09]/15 bg-[#150C09]/5 text-[#150C09] hover:border-[#150C09]/40",
    ember: "border-[#F7F1E6]/40 bg-[#F7F1E6]/10 text-[#F7F1E6] hover:bg-[#F7F1E6]/20",
  };
  return (
    <a
      href={href}
      download
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition duration-200 motion-reduce:transition-none ${tones[tone]}`}
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="latin">{label}</span>
    </a>
  );
}

function Chips({ files, tone }) {
  return (
    <div className="absolute end-3 top-3 flex gap-1.5" dir="ltr">
      {files.map(([href, label]) => (
        <DownloadChip key={href} href={href} label={label} tone={tone} />
      ))}
    </div>
  );
}

export default function LogoShowcase({ locale = "ar" }) {
  const language = locale === "en" ? "en" : "ar";
  const text = copy[language];

  return (
    <div dir={text.direction} lang={language} className="mt-12">
      <figure className="relative flex min-h-64 items-center justify-center rounded-3xl border border-white/10 bg-[#150C09] px-6 py-14 text-[#F7F1E6] sm:min-h-80">
        <Chips tone="dark" files={[["/brand/logo/brxel-logo-on-dark.svg", "SVG"], ["/brand/logo/brxel-logo-on-dark.png", "PNG"]]} />
        <Logo className="h-11 w-auto max-w-full sm:h-20" />
      </figure>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <figure className="relative flex min-h-44 items-center justify-center rounded-2xl bg-[#F7F1E6] px-6 py-10 text-[#150C09]">
          <Chips tone="light" files={[["/brand/logo/brxel-logo-on-light.svg", "SVG"], ["/brand/logo/brxel-logo-on-light.png", "PNG"]]} />
          <Logo className="h-8 w-auto max-w-full sm:h-10" />
        </figure>
        <figure className="relative flex min-h-44 items-center justify-center rounded-2xl bg-[#E85A24] px-6 py-10 text-[#F7F1E6]">
          <Chips tone="ember" files={[["/brand/logo/brxel-logo-mono-cream.svg", "SVG"]]} />
          <Logo mono className="h-8 w-auto max-w-full sm:h-10" />
        </figure>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <figure className="relative flex flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-[#0C0705] p-6 pt-14 sm:p-8 sm:pt-14">
          <Chips tone="dark" files={[["/brand/logo/brxel-icon.svg", "SVG"], ["/brand/logo/brxel-icon-512.png", "PNG"]]} />
          <div className="flex flex-wrap items-end gap-5" dir="ltr">
            {[96, 48, 32, 16].map((size) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={size} src="/brand/logo/brxel-icon.svg" alt="" width={size} height={size} />
            ))}
            <span className="flex items-end gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo/brxel-icon-ember.svg" alt="" width={48} height={48} />
              <span className="text-xs text-ice-muted">{text.avatar}</span>
            </span>
          </div>
          <figcaption className="text-sm leading-7 text-ice-muted">{text.iconCaption}</figcaption>
        </figure>

        <figure className="relative flex flex-col justify-between gap-6 rounded-2xl bg-[#F7F1E6] p-6 pt-14 sm:p-8 sm:pt-14">
          <Chips tone="light" files={[["/brand/logo/brxel-lockup-ar-on-light.svg", "SVG"]]} />
          <div className="flex min-h-24 items-center justify-center" dir="ltr">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo/brxel-lockup-ar-on-light.svg" alt="BRXEL بركسل" className="h-10 w-auto max-w-full sm:h-12" />
          </div>
          <figcaption className="text-sm leading-7 text-[#6B615A]">{text.lockupCaption}</figcaption>
        </figure>
      </div>

      <ul className="mt-6 grid gap-3 md:grid-cols-3">
        {text.notes.map((note, index) => (
          <li key={note} className="rounded-2xl border border-hairline bg-surface p-5 text-start">
            <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
            <p className="mt-3 text-sm leading-7 text-ice-muted">{note}</p>
          </li>
        ))}
      </ul>

      <nav aria-label={text.downloads} className="mt-6 rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
        <p className="text-sm font-semibold text-ice">{text.downloads}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {FILES.map((file) => (
            <li key={file.href}>
              <a
                href={file.href}
                download
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hairline-strong px-4 text-sm font-medium text-ice transition duration-200 hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {file[language]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
