/**
 * "Local AI, Zero Trust" post diagrams, part 0: the framing diagrams, the
 * lessons-to-controls map and the trust-boundary map. Editorial SVG built
 * on the shared primitives. Labels stay generic: no catalog service name.
 */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  StepBadge,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/** Sub-line y for the centered text block NodePanel draws (matches its math). */
function subLineY(
  panelY: number,
  panelH: number,
  subCount: number,
  index: number,
  titleSize = 17,
  subSize = 12.5
): number {
  const gap = subSize + 4;
  const block = titleSize + 6 + subCount * gap;
  const ty = panelY + (panelH - block) / 2 + titleSize;
  return ty + gap + 2 + index * gap;
}

/**
 * The four AI1 lessons on the left, each linked by a straight arrow to the
 * group of CryptoFlix controls that implements it.
 */
export function LocalAiLessonsToControlsDiagram({ caption }: DiagramProps) {
  const rows = [
    {
      lesson: "Data vs. instructions",
      lessonSub: "code enforces the line",
      control: "Clean, delimit, check the answer",
      subs: [
        "cleanCueText and fixed delimiters; tools switched off",
        "answers must match a schema; quote search takes 12 tokens",
      ],
    },
    {
      lesson: "Authorization",
      lessonSub: "lives outside the model",
      control: "Rules in code, not in the prompt",
      subs: [
        "select.ts returns only units before your position",
        "routeTable.test.ts lists every family-reachable route",
      ],
    },
    {
      lesson: "Model supply chain",
      lessonSub: "a checksum is not a verdict",
      control: "Pin, verify, then sandbox anyway",
      subs: [
        "SHA-256 and size pins, re-checked before every spawn",
        "only the install script downloads anything",
      ],
    },
    {
      lesson: "Corpus is a boundary",
      lessonSub: "what the model can retrieve",
      control: "Public text in, no user data out",
      subs: [
        "vectors come from catalog text; no user_id column",
        "a test proves the taste tables stay byte for byte unchanged",
      ],
    },
  ] as const;

  return (
    <DiagramLightbox
      caption={
        caption ??
        "The four lessons from the AI security training, each tied to the CryptoFlix controls that put it into practice."
      }
    >
      <EditorialFrame
        id="slai1"
        w={920}
        h={500}
        eyebrow="From Four Lessons to Four Control Groups"
        chips={[
          { label: "4 lessons", accent: "primary" },
          { label: "4 control groups", accent: "emerald" },
        ]}
        footerRight="Training · design checklist · code"
      >
        <SectionLabel x={56} y={86} label="AI1 lesson" accent="primary" />
        <SectionLabel x={356} y={86} label="CryptoFlix control" accent="emerald" />
        {rows.map((row, i) => {
          const y = 104 + i * 92;
          const cy = y + 38;
          return (
            <g key={row.lesson}>
              <StepBadge cx={30} cy={cy} n={i + 1} accent="primary" />
              <NodePanel
                x={56}
                y={y}
                w={260}
                h={76}
                title={row.lesson}
                sub={[row.lessonSub]}
                align="left"
                titleSize={17}
                subSize={12.5}
              />
              <FlowLine id="slai1" d={`M316,${cy} L352,${cy}`} accent="emerald" width={2} />
              <NodePanel
                x={356}
                y={y}
                w={540}
                h={76}
                accent="emerald"
                title={row.control}
                sub={[...row.subs]}
                align="left"
                titleSize={17}
                subSize={12.5}
              />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

type LegState = "present" | "limited" | "removed";

const LEG_DOT: Record<LegState, string> = {
  present: "fill-red-500",
  limited: "fill-amber-500",
  removed: "fill-emerald-500",
};

/**
 * Trust-boundary map. Every component is tagged with the three legs of
 * the lethal trifecta; each is missing at least one.
 */
export function LocalAiTrustBoundaryDiagram({ caption }: DiagramProps) {
  const comps: {
    name: string;
    role: string;
    legs: [LegState, LegState, LegState];
  }[] = [
    { name: "cf-whisper", role: "speech VAD", legs: ["present", "removed", "removed"] },
    { name: "cf-vision", role: "face match", legs: ["present", "removed", "removed"] },
    { name: "Ollama", role: "embeddings", legs: ["present", "removed", "limited"] },
    { name: "Claude CLI", role: "recap writer", legs: ["present", "removed", "present"] },
  ];
  const legLabels = ["untrusted", "private data", "network"] as const;
  const panelY = 254;
  const panelH = 150;
  const panelW = 141;

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Who holds which cards. The server holds the secrets and never runs a model itself. Each model component is missing at least one leg of the trifecta: private data, untrusted content, or a way out."
      }
    >
      <EditorialFrame
        id="slai6"
        w={920}
        h={496}
        eyebrow="Trust Boundaries Around the Models"
        chips={[
          { label: "break the trifecta", accent: "amber" },
          { label: "1 way out", accent: "red" },
        ]}
        footerRight="Server · sandboxes · loopback · one outbound path"
      >
        <rect
          x={20}
          y={72}
          width={644}
          height={352}
          rx={14}
          className="stroke-foreground/30"
          strokeWidth="1.5"
          strokeDasharray="7 5"
          fill="none"
        />
        <SectionLabel x={36} y={96} label="Mac host" accent="muted" />

        <NodePanel
          x={40}
          y={112}
          w={604}
          h={84}
          accent="amber"
          emphasis
          align="left"
          title="Fastify server"
          sub={[
            "holds the data key, session secret and SMB passwords",
            "admin-only routes, validation, rate limits, every pin check",
          ]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Server -> components bus */}
        <path d="M342,196 L342,226" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M110,226 L570,226" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        {comps.map((c, i) => {
          const x = 40 + i * (panelW + 12);
          const cx = x + panelW / 2;
          return (
            <g key={c.name}>
              <FlowLine id="slai6" d={`M${cx},226 L${cx},${panelY}`} accent="muted" />
              <NodePanel
                x={x}
                y={panelY}
                w={panelW}
                h={panelH}
                accent={c.name === "Claude CLI" ? "violet" : "muted"}
                title={c.name}
                sub={[c.role, ...legLabels]}
                align="left"
                titleSize={17}
                subSize={12.5}
              />
              {c.legs.map((leg, li) => (
                <circle
                  key={legLabels[li]}
                  cx={x + panelW - 18}
                  cy={subLineY(panelY, panelH, 4, li + 1) - 4.5}
                  r={5.5}
                  className={LEG_DOT[leg]}
                />
              ))}
            </g>
          );
        })}

        {/* Outside the Mac */}
        <NodePanel
          x={704}
          y={112}
          w={192}
          h={84}
          accent="cyan"
          title="Image host"
          sub={["cast photos, inbound", "one fixed host, HTTPS"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="slai6" d="M704,154 L644,154" accent="cyan" width={2} />
        <NodePanel
          x={704}
          y={279}
          w={192}
          h={100}
          accent="amber"
          emphasis
          title="Anthropic"
          sub={["subtitle lines only", "no titles or names", "the only way out"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="slai6" d="M640,329 L704,329" accent="amber" width={2} />

        {/* Legend */}
        <circle cx={246} cy={450} r={5.5} className="fill-red-500" />
        <text x={258} y={454.5} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          leg present
        </text>
        <circle cx={388} cy={450} r={5.5} className="fill-amber-500" />
        <text x={400} y={454.5} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          limited
        </text>
        <circle cx={492} cy={450} r={5.5} className="fill-emerald-500" />
        <text x={504} y={454.5} className="fill-muted-foreground font-mono" style={{ fontSize: 12.5 }}>
          leg removed
        </text>
      </EditorialFrame>
    </DiagramLightbox>
  );
}
