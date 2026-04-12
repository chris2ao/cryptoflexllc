import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { BlogPost } from "@/lib/blog";

const tagVarMap: Record<string, string> = {
  "Claude Code": "var(--color-tag-claude-code)",
  Security: "var(--color-tag-security)",
  AI: "var(--color-tag-ai)",
  "Next.js": "var(--color-tag-nextjs)",
  DevOps: "var(--color-tag-general)",
  Analytics: "var(--color-tag-general)",
  Infrastructure: "var(--color-tag-infrastructure)",
};

function getTagVar(tags: string[]): string {
  for (const tag of tags) {
    if (tagVarMap[tag]) return tagVarMap[tag];
  }
  return "var(--color-tag-default)";
}

type FeaturedPost = Omit<BlogPost, "content"> & { content?: string };

interface FeaturedPostsProps {
  posts: FeaturedPost[];
}

function FeaturedCard({ post }: { post: FeaturedPost }) {
  const accentVar = getTagVar(post.tags);
  const primaryTag = post.tags[0];

  return (
    <Card className="group relative h-full overflow-hidden transition-colors hover:border-primary/50 bg-card">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: accentVar }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          {primaryTag && (
            <Link href={`/blog?tag=${encodeURIComponent(primaryTag)}`}>
              <Badge
                variant="secondary"
                className="text-xs hover:bg-primary/20 transition-colors"
              >
                {primaryTag}
              </Badge>
            </Link>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            FEATURED
          </span>
        </div>
        <h3 className="text-2xl font-heading font-bold leading-tight group-hover:text-primary transition-colors">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0"
          >
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 font-body">
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          {post.author && <span>{post.author}</span>}
          {post.author && <span>&middot;</span>}
          <span>
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {post.readingTime && <span>&middot;</span>}
          {post.readingTime && <span>{post.readingTime}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (posts.length === 0) return null;

  const featured = posts.slice(0, 3);

  return (
    <section className="bracket-frame mb-12">
      <h2 className="text-xs font-mono text-primary mb-4 tracking-widest uppercase">
        Featured Posts
      </h2>
      <div
        className={
          featured.length === 1
            ? "grid grid-cols-1 gap-6"
            : featured.length === 2
              ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {featured.map((post) => (
          <FeaturedCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
