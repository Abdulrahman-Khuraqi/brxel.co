import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Markdown from "@/components/blog/Markdown";
import ContactSection from "@/components/contact/ContactSection";
import { formatDay } from "@/lib/format";
import { brand, siteUrl } from "@/lib/site";
import { getPublishedPost } from "@/server/content/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPost(decodeURIComponent(slug));
  if (!post) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  return {
    title,
    description,
    openGraph: { type: "article", title, description, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPost(decodeURIComponent(slug));
  if (!post) notFound();

  const url = `${siteUrl}/blog/${post.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? new URL(post.coverImage, siteUrl).toString() : undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: post.authorName ? { "@type": "Person", name: post.authorName } : { "@type": "Organization", name: brand.name },
    publisher: { "@type": "Organization", name: brand.name, url: siteUrl },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="bg-void">
        <header className="relative isolate overflow-hidden">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_-10%,rgb(242_161_44/0.13),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-3xl px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
            <Link
              href="/blog/"
              className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-ice-muted transition hover:text-brand-bright"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              المدونة
            </Link>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-ice-faint">
              {post.categoryName ? (
                <Link href={`/blog/?category=${post.categorySlug}`} className="text-brand-bright hover:underline">
                  {post.categoryName}
                </Link>
              ) : null}
              {post.categoryName ? <span aria-hidden="true">·</span> : null}
              <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDay(post.publishedAt)}</time>
              {post.authorName ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.authorName}</span>
                </>
              ) : null}
            </p>
            <h1 className="mt-4 text-h1 font-bold text-ice">{post.title}</h1>
            {post.excerpt ? <p className="mt-5 text-lead text-ice-muted">{post.excerpt}</p> : null}
          </div>
        </header>

        {post.coverImage ? (
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="aspect-[16/9] w-full rounded-3xl border border-hairline object-cover"
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:px-8 sm:pb-28">
          <Markdown>{post.body}</Markdown>
        </div>
      </article>

      <ContactSection location={`blog-${post.slug}`} />
    </>
  );
}
