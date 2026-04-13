type BarType = "hp" | "mp" | "xp" | "fire" | "generic";

interface SNESProgressBarProps {
  value: number;
  max: number;
  type?: BarType;
  label?: string;
  compact?: boolean;
}

const BAR_COLORS: Record<BarType, { fill: string; bg: string }> = {
  hp: { fill: "var(--snes-hp)", bg: "var(--snes-hp-bg)" },
  mp: { fill: "var(--snes-mp)", bg: "var(--snes-mp-bg)" },
  xp: { fill: "var(--snes-xp)", bg: "var(--snes-xp-bg)" },
  fire: { fill: "var(--snes-fire)", bg: "var(--snes-fire-bg)" },
  generic: { fill: "var(--snes-gold)", bg: "var(--snes-surface)" },
};

export function SNESProgressBar({
  value,
  max,
  type = "generic",
  label,
  compact = false,
}: SNESProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const isCritical = pct < 20;
  const height = compact ? "12px" : "16px";
  const colors = BAR_COLORS[type];

  const fillStyle: React.CSSProperties = isCritical
    ? {
        background:
          "repeating-linear-gradient(90deg, var(--snes-fire) 0px, var(--snes-fire) 2px, #660000 2px, #660000 4px)",
        width: `${pct}%`,
        height: "100%",
        transition: "width var(--snes-anim-normal) linear",
      }
    : {
        background: colors.fill,
        width: `${pct}%`,
        height: "100%",
        transition: "width var(--snes-anim-normal) linear",
      };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "var(--snes-font-body)",
            fontSize: "var(--snes-text-sm)",
            color: "var(--snes-text-muted)",
          }}
        >
          <span>{label}</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-label={label ?? `${type} progress`}
        style={{
          background: colors.bg,
          height,
          border: "1px solid var(--snes-border-outer)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={fillStyle} />
      </div>
    </div>
  );
}
