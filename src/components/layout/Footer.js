"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { brand, contactLinks, licence, nav, navEn } from "@/lib/site";
import { legal, legalOrder } from "@/lib/legal";

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-ice-muted transition-colors duration-200 hover:text-brand-bright motion-reduce:transition-none";

/** Lean footer: mark and one line, the site links in a row, how to reach us, the small print. */
export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const activeNav = isEnglish ? navEn : nav;

  return (
    <footer lang={isEnglish ? "en" : "ar"} dir={isEnglish ? "ltr" : "rtl"} className="border-t border-hairline bg-void">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link href={isEnglish ? "/en/" : "/"} className="inline-block" aria-label={`${brand.name}, ${isEnglish ? "Home" : "الرئيسية"}`}>
              <Logo className="h-6 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-7 text-ice-muted">
              {isEnglish ? "Saudi graphic design services." : "خدمات تصميم جرافيكي سعودية."}
            </p>
            <a
              href={licence.file}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs text-ice-faint transition-colors hover:text-brand-bright"
            >
              {isEnglish ? "Freelance licence" : "وثيقة عمل حر"}: <span className="latin font-semibold">{licence.documentId}</span>
            </a>
          </div>

          <nav aria-label={isEnglish ? "Site" : "الموقع"}>
            <ul className="flex flex-wrap gap-x-6 gap-y-1">
              {activeNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-col gap-1 md:items-end">
            <li>
              <a href={contactLinks.email} className={`${linkClass} latin`}>{brand.email}</a>
            </li>
            <li>
              <a href={contactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={`${linkClass} latin`}>
                {brand.phone}
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-hairline py-6 text-xs text-ice-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} <span className="latin">{brand.name}</span> · {isEnglish ? "All rights reserved." : "جميع الحقوق محفوظة."}
          </p>
          <ul className="flex flex-wrap gap-x-5">
            {legalOrder.map((slug) => (
              <li key={slug}>
                <Link href={`${isEnglish ? "/en" : ""}/${slug}/`} className="transition-colors hover:text-brand-bright">
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
