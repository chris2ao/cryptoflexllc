import type { WebVitalsSummary } from "@/lib/analytics-types";

type Threshold = { good: number; poor: number; unit: string };

const THRESHOLDS: Record<string, Threshold> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
  FID: { good: 100, poor: 300, unit: "ms" },
  SI: { good: 3400, poor: 5800, unit: "ms" },
  TBT: { good: 200, poor: 600, unit: "ms" },
};

const METRIC_LABELS: Record<string, string> = {
  LCP: "Largest Contentful Paint",
  INP: "Interaction to Next Paint",
  CLS: "Cumulative Layout Shift",
  FCP: "First Contentful Paint",
  TTFB: "Time to First Byte",
  FID: "First Input Delay",
  SI: "Speed Index",
  TBT: "Total Blocking Time",
};

const METRIC_ORDER = ["LCP", "INP", "CLS", "FCP", "TTFB", "FID", "SI", "TBT"];

type Formatted = { text: string; unit: string };

function formatValue(name: string, value: number | null): Formatted {
  if (value == null) return { text: "—", unit: "" };
  if (name === "CLS") return { text: value.toFixed(3), unit: "" };
  if (value >= 1000) return { text: (value / 1000).toFixed(2), unit: "s" };
  return { text: String(Math.round(value)), unit: "ms" };
}

type Rating = "good" | "warn" | "poor" | "unknown";

function getRating(name: string, p75: number | null): Rating {
  if (p75 == null) return "unknown";
  const t = THRESHOLDS[name];
  if (!t) return "unknown";
  if (p75 <= t.good) return "good";
  if (p75 <= t.poor) return "warn";
  return "poor";
}

function ratingLabel(r: Rating): string {
  if (r === "good") return "Good";
  if (r === "warn") return "Needs improvement";
  if (r === "poor") return "Poor";
  return "No data";
}

function ratingColor(r: Rating): string {
  if (r === "good") return "var(--ax-green)";
  if (r === "warn") return "var(--ax-amber)";
  if (r === "poor") return "var(--ax-red)";
  return "var(--fg-4)";
}

export function WebVitalsGrid({ data }: { data: WebVitalsSummary[] }) {
  const byName = new Map(data.map((d) => [d.metric_name, d]));

  return (
    <div className="ax-vitals-grid">
      {METRIC_ORDER.map((name) => {
        const metric = byName.get(name);
        const threshold = THRESHOLDS[name];
        const p75 = metric?.p75 ?? null;
        const rating = getRating(name, p75);
        const color = ratingColor(rating);
        const value = formatValue(name, p75);

        const budget = threshold ? formatValue(name, threshold.good) : null;
        const budgetText = budget
          ? `Budget ${budget.text}${budget.unit}`
          : "No budget";

        // Segment bar: three segments (good/warn/poor), proportions by threshold ratios.
        let p = 0;
        if (threshold && p75 != null) {
          const max = threshold.poor * 1.5;
          p = Math.max(0, Math.min(100, (p75 / max) * 100));
        }

        return (
          <div key={name} className="ax-vital-card">
            <div className="ax-vital-label">
              <span>{name}</span>
              <span className="hint">{METRIC_LABELS[name] ?? ""}</span>
            </div>
            <div className="ax-vital-value" style={{ color }}>
              {value.text}
              {value.unit && <span className="unit">{value.unit}</span>}
            </div>
            <div className="ax-vital-bar" aria-hidden="true">
              <div className="seg good" />
              <div className="seg warn" />
              <div className="seg poor" />
              {p75 != null && (
                <div className="marker" style={{ left: `${p}%` }} />
              )}
            </div>
            <div className="ax-vital-status">
              <span className="dot" style={{ background: color }} aria-hidden="true" />
              <span>{ratingLabel(rating)}</span>
              <span className="budget">· {budgetText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
