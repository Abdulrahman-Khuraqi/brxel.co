import { redirect } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { getSessionUser } from "@/server/auth/session";
import LoginForm from "./LoginForm";

export const metadata = { title: "تسجيل الدخول" };

export default async function LoginPage({ searchParams }) {
  if (await getSessionUser()) redirect("/admin/");
  const { next } = await searchParams;

  return (
    <main className="relative isolate flex min-h-dvh items-center justify-center bg-void px-4 py-12">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,rgb(242_161_44/0.14),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-7 w-auto" />
          <h1 className="text-xl font-bold text-ice">لوحة التحكم</h1>
          <p className="text-sm text-ice-muted">سجّل الدخول لإدارة الأعمال والمدونة والفريق.</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface p-6 shadow-card">
          <LoginForm next={typeof next === "string" ? next : ""} />
        </div>
        <p className="mt-6 text-center text-xs leading-6 text-ice-faint">نسيت كلمة المرور؟ اطلب من مدير الموقع إعادة تعيينها.</p>
      </div>
    </main>
  );
}
