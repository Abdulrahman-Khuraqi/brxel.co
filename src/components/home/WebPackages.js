import { ArrowLeft, Check, LifeBuoy } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { webPackages, retainer } from "@/lib/services";
import Price from "@/components/ui/Price";

function PackageCard({ pkg }) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl p-7 ${
        pkg.popular ? "bg-navy-raised" : "card-hover border border-hairline bg-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-ice">{pkg.name}</h3>
        {pkg.popular ? (
          <span className="brand-gradient shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold text-[#150C09]">
            الأكثر طلبًا
          </span>
        ) : null}
      </div>

      <p className="mt-2.5 text-sm leading-7 text-ice-muted">{pkg.summary}</p>

      <div className="mt-6 border-y border-hairline py-5">
        <Price amount={pkg.price} lead="" size="lg" />
        <p className="mt-2 text-xs text-ice-faint">مدة التنفيذ: {pkg.timeline}</p>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm leading-7 text-ice-muted">
            <Check className="mt-1.5 h-4 w-4 shrink-0 text-brand-bright" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        href="/contact/"
        variant={pkg.popular ? "primary" : "secondary"}
        className="mt-7 w-full"
      >
        اطلب الباقة
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
    </article>
  );
}

export default function WebPackages() {
  return (
    <Section
      id="packages"
      eyebrow="الباقات"
      title="ثلاث باقات تجمع أكثر من خدمة"
      lead="اختر الباقة الأقرب لاحتياجك، أو ابدأ منها ونضبط النطاق معك قبل الاعتماد."
      className="border-y border-hairline bg-void"
    >
      <div className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
        {webPackages.map((pkg, index) => (
          <Reveal key={pkg.id} delay={index * 80} className="h-full">
            {/* The popular tier gets the brand gradient as a 1px frame. */}
            {pkg.popular ? (
              <div className="brand-gradient h-full rounded-[calc(1rem+1px)] p-px shadow-[0_20px_60px_-30px_rgb(242_161_44/0.6)]">
                <PackageCard pkg={pkg} />
              </div>
            ) : (
              <PackageCard pkg={pkg} />
            )}
          </Reveal>
        ))}
      </div>

      <Reveal delay={240}>
        <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-hairline bg-surface p-7 lg:flex-row lg:items-center lg:gap-10">
          <div className="lg:max-w-xs">
            <p className="flex items-center gap-2 text-base font-bold text-ice">
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

          <div className="shrink-0 border-t border-hairline pt-5 lg:border-s lg:border-t-0 lg:ps-10 lg:pt-0">
            <Price amount={retainer.price} lead="" note={retainer.period} />
            <Button href="/contact/" variant="secondary" className="mt-4 w-full">
              اشترك
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
