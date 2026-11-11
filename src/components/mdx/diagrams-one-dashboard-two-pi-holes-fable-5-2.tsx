/** One Dashboard for Two Pi-holes blog post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  StepBadge,
  monoWidth,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * Browser to one Fastify server (one API session per Pi, SQLite for layout,
 * history and samples) to both Pi-holes over API and a fixed SSH list. A
 * parallel practice-copy lane runs the same build against fake stand-ins.
 */
export function OneDashboardArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The browser only ever talks to the dashboard server. The server holds one API session per Pi-hole and a fixed list of SSH commands. The practice copy runs the same build against two fake Pi-holes and a fake ssh, so every write could be tested without touching the house."
      }
    >
      <EditorialFrame
        id="odp1"
        w={880}
        h={512}
        eyebrow="One Server, Two Pi-holes"
        chips={[
          { label: "1 Node process", accent: "primary" },
          { label: "No browser secrets", accent: "emerald" },
        ]}
        footerRight="Browser · Fastify · Pi-hole API + SSH"
      >
        {/* Live lane */}
        <SectionLabel x={24} y={92} label="Live path" accent="cyan" />
        <Chip x={856} y={76} label="Read-only build" accent="emerald" anchor="end" fontSize={11} />

        <NodePanel
          x={24}
          y={176}
          w={160}
          h={110}
          title="Browser"
          titleSize={17}
          sub={["React app", "no Pi-hole secrets"]}
          subSize={12.5}
        />
        <FlowLine id="odp1" d="M184,231 L240,231" accent="cyan" />

        <NodePanel
          x={240}
          y={112}
          w={300}
          h={160}
          accent="primary"
          emphasis
          terminal
          title="Fastify server"
          titleSize={18}
          sub={["one API session per Pi", "fixed SSH command list", "sign-in guard on /api"]}
          subSize={12.5}
        />
        <NodePanel
          x={240}
          y={290}
          w={300}
          h={64}
          accent="violet"
          title="SQLite file"
          titleSize={17}
          sub={["layout · history · 30-day samples"]}
          subSize={12.5}
        />
        <FlowLine id="odp1" d="M390,272 L390,290" accent="violet" />

        {/* Server -> Pi bus */}
        <FlowLine id="odp1" d="M540,231 L600,231" accent="cyan" arrow={false} />
        <path d="M600,170 L600,292" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id="odp1" d="M600,170 L660,170" accent="cyan" />
        <FlowLine id="odp1" d="M600,292 L660,292" accent="cyan" />

        <NodePanel
          x={660}
          y={120}
          w={196}
          h={100}
          accent="cyan"
          title="PiHoleMain"
          titleSize={17}
          sub={["Raspberry Pi 5", "API + fixed SSH list"]}
          subSize={12.5}
        />
        <NodePanel
          x={660}
          y={242}
          w={196}
          h={100}
          accent="cyan"
          title="PiHoleBackup"
          titleSize={17}
          sub={["Raspberry Pi 3B+", "API + fixed SSH list"]}
          subSize={12.5}
        />

        {/* Divider */}
        <line x1={24} y1={376} x2={856} y2={376} className="stroke-foreground/20" strokeWidth="1" strokeDasharray="5 4" />

        {/* Practice lane */}
        <SectionLabel x={24} y={400} label="Practice copy" accent="amber" />
        <Chip x={856} y={384} label="All writes ran here" accent="amber" anchor="end" fontSize={11} />
        <NodePanel
          x={24}
          y={414}
          w={160}
          h={52}
          accent="amber"
          variant="dashed"
          title="Tests"
          titleSize={17}
          sub={["Vitest · Playwright"]}
          subSize={12.5}
        />
        <FlowLine id="odp1" d="M184,440 L240,440" accent="amber" />
        <NodePanel
          x={240}
          y={414}
          w={300}
          h={52}
          accent="amber"
          variant="dashed"
          title="Same dashboard build"
          titleSize={17}
          sub={["fake-stack.ts, refuses real data"]}
          subSize={12.5}
        />
        <FlowLine id="odp1" d="M540,440 L660,440" accent="amber" />
        <NodePanel
          x={660}
          y={414}
          w={196}
          h={52}
          accent="amber"
          variant="dashed"
          title="Fake stack"
          titleSize={17}
          sub={["2 Pi-holes + fake ssh"]}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Before: the guard read the raw address, the router matched the decoded
 * one, so /%61pi/status skipped sign-in. After: the guard sits on the /api
 * scope and decides from the matched route.
 */
export function OneDashboardSignInBypassDiagram({ caption }: DiagramProps) {
  const testChips = ["encoded", "HEAD", "look-alike"];
  const chipFont = 11;
  const placed = testChips
    .slice()
    .reverse()
    .map((label, idx, arr) => ({
      label,
      x:
        840 -
        arr
          .slice(0, idx)
          .reduce((sum, l) => sum + monoWidth(l, chipFont) + 18 + 10, 0),
    }));
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Before the fix, the guard looked at the raw address text while the router matched the decoded one, so /%61pi/status never met the sign-in. After the fix the router runs first, and the guard on the /api scope decides from the matched route."
      }
    >
      <EditorialFrame
        id="odp2"
        w={880}
        h={518}
        eyebrow="The Sign-In That Read the Wrong Address"
        chips={[
          { label: "%61 = a", accent: "amber" },
          { label: "Found in review", accent: "cyan" },
        ]}
        footerRight="Guard · Router · /api scope"
      >
        {/* BEFORE */}
        <SectionLabel x={24} y={86} label="Before" accent="red" />
        <NodePanel
          x={24}
          y={102}
          w={160}
          h={96}
          title="Request"
          titleSize={17}
          sub={["/%61pi/status"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M184,150 L230,150" accent="red" />
        <NodePanel
          x={230}
          y={102}
          w={220}
          h={96}
          accent="red"
          emphasis
          title="Guard"
          titleSize={18}
          sub={["reads the raw text", "no /api prefix: waved on"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M450,150 L490,150" accent="red" />
        <NodePanel
          x={490}
          y={102}
          w={190}
          h={96}
          title="Router"
          titleSize={17}
          sub={["decodes the address", "matches /api/status"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M680,150 L720,150" accent="red" />
        <NodePanel
          x={720}
          y={102}
          w={136}
          h={96}
          title="Handler"
          titleSize={17}
          sub={["/api/status", "served"]}
          subSize={12.5}
        />
        <Chip x={230} y={208} label="Skips 3 checks" accent="red" filled fontSize={11} />
        <Chip x={856} y={208} label="Unguarded" accent="red" filled anchor="end" fontSize={11} />

        <line x1={24} y1={246} x2={856} y2={246} className="stroke-foreground/20" strokeWidth="1" strokeDasharray="5 4" />

        {/* AFTER */}
        <SectionLabel x={24} y={272} label="After" accent="emerald" />
        <NodePanel
          x={24}
          y={288}
          w={160}
          h={96}
          title="Request"
          titleSize={17}
          sub={["/%61pi/status"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M184,336 L230,336" accent="emerald" />
        <NodePanel
          x={230}
          y={288}
          w={220}
          h={96}
          title="Router"
          titleSize={17}
          sub={["decodes the address", "matches the /api scope"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M450,336 L490,336" accent="emerald" />
        <NodePanel
          x={490}
          y={288}
          w={190}
          h={96}
          accent="emerald"
          emphasis
          title="Guard on /api"
          titleSize={18}
          sub={["decides from the", "matched route"]}
          subSize={12.5}
        />
        <FlowLine id="odp2" d="M680,336 L720,336" accent="emerald" />
        <NodePanel
          x={720}
          y={288}
          w={136}
          h={96}
          title="Handler"
          titleSize={17}
          sub={["/api/status", "after sign-in"]}
          subSize={12.5}
        />
        <Chip x={490} y={394} label="Route, not text" accent="emerald" filled fontSize={11} />
        <Chip x={856} y={394} label="Guarded" accent="emerald" filled anchor="end" fontSize={11} />

        {/* Regression tests */}
        <NodePanel
          x={24}
          y={434}
          w={832}
          h={40}
          accent="cyan"
          variant="dashed"
          align="left"
          title="Regression tests"
          titleSize={17}
          subSize={12.5}
        />
        {placed.map((c) => (
          <Chip key={c.label} x={c.x} y={443} label={c.label} accent="cyan" anchor="end" fontSize={chipFont} />
        ))}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * The canUpdate decision chain (four refusals, one pass), then the order
 * and proofs of the update itself: backup first, partner verified, lock
 * file per Pi, reboot proven by a changed boot id.
 */
export function OneDashboardUpdateGateDiagram({ caption }: DiagramProps) {
  const gateX = [24, 238, 452, 666];
  const gates = [
    { title: "Update running?", sub: ["one at a time,", "wait for it to end"] },
    { title: "Other Pi down?", sub: ["API not answering,", "could leave no DNS"] },
    { title: "Other Pi warming?", sub: ["still starting up,", "not blocking yet"] },
    { title: "Backup unhealthy?", sub: ["PiHoleMain only:", "backup failed checks"] },
  ];
  const steps = [
    { title: "Backup first", sub: ["then PiHoleMain,", "after backup checks"] },
    { title: "Partner verified", sub: ["verify-pi.sh must", "pass on the other Pi"] },
    { title: "Lock file held", sub: ["flock on each Pi,", "exit 75 if held"] },
    { title: "Reboot proven", sub: ["boot id read first,", "must change after"] },
  ];
  const corridorY = 240;
  const dropX = 190;
  const passPath = `M761,200 L761,${corridorY - 8} Q761,${corridorY} 753,${corridorY} L${dropX + 8},${corridorY} Q${dropX},${corridorY} ${dropX},${corridorY + 8} L${dropX},284`;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Any yes in the canUpdate chain refuses the update with a reason in plain words. When all four clear, the update runs in a fixed order: PiHoleBackup first, the other Pi verified, a lock file held on each Pi, and a reboot counted only when the boot id has changed."
      }
    >
      <EditorialFrame
        id="odp3"
        w={880}
        h={492}
        eyebrow="Keep One Pi-hole Answering"
        chips={[
          { label: "canUpdate()", accent: "amber" },
          { label: "flock + boot id", accent: "violet" },
        ]}
        footerRight="Gate · order · lock · reboot proof"
      >
        {/* Gate row */}
        <SectionLabel x={24} y={78} label="The gate" accent="amber" />
        <Chip x={856} y={62} label="Any yes: refused" accent="red" filled anchor="end" fontSize={11} />
        {gates.map((g, i) => (
          <g key={g.title}>
            <NodePanel
              x={gateX[i]}
              y={104}
              w={190}
              h={96}
              accent="muted"
              title={g.title}
              titleSize={17}
              sub={g.sub}
              subSize={12.5}
            />
            <StepBadge cx={gateX[i] + 22} cy={104} n={i + 1} accent="amber" />
            {i < 3 && (
              <FlowLine id="odp3" d={`M${gateX[i] + 190},152 L${gateX[i + 1]},152`} accent="muted" />
            )}
          </g>
        ))}

        {/* All clear corridor */}
        <FlowLine id="odp3" d={passPath} accent="emerald" width={2} />
        <Chip x={470} y={210} label="All four clear" accent="emerald" filled fontSize={11} />

        {/* Update row */}
        <SectionLabel x={24} y={262} label="The update" accent="violet" />
        <Chip x={856} y={246} label="One Pi at a time" accent="violet" anchor="end" fontSize={11} />
        {steps.map((s, i) => (
          <g key={s.title}>
            <NodePanel
              x={gateX[i]}
              y={284}
              w={190}
              h={100}
              accent={i === 0 ? "violet" : "muted"}
              emphasis={i === 0}
              title={s.title}
              titleSize={17}
              sub={s.sub}
              subSize={12.5}
            />
            <StepBadge cx={gateX[i] + 22} cy={284} n={i + 5} accent="violet" />
            {i < 3 && (
              <FlowLine id="odp3" d={`M${gateX[i] + 190},334 L${gateX[i + 1]},334`} accent="muted" />
            )}
          </g>
        ))}

        {/* Result band */}
        <NodePanel
          x={24}
          y={402}
          w={832}
          h={46}
          accent="emerald"
          emphasis
          align="left"
          title="One Pi-hole is always answering"
          titleSize={17}
          subSize={12.5}
        />
        <Chip x={840} y={414} label="Backup first, then main" accent="emerald" filled anchor="end" fontSize={11} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Two ways to combine the same real figures: averaging the two percentages
 * (about 21.5%) versus summing counts and dividing last (35.75%).
 */
export function OneDashboardCombinedDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "The same two Pi-holes, combined two ways. Averaging 38.6% and 4.4% gives about 21.5%, which understates blocking by roughly 14 points. Summing the counts first and dividing last gives 35.75%, which is what Combined shows."
      }
    >
      <EditorialFrame
        id="odp4"
        w={880}
        h={500}
        eyebrow="Combined Is Not an Average"
        chips={[
          { label: "Real figures", accent: "cyan" },
          { label: "Sum, then divide", accent: "emerald" },
        ]}
        footerRight="PiHoleMain + PiHoleBackup · 24 hours"
      >
        {/* Inputs */}
        <NodePanel
          x={140}
          y={74}
          w={280}
          h={88}
          accent="cyan"
          title="PiHoleMain"
          titleSize={17}
          sub={["383,882 queries", "148,215 blocked · 38.6%"]}
          subSize={12.5}
        />
        <NodePanel
          x={460}
          y={74}
          w={280}
          h={88}
          accent="cyan"
          title="PiHoleBackup"
          titleSize={17}
          sub={["34,961 queries", "1,521 blocked · 4.4%"]}
          subSize={12.5}
        />

        {/* Fan-in bus, then fork */}
        <FlowLine id="odp4" d="M280,162 L280,186" accent="cyan" arrow={false} />
        <FlowLine id="odp4" d="M600,162 L600,186" accent="cyan" arrow={false} />
        <FlowLine id="odp4" d="M280,186 L600,186" accent="cyan" arrow={false} />
        <FlowLine id="odp4" d="M440,186 L440,206" accent="cyan" arrow={false} />
        <FlowLine id="odp4" d="M220,206 L660,206" accent="muted" arrow={false} />
        <FlowLine id="odp4" d="M220,206 L220,234" accent="red" />
        <FlowLine id="odp4" d="M660,206 L660,234" accent="emerald" />

        {/* Methods */}
        <NodePanel
          x={24}
          y={236}
          w={392}
          h={108}
          accent="red"
          variant="dashed"
          title="Average the percentages"
          titleSize={18}
          sub={["(38.6% + 4.4%) / 2", "treats both Pis as equals"]}
          subSize={13.5}
        />
        <NodePanel
          x={464}
          y={236}
          w={392}
          h={108}
          accent="emerald"
          emphasis
          title="Sum first, divide last"
          titleSize={18}
          sub={["149,736 blocked / 418,843 queries", "what combineSummary does"]}
          subSize={13.5}
        />

        {/* Results */}
        <FlowLine id="odp4" d="M220,344 L220,376" accent="red" />
        <FlowLine id="odp4" d="M660,344 L660,376" accent="emerald" />
        <NodePanel
          x={24}
          y={378}
          w={392}
          h={80}
          accent="red"
          title="about 21.5%"
          titleSize={30}
          sub={["wrong: roughly 14 points low"]}
          subSize={12.5}
        />
        <NodePanel
          x={464}
          y={378}
          w={392}
          h={80}
          accent="emerald"
          emphasis
          title="35.75%"
          titleSize={30}
          sub={["what Combined shows"]}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}
