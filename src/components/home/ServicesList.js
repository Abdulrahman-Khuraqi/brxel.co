import { ArrowLeft, ArrowUpLeft } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Spark } from "@/components/ui/Logo";
import { services, CURRENCY } from "@/lib/services";
import { formatAmount } from "@/lib/format";

/** Editorial index of services: oversized numbered rows that flood gold on hover. */
export default function ServicesList() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-void">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-brand-bright">
                <Spark className="h-3 w-3" />
                ماذا نصمّم
              </p>
              <h2 id="services-title" className="mt-3 text-3xl font-bold leading-[1.45] text-ice sm:text-5xl">
                {services.length} خدمات، <span className="headline-accent">نظام واحد</span>
              </h2>
            </div>
            <a
              href="/services/"
              className="group inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-ice transition hover:text-brand-bright sm:self-auto motion-reduce:transition-none"
            >
              تفاصيل كل خدمة
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <ol className="mt-12 border-b border-hairline">
          {services.map((service, index) => (
            <Reveal key={service.id} as="li" delay={Math.min(index, 4) * 50}>
              <a
                href={`/services/#${service.id}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 border-t border-hairline px-3 py-6 transition-colors duration-300 hover:bg-brand sm:gap-8 sm:px-5 sm:py-8 motion-reduce:transition-none"
              >
                <span className="latin w-8 text-sm font-semibold text-ice-faint transition-colors group-hover:text-[#150C09]/70 sm:w-12">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.5rem,4.2vw,3.25rem)] font-bold leading-[1.4] text-ice transition-colors group-hover:text-[#150C09]">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-brand-bright sm:hidden">
                    يبدأ من <span className="latin">{formatAmount(service.priceFrom)}</span> {CURRENCY}
                  </span>
                  <span className="mt-2 hidden max-w-2xl text-sm leading-7 text-ice-muted transition-colors group-hover:text-[#150C09]/75 md:block">
                    {service.summary}
                  </span>
                </span>
                <span className="flex items-center gap-4 sm:gap-6">
                <span className="hidden text-end sm:block">
                  <span className="block text-[11px] font-semibold text-ice-faint transition-colors group-hover:text-[#150C09]/65">يبدأ من</span>
                  <span className="block whitespace-nowrap text-lg font-bold text-ice transition-colors group-hover:text-[#150C09]">
                    <span className="latin">{formatAmount(service.priceFrom)}</span> <span className="text-sm text-brand-bright group-hover:text-[#150C09]">{CURRENCY}</span>
                  </span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-strong text-ice transition-colors duration-300 group-hover:border-[#150C09] group-hover:bg-[#150C09] group-hover:text-brand sm:h-14 sm:w-14 motion-reduce:transition-none">
                  <ArrowUpLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" strokeWidth={2.25} aria-hidden="true" />
                </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
