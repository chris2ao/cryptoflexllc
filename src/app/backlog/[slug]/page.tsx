import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { getBacklogPostBySlug, getSeriesPosts } from "@/lib/blog";
import { formatPostDateShort } from "@/lib/post-date";
import { extractHeadings } from "@/lib/headings";
import { createHeading } from "@/components/blog/heading-anchor";
import { isGitHubApiConfigured } from "@/lib/github-api";
import { PostActionBar } from "../_components/post-action-bar";
import { ReadingProgress } from "@/components/reading-progress";
import { BlogToc } from "@/components/blog-toc";
import { BlogSeriesNav } from "@/components/blog-series-nav";
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
  HomenetDocumentTeamDiagram,
  PiholeResearchToShipDiagram,
  PiholeSessionAuthDiagram,
  TokenBudgetFlowDiagram,
  DesignToCodePipelineDiagram,
  RedesignAgentTeamDiagram,
  EditorialPropagationDiagram,
  SupplyChainAttackDiagram,
  AIResponseLoopDiagram,
  RotationLadderDiagram,
  WazuhHomelabIngestDiagram,
  WazuhWavesDependencyDiagram,
  WazuhBugCascadeDiagram,
  WazuhFinalArchitectureDiagram,
  ZBFPolicyChainDiagram,
  TrafficRulesAssumptionsDiagram,
  SiemLoglakeArchitectureDiagram,
  SiemLoglakeIngestionDiagram,
  SiemSchemaEnginesDiagram,
  SiemRolloutTimelineDiagram,
  AI1ScoringModelDiagram,
  AI1TrustBoundaryDiagram,
  CIPipelineInjectionDiagram,
  OWASPLLMTop10Diagram,
  FeedSuffixMatchTiersDiagram,
  WatchdogColdStartDiagram,
  ImportPipelineFlow,
  AgentTeamTopology,
  AiAdapterSeam,
  AnalyticsSingleSource,
  ChatTurnArchitecture,
  McpHandshakeOrder,
  DesignSystemSharedRecordDiagram,
  AccessibleNameVsVisualDiagram,
  ReviewPipelineDiagram,
  FrontmatterEvalDiagram,
  CriticalBlastRadiusDiagram,
  SpoofedIdentityRateLimitDiagram,
  SharedCounterBucketsDiagram,
  SilentCSPFailureDiagram,
  ImageLightbox,
  CoverImageLightbox,
  MermaidDiagram,
  YouTubeEmbed,
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

  const headings = extractHeadings(post.content);
  const seriesPosts = post.series
    ? [
        ...getSeriesPosts(post.series).filter((p) => p.slug !== post.slug),
        post,
      ].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
    : [];
  const kicker = post.series ?? post.tags[0] ?? "Field notes";

  return (
    <>
      <ReadingProgress />
      <article className="ed-post">
        <div className="ed-post-inner">
          {/* Back link + draft actions */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/backlog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Backlog
            </Link>
            <div className="flex items-center gap-3">
              {!githubConfigured && (
                <p className="text-sm text-yellow-400">
                  GitHub token not configured. Actions are disabled.
                </p>
              )}
              <PostActionBar slug={post.slug} disabled={!githubConfigured} />
            </div>
          </div>

          {/* Post header: editorial, matching the production blog */}
          <header className="ed-post-header">
            <div className="ed-overline">
              § Backlog / Draft Preview · {kicker}
            </div>
            <div className="ed-post-tag-row">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-yellow-500/40 text-yellow-400">
                Draft
              </span>
              {post.tags.map((tag) => (
                <span key={tag} className="ed-tag">
                  {tag}
                </span>
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
                <b>{formatPostDateShort(post.date)}</b>
              </time>
              {post.readingTime && (
                <>
                  <span className="sep">·</span>
                  <span>
                    <b>{post.readingTime}</b>
                  </span>
                </>
              )}
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

          {/* Series Navigation (draft merged into the published series) */}
          {post.series && seriesPosts.length > 1 && (
            <div className="max-w-[720px] mx-auto mb-10">
              <BlogSeriesNav
                seriesName={post.series}
                posts={seriesPosts}
                currentSlug={post.slug}
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
              HomenetDocumentTeamDiagram,
              PiholeResearchToShipDiagram,
              PiholeSessionAuthDiagram,
              TokenBudgetFlowDiagram,
              DesignToCodePipelineDiagram,
              RedesignAgentTeamDiagram,
              EditorialPropagationDiagram,
              SupplyChainAttackDiagram,
              AIResponseLoopDiagram,
              RotationLadderDiagram,
              WazuhHomelabIngestDiagram,
              WazuhWavesDependencyDiagram,
              WazuhBugCascadeDiagram,
              WazuhFinalArchitectureDiagram,
              ZBFPolicyChainDiagram,
              TrafficRulesAssumptionsDiagram,
              SiemLoglakeArchitectureDiagram,
              SiemLoglakeIngestionDiagram,
              SiemSchemaEnginesDiagram,
              SiemRolloutTimelineDiagram,
              AI1ScoringModelDiagram,
              AI1TrustBoundaryDiagram,
              CIPipelineInjectionDiagram,
              OWASPLLMTop10Diagram,
              FeedSuffixMatchTiersDiagram,
              WatchdogColdStartDiagram,
              ImportPipelineFlow,
              AgentTeamTopology,
              AiAdapterSeam,
              AnalyticsSingleSource,
              ChatTurnArchitecture,
              McpHandshakeOrder,
              DesignSystemSharedRecordDiagram,
              AccessibleNameVsVisualDiagram,
              ReviewPipelineDiagram,
              FrontmatterEvalDiagram,
              CriticalBlastRadiusDiagram,
              SpoofedIdentityRateLimitDiagram,
              SharedCounterBucketsDiagram,
              SilentCSPFailureDiagram,
              MermaidDiagram,
              YouTubeEmbed,
              img: ImageLightbox,
            }}
          />
              </div>
            </div>

            {/* Sidebar TOC for desktop */}
            <aside className="ed-post-aside">
              <BlogToc headings={headings} variant="sidebar" />
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
