"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";

const DISMISSED_KEY = "cf_newsletter_dismissed_at";
const SUBSCRIBED_KEY = "cf_newsletter_subscribed";
const DELAY_MS = 20_000;
const GATE_MS = 60 * 60 * 1000;

const EXCLUDED_PREFIXES = ["/analytics", "/unsubscribe"];

function readTimestamp(key: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

function writeTimestamp(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    // localStorage unavailable (private mode, storage full) — silently skip
  }
}

function shouldSuppress(pathname: string | null): boolean {
  if (readTimestamp(SUBSCRIBED_KEY) !== null) return true;
  const dismissedAt = readTimestamp(DISMISSED_KEY);
  if (dismissedAt !== null && Date.now() - dismissedAt < GATE_MS) return true;
  if (pathname && EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export function NewsletterPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { email, status, message, handleSubmit, updateEmail } = useSubscribe();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: must detect client mount
    setMounted(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    writeTimestamp(DISMISSED_KEY);
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      dismiss();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [dismiss]);

  useEffect(() => {
    if (!mounted) return;
    if (shouldSuppress(pathname)) return;

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let elapsed = 0;
    let startedAt = Date.now();

    const schedule = (remaining: number) => {
      timerId = setTimeout(() => {
        setVisible(true);
      }, Math.max(0, remaining));
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
          elapsed += Date.now() - startedAt;
        }
      } else {
        startedAt = Date.now();
        schedule(DELAY_MS - elapsed);
      }
    };

    if (document.hidden) {
      // Start accumulating once the tab becomes visible
    } else {
      schedule(DELAY_MS);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (timerId !== null) clearTimeout(timerId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [mounted, pathname]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (visible) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [visible]);

  useEffect(() => {
    if (status === "success") {
      writeTimestamp(SUBSCRIBED_KEY);
      const timer = setTimeout(() => {
        setVisible(false);
        dialogRef.current?.close();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!mounted) return null;
  if (!visible) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="newsletter-popup-heading"
      aria-describedby="newsletter-popup-desc"
      className={[
        "fixed z-50 m-0 max-h-none max-w-none overflow-visible border-none bg-transparent p-0",
        "bottom-0 left-0 right-0 top-auto w-full",
        "sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2",
        "[&::backdrop]:bg-black/50",
      ].join(" ")}
      style={{ position: "fixed" }}
    >
      <div
        className="fixed inset-0 -z-10 sm:block hidden"
        aria-hidden="true"
        onClick={dismiss}
      />

      <div
        className={[
          "relative w-full rounded-none sm:rounded-lg",
          "bg-card border border-primary/20",
          "shadow-teal-glow",
          "p-6 sm:p-8",
          "sm:w-[440px] sm:max-w-[calc(100vw-2rem)]",
          "motion-safe:animate-slide-up sm:motion-safe:animate-none",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <h2
          id="newsletter-popup-heading"
          className="font-heading text-xl font-semibold tracking-tight pr-8"
        >
          Stay in the Loop
        </h2>

        <p
          id="newsletter-popup-desc"
          className="font-body mt-2 text-sm text-muted-foreground"
        >
          Get new posts delivered to your inbox. No spam, just tech.
        </p>

        {status === "success" ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-success">
            <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <div>
              <label htmlFor="newsletter-popup-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-popup-email"
                type="email"
                required
                value={email}
                onChange={(e) => updateEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || undefined}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              Subscribe
            </button>
          </form>
        )}

        {status === "error" && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {message}
          </p>
        )}
      </div>
    </dialog>
  );
}
