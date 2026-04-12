"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";

const STORAGE_KEY = "cf_newsletter_dismissed";
const GATE_DAYS = 7;

function isDismissedRecently(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const dismissed = new Date(raw).getTime();
    const cutoff = Date.now() - GATE_DAYS * 24 * 60 * 60 * 1000;
    return dismissed > cutoff;
  } catch {
    return false;
  }
}

function saveDismissal(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  } catch {
    // localStorage unavailable (private mode, etc.) -- silently skip
  }
}

interface NewsletterPopupProps {
  sentinelId?: string;
}

export function NewsletterPopup({
  sentinelId = "newsletter-sentinel",
}: NewsletterPopupProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { email, status, message, handleSubmit, updateEmail } = useSubscribe();

  // Mount guard so we never touch localStorage during SSR
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration: must detect client mount
    setMounted(true);
  }, []);

  // Close and persist dismissal
  const dismiss = useCallback(() => {
    setVisible(false);
    saveDismissal();
    dialogRef.current?.close();
  }, []);

  // Close on Escape key (dialog element handles this natively, but we also
  // need to persist the dismissal timestamp)
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

  // IntersectionObserver watching the sentinel element
  useEffect(() => {
    if (!mounted) return;
    if (isDismissedRecently()) return;

    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [mounted, sentinelId]);

  // Open/close the <dialog> imperatively when visibility changes
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (visible) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [visible]);

  // Dismiss automatically after a successful subscribe
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        dismiss();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, dismiss]);

  // Don't render during SSR or when not needed
  if (!mounted) return null;
  if (!visible) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="newsletter-popup-heading"
      aria-describedby="newsletter-popup-desc"
      className={[
        // Reset default dialog styles
        "fixed z-50 m-0 max-h-none max-w-none overflow-visible border-none bg-transparent p-0",
        // Mobile: full-width bottom sheet
        "bottom-0 left-0 right-0 top-auto w-full",
        // Desktop: centered modal
        "sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2",
        // Animate slide-up from bottom; respect reduced motion
        "motion-safe:translate-y-full motion-safe:data-[open]:translate-y-0",
        "motion-safe:transition-transform motion-safe:duration-[250ms] motion-safe:ease-out",
        // Backdrop styling via ::backdrop
        "[&::backdrop]:bg-black/50",
      ].join(" ")}
      style={{ position: "fixed" }}
    >
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0 -z-10 sm:block hidden"
        aria-hidden="true"
        onClick={dismiss}
      />

      {/* Card */}
      <div
        className={[
          "relative w-full rounded-none sm:rounded-lg",
          "bg-card border border-primary/20",
          "shadow-teal-glow",
          "p-6 sm:p-8",
          "sm:w-[440px] sm:max-w-[calc(100vw-2rem)]",
          // Slide-up animation on the card itself for mobile
          "motion-safe:animate-slide-up sm:motion-safe:animate-none",
        ].join(" ")}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter popup"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Heading */}
        <h2
          id="newsletter-popup-heading"
          className="font-heading text-xl font-semibold tracking-tight pr-8"
        >
          Stay in the Loop
        </h2>

        {/* Body text */}
        <p
          id="newsletter-popup-desc"
          className="font-body mt-2 text-sm text-muted-foreground"
        >
          Get new posts delivered to your inbox. No spam, just tech.
        </p>

        {/* Success state */}
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

        {/* Error message */}
        {status === "error" && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {message}
          </p>
        )}
      </div>
    </dialog>
  );
}
