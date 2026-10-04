import { ShieldAlert } from "lucide-react";
import { ButtonLink } from "@/components/admin/ui";

export const metadata = { title: "لا توجد صلاحية" };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-brand-bright" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-bold text-ice">ليست لديك صلاحية لهذه الصفحة</h1>
      <p className="mt-2 text-sm leading-7 text-ice-muted">إن كنت تحتاجها في عملك، اطلب من مدير الموقع إضافتها إلى دورك.</p>
      <ButtonLink href="/admin/" variant="secondary" className="mt-6">
        العودة إلى النظرة العامة
      </ButtonLink>
    </div>
  );
}
