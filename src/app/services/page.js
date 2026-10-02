import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ServiceDetail from "@/components/services/ServiceDetail";
import PricingNote from "@/components/services/PricingNote";
import WebPackages from "@/components/home/WebPackages";
import ContactCta from "@/components/ContactCta";
import { services } from "@/lib/services";

export const metadata = {
  title: "الخدمات",
  description:
    "خدمات BRXEL للتصميم الجرافيكي: الهوية البصرية والشعار، تصميم السوشيال ميديا، المطبوعات، واجهات المواقع والمتاجر، التغليف، العروض التقديمية، والموشن جرافيك.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="الخدمات"
        title="كل خدمة بنطاق واضح"
        lead="لكل خدمة سعر يبدأ منه، ونطاق مكتوب يوضح ما تشمله وما لا تشمله ومدة تنفيذها."
      >
        <nav aria-label="التنقل بين الخدمات" className="mt-9">
          <ul className="flex flex-wrap justify-center gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2 text-xs font-medium text-ice-muted transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
                >
                  <ServiceIcon name={service.icon} className="h-3.5 w-3.5" />
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <div className="on-light">
        <div className="mx-auto max-w-6xl space-y-6 px-5 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <PricingNote />
          </Reveal>
          {services.map((service) => (
            <Reveal key={service.id}>
              <ServiceDetail service={service} />
            </Reveal>
          ))}

        </div>
      </div>

      <WebPackages />
      <ContactCta />
    </>
  );
}
