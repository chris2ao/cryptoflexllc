"use client";

import type {
  VercelFirewallConfig,
  VercelAttackStatus,
  VercelFirewallEvents,
} from "@/lib/analytics-types";

/** Human-readable labels for OWASP / CRS rule categories */
const CRS_LABELS: Record<string, string> = {
  sd: "Scanner Detection",
  ma: "Multipart Attack",
  lfi: "Local File Inclusion",
  rfi: "Remote File Inclusion",
  rce: "Remote Code Execution",
  php: "PHP Attack",
  gen: "Generic Attack",
  xss: "XSS Attack",
  sqli: "SQL Injection",
  sf: "Session Fixation",
  java: "Java Attack",
};

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    deny: "bg-red-500/20 text-red-400",
    challenge: "bg-yellow-500/20 text-yellow-400",
    log: "bg-blue-500/20 text-blue-400",
    bypass: "bg-green-500/20 text-green-400",
    rate_limit: "bg-orange-500/20 text-orange-400",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
        colors[action] || "bg-muted text-muted-foreground"
      }`}
    >
      {action}
    </span>
  );
}

export function VercelFirewallCard({
  config,
  attackStatus,
  events,
}: {
  config: VercelFirewallConfig | null;
  attackStatus: VercelAttackStatus | null;
  events: VercelFirewallEvents | null;
}) {
  const hasAnomalies =
    attackStatus && attackStatus.anomalies && attackStatus.anomalies.length > 0;

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Vercel Firewall</h2>
        {config && (
          <span
            className={`inline-block px-2.5 py-1 text-xs rounded-full font-medium ${
              config.firewallEnabled
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {config.firewallEnabled ? "Enabled" : "Disabled"}
          </span>
        )}
      </div>

      {/* Attack Status */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Attack Status
        </h3>
        {hasAnomalies ? (
          <div className="space-y-2">
            {attackStatus.anomalies.map((anomaly, i) => (
              <div
                key={i}
                className="rounded-md border border-red-500/30 bg-red-500/10 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-sm font-medium text-red-400">
                    {anomaly.state === "active"
                      ? "Active Attack Detected"
                      : `Attack (${anomaly.state})`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(anomaly.startTime).toLocaleString()} &mdash;{" "}
                  {anomaly.endTime
                    ? new Date(anomaly.endTime).toLocaleString()
                    : "Ongoing"}
                </p>
                {anomaly.affectedHostMap &&
                  Object.entries(anomaly.affectedHostMap).map(
                    ([host, data]) => (
                      <div key={host} className="mt-2 text-xs">
                        <span className="font-mono text-muted-foreground">
                          {host}
                        </span>
                        {data.anomalyAlerts?.map((alert, j) => (
                          <span key={j} className="ml-2 text-muted-foreground">
                            z-score: {alert.zscore?.toFixed(2)} | requests:{" "}
                            {alert.requestCount?.toLocaleString()}
                          </span>
                        ))}
                        {data.ddosAlerts?.map((alert, j) => (
                          <span key={j} className="ml-2 text-red-400">
                            DDoS: {alert.totalRequests?.toLocaleString()}{" "}
                            requests
                          </span>
                        ))}
                      </div>
                    )
                  )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-green-400">No active attacks detected</p>
        )}
      </div>

      {/* Managed Rulesets (OWASP CRS) */}
      {config?.crs && Object.keys(config.crs).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Managed Rulesets (OWASP)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(config.crs).map(([key, rule]) => (
              <div
                key={key}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-xs ${
                  rule.active
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <span className="truncate mr-2">
                  {CRS_LABELS[key] || key}
                </span>
                {rule.active ? (
                  <ActionBadge action={rule.action} />
                ) : (
                  <span className="text-muted-foreground">off</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom WAF Rules */}
      {config?.rules && config.rules.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Custom Rules ({config.rules.length})
          </h3>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                {config.rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2 font-mono text-xs">
                      {rule.name || rule.id}
                    </td>
                    <td className="px-3 py-2">
                      <ActionBadge action={rule.action.type} />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          rule.active ? "bg-green-500" : "bg-muted-foreground"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IP Rules */}
      {config?.ips && config.ips.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            IP Rules ({config.ips.length})
          </h3>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {config.ips.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2 font-mono text-xs">{rule.ip}</td>
                    <td className="px-3 py-2">
                      <ActionBadge action={rule.action} />
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {rule.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Firewall Events */}
      {events && events.actions && events.actions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Recent Firewall Events ({events.actions.length})
          </h3>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Host</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium">Count</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.actions.map((evt, i) => (
                  <tr
                    key={i}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(evt.startTime).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <ActionBadge action={evt.action_type} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {evt.host || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {evt.public_ip || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {evt.count?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          evt.isActive ? "bg-red-500 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state when no firewall events */}
      {(!events || !events.actions || events.actions.length === 0) && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Recent Firewall Events
          </h3>
          <p className="text-sm text-muted-foreground">
            No firewall events recorded in the selected period
          </p>
        </div>
      )}
    </div>
  );
}
