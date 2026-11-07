"use client";

import { Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";
import { SUBSCRIBE_COPY, showSubscriberCount } from "@/lib/subscribe-copy";

export function SubscribeBlock() {
  const { email, status, message, handleSubmit, updateEmail, subscriberCount } =
    useSubscribe();

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <section id="subscribe" className="ed-subscribe">
      <div className="ed-wrap ed-subscribe-inner">
        <div>
          <div className="ed-overline">Subscribe</div>
          <h2>
            Field notes, <em>every Monday.</em>
          </h2>
          <p>{SUBSCRIBE_COPY.body}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`subscribe-form${isSuccess ? " ok" : ""}`}
        >
          <div className="row">
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              required
              value={email}
              onChange={(e) => updateEmail(e.target.value)}
              placeholder={SUBSCRIBE_COPY.placeholder}
              disabled={isSuccess}
              aria-invalid={status === "error" ? true : undefined}
              aria-describedby={message ? "subscribe-message" : undefined}
            />
            <button
              type="submit"
              className="btn-editorial btn-editorial--primary"
              disabled={isLoading || isSuccess}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSuccess ? (
                "✓ Subscribed"
              ) : (
                SUBSCRIBE_COPY.cta
              )}
            </button>
          </div>
          <div className="meta" id="subscribe-message" aria-live="polite">
            {status === "error" && message ? (
              <span className="text-destructive">{message}</span>
            ) : isSuccess ? (
              SUBSCRIBE_COPY.success
            ) : showSubscriberCount(subscriberCount) ? (
              <>
                Join <b>{subscriberCount.toLocaleString()}</b> readers ·
                Unsubscribe anytime
              </>
            ) : (
              <>Weekly · Unsubscribe anytime · No tracking pixels</>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
