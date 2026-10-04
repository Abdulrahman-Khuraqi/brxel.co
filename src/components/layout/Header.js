"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { brand, nav, navEn } from "@/lib/site";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const activeNav = isEnglish ? navEn : nav;
  const homeHref = isEnglish ? "/en/" : "/";
  const contactHref = isEnglish ? "/en/contact/" : "/contact/";

  // Route changes come from client navigation, so the panel has to be closed here.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href) => (href === "/" || href === "/en/" ? pathname === href.replace(/\/$/, "") || pathname === href : pathname.startsWith(href));

  return (
    <header lang={isEnglish ? "en" : "ar"} dir={isEnglish ? "ltr" : "rtl"}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 motion-reduce:transition-none ${
        scrolled || menuOpen
          ? "border-hairline bg-void/90 backdrop-blur-xl"
          : "border-transparent bg-void/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 sm:h-18 sm:px-8">
        <Link href={homeHref} className="shrink-0 rounded-lg" aria-label={`${brand.name} — ${isEnglish ? "Home" : "الرئيسية"}`}>
          <Logo className="h-5 w-auto sm:h-6" />
        </Link>

        <nav aria-label={isEnglish ? "Main navigation" : "التنقل الرئيسي"} className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {activeNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition duration-200 motion-reduce:transition-none ${
                isActive(link.href)
                  ? "bg-surface text-ice"
                  : "text-ice-muted hover:bg-surface hover:text-ice"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Link
            href={contactHref}
            className="hidden min-h-10 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-bold text-[#150C09] transition duration-200 hover:bg-brand-bright motion-reduce:transition-none sm:inline-flex"
          >
            {isEnglish ? "Start a project" : "ابدأ مشروعك"}
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-ice transition hover:bg-surface md:hidden"
            aria-label={menuOpen ? (isEnglish ? "Close menu" : "إغلاق القائمة") : (isEnglish ? "Open menu" : "فتح القائمة")}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label={isEnglish ? "Main navigation" : "التنقل الرئيسي"}
          className="border-t border-hairline bg-void px-5 py-3 md:hidden"
        >
          {activeNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`block rounded-lg px-3 py-3 text-sm font-medium transition ${
                isActive(link.href) ? "bg-surface text-ice" : "text-ice-muted hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={contactHref}
            className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-3 py-3 text-sm font-bold text-[#150C09]"
          >
            {isEnglish ? "Start a project" : "ابدأ مشروعك"}
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
