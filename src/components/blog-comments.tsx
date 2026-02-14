"use client";

import { useState, useEffect, useCallback } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { ThumbsUp, ThumbsDown, Loader2, MessageSquare, Send } from "lucide-react";

interface Comment {
  id: number;
  slug: string;
  comment: string;
  reaction: "up" | "down";
  email: string;
  created_at: string;
}

interface BlogCommentsProps {
  slug: string;
  onThumbsUpCount?: (count: number) => void;
}

export function BlogComments({ slug, onThumbsUpCount }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [thumbsUp, setThumbsUp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState<"up" | "down">("up");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setThumbsUp(data.thumbsUp);
        onThumbsUpCount?.(data.thumbsUp);
      }
    } catch {
      // Silently fail — comments are non-critical
    } finally {
      setLoading(false);
    }
  }, [slug, onThumbsUpCount]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || !email.trim()) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, comment, reaction, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitStatus("error");
        setSubmitMessage(data.error ?? "Something went wrong.");
        return;
      }

      setSubmitStatus("success");
      setSubmitMessage("Comment posted!");
      sendGAEvent("event", "blog_comment", { post_slug: slug, reaction });
      setComment("");
      setReaction("up");
      setEmail("");

      // Refresh comments
      await fetchComments();

      // Clear success message after a few seconds
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Mask email for display: show first 2 chars + domain
  function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const visible = local.slice(0, 2);
    return `${visible}***@${domain}`;
  }

  return (
    <div className="mt-16 border-t border-border pt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Comments</h3>
          <p className="text-xs text-muted-foreground">
            Subscribers only — enter your subscriber email to comment
          </p>
        </div>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            if (submitStatus === "error") setSubmitStatus("idle");
          }}
          placeholder="Share your thoughts..."
          rows={3}
          maxLength={2000}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[80px]"
        />

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          {/* Reaction toggle */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Reaction:</span>
            <button
              type="button"
              onClick={() => setReaction("up")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                reaction === "up"
                  ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/40"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Thumbs Up
            </button>
            <button
              type="button"
              onClick={() => setReaction("down")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                reaction === "down"
                  ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Thumbs Down
            </button>
          </div>

          {/* Email + submit */}
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitStatus === "error") setSubmitStatus("idle");
              }}
              placeholder="your-subscriber@email.com"
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Post
            </button>
          </div>
        </div>

        {submitStatus === "success" && (
          <p className="text-sm text-green-400">{submitMessage}</p>
        )}
        {submitStatus === "error" && (
          <p className="text-sm text-red-400">{submitMessage}</p>
        )}
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-border bg-card/50 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {c.reaction === "up" ? (
                  <ThumbsUp className="h-4 w-4 text-green-400" />
                ) : (
                  <ThumbsDown className="h-4 w-4 text-red-400" />
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  {maskEmail(c.email)}
                </span>
                <span className="text-xs text-muted-foreground">&middot;</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Thumbs up summary at bottom */}
      {!loading && thumbsUp > 0 && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4 text-green-400" />
          <span>
            {thumbsUp} {thumbsUp === 1 ? "person" : "people"} liked this post
          </span>
        </div>
      )}
    </div>
  );
}
