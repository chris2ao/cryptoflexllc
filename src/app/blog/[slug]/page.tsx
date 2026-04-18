import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
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
  MemoryLayersDiagram,
  KGEntityBreakdownDiagram,
  HookBlindSpotsDiagram,
  DualLayerReliabilityDiagram,
  KGMaintenanceLoopDiagram,
  ConfigStackDiagram,
  PermissionLevelsDiagram,
  SerialVsParallelDiagram,
  HomunculusPipelineDiagram,
  EvolutionFlowDiagram,
  CVEResponseFlowDiagram,
  SecurityPanelArchitectureDiagram,
  SecurityAlertSchemaDiagram,
  AutoresearchFitnessRubricDiagram,
  AutoresearchVsHomunculusDiagram,
  UnexpectedDiscoveryDiagram,
  NotebookLMMCPArchitectureDiagram,
  SuperpowersPipelineDiagram,
  ExecutionTimelineDiagram,
  TwoPathApproachDiagram,
  CaptainCoordinatorDiagram,
  FivePhaseExecutionDiagram,
  PIIProtectionLayersDiagram,
  ThreeTierResearchDiagram,
  FiveLayerArchitectureDiagram,
  MemoryAuditFlowDiagram,
  UIUXAgentOrchestrationDiagram,
  UIUXResearchPipelineDiagram,
  StorageCleanupFlowDiagram,
  UniFiMCPArchitectureDiagram,
  UniFiMCPToolSurfaceDiagram,
  ProbeDecisionFlowDiagram,
  DesignToCodePipelineDiagram,
  RedesignAgentTeamDiagram,
  EditorialPropagationDiagram,
  ImageLightbox,
  CoverImageLightbox,
} from "@/components/mdx";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getSeriesPosts,
} from "@/lib/blog";
import { extractHeadings, slugify, getTextContent } from "@/lib/headings";
import { ArticleJsonLd, BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SubscribeForm } from "@/components/subscribe-form";
import { BlogPostThumbsUp } from "@/components/blog-post-engagement";
import { BlogComments } from "@/components/blog-comments";
import { ReadingProgress } from "@/components/reading-progress";
import { BlogToc } from "@/components/blog-toc";
import { SocialShare } from "@/components/social-share";
import { RelatedPosts } from "@/components/related-posts";
import { BlogSeriesNav } from "@/components/blog-series-nav";
import { PostReadTracker } from "@/components/post-read-tracker";
import { AuthorCard } from "@/components/blog/AuthorCard";
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
  const generatedOgUrl = `/api/og?${ogParams.toString()}`;
  const primaryImage = post.coverImage
    ? {
        url: post.coverImage,
        alt: post.coverImageAlt ?? post.title,
      }
    : {
        url: generatedOgUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      };

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
      images: [primaryImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [primaryImage.url],
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

  const dateFormatted = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const kicker = post.series ?? post.tags[0] ?? "Field notes";

  return (
    <>
      <ReadingProgress />
      <PostReadTracker slug={slug} />
      <article className="ed-post">
        <ArticleJsonLd
          title={post.title}
          description={post.description}
          url={postUrl}
          datePublished={post.date}
          dateModified={post.updatedAt}
          author={post.author}
          tags={post.tags}
          schemaType={post.schemaType ?? "Article"}
          image={post.coverImage ? `${BASE_URL}${post.coverImage}` : undefined}
        />
        {(post.schemaType ?? "Article") === "Article" && (
          <BlogPostingJsonLd
            title={post.title}
            description={post.description}
            url={postUrl}
            datePublished={post.date}
            dateModified={post.updatedAt}
            author={post.author}
            tags={post.tags}
            image={post.coverImage ? `${BASE_URL}${post.coverImage}` : undefined}
          />
        )}
        <BreadcrumbJsonLd
          items={[
            { name: "Home", url: BASE_URL },
            { name: "Blog", url: `${BASE_URL}/blog` },
            { name: post.title, url: postUrl },
          ]}
        />
        <div className="ed-post-inner">
          {/* Post header — editorial */}
          <header className="ed-post-header">
            <div className="ed-overline">
              § 01 / The Blog · {kicker}
            </div>
            <div className="ed-post-tag-row">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} rel="nofollow">
                  <span className="ed-tag">{tag}</span>
                </Link>
              ))}
            </div>
            <h1>{post.title}</h1>
            {post.description && (
              <p className="ed-post-header-description">{post.description}</p>
            )}
            <div className="ed-post-header-meta">
              <span>
                <b>{post.author || "Chris Johnson"}</b>
              </span>
              <span className="sep">·</span>
              <time dateTime={post.date}>
                <b>{dateFormatted}</b>
              </time>
              <span className="sep">·</span>
              <span>
                <b>{post.readingTime}</b>
              </span>
              <BlogPostThumbsUp slug={slug} />
            </div>
          </header>

          {/* Cover image hero (click to zoom) */}
          {post.coverImage && (
            <CoverImageLightbox
              src={post.coverImage}
              alt={post.coverImageAlt ?? post.title}
              priority
            />
          )}

          {/* Series Navigation */}
          {post.series && seriesPosts.length > 1 && (
            <div className="max-w-[720px] mx-auto mb-10">
              <BlogSeriesNav
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={slug}
              />
            </div>
          )}

          {/* Two-column layout: article + sidebar TOC on desktop */}
          <div className="ed-post-layout">
            <div className="ed-post-prose">
              {/* Inline TOC for mobile/tablet */}
              <div className="lg:hidden mb-6">
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
                    MemoryLayersDiagram,
                    KGEntityBreakdownDiagram,
                    HookBlindSpotsDiagram,
                    DualLayerReliabilityDiagram,
                    KGMaintenanceLoopDiagram,
                    ConfigStackDiagram,
                    PermissionLevelsDiagram,
                    SerialVsParallelDiagram,
                    HomunculusPipelineDiagram,
                    EvolutionFlowDiagram,
                    CVEResponseFlowDiagram,
                    SecurityPanelArchitectureDiagram,
                    SecurityAlertSchemaDiagram,
                    AutoresearchFitnessRubricDiagram,
                    AutoresearchVsHomunculusDiagram,
                    UnexpectedDiscoveryDiagram,
                    NotebookLMMCPArchitectureDiagram,
                    SuperpowersPipelineDiagram,
                    ExecutionTimelineDiagram,
                    TwoPathApproachDiagram,
                    CaptainCoordinatorDiagram,
                    FivePhaseExecutionDiagram,
                    PIIProtectionLayersDiagram,
                    ThreeTierResearchDiagram,
                    FiveLayerArchitectureDiagram,
                    MemoryAuditFlowDiagram,
                    UIUXAgentOrchestrationDiagram,
                    UIUXResearchPipelineDiagram,
                    StorageCleanupFlowDiagram,
                    UniFiMCPArchitectureDiagram,
                    UniFiMCPToolSurfaceDiagram,
                    ProbeDecisionFlowDiagram,
                    DesignToCodePipelineDiagram,
                    RedesignAgentTeamDiagram,
                    EditorialPropagationDiagram,
                    img: ImageLightbox,
                  }}
                />
              </div>

              {/* Share + Subscribe + Author + Related + Comments */}
              <div className="ed-post-footer">
                <div>
                  <div className="ed-post-footer-head">Share this</div>
                  <SocialShare url={postUrl} title={post.title} />
                </div>
                <SubscribeForm />
                <div>
                  <div className="ed-post-footer-head">About the author</div>
                  <AuthorCard />
                </div>
              </div>
            </div>

            {/* Sidebar TOC for desktop */}
            <aside className="ed-post-aside">
              <BlogToc headings={headings} variant="sidebar" />
            </aside>
          </div>

          {/* Related Posts — full-width below the article+TOC layout */}
          <div className="ed-post-related mt-16">
            <div className="ed-post-footer-head">Related posts</div>
            <RelatedPosts posts={relatedPosts} />
          </div>

          {/* Comments section (subscriber-only) */}
          <div className="ed-post-comments mt-16">
            <BlogComments slug={slug} />
          </div>
        </div>
      </article>
    </>
  );
}
