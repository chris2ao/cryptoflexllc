"use client";

import { useState, useEffect, useCallback } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { ThumbsUp, Loader2, MessageSquare } from "lucide-react";
import { CommentForm, type CommentFormState } from "@/components/blog/CommentForm";
import { CommentThread, type CommentWithReplies, type ReplyFormState } from "@/components/blog/CommentThread";

interface BlogCommentsProps {
  slug: string;
  onThumbsUpCount?: (count: number) => void;
}

export function BlogComments({ slug, onThumbsUpCount }: BlogCommentsProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [thumbsUp, setThumbsUp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [comment, setComment] = useState("");
  const [reaction, setReaction] = useState<"up" | "down">("up");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  // Reply state
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState("");
  const [replyReaction, setReplyReaction] = useState<"up" | "down">("up");
  const [replyEmail, setReplyEmail] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyStatus, setReplyStatus] = useState<"idle" | "success" | "error">("idle");
  const [replyMessage, setReplyMessage] = useState("");

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
    if (!replyComment.trim() || !replyEmail.trim() || replyingTo == null) return;

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
      setReplyReaction("up");
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
    setReplyReaction("up");
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
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
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
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <ThumbsUp className="h-4 w-4 text-success" />
          <span>
            {thumbsUp} {thumbsUp === 1 ? "person" : "people"} liked this post
          </span>
        </div>
      )}
    </div>
  );
}
