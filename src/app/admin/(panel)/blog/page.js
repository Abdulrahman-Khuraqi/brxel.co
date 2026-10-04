import Link from "next/link";
import { PenLine, Search } from "lucide-react";
import { ButtonLink, EmptyState, PageHead, Pagination, StatusBadge, Table, Td, buttonClass, formatDateTime, withQuery } from "@/components/admin/ui";
import { can, requirePermission } from "@/server/auth/guard";
import { listPosts } from "@/server/admin/blog";

export const metadata = { title: "المقالات" };

const filterInput = "min-h-10 rounded-xl border border-hairline-strong bg-field px-3 text-sm text-ice focus:border-brand focus:outline-none";

export default async function PostsPage({ searchParams }) {
  const user = await requirePermission("blog.view");
  const query = await searchParams;
  const filters = {
    q: typeof query.q === "string" ? query.q.trim().slice(0, 100) : "",
    status: typeof query.status === "string" ? query.status : "",
    mine: query.mine === "1" ? "1" : "",
    page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  };
  const { items, total, pages } = await listPosts(user, { ...filters, mine: filters.mine === "1" });

  return (
    <div className="grid gap-6">
      <PageHead
        title="المقالات"
        description={`${total} مقال${can(user, "blog.edit_all") ? "" : " (مقالاتك والمنشور)"}.`}
        actions={
          can(user, "blog.write") ? (
            <ButtonLink href="/admin/blog/new/">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              مقال جديد
            </ButtonLink>
          ) : null
        }
      />

      <form className="flex flex-wrap items-center gap-2" role="search">
        <input name="q" defaultValue={filters.q} placeholder="ابحث في العناوين" aria-label="بحث" className={`${filterInput} min-w-56 flex-1`} />
        <select name="status" defaultValue={filters.status} aria-label="الحالة" className={filterInput}>
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="review">بانتظار المراجعة</option>
          <option value="draft">مسودة</option>
        </select>
        <label className="flex min-h-10 items-center gap-2 px-2 text-sm text-ice-muted">
          <input type="checkbox" name="mine" value="1" defaultChecked={filters.mine === "1"} className="accent-[var(--color-brand)]" />
          مقالاتي فقط
        </label>
        <button type="submit" className={buttonClass("secondary")}>
          <Search className="h-4 w-4" aria-hidden="true" />
          تصفية
        </button>
      </form>

      {items.length ? (
        <>
          <Table head={["العنوان", "الكاتب", "التصنيف", "الحالة", "النشر", "آخر تعديل"]}>
            {items.map((post) => (
              <tr key={post.id} className="hover:bg-surface">
                <Td>
                  <Link href={`/admin/blog/${post.id}/`} className="font-semibold text-ice hover:text-brand-bright">
                    {post.title}
                  </Link>
                </Td>
                <Td>{post.authorName || "—"}</Td>
                <Td>{post.categoryName || "—"}</Td>
                <Td>
                  <StatusBadge status={post.status} />
                </Td>
                <Td className="latin text-xs">
                  {post.status === "published" && post.publishedAt && new Date(post.publishedAt) > new Date() ? "مجدول: " : ""}
                  {post.publishedAt ? formatDateTime(post.publishedAt) : "—"}
                </Td>
                <Td className="latin text-xs">{formatDateTime(post.updatedAt)}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={filters.page} pages={pages} hrefFor={(page) => withQuery("/admin/blog/", { ...filters, page })} />
        </>
      ) : (
        <EmptyState
          title="لا توجد مقالات بعد"
          action={can(user, "blog.write") ? <ButtonLink href="/admin/blog/new/">اكتب أول مقال</ButtonLink> : null}
        >
          المقالات المنشورة تظهر في صفحة المدونة على الموقع.
        </EmptyState>
      )}
    </div>
  );
}
