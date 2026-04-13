import { SNESPanel } from "./snes-panel";

type StatType = "hp" | "mp" | "xp" | "fire" | "generic";

interface SNESStatCardProps {
  value: number | string;
  label: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  type?: StatType;
}

const TYPE_COLOR: Record<StatType, string> = {
  hp: "var(--snes-hp)",
  mp: "var(--snes-mp)",
  xp: "var(--snes-xp)",
  fire: "var(--snes-fire)",
  generic: "var(--snes-gold)",
};

const TREND_ICON: Record<string, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const TREND_COLOR: Record<string, string> = {
  up: "var(--snes-hp)",
  down: "var(--snes-fire)",
  neutral: "var(--snes-text-muted)",
};

export function SNESStatCard({
  value,
  label,
  subValue,
  trend,
  type = "generic",
}: SNESStatCardProps) {
  const valueColor = TYPE_COLOR[type];

  return (
    <SNESPanel>
      <div
        style={{
          padding: "var(--snes-space-3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--snes-space-1)",
          minWidth: "80px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "28px",
            color: valueColor,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {String(value)}
          {trend && (
            <span
              style={{
                fontSize: "var(--snes-text-base)",
                color: TREND_COLOR[trend],
              }}
            >
              {TREND_ICON[trend]}
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-xs)",
            color: "var(--snes-text-muted)",
            textAlign: "center",
          }}
        >
          {label}
        </div>
        {subValue && (
          <div
            style={{
              fontFamily: "var(--snes-font-body)",
              fontSize: "var(--snes-text-sm)",
              color: "var(--snes-text-subtle)",
            }}
          >
            {subValue}
          </div>
        )}
      </div>
    </SNESPanel>
  );
}
