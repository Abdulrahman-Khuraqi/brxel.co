import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { brand, siteUrl } from "@/lib/site";

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
    "تصميم متجر سلة",
    "تصميم متجر زد",
    "تصميم تغليف",
    "موشن جرافيك",
    "BRXEL",
  ],
  authors: [{ name: brand.owner }],
  creator: brand.name,
  publisher: brand.owner,
  category: "Graphic design services",
  openGraph: {
    type: "website",
    locale: "ar",
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
  themeColor: "#0C0705",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
