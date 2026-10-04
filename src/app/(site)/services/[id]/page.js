import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import ServiceIcon from "@/components/ui/ServiceIcon";
import Process from "@/components/home/Process";
import ContactSection from "@/components/contact/ContactSection";
import {
  OtherServices,
  ServiceAudience,
  ServiceFaq,
  ServiceScope,
  ServiceWork,
} from "@/components/services/ServiceSections";
import { serviceOption } from "@/lib/contact";
import { getService, serviceHref } from "@/lib/services";
import { brand, siteUrl } from "@/lib/site";

// Related work comes from the database (cached).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = getService(id);

  if (!service) return {};

  return {
    title: service.title,
    description: `${service.summary} مدة التنفيذ ${service.timeline}.`,
  };
}

export default async function ServicePage({ params }) {
  const { id } = await params;
  const service = getService(id);

  if (!service) notFound();

  // Optional bands drop out cleanly, and the rest keep alternating light and dark.
  const bands = [
    ServiceScope,
    service.audience?.length ? ServiceAudience : null,
    Process,
    service.work ? ServiceWork : null,
    service.faq?.length ? ServiceFaq : null,
    OtherServices,
  ].filter(Boolean);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.summary,
      url: `${siteUrl}${serviceHref(service.id)}`,
      serviceType: service.title,
      provider: { "@type": "ProfessionalService", name: brand.name, url: siteUrl },
    },
    service.faq?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null,
  ].filter(Boolean);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHeader eyebrow="الخدمات" title={service.title} lead={service.summary} align="start">
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="#contact">
            اطلب عرض سعر
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button href="/services/" variant="secondary">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            كل الخدمات
          </Button>
        </div>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="باختصار">
          <li className="inline-flex min-h-9 items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 text-xs font-semibold text-brand-bright">
            <ServiceIcon name={service.icon} className="h-3.5 w-3.5" />
            {service.timeline}
          </li>
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex min-h-9 items-center rounded-full border border-hairline bg-surface px-3.5 text-xs font-semibold text-ice-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </PageHeader>

      {bands.map((Band, index) => (
        <Band key={index} service={service} tone={index % 2 === 0 ? "light" : "dark"} />
      ))}

      <ContactSection location={`service-${service.id}`} service={serviceOption(service)} topic={service.title} />
    </>
  );
}
