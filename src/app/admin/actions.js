"use server";

import { redirect } from "next/navigation";
import { getSessionUser, destroySession } from "@/server/auth/session";
import { signIn } from "@/server/auth/login";
import { audit } from "@/server/audit";

/** Only same-site dashboard paths are accepted as a post-login destination. */
const safeNext = (value) => (typeof value === "string" && /^\/admin\/[^\s\\]*$/.test(value) && !value.startsWith("//") ? value : "/admin/");

export async function signInAction(_state, formData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!email || !password) return { ok: false, error: "اكتب البريد الإلكتروني وكلمة المرور." };

  const error = await signIn(email, password);
  if (error) return { ok: false, error };
  redirect(safeNext(formData.get("next")));
}

export async function signOutAction() {
  const user = await getSessionUser();
  if (user) await audit(user, "auth.sign_out", { type: "user", id: user.id, summary: "تسجيل خروج" });
  await destroySession();
  redirect("/admin/login/");
}
