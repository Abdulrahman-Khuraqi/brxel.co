"use client";

import { ActionForm, Field, Input, SubmitButton } from "@/components/admin/form";
import { Card } from "@/components/admin/ui";

export function ProfileForm({ action, name, email, roleName }) {
  return (
    <Card title="بياناتي" description={`الدور: ${roleName}`}>
      <ActionForm action={action} className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="الاسم">
          <Input name="name" defaultValue={name} required maxLength={120} />
        </Field>
        <Field name="email" label="البريد الإلكتروني" hint="يغيّره مدير الموقع من صفحة المستخدمين.">
          <Input name="email" dir="ltr" defaultValue={email} disabled />
        </Field>
        <div className="flex justify-end sm:col-span-2">
          <SubmitButton>حفظ</SubmitButton>
        </div>
      </ActionForm>
    </Card>
  );
}

export function PasswordForm({ action, email }) {
  return (
    <Card title="كلمة المرور" description="10 أحرف على الأقل. عبارة من عدة كلمات أسهل للحفظ وأقوى.">
      <ActionForm action={action} resetOnSuccess className="grid gap-4 sm:grid-cols-3">
        <input type="text" name="username" value={email} autoComplete="username" readOnly hidden />
        <Field name="current" label="الحالية">
          <Input name="current" type="password" dir="ltr" autoComplete="current-password" required />
        </Field>
        <Field name="next" label="الجديدة">
          <Input name="next" type="password" dir="ltr" autoComplete="new-password" required minLength={10} />
        </Field>
        <Field name="confirm" label="تأكيد الجديدة">
          <Input name="confirm" type="password" dir="ltr" autoComplete="new-password" required />
        </Field>
        <div className="flex justify-end sm:col-span-3">
          <SubmitButton>تغيير كلمة المرور</SubmitButton>
        </div>
      </ActionForm>
    </Card>
  );
}

export function SessionsForm({ action }) {
  return (
    <Card title="الأجهزة" description="إن دخلت من جهاز لم تعد تستخدمه، أخرج منه هنا.">
      <ActionForm action={action}>
        <SubmitButton variant="secondary" pendingLabel="جارٍ الخروج…">
          تسجيل الخروج من كل الأجهزة الأخرى
        </SubmitButton>
      </ActionForm>
    </Card>
  );
}
