import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/ui/ServiceIcon";
import ServiceDetail from "@/components/services/ServiceDetail";
import Packages from "@/components/services/Packages";
import Process from "@/components/home/Process";
import ContactSection from "@/components/contact/ContactSection";
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
        lead="لكل خدمة نطاق مكتوب يوضح ما تشمله وما لا تشمله ومدة تنفيذها. التكلفة نحددها لك في عرض مكتوب بعد فهم مشروعك."
      >
        <nav aria-label="التنقل بين الخدمات" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-2">
            {services.map((service) => (
              <li key={service.id}>
                <a
                  href={`#${service.id}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-xs font-semibold text-ice-muted transition hover:border-brand hover:text-brand-bright motion-reduce:transition-none"
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
        <div className="mx-auto max-w-6xl space-y-5 px-5 py-20 sm:px-8 sm:py-24">
          {services.map((service) => (
            <Reveal key={service.id}>
              <ServiceDetail service={service} />
            </Reveal>
          ))}
        </div>
      </div>

      <Packages />
      <Process />
      <ContactSection location="services" />
    </>
  );
}
