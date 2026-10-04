import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ButtonLink, EmptyState, PageHead, Pagination, StatusBadge, Table, Td, buttonClass, formatDateTime, withQuery } from "@/components/admin/ui";
import { can, requirePermission } from "@/server/auth/guard";
import { listProjects } from "@/server/admin/work";
import { CATEGORIES } from "@/lib/projects";

export const metadata = { title: "الأعمال" };

const filterInput = "min-h-10 rounded-xl border border-hairline-strong bg-field px-3 text-sm text-ice focus:border-brand focus:outline-none";

export default async function WorkListPage({ searchParams }) {
  const user = await requirePermission("work.view");
  const query = await searchParams;
  const filters = {
    q: typeof query.q === "string" ? query.q.trim().slice(0, 100) : "",
    category: typeof query.category === "string" ? query.category : "",
    status: typeof query.status === "string" ? query.status : "",
    page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  };
  const { items, total, pages } = await listProjects(filters);

  return (
    <div className="grid gap-6">
      <PageHead
        title="الأعمال"
        description={`${total} عمل. المنشور منها يظهر على الموقع فور الحفظ.`}
        actions={
          can(user, "work.create") ? (
            <ButtonLink href="/admin/work/new/">
              <Plus className="h-4 w-4" aria-hidden="true" />
              إضافة عمل
            </ButtonLink>
          ) : null
        }
      />

      <form className="flex flex-wrap items-center gap-2" role="search">
        <input name="q" defaultValue={filters.q} placeholder="ابحث بالاسم أو الرابط" aria-label="بحث" className={`${filterInput} min-w-56 flex-1`} />
        <select name="category" defaultValue={filters.category} aria-label="التصنيف" className={filterInput}>
          <option value="">كل التصنيفات</option>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={filters.status} aria-label="الحالة" className={filterInput}>
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
        </select>
        <button type="submit" className={buttonClass("secondary")}>
          <Search className="h-4 w-4" aria-hidden="true" />
          تصفية
        </button>
      </form>

      {items.length ? (
        <>
          <Table head={["", "العمل", "التصنيف", "الحالة", "آخر تعديل"]}>
            {items.map((project) => (
              <tr key={project.id} className="hover:bg-surface">
                <Td className="w-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage} alt="" loading="lazy" className="h-11 w-11 rounded-lg border border-hairline object-cover" />
                </Td>
                <Td>
                  <Link href={`/admin/work/${project.id}/`} className="font-semibold text-ice hover:text-brand-bright">
                    {project.title}
                  </Link>
                  <span className="block text-xs text-ice-faint">
                    {project.sector || project.slug}
                    {project.featured ? " · مميّز" : ""}
                  </span>
                </Td>
                <Td>{CATEGORIES[project.category]}</Td>
                <Td>
                  <StatusBadge status={project.status} />
                </Td>
                <Td className="latin text-xs">{formatDateTime(project.updatedAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={filters.page} pages={pages} hrefFor={(page) => withQuery("/admin/work/", { ...filters, page })} />
        </>
      ) : (
        <EmptyState title="لا توجد أعمال مطابقة">جرّب تصفية أخرى، أو أضف عملًا جديدًا.</EmptyState>
      )}
    </div>
  );
}
