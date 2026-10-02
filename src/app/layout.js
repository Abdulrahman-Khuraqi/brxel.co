import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/layout/SkipToContent";
import { brand } from "@/lib/site";
import { services } from "@/lib/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BRXEL | تصميم جرافيكي: هوية بصرية، سوشيال ميديا، مطبوعات",
    template: "%s | BRXEL",
  },
  description: brand.shortPitch,
  keywords: [
    "تصميم جرافيك",
    "تصميم شعار",
    "هوية بصرية",
    "تصميم سوشيال ميديا",
    "تصميم مطبوعات",
    "تصميم واجهات",
    "تصميم تغليف",
    "موشن جرافيك",
    "BRXEL",
    "السعودية",
  ],
  authors: [{ name: brand.owner }],
  creator: brand.name,
  publisher: brand.owner,
  category: "Graphic design services",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    siteName: brand.name,
    title: "BRXEL | تصميم جرافيكي",
    description: brand.shortPitch,
  },
  twitter: {
    card: "summary",
    title: "BRXEL | تصميم جرافيكي",
    description: brand.shortPitch,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#150C09",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: brand.name,
  description: brand.shortPitch,
  url: siteUrl,
  email: brand.email,
  telephone: `+${brand.whatsapp}`,
  address: { "@type": "PostalAddress", addressCountry: "SA" },
  areaServed: { "@type": "Country", name: "Saudi Arabia" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `خدمات ${brand.name}`,
    itemListElement: services.map((service) => ({
      "@type": "Service",
      name: service.title,
      description: service.summary,
    })),
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <SkipToContent />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
