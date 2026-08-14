import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/components/blog/PostMeta";
import type { BlogPost } from "@/lib/blog";
import { getTagAccentVar } from "@/lib/tag-accent";

type BacklogCardPost = Omit<BlogPost, "content"> & { content?: string };

/**
 * Draft card mirroring BlogCard's production look (accent bar, cover
 * infographic, typography) so backlog previews match the live blog.
 * Draft affordances kept: dashed border and the Draft badge.
 */
export function BacklogCard({ post }: { post: BacklogCardPost }) {
  const accentVar = getTagAccentVar(post.tags);

  return (
    <Card className="group relative h-full overflow-hidden border border-border/40 border-dashed bg-card transition-all duration-[250ms] hover:border-primary/30 hover:shadow-[0_0_24px_rgba(71,186,204,0.15)] hover:-translate-y-1">
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
          <Badge variant="outline" className="text-xs font-mono border-yellow-500/40 text-yellow-400">
            Draft
          </Badge>
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-mono text-primary/80">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
          <Link href={`/backlog/${post.slug}`} className="after:absolute after:inset-0">
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
