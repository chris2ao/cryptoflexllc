"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { IpOsintPanel, useIpOsintPanel } from "./ip-osint-panel";
import type { SubscriberRow } from "@/lib/analytics-types";

interface SubscriberPanelProps {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  subscribers: SubscriberRow[];
}

export function SubscriberPanel({
  totalCount,
  activeCount,
  inactiveCount,
  subscribers: initialSubscribers,
}: SubscriberPanelProps) {
  const osint = useIpOsintPanel();
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleRemove(sub: SubscriberRow) {
    if (!confirm(`Remove subscriber ${sub.email}? This cannot be undone.`)) return;

    setDeletingId(sub.id);
    try {
      const res = await fetch(`/api/subscribers/${sub.id}`, { method: "DELETE" });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== sub.id));
      }
    } catch {
      // Network error: the row stays, so the failure is visible
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div>
        <div className="ax-panel-toolbar">
          <span className={`ax-pill${activeCount > 0 ? " ax-pill--ok" : ""}`}>
            {activeCount} active
          </span>
        </div>

        <div className="ax-stat-row">
          <div className="ax-stat">
            <span className="v">{totalCount.toLocaleString()}</span>
            <span className="l">Total</span>
          </div>
          <div className="ax-stat">
            <span className="v" style={{ color: "var(--ax-green)" }}>
              {activeCount.toLocaleString()}
            </span>
            <span className="l">Active</span>
          </div>
          <div className="ax-stat">
            <span className="v" style={{ color: "var(--fg-3)" }}>
              {inactiveCount.toLocaleString()}
            </span>
            <span className="l">Unsubscribed</span>
          </div>
        </div>

        <div className="ax-tbl-scroll">
          <table className="ax-tbl ax-tbl-static">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed</th>
                <th>IP</th>
                <th>Location</th>
                <th>
                  <span className="ax-sr">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="muted">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.email}</td>
                    <td>
                      <span className={`ax-pill${sub.active ? " ax-pill--ok" : ""}`}>
                        {sub.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                    <td>
                      {sub.ip_address ? (
                        <button
                          type="button"
                          onClick={() => osint.lookup(sub.ip_address)}
                          className="ax-link"
                        >
                          {sub.ip_address}
                        </button>
                      ) : (
                        <span className="muted">N/A</span>
                      )}
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {[sub.city, sub.region, sub.country]
                        .filter((v) => v && v !== "Unknown")
                        .join(", ") || "Unknown"}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemove(sub)}
                        disabled={deletingId === sub.id}
                        className="btn-editorial btn-editorial--sm ax-icon-btn"
                        title="Remove subscriber"
                        aria-label="Remove subscriber"
                      >
                        {deletingId === sub.id ? (
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

      <IpOsintPanel
        open={osint.open}
        onOpenChange={osint.setOpen}
        ip={osint.ip}
        data={osint.data}
        loading={osint.loading}
        error={osint.error}
      />
    </>
  );
}
