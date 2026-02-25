"use client";

import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";

export function SubscribeForm() {
  const { email, status, message, handleSubmit, updateEmail } = useSubscribe();

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Weekly Digest</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-5">
        Get a weekly email with what I learned, summaries of new posts, and
        direct links. No spam, unsubscribe anytime.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="subscribe-email" className="sr-only">Email address</label>
          <input
            id="subscribe-email"
            type="email"
            required
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Subscribe
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}
