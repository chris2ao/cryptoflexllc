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
      // Network error — silently fail
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Subscribers</h2>
          <span
            className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
              activeCount > 0
                ? "bg-green-500/20 text-green-400"
                : "bg-zinc-500/20 text-zinc-400"
            }`}
          >
            {activeCount} active
          </span>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <span className="block text-2xl font-bold">
              {totalCount.toLocaleString()}
            </span>
            <span className="block text-xs text-muted-foreground">Total</span>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <span className="block text-2xl font-bold text-green-400">
              {activeCount.toLocaleString()}
            </span>
            <span className="block text-xs text-muted-foreground">Active</span>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <span className="block text-2xl font-bold text-zinc-500">
              {inactiveCount.toLocaleString()}
            </span>
            <span className="block text-xs text-muted-foreground">
              Unsubscribed
            </span>
          </div>
        </div>

        {/* Subscriber Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Subscribed</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2 font-mono text-xs">
                      {sub.email}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                          sub.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-zinc-500/20 text-zinc-400"
                        }`}
                      >
                        {sub.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(sub.subscribed_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {sub.ip_address ? (
                        <button
                          type="button"
                          onClick={() => osint.lookup(sub.ip_address)}
                          className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors cursor-pointer"
                        >
                          {sub.ip_address}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {[sub.city, sub.region, sub.country]
                        .filter((v) => v && v !== "Unknown")
                        .join(", ") || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemove(sub)}
                        disabled={deletingId === sub.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        title="Remove subscriber"
                      >
                        {deletingId === sub.id ? (
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
