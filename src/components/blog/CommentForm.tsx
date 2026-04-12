"use client";

import { ThumbsUp, ThumbsDown, Loader2, Send } from "lucide-react";

export interface CommentFormState {
  comment: string;
  reaction: "up" | "down";
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
    <form onSubmit={onSubmit} className="mb-8 space-y-4">
      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Share your thoughts..."
        rows={3}
        maxLength={2000}
        required
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[80px]"
      />

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        {/* Reaction toggle */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-1">Reaction:</span>
          <button
            type="button"
            onClick={() => onReactionChange("up")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              reaction === "up"
                ? "bg-success/20 text-success ring-1 ring-success/40"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Thumbs Up
          </button>
          <button
            type="button"
            onClick={() => onReactionChange("down")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              reaction === "down"
                ? "bg-destructive/20 text-destructive ring-1 ring-destructive/40"
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
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your-subscriber@email.com"
            className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
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
        <p className="text-sm text-success">{submitMessage}</p>
      )}
      {submitStatus === "error" && (
        <p className="text-sm text-destructive">{submitMessage}</p>
      )}
    </form>
  );
}
