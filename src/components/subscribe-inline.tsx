"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { CheckCircle, Loader2 } from "lucide-react";

export function SubscribeInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're subscribed! Check your inbox on Mondays.");
      setEmail("");
      sendGAEvent("event", "subscribe", { method: "email" });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="py-10 sm:py-12 border-t border-border/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 text-sm text-green-400">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <p className="text-sm text-muted-foreground shrink-0">
              Weekly insights on cybersecurity and AI, delivered Mondays.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex w-full sm:w-auto gap-2"
            >
              <label htmlFor="subscribe-inline-email" className="sr-only">Email address</label>
              <input
                id="subscribe-inline-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                className="flex-1 sm:w-64 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Subscribe
              </button>
            </form>
          </div>
        )}
        {status === "error" && (
          <p className="mt-2 text-center text-sm text-red-400">{message}</p>
        )}
      </div>
    </section>
  );
}
