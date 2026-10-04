import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { PageHead, StatusBadge, buttonClass, formatDateTime } from "@/components/admin/ui";
import ConfirmAction from "@/components/admin/ConfirmAction";
import { can, requirePermission } from "@/server/auth/guard";
import { allowedStatuses, canEditPost, getPost, listCategories } from "@/server/admin/blog";
import { idField } from "@/server/admin/validation";
import PostForm from "../PostForm";
import { deletePostAction, updatePostAction } from "../actions";

export const metadata = { title: "تعديل مقال" };

export default async function EditPostPage({ params }) {
  const user = await requirePermission("blog.view");
  const parsed = idField.safeParse((await params).id);
  if (!parsed.success) notFound();
  const post = await getPost(parsed.data);
  if (!post) notFound();
  // Writers without edit_all only open their own drafts, or what is already public.
  if (!can(user, "blog.edit_all") && post.authorId !== user.id && post.status !== "published") notFound();

  const editable = canEditPost(user, post);
  const canDelete = can(user, "blog.delete") || (post.authorId === user.id && post.status !== "published" && can(user, "blog.write"));
  const statuses = allowedStatuses(user);

  return (
    <div className="grid gap-6">
      <PageHead
        title={post.title}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={post.status} />
            <span>الكاتب: {post.authorName || "—"}</span>
            <span className="latin">· {formatDateTime(post.updatedAt)}</span>
          </span>
        }
        back={{ href: "/admin/blog/", label: "المقالات" }}
        actions={
          <>
            {post.status === "published" ? (
              <Link href={`/blog/${post.slug}/`} target="_blank" className={buttonClass("secondary")}>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                عرض
              </Link>
            ) : null}
            {canDelete ? (
              <ConfirmAction
                action={deletePostAction}
                fields={{ id: post.id }}
                label="حذف"
                title={`حذف «${post.title}»؟`}
                message="سيُحذف المقال نهائيًا من الموقع واللوحة."
                confirmLabel="حذف نهائيًا"
              />
            ) : null}
          </>
        }
      />
      {editable ? null : (
        <p className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand-bright">
          هذا المقال للعرض فقط: {post.status === "published" ? "تعديل المقالات المنشورة يحتاج صلاحية النشر." : "تعديل مقالات الآخرين يحتاج صلاحية «تعديل مقالات الآخرين»."}
        </p>
      )}
      <PostForm
        action={updatePostAction.bind(null, post.id)}
        post={post}
        categories={await listCategories()}
        statuses={statuses.includes(post.status) ? statuses : [post.status, ...statuses]}
        readOnly={!editable}
      />
    </div>
  );
}
