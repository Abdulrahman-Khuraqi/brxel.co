import { EmptyState, PageHead, Pagination, withQuery } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { can, requirePermission } from "@/server/auth/guard";
import { listMedia } from "@/server/admin/library";
import { removeMedia } from "./actions";
import UploadPanel from "./UploadPanel";
import CopyUrl from "./CopyUrl";

export const metadata = { title: "مكتبة الوسائط" };

const kb = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

export default async function MediaPage({ searchParams }) {
  const user = await requirePermission("media.upload");
  const page = Math.max(1, Number.parseInt((await searchParams).page, 10) || 1);
  const { items, total, pages } = await listMedia({ page });

  return (
    <div className="grid gap-6">
      <PageHead
        title="مكتبة الوسائط"
        description={`${total} صورة. كل صورة تُحوَّل إلى WebP وتُصغَّر إلى 2400 بكسل كحد أقصى، حتى 10 ميغابايت للملف.`}
        actions={<UploadPanel />}
      />

      {items.length ? (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <li key={item.id} className="overflow-hidden rounded-2xl border border-hairline bg-surface">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-navy-raised">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt || ""} loading="lazy" className="h-full w-full object-cover" />
                </a>
                <div className="flex items-center gap-1 p-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ice" title={item.originalName}>
                      {item.originalName || item.path}
                    </p>
                    <p className="latin text-[11px] text-ice-faint">
                      {item.width}×{item.height} · {kb(item.size)}
                    </p>
                  </div>
                  <CopyUrl url={item.url} />
                  {can(user, "media.delete") ? (
                    <ConfirmAction
                      action={removeMedia}
                      fields={{ id: item.id }}
                      label="حذف"
                      triggerVariant="ghost"
                      title="حذف الصورة؟"
                      message="لن تُحذف إن كانت مستخدمة في عمل أو مقال."
                      confirmLabel="حذف"
                    />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} pages={pages} hrefFor={(next) => withQuery("/admin/media/", { page: next })} />
        </>
      ) : (
        <EmptyState title="المكتبة فارغة">ارفع صورًا لاستخدامها في الأعمال والمقالات.</EmptyState>
      )}
    </div>
  );
}
