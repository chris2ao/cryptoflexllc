"use client";

import { ThumbsUp, ThumbsDown, Loader2, Send } from "lucide-react";

export interface CommentFormState {
  comment: string;
  reaction: "up" | "down" | null;
  email: string;
  submitting: boolean;
  submitStatus: "idle" | "success" | "error";
  submitMessage: string;
}

interface CommentFormProps {
  state: CommentFormState;
  onCommentChange: (value: string) => void;
  onReactionChange: (value: "up" | "down") => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CommentForm({
  state,
  onCommentChange,
  onReactionChange,
  onEmailChange,
  onSubmit,
}: CommentFormProps) {
  const { comment, reaction, email, submitting, submitStatus, submitMessage } = state;

  return (
    <form onSubmit={onSubmit} className="ed-comment-form">
      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Share your thoughts..."
        aria-label="Comment"
        rows={3}
        maxLength={2000}
        required
        className="ed-comment-input"
      />

      <div className="ed-comment-row">
        {/* Reaction toggle */}
        <div className="ed-comment-toggles">
          <span className="ed-comment-label">Reaction</span>
          <button
            type="button"
            onClick={() => onReactionChange("up")}
            aria-pressed={reaction === "up"}
            aria-label="React with thumbs up"
            className="btn-editorial btn-editorial--sm ed-comment-toggle"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Thumbs Up
          </button>
          <button
            type="button"
            onClick={() => onReactionChange("down")}
            aria-pressed={reaction === "down"}
            aria-label="React with thumbs down"
            className="btn-editorial btn-editorial--sm ed-comment-toggle"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            Thumbs Down
          </button>
        </div>

        {/* Email + submit */}
        <div className="ed-comment-send">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your-subscriber@email.com"
            aria-label="Your subscriber email"
            className="ed-comment-input"
          />
          <button
            type="submit"
            disabled={submitting || reaction === null}
            className="btn-editorial btn-editorial--primary"
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

      {reaction === null && <p className="ed-comment-label">Pick a reaction</p>}

      {submitStatus === "success" && (
        <p className="ed-comment-status ed-comment-status--ok">{submitMessage}</p>
      )}
      {submitStatus === "error" && (
        <p className="ed-comment-status ed-comment-status--err">{submitMessage}</p>
      )}
    </form>
  );
}
