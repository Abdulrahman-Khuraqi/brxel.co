"use client";

import { ActionForm, Field, Input, Select, SubmitButton, Textarea } from "@/components/admin/form";
import ImageField from "@/components/admin/ImageField";
import MarkdownField from "@/components/admin/MarkdownField";
import { Card } from "@/components/admin/ui";
import PublishDateField from "./PublishDateField";

const STATUS_LABELS = { draft: "مسودة", review: "إرسال للمراجعة", published: "منشور" };

/** The post editor. `statuses` is what this user may choose; the server checks the same rule. */
export default function PostForm({ action, post = null, categories, statuses, readOnly = false }) {
  const value = post || {};
  return (
    <ActionForm action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <fieldset disabled={readOnly} className="grid min-w-0 content-start gap-5">
        <Card>
          <div className="grid gap-4">
            <Field name="title" label="العنوان">
              <Input name="title" defaultValue={value.title} required maxLength={191} className="text-base font-semibold" />
            </Field>
            <Field name="excerpt" label="مقدمة قصيرة" optional hint="تظهر في قائمة المقالات وتحت العنوان. حتى 400 حرف.">
              <Textarea name="excerpt" defaultValue={value.excerpt} rows={2} maxLength={400} />
            </Field>
            <MarkdownField name="body" label="نص المقال" defaultValue={value.body || ""} disabled={readOnly} />
          </div>
        </Card>

        <Card title="محركات البحث" description="اختياري. إن تركتها فارغة نستخدم العنوان والمقدمة.">
          <div className="grid gap-4">
            <Field name="seoTitle" label="عنوان البحث" optional>
              <Input name="seoTitle" defaultValue={value.seoTitle} maxLength={191} />
            </Field>
            <Field name="seoDescription" label="وصف البحث" optional>
              <Textarea name="seoDescription" defaultValue={value.seoDescription} rows={2} maxLength={320} />
            </Field>
          </div>
        </Card>
      </fieldset>

      <div className="grid content-start gap-5">
        <Card title="النشر">
          <fieldset disabled={readOnly} className="grid gap-4">
            <Field name="status" label="الحالة">
              <Select name="status" defaultValue={value.status || "draft"} options={statuses.map((status) => ({ value: status, label: STATUS_LABELS[status] }))} />
            </Field>
            {statuses.includes("published") ? (
              <PublishDateField defaultValue={value.publishedAt} />
            ) : (
              <p className="rounded-xl border border-hairline bg-surface px-3 py-2.5 text-xs leading-6 text-ice-muted">
                أرسل المقال للمراجعة حين يجهز، وينشره المحرر.
              </p>
            )}
            <Field name="categoryId" label="التصنيف" optional>
              <Select
                name="categoryId"
                defaultValue={value.categoryId ? String(value.categoryId) : ""}
                options={[{ value: "", label: "بدون تصنيف" }, ...categories.map((category) => ({ value: String(category.id), label: category.name }))]}
              />
            </Field>
            <Field name="slug" label="الرابط المختصر" optional hint="يُنشأ من العنوان إن تركته فارغًا.">
              <Input name="slug" defaultValue={value.slug} maxLength={160} />
            </Field>
            {readOnly ? null : <SubmitButton className="w-full">{post ? "حفظ" : "حفظ المقال"}</SubmitButton>}
          </fieldset>
        </Card>
        <Card title="صورة الغلاف">
          <ImageField name="coverImage" label="" defaultValue={value.coverImage || ""} aspect="aspect-[16/10]" optional stacked disabled={readOnly} hint="أفقية، 1600×1000 أو أكبر." />
        </Card>
      </div>
    </ActionForm>
  );
}
