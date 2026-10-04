import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { services } from "@/lib/services";

/** Every service as an even tile, plus one tile for visitors who don't know yet what they need. */
export default function ServicesList() {
  return (
    <Section
      id="services"
      eyebrow="خدماتنا"
      title="كل ما تحتاجه علامتك، في مكان واحد"
      lead="من الشعار الأول إلى آخر منشور: نظام بصري واحد يجمع كل ما تظهر به علامتك."
      align="start"
      className="border-t border-hairline"
      action={
        <Link
          href="/services/"
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ice transition hover:text-brand-bright motion-reduce:transition-none"
        >
          تفاصيل الخدمات
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
        </Link>
      }
    >
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <Reveal key={service.id} as="li" delay={(index % 4) * 50} className="h-full">
            <Link
              href={`/services/#${service.id}`}
              className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6 transition duration-200 hover:border-hairline-strong hover:bg-surface-hover motion-reduce:transition-none"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand-bright">
                <ServiceIcon name={service.icon} />
              </span>
              <h3 className="mt-6 text-lg font-bold leading-8 text-ice">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-7 text-ice-muted">{service.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ice-faint transition-colors group-hover:text-brand-bright">
                {service.timeline}
                <ArrowLeft className="ms-auto h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}

        <Reveal as="li" delay={150} className="h-full">
          <Link
            href="#contact"
            className="group flex h-full flex-col rounded-2xl bg-brand p-6 text-[#150C09] transition hover:bg-brand-bright motion-reduce:transition-none"
          >
            <h3 className="text-lg font-bold leading-8">لست متأكدًا مما تحتاجه؟</h3>
            <p className="mt-2 flex-1 text-sm leading-7 text-[#150C09]/75">
              احكِ لنا عن فكرتك، ونقترح عليك الخدمة الأنسب لمرحلتك.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold">
              استشرنا مجانًا
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      </ul>
    </Section>
  );
}
