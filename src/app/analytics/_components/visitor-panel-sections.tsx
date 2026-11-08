import Link from "next/link";
import type { VisitorDossier } from "@/lib/analytics-queries/visitor";
import type { IpEnrichment } from "@/lib/ip-enrichment/types";

export function fmtSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function fmtTime(iso: string | null): string {
  if (!iso) return "never";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "unknown"
    : d.toISOString().slice(0, 16).replace("T", " ") + "Z";
}

function dominantClass(classes: Record<string, number>): string | null {
  let best: string | null = null;
  for (const [k, n] of Object.entries(classes)) {
    if (best === null || n > classes[best]) best = k;
  }
  return best;
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="ax-visitor-section">
      <h3 className="ax-subhead">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="ax-visitor-row">
      <span className="ax-muted">{label}</span>
      <span>{value === "" || value == null ? "none" : value}</span>
    </div>
  );
}

export function IdentitySection({
  dossier,
  enrichment,
}: {
  dossier: VisitorDossier | null;
  enrichment: IpEnrichment | null;
}) {
  const cls = dossier ? dominantClass(dossier.classes) : null;
  const flags: Array<[string, boolean | null]> = enrichment
    ? [
        ["datacenter", enrichment.isDatacenter],
        ["Tor", enrichment.isTor],
        ["VPN", enrichment.isVpn],
        ["proxy", enrichment.isProxy],
        ["abuser", enrichment.isAbuser],
        ["DROP list", enrichment.onDrop],
      ]
    : [];
  const on = flags.filter(([, v]) => v === true);
  const unknown = flags.filter(([, v]) => v === null);
  return (
    <Section title="Identity">
      <div className="ax-chip-row">
        {cls ? <span className="chip on">{cls}</span> : null}
        {on.map(([name]) => (
          <span key={name} className="chip on">
            {name}
          </span>
        ))}
        {!cls && on.length === 0 ? (
          <span className="ax-muted">No flags set</span>
        ) : null}
      </div>
      {unknown.length > 0 ? (
        <div className="ax-chip-row ax-chip-row--dim">
          <span className="ax-muted">
            unknown: {unknown.map(([n]) => n).join(", ")}
          </span>
        </div>
      ) : null}
    </Section>
  );
}

export function NetworkSection({ e }: { e: IpEnrichment }) {
  return (
    <Section title="Network">
      <Row label="ASN" value={e.asn} />
      <Row label="AS name" value={e.asName} />
      <Row label="Company" value={e.company} />
      <Row label="WHOIS org" value={e.whoisOrg} />
    </Section>
  );
}

export function LocationSection({ e }: { e: IpEnrichment }) {
  return (
    <Section title="Location">
      <Row label="City" value={e.city} />
      <Row label="Region" value={e.region} />
      <Row label="Country" value={e.country} />
    </Section>
  );
}

function isInternal(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

export function HistorySection({ d }: { d: VisitorDossier }) {
  return (
    <Section title="History">
      <Row label="First seen" value={fmtTime(d.firstSeen)} />
      <Row label="Last seen" value={fmtTime(d.lastSeen)} />
      <Row label="Hits" value={d.hits.toLocaleString()} />
      {d.locations.length > 0 ? (
        <Row label="Seen from" value={d.locations.join("; ")} />
      ) : null}
      {d.pages.length > 0 ? (
        <ul className="ax-visitor-list">
          {d.pages.map((p) => (
            <li key={p.page_path}>
              {isInternal(p.page_path) ? (
                <Link href={p.page_path}>{p.page_path}</Link>
              ) : (
                <span>{p.page_path}</span>
              )}{" "}
              <span className="ax-muted">{p.views}x</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ax-empty">No page views recorded</p>
      )}
      {d.userAgents.length > 0 ? (
        <ul className="ax-visitor-list ax-muted">
          {d.userAgents.map((ua) => (
            <li key={ua}>{ua}</li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}

export function EngagementSection({ d }: { d: VisitorDossier }) {
  return (
    <Section title="Engagement">
      <Row label="Scrolls" value={d.engagement.scrolls} />
      <Row label="Max depth" value={`${d.engagement.maxDepth}%`} />
      <Row label="Time on page" value={fmtSeconds(d.engagement.seconds)} />
    </Section>
  );
}

export function SignalsSection({ d }: { d: VisitorDossier }) {
  return (
    <Section title="Signals">
      <Row label="Client errors" value={d.errors} />
      <Row label="Auth success" value={d.auth.success} />
      <Row label="Auth fail" value={d.auth.fail} />
      <Row label="Subscriber" value={d.subscriber ? "yes" : "no"} />
      <Row label="Guestbook entries" value={d.guestbook} />
    </Section>
  );
}
