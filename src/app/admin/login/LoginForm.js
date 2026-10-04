"use client";

import { startTransition, useActionState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { signInAction } from "@/app/admin/actions";
import { buttonClass } from "@/components/admin/ui";

function Submit({ pending }) {
  return (
    <button type="submit" disabled={pending} className={buttonClass("primary", "min-h-12 w-full text-base")}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LogIn className="h-4 w-4" aria-hidden="true" />}
      {pending ? "جارٍ الدخول…" : "تسجيل الدخول"}
    </button>
  );
}

const input =
  "min-h-12 w-full rounded-xl border border-hairline-strong bg-field px-4 text-base text-ice placeholder:text-ice-faint focus:border-brand focus:outline-none";

export default function LoginForm({ next }) {
  const [state, action, pending] = useActionState(signInAction, null);

  // onSubmit keeps the typed email when sign-in fails (a form `action` would reset it).
  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <input type="hidden" name="next" value={next || ""} />
      <div className="grid gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-ice">
          البريد الإلكتروني
        </label>
        <input id="email" name="email" type="email" dir="ltr" autoComplete="username" required autoFocus className={input} />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold text-ice">
          كلمة المرور
        </label>
        <input id="password" name="password" type="password" dir="ltr" autoComplete="current-password" required className={input} />
      </div>
      {state?.error ? (
        <p role="alert" className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {state.error}
        </p>
      ) : null}
      <Submit pending={pending} />
    </form>
  );
}
