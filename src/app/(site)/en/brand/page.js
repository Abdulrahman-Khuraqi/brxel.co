import BrandPalette from "@/components/brand/BrandPalette";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import LogoFontOptions from "@/components/brand/LogoFontOptions";
import LogoShowcase from "@/components/brand/LogoShowcase";
import Logo from "@/components/brand/BrxelLogo";

export const metadata = {
  robots: { index: false, follow: false },
  title: "BRXEL logo",
  description: "The BRXEL logo brief: concept, geometry, color, and typography.",
};

export default function BrandPageEnglish() {
  return (
    <div lang="en" dir="ltr">
      <PageHeader
        eyebrow="BRXEL logo design"
        title="A brand element"
        lead="BRXEL is inspired by “Brand Element,” echoing “Pixel” (picture element). That idea guides a logo combining the name, symbol, color, and type into one mark."
      >
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-[#0C0705]/70 px-5 py-4">
              <span className="latin text-[11px] font-semibold tracking-[0.22em] text-[#C9BCAC]">PICTURE ELEMENT</span>
              <span className="latin text-2xl font-bold tracking-tight text-[#F7F1E6]">PIXEL</span>
            </div>
            <div className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-brand/35 bg-[#0C0705]/70 px-5 py-4 shadow-[0_12px_40px_-24px_rgba(232,90,36,0.8)]">
              <span className="latin text-[11px] font-semibold tracking-[0.22em] text-[#F2A12C]">BRAND ELEMENT</span>
              <span className="mt-1 text-[#F7F1E6]">
                <Logo className="h-6 w-auto" />
              </span>
            </div>
          </div>
          <ul aria-label="Identity elements" className="mt-4 flex flex-wrap justify-center gap-2">
            {["Name", "Symbol", "Color", "Type"].map((element) => (
              <li key={element} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-[#F7F1E6]/85">
                {element}
              </li>
            ))}
          </ul>
        </div>
      </PageHeader>

      <Section
        eyebrow="The logo"
        title="The whole word points at the brand element"
        lead="Extended, heavy letters; every cut faces the X, and one Ember stroke runs through the word: the brand element."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <LogoShowcase locale="en" />
        </Reveal>
      </Section>

      <Section
        eyebrow="Logo qualities · proposal"
        title="Strong, modern, precise, balanced"
        lead="Use these qualities to assess the mark: a strong presence, contemporary geometry, precise construction, and a symbol that works with the name."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="grid grid-cols-2 gap-3">
              {["Strong", "Modern", "Precise", "Balanced"].map((trait, index) => (
                <div key={trait} className="rounded-2xl border border-white/10 bg-[#0C0705] p-5 sm:p-6">
                  <span className="latin text-xs font-semibold text-brand-bright">0{index + 1}</span>
                  <p className="mt-4 text-lg font-semibold text-ice">{trait}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="h-full rounded-3xl border border-hairline bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-wide text-brand-bright">Visual translation</p>
              <p className="mt-4 text-base leading-8 text-ice-muted">
                Legible geometric lettering, measured angles, and clear contrast between name and symbol, without details that break at small sizes.
              </p>
              <p className="latin mt-6 border-t border-white/10 pt-5 text-sm font-semibold tracking-wide text-ice">Precise geometry. Quick recognition. Clear application.</p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        eyebrow="Logo geometry"
        title="Every cut faces the X"
        lead="Every corner cut is 45°: B and R are cut on the right, E and L on the left, so the word converges on the X. The X's diagonals run at 50° so it keeps close to the width of the other letters."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <figure className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#150C09]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo/brxel-logo-construction.svg"
              alt="BRXEL construction grid: 45° cuts on the B and E, the X's diagonal at 50°."
              width={1600}
              height={560}
              className="h-auto w-full"
            />
          </figure>
        </Reveal>
        <Reveal delay={80}>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "CORNER CUTS", value: "45°" },
              { label: "X DIAGONALS", value: "50°" },
              { label: "STEM / BAR", value: "23 / 21" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-[#0C0705]/70 p-4">
                <dt className="latin text-[11px] font-semibold tracking-[0.18em] text-[#C9BCAC]">{item.label}</dt>
                <dd className="latin mt-2 text-2xl font-bold text-brand-bright">{item.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm leading-7 text-ice-muted">
            Values are on a cap height of 100 units. Letter spacing is set by eye, not by numbers, so the gaps read even despite open shapes like the X and E.
          </p>
        </Reveal>
      </Section>

      <Section
        eyebrow="Logo color"
        title="Logo colors and their roles"
        lead="These colors define the logo’s primary and supporting versions, with clear contrast on light and dark backgrounds."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <Reveal>
          <BrandPalette locale="en" />
        </Reveal>
      </Section>

      <Section
        eyebrow="English font options"
        title="Nexa is the selected font for BRXEL"
        lead="Review all nine Nexa weights for the Latin wordmark."
        align="start"
        className="border-y border-hairline bg-navy"
      >
        <LogoFontOptions locale="en" />
      </Section>
    </div>
  );
}
