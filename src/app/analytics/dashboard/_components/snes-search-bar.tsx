"use client";

interface SNESSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  loading?: boolean;
}

export function SNESSearchBar({
  value,
  onChange,
  placeholder = "SEARCH_",
  onClear,
  loading = false,
}: SNESSearchBarProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "var(--snes-bg)",
          border: "2px solid var(--snes-border-outer)",
          color: "var(--snes-text)",
          fontFamily: "var(--snes-font-body)",
          fontSize: "var(--snes-text-base)",
          padding: "8px 44px 8px 12px",
          outline: "none",
          caretColor: "var(--snes-cursor)",
          borderRadius: 0,
        }}
        className="snes-search-input"
      />
      <div
        style={{
          position: "absolute",
          right: "8px",
          display: "flex",
          alignItems: "center",
          color: "var(--snes-text-muted)",
          fontSize: "var(--snes-text-base)",
          pointerEvents: loading || !value ? "none" : "auto",
        }}
      >
        {loading ? (
          <span
            style={{
              animation:
                "snes-cursor-blink var(--snes-anim-cursor) steps(1) infinite",
            }}
          >
            ▸
          </span>
        ) : value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClear?.();
            }}
            style={{
              background: "none",
              border: "none",
              color: "var(--snes-text-muted)",
              cursor: "pointer",
              fontFamily: "var(--snes-font-body)",
              fontSize: "var(--snes-text-lg)",
              padding: "0 4px",
              lineHeight: 1,
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>
      <style>{`
        .snes-search-input:focus {
          border-color: var(--snes-gold) !important;
          outline: none;
        }
        .snes-search-input::placeholder {
          color: var(--snes-text-subtle);
        }
      `}</style>
    </div>
  );
}
