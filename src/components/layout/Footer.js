"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { brand, contactLinks, nav, navEn } from "@/lib/site";
import { legal, legalOrder } from "@/lib/legal";
import { serviceHref, services } from "@/lib/services";

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-ice-muted transition-colors duration-200 hover:text-brand-bright motion-reduce:transition-none";

/** Lean footer: mark and one line, the site links, how to reach us, the small print. */
export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const activeNav = isEnglish ? navEn : nav;

  return (
    <footer lang={isEnglish ? "en" : "ar"} dir={isEnglish ? "ltr" : "rtl"} className="border-t border-hairline bg-void">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1.2fr_0.9fr]">
          <div className="max-w-xs">
            <Link href={isEnglish ? "/en/" : "/"} className="inline-block" aria-label={`${brand.name}, ${isEnglish ? "Home" : "الرئيسية"}`}>
              <Logo className="h-6 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-7 text-ice-muted">
              {isEnglish
                ? "A graphic design studio: brand identity, social media, print and web."
                : "استوديو تصميم جرافيكي: هوية بصرية، سوشيال ميديا، مطبوعات وواجهات."}
            </p>
          </div>

          <nav aria-label={isEnglish ? "Site" : "الموقع"}>
            <p className="text-xs font-semibold text-ice-faint">{isEnglish ? "Pages" : "الصفحات"}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6">
              {activeNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* The service pages are Arabic only. */}
          {isEnglish ? null : (
            <nav aria-label="الخدمات">
              <p className="text-xs font-semibold text-ice-faint">الخدمات</p>
              <ul className="mt-3 flex flex-col">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={serviceHref(service.id)} className={linkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div>
            <p className="text-xs font-semibold text-ice-faint">{isEnglish ? "Contact" : "تواصل"}</p>
            <ul className="mt-3 flex flex-col">
              <li>
                <a href={contactLinks.email} className={`${linkClass} latin`}>
                  {brand.email}
                </a>
              </li>
              <li>
                <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={`${linkClass} latin`}>
                  {brand.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline py-6 text-xs text-ice-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="latin">{year} {brand.name}</span> · {isEnglish ? "All rights reserved." : "جميع الحقوق محفوظة."}
          </p>
          <ul className="flex flex-wrap gap-x-5">
            {legalOrder.map((slug) => (
              <li key={slug}>
                <Link href={`${isEnglish ? "/en" : ""}/${slug}/`} className="inline-flex min-h-9 items-center transition-colors hover:text-brand-bright">
                  {isEnglish ? { terms: "Terms", privacy: "Privacy", refunds: "Refunds" }[slug] : legal[slug].label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
