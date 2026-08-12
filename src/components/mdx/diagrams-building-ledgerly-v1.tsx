/** Building Ledgerly v1 blog post diagrams: SVG-based, themed to site colors */

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
 * Import pipeline: upload through atomic commit, with the categorization
 * precedence ladder rendered as the visual centerpiece.
 */
export function ImportPipelineFlow({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Every import runs upload, parse, header signature, a three-way mapping decision, normalize, account resolution, and dedup before it reaches the categorization precedence ladder, then stages for review and commits atomically."
      }
    >
      <svg
        viewBox="0 0 920 1720"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="ledgerly-import-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="ledgerly-import-arrow-rose" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-rose-500/80" />
          </marker>
        </defs>

        <text x="460" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Ledgerly Import Pipeline: File to Committed Data
        </text>

        {/* STAGE 1: INTAKE */}
        <rect x="20" y="46" width="880" height="190" rx="10" className="fill-cyan-500/6 stroke-cyan-500/40" strokeWidth="1" />
        <text x="40" y="66" className="fill-cyan-500/90 text-[11px] font-semibold">STAGE 1 — INTAKE</text>

        <rect x="40" y="82" width="250" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="165" y="106" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Upload</text>
        <text x="165" y="126" textAnchor="middle" className="fill-muted-foreground text-[10px]">drag/drop or file picker</text>
        <text x="165" y="144" textAnchor="middle" className="fill-muted-foreground text-[10px]">.csv or .xlsx</text>

        <line x1="290" y1="147" x2="320" y2="147" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        <rect x="320" y="82" width="280" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="106" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Parse</text>
        <text x="460" y="126" textAnchor="middle" className="fill-muted-foreground text-[10px]">CSV → papaparse</text>
        <text x="460" y="144" textAnchor="middle" className="fill-muted-foreground text-[10px]">XLSX → exceljs</text>
        <text x="460" y="162" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">raw rows + column headers</text>

        <line x1="600" y1="147" x2="630" y2="147" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        <rect x="630" y="82" width="250" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="755" y="106" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Header Signature</text>
        <text x="755" y="126" textAnchor="middle" className="fill-muted-foreground text-[10px]">hash of column headers</text>
        <text x="755" y="144" textAnchor="middle" className="fill-muted-foreground text-[10px]">keys the mapping lookup</text>

        {/* connector to STAGE 2 */}
        <line x1="755" y1="212" x2="755" y2="240" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="175" y1="240" x2="755" y2="240" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="175" y1="240" x2="175" y2="266" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />
        <line x1="460" y1="240" x2="460" y2="266" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />
        <line x1="745" y1="240" x2="745" y2="266" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* STAGE 2: MAPPING DECISION (three-way branch) */}
        <rect x="20" y="260" width="880" height="190" rx="10" className="fill-amber-500/6 stroke-amber-500/40" strokeWidth="1" />
        <text x="40" y="280" className="fill-amber-500/90 text-[11px] font-semibold">STAGE 2 — MAPPING DECISION (three-way branch)</text>

        <rect x="40" y="296" width="270" height="130" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="175" y="320" textAnchor="middle" className="fill-emerald-300 text-[12px] font-semibold">Saved Mapping</text>
        <text x="175" y="340" textAnchor="middle" className="fill-muted-foreground text-[10px]">header signature matches</text>
        <text x="175" y="356" textAnchor="middle" className="fill-muted-foreground text-[10px]">a prior import</text>
        <text x="175" y="376" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">reuse column→field mapping</text>

        <rect x="325" y="296" width="270" height="130" rx="8" className="fill-violet-500/12 stroke-violet-500" strokeWidth="1.5" />
        <text x="460" y="320" textAnchor="middle" className="fill-violet-300 text-[12px] font-semibold">AI Proposal</text>
        <text x="460" y="340" textAnchor="middle" className="fill-muted-foreground text-[10px]">no saved match found</text>
        <text x="460" y="356" textAnchor="middle" className="fill-muted-foreground text-[10px]">AI suggests the mapping</text>
        <text x="460" y="376" textAnchor="middle" className="fill-violet-400/80 text-[9px]">AI-assisted</text>

        <rect x="610" y="296" width="270" height="130" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.5" />
        <text x="745" y="320" textAnchor="middle" className="fill-zinc-300 text-[12px] font-semibold">Manual</text>
        <text x="745" y="340" textAnchor="middle" className="fill-muted-foreground text-[10px]">I map the columns by hand</text>
        <text x="745" y="356" textAnchor="middle" className="fill-muted-foreground text-[10px]">mapping saved for next time</text>

        {/* connector to STAGE 3 */}
        <line x1="175" y1="426" x2="175" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="460" y1="426" x2="460" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="745" y1="426" x2="745" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="175" y1="450" x2="745" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="460" y1="450" x2="460" y2="474" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* STAGE 3: NORMALIZE */}
        <rect x="20" y="474" width="880" height="150" rx="10" className="fill-zinc-500/6 stroke-zinc-500/30" strokeWidth="1" />
        <text x="40" y="494" className="fill-zinc-400 text-[11px] font-semibold">STAGE 3 — NORMALIZE</text>

        <rect x="40" y="510" width="460" height="94" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="270" y="534" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Normalize rows</text>
        <text x="270" y="554" textAnchor="middle" className="fill-muted-foreground text-[10px]">coerce dates, amounts, signs</text>
        <text x="270" y="572" textAnchor="middle" className="fill-muted-foreground text-[10px]">canonical shape for every source</text>

        <line x1="500" y1="557" x2="530" y2="557" className="stroke-rose-500/80" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#ledgerly-import-arrow-rose)" />

        <rect x="530" y="510" width="330" height="94" rx="8" className="fill-rose-500/12 stroke-rose-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="695" y="534" textAnchor="middle" className="fill-rose-300 text-[12px] font-semibold">Per-row errors</text>
        <text x="695" y="554" textAnchor="middle" className="fill-muted-foreground text-[10px]">malformed rows flagged, not dropped</text>
        <text x="695" y="572" textAnchor="middle" className="fill-muted-foreground text-[10px]">surfaced later in Review</text>

        <line x1="270" y1="604" x2="270" y2="624" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* STAGE 4: RESOLVE */}
        <rect x="20" y="624" width="880" height="190" rx="10" className="fill-zinc-500/6 stroke-zinc-500/30" strokeWidth="1" />
        <text x="40" y="644" className="fill-zinc-400 text-[11px] font-semibold">STAGE 4 — RESOLVE</text>

        <rect x="40" y="660" width="400" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="240" y="684" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Account Resolution</text>
        <text x="240" y="704" textAnchor="middle" className="fill-muted-foreground text-[10px]">match row to a known account</text>
        <text x="240" y="722" textAnchor="middle" className="fill-muted-foreground text-[10px]">create a placeholder if new</text>
        <text x="240" y="740" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">or ask at review</text>

        <line x1="440" y1="725" x2="470" y2="725" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        <rect x="470" y="660" width="410" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="675" y="684" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Dedup</text>
        <text x="675" y="704" textAnchor="middle" className="fill-muted-foreground text-[10px]">exact hash: account + date + amount + desc</text>
        <text x="675" y="722" textAnchor="middle" className="fill-muted-foreground text-[10px]">near-duplicate: fuzzy window match</text>
        <text x="675" y="740" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">flagged rows deferred to Review</text>

        {/* connector to centerpiece */}
        <line x1="675" y1="790" x2="675" y2="814" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="460" y1="814" x2="675" y2="814" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="460" y1="814" x2="460" y2="838" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* CENTERPIECE: CATEGORIZATION PRECEDENCE LADDER */}
        <rect x="20" y="838" width="880" height="640" rx="14" className="fill-amber-500/8 stroke-amber-500" strokeWidth="2.5" />
        <text x="460" y="866" textAnchor="middle" className="fill-amber-300 text-[15px] font-bold">
          CATEGORIZATION PRECEDENCE LADDER
        </text>
        <text x="460" y="884" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          first match wins — evaluated top to bottom, stops at the first rung that matches
        </text>

        {/* Rung 1: source_map (deterministic) */}
        <rect x="50" y="898" width="820" height="68" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <circle cx="80" cy="932" r="16" className="fill-emerald-500" />
        <text x="80" y="937" textAnchor="middle" className="fill-white text-[12px] font-bold">1</text>
        <text x="110" y="926" className="fill-emerald-300 text-[13px] font-mono font-semibold">source_map</text>
        <text x="110" y="946" className="fill-muted-foreground text-[10px]">categories already present in the file</text>

        <line x1="80" y1="966" x2="80" y2="974" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 2: source_map_ai (AI-backed) */}
        <rect x="50" y="974" width="820" height="68" rx="8" className="fill-violet-500/14 stroke-violet-500" strokeWidth="2" />
        <circle cx="80" cy="1008" r="16" className="fill-violet-500" />
        <text x="80" y="1013" textAnchor="middle" className="fill-white text-[12px] font-bold">2</text>
        <text x="110" y="1002" className="fill-violet-300 text-[13px] font-mono font-semibold">source_map_ai</text>
        <text x="110" y="1022" className="fill-muted-foreground text-[10px]">AI resolves unrecognized file-category names</text>
        <rect x="760" y="994" width="50" height="20" rx="10" className="fill-violet-500" />
        <text x="785" y="1008" textAnchor="middle" className="fill-white text-[10px] font-bold">AI</text>

        <line x1="80" y1="1042" x2="80" y2="1050" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 3: transfer_pattern (deterministic) */}
        <rect x="50" y="1050" width="820" height="68" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <circle cx="80" cy="1084" r="16" className="fill-emerald-500" />
        <text x="80" y="1089" textAnchor="middle" className="fill-white text-[12px] font-bold">3</text>
        <text x="110" y="1078" className="fill-emerald-300 text-[13px] font-mono font-semibold">transfer_pattern</text>
        <text x="110" y="1098" className="fill-muted-foreground text-[10px]">deterministic description-pattern match</text>

        <line x1="80" y1="1118" x2="80" y2="1126" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 4: refund (deterministic) */}
        <rect x="50" y="1126" width="820" height="68" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <circle cx="80" cy="1160" r="16" className="fill-emerald-500" />
        <text x="80" y="1165" textAnchor="middle" className="fill-white text-[12px] font-bold">4</text>
        <text x="110" y="1154" className="fill-emerald-300 text-[13px] font-mono font-semibold">refund</text>
        <text x="110" y="1174" className="fill-muted-foreground text-[10px]">matched by account, merchant, and amount</text>

        <line x1="80" y1="1194" x2="80" y2="1202" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 5: rule (deterministic) */}
        <rect x="50" y="1202" width="820" height="68" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <circle cx="80" cy="1236" r="16" className="fill-emerald-500" />
        <text x="80" y="1241" textAnchor="middle" className="fill-white text-[12px] font-bold">5</text>
        <text x="110" y="1230" className="fill-emerald-300 text-[13px] font-mono font-semibold">rule</text>
        <text x="110" y="1250" className="fill-muted-foreground text-[10px]">my saved merchant rules</text>

        <line x1="80" y1="1270" x2="80" y2="1278" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 6: ai (AI-backed) */}
        <rect x="50" y="1278" width="820" height="68" rx="8" className="fill-violet-500/14 stroke-violet-500" strokeWidth="2" />
        <circle cx="80" cy="1312" r="16" className="fill-violet-500" />
        <text x="80" y="1317" textAnchor="middle" className="fill-white text-[12px] font-bold">6</text>
        <text x="110" y="1306" className="fill-violet-300 text-[13px] font-mono font-semibold">ai</text>
        <text x="110" y="1326" className="fill-muted-foreground text-[10px]">AI merchant categorization</text>
        <rect x="760" y="1298" width="50" height="20" rx="10" className="fill-violet-500" />
        <text x="785" y="1312" textAnchor="middle" className="fill-white text-[10px] font-bold">AI</text>

        <line x1="80" y1="1346" x2="80" y2="1354" className="stroke-muted-foreground/50" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* Rung 7: none */}
        <rect x="50" y="1354" width="820" height="68" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="80" cy="1388" r="16" className="fill-zinc-500" />
        <text x="80" y="1393" textAnchor="middle" className="fill-white text-[12px] font-bold">7</text>
        <text x="110" y="1382" className="fill-zinc-300 text-[13px] font-mono font-semibold">none</text>
        <text x="110" y="1402" className="fill-muted-foreground text-[10px]">uncategorized — falls through every rung above</text>

        {/* connector to STAGE 5 */}
        <line x1="460" y1="1478" x2="460" y2="1498" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        {/* STAGE 5: REVIEW & COMMIT */}
        <rect x="20" y="1498" width="880" height="190" rx="10" className="fill-cyan-500/6 stroke-cyan-500/40" strokeWidth="1" />
        <text x="40" y="1518" className="fill-cyan-500/90 text-[11px] font-semibold">STAGE 5 — REVIEW &amp; COMMIT</text>

        <rect x="40" y="1534" width="260" height="130" rx="8" className="fill-cyan-500/12 stroke-cyan-500" strokeWidth="1.5" />
        <text x="170" y="1558" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Stage</text>
        <text x="170" y="1578" textAnchor="middle" className="fill-muted-foreground text-[10px]">pending rows held</text>
        <text x="170" y="1596" textAnchor="middle" className="fill-muted-foreground text-[10px]">not yet in the ledger</text>

        <line x1="300" y1="1599" x2="330" y2="1599" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        <rect x="330" y="1534" width="260" height="130" rx="8" className="fill-amber-500/12 stroke-amber-500" strokeWidth="1.5" />
        <text x="460" y="1558" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">Review</text>
        <text x="460" y="1578" textAnchor="middle" className="fill-muted-foreground text-[10px]">resolve dedup flags</text>
        <text x="460" y="1596" textAnchor="middle" className="fill-muted-foreground text-[10px]">fix normalize errors</text>
        <text x="460" y="1612" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">confirm category overrides</text>

        <line x1="590" y1="1599" x2="620" y2="1599" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-import-arrow)" />

        <rect x="620" y="1534" width="260" height="130" rx="8" className="fill-emerald-500/14 stroke-emerald-500" strokeWidth="2" />
        <text x="750" y="1558" textAnchor="middle" className="fill-emerald-300 text-[12px] font-semibold">Atomic Commit</text>
        <text x="750" y="1578" textAnchor="middle" className="fill-muted-foreground text-[10px]">all rows or none</text>
        <text x="750" y="1596" textAnchor="middle" className="fill-muted-foreground text-[10px]">single DB transaction</text>
        <text x="750" y="1612" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">batch becomes committed</text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Agent team topology: captain dispatching fresh implementer/reviewer pairs
 * per task with a fix loop, specialist briefings, and a milestone spine
 * guarded by a layman-QA gate before every merge to main.
 */
export function AgentTeamTopology({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The captain dispatches a fresh implementer and a fresh reviewer per task, cycling between them until review is clean; specialist role prompts brief the implementer, and a layman-QA gate guards every milestone's merge to main."
      }
    >
      <svg
        viewBox="0 0 920 1350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="ledgerly-team-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="ledgerly-team-arrow-rose" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-rose-500/80" />
          </marker>
          <marker id="ledgerly-team-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        <text x="460" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Ledgerly Build Team: Captain, Fresh Agents, and the Milestone Spine
        </text>

        {/* SECTION 1: PER-TASK LOOP */}
        <rect x="20" y="46" width="880" height="440" rx="10" className="fill-cyan-500/6 stroke-cyan-500/40" strokeWidth="1" />
        <text x="40" y="66" className="fill-cyan-500/90 text-[11px] font-semibold">PER TASK — repeated for every implementation item</text>

        <rect x="330" y="82" width="260" height="64" rx="8" className="fill-amber-500/12 stroke-amber-500" strokeWidth="2" />
        <text x="460" y="108" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">Captain (main session)</text>
        <text x="460" y="126" textAnchor="middle" className="fill-muted-foreground text-[10px]">reads the plan, dispatches work</text>

        {/* dispatch arrows */}
        <line x1="410" y1="146" x2="380" y2="200" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <text x="365" y="175" className="fill-muted-foreground text-[9px]">dispatch</text>
        <line x1="520" y1="146" x2="700" y2="200" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <text x="560" y="175" className="fill-muted-foreground text-[9px]">dispatch</text>

        {/* specialist briefing pills */}
        <rect x="40" y="200" width="220" height="54" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.2" />
        <text x="150" y="224" textAnchor="middle" className="fill-zinc-300 text-[11px] font-semibold">finance-expert</text>
        <text x="150" y="240" textAnchor="middle" className="fill-muted-foreground text-[9px]">role-prompt briefing</text>

        <rect x="40" y="264" width="220" height="54" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.2" />
        <text x="150" y="288" textAnchor="middle" className="fill-zinc-300 text-[11px] font-semibold">ux-designer</text>
        <text x="150" y="304" textAnchor="middle" className="fill-muted-foreground text-[9px]">role-prompt briefing</text>

        <rect x="40" y="328" width="220" height="54" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.2" />
        <text x="150" y="352" textAnchor="middle" className="fill-zinc-300 text-[11px] font-semibold">db-engineer</text>
        <text x="150" y="368" textAnchor="middle" className="fill-muted-foreground text-[9px]">role-prompt briefing</text>

        <line x1="260" y1="227" x2="300" y2="240" className="stroke-muted-foreground/50" strokeWidth="1.2" markerEnd="url(#ledgerly-team-arrow)" />
        <line x1="260" y1="291" x2="300" y2="291" className="stroke-muted-foreground/50" strokeWidth="1.2" markerEnd="url(#ledgerly-team-arrow)" />
        <line x1="260" y1="355" x2="300" y2="330" className="stroke-muted-foreground/50" strokeWidth="1.2" markerEnd="url(#ledgerly-team-arrow)" />

        <rect x="300" y="200" width="280" height="170" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="440" y="226" textAnchor="middle" className="fill-emerald-300 text-[12px] font-semibold">Fresh Implementer</text>
        <text x="440" y="246" textAnchor="middle" className="fill-muted-foreground text-[10px]">new session, task-scoped</text>
        <text x="440" y="264" textAnchor="middle" className="fill-muted-foreground text-[10px]">receives specialist briefings</text>
        <text x="440" y="282" textAnchor="middle" className="fill-muted-foreground text-[10px]">writes the code</text>

        <rect x="620" y="200" width="260" height="170" rx="8" className="fill-violet-500/10 stroke-violet-500" strokeWidth="1.5" />
        <text x="750" y="226" textAnchor="middle" className="fill-violet-300 text-[12px] font-semibold">Fresh Reviewer</text>
        <text x="750" y="246" textAnchor="middle" className="fill-muted-foreground text-[10px]">new session, task-scoped</text>
        <text x="750" y="264" textAnchor="middle" className="fill-muted-foreground text-[10px]">no memory of the implementer&apos;s reasoning</text>
        <text x="750" y="282" textAnchor="middle" className="fill-muted-foreground text-[10px]">reviews the diff cold</text>

        {/* fix loop */}
        <line x1="580" y1="240" x2="620" y2="240" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <text x="600" y="230" textAnchor="middle" className="fill-muted-foreground text-[9px]">submit</text>
        <line x1="620" y1="330" x2="580" y2="330" className="stroke-rose-500/80" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#ledgerly-team-arrow-rose)" />
        <text x="600" y="320" textAnchor="middle" className="fill-rose-400 text-[9px]">fix</text>
        <text x="600" y="392" textAnchor="middle" className="fill-muted-foreground text-[10px]">cycle until review is clean</text>

        {/* clean review down to spine */}
        <line x1="750" y1="370" x2="750" y2="410" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />
        <text x="770" y="400" className="fill-emerald-400 text-[9px]">review: clean</text>
        <line x1="750" y1="410" x2="460" y2="410" className="stroke-emerald-500/80" strokeWidth="1.5" />
        <line x1="460" y1="410" x2="460" y2="486" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />

        {/* SECTION 2: MILESTONE SPINE */}
        <rect x="20" y="500" width="880" height="818" rx="10" className="fill-violet-500/5 stroke-violet-500/30" strokeWidth="1" />
        <text x="40" y="520" className="fill-violet-400 text-[11px] font-semibold">MILESTONE SPINE — layman-QA gate guards every merge to main</text>

        {/* M0 */}
        <rect x="210" y="540" width="500" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="568" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">M0 — Scaffold, Schema, Adapter</text>
        <text x="460" y="588" textAnchor="middle" className="fill-muted-foreground text-[10px]">repo skeleton, DB schema, AI adapter seam stood up</text>
        <text x="460" y="606" textAnchor="middle" className="fill-muted-foreground text-[10px]">first captain / implementer / reviewer cycles run here</text>

        <line x1="460" y1="630" x2="460" y2="648" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <rect x="310" y="648" width="300" height="46" rx="23" className="fill-amber-500/14 stroke-amber-500" strokeWidth="1.5" />
        <text x="460" y="676" textAnchor="middle" className="fill-amber-300 text-[11px] font-semibold">Layman-QA Gate</text>

        <line x1="460" y1="694" x2="460" y2="712" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />
        <text x="480" y="708" className="fill-emerald-400 text-[9px]">merge to main</text>

        {/* M1 */}
        <rect x="210" y="712" width="500" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="740" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">M1 — Import &amp; Transactions</text>
        <text x="460" y="760" textAnchor="middle" className="fill-muted-foreground text-[10px]">CSV/XLSX import pipeline, categorization ladder</text>
        <text x="460" y="778" textAnchor="middle" className="fill-muted-foreground text-[10px]">transaction ledger goes live</text>

        <line x1="460" y1="802" x2="460" y2="820" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <rect x="310" y="820" width="300" height="46" rx="23" className="fill-amber-500/14 stroke-amber-500" strokeWidth="1.5" />
        <text x="460" y="848" textAnchor="middle" className="fill-amber-300 text-[11px] font-semibold">Layman-QA Gate</text>

        <line x1="460" y1="866" x2="460" y2="884" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />
        <text x="480" y="880" className="fill-emerald-400 text-[9px]">merge to main</text>

        {/* M2 */}
        <rect x="210" y="884" width="500" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="912" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">M2 — Dashboard, Budgets, Goals</text>
        <text x="460" y="932" textAnchor="middle" className="fill-muted-foreground text-[10px]">aggregates module lands, budget tracking</text>
        <text x="460" y="950" textAnchor="middle" className="fill-muted-foreground text-[10px]">savings goals</text>

        <line x1="460" y1="974" x2="460" y2="992" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <rect x="310" y="992" width="300" height="46" rx="23" className="fill-amber-500/14 stroke-amber-500" strokeWidth="1.5" />
        <text x="460" y="1020" textAnchor="middle" className="fill-amber-300 text-[11px] font-semibold">Layman-QA Gate</text>

        <line x1="460" y1="1038" x2="460" y2="1056" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />
        <text x="480" y="1052" className="fill-emerald-400 text-[9px]">merge to main</text>

        {/* M3 */}
        <rect x="210" y="1056" width="500" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="1084" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">M3 — Chat, Reports, Exports</text>
        <text x="460" y="1104" textAnchor="middle" className="fill-muted-foreground text-[10px]">AI chat over ledger data, PDF/CSV reports</text>
        <text x="460" y="1122" textAnchor="middle" className="fill-muted-foreground text-[10px]">data exports</text>

        <line x1="460" y1="1146" x2="460" y2="1164" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow)" />
        <rect x="310" y="1164" width="300" height="46" rx="23" className="fill-amber-500/14 stroke-amber-500" strokeWidth="1.5" />
        <text x="460" y="1192" textAnchor="middle" className="fill-amber-300 text-[11px] font-semibold">Layman-QA Gate</text>

        <line x1="460" y1="1210" x2="460" y2="1228" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-team-arrow-emerald)" />
        <text x="480" y="1224" className="fill-emerald-400 text-[9px]">merge to main</text>

        {/* v1 shipped */}
        <rect x="270" y="1228" width="380" height="60" rx="10" className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="2" />
        <text x="460" y="1256" textAnchor="middle" className="fill-emerald-300 text-[13px] font-bold">v1 shipped</text>
        <text x="460" y="1274" textAnchor="middle" className="fill-muted-foreground text-[10px]">all four milestones merged to main</text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * AI adapter seam: four AI features funnel through one adapter module that
 * spawns the local claude CLI, with two output modes and two side rails.
 */
export function AiAdapterSeam({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Column mapping, categorization, chat, and report narrative all funnel through one adapter module that spawns the local claude CLI as a subprocess — subscription-billed, no API keys — with a mock rail and a disabled rail on either side."
      }
    >
      <svg
        viewBox="0 0 920 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="ledgerly-adapter-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="ledgerly-adapter-arrow-violet" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-violet-500/80" />
          </marker>
          <marker id="ledgerly-adapter-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        <text x="460" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Ledgerly AI Adapter: One Seam, Two Output Modes, Two Escape Hatches
        </text>

        {/* 4 callers */}
        <rect x="40" y="60" width="180" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="130" y="90" textAnchor="middle" className="fill-cyan-300 text-[11px] font-semibold">Column Mapping</text>
        <text x="130" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">map file headers to fields</text>

        <rect x="260" y="60" width="180" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="350" y="90" textAnchor="middle" className="fill-cyan-300 text-[11px] font-semibold">Categorization</text>
        <text x="350" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">assign spending categories</text>

        <rect x="480" y="60" width="180" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="570" y="90" textAnchor="middle" className="fill-cyan-300 text-[11px] font-semibold">Chat</text>
        <text x="570" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">answer questions about my data</text>

        <rect x="700" y="60" width="180" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="790" y="90" textAnchor="middle" className="fill-cyan-300 text-[11px] font-semibold">Report Narrative</text>
        <text x="790" y="110" textAnchor="middle" className="fill-muted-foreground text-[9px]">written summary of a report</text>

        {/* converge into adapter */}
        <line x1="130" y1="150" x2="130" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="350" y1="150" x2="350" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="570" y1="150" x2="570" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="790" y1="150" x2="790" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="130" y1="180" x2="790" y2="180" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="460" y1="180" x2="460" y2="204" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-adapter-arrow)" />

        {/* CENTERPIECE: adapter module */}
        <rect x="280" y="204" width="360" height="90" rx="12" className="fill-amber-500/12 stroke-amber-500" strokeWidth="2.5" />
        <text x="460" y="232" textAnchor="middle" className="fill-amber-300 text-[13px] font-bold">AI Adapter Module — the one seam</text>
        <text x="460" y="252" textAnchor="middle" className="fill-muted-foreground text-[10px]">every AI call in the app funnels through here</text>
        <text x="460" y="270" textAnchor="middle" className="fill-muted-foreground text-[10px]">single retry / timeout / logging policy</text>

        {/* side rails */}
        <line x1="290" y1="240" x2="150" y2="318" className="stroke-violet-500/70" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#ledgerly-adapter-arrow-violet)" />
        <line x1="630" y1="240" x2="770" y2="318" className="stroke-zinc-500/70" strokeWidth="1.5" strokeDasharray="4 3" />

        <rect x="40" y="318" width="210" height="90" rx="8" className="fill-violet-500/10 stroke-violet-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="145" y="344" textAnchor="middle" className="fill-violet-300 text-[11px] font-semibold">LEDGERLY_AI_MOCK</text>
        <text x="145" y="364" textAnchor="middle" className="fill-muted-foreground text-[9px]">test env: canned responses</text>
        <text x="145" y="382" textAnchor="middle" className="fill-muted-foreground text-[9px]">never spends the subscription</text>

        <rect x="650" y="318" width="230" height="90" rx="8" className="fill-zinc-500/10 stroke-zinc-500" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="765" y="344" textAnchor="middle" className="fill-zinc-300 text-[11px] font-semibold">LEDGERLY_AI_DISABLED</text>
        <text x="765" y="364" textAnchor="middle" className="fill-muted-foreground text-[9px]">no-AI mode: skip the call</text>
        <text x="765" y="382" textAnchor="middle" className="fill-muted-foreground text-[9px]">graceful degradation</text>

        {/* main path to CLI subprocess */}
        <line x1="460" y1="294" x2="460" y2="318" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-adapter-arrow)" />

        <rect x="280" y="318" width="360" height="90" rx="8" className="fill-emerald-500/10 stroke-emerald-500" strokeWidth="1.5" />
        <text x="460" y="344" textAnchor="middle" className="fill-emerald-300 text-[12px] font-semibold">spawn local claude CLI subprocess</text>
        <text x="460" y="364" textAnchor="middle" className="fill-muted-foreground text-[9px]">subscription-billed via Claude Code login</text>
        <text x="460" y="382" textAnchor="middle" className="fill-muted-foreground text-[9px]">no API keys stored or shipped</text>

        {/* output mode branch */}
        <line x1="460" y1="408" x2="460" y2="432" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="270" y1="432" x2="650" y2="432" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="270" y1="432" x2="270" y2="456" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-adapter-arrow)" />
        <line x1="650" y1="432" x2="650" y2="456" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-adapter-arrow)" />

        <rect x="140" y="456" width="260" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="270" y="484" textAnchor="middle" className="fill-cyan-300 text-[12px] font-mono font-semibold">--json-schema</text>
        <text x="270" y="504" textAnchor="middle" className="fill-muted-foreground text-[9px]">structured, typed result</text>
        <text x="270" y="522" textAnchor="middle" className="fill-muted-foreground text-[9px]">column mapping, categorization</text>

        <rect x="520" y="456" width="260" height="90" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="650" y="484" textAnchor="middle" className="fill-cyan-300 text-[12px] font-mono font-semibold">stream-json</text>
        <text x="650" y="504" textAnchor="middle" className="fill-muted-foreground text-[9px]">--output-format stream-json</text>
        <text x="650" y="522" textAnchor="middle" className="fill-muted-foreground text-[9px]">chat, report narrative</text>

        {/* convergence into final typed-result box */}
        <line x1="145" y1="408" x2="145" y2="590" className="stroke-violet-500/50" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="765" y1="408" x2="765" y2="590" className="stroke-zinc-500/50" strokeWidth="1.2" strokeDasharray="4 3" />
        <line x1="270" y1="546" x2="270" y2="590" className="stroke-muted-foreground/50" strokeWidth="1.2" />
        <line x1="650" y1="546" x2="650" y2="590" className="stroke-muted-foreground/50" strokeWidth="1.2" />
        <line x1="145" y1="590" x2="765" y2="590" className="stroke-muted-foreground/50" strokeWidth="1.2" />
        <line x1="460" y1="590" x2="460" y2="606" className="stroke-emerald-500/80" strokeWidth="1.5" markerEnd="url(#ledgerly-adapter-arrow-emerald)" />

        <rect x="220" y="606" width="480" height="90" rx="10" className="fill-emerald-500/14 stroke-emerald-500" strokeWidth="2" />
        <text x="460" y="634" textAnchor="middle" className="fill-emerald-300 text-[13px] font-bold">Callers receive typed results either way</text>
        <text x="460" y="654" textAnchor="middle" className="fill-muted-foreground text-[10px]">mock, disabled, structured, or streamed</text>
        <text x="460" y="672" textAnchor="middle" className="fill-muted-foreground text-[10px]">same contract, every path</text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Analytics single source of truth: transactions plus a committed-batch
 * predicate feed one aggregates module that four consumers read from.
 */
export function AnalyticsSingleSource({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The transactions table plus a committed-batch predicate feed one aggregates module; the dashboard, chat context, reports, and exports all read from it, so they cannot disagree."
      }
    >
      <svg
        viewBox="0 0 920 660"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="ledgerly-analytics-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        <text x="460" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          Ledgerly Analytics: One Predicate, One Aggregates Module, Four Consumers
        </text>

        <rect x="340" y="50" width="240" height="70" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="460" y="80" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Transactions table</text>
        <text x="460" y="100" textAnchor="middle" className="fill-muted-foreground text-[10px]">every imported row, forever</text>

        <line x1="460" y1="120" x2="460" y2="144" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />

        {/* predicate guardrail */}
        <rect x="190" y="144" width="540" height="180" rx="12" className="fill-amber-500/8 stroke-amber-500" strokeWidth="2" />
        <text x="460" y="170" textAnchor="middle" className="fill-amber-300 text-[12px] font-bold">THE PREDICATE — same filter, every consumer</text>
        <text x="214" y="196" className="fill-amber-200 text-[11px] font-mono">✓ batch.status = &apos;committed&apos;</text>
        <text x="214" y="222" className="fill-amber-200 text-[11px] font-mono">✓ excluded = 0</text>
        <text x="214" y="248" className="fill-amber-200 text-[11px] font-mono">✓ category != &apos;transfers&apos;</text>
        <text x="214" y="274" className="fill-amber-200 text-[11px] font-mono">✓ category != &apos;income&apos;</text>
        <text x="470" y="274" className="fill-muted-foreground text-[10px]">(spending figures only)</text>
        <text x="214" y="300" className="fill-muted-foreground/70 text-[9px]">enforced once, inside the aggregates module, never re-implemented by a consumer</text>

        <line x1="460" y1="324" x2="460" y2="348" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />

        {/* CENTERPIECE: aggregates module */}
        <rect x="300" y="348" width="320" height="90" rx="12" className="fill-violet-500/14 stroke-violet-500" strokeWidth="2.5" />
        <text x="460" y="378" textAnchor="middle" className="fill-violet-300 text-[14px] font-bold">ONE Aggregates Module</text>
        <text x="460" y="398" textAnchor="middle" className="fill-muted-foreground text-[10px]">every number the app shows is computed here, once</text>
        <text x="460" y="416" textAnchor="middle" className="fill-muted-foreground text-[10px]">no consumer re-derives its own totals</text>

        {/* fan out to 4 consumers */}
        <line x1="460" y1="438" x2="460" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="135" y1="450" x2="795" y2="450" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="135" y1="450" x2="135" y2="474" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />
        <line x1="355" y1="450" x2="355" y2="474" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />
        <line x1="575" y1="450" x2="575" y2="474" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />
        <line x1="795" y1="450" x2="795" y2="474" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#ledgerly-analytics-arrow)" />

        <rect x="40" y="474" width="190" height="110" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="135" y="504" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Dashboard</text>
        <text x="135" y="524" textAnchor="middle" className="fill-muted-foreground text-[10px]">spending by category,</text>
        <text x="135" y="540" textAnchor="middle" className="fill-muted-foreground text-[10px]">trends over time</text>

        <rect x="260" y="474" width="190" height="110" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="355" y="504" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Chat Context</text>
        <text x="355" y="524" textAnchor="middle" className="fill-muted-foreground text-[10px]">AI answers pulled from</text>
        <text x="355" y="540" textAnchor="middle" className="fill-muted-foreground text-[10px]">the same numbers</text>

        <rect x="480" y="474" width="190" height="110" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="575" y="504" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Reports</text>
        <text x="575" y="524" textAnchor="middle" className="fill-muted-foreground text-[10px]">monthly PDF/CSV</text>
        <text x="575" y="540" textAnchor="middle" className="fill-muted-foreground text-[10px]">summaries</text>

        <rect x="700" y="474" width="180" height="110" rx="8" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="790" y="504" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">Exports</text>
        <text x="790" y="524" textAnchor="middle" className="fill-muted-foreground text-[10px]">raw data for</text>
        <text x="790" y="540" textAnchor="middle" className="fill-muted-foreground text-[10px]">external tools</text>

        <text x="460" y="616" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          Same source, same predicate: these four views cannot disagree with each other.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
