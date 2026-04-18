import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAnalyticsCookieName, verifyAuthToken } from "@/lib/analytics-auth";
import { getBacklogPosts } from "@/lib/blog";
import { isGitHubApiConfigured } from "@/lib/github-api";
import { BacklogList } from "@/components/backlog-list";
import { EditorialPageHeader } from "@/components/editorial-page-header";

export const dynamic = "force-dynamic";

export default async function BacklogPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(getAnalyticsCookieName())?.value;
  if (!authToken || !verifyAuthToken(authToken)) {
    redirect("/analytics/login");
  }

  const posts = getBacklogPosts();
  const githubConfigured = isGitHubApiConfigured();

  // Extract unique tags from backlog posts
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  const allTags = Array.from(tagSet).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  // Strip content for serialization to client component
  const postSummaries = posts.map(({ content: _, ...rest }) => rest);

  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 00 / Drafts Backlog"
        overline="Draft queue"
        title={<>In the <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>pipeline.</em></>}
        lede={`${posts.length} draft${posts.length !== 1 ? "s" : ""} waiting to publish.`}
      >
        <div className="flex gap-3">
          <Link href="/analytics" className="btn-editorial btn-editorial--sm">
            Analytics
          </Link>
          <Link href="/blog" className="btn-editorial btn-editorial--sm">
            Blog
          </Link>
        </div>
      </EditorialPageHeader>
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">

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
        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No drafts in the backlog
          </div>
        ) : (
          <BacklogList posts={postSummaries} allTags={allTags} />
        )}
      </div>
      </section>
    </>
  );
}
