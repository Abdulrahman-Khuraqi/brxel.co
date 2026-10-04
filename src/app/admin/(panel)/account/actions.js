"use server";

import { refresh } from "next/cache";
import { guarded } from "@/server/auth/guard";
import { audit } from "@/server/audit";
import { destroyUserSessions } from "@/server/auth/session";
import { changeOwnPassword, updateOwnProfile } from "@/server/admin/team";
import { formText } from "@/server/admin/validation";

export async function updateProfileAction(_state, formData) {
  return guarded(null, async (user) => {
    await updateOwnProfile(user, { name: formText(formData, "name") });
    await audit(user, "account.profile", { type: "user", id: user.id, summary: "حدّث اسمه" });
    refresh();
    return { ok: true, message: "حُفظ الاسم." };
  });
}

export async function changePasswordAction(_state, formData) {
  return guarded(null, async (user) => {
    await changeOwnPassword(user, {
      current: formText(formData, "current"),
      next: formText(formData, "next"),
      confirm: formText(formData, "confirm"),
    });
    await audit(user, "account.password", { type: "user", id: user.id, summary: "غيّر كلمة المرور" });
    return { ok: true, message: "تغيّرت كلمة المرور، وخرجت من الأجهزة الأخرى." };
  });
}

export async function signOutOthersAction() {
  return guarded(null, async (user) => {
    await destroyUserSessions(user.id, user.sessionId);
    await audit(user, "account.sign_out_others", { type: "user", id: user.id, summary: "سجّل الخروج من الأجهزة الأخرى" });
    return { ok: true, message: "خرجت من كل الأجهزة الأخرى." };
  });
}
