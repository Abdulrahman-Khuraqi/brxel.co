"use client";

import { ActionForm, Field, Input, SubmitButton } from "@/components/admin/form";

export default function CategoryForm({ action, category = null }) {
  return (
    <ActionForm action={action} resetOnSuccess={!category} className="flex flex-wrap items-end gap-3">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <Field name="name" label={category ? "" : "اسم التصنيف"} className="min-w-48 flex-1">
        <Input name="name" defaultValue={category?.name} required maxLength={120} aria-label="اسم التصنيف" />
      </Field>
      <Field name="slug" label={category ? "" : "الرابط"} className="min-w-40 flex-1">
        <Input name="slug" defaultValue={category?.slug} placeholder="يُنشأ تلقائيًا" maxLength={120} aria-label="الرابط" />
      </Field>
      <SubmitButton variant={category ? "secondary" : "primary"}>{category ? "حفظ" : "إضافة"}</SubmitButton>
    </ActionForm>
  );
}
