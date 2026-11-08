import { relativeTime, stateTone } from "./deploys-strip";

export type Shipping = {
  available: boolean;
  commits7d: number;
  commits14d: number;
  deploys7d: number;
  lastDeploy: { state: string; createdAt: number; commitMessage: string } | null;
};

export function ShippingPanel({ shipping }: { shipping: Shipping }) {
  const { available, commits7d, commits14d, deploys7d, lastDeploy } = shipping;
  if (!available) {
    return (
      <p className="ax-empty">
        Shipping data unavailable (GitHub or Vercel did not answer in time)
      </p>
    );
  }
  return (
    <div className="ax-stat-row">
      <div className="ax-stat">
        <span className="v">
          {commits7d}
          <span className="ax-stat-sub"> / {commits14d} in 14d</span>
        </span>
        <span className="l">Commits last 7 days</span>
      </div>
      <div className="ax-stat">
        <span className="v">{deploys7d}</span>
        <span className="l">Deploys last 7 days</span>
      </div>
      <div className="ax-stat" title={lastDeploy?.commitMessage || undefined}>
        <span className="v">
          {lastDeploy ? (
            <>
              <span className={`ax-ddot ${stateTone(lastDeploy.state)}`} aria-hidden="true" />{" "}
              {lastDeploy.state} · {relativeTime(lastDeploy.createdAt)}
            </>
          ) : (
            "none"
          )}
        </span>
        <span className="l">Last deploy</span>
      </div>
    </div>
  );
}
