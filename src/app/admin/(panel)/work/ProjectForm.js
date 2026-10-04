"use client";

import Link from "next/link";
import { ActionForm, Checkbox, Field, Input, Select, SubmitButton, Textarea } from "@/components/admin/form";
import ImageField from "@/components/admin/ImageField";
import GalleryField from "@/components/admin/GalleryField";
import { Card } from "@/components/admin/ui";

const CATEGORY_OPTIONS = [
  { value: "identity", label: "هوية بصرية" },
  { value: "social", label: "سوشيال ميديا" },
  { value: "web", label: "واجهات ومواقع" },
  { value: "print", label: "مطبوعات" },
];

/**
 * Create / edit form for one portfolio project. `canPublish` decides whether
 * the status control is offered; the server enforces the same rule.
 */
export default function ProjectForm({ action, project = null, canPublish, readOnly = false }) {
  const value = project || {};
  return (
    <ActionForm action={action} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <fieldset disabled={readOnly} className="grid min-w-0 content-start gap-5">
        <Card title="بيانات العمل">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="title" label="اسم المشروع">
              <Input name="title" defaultValue={value.title} required maxLength={191} />
            </Field>
            <Field name="titleLatin" label="الاسم باللاتينية" optional hint="يظهر كنص بديل للشعارات.">
              <Input name="titleLatin" dir="ltr" defaultValue={value.titleLatin} maxLength={191} />
            </Field>
            <Field name="category" label="التصنيف">
              <Select name="category" defaultValue={value.category || "identity"} options={CATEGORY_OPTIONS} />
            </Field>
            <Field name="sector" label="القطاع" optional hint="مثل: مطعم، متجر إلكتروني، عيادة.">
              <Input name="sector" defaultValue={value.sector} maxLength={120} />
            </Field>
            <Field name="slug" label="الرابط المختصر" optional hint="يُنشأ من الاسم إن تركته فارغًا. يظهر في رابط صفحة المعرض.">
              <Input name="slug" dir="ltr" defaultValue={value.slug} maxLength={120} />
            </Field>
            <Field name="link" label="رابط الموقع المباشر" optional hint="لأعمال المواقع: يفتح عند الضغط على العمل.">
              <Input name="link" dir="ltr" type="url" defaultValue={value.link} placeholder="https://" maxLength={512} />
            </Field>
            <Field name="summary" label="نبذة" optional className="sm:col-span-2" hint="تظهر في صفحة معرض أعمال السوشيال.">
              <Textarea name="summary" defaultValue={value.summary || ""} rows={3} maxLength={2000} />
            </Field>
          </div>
        </Card>

        <Card title="الصور">
          <div className="grid gap-5">
            <ImageField name="coverImage" label="صورة الغلاف" defaultValue={value.coverImage || ""} disabled={readOnly} hint="مربّعة، 1200×1200 أو أكبر." />
            <GalleryField name="gallery" label="معرض الصور" defaultValue={value.gallery || []} disabled={readOnly} hint="لأعمال السوشيال: كل التصاميم بالترتيب الذي تريده." />
          </div>
        </Card>
      </fieldset>

      <div className="grid content-start gap-5">
        <Card title="النشر">
          <fieldset disabled={readOnly} className="grid gap-4">
            {canPublish ? (
              <Field name="status" label="الحالة">
                <Select
                  name="status"
                  defaultValue={value.status || "draft"}
                  options={[
                    { value: "draft", label: "مسودة (غير ظاهر)" },
                    { value: "published", label: "منشور على الموقع" },
                  ]}
                />
              </Field>
            ) : (
              <p className="rounded-xl border border-hairline bg-surface px-3 py-2.5 text-xs leading-6 text-ice-muted">
                يُحفظ العمل كمسودة. النشر يحتاج صلاحية «نشر وإخفاء الأعمال».
              </p>
            )}
            <Checkbox name="featured" label="عمل مميّز" description="يظهر في الرئيسية ويتقدّم في تصنيفه." defaultChecked={Boolean(value.featured)} />
            <Field name="sortOrder" label="ترتيب يدوي" hint="الأصغر يظهر أولًا بعد الأعمال المميّزة.">
              <Input name="sortOrder" type="number" dir="ltr" defaultValue={value.sortOrder ?? 0} min={-9999} max={9999} />
            </Field>
            {readOnly ? null : <SubmitButton className="w-full">{project ? "حفظ التغييرات" : "إضافة العمل"}</SubmitButton>}
          </fieldset>
          {project && value.status === "published" && value.category === "social" && value.gallery?.length ? (
            <Link href={`/work/social/${value.slug}/`} target="_blank" className="mt-4 block text-center text-xs font-semibold text-brand-bright hover:underline">
              عرض صفحة المعرض على الموقع
            </Link>
          ) : null}
        </Card>
      </div>
    </ActionForm>
  );
}
