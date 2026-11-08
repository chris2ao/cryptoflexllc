import type { DeploymentSummary } from "@/lib/vercel-api";

export function relativeTime(ms: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ms);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function stateTone(state: string): "ok" | "err" | "muted" | "warn" {
  const s = state.toUpperCase();
  if (s === "READY") return "ok";
  if (s === "ERROR") return "err";
  if (s === "CANCELED") return "muted";
  return "warn";
}

export function DeploysStrip({
  deployments,
}: {
  deployments: Pick<
    DeploymentSummary,
    "id" | "state" | "createdAt" | "commitMessage" | "commitSha"
  >[];
}) {
  if (deployments.length === 0) {
    return <div className="ax-empty">No deployments returned</div>;
  }
  return (
    <ul className="ax-dstrip" aria-label="Recent deployments">
      {deployments.map((d) => (
        <li
          key={d.id}
          className="ax-dchip"
          title={d.commitSha ? d.commitSha.slice(0, 7) : d.id}
        >
          <span
            className={`ax-ddot ${stateTone(d.state)}`}
            role="img"
            aria-label={d.state}
          />
          <span className="ax-dtime">{relativeTime(d.createdAt)}</span>
          <span className="ax-dmsg">{d.commitMessage || "(no commit message)"}</span>
        </li>
      ))}
    </ul>
  );
}
