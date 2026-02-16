import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { getBacklogPostBySlug } from "@/lib/blog";
import { isGitHubApiConfigured } from "@/lib/github-api";
import { PostActionBar } from "../_components/post-action-bar";
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
} from "@/components/mdx";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BacklogPostPage({ params }: Props) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  const { slug } = await params;
  const post = getBacklogPostBySlug(slug);
  if (!post) notFound();

  const githubConfigured = isGitHubApiConfigured();

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/backlog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Backlog
        </Link>

        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-500/40 text-yellow-400">
              Draft
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
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

          {/* Publish / Delete actions */}
          <div className="mt-6">
            {!githubConfigured && (
              <p className="text-sm text-yellow-400 mb-3">
                GitHub token not configured. Actions are disabled.
              </p>
            )}
            <PostActionBar slug={post.slug} disabled={!githubConfigured} />
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
            }}
          />
        </div>
      </div>
    </article>
  );
}
