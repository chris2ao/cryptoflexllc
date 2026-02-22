"use client";

import { useState } from "react";
import { Trash2, Loader2, Search, CheckCircle, Clock } from "lucide-react";
import type { GuestbookRow } from "@/lib/analytics-types";

interface GuestbookPanelProps {
  entries: GuestbookRow[];
}

export function GuestbookPanel({ entries: initialEntries }: GuestbookPanelProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [actionId, setActionId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const pendingCount = entries.filter((e) => !e.approved).length;

  const filtered = search
    ? entries.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.name.toLowerCase().includes(q) ||
          e.message.toLowerCase().includes(q)
        );
      })
    : entries;

  async function handleApprove(entry: GuestbookRow) {
    setActionId(entry.id);
    try {
      const res = await fetch(`/api/guestbook/${entry.id}`, { method: "PATCH" });
      if (res.ok) {
        setEntries((prev) =>
          prev.map((e) => (e.id === entry.id ? { ...e, approved: true } : e))
        );
      }
    } catch {
      // Network error
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(entry: GuestbookRow) {
    if (!confirm(`Delete guestbook entry by "${entry.name}"? This cannot be undone.`)) return;

    setActionId(entry.id);
    try {
      const res = await fetch(`/api/guestbook/${entry.id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      }
    } catch {
      // Network error
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Guestbook</h2>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <span className="inline-block px-2.5 py-1 text-xs rounded-full font-medium bg-yellow-500/20 text-yellow-400">
              {pendingCount} pending
            </span>
          )}
          <span
            className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
              entries.length > 0
                ? "bg-blue-500/20 text-blue-400"
                : "bg-zinc-500/20 text-zinc-400"
            }`}
          >
            {entries.length} total
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or message..."
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
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Message</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium w-28"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {search ? "No entries match your search." : "No guestbook entries yet."}
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr
                  key={e.id}
                  className={`border-t border-border hover:bg-muted/30 transition-colors ${
                    !e.approved ? "bg-yellow-500/5" : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    {e.approved ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                        <Clock className="h-3.5 w-3.5" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium max-w-[120px] truncate" title={e.name}>
                    {e.name}
                  </td>
                  <td className="px-4 py-2 max-w-[320px] truncate" title={e.message}>
                    {e.message}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {!e.approved && (
                        <button
                          type="button"
                          onClick={() => handleApprove(e)}
                          disabled={actionId === e.id}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                          title="Approve entry"
                        >
                          {actionId === e.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(e)}
                        disabled={actionId === e.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Delete entry"
                      >
                        {actionId === e.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
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
