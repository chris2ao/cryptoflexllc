import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { getBacklogPosts } from "@/lib/blog";
import { isGitHubApiConfigured } from "@/lib/github-api";
import { BacklogPost } from "./_components/backlog-post";
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

export default async function BacklogPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  const posts = getBacklogPosts();
  const githubConfigured = isGitHubApiConfigured();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Blog Backlog</h1>
            <p className="mt-2 text-muted-foreground">
              {posts.length} draft{posts.length !== 1 ? "s" : ""} waiting to
              publish
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/analytics"
              className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>

        {/* Warning if no GITHUB_TOKEN */}
        {!githubConfigured && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 mb-8">
            <p className="text-sm text-yellow-200">
              <strong>GitHub token not configured.</strong> Publish and delete
              actions are disabled. Set{" "}
              <code className="px-1.5 py-0.5 rounded bg-yellow-900/30 font-mono text-xs">
                GITHUB_TOKEN
              </code>{" "}
              in your environment variables.
            </p>
          </div>
        )}

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No drafts in the backlog
          </div>
        )}

        {/* Posts */}
        {posts.map((post) => (
          <BacklogPost
            key={post.slug}
            post={post}
            githubConfigured={githubConfigured}
          >
            <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary/90 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border">
              <MDXRemote
                source={post.content}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
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
          </BacklogPost>
        ))}
      </div>
    </section>
  );
}
