import { Spark } from "@/components/ui/Logo";

const FRONT = ["هوية بصرية", "سوشيال ميديا", "مطبوعات", "واجهات ومتاجر", "تغليف", "عروض تقديمية", "موشن جرافيك"];
const BACK = ["BRANDING", "SOCIAL MEDIA", "PRINT", "WEB & UI", "PACKAGING", "MOTION"];

/** One endless row; the list is rendered twice so the -50% loop is seamless. */
function Row({ items, className, itemClass, slashClass }) {
  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      {[0, 1].map((copy) => (
        <ul key={copy} className="marquee-track flex shrink-0 items-center" aria-hidden={copy === 1}>
          {items.map((item) => (
            <li key={item} className={`flex items-center whitespace-nowrap ${itemClass}`}>
              {item}
              <Spark className={slashClass} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/** Two crossing bands: gold in front (Arabic), outlined Latin behind, running the other way. */
export default function HomeMarquee() {
  return (
    <section aria-label="خدماتنا باختصار" className="relative overflow-hidden bg-void py-12 sm:py-16">
      <div className="relative">
        <div className="-mx-[5%] rotate-[2.5deg] border-y border-hairline bg-navy-raised py-4 sm:py-5">
          <Row
            items={BACK}
            className="marquee-reverse"
            itemClass="latin gap-8 pe-8 text-3xl font-bold tracking-wide text-outline sm:text-5xl"
            slashClass="h-7 w-7 text-ice/20 sm:h-10 sm:w-10"
          />
        </div>
        <div className="absolute inset-x-0 top-1/2 -mx-[5%] -translate-y-1/2 -rotate-[2.5deg] bg-brand py-4 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] sm:py-5">
          <Row
            items={FRONT}
            itemClass="gap-8 pe-8 text-2xl font-bold text-[#150C09] sm:text-4xl"
            slashClass="h-6 w-6 text-[#150C09] sm:h-9 sm:w-9"
          />
        </div>
      </div>
    </section>
  );
}
