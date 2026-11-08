/**
 * Recent commit activity from the GitHub REST API. Never throws: any failure
 * yields an empty list. Cached for an hour because unauthenticated calls are
 * limited to 60 an hour.
 */

export type CommitSummary = { sha: string; message: string; date: string };

const GITHUB_TIMEOUT_MS = 8000;

function firstLine(text: unknown, max = 80): string {
  const line = String(text ?? "").split("\n")[0].trim();
  return line.length > max ? line.slice(0, max) : line;
}

export async function fetchRecentCommits(
  repo: string,
  sinceIso: string,
  token?: string,
  fetchImpl: typeof fetch = fetch
): Promise<CommitSummary[]> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    const url = `https://api.github.com/repos/${repo}/commits?since=${encodeURIComponent(sinceIso)}&per_page=100`;
    const res = await fetchImpl(url, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    if (!Array.isArray(json)) return [];
    return json.map((item) => {
      const c = (item ?? {}) as Record<string, unknown>;
      const commit = (c.commit ?? {}) as Record<string, unknown>;
      const author = (commit.author ?? {}) as Record<string, unknown>;
      return {
        sha: String(c.sha ?? ""),
        message: firstLine(commit.message),
        date: String(author.date ?? ""),
      };
    });
  } catch {
    return [];
  }
}

export function countSince(commits: CommitSummary[], sinceIso: string): number {
  const cutoff = new Date(sinceIso).getTime();
  if (!Number.isFinite(cutoff)) return 0;
  return commits.filter((c) => {
    const t = new Date(c.date).getTime();
    return Number.isFinite(t) && t >= cutoff;
  }).length;
}

/** Subjects written by cron jobs; they are not shipping work. */
export const AUTOMATED_COMMIT_PREFIXES = ["chore: update gmail metrics"] as const;

export function excludeAutomated(commits: CommitSummary[]): CommitSummary[] {
  return commits.filter(
    (c) => !AUTOMATED_COMMIT_PREFIXES.some((prefix) => c.message.startsWith(prefix))
  );
}
