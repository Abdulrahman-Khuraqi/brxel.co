"use client";

import Link from "next/link";
import { useState } from "react";
import { ActionForm, Field, Input, Select, SubmitButton } from "@/components/admin/form";
import { Card } from "@/components/admin/ui";
import SecretNotice from "./SecretNotice";

/**
 * New user (generated password shown once) or edit user. `roles` holds only
 * the roles this admin may assign; the server re-checks.
 */
export default function UserForm({ action, user = null, roles, self = false }) {
  const [created, setCreated] = useState(null);

  if (created) {
    return (
      <SecretNotice email={created.email} password={created.password}>
        <div className="mt-4 flex gap-3 text-sm">
          <Link href={`/admin/users/${created.id}/`} className="font-semibold text-brand-bright hover:underline">
            فتح الحساب
          </Link>
          <Link href="/admin/users/" className="text-ice-muted hover:underline">
            العودة للمستخدمين
          </Link>
        </div>
      </SecretNotice>
    );
  }

  return (
    <ActionForm action={action} onSuccess={user ? undefined : setCreated}>
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="الاسم">
            <Input name="name" defaultValue={user?.name} required maxLength={120} autoComplete="off" />
          </Field>
          <Field name="email" label="البريد الإلكتروني" hint={user ? undefined : "يستخدمه للدخول."}>
            <Input name="email" type="email" dir="ltr" defaultValue={user?.email} required maxLength={191} autoComplete="off" />
          </Field>
          <Field name="roleId" label="الدور" hint={self ? "لا يمكنك تغيير دورك بنفسك." : "يحدد ما يستطيع رؤيته وتعديله."}>
            <Select
              name="roleId"
              defaultValue={String(user?.roleId ?? roles[roles.length - 1]?.id ?? "")}
              options={roles.map((role) => ({ value: String(role.id), label: role.name }))}
              disabled={self}
            />
            {self ? <input type="hidden" name="roleId" value={user.roleId} /> : null}
          </Field>
          {user ? (
            <Field name="status" label="الحالة" hint={self ? "لا يمكنك تعطيل حسابك." : "الحساب المعطّل لا يستطيع الدخول."}>
              <Select
                name="status"
                defaultValue={user.status}
                disabled={self}
                options={[
                  { value: "active", label: "نشط" },
                  { value: "disabled", label: "معطّل" },
                ]}
              />
              {self ? <input type="hidden" name="status" value="active" /> : null}
            </Field>
          ) : null}
        </div>
        <div className="mt-6 flex justify-end border-t border-hairline pt-5">
          <SubmitButton>{user ? "حفظ التغييرات" : "إنشاء الحساب"}</SubmitButton>
        </div>
      </Card>
    </ActionForm>
  );
}
