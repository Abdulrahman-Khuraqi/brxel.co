import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { getPortfolio } from "@/server/content/portfolio";

/** Brand marks from the identity portfolio. The files sit on white, so each tile is cream + multiply. */
export default async function ClientStrip() {
  const logos = (await getPortfolio()).projectsByCategory.identity;

  return (
    <Section
      id="clients"
      eyebrow="علامات عملنا معها"
      title="أكثر من 60 علامة بنينا هويتها أو حملتها"
      lead="مطاعم، معاهد، متاجر، ومنصات تقنية."
      align="start"
      className="border-t border-hairline"
    >
      <ul className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
        {logos.map((logo, index) => (
          <Reveal key={logo.id} as="li" delay={(index % 6) * 40}>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#F7F1E6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.image}
                alt={logo.titleLatin}
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.3] object-contain mix-blend-multiply"
              />
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
