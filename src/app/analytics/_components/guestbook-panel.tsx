"use client";

import { useState } from "react";
import { Trash2, Loader2, CheckCircle } from "lucide-react";
import { IpLink } from "./ip-link";
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
      <div className="ax-panel-toolbar">
        <div style={{ display: "flex", gap: 8 }}>
          {pendingCount > 0 && (
            <span className="ax-pill ax-pill--warn">{pendingCount} pending</span>
          )}
          <span className={`ax-pill${entries.length > 0 ? " ax-pill--ok" : ""}`}>
            {entries.length} total
          </span>
        </div>
      </div>

      <div className="ax-panel-toolbar">
        <label className="ax-sr" htmlFor="guestbook-search">
          Search guestbook
        </label>
        <input
          id="guestbook-search"
          type="text"
          placeholder="Search by name or message..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ax-input"
        />
      </div>

      <div className="ax-tbl-scroll">
        <table className="ax-tbl ax-tbl-static">
          <thead>
            <tr>
              <th>Status</th>
              <th>Name</th>
              <th>IP</th>
              <th>Message</th>
              <th>Date</th>
              <th>
                <span className="ax-sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="muted">
                  {search ? "No entries match your search." : "No guestbook entries yet."}
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className={!e.approved ? "pending-row" : undefined}>
                  <td>
                    {e.approved ? (
                      <span className="ax-pill ax-pill--ok">Live</span>
                    ) : (
                      <span className="ax-pill ax-pill--warn">Pending</span>
                    )}
                  </td>
                  <td className="trunc" title={e.name}>
                    <b>{e.name}</b>
                  </td>
                  <td>
                    <IpLink ip={e.ip ?? ""} />
                  </td>
                  <td className="trunc" title={e.message}>
                    {e.message}
                  </td>
                  <td className="muted" style={{ whiteSpace: "nowrap" }}>
                    {new Date(e.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="row-actions">
                      {!e.approved && (
                        <button
                          type="button"
                          onClick={() => handleApprove(e)}
                          disabled={actionId === e.id}
                          className="btn-editorial btn-editorial--sm ax-icon-btn"
                          title="Approve entry"
                          aria-label="Approve entry"
                        >
                          {actionId === e.id ? (
                            <Loader2 size={14} className="ax-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(e)}
                        disabled={actionId === e.id}
                        className="btn-editorial btn-editorial--sm btn-editorial--danger ax-icon-btn"
                        title="Delete entry"
                        aria-label="Delete entry"
                      >
                        {actionId === e.id ? (
                          <Loader2 size={14} className="ax-spin" />
                        ) : (
                          <Trash2 size={14} />
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
