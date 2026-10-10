/** "Cann-Cann 2.0: We Have Multiplayer": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  StepBadge,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * Online lockstep: two browsers send only their own actions through the
 * WAF to the API, where a referee rebuilds the match from the stored
 * action log and appends with a sequence check. Clients poll for the
 * new actions. The Neon column is fenced by the least-privilege role.
 */
export function CannOnlineLockstepDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Each browser sends only its own actions. The server referee rebuilds the match from the stored log with the same deterministic engine, appends with a sequence check (a stale sequence gets a 409), and clients poll for what they missed."
      }
    >
      <EditorialFrame
        id="cann2a"
        w={920}
        h={490}
        eyebrow="Online Lockstep, End to End"
        chips={[
          { label: "lockstep", accent: "cyan" },
          { label: "hashed tokens", accent: "emerald" },
        ]}
        footerRight="Browsers · WAF · Referee · Neon"
      >
        {/* Two browsers */}
        <NodePanel
          x={44}
          y={80}
          w={140}
          h={130}
          accent="cyan"
          title="Player A"
          sub={["own actions only", "replays the log"]}
          titleSize={17}
          subSize={12.5}
          terminal
        />
        <NodePanel
          x={44}
          y={242}
          w={140}
          h={130}
          accent="cyan"
          title="Player B"
          sub={["own actions only", "replays the log"]}
          titleSize={17}
          subSize={12.5}
          terminal
        />

        {/* Fan-in bus to the WAF */}
        <FlowLine id="cann2a" d="M184,145 L204,145" accent="cyan" arrow={false} />
        <FlowLine id="cann2a" d="M184,307 L204,307" accent="cyan" arrow={false} />
        <path d="M204,145 L204,307" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        <FlowLine id="cann2a" d="M204,226 L230,226" accent="cyan" />

        {/* WAF */}
        <NodePanel
          x={230}
          y={146}
          w={116}
          h={160}
          accent="amber"
          emphasis
          title="Vercel WAF"
          sub={["/api/v2/", "300 req", "per 60 s", "per IP"]}
          titleSize={16}
          subSize={12.5}
        />
        <FlowLine id="cann2a" d="M346,226 L372,226" accent="amber" />

        {/* Referee */}
        <NodePanel
          x={372}
          y={116}
          w={226}
          h={220}
          accent="violet"
          emphasis
          align="left"
          title="Next.js API referee"
          sub={[
            "rebuild from the log",
            "same engine as clients",
            "reject illegal moves",
            "append at sequence N",
          ]}
          titleSize={17}
          subSize={13}
        >
          <Chip x={386} y={130} label="~40 ms / 200 actions" accent="violet" filled fontSize={10.5} />
          <Chip x={386} y={302} label="409 on stale sequence" accent="red" filled fontSize={10.5} />
        </NodePanel>

        {/* Fan-out bus to the tables */}
        <path d="M598,226 L618,226" fill="none" className="stroke-violet-500/50" strokeWidth="1.5" />
        <path d="M618,138 L618,314" fill="none" className="stroke-violet-500/50" strokeWidth="1.5" />
        <FlowLine id="cann2a" d="M618,138 L646,138" accent="violet" />
        <FlowLine id="cann2a" d="M618,226 L646,226" accent="violet" />
        <FlowLine id="cann2a" d="M618,314 L646,314" accent="violet" />

        {/* Neon fence */}
        <rect
          x={632}
          y={80}
          width={264}
          height={292}
          rx={12}
          className="stroke-emerald-500/50"
          strokeWidth="1.5"
          strokeDasharray="6 4"
          fill="none"
        />
        <Chip x={654} y={69} label="role: cann_online" accent="emerald" filled fontSize={10.5} />
        <NodePanel
          x={646}
          y={100}
          w={236}
          h={76}
          accent="primary"
          title="cann_games_v2"
          sub={["one row per match", "tokens: SHA-256 only"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={646}
          y={188}
          w={236}
          h={76}
          accent="primary"
          emphasis
          title="cann_actions_v2"
          sub={["ordered action log", "append-only, key = seq"]}
          titleSize={16}
          subSize={12.5}
        />
        <NodePanel
          x={646}
          y={276}
          w={236}
          h={76}
          accent="primary"
          title="cann_rate_limits_v2"
          sub={["per-IP limiter windows", "HMAC-hashed IPs"]}
          titleSize={16}
          subSize={12.5}
        />

        {/* Poll return rail */}
        <path
          d="M485,336 L485,392 Q485,408 469,408 L38,408 Q22,408 22,392 L22,145"
          fill="none"
          className="stroke-cyan-500/50"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <FlowLine id="cann2a" d="M22,145 L44,145" accent="cyan" dashed />
        <FlowLine id="cann2a" d="M22,307 L44,307" accent="cyan" dashed />
        <Chip x={150} y={397} label="clients poll for new actions" accent="cyan" fontSize={11} />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

const SHOT_INPUTS: { title: string; sub: string }[] = [
  { title: "Angle", sub: "launch direction" },
  { title: "Power", sub: "about 9 px per point" },
  { title: "Weapon", sub: "same flight model" },
  { title: "Wind", sub: "3.75 px/s^2 per unit" },
  { title: "Terrain", sub: "deterministic heightmap" },
];

const SHOT_READERS: { title: string; sub: string }[] = [
  { title: "Aim guide", sub: "short guide + ghost of last shot" },
  { title: "Live playback", sub: "plays the result in real time" },
  { title: "AI", sub: "ranges in like a player" },
  { title: "Replays", sub: "re-simulated from the action log" },
  { title: "Online referee", sub: "rebuilds the match on the server" },
];

/**
 * Simulate once, play it back: five inputs fan into one deterministic
 * 120 Hz simulation, whose single result fans out to every reader.
 */
export function CannSimulateThenPlayDiagram({ caption }: DiagramProps) {
  const rowY = (i: number) => 84 + i * 64;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "When you press fire the game simulates the whole shot once at a fixed 120 Hz, then everything else reads that one result: the aim guide, the playback, the AI, replays, and the online referee."
      }
    >
      <EditorialFrame
        id="cann2b"
        w={880}
        h={462}
        eyebrow="Simulate Once, Play It Back"
        chips={[
          { label: "120 Hz", accent: "violet" },
          { label: "1 result, 5 readers", accent: "cyan" },
        ]}
        footerRight="Inputs · simulation · readers"
      >
        {/* Inputs */}
        {SHOT_INPUTS.map((inp, i) => (
          <NodePanel
            key={inp.title}
            x={24}
            y={rowY(i)}
            w={176}
            h={54}
            title={inp.title}
            sub={[inp.sub]}
            titleSize={16}
            subSize={12}
          />
        ))}

        {/* Fan-in */}
        {SHOT_INPUTS.map((inp, i) => (
          <FlowLine
            key={inp.title}
            id="cann2b"
            d={`M200,${rowY(i) + 27} L222,${rowY(i) + 27}`}
            accent="muted"
            arrow={false}
          />
        ))}
        <path d="M222,111 L222,367" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="cann2b" d="M222,239 L248,239" accent="violet" />

        {/* The one simulation */}
        <NodePanel
          x={248}
          y={114}
          w={212}
          h={250}
          accent="violet"
          emphasis
          title="One simulation"
          sub={["fixed 120 Hz step", "swept collision", "own sin, cos, exp", "gravity 300 px/s^2"]}
          titleSize={18}
          subSize={13}
        >
          <Chip x={314} y={128} label="runs once" accent="violet" filled fontSize={11} />
          <Chip x={304} y={326} label="at fire time" accent="violet" filled fontSize={11} />
        </NodePanel>

        {/* Fan-out */}
        <FlowLine id="cann2b" d="M460,239 L486,239" accent="cyan" arrow={false} />
        <path d="M486,111 L486,367" fill="none" className="stroke-cyan-500/50" strokeWidth="1.5" />
        {SHOT_READERS.map((r, i) => (
          <FlowLine
            key={r.title}
            id="cann2b"
            d={`M486,${rowY(i) + 27} L520,${rowY(i) + 27}`}
            accent="cyan"
          />
        ))}

        {/* Readers */}
        {SHOT_READERS.map((r, i) => (
          <NodePanel
            key={r.title}
            x={520}
            y={rowY(i)}
            w={336}
            h={54}
            accent="cyan"
            emphasis={r.title === "Online referee"}
            align="left"
            title={r.title}
            sub={[r.sub]}
            titleSize={16}
            subSize={12.5}
          />
        ))}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

const WAVES: {
  n: number;
  title: string;
  sub: [string, string];
  chip?: string;
}[] = [
  { n: 1, title: "The contract", sub: ["math, constants, roster", "shot types, written first"], chip: "first" },
  { n: 2, title: "Parallel engine pieces", sub: ["agents in git worktrees", "strict file lists"], chip: "parallel" },
  { n: 3, title: "Rules and AI", sub: ["match rules", "an AI that ranges in"] },
  { n: 4, title: "Integration and polish", sub: ["wire it all together", "tune how it feels"] },
  { n: 5, title: "New mechanics", sub: ["weapon draft, shop", "driving, parachute crates"] },
  { n: 6, title: "Online and reviews", sub: ["lockstep multiplayer", "code and security reviews"] },
];

/**
 * The six build waves as a 3x2 grid with a carriage-return connector
 * between rows, closed by the rule every wave obeyed.
 */
export function CannSixBuildWavesDiagram({ caption }: DiagramProps) {
  const colX = (c: number) => 28 + c * 300;
  const rowTop = (r: number) => 84 + r * 160;
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Six waves, about 25 agent runs plus reviewers. Each wave was merged, tested, and reviewed before the next one started."
      }
    >
      <EditorialFrame
        id="cann2c"
        w={920}
        h={500}
        eyebrow="Six Waves of Agents"
        chips={[
          { label: "6 waves", accent: "primary" },
          { label: "~25 agent runs", accent: "violet" },
        ]}
        footerRight="Contract first · then fan out"
      >
        {WAVES.map((wave, i) => {
          const c = i % 3;
          const r = Math.floor(i / 3);
          const x = colX(c);
          const y = rowTop(r);
          const accent = wave.n === 1 ? "violet" : wave.n === 6 ? "cyan" : "muted";
          return (
            <NodePanel
              key={wave.n}
              x={x}
              y={y}
              w={264}
              h={120}
              accent={accent}
              emphasis={wave.n === 1}
              title={wave.title}
              sub={wave.sub}
              titleSize={17}
              subSize={12.5}
            >
              <StepBadge cx={x + 26} cy={y + 26} n={wave.n} accent={accent === "muted" ? "primary" : accent} />
              {wave.chip && (
                <Chip
                  x={x + 264 - 12}
                  y={y + 8}
                  label={wave.chip}
                  accent={wave.n === 1 ? "violet" : "amber"}
                  filled
                  fontSize={10.5}
                  anchor="end"
                />
              )}
            </NodePanel>
          );
        })}

        {/* Row 1 horizontal links */}
        <FlowLine id="cann2c" d={`M${colX(0) + 264},144 L${colX(1)},144`} accent="muted" />
        <FlowLine id="cann2c" d={`M${colX(1) + 264},144 L${colX(2)},144`} accent="muted" />
        {/* Row 2 horizontal links */}
        <FlowLine id="cann2c" d={`M${colX(0) + 264},304 L${colX(1)},304`} accent="muted" />
        <FlowLine id="cann2c" d={`M${colX(1) + 264},304 L${colX(2)},304`} accent="muted" />
        {/* Carriage return: wave 3 down, across, down into wave 4 */}
        <path
          d={`M${colX(2) + 132},204 L${colX(2) + 132},216 Q${colX(2) + 132},224 ${colX(2) + 124},224 L${colX(0) + 140},224 Q${colX(0) + 132},224 ${colX(0) + 132},232 L${colX(0) + 132},244`}
          fill="none"
          className="stroke-foreground/25"
          strokeWidth="1.5"
          markerEnd="url(#cann2c-arrow-muted)"
        />

        {/* The rule every wave obeyed */}
        <NodePanel
          x={28}
          y={392}
          w={864}
          h={58}
          accent="emerald"
          emphasis
          align="left"
          title="Between every wave"
          sub={["merged, tested, and reviewed before the next one started"]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={876} y={410} label="boring merges" accent="emerald" filled fontSize={11} anchor="end" />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}
