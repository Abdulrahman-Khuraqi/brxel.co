import Link from "next/link";
import { BookOpen, FolderKanban, ImagePlus, PenLine, Plus, Settings2, UserPlus } from "lucide-react";
import { Badge, ButtonLink, Card, PageHead, formatDateTime } from "@/components/admin/ui";
import { can, requireUser } from "@/server/auth/guard";
import { projectStats } from "@/server/admin/work";
import { listPosts, postStats } from "@/server/admin/blog";
import { listAudit } from "@/server/admin/site";

export const metadata = { title: "نظرة عامة" };

function Stat({ label, value, href, tone = "text-ice" }) {
  const body = (
    <>
      <span className={`latin block text-3xl font-bold ${tone}`}>{value ?? 0}</span>
      <span className="mt-1 block text-sm text-ice-muted">{label}</span>
    </>
  );
  return href ? (
    <Link href={href} className="rounded-2xl border border-hairline bg-surface p-5 transition hover:border-hairline-strong">
      {body}
    </Link>
  ) : (
    <div className="rounded-2xl border border-hairline bg-surface p-5">{body}</div>
  );
}

export default async function OverviewPage() {
  const user = await requireUser();
  const canWork = can(user, "work.view");
  const canBlog = can(user, "blog.view");
  const canAudit = can(user, "audit.view");

  const [projects, posts, reviewQueue, activity] = await Promise.all([
    canWork ? projectStats() : null,
    canBlog ? postStats(user) : null,
    can(user, "blog.publish") ? listPosts(user, { status: "review" }) : null,
    canAudit ? listAudit({ page: 1 }) : null,
  ]);

  const quick = [
    can(user, "work.create") && { href: "/admin/work/new/", label: "إضافة عمل", icon: Plus },
    can(user, "blog.write") && { href: "/admin/blog/new/", label: "مقال جديد", icon: PenLine },
    can(user, "media.upload") && { href: "/admin/media/", label: "رفع صور", icon: ImagePlus },
    can(user, "settings.edit") && { href: "/admin/settings/", label: "أرقام الموقع", icon: Settings2 },
    can(user, "users.manage") && { href: "/admin/users/new/", label: "إضافة مستخدم", icon: UserPlus },
  ].filter(Boolean);

  return (
    <div className="grid gap-8">
      <PageHead title={`أهلًا ${user.name.split(/\s+/)[0]}`} description={`دورك: ${user.role.name}. هذه نظرة سريعة على المحتوى.`} />

      {quick.length ? (
        <div className="flex flex-wrap gap-2">
          {quick.map(({ href, label, icon: Icon }) => (
            <ButtonLink key={href} href={href} variant="secondary">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </ButtonLink>
          ))}
        </div>
      ) : null}

      {canWork || canBlog ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {canWork ? <Stat label="عمل منشور" value={projects.published} href="/admin/work/?status=published" tone="text-brand-bright" /> : null}
          {canWork ? <Stat label="عمل مسودة" value={projects.draft} href="/admin/work/?status=draft" /> : null}
          {canBlog ? <Stat label="مقال منشور" value={posts.published} href="/admin/blog/?status=published" tone="text-brand-bright" /> : null}
          {canBlog ? <Stat label="بانتظار المراجعة" value={posts.review} href="/admin/blog/?status=review" /> : null}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {reviewQueue ? (
          <Card title="مقالات بانتظار مراجعتك" description="راجعها وانشرها أو أعدها للكاتب.">
            {reviewQueue.items.length ? (
              <ul className="divide-y divide-hairline">
                {reviewQueue.items.slice(0, 6).map((post) => (
                  <li key={post.id} className="flex items-center justify-between gap-3 py-3">
                    <Link href={`/admin/blog/${post.id}/`} className="min-w-0 truncate text-sm font-semibold text-ice hover:text-brand-bright">
                      {post.title}
                    </Link>
                    <span className="shrink-0 text-xs text-ice-faint">{post.authorName || "—"}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ice-muted">لا شيء بانتظار المراجعة.</p>
            )}
          </Card>
        ) : null}

        {activity ? (
          <Card
            title="آخر النشاط"
            actions={
              <Link href="/admin/activity/" className="text-xs font-semibold text-brand-bright hover:underline">
                السجل كاملًا
              </Link>
            }
          >
            <ul className="divide-y divide-hairline">
              {activity.items.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="font-semibold text-ice">{item.userName || "النظام"}</span>
                    <span className="text-ice-muted"> · {item.summary || item.action}</span>
                  </span>
                  <span className="latin shrink-0 text-xs text-ice-faint">{formatDateTime(item.createdAt)}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {!canWork && !canBlog && !canAudit ? (
          <Card title="لا يوجد محتوى متاح لدورك">
            <p className="text-sm leading-7 text-ice-muted">
              دورك الحالي لا يتضمن صلاحيات على الأعمال أو المدونة. تواصل مع مدير الموقع إن احتجت إليها.
            </p>
          </Card>
        ) : null}
      </div>

      <p className="flex flex-wrap items-center gap-2 text-xs text-ice-faint">
        <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
        التغييرات المنشورة تظهر على الموقع فورًا.
        <BookOpen className="ms-2 h-3.5 w-3.5" aria-hidden="true" />
        المقالات المجدولة تظهر في موعدها خلال دقائق.
        <Badge tone="gold">{user.role.name}</Badge>
      </p>
    </div>
  );
}
