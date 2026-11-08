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

const ACTION_TONE: Record<string, string> = {
  deny: "ax-pill--bad",
  challenge: "ax-pill--warn",
  log: "",
  bypass: "ax-pill--ok",
  rate_limit: "ax-pill--warn",
};

function ActionBadge({ action }: { action: string }) {
  const tone = ACTION_TONE[action] ?? "";
  return <span className={`ax-pill ${tone}`.trim()}>{action}</span>;
}

function StatusDot({ on, tone }: { on: boolean; tone: "ok" | "bad" }) {
  const color = !on ? "var(--fg-4)" : tone === "ok" ? "var(--ax-green)" : "var(--ax-red)";
  return (
    <span
      role="img"
      aria-label={on ? "active" : "inactive"}
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
      }}
    />
  );
}

const UNAVAILABLE = <p className="ax-empty">Unavailable from the Vercel API</p>;

export function VercelFirewallCard({
  config,
  attackStatus,
  events,
}: {
  config: VercelFirewallConfig | null;
  attackStatus: VercelAttackStatus | null;
  events: VercelFirewallEvents | null;
}) {
  const anomalies = attackStatus?.anomalies ?? [];
  const hasAnomalies = anomalies.length > 0;
  const eventActions = events?.actions ?? [];

  return (
    <div>
      <div className="ax-panel-toolbar">
        <p className="ax-subhead" style={{ margin: 0 }}>Vercel Firewall</p>
        {config && (
          <span className={`ax-pill ${config.firewallEnabled ? "ax-pill--ok" : "ax-pill--bad"}`}>
            {config.firewallEnabled ? "Enabled" : "Disabled"}
          </span>
        )}
      </div>

      {!config && <div className="ax-block">{UNAVAILABLE}</div>}

      <div className="ax-block">
        <h3 className="ax-subhead">Attack status</h3>
        {attackStatus === null ? (
          UNAVAILABLE
        ) : hasAnomalies ? (
          <div style={{ display: "grid", gap: 8 }}>
            {anomalies.map((anomaly, i) => (
              <div key={i} className="ax-notice ax-notice--bad">
                <div style={{ marginBottom: 4 }}>
                  <b>
                    {anomaly.state === "active"
                      ? "Active attack detected"
                      : `Attack (${anomaly.state})`}
                  </b>
                </div>
                <div className="muted">
                  {new Date(anomaly.startTime).toLocaleString()} to{" "}
                  {anomaly.endTime ? new Date(anomaly.endTime).toLocaleString() : "ongoing"}
                </div>
                {anomaly.affectedHostMap &&
                  Object.entries(anomaly.affectedHostMap).map(([host, data]) => (
                    <div key={host} style={{ marginTop: 8 }}>
                      <span>{host}</span>
                      {data.anomalyAlerts?.map((alert, j) => (
                        <span key={j} style={{ marginLeft: 8 }}>
                          z-score: {alert.zscore?.toFixed(2)} | requests:{" "}
                          {alert.requestCount?.toLocaleString()}
                        </span>
                      ))}
                      {data.ddosAlerts?.map((alert, j) => (
                        <span key={j} style={{ marginLeft: 8 }}>
                          DDoS: {alert.totalRequests?.toLocaleString()} requests
                        </span>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ) : (
          <p className="ax-empty" style={{ color: "var(--ax-green)" }}>
            No active attacks detected
          </p>
        )}
      </div>

      {config?.crs && Object.keys(config.crs).length > 0 && (
        <div className="ax-block">
          <h3 className="ax-subhead">Managed rulesets (OWASP)</h3>
          <div className="ax-tbl-scroll">
            <table className="ax-tbl ax-tbl-static">
              <thead>
                <tr>
                  <th>Ruleset</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(config.crs).map(([key, rule]) => (
                  <tr key={key}>
                    <td>{CRS_LABELS[key] || key}</td>
                    <td>
                      {rule.active ? (
                        <ActionBadge action={rule.action} />
                      ) : (
                        <span className="ax-pill">off</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {config?.rules && config.rules.length > 0 && (
        <div className="ax-block">
          <h3 className="ax-subhead">Custom rules ({config.rules.length})</h3>
          <div className="ax-tbl-scroll">
            <table className="ax-tbl ax-tbl-static">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {config.rules.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.name || rule.id}</td>
                    <td>
                      <ActionBadge action={rule.action.type} />
                    </td>
                    <td>
                      <StatusDot on={rule.active} tone="ok" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {config?.ips && config.ips.length > 0 && (
        <div className="ax-block">
          <h3 className="ax-subhead">IP rules ({config.ips.length})</h3>
          <div className="ax-tbl-scroll">
            <table className="ax-tbl ax-tbl-static">
              <thead>
                <tr>
                  <th>IP</th>
                  <th>Action</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {config.ips.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.ip}</td>
                    <td>
                      <ActionBadge action={rule.action} />
                    </td>
                    <td className="muted">{rule.notes || "n/a"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="ax-block">
        <h3 className="ax-subhead">
          Recent firewall events{eventActions.length > 0 ? ` (${eventActions.length})` : ""}
        </h3>
        {events === null ? (
          UNAVAILABLE
        ) : eventActions.length === 0 ? (
          <p className="ax-empty">No firewall events recorded in the selected period</p>
        ) : (
          <div className="ax-tbl-scroll">
            <table className="ax-tbl ax-tbl-static">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Host</th>
                  <th>IP</th>
                  <th className="num">Count</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {eventActions.map((evt, i) => (
                  <tr key={i}>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {new Date(evt.startTime).toLocaleString()}
                    </td>
                    <td>
                      <ActionBadge action={evt.action_type} />
                    </td>
                    <td>{evt.host || "n/a"}</td>
                    <td>{evt.public_ip || "n/a"}</td>
                    <td className="num">{evt.count?.toLocaleString()}</td>
                    <td>
                      <StatusDot on={Boolean(evt.isActive)} tone="bad" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
