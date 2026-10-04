"use client";

import { Toaster as Sonner } from "sonner";

/**
 * shadcn/ui Toaster (Sonner) themed to the site: one place for success, error,
 * warning and loading toasts. Mounted once in the root layout.
 */
function Toaster(props) {
  return (
    <Sonner
      theme="dark"
      dir="rtl"
      position="bottom-center"
      richColors
      closeButton
      toastOptions={{
        style: { fontFamily: "var(--font-sans)" },
        classNames: { toast: "!rounded-xl !border-hairline-strong !text-sm" },
      }}
      {...props}
    />
  );
}

export { Toaster };
