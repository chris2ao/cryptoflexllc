"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface SNESButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
}

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: "36px", padding: "0 12px", fontSize: "var(--snes-text-xs)" },
  md: { height: "44px", padding: "0 16px", fontSize: "var(--snes-text-xs)" },
  lg: { height: "52px", padding: "0 24px", fontSize: "var(--snes-text-sm)" },
};

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--snes-surface-active)",
    border: "2px solid var(--snes-gold)",
    color: "var(--snes-gold)",
  },
  secondary: {
    background: "var(--snes-surface)",
    border: "2px solid var(--snes-border-outer)",
    color: "var(--snes-text)",
  },
  ghost: {
    background: "transparent",
    border: "2px solid var(--snes-border-dim)",
    color: "var(--snes-text-muted)",
  },
  danger: {
    background: "var(--snes-fire-bg)",
    border: "2px solid var(--snes-fire)",
    color: "var(--snes-fire)",
  },
};

export function SNESButton({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = "button",
  className = "",
  children,
}: SNESButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`snes-button ${className}`}
      style={{
        ...SIZE_STYLES[size],
        ...VARIANT_STYLES[variant],
        fontFamily: "var(--snes-font-heading)",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.4 : 1,
        boxShadow: "var(--snes-shadow-hard-sm)",
        transition: "box-shadow var(--snes-anim-fast) linear, transform var(--snes-anim-fast) linear",
        borderRadius: 0,
      }}
    >
      {loading ? (
        <span style={{ animation: "snes-cursor-blink var(--snes-anim-cursor) steps(1) infinite" }}>
          ▸
        </span>
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
      <style>{`
        .snes-button:hover:not(:disabled) {
          box-shadow: 3px 3px 0px #000 !important;
          color: var(--snes-gold) !important;
        }
        .snes-button:active:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #000 !important;
        }
        .snes-button:focus-visible {
          outline: 2px solid var(--snes-gold);
          outline-offset: 2px;
        }
      `}</style>
    </button>
  );
}
