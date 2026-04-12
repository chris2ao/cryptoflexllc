"use client";

import { ThumbsUp, ThumbsDown, Loader2, Send, Reply, X } from "lucide-react";

export interface Comment {
  id: number;
  slug: string;
  comment: string;
  reaction: "up" | "down";
  email: string;
  created_at: string;
  parent_id: number | null;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
}

export interface ReplyFormState {
  replyingTo: number | null;
  replyComment: string;
  replyReaction: "up" | "down";
  replyEmail: string;
  replySubmitting: boolean;
  replyStatus: "idle" | "success" | "error";
  replyMessage: string;
}

interface CommentThreadProps {
  comments: CommentWithReplies[];
  replyState: ReplyFormState;
  onStartReply: (id: number) => void;
  onCancelReply: () => void;
  onReplyCommentChange: (value: string) => void;
  onReplyReactionChange: (value: "up" | "down") => void;
  onReplyEmailChange: (value: string) => void;
  onReplySubmit: (e: React.FormEvent) => void;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

function CommentCard({ c, isReply = false }: { c: Comment; isReply?: boolean }) {
  return (
    <div
      id={`comment-${c.id}`}
      className={`rounded-lg border border-border bg-card/50 p-4 ${isReply ? "ml-8 border-l-2 border-l-primary/30" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isReply && <Reply className="h-3.5 w-3.5 text-muted-foreground" />}
        {c.reaction === "up" ? (
          <ThumbsUp className="h-4 w-4 text-success" />
        ) : (
          <ThumbsDown className="h-4 w-4 text-destructive" />
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
  );
}

function ReplyForm({
  parentId,
  replyState,
  onCancelReply,
  onReplyCommentChange,
  onReplyReactionChange,
  onReplyEmailChange,
  onReplySubmit,
}: {
  parentId: number;
  replyState: ReplyFormState;
  onCancelReply: () => void;
  onReplyCommentChange: (value: string) => void;
  onReplyReactionChange: (value: "up" | "down") => void;
  onReplyEmailChange: (value: string) => void;
  onReplySubmit: (e: React.FormEvent) => void;
}) {
  const {
    replyingTo,
    replyComment,
    replyReaction,
    replyEmail,
    replySubmitting,
    replyStatus,
    replyMessage,
  } = replyState;

  if (replyingTo !== parentId) return null;

  return (
    <div className="ml-8 mt-2">
      <form
        onSubmit={onReplySubmit}
        className="space-y-3 rounded-lg border border-primary/20 bg-card/30 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-primary">Replying to comment</span>
          <button
            type="button"
            onClick={onCancelReply}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>

        <textarea
          value={replyComment}
          onChange={(e) => onReplyCommentChange(e.target.value)}
          placeholder="Write your reply..."
          rows={2}
          maxLength={2000}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-y min-h-[60px]"
        />

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          {/* Reaction toggle */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Reaction:</span>
            <button
              type="button"
              onClick={() => onReplyReactionChange("up")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                replyReaction === "up"
                  ? "bg-success/20 text-success ring-1 ring-success/40"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Up
            </button>
            <button
              type="button"
              onClick={() => onReplyReactionChange("down")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                replyReaction === "down"
                  ? "bg-destructive/20 text-destructive ring-1 ring-destructive/40"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Down
            </button>
          </div>

          {/* Email + submit */}
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <input
              type="email"
              required
              value={replyEmail}
              onChange={(e) => onReplyEmailChange(e.target.value)}
              placeholder="your-subscriber@email.com"
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={replySubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              {replySubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Reply
            </button>
          </div>
        </div>

        {replyStatus === "success" && (
          <p className="text-sm text-success">{replyMessage}</p>
        )}
        {replyStatus === "error" && (
          <p className="text-sm text-destructive">{replyMessage}</p>
        )}
      </form>
    </div>
  );
}

export function CommentThread({
  comments,
  replyState,
  onStartReply,
  onCancelReply,
  onReplyCommentChange,
  onReplyReactionChange,
  onReplyEmailChange,
  onReplySubmit,
}: CommentThreadProps) {
  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <div key={c.id}>
          <CommentCard c={c} />

          {/* Reply button */}
          <div className="mt-1 ml-2">
            <button
              type="button"
              onClick={() => {
                if (replyState.replyingTo === c.id) {
                  onCancelReply();
                } else {
                  onCancelReply();
                  onStartReply(c.id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Reply className="h-3.5 w-3.5" />
              Reply
            </button>
          </div>

          {/* Reply form */}
          <ReplyForm
            parentId={c.id}
            replyState={replyState}
            onCancelReply={onCancelReply}
            onReplyCommentChange={onReplyCommentChange}
            onReplyReactionChange={onReplyReactionChange}
            onReplyEmailChange={onReplyEmailChange}
            onReplySubmit={onReplySubmit}
          />

          {/* Replies */}
          {c.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {c.replies.map((reply) => (
                <CommentCard key={reply.id} c={reply} isReply />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
