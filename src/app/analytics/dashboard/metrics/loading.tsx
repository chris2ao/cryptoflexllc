export default function MetricsLoading() {
  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--snes-space-4)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--snes-font-heading)",
          fontSize: "var(--snes-text-h2)",
          color: "var(--snes-entity-command)",
          animation: "snes-cursor-blink 530ms steps(1) infinite",
        }}
      >
        ▲
      </div>
      <div
        style={{
          fontFamily: "var(--snes-font-heading)",
          fontSize: "var(--snes-text-xs)",
          color: "var(--snes-text-muted)",
        }}
      >
        LOADING METRICS...
      </div>
      <div
        style={{
          width: "200px",
          height: "8px",
          background: "var(--snes-surface)",
          border: "2px solid var(--snes-border-outer)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "80%",
            background: "var(--snes-entity-command)",
            animation: "snes-shimmer 1.2s steps(2) infinite",
          }}
        />
      </div>
    </div>
  );
}
