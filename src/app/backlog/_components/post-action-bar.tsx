"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ActionState =
  | "idle"
  | "confirming-publish"
  | "confirming-delete"
  | "loading"
  | "success"
  | "error";

export function PostActionBar({
  slug,
  disabled,
}: {
  slug: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>("idle");
  const [message, setMessage] = useState("");

  async function handlePublish() {
    setState("loading");
    try {
      const res = await fetch("/api/backlog/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Publish failed");
      }
      setState("success");
      setMessage("Published! Vercel will deploy shortly.");
      setTimeout(() => router.refresh(), 2000);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Publish failed");
    }
  }

  async function handleDelete() {
    setState("loading");
    try {
      const res = await fetch(`/api/backlog/${encodeURIComponent(slug)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      setState("success");
      setMessage("Draft deleted.");
      setTimeout(() => router.refresh(), 2000);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Delete failed");
    }
  }

  // Success banner
  if (state === "success") {
    return (
      <div className="rounded-md bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-200">
        {message}
      </div>
    );
  }

  // Error banner
  if (state === "error") {
    return (
      <div className="flex flex-col gap-2">
        <div className="rounded-md bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200">
          {message}
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // Confirming publish
  if (state === "confirming-publish") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Publish this draft to production?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePublish}
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Yes, Publish
          </button>
          <button
            onClick={() => setState("idle")}
            className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Confirming delete
  if (state === "confirming-delete") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          Permanently delete this draft?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setState("idle")}
            className="inline-flex items-center justify-center rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Processing...</span>
      </div>
    );
  }

  // Idle state - show action buttons
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setState("confirming-publish")}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Publish
      </button>
      <button
        onClick={() => setState("confirming-delete")}
        disabled={disabled}
        className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>
  );
}
