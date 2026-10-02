"use client";

import { usePathname } from "next/navigation";

export default function SkipToContent() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  return (
    <a
      href="#main"
      lang={isEnglish ? "en" : "ar"}
      dir={isEnglish ? "ltr" : "rtl"}
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:font-semibold focus:text-[#150C09]"
    >
      {isEnglish ? "Skip to content" : "تخطَّ إلى المحتوى"}
    </a>
  );
}
