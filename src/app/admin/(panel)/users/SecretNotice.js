"use client";

import { Copy, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { buttonClass } from "@/components/admin/ui";

/** Shows a generated password once, with a copy button. It is never stored in readable form. */
export default function SecretNotice({ email, password, children }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("نُسخت كلمة المرور.");
    } catch {
      toast.error("تعذّر النسخ؛ انسخها يدويًا.");
    }
  };
  return (
    <div role="status" className="rounded-2xl border border-success/30 bg-success/10 p-5">
      <p className="flex items-center gap-2 font-bold text-ice">
        <KeyRound className="h-4 w-4 text-success" aria-hidden="true" />
        كلمة المرور المؤقتة {email ? <span className="latin text-sm font-normal text-ice-muted">({email})</span> : null}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code dir="ltr" className="latin rounded-lg border border-hairline-strong bg-field px-3 py-2 text-base font-bold tracking-wide text-ice">
          {password}
        </code>
        <button type="button" onClick={copy} className={buttonClass("secondary")}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          نسخ
        </button>
      </div>
      <p className="mt-3 text-xs leading-6 text-ice-muted">
        تظهر مرة واحدة فقط. أرسلها للمستخدم بطريقة آمنة، واطلب منه تغييرها من «حسابي» بعد أول دخول.
      </p>
      {children}
    </div>
  );
}
