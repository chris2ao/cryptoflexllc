import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import {
  CodeBlock,
  Warning,
  Stop,
  Info,
  Tip,
  Security,
  Vercel,
  Cloudflare,
  Nextjs,
  CloudflareDoubleHop,
  VercelNativeWAF,
  TwoLayerWAF,
  OldVsNewStack,
  SiteArchitectureDiagram,
  MDXPipelineDiagram,
  DeploymentFlowDiagram,
  SEOStackDiagram,
  GoogleCrawlFlowDiagram,
  MetadataFlowDiagram,
  SEOBeforeAfterDiagram,
  CommentSystemDiagram,
  WelcomeBlastTroubleshootDiagram,
  JourneyTimelineDiagram,
  WelcomeEmailSagaDiagram,
  BeforeAfterArchitectureDiagram,
  CodePlayground,
} from "@/components/mdx";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getSeriesPosts,
} from "@/lib/blog";
import { extractHeadings, slugify, getTextContent } from "@/lib/headings";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SubscribeForm } from "@/components/subscribe-form";
import { BlogPostThumbsUp } from "@/components/blog-post-engagement";
import { BlogComments } from "@/components/blog-comments";
import { ReadingProgress } from "@/components/reading-progress";
import { BlogToc } from "@/components/blog-toc";
import { SocialShare } from "@/components/social-share";
import { RelatedPosts } from "@/components/related-posts";
import { BlogSeriesNav } from "@/components/blog-series-nav";
import { PostReadTracker } from "@/components/post-read-tracker";
import { BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function createHeading(level: number) {
  const Component = ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"h1">) => {
    const text = getTextContent(children);
    const id = slugify(text);
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag id={id} className="group" {...props}>
        {children}
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity no-underline"
          aria-label="Link to section"
        >
          #
        </a>
      </Tag>
    );
  };
  Component.displayName = `H${level}`;
  return Component;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const postUrl = `${BASE_URL}/blog/${slug}`;
  const dateStr = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const ogParams = new URLSearchParams({
    title: post.title,
    author: post.author || "Chris Johnson",
    date: dateStr,
  });
  if (post.tags.length > 0) {
    ogParams.set("tags", post.tags.slice(0, 3).join(","));
  }
  const ogUrl = `/api/og?${ogParams.toString()}`;

  return {
    title: post.title,
    description: post.description,
    authors: post.author ? [{ name: post.author }] : undefined,
    keywords: post.tags,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = `${BASE_URL}/blog/${slug}`;
  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(slug, post.tags);
  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];

  return (
    <>
      <ReadingProgress />
      <PostReadTracker slug={slug} />
      <article className="py-16 sm:py-20">
        <ArticleJsonLd
          title={post.title}
          description={post.description}
          url={postUrl}
          datePublished={post.date}
          dateModified={post.updatedAt}
          author={post.author}
          tags={post.tags}
        />
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: "Blog", url: `${BASE_URL}/blog` },
            { name: post.title, url: postUrl },
          ]}
        />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-5xl">
          {/* Post header */}
          <header className="mb-10 lg:max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge variant="secondary" className="hover:bg-primary/20 transition-colors">
                    {tag}
                  </Badge>
                </Link>
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
              <BlogPostThumbsUp slug={slug} />
            </div>
          </header>

          {/* Series Navigation */}
          {post.series && seriesPosts.length > 1 && (
            <div className="lg:max-w-3xl">
              <BlogSeriesNav
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={slug}
              />
            </div>
          )}

          {/* Two-column layout: article + sidebar TOC on desktop */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-8">
            <div>
              {/* Inline TOC for mobile/tablet */}
              <div className="lg:hidden">
                <BlogToc headings={headings} />
              </div>

              {/* Post content */}
              <div className="prose dark:prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary/90 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border">
                <MDXRemote
                  source={post.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }}
                  components={{
                    h1: createHeading(1),
                    h2: createHeading(2),
                    h3: createHeading(3),
                    pre: CodeBlock,
                    table: (props) => (
                      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <table {...props} />
                      </div>
                    ),
                    Warning,
                    Stop,
                    Info,
                    Tip,
                    Security,
                    Vercel,
                    Cloudflare,
                    Nextjs,
                    CloudflareDoubleHop,
                    VercelNativeWAF,
                    TwoLayerWAF,
                    OldVsNewStack,
                    SiteArchitectureDiagram,
                    MDXPipelineDiagram,
                    DeploymentFlowDiagram,
                    SEOStackDiagram,
                    GoogleCrawlFlowDiagram,
                    MetadataFlowDiagram,
                    SEOBeforeAfterDiagram,
                    CommentSystemDiagram,
                    WelcomeBlastTroubleshootDiagram,
                    JourneyTimelineDiagram,
                    WelcomeEmailSagaDiagram,
                    BeforeAfterArchitectureDiagram,
                    CodePlayground,
                  }}
                />
              </div>

              {/* Share + Subscribe */}
              <div className="mt-12 flex flex-col gap-8">
                <div className="border-t border-border pt-6">
                  <SocialShare url={postUrl} title={post.title} />
                </div>
                <SubscribeForm />
              </div>

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />

              {/* Comments section (subscriber-only) */}
              <BlogComments slug={slug} />
            </div>

            {/* Sidebar TOC for desktop */}
            <aside className="hidden lg:block">
              <BlogToc headings={headings} variant="sidebar" />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
