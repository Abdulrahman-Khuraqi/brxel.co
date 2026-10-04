import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/layout/SkipToContent";
import { brand, siteUrl } from "@/lib/site";
import { serviceHref, services } from "@/lib/services";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.name,
  description: brand.shortPitch,
  url: siteUrl,
  email: brand.email,
  telephone: `+${brand.whatsapp}`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `خدمات ${brand.name}`,
    itemListElement: services.map((service) => ({
      "@type": "Service",
      name: service.title,
      description: service.summary,
      url: `${siteUrl}${serviceHref(service.id)}`,
    })),
  },
};

/** The public site: header, footer and the organisation's structured data. The dashboard has its own shell. */
export default function SiteLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <SkipToContent />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
