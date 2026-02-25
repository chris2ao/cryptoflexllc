"use client";

import { CheckCircle, Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";

export function SubscribeInline() {
  const { email, status, message, handleSubmit, updateEmail } = useSubscribe();

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
                onChange={(e) => updateEmail(e.target.value)}
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
