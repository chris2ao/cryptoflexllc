"use client";

import { useState } from "react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/analytics/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // best-effort — still redirect
    }
    window.location.href = "/analytics/login";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`btn-editorial btn-editorial--sm ${className}`.trim()}
      aria-label="Sign out of analytics"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
