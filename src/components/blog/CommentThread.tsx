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
  replyReaction: "up" | "down" | null;
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
      className={isReply ? "ed-comment ed-comment--reply" : "ed-comment"}
    >
      <div className="ed-comment-meta">
        {isReply && <Reply className="h-3.5 w-3.5" />}
        {c.reaction === "up" ? (
          <ThumbsUp className="ed-comment-up h-4 w-4" />
        ) : (
          <ThumbsDown className="ed-comment-down h-4 w-4" />
        )}
        <span>{maskEmail(c.email)}</span>
        <span>&middot;</span>
        <span>
          {new Date(c.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="ed-comment-body">{c.comment}</p>
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
    <div className="ed-reply-slot">
      <form onSubmit={onReplySubmit} className="ed-reply-form">
        <div className="ed-reply-head">
          <span className="ed-comment-label">Replying to comment</span>
          <button type="button" onClick={onCancelReply} className="ed-comment-link">
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>

        <textarea
          value={replyComment}
          onChange={(e) => onReplyCommentChange(e.target.value)}
          placeholder="Write your reply..."
          aria-label="Reply"
          rows={2}
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
              onClick={() => onReplyReactionChange("up")}
              aria-pressed={replyReaction === "up"}
              aria-label="React with thumbs up"
              className="btn-editorial btn-editorial--sm ed-comment-toggle"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Up
            </button>
            <button
              type="button"
              onClick={() => onReplyReactionChange("down")}
              aria-pressed={replyReaction === "down"}
              aria-label="React with thumbs down"
              className="btn-editorial btn-editorial--sm ed-comment-toggle"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Down
            </button>
          </div>

          {/* Email + submit */}
          <div className="ed-comment-send">
            <input
              type="email"
              required
              value={replyEmail}
              onChange={(e) => onReplyEmailChange(e.target.value)}
              placeholder="your-subscriber@email.com"
              aria-label="Your subscriber email"
              className="ed-comment-input"
            />
            <button
              type="submit"
              disabled={replySubmitting || replyReaction === null}
              className="btn-editorial btn-editorial--primary"
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

        {replyReaction === null && (
          <p className="ed-comment-label">Pick a reaction</p>
        )}

        {replyStatus === "success" && (
          <p className="ed-comment-status ed-comment-status--ok">{replyMessage}</p>
        )}
        {replyStatus === "error" && (
          <p className="ed-comment-status ed-comment-status--err">{replyMessage}</p>
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
    <div className="ed-comment-thread">
      {comments.map((c) => (
        <div key={c.id}>
          <CommentCard c={c} />

          {/* Reply button */}
          <div className="ed-comment-actions">
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
              className="ed-comment-link"
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
            <div className="ed-comment-thread">
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
