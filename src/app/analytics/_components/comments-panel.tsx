"use client";

import { useState } from "react";
import { Trash2, Loader2, ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import type { CommentRow } from "@/lib/analytics-types";
import { BASE_URL } from "@/lib/constants";

interface CommentsPanelProps {
  comments: CommentRow[];
}

export function CommentsPanel({ comments: initialComments }: CommentsPanelProps) {
  const [comments, setComments] = useState(initialComments);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search
    ? comments.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.slug.toLowerCase().includes(q) ||
          c.comment.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      })
    : comments;

  async function handleDelete(comment: CommentRow) {
    if (!confirm(`Delete comment by ${comment.email} on "${comment.slug}"? This cannot be undone.`)) return;

    setDeletingId(comment.id);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== comment.id));
      }
    } catch {
      // Network error
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="ax-panel-toolbar">
        <span className={`ax-pill${comments.length > 0 ? " ax-pill--ok" : ""}`}>
          {comments.length} total
        </span>
      </div>

      <div className="ax-panel-toolbar">
        <label className="ax-sr" htmlFor="comments-search">
          Search comments
        </label>
        <input
          id="comments-search"
          type="text"
          placeholder="Search by post, comment text, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ax-input"
        />
      </div>

      <div className="ax-tbl-scroll">
        <table className="ax-tbl ax-tbl-static">
          <thead>
            <tr>
              <th>Post</th>
              <th>Comment</th>
              <th>Type</th>
              <th>Reaction</th>
              <th>Email</th>
              <th>Date</th>
              <th>
                <span className="ax-sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="muted">
                  {search ? "No comments match your search." : "No comments yet."}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td className="trunc" title={c.slug}>
                    {c.slug}
                  </td>
                  <td className="trunc" title={c.comment}>
                    <a
                      href={`${BASE_URL}/blog/${c.slug}#comment-${c.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ax-link"
                    >
                      {c.comment}
                    </a>
                  </td>
                  <td>
                    {c.parent_id != null ? (
                      <span className="ax-pill">
                        <Reply size={12} style={{ display: "inline" }} aria-hidden="true" /> #{c.parent_id}
                      </span>
                    ) : (
                      <span className="muted">Top</span>
                    )}
                  </td>
                  <td>
                    {c.reaction === "up" ? (
                      <ThumbsUp size={16} style={{ color: "var(--ax-green)" }} aria-label="Thumbs up" />
                    ) : (
                      <ThumbsDown size={16} style={{ color: "var(--ax-red)" }} aria-label="Thumbs down" />
                    )}
                  </td>
                  <td>{c.email}</td>
                  <td className="muted" style={{ whiteSpace: "nowrap" }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      className="btn-editorial btn-editorial--sm btn-editorial--danger ax-icon-btn"
                      title="Delete comment"
                      aria-label="Delete comment"
                    >
                      {deletingId === c.id ? (
                        <Loader2 size={14} className="ax-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
