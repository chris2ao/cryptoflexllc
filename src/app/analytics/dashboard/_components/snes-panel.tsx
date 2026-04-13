import React from "react";

interface SNESPanelProps {
  title?: string;
  subtitle?: string;
  variant?: "default" | "highlighted" | "dimmed";
  headerAction?: React.ReactNode;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SNESPanel({
  title,
  subtitle,
  variant = "default",
  headerAction,
  loading = false,
  className = "",
  children,
}: SNESPanelProps) {
  const borderColor =
    variant === "highlighted"
      ? "var(--snes-gold)"
      : variant === "dimmed"
      ? "var(--snes-border-dim)"
      : "var(--snes-border-outer)";

  const opacity = variant === "dimmed" ? 0.8 : 1;

  return (
    <div
      className={`snes-panel ${className}`}
      style={{
        position: "relative",
        background: "var(--snes-surface)",
        border: `4px solid ${borderColor}`,
        outline: "2px solid var(--snes-border-inner)",
        outlineOffset: "-6px",
        boxShadow: "var(--snes-shadow-hard)",
        opacity,
      }}
    >
      {(title || headerAction) && (
        <div
          style={{
            background: "#0a0930",
            borderBottom: "2px solid var(--snes-border-outer)",
            padding: "var(--snes-space-2) var(--snes-space-4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--snes-space-2)",
          }}
        >
          <div>
            {title && (
              <span
                style={{
                  fontFamily: "var(--snes-font-heading)",
                  fontSize: "var(--snes-text-h4)",
                  color: variant === "highlighted" ? "var(--snes-gold)" : "var(--snes-gold)",
                }}
              >
                {title}
              </span>
            )}
            {subtitle && (
              <span
                style={{
                  fontFamily: "var(--snes-font-body)",
                  fontSize: "var(--snes-text-sm)",
                  color: "var(--snes-text-muted)",
                  marginLeft: "var(--snes-space-2)",
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      {loading ? (
        <div
          style={{
            padding: "var(--snes-space-8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--snes-text-muted)",
            fontFamily: "var(--snes-font-heading)",
            fontSize: "var(--snes-text-xs)",
          }}
        >
          LOADING...
        </div>
      ) : (
        children
      )}
    </div>
  );
}
