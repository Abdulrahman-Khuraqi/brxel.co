import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PostCard from "@/components/blog/PostCard";
import ContactSection from "@/components/contact/ContactSection";
import { getActiveCategories, listPublishedPosts } from "@/server/content/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "المدونة",
  description: "مقالات BRXEL عن الهوية البصرية، تصميم السوشيال ميديا، المتاجر الإلكترونية، ومن داخل الاستوديو.",
};

const pageHref = (category, page) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/blog/${query ? `?${query}` : ""}`;
};

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category.slice(0, 120) : "";
  const page = Math.max(1, Number.parseInt(params.page, 10) || 1);
  const [{ items, pages }, categories] = await Promise.all([listPublishedPosts({ page, category }), getActiveCategories()]);

  const chip = (active) =>
    `inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
      active ? "bg-ice text-[#150C09]" : "border border-hairline text-ice-muted hover:border-hairline-strong hover:text-ice"
    }`;

  return (
    <>
      <PageHeader
        eyebrow="المدونة"
        title="ما نتعلّمه ونحن نصمّم"
        lead="مقالات قصيرة وعملية عن الهوية البصرية والسوشيال ميديا والمتاجر، من مشاريع حقيقية."
        align="start"
      />

      <div className="bg-void">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          {categories.length ? (
            <nav aria-label="تصنيفات المدونة" className="flex gap-2 overflow-x-auto border-b border-hairline pb-5 [scrollbar-width:none]">
              <Link href="/blog/" className={chip(!category)} aria-current={!category ? "page" : undefined}>
                الكل
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={pageHref(item.slug, 1)}
                  className={chip(category === item.slug)}
                  aria-current={category === item.slug ? "page" : undefined}
                >
                  {item.name}
                  <span className="latin text-xs opacity-60">{item.total}</span>
                </Link>
              ))}
            </nav>
          ) : null}

          {items.length ? (
            <ul className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post, index) => (
                <li key={post.slug}>
                  <PostCard post={post} priority={index < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-16 rounded-2xl border border-hairline bg-surface p-10 text-center text-ice-muted">
              لا توجد مقالات منشورة هنا بعد. عد قريبًا.
            </p>
          )}

          {pages > 1 ? (
            <nav aria-label="صفحات المدونة" className="mt-14 flex items-center justify-center gap-3">
              {page > 1 ? (
                <Link href={pageHref(category, page - 1)} className={chip(false)}>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  الأحدث
                </Link>
              ) : null}
              <span className="latin text-sm text-ice-faint">
                {page} / {pages}
              </span>
              {page < pages ? (
                <Link href={pageHref(category, page + 1)} className={chip(false)}>
                  الأقدم
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>

      <ContactSection location="blog" />
    </>
  );
}
