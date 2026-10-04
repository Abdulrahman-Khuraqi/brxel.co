import { Card, PageHead } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { requirePermission } from "@/server/auth/guard";
import { listCategories } from "@/server/admin/blog";
import { deleteCategoryAction, saveCategoryAction } from "../actions";
import CategoryForm from "./CategoryForm";

export const metadata = { title: "تصنيفات المدونة" };

export default async function CategoriesPage() {
  await requirePermission("blog.categories");
  const categories = await listCategories();

  return (
    <div className="grid gap-6">
      <PageHead title="تصنيفات المدونة" description="تظهر كمرشّحات في صفحة المدونة حين يكون فيها مقال منشور." />
      <Card title="تصنيف جديد">
        <CategoryForm action={saveCategoryAction} />
      </Card>
      <Card title={`التصنيفات (${categories.length})`}>
        <ul className="divide-y divide-hairline">
          {categories.map((category) => (
            <li key={category.id} className="flex flex-wrap items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <CategoryForm action={saveCategoryAction} category={category} />
              </div>
              <span className="text-xs text-ice-faint">{category.total} مقال</span>
              <ConfirmAction
                action={deleteCategoryAction}
                fields={{ id: category.id }}
                label="حذف"
                title={`حذف التصنيف «${category.name}»؟`}
                message={category.total ? `${category.total} مقال سيبقى منشورًا بدون تصنيف.` : "لا توجد مقالات في هذا التصنيف."}
                confirmLabel="حذف"
              />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
