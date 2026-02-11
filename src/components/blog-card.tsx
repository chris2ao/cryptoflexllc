import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

type BlogCardPost = Omit<BlogPost, "content"> & { content?: string };

export function BlogCard({ post }: { post: BlogCardPost }) {
  return (
    <Card className="group relative h-full transition-colors hover:border-primary/50 bg-card">
      <CardHeader className="pb-3">
        <div className="relative z-10 flex flex-wrap gap-2 mb-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
            >
              <Badge variant="secondary" className="text-xs hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          {post.author && <span>{post.author}</span>}
          {post.author && <span>&middot;</span>}
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
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
