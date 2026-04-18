import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/components/blog/PostMeta";
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

type BlogCardPost = Omit<BlogPost, "content"> & { content?: string };

export function BlogCard({ post }: { post: BlogCardPost }) {
  const accentVar = getTagVar(post.tags);

  return (
    <Card className="group relative h-full overflow-hidden border border-border/40 bg-card transition-all duration-[250ms] hover:border-primary/30 hover:shadow-[0_0_24px_rgba(71,186,204,0.15)] hover:-translate-y-1">
      <div
        className="h-[5px] w-full"
        style={{ backgroundColor: accentVar }}
      />
      {post.coverImage && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/40 bg-surface-2">
          <Image
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="relative z-10 flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              rel="nofollow"
            >
              <Badge variant="secondary" className="text-xs hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.description}
        </p>
        <div className="mt-4">
          <PostMeta date={post.date} author={post.author} readingTime={post.readingTime} />
        </div>
      </CardContent>
    </Card>
  );
}
