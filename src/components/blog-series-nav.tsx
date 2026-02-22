import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogSeriesNavProps {
  seriesName: string;
  posts: BlogPost[];
  currentSlug: string;
}

export function BlogSeriesNav({
  seriesName,
  posts,
  currentSlug,
}: BlogSeriesNavProps) {
  if (posts.length < 2) return null;

  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);

  return (
    <nav
      className="mb-8 rounded-lg border border-primary/20 bg-primary/5 p-4"
      aria-label="Series navigation"
    >
      <div className="mb-3 flex items-center justify-between">
        <Link
          href={`/blog/series/${encodeURIComponent(seriesName)}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Series: {seriesName}
        </Link>
        <span className="text-xs text-muted-foreground">
          Part {currentIndex + 1} of {posts.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-1 rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${((currentIndex + 1) / posts.length) * 100}%`,
          }}
        />
      </div>

      {/* Post list */}
      <ol className="space-y-1 text-sm">
        {posts.map((post, i) => (
          <li key={post.slug}>
            {post.slug === currentSlug ? (
              <span className="flex items-center gap-2 rounded px-2 py-1 font-medium text-primary">
                <span className="text-xs text-muted-foreground">{i + 1}.</span>
                {post.title}
              </span>
            ) : (
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-2 rounded px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="text-xs">{i + 1}.</span>
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
