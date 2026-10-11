/**
 * "Local AI, Zero Trust" post diagrams, part 3: what goes in, what comes
 * out, and the spoiler rule.
 * Editorial SVG built on the shared primitives.
 */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  Chip,
  type DiagramAccent,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

interface Stage {
  title: string;
  sub: string[];
  accent: DiagramAccent;
  emphasis?: boolean;
}

/** One horizontal lane of four equal panels joined by arrows. */
function Lane({
  id,
  y,
  h,
  stages,
}: {
  id: string;
  y: number;
  h: number;
  stages: Stage[];
}) {
  return (
    <g>
      {stages.map((s, i) => {
        const x = 24 + i * 224;
        return (
          <g key={s.title}>
            <NodePanel
              x={x}
              y={y}
              w={200}
              h={h}
              accent={s.accent}
              emphasis={s.emphasis}
              title={s.title}
              sub={s.sub}
              titleSize={16}
              subSize={12.5}
            />
            {i < stages.length - 1 && (
              <FlowLine id={id} d={`M${x + 200},${y + h / 2} L${x + 224},${y + h / 2}`} accent="muted" />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * Two cleaning lanes: subtitle lines on their way into the recap prompt,
 * and typed words on their way into the full-text index.
 */
export function LocalAiInputCleaningDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Text anyone could have written is cleaned, bounded and delimited before it reaches a prompt, and typed search words are rebuilt into a safe query so no operator reaches SQLite."
      }
    >
      <EditorialFrame
        id="slai11"
        w={920}
        h={496}
        eyebrow="Cleaning What Goes In"
        chips={[
          { label: "data, not orders", accent: "amber" },
          { label: "2 lanes", accent: "primary" },
        ]}
        footerRight="Subtitle lines · typed words · fixed delimiters"
      >
        <SectionLabel x={24} y={82} label="Subtitle lines to the recap prompt" accent="amber" />
        <Lane
          id="slai11"
          y={94}
          h={110}
          stages={[
            {
              title: "Raw cue text",
              sub: ["a subtitle file is", "text anyone could", "have written"],
              accent: "red",
            },
            {
              title: "cleanCueText",
              sub: ["strips markup, < >,", "control, direction", "and hidden tag", "characters"],
              accent: "amber",
              emphasis: true,
            },
            {
              title: "Part boundary",
              sub: ["buildPartInput", "throws if a cue", "ends outside", "its part"],
              accent: "amber",
            },
            {
              title: "Delimiters",
              sub: ["cues in <subtitles>", "summaries in", "<earlier_parts>", "60,000 chars max"],
              accent: "emerald",
            },
          ]}
        />

        <SectionLabel x={24} y={246} label="Typed words to the quote index" accent="amber" />
        <Lane
          id="slai11"
          y={258}
          h={110}
          stages={[
            {
              title: "Typed words",
              sub: ["2 to 120 characters", "30 requests a", "minute"],
              accent: "red",
            },
            {
              title: "Token builder",
              sub: ["at most 12", "quoted word tokens"],
              accent: "amber",
              emphasis: true,
            },
            {
              title: "No operators",
              sub: ["no column filter,", "no NEAR reaches", "SQLite"],
              accent: "amber",
            },
            {
              title: "FTS5 match",
              sub: ["query-time budget:", "5 s a minute,", "household-wide"],
              accent: "emerald",
            },
          ]}
        />

        <NodePanel
          x={24}
          y={392}
          w={872}
          h={60}
          accent="amber"
          variant="dashed"
          align="left"
          title="Prompt prose is the weakest layer"
          sub={["the prompt does say the lines are quoted data; the strong layers are code and schema"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Three outputs, three funnels: every answer is capped, shape-checked and
 * only then treated as data.
 */
export function LocalAiOutputValidationDiagram({ caption }: DiagramProps) {
  const rows: { label: string; accent: DiagramAccent; stages: Stage[] }[] = [
    {
      label: "Local tools (cf-whisper, cf-vision)",
      accent: "violet",
      stages: [
        {
          title: "Size caps",
          sub: ["NDJSON lines bounded", "50,000 speech spans", "200,000 face lines"],
          accent: "primary",
        },
        {
          title: "zod schema",
          sub: ["whole ms, in order", "strength 1 to 3"],
          accent: "primary",
          emphasis: true,
        },
        {
          title: "Pinned first line",
          sub: ["must equal the", "pinned model key"],
          accent: "primary",
        },
        {
          title: "Rows as data",
          sub: ["spans, appearances", "stderr dropped"],
          accent: "emerald",
        },
      ],
    },
    {
      label: "Ollama embeddings",
      accent: "cyan",
      stages: [
        {
          title: "Body cap",
          sub: ["2 MB at most", "must be JSON", "3xx refused"],
          accent: "primary",
        },
        {
          title: "One per input",
          sub: ["exactly one", "embedding per text"],
          accent: "primary",
          emphasis: true,
        },
        {
          title: "768 finite numbers",
          sub: ["zero vectors", "rejected"],
          accent: "primary",
        },
        {
          title: "Vector as data",
          sub: ["errors are fixed", "codes, no body"],
          accent: "emerald",
        },
      ],
    },
    {
      label: "Recaps (Claude)",
      accent: "amber",
      stages: [
        {
          title: "256 KB cap",
          sub: ["stdout bounded,", "control characters", "stripped"],
          accent: "primary",
        },
        {
          title: "Three schemas",
          sub: ["fixed JSON schemas,", "then zod again"],
          accent: "primary",
          emphasis: true,
        },
        {
          title: "Length limits",
          sub: ["part 40 to 900", "episode 1,200", "season 1,500"],
          accent: "primary",
        },
        {
          title: "Plain React text",
          sub: ["never HTML", "labelled as written", "by Claude"],
          accent: "emerald",
        },
      ],
    },
  ];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Everything a model returns gets the same suspicion as what goes in: size caps, a schema, then storage as plain data or rendering as text, never as markup."
      }
    >
      <EditorialFrame
        id="slai12"
        w={920}
        h={536}
        eyebrow="Treating What Comes Out as Data"
        chips={[
          { label: "output is data", accent: "emerald" },
          { label: "3 funnels", accent: "primary" },
        ]}
        footerRight="Cap · schema · identity · data"
      >
        {rows.map((row, r) => {
          const base = 76 + r * 150;
          return (
            <g key={row.label}>
              <SectionLabel x={24} y={base + 4} label={row.label} accent={row.accent} />
              <Lane id="slai12" y={base + 16} h={100} stages={row.stages} />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * The spoiler guarantee: a watch-position line splits a show into units
 * that are served and units that are withheld, decided by plain code.
 */
export function LocalAiSpoilerGuaranteeDiagram({ caption }: DiagramProps) {
  const units: { n: string; sub: string; accent: DiagramAccent; dashed?: boolean }[] = [
    { n: "Part 1", sub: "served", accent: "emerald" },
    { n: "Part 2", sub: "served", accent: "emerald" },
    { n: "Part 3", sub: "waits: margin", accent: "amber", dashed: true },
    { n: "Part 4", sub: "withheld", accent: "red", dashed: true },
    { n: "Part 5", sub: "withheld", accent: "red", dashed: true },
    { n: "Part 6", sub: "withheld", accent: "red", dashed: true },
  ];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "The model is never asked to behave. A pure function hands back only recap units that end before the viewer's own position, so later text is never sent and never shown."
      }
    >
      <EditorialFrame
        id="slai13"
        w={920}
        h={460}
        eyebrow="The Spoiler Guarantee Lives in Code"
        chips={[
          { label: "pure function", accent: "primary" },
          { label: "generated tests", accent: "emerald" },
        ]}
        footerRight="Position line · served · withheld"
      >
        <SectionLabel x={24} y={82} label="A show, split into recap units" accent="primary" />
        <Chip x={403} y={90} label="watch position" accent="primary" filled fontSize={11} />

        {units.map((u, i) => (
          <NodePanel
            key={u.n}
            x={24 + i * 148}
            y={128}
            w={132}
            h={64}
            accent={u.accent}
            variant={u.dashed ? "dashed" : "solid"}
            title={u.n}
            sub={[u.sub]}
            titleSize={16}
            subSize={12.5}
          />
        ))}

        <path
          d="M460,112 L460,262"
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Brackets */}
        <path d="M24,204 L24,212 L444,212 L444,204" fill="none" className="stroke-emerald-500/60" strokeWidth="1.5" />
        <path d="M476,204 L476,212 L896,212 L896,204" fill="none" className="stroke-red-500/60" strokeWidth="1.5" />
        <text
          x={234}
          y={236}
          textAnchor="middle"
          className="fill-success font-mono font-semibold"
          style={{ fontSize: 12.5 }}
        >
          reaches the viewer and the model
        </text>
        <text
          x={686}
          y={236}
          textAnchor="middle"
          className="fill-destructive font-mono font-semibold"
          style={{ fontSize: 12.5 }}
        >
          never sent, never shown
        </text>

        <FlowLine id="slai13" d="M460,262 L460,290" accent="primary" width={2} />
        <NodePanel
          x={24}
          y={290}
          w={872}
          h={124}
          accent="primary"
          emphasis
          align="left"
          title="recap/select.ts, a pure function"
          sub={[
            "returns only units that end at or before the viewer's own position",
            "a part from a different file waits until the viewer is past its end by",
            "the larger of 5 minutes and 5% of position (60 min in: 5 min; 3 h in: 9 min)",
            "quote search hides the matched line for episodes after the viewer's next one",
          ]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip
            x={880}
            y={302}
            label="code, not the prompt"
            accent="emerald"
            filled
            anchor="end"
            fontSize={11}
          />
        </NodePanel>
      </EditorialFrame>
    </DiagramLightbox>
  );
}

