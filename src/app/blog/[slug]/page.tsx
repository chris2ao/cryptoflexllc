import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import {
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
} from "@/components/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SubscribeForm } from "@/components/subscribe-form";
import { BlogPostThumbsUp } from "@/components/blog-post-engagement";
import { BlogComments } from "@/components/blog-comments";

const BASE_URL = "https://cryptoflexllc.com";

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

  const postUrl = `${BASE_URL}/blog/${slug}`;

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
      modifiedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: [
        {
          url: "/CFLogo.png",
          width: 512,
          height: 512,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
      images: ["/CFLogo.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const postUrl = `${BASE_URL}/blog/${slug}`;

  return (
    <article className="py-16 sm:py-20">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        url={postUrl}
        datePublished={post.date}
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Post header */}
        <header className="mb-10">
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
            }}
          />
        </div>

        {/* Subscribe CTA */}
        <div className="mt-16">
          <SubscribeForm />
        </div>

        {/* Comments section (subscriber-only) */}
        <BlogComments slug={slug} />
      </div>
    </article>
  );
}
