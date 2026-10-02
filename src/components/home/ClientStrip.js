import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";

/** Brand marks from the identity portfolio. The files sit on white, so each tile is cream + multiply. */
const LOGOS = [
  { src: "/work/brands/logo-01.webp", name: "Quick" },
  { src: "/work/brands/logo-02.webp", name: "Lelon" },
  { src: "/work/brands/logo-03.webp", name: "Madkhan Mani" },
  { src: "/work/brands/logo-04.webp", name: "L.B.CO" },
  { src: "/work/brands/logo-05.webp", name: "E Shopping" },
  { src: "/work/brands/logo-06.webp", name: "Green" },
  { src: "/work/brands/logo-07.webp", name: "Dr. Kabab" },
  { src: "/work/brands/logo-08.webp", name: "Amaze" },
  { src: "/work/brands/logo-09.webp", name: "ZeroPlay" },
  { src: "/work/brands/logo-10.webp", name: "Mushaf Cloud" },
  { src: "/work/brands/logo-11.webp", name: "Lamsat" },
  { src: "/work/brands/logo-12.webp", name: "BRCX" },
];

export default function ClientStrip() {
  return (
    <section aria-labelledby="clients-title" className="relative border-y border-hairline bg-navy">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright">
              <Spark className="h-3 w-3" />
              علامات عملنا معها
            </p>
            <p className="mt-5 text-7xl font-extrabold leading-none tracking-[-0.04em] sm:text-8xl">
              <span className="latin headline-accent inline-block">+60</span>
            </p>
            <h2 id="clients-title" className="mt-4 text-2xl font-bold leading-[1.5] text-ice sm:text-3xl">
              علامة بنينا هويتها أو حملتها.
            </h2>
            <p className="mt-3 text-sm leading-7 text-ice-muted">
              مطاعم، معاهد، متاجر، ومنصات تقنية في السعودية والمنطقة.
            </p>
          </div>
        </Reveal>

        <ul className="grid grid-cols-3 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {LOGOS.map((logo, index) => (
            <Reveal key={logo.src} as="li" delay={(index % 4) * 50}>
              <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#F7F1E6] sm:rounded-2xl ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-brand motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full scale-[1.35] object-contain mix-blend-multiply"
                />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
