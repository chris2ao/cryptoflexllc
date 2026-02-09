import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
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
        </header>

        {/* Post content */}
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary/90 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border">
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
            components={{
              table: (props) => (
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <table {...props} />
                </div>
              ),
            }}
          />
        </div>
      </div>
    </article>
  );
}
