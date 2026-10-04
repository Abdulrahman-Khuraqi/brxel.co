import { EmptyState, PageHead, Pagination, Table, Td, formatDateTime, withQuery } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import { listAudit } from "@/server/admin/site";

export const metadata = { title: "سجل النشاط" };

export default async function ActivityPage({ searchParams }) {
  await requirePermission("audit.view");
  const query = await searchParams;
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const userId = Number.parseInt(query.user, 10) || null;
  const { items, total, pages } = await listAudit({ page, userId });

  return (
    <div className="grid gap-6">
      <PageHead title="سجل النشاط" description={`${total} حدث: كل تسجيل دخول وكل تغيير في المحتوى والفريق، بالوقت (UTC) وعنوان IP.`} />
      {items.length ? (
        <>
          <Table head={["الوقت", "المستخدم", "الحدث", "IP"]}>
            {items.map((item) => (
              <tr key={item.id}>
                <Td className="latin whitespace-nowrap text-xs">{formatDateTime(item.createdAt)}</Td>
                <Td className="whitespace-nowrap font-semibold text-ice">{item.userName || "النظام"}</Td>
                <Td>
                  {item.summary || item.action}
                  <span className="latin ms-2 text-[11px] text-ice-faint">{item.action}</span>
                </Td>
                <Td className="latin text-xs">{item.ip || "—"}</Td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} pages={pages} hrefFor={(next) => withQuery("/admin/activity/", { page: next, user: userId })} />
        </>
      ) : (
        <EmptyState title="لا يوجد نشاط بعد" />
      )}
    </div>
  );
}
