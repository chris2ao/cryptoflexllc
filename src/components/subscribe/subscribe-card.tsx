"use client";

import { useId } from "react";
import { Loader2 } from "lucide-react";
import { useSubscribe } from "@/hooks/use-subscribe";
import { SUBSCRIBE_COPY, showSubscriberCount } from "@/lib/subscribe-copy";

export function SubscribeCard() {
  const { email, status, message, handleSubmit, updateEmail, subscriberCount } =
    useSubscribe();
  const uid = useId();
  const headingId = `${uid}-heading`;
  const emailId = `${uid}-email`;
  const messageId = `${uid}-message`;

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <section className="ed-subscribe-card" aria-labelledby={headingId}>
      <div className="ed-overline">Subscribe</div>
      <h3 id={headingId}>{SUBSCRIBE_COPY.title}</h3>
      <p>{SUBSCRIBE_COPY.body}</p>

      <form
        onSubmit={handleSubmit}
        className={`subscribe-form${isSuccess ? " ok" : ""}`}
      >
        <div className="row">
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            type="email"
            required
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            placeholder={SUBSCRIBE_COPY.placeholder}
            disabled={isSuccess}
            aria-invalid={status === "error" ? true : undefined}
            aria-describedby={message || isSuccess ? messageId : undefined}
          />
          <button
            type="submit"
            className="btn-editorial btn-editorial--primary"
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : isSuccess ? (
              "✓ Subscribed"
            ) : (
              SUBSCRIBE_COPY.cta
            )}
          </button>
        </div>
        <div className="meta" id={messageId} aria-live="polite">
          {status === "error" && message ? (
            <span className="text-destructive">{message}</span>
          ) : isSuccess ? (
            SUBSCRIBE_COPY.success
          ) : showSubscriberCount(subscriberCount) ? (
            <>
              Join <b>{subscriberCount.toLocaleString()}</b> readers · Unsubscribe
              anytime
            </>
          ) : (
            <>Weekly · Unsubscribe anytime · No tracking pixels</>
          )}
        </div>
      </form>
    </section>
  );
}
