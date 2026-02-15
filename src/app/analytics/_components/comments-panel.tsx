"use client";

import { useState } from "react";
import { Trash2, Loader2, ThumbsUp, ThumbsDown, Search } from "lucide-react";
import type { CommentRow } from "@/lib/analytics-types";

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Comments</h2>
        <span
          className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
            comments.length > 0
              ? "bg-blue-500/20 text-blue-400"
              : "bg-zinc-500/20 text-zinc-400"
          }`}
        >
          {comments.length} total
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by post, comment text, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-muted/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Post</th>
              <th className="px-4 py-3 font-medium">Comment</th>
              <th className="px-4 py-3 font-medium">Reaction</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {search ? "No comments match your search." : "No comments yet."}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-2 font-mono text-xs max-w-[160px] truncate" title={c.slug}>
                    {c.slug}
                  </td>
                  <td className="px-4 py-2 max-w-[280px] truncate" title={c.comment}>
                    {c.comment}
                  </td>
                  <td className="px-4 py-2">
                    {c.reaction === "up" ? (
                      <ThumbsUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-red-400" />
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono text-xs">
                    {c.email}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(c)}
                      disabled={deletingId === c.id}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      title="Delete comment"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
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
