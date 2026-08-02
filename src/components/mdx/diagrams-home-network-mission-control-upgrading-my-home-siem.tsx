/** Diagrams for "Upgrading My Home SIEM": feed suffix-match tiers + watchdog cold-start path */

import { DiagramLightbox } from "./diagram-lightbox";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return <DiagramLightbox caption={caption}>{children}</DiagramLightbox>;
}

/**
 * Three-tier threat-feed hostname matching, built around the real
 * Hagezi Pro entry `officeapps.live.com` (collapsed wildcard format).
 * Shows what matches (exact, suffix, registrable) and, just as
 * important, what does not: a sibling under the same eTLD+1, the
 * eTLD+1 itself, and a lookalike hostname that cannot inherit the
 * match because matching is cut on dot boundaries only, never
 * substring.
 */
export function FeedSuffixMatchTiersDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "match_feeds tiers against the Hagezi Pro entry officeapps.live.com: exact and suffix matches in green, non-matches in red. A match still requires the feed to have explicitly listed that branch of the tree."
      }
    >
      <svg
        viewBox="0 0 980 920"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="fstArrowMatch"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
          <marker
            id="fstArrowNoMatch"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <circle cx="5" cy="5" r="4" className="fill-red-500/85" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="490"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Threat Feed Matching: Three Tiers, One Boundary Rule
        </text>
        <text
          x="490"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Feed entry: officeapps.live.com (Hagezi Pro, collapsed wildcard format)
        </text>

        {/* Tier legend cards */}
        <rect x="30" y="64" width="300" height="86" rx="8" className="fill-emerald-500/8 stroke-emerald-500/60" strokeWidth="1" />
        <text x="180" y="86" textAnchor="middle" className="fill-success text-[11px] font-semibold">TIER 1: EXACT</text>
        <text x="180" y="106" textAnchor="middle" className="fill-foreground text-[9.5px]">Entry names the hostname</text>
        <text x="180" y="120" textAnchor="middle" className="fill-foreground text-[9.5px]">itself.</text>
        <text x="180" y="140" textAnchor="middle" className="fill-muted-foreground text-[9px]">example.com lists example.com</text>

        <rect x="340" y="64" width="300" height="86" rx="8" className="fill-emerald-500/8 stroke-emerald-500/60" strokeWidth="1" />
        <text x="490" y="86" textAnchor="middle" className="fill-success text-[11px] font-semibold">
          TIER 2: SUFFIX <tspan className="fill-amber-500">(NEW)</tspan>
        </text>
        <text x="490" y="106" textAnchor="middle" className="fill-foreground text-[9.5px]">Entry names a parent between</text>
        <text x="490" y="120" textAnchor="middle" className="fill-foreground text-[9.5px]">the hostname and its eTLD+1.</text>
        <text x="490" y="140" textAnchor="middle" className="fill-muted-foreground text-[9px]">Cut on dot boundaries only.</text>

        <rect x="650" y="64" width="300" height="86" rx="8" className="fill-emerald-500/8 stroke-emerald-500/60" strokeWidth="1" />
        <text x="800" y="86" textAnchor="middle" className="fill-success text-[11px] font-semibold">TIER 3: REGISTRABLE</text>
        <text x="800" y="106" textAnchor="middle" className="fill-foreground text-[9.5px]">Entry listed at the eTLD+1</text>
        <text x="800" y="120" textAnchor="middle" className="fill-foreground text-[9.5px]">itself matches every subdomain.</text>
        <text x="800" y="140" textAnchor="middle" className="fill-muted-foreground text-[9px]">evil.example covers www.evil.example</text>

        {/* eTLD+1 boundary */}
        <rect x="20" y="170" width="940" height="560" rx="12" className="fill-muted/15 stroke-muted-foreground/30" strokeWidth="1" strokeDasharray="4 4" />
        <text x="40" y="192" className="fill-muted-foreground text-[10px] font-semibold">
          live.com (eTLD+1 boundary; everything below shares this registrable domain)
        </text>

        {/* Feed entry node */}
        <rect x="340" y="210" width="300" height="76" rx="10" className="fill-primary/12 stroke-primary" strokeWidth="1.5" />
        <text x="490" y="234" textAnchor="middle" className="fill-primary text-[12px] font-semibold">officeapps.live.com</text>
        <text x="490" y="254" textAnchor="middle" className="fill-foreground text-[10px]">LISTED: Hagezi Pro entry</text>
        <text x="490" y="272" textAnchor="middle" className="fill-muted-foreground text-[9px]">(collapsed wildcard format)</text>

        {/* Arrows to suffix matches */}
        <line x1="440" y1="286" x2="260" y2="330" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#fstArrowMatch)" />
        <line x1="540" y1="286" x2="720" y2="330" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#fstArrowMatch)" />

        {/* Suffix match children */}
        <rect x="50" y="330" width="400" height="90" rx="10" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="250" y="354" textAnchor="middle" className="fill-foreground text-[9.5px] font-medium">
          euc-powerpoint-telemetry.officeapps.live.com
        </text>
        <text x="250" y="376" textAnchor="middle" className="fill-success text-[11px] font-semibold">MATCH: suffix tier</text>
        <text x="250" y="394" textAnchor="middle" className="fill-muted-foreground text-[9px]">parent explicitly listed</text>
        <text x="250" y="410" textAnchor="middle" className="fill-success/90 text-[11px]">check</text>

        <rect x="530" y="330" width="400" height="90" rx="10" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="730" y="354" textAnchor="middle" className="fill-foreground text-[9.5px] font-medium">
          deep.nested.officeapps.live.com
        </text>
        <text x="730" y="376" textAnchor="middle" className="fill-success text-[11px] font-semibold">MATCH: suffix tier</text>
        <text x="730" y="394" textAnchor="middle" className="fill-muted-foreground text-[9px]">any depth beneath a listed parent</text>
        <text x="730" y="410" textAnchor="middle" className="fill-success/90 text-[11px]">check</text>

        {/* No-match row */}
        <rect x="50" y="460" width="280" height="100" rx="10" className="fill-red-500/12 stroke-red-500" strokeWidth="1.5" />
        <text x="190" y="484" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">chat.live.com</text>
        <text x="190" y="504" textAnchor="middle" className="fill-destructive text-[10.5px] font-semibold">NO MATCH: sibling</text>
        <text x="190" y="522" textAnchor="middle" className="fill-muted-foreground text-[9px]">not under officeapps.live.com</text>
        <text x="190" y="538" textAnchor="middle" className="fill-muted-foreground text-[9px]">live.com itself was never listed</text>

        <rect x="350" y="460" width="280" height="100" rx="10" className="fill-red-500/12 stroke-red-500" strokeWidth="1.5" />
        <text x="490" y="484" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">live.com</text>
        <text x="490" y="504" textAnchor="middle" className="fill-destructive text-[10.5px] font-semibold">NO MATCH: the eTLD+1 itself</text>
        <text x="490" y="522" textAnchor="middle" className="fill-muted-foreground text-[9px]">the bare registrable domain</text>
        <text x="490" y="538" textAnchor="middle" className="fill-muted-foreground text-[9px]">was never listed as an entry</text>

        <rect x="650" y="460" width="280" height="100" rx="10" className="fill-red-500/12 stroke-red-500" strokeWidth="1.5" />
        <text x="790" y="484" textAnchor="middle" className="fill-foreground text-[10.5px] font-semibold">evilofficeapps.live.com</text>
        <text x="790" y="504" textAnchor="middle" className="fill-destructive text-[10.5px] font-semibold">NO MATCH: lookalike</text>
        <text x="790" y="522" textAnchor="middle" className="fill-muted-foreground text-[9px]">no dot boundary before officeapps</text>
        <text x="790" y="538" textAnchor="middle" className="fill-muted-foreground text-[9px]">matching is never substring</text>

        {/* Blocked link from feed entry to the lookalike */}
        <line x1="600" y1="286" x2="790" y2="460" className="stroke-red-500/70" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#fstArrowNoMatch)" />
        <text x="710" y="368" textAnchor="middle" className="fill-destructive/90 text-[9px]">cannot inherit</text>

        {/* Tier 3 example, a separate feed entry */}
        <rect x="140" y="600" width="300" height="80" rx="10" className="fill-primary/12 stroke-primary" strokeWidth="1.5" />
        <text x="290" y="626" textAnchor="middle" className="fill-primary text-[11px] font-semibold">evil.example</text>
        <text x="290" y="646" textAnchor="middle" className="fill-foreground text-[9.5px]">entry == eTLD+1 (registrable)</text>
        <text x="290" y="664" textAnchor="middle" className="fill-muted-foreground text-[9px]">malware listed bare</text>

        <line x1="440" y1="640" x2="540" y2="640" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#fstArrowMatch)" />

        <rect x="540" y="600" width="300" height="80" rx="10" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="690" y="626" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">www.evil.example</text>
        <text x="690" y="646" textAnchor="middle" className="fill-success text-[10.5px] font-semibold">MATCH: registrable tier</text>
        <text x="690" y="664" textAnchor="middle" className="fill-muted-foreground text-[9px]">any subdomain inherits</text>

        <text x="490" y="710" textAnchor="middle" className="fill-muted-foreground text-[9px] italic">
          Tier 3, a different example: no suffix relationship to officeapps.live.com is implied.
        </text>

        {/* Footer contrast note */}
        <rect x="60" y="740" width="860" height="72" rx="8" className="fill-amber-500/8 stroke-amber-500/50" strokeWidth="1" />
        <text x="490" y="766" textAnchor="middle" className="fill-warning text-[10.5px] font-semibold">
          This is NOT the eTLD+1 rollup bug from May 2026
        </text>
        <text x="490" y="786" textAnchor="middle" className="fill-muted-foreground text-[9.5px]">
          That bug flagged every sibling under a shared registrable domain. A match here still
        </text>
        <text x="490" y="802" textAnchor="middle" className="fill-muted-foreground text-[9.5px]">
          requires the feed to explicitly list the suffix in question, not just share a root.
        </text>

        <text x="490" y="850" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">
          Suffixes are cut on dots only, so a lookalike like evilofficeapps.live.com can never
          borrow a match across a label boundary.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Watchdog trigger set (WatchPaths, StartInterval, RunAtLoad) plus the
 * cold-start decision path added in commit 2d96662: docker info check,
 * process-name gate on "Docker Desktop" (never "com.docker"), 30-minute
 * cooldown, then the cold-launch -> compose up -> backend kickstart chain.
 */
export function WatchdogColdStartDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "siem_remount_recover.sh: three launchd triggers cover each other's blind spots, then docker info gates a DEFER / OPERATOR-ACTION / COLD-START decision path. The old behavior was a single ABORT line that fired 17 times during the 2026-08-01 outage."
      }
    >
      <svg
        viewBox="0 0 960 950"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="wcsArrowGray" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/70" />
          </marker>
          <marker id="wcsArrowCyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker id="wcsArrowAmber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
          <marker id="wcsArrowRed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-red-500/80" />
          </marker>
          <marker id="wcsArrowGreen" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text x="480" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Watchdog Cold-Start Decision Path
        </text>
        <text x="480" y="46" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          siem_remount_recover.sh: three launchd triggers feed one recovery script
        </text>

        {/* Trigger row */}
        <rect x="30" y="64" width="280" height="90" rx="10" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="170" y="86" textAnchor="middle" className="fill-cyan-300 text-[11px] font-semibold">WatchPaths</text>
        <text x="170" y="104" textAnchor="middle" className="fill-foreground text-[9.5px]">/Volumes/MacExternal</text>
        <text x="170" y="122" textAnchor="middle" className="fill-muted-foreground text-[9px]">Fires on volume mount/unmount churn</text>
        <text x="170" y="138" textAnchor="middle" className="fill-muted-foreground text-[9px]">(the original remount use case)</text>

        <rect x="340" y="64" width="280" height="90" rx="10" className="fill-amber-500/12 stroke-amber-500" strokeWidth="1.5" />
        <text x="480" y="86" textAnchor="middle" className="fill-amber-300 text-[11px] font-semibold">StartInterval: 300s</text>
        <text x="480" y="104" textAnchor="middle" className="fill-foreground text-[9.5px]">Every 5 minutes</text>
        <text x="480" y="122" textAnchor="middle" className="fill-muted-foreground text-[9px]">Covers a fully dead stack, no fs events</text>
        <text x="480" y="138" textAnchor="middle" className="fill-muted-foreground text-[9px]">Silent for 3 hrs on 2026-08-01 without it</text>

        <rect x="650" y="64" width="280" height="90" rx="10" className="fill-violet-500/12 stroke-violet-500" strokeWidth="1.5" />
        <text x="790" y="86" textAnchor="middle" className="fill-violet-300 text-[11px] font-semibold">RunAtLoad</text>
        <text x="790" y="104" textAnchor="middle" className="fill-foreground text-[9.5px]">Fires at login</text>
        <text x="790" y="122" textAnchor="middle" className="fill-muted-foreground text-[9px]">Closes the window between login</text>
        <text x="790" y="138" textAnchor="middle" className="fill-muted-foreground text-[9px]">and the first 5-minute tick</text>

        {/* Converging arrows into the script */}
        <line x1="170" y1="154" x2="470" y2="188" className="stroke-cyan-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />
        <line x1="480" y1="154" x2="480" y2="188" className="stroke-amber-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />
        <line x1="790" y1="154" x2="490" y2="188" className="stroke-violet-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />

        {/* Script invoked */}
        <rect x="330" y="192" width="300" height="42" rx="8" className="fill-muted/25 stroke-muted-foreground/50" strokeWidth="1" />
        <text x="480" y="218" textAnchor="middle" className="fill-foreground text-[10.5px] font-medium">
          siem_remount_recover.sh runs
        </text>

        <line x1="480" y1="234" x2="480" y2="266" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />

        {/* Decision 1 */}
        <rect x="270" y="266" width="420" height="50" rx="8" className="fill-muted/15 stroke-muted-foreground/50" strokeWidth="1" strokeDasharray="4 3" />
        <text x="480" y="296" textAnchor="middle" className="fill-foreground text-[10.5px] font-medium">
          docker info succeeds?
        </text>

        <line x1="690" y1="291" x2="726" y2="291" className="stroke-cyan-500/80" strokeWidth="1.5" markerEnd="url(#wcsArrowCyan)" />
        <text x="700" y="282" textAnchor="middle" className="fill-cyan-400 text-[9px] font-medium">yes</text>

        <rect x="730" y="256" width="200" height="72" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="830" y="278" textAnchor="middle" className="fill-cyan-300 text-[10.5px] font-semibold">Proceed</text>
        <text x="830" y="296" textAnchor="middle" className="fill-foreground text-[9px]">Normal health-check ladder</text>
        <text x="830" y="312" textAnchor="middle" className="fill-muted-foreground text-[9px]">existing escalation logic</text>

        <line x1="480" y1="316" x2="480" y2="346" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />
        <text x="492" y="336" className="fill-muted-foreground text-[9px] font-medium">no</text>

        {/* Decision 2 */}
        <rect x="270" y="346" width="420" height="62" rx="8" className="fill-muted/15 stroke-muted-foreground/50" strokeWidth="1" strokeDasharray="4 3" />
        <text x="480" y="368" textAnchor="middle" className="fill-foreground text-[10.5px] font-medium">
          pgrep -f &quot;Docker Desktop&quot; found?
        </text>
        <text x="480" y="384" textAnchor="middle" className="fill-muted-foreground text-[9px]">
          not &quot;com.docker&quot;: vmnetd helper survives a full quit
        </text>

        <line x1="690" y1="377" x2="726" y2="377" className="stroke-amber-500/80" strokeWidth="1.5" markerEnd="url(#wcsArrowAmber)" />
        <text x="700" y="368" textAnchor="middle" className="fill-amber-400 text-[9px] font-medium">yes</text>

        <rect x="730" y="342" width="200" height="72" rx="8" className="fill-amber-500/12 stroke-amber-500" strokeWidth="1.5" />
        <text x="830" y="364" textAnchor="middle" className="fill-warning text-[10.5px] font-semibold">DEFER</text>
        <text x="830" y="382" textAnchor="middle" className="fill-foreground text-[9px]">Mid-boot; retry next invocation</text>
        <text x="830" y="398" textAnchor="middle" className="fill-muted-foreground text-[9px]">exit 0, no relaunch attempt</text>

        <line x1="480" y1="408" x2="480" y2="438" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />
        <text x="492" y="428" className="fill-muted-foreground text-[9px] font-medium">no</text>

        {/* Decision 3 */}
        <rect x="270" y="438" width="420" height="50" rx="8" className="fill-muted/15 stroke-muted-foreground/50" strokeWidth="1" strokeDasharray="4 3" />
        <text x="480" y="468" textAnchor="middle" className="fill-foreground text-[10.5px] font-medium">
          Within the 30-minute cooldown stamp?
        </text>

        <line x1="690" y1="463" x2="726" y2="463" className="stroke-red-500/80" strokeWidth="1.5" markerEnd="url(#wcsArrowRed)" />
        <text x="700" y="454" textAnchor="middle" className="fill-red-400 text-[9px] font-medium">yes</text>

        <rect x="730" y="428" width="200" height="72" rx="8" className="fill-red-500/12 stroke-red-500" strokeWidth="1.5" />
        <text x="830" y="450" textAnchor="middle" className="fill-destructive text-[10.5px] font-semibold">OPERATOR-ACTION</text>
        <text x="830" y="468" textAnchor="middle" className="fill-foreground text-[9px]">Suppress relaunch</text>
        <text x="830" y="484" textAnchor="middle" className="fill-muted-foreground text-[9px]">a broken install can&apos;t thrash</text>

        <line x1="480" y1="488" x2="480" y2="518" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#wcsArrowGray)" />
        <text x="492" y="508" className="fill-muted-foreground text-[9px] font-medium">no</text>

        {/* COLD-START chain */}
        <rect x="270" y="518" width="420" height="380" rx="12" className="fill-emerald-500/6 stroke-emerald-500/50" strokeWidth="1" />
        <text x="480" y="540" textAnchor="middle" className="fill-success text-[11px] font-semibold">COLD-START</text>

        <rect x="300" y="552" width="360" height="40" rx="8" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="480" y="577" textAnchor="middle" className="fill-foreground text-[10px] font-medium">open -a Docker</text>

        <line x1="480" y1="592" x2="480" y2="616" className="stroke-emerald-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGreen)" />

        <rect x="300" y="616" width="360" height="52" rx="8" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="480" y="638" textAnchor="middle" className="fill-foreground text-[10px] font-medium">Wait for daemon to answer</text>
        <text x="480" y="654" textAnchor="middle" className="fill-muted-foreground text-[9px]">max 120s</text>

        <line x1="660" y1="642" x2="726" y2="600" className="stroke-red-500/80" strokeWidth="1.5" markerEnd="url(#wcsArrowRed)" />
        <text x="700" y="606" textAnchor="middle" className="fill-red-400 text-[9px] font-medium">120s elapsed</text>

        <rect x="730" y="518" width="200" height="72" rx="8" className="fill-red-500/12 stroke-red-500" strokeWidth="1.5" />
        <text x="830" y="540" textAnchor="middle" className="fill-destructive text-[10.5px] font-semibold">FATAL</text>
        <text x="830" y="558" textAnchor="middle" className="fill-foreground text-[9px]">Daemon silent after 120s</text>
        <text x="830" y="574" textAnchor="middle" className="fill-muted-foreground text-[9px]">operator action required</text>

        <line x1="480" y1="668" x2="480" y2="692" className="stroke-emerald-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGreen)" />
        <text x="492" y="684" className="fill-emerald-400 text-[9px] font-medium">daemon up</text>

        <rect x="300" y="692" width="360" height="40" rx="8" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="480" y="717" textAnchor="middle" className="fill-foreground text-[9.5px] font-medium">
          docker compose up -d clickhouse vector
        </text>

        <line x1="480" y1="732" x2="480" y2="756" className="stroke-emerald-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGreen)" />

        <rect x="300" y="756" width="360" height="52" rx="8" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="480" y="778" textAnchor="middle" className="fill-foreground text-[9.5px] font-medium">
          launchctl kickstart -k backend
        </text>
        <text x="480" y="794" textAnchor="middle" className="fill-muted-foreground text-[9px]">clears the stale ClickHouse client pool</text>

        <line x1="480" y1="808" x2="480" y2="832" className="stroke-emerald-500/70" strokeWidth="1.5" markerEnd="url(#wcsArrowGreen)" />

        <rect x="300" y="832" width="360" height="54" rx="8" className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="1.5" />
        <text x="480" y="854" textAnchor="middle" className="fill-success text-[10.5px] font-semibold">SELF-HEALED</text>
        <text x="480" y="872" textAnchor="middle" className="fill-muted-foreground text-[9px]">
          Daemon answered in 4s during the live test
        </text>

        {/* Footer */}
        <text x="480" y="915" textAnchor="middle" className="fill-muted-foreground/80 text-[9.5px] italic">
          Old behavior: one line, ABORT, docker daemon unreachable, operator action required.
        </text>
        <text x="480" y="932" textAnchor="middle" className="fill-muted-foreground/80 text-[9.5px] italic">
          It fired seventeen times during the 2026-08-01 outage before this path existed.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
