import { ArrowLeft, Check, LifeBuoy } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { webPackages, retainer } from "@/lib/services";

function PackageCard({ pkg }) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-7 ${
        pkg.popular ? "border-brand/60 bg-navy-raised" : "border-hairline bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 font-bold text-ice">{pkg.name}</h3>
        {pkg.popular ? (
          <span className="shrink-0 rounded-full bg-brand px-3 py-1 text-xs font-bold text-[#150C09]">الأكثر طلبًا</span>
        ) : null}
      </div>

      <p className="mt-2.5 text-sm text-ice-muted">{pkg.summary}</p>
      <p className="mt-4 text-xs font-semibold text-ice-muted">مدة التنفيذ: {pkg.timeline}</p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-hairline pt-6">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm leading-7 text-ice-muted">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Button href="#contact" variant={pkg.popular ? "primary" : "secondary"} className="mt-7 w-full">
        اطلب عرض سعر
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
    </article>
  );
}

/** Bundles of services. Pricing is quoted per project, so the cards carry scope only. */
export default function Packages() {
  return (
    <Section
      id="packages"
      eyebrow="الباقات"
      title="باقات تجمع أكثر من خدمة"
      lead="ابدأ من الباقة الأقرب لاحتياجك، ونضبط النطاق والتكلفة معك في عرض مكتوب قبل الاعتماد."
      align="start"
      className="border-t border-hairline"
    >
      <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
        {webPackages.map((pkg, index) => (
          <Reveal key={pkg.id} delay={index * 80} className="h-full">
            <PackageCard pkg={pkg} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={200}>
        <div className="mt-5 flex flex-col gap-6 rounded-2xl border border-hairline bg-surface p-7 lg:flex-row lg:items-center lg:gap-10">
          <div className="lg:max-w-xs">
            <p className="flex items-center gap-2 text-h3 font-bold text-ice">
              <LifeBuoy className="h-5 w-5 shrink-0 text-brand-bright" aria-hidden="true" strokeWidth={1.75} />
              {retainer.name}
            </p>
            <p className="mt-2 text-sm leading-7 text-ice-muted">{retainer.summary}</p>
          </div>

          <ul className="grid flex-1 gap-2.5 sm:grid-cols-2">
            {retainer.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm leading-7 text-ice-muted">
                <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <Button href="#contact" variant="secondary" className="shrink-0">
            اطلب عرض سعر
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
