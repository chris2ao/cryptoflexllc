/** "It's Only on My Home Network" Is Not a Threat Model: editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  DIAGRAM_ACCENTS,
  type DiagramAccent,
} from "./diagram-editorial";

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
 * The LAN wall is one boundary. Inside it sit the Mac, the Windows PC,
 * the phone and laptop, and the external drive. Four kinds of input cross
 * the edge anyway: the browser, file names, subtitle tracks, and a cloud
 * streaming API.
 */
export function LanBoundaryDiagram({ caption }: DiagramProps) {
  const rightMids = [147, 235, 323, 411];
  const leftMids = [177, 279, 381];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The LAN wall is one boundary, and the assumption stops there. Inside it, a Mac, a PC, two devices and a drive. Crossing it anyway: the browser, file names, subtitle tracks, and a cloud streaming API."
      }
    >
      <EditorialFrame
        id="itm1"
        w={900}
        h={540}
        eyebrow="The LAN Wall And What Crosses It"
        chips={[{ label: "4 inputs cross the edge", accent: "red" }]}
        footerRight="Threat model · LAN-only is one boundary"
      >
        {/* The assumption: dashed LAN-only region */}
        <rect
          x={24}
          y={62}
          width={556}
          height={434}
          rx={14}
          className="fill-cyan-500/[0.03] stroke-cyan-500/50"
          strokeWidth={1.5}
          strokeDasharray="8 6"
        />
        <SectionLabel x={44} y={90} label="LAN-only (the assumption)" accent="cyan" />

        {/* Inside: three trusted neighbors */}
        <NodePanel
          x={44}
          y={133}
          w={206}
          h={88}
          accent="muted"
          title="Windows PC"
          sub={["read-only SMB link", "watched folder"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={44}
          y={235}
          w={206}
          h={88}
          accent="muted"
          title="Phone / laptop"
          sub={["your own devices", "Wi-Fi or VPN"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={44}
          y={337}
          w={206}
          h={88}
          accent="amber"
          title="External drive"
          sub={["local accounts", "what runs at login"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Inside bus into the host */}
        {leftMids.map((cy) => (
          <FlowLine key={cy} id="itm1" d={`M250,${cy} L284,${cy}`} accent="cyan" arrow={false} />
        ))}
        <path d="M284,177 L284,381" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id="itm1" d="M284,279 L346,279" accent="cyan" />

        {/* The host */}
        <NodePanel
          x={348}
          y={219}
          w={200}
          h={120}
          accent="primary"
          emphasis
          terminal
          title="CryptoFlix"
          sub={["Mac, one user", "no port forward"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Crossing the edge */}
        <SectionLabel x={644} y={92} label="Crosses anyway" accent="red" />
        {rightMids.map((cy) => (
          <FlowLine key={cy} id="itm1" d={`M644,${cy} L612,${cy}`} accent="red" arrow={false} />
        ))}
        <path d="M612,147 L612,411" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id="itm1" d="M612,279 L550,279" accent="red" width={2} />

        <NodePanel
          x={644}
          y={109}
          w={232}
          h={76}
          accent="red"
          title="Your browser"
          sub={["DNS rebinding", "hostile page, your LAN"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={644}
          y={197}
          w={232}
          h={76}
          accent="red"
          title="File names"
          sub={["parser crash", "PowerShell injection"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={644}
          y={285}
          w={232}
          h={76}
          accent="red"
          title="Subtitle tracks"
          sub={["HTML in the video file", "meta refresh, forms"]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={644}
          y={373}
          w={232}
          h={76}
          accent="red"
          title="Cloud streaming API"
          sub={["playlists with tokens", "in every URL"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

const SUBTITLE_ROWS: {
  badge: string;
  title: string;
  sub: string;
  accent: DiagramAccent;
  chip: string;
}[] = [
  {
    badge: "0",
    title: "Original injection",
    sub: "entity-encoded meta refresh inside a cue",
    accent: "amber",
    chip: "found",
  },
  {
    badge: "B1",
    title: "Tags first, entities second",
    sub: "&l<c>t; splices back into &lt;, a live tag",
    accent: "red",
    chip: "bypass",
  },
  {
    badge: "B2",
    title: "What counts as blank",
    sub: "whitespace-only line, trimmed by the parser",
    accent: "red",
    chip: "bypass",
  },
  {
    badge: "B3",
    title: "No signature",
    sub: "no WEBVTT header, text still read as a cue",
    accent: "red",
    chip: "bypass",
  },
  {
    badge: "B4",
    title: "Chunk boundary in CRLF",
    sub: "split between CR and LF ends the header early",
    accent: "red",
    chip: "bypass",
  },
];

/**
 * One fix, four bypasses. The original sanitizer fix landed at 15:05; B1
 * to B3 came out of the first re-review (fixed 16:25); B4 came out of
 * the second (fixed 16:41).
 */
export function SubtitleBypassChainDiagram({ caption }: DiagramProps) {
  const rowY = (i: number) => 76 + i * 76;
  const mid = (i: number) => rowY(i) + 31;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The subtitle sanitizer fix broke four times in under two hours. Each bypass came from a re-review of the fix that had just been declared done."
      }
    >
      <EditorialFrame
        id="itm2"
        w={900}
        h={486}
        eyebrow="One Fix, Four Bypasses"
        chips={[
          { label: "4 bypasses", accent: "red" },
          { label: "under 2 hours", accent: "amber" },
        ]}
        footerRight="Subtitle sanitizer · 15:05 to 16:41"
      >
        {/* Spine of step badges */}
        {SUBTITLE_ROWS.slice(0, 4).map((r, i) => (
          <FlowLine
            key={r.badge}
            id="itm2"
            d={`M44,${mid(i) + 13} L44,${mid(i + 1) - 14}`}
            accent="muted"
          />
        ))}
        {SUBTITLE_ROWS.map((r, i) => (
          <g key={r.badge}>
            <StepBadge cx={44} cy={mid(i)} n={r.badge} accent={r.accent} />
            <NodePanel
              x={80}
              y={rowY(i)}
              w={556}
              h={62}
              accent={r.accent}
              align="left"
              title={r.title}
              sub={[r.sub]}
              titleSize={17}
              subSize={12.5}
            >
              <Chip
                x={620}
                y={rowY(i) + 20}
                label={r.chip}
                accent={r.accent}
                filled
                fontSize={11}
                anchor="end"
              />
            </NodePanel>
          </g>
        ))}

        {/* Fix cards */}
        <FlowLine id="itm2" d="M636,107 L666,107" accent="emerald" />
        <NodePanel
          x={668}
          y={76}
          w={208}
          h={62}
          accent="emerald"
          title="Fixed 15:05"
          sub={["sanitizer plus", "form-action 'self'"]}
          titleSize={17}
          subSize={12}
        />

        {[mid(1), mid(2), mid(3)].map((cy) => (
          <FlowLine key={cy} id="itm2" d={`M636,${cy} L652,${cy}`} accent="emerald" arrow={false} />
        ))}
        <path
          d={`M652,${mid(1)} L652,${mid(3)}`}
          fill="none"
          className="stroke-emerald-500/50"
          strokeWidth="1.5"
        />
        <FlowLine id="itm2" d={`M652,${mid(2)} L666,${mid(2)}`} accent="emerald" />
        <NodePanel
          x={668}
          y={rowY(2)}
          w={208}
          h={62}
          accent="emerald"
          title="Fixed 16:25"
          sub={["B1 to B3, from the", "first re-review"]}
          titleSize={17}
          subSize={12}
        />

        <FlowLine id="itm2" d={`M636,${mid(4)} L666,${mid(4)}`} accent="emerald" />
        <NodePanel
          x={668}
          y={rowY(4)}
          w={208}
          h={62}
          accent="emerald"
          emphasis
          title="Fixed 16:41"
          sub={["B4, second re-review", "red test first"]}
          titleSize={17}
          subSize={12}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * The guard and the router read the same request differently. The guard
 * matched the raw URL and skipped; the router decoded it and found the
 * guarded route. The fix attaches the guard per route.
 */
export function GuardVsRouterDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Two components read one request and saw different strings. The guard matched the raw URL and skipped, while the router decoded it and ran the handler anyway. The fix attaches the guard to each route instead."
      }
    >
      <EditorialFrame
        id="itm3"
        w={900}
        h={486}
        eyebrow="Same Request, Two Readings"
        chips={[
          { label: "200 with no login", accent: "red" },
        ]}
        footerRight="Guard vs router · /%61pi/status"
      >
        {/* Request */}
        <NodePanel
          x={24}
          y={134}
          w={170}
          h={110}
          accent="muted"
          terminal
          title="One request"
          sub={["GET /%61pi/status", "no session cookie"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Fan-out bus */}
        <FlowLine id="itm3" d="M194,189 L226,189" accent="muted" arrow={false} />
        <path d="M226,129 L226,249" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="itm3" d="M226,129 L248,129" accent="amber" />
        <FlowLine id="itm3" d="M226,249 L248,249" accent="cyan" />

        {/* Two readers */}
        <NodePanel
          x={250}
          y={84}
          w={390}
          h={90}
          accent="amber"
          align="left"
          title="Auth guard"
          sub={["reads the raw URL: /%61pi/status", "starts with /api/ ? no, bail out"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={624} y={118} label="skips" accent="amber" filled fontSize={11} anchor="end" />
        </NodePanel>
        <NodePanel
          x={250}
          y={204}
          w={390}
          h={90}
          accent="cyan"
          align="left"
          title="Router"
          sub={["decodes first: /api/status", "matches a guarded route"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={624} y={238} label="matches" accent="cyan" filled fontSize={11} anchor="end" />
        </NodePanel>

        {/* Fan-in bus */}
        <FlowLine id="itm3" d="M640,129 L672,129" accent="red" arrow={false} />
        <FlowLine id="itm3" d="M640,249 L672,249" accent="red" arrow={false} />
        <path d="M672,129 L672,249" fill="none" className="stroke-red-500/50" strokeWidth="1.5" />
        <FlowLine id="itm3" d="M672,189 L698,189" accent="red" width={2} />

        <NodePanel
          x={700}
          y={134}
          w={176}
          h={110}
          accent="red"
          emphasis
          terminal
          title="Handler runs"
          sub={["200 + PC status", "no session"]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Divider and the fix */}
        <line x1={24} y1={322} x2={876} y2={322} className="stroke-border" strokeWidth="1" />
        <SectionLabel x={24} y={352} label="After the fix" accent="emerald" />

        <NodePanel
          x={24}
          y={364}
          w={256}
          h={78}
          accent="emerald"
          title="Guard per route"
          sub={["attached at registration", "from the router's pattern"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="itm3" d="M280,403 L320,403" accent="emerald" />
        <NodePanel
          x={322}
          y={364}
          w={256}
          h={78}
          accent="emerald"
          title="Classify after decode"
          sub={["unmatched paths decoded", "bad escapes go to errors"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="itm3" d="M578,403 L618,403" accent="emerald" />
        <NodePanel
          x={620}
          y={364}
          w={256}
          h={78}
          accent="emerald"
          emphasis
          title="Every spelling, 401"
          sub={["5 in the test", "17 in the re-review"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

interface LedgerRow {
  label: string;
  n: number;
  accent: DiagramAccent;
  dashed?: boolean;
}

const SCALE = 8;
const BAR_X = 200;
const BAR_H = 28;

function LedgerBar({ row, y }: { row: LedgerRow; y: number }) {
  const a = DIAGRAM_ACCENTS[row.accent];
  const w = row.n * SCALE;
  return (
    <g>
      <text
        x={BAR_X - 16}
        y={y + BAR_H / 2 + 5}
        textAnchor="end"
        className="fill-foreground font-heading font-semibold"
        style={{ fontSize: 15 }}
      >
        {row.label}
      </text>
      <rect
        x={BAR_X}
        y={y}
        width={w}
        height={BAR_H}
        rx={5}
        className={`${a.softFill} ${a.stroke}`}
        strokeWidth={1.25}
        strokeDasharray={row.dashed ? "5 4" : undefined}
      />
      <text
        x={BAR_X + w + 10}
        y={y + BAR_H / 2 + 6}
        className={`${a.text} font-heading font-bold`}
        style={{ fontSize: 17 }}
      >
        {row.n}
      </text>
    </g>
  );
}

/**
 * The ledger as a bar chart on its own two scales. All four Criticals came
 * from code-review seats (task and final reviews); all nine Highs came from
 * the security reviews. The Critical bar is split: two attacker paths (solid)
 * and two install failures (dashed).
 */
export function ReviewLedgerDiagram({ caption }: DiagramProps) {
  const codeRows: LedgerRow[] = [
    { label: "Critical", n: 4, accent: "red" },
    { label: "Important", n: 31, accent: "violet" },
    { label: "minor", n: 15, accent: "muted" },
  ];
  const securityRows: LedgerRow[] = [
    { label: "High", n: 9, accent: "amber" },
    { label: "Medium", n: 9, accent: "cyan" },
    { label: "Low", n: 53, accent: "muted" },
  ];
  const obsRows: LedgerRow[] = [
    { label: "No severity", n: 18, accent: "muted", dashed: true },
  ];
  const codeY = [100, 140, 180];
  const secY = [250, 290, 330];
  const obsY = [394];
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The ledger, 139 entries on two severity scales plus observations. Of the four Criticals, two are attacker paths and two are install failures."
      }
    >
      <EditorialFrame
        id="itm4"
        w={900}
        h={486}
        eyebrow="The Review Ledger"
        chips={[
          { label: "139 entries", accent: "primary" },
          { label: "two scales", accent: "muted" },
        ]}
        footerRight="Highest severity per finder · counts"
      >
        <line x1={BAR_X} y1={96} x2={BAR_X} y2={424} className="stroke-border" strokeWidth="1" />

        {/* Code review scale (task and final reviews) */}
        <SectionLabel x={24} y={86} label="Code review scale" accent="violet" />
        <rect
          x={BAR_X}
          y={codeY[0]}
          width={2 * SCALE - 2}
          height={BAR_H}
          rx={5}
          className="fill-red-500/10 stroke-red-500"
          strokeWidth={1.25}
        />
        <rect
          x={BAR_X + 2 * SCALE}
          y={codeY[0]}
          width={2 * SCALE}
          height={BAR_H}
          rx={5}
          className="fill-red-500/[0.04] stroke-red-500"
          strokeWidth={1.25}
          strokeDasharray="4 3"
        />
        {codeRows.map((row, i) =>
          i === 0 ? (
            <g key={row.label}>
              <text
                x={BAR_X - 16}
                y={codeY[0] + BAR_H / 2 + 5}
                textAnchor="end"
                className="fill-foreground font-heading font-semibold"
                style={{ fontSize: 15 }}
              >
                {row.label}
              </text>
              <text
                x={BAR_X + row.n * SCALE + 10}
                y={codeY[0] + BAR_H / 2 + 6}
                className="fill-destructive font-heading font-bold"
                style={{ fontSize: 17 }}
              >
                {row.n}
              </text>
            </g>
          ) : (
            <LedgerBar key={row.label} row={row} y={codeY[i]} />
          )
        )}

        {/* Security review scale */}
        <SectionLabel x={24} y={236} label="Security review scale" accent="amber" />
        {securityRows.map((row, i) => (
          <LedgerBar key={row.label} row={row} y={secY[i]} />
        ))}

        {/* Observations */}
        <SectionLabel x={24} y={380} label="Observations" accent="muted" />
        {obsRows.map((row, i) => (
          <LedgerBar key={row.label} row={row} y={obsY[i]} />
        ))}

        {/* Critical callout */}
        <FlowLine id="itm4" d="M262,114 L702,114" accent="red" dashed />
        <NodePanel
          x={704}
          y={92}
          w={172}
          h={136}
          accent="red"
          emphasis
          title="4 Criticals"
          sub={["2 attacker paths", "(bypass, injection)", "2 install failures", "(dashed bars)"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Total */}
        <NodePanel
          x={704}
          y={330}
          w={172}
          h={112}
          accent="muted"
          title="139 entries"
          sub={["spike notes and", "accepted residuals", "included"]}
          titleSize={18}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}
