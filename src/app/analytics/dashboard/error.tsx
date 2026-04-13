"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="snes-dashboard"
      style={{
        padding: "32px",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <p
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "12px",
            color: "var(--snes-fire)",
            marginBottom: "16px",
            lineHeight: 1.6,
          }}
        >
          !! FILE CORRUPTED !!
        </p>
        <p
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "18px",
            color: "var(--snes-text-muted)",
            marginBottom: "8px",
          }}
        >
          {error.message || "Data load failed."}
        </p>
        <p
          style={{
            fontFamily: "var(--snes-font-body)",
            fontSize: "16px",
            color: "var(--snes-text-subtle)",
            marginBottom: "24px",
          }}
        >
          Run /dashboard-export to restore save data.
        </p>
        {error.digest && (
          <p
            style={{
              fontFamily: "var(--snes-font-body)",
              fontSize: "12px",
              color: "var(--snes-text-subtle)",
              marginBottom: "16px",
            }}
          >
            ERR: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="snes-button snes-button--md snes-button--secondary"
          style={{
            fontFamily: "var(--snes-font-heading)",
            fontSize: "8px",
            color: "var(--snes-text)",
            background: "var(--snes-surface)",
            border: "2px solid var(--snes-border-outer)",
            padding: "12px 20px",
            boxShadow: "2px 2px 0px #000",
            cursor: "pointer",
          }}
        >
          RETRY
        </button>
      </div>
    </div>
  );
}
