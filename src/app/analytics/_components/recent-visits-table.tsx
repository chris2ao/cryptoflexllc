"use client";

import { IpOsintPanel, useIpOsintPanel } from "./ip-osint-panel";
import type { RecentVisit } from "@/lib/analytics-types";

interface RecentVisitsTableProps {
  data: RecentVisit[];
}

export function RecentVisitsTable({ data }: RecentVisitsTableProps) {
  const osint = useIpOsintPanel();

  const handleIpClick = (ip: string) => {
    osint.lookup(ip);
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Visits</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Page</th>
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Browser</th>
                <th className="px-4 py-3 font-medium">OS</th>
                <th className="px-4 py-3 font-medium">Device</th>
                <th className="px-4 py-3 font-medium">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No visits recorded yet. Check back after your site gets some traffic!
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(row.visited_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {row.page_path}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => handleIpClick(row.ip_address)}
                        className="text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors cursor-pointer"
                      >
                        {row.ip_address}
                      </button>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {[row.city, row.region, row.country]
                        .filter((v) => v && v !== "Unknown")
                        .join(", ") || "Unknown"}
                    </td>
                    <td className="px-4 py-2">{row.browser}</td>
                    <td className="px-4 py-2">{row.os}</td>
                    <td className="px-4 py-2">{row.device_type}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground max-w-[200px] truncate">
                      {row.referrer}
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
