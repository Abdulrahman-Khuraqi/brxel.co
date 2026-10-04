import { PageHead } from "@/components/admin/ui";
import { requirePermission } from "@/server/auth/guard";
import { allowedStatuses, listCategories } from "@/server/admin/blog";
import PostForm from "../PostForm";
import { createPostAction } from "../actions";

export const metadata = { title: "مقال جديد" };

export default async function NewPostPage() {
  const user = await requirePermission("blog.write");
  const categories = await listCategories();
  return (
    <div className="grid gap-6">
      <PageHead title="مقال جديد" back={{ href: "/admin/blog/", label: "المقالات" }} />
      <PostForm action={createPostAction} categories={categories} statuses={allowedStatuses(user)} />
    </div>
  );
}
