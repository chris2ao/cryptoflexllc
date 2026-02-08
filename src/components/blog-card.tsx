import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {post.title}
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
    </Link>
  );
}
