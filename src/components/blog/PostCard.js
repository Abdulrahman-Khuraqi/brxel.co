import Link from "next/link";
import { formatDay } from "@/lib/format";

/** One post in the blog grid: cover, category, title, excerpt, date. */
export default function PostCard({ post, priority = false }) {
  return (
    <article className="h-full">
      <Link href={`/blog/${post.slug}/`} className="group flex h-full flex-col">
        <span className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-hairline bg-navy-raised">
          {post.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImage}
              alt=""
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
            />
          ) : (
            <span className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,rgb(242_161_44/0.25),transparent_70%)]" />
          )}
        </span>
        <span className="mt-4 flex items-center gap-2 text-xs font-semibold text-ice-faint">
          {post.categoryName ? <span className="text-brand-bright">{post.categoryName}</span> : null}
          {post.categoryName ? <span aria-hidden="true">·</span> : null}
          <time dateTime={new Date(post.publishedAt).toISOString()}>{formatDay(post.publishedAt)}</time>
        </span>
        <span className="mt-2 block text-lg font-bold leading-8 text-ice transition-colors group-hover:text-brand-bright">
          {post.title}
        </span>
        {post.excerpt ? <span className="mt-2 line-clamp-3 text-sm leading-7 text-ice-muted">{post.excerpt}</span> : null}
      </Link>
    </article>
  );
}
