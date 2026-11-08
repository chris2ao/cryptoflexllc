"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { ThumbsUp, Loader2, MessageSquare } from "lucide-react";
import { CommentForm, type CommentFormState } from "@/components/blog/CommentForm";
import { CommentThread, type CommentWithReplies, type ReplyFormState } from "@/components/blog/CommentThread";

interface BlogCommentsProps {
  slug: string;
  onThumbsUpCount?: (count: number) => void;
}

async function loadComments(slug: string): Promise<{
  comments: CommentWithReplies[];
  thumbsUp: number;
}> {
  const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Comments request failed: ${res.status}`);
  return res.json();
}

export function BlogComments({ slug, onThumbsUpCount }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [thumbsUp, setThumbsUp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  // Form state
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState<"up" | "down" | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState("");
  const [replyReaction, setReplyReaction] = useState<"up" | "down" | null>(null);
  const [replyEmail, setReplyEmail] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyStatus, setReplyStatus] = useState<"idle" | "success" | "error">("idle");
  const [replyMessage, setReplyMessage] = useState("");

  /**
   * A failed fetch must not look like an empty thread.
   *
   * This previously ignored every non-ok response and swallowed thrown
   * errors, so when the API started returning 500 the UI rendered "No
   * comments yet" on every post. The endpoint was broken for months without
   * a visible symptom, because a backend failure and a genuinely empty
   * thread produced identical output.
   */
  const latestRequest = useRef<object | null>(null);
  const fetchComments = useCallback(() => {
    const request = {};
    latestRequest.current = request;
    return loadComments(slug)
      .then((data) => {
        if (request !== latestRequest.current) return;
        setComments(data.comments);
        setThumbsUp(data.thumbsUp);
        onThumbsUpCount?.(data.thumbsUp);
        setLoadFailed(false);
      })
      .catch((error) => {
        if (request !== latestRequest.current) return;
        console.error("Failed to load comments:", error);
        setLoadFailed(true);
      })
      .finally(() => {
        if (request === latestRequest.current) setLoading(false);
      });
  }, [slug, onThumbsUpCount]);

  useEffect(() => {
    void fetchComments();
    return () => {
      // Ignore responses from a previous post, refresh, or unmounted thread.
      latestRequest.current = null;
    };
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || !email.trim() || reaction === null) return;

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
      setReaction(null);
      setEmail("");

      await fetchComments();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !replyComment.trim() ||
      !replyEmail.trim() ||
      replyReaction === null ||
      replyingTo == null
    )
      return;

    setReplySubmitting(true);
    setReplyStatus("idle");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          comment: replyComment,
          reaction: replyReaction,
          email: replyEmail,
          parent_id: replyingTo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReplyStatus("error");
        setReplyMessage(data.error ?? "Something went wrong.");
        return;
      }

      setReplyStatus("success");
      setReplyMessage("Reply posted!");
      sendGAEvent("event", "blog_comment_reply", { post_slug: slug, reaction: replyReaction });
      setReplyComment("");
      setReplyReaction(null);
      setReplyEmail("");

      await fetchComments();
      setTimeout(() => {
        setReplyingTo(null);
        setReplyStatus("idle");
      }, 1500);
    } catch {
      setReplyStatus("error");
      setReplyMessage("Network error. Please try again.");
    } finally {
      setReplySubmitting(false);
    }
  }

  function cancelReply() {
    setReplyingTo(null);
    setReplyComment("");
    setReplyReaction(null);
    setReplyEmail("");
    setReplyStatus("idle");
    setReplyMessage("");
  }

  const formState: CommentFormState = {
    comment,
    reaction,
    email,
    submitting,
    submitStatus,
    submitMessage,
  };

  const replyState: ReplyFormState = {
    replyingTo,
    replyComment,
    replyReaction,
    replyEmail,
    replySubmitting,
    replyStatus,
    replyMessage,
  };

  return (
    <div className="ed-comments">
      <div className="ed-comments-head">
        <MessageSquare className="h-5 w-5 text-primary" />
        <div>
          <h3>Comments</h3>
          <p className="ed-comment-note">
            Subscribers only: enter your subscriber email to comment
          </p>
        </div>
      </div>

      <CommentForm
        state={formState}
        onCommentChange={(v) => {
          setComment(v);
          if (submitStatus === "error") setSubmitStatus("idle");
        }}
        onReactionChange={setReaction}
        onEmailChange={(v) => {
          setEmail(v);
          if (submitStatus === "error") setSubmitStatus("idle");
        }}
        onSubmit={handleSubmit}
      />

      {/* Comments list */}
      {loading ? (
        <div className="ed-comment-empty flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading comments...
        </div>
      ) : loadFailed ? (
        <div
          role="status"
          className="ed-comment-empty flex flex-col items-center gap-3"
        >
          <p>Comments could not be loaded right now.</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchComments();
            }}
            className="btn-editorial btn-editorial--sm"
          >
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="ed-comment-empty">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <CommentThread
          comments={comments}
          replyState={replyState}
          onStartReply={setReplyingTo}
          onCancelReply={cancelReply}
          onReplyCommentChange={(v) => {
            setReplyComment(v);
            if (replyStatus === "error") setReplyStatus("idle");
          }}
          onReplyReactionChange={setReplyReaction}
          onReplyEmailChange={(v) => {
            setReplyEmail(v);
            if (replyStatus === "error") setReplyStatus("idle");
          }}
          onReplySubmit={handleReplySubmit}
        />
      )}

      {/* Thumbs up summary at bottom */}
      {!loading && thumbsUp > 0 && (
        <div className="ed-comment-summary ed-comment-label">
          <ThumbsUp className="ed-comment-up h-4 w-4" />
          <span>
            {thumbsUp} {thumbsUp === 1 ? "person" : "people"} liked this post
          </span>
        </div>
      )}
    </div>
  );
}
