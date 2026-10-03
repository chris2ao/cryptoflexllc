/** "The Folder Name That Gave Orders": editorial SVG diagrams */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
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

type GateTag = "ENFORCED" | "REQUESTED" | "HUMAN" | "UNTRUSTED";

const TAG_ACCENT: Record<GateTag, DiagramAccent> = {
  ENFORCED: "emerald",
  REQUESTED: "amber",
  HUMAN: "primary",
  UNTRUSTED: "red",
};

interface Stage {
  title: string;
  sub: string[];
  tag: GateTag;
  accent?: DiagramAccent;
  emphasis?: boolean;
}

const COL_X = [18, 318, 618] as const;
const COL_W = 264;
const CENTER = COL_X.map((x) => x + COL_W / 2);

const ROW_ONE: Stage[] = [
  {
    title: "Folder name",
    sub: ["planted by the review agent", '"IGNORE PREVIOUS ..."'],
    tag: "UNTRUSTED",
    accent: "red",
    emphasis: true,
  },
  {
    title: "Name sanitizer",
    sub: ["strips control characters", "the probe passed verbatim"],
    tag: "ENFORCED",
  },
  {
    title: "Parser + database",
    sub: ["limits only, no judgment", "parsed.title kept as-is"],
    tag: "ENFORCED",
  },
];

/** Row two reads right to left: CLI output, the sentence, then research. */
const ROW_TWO: Stage[] = [
  {
    title: "Research by --source id",
    sub: ["title read from the database", "never crosses the shell"],
    tag: "ENFORCED",
  },
  {
    title: "Data, never instructions",
    sub: ["a sentence in the command file", "an injection can argue with it"],
    tag: "REQUESTED",
    accent: "amber",
    emphasis: true,
  },
  {
    title: "CLI output",
    sub: ["escapes control characters", "prints parsed.title to the AI"],
    tag: "ENFORCED",
  },
];

const ROW_ONE_Y = 76;
const ROW_TWO_Y = 202;
const ROW_THREE_Y = 328;
const ROW_H = 92;
const ROW_THREE_H = 116;

function StagePanel({ stage, col, y, h = ROW_H }: { stage: Stage; col: number; y: number; h?: number }) {
  const accent = stage.accent ?? "muted";
  return (
    <g>
      <NodePanel
        x={COL_X[col]}
        y={y}
        w={COL_W}
        h={h}
        accent={accent}
        emphasis={stage.emphasis}
        align="left"
        title={stage.title}
        sub={stage.sub}
        titleSize={17}
        subSize={12.5}
      />
      <Chip
        x={COL_X[col] + COL_W - 12}
        y={y - 11}
        label={stage.tag}
        accent={TAG_ACCENT[stage.tag]}
        filled
        fontSize={11}
        anchor="end"
      />
    </g>
  );
}

/**
 * The injection path from a planted folder name to `match apply`, one
 * snake of nine stages. Every stage carries a tag: ENFORCED (Claude Code
 * or code does the stopping), REQUESTED (a sentence the model may obey),
 * or HUMAN (the owner decides). A before panel and a secrets rail sit
 * underneath.
 */
export function InjectionGateChainDiagram({ caption }: DiagramProps) {
  const id = "fnp1";
  const rowOneMid = ROW_ONE_Y + ROW_H / 2;
  const rowTwoMid = ROW_TWO_Y + ROW_H / 2;
  const rowThreeMid = ROW_THREE_Y + ROW_THREE_H / 2;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "One planted folder name, nine stages. Only one guard is a sentence the model is asked to follow, and it is the one an injection can argue with. Everything that actually stops match apply is an ask rule, a hook, the classifier, or the owner."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={630}
        eyebrow="Folder Name To Match Apply"
        chips={[
          { label: "enforced", accent: "emerald" },
          { label: "requested", accent: "amber" },
          { label: "human", accent: "primary" },
        ]}
        footerRight="Prompt injection · who enforces each gate"
      >
        {/* Row one: left to right */}
        {ROW_ONE.map((stage, i) => (
          <StagePanel key={stage.title} stage={stage} col={i} y={ROW_ONE_Y} />
        ))}
        <FlowLine id={id} d={`M${COL_X[0] + COL_W},${rowOneMid} L${COL_X[1]},${rowOneMid}`} accent="red" />
        <FlowLine id={id} d={`M${COL_X[1] + COL_W},${rowOneMid} L${COL_X[2]},${rowOneMid}`} />

        {/* Down the right edge into row two */}
        <FlowLine id={id} d={`M${CENTER[2]},${ROW_ONE_Y + ROW_H} L${CENTER[2]},${ROW_TWO_Y}`} />

        {/* Row two: right to left (columns reversed) */}
        <StagePanel stage={ROW_TWO[2]} col={2} y={ROW_TWO_Y} />
        <StagePanel stage={ROW_TWO[1]} col={1} y={ROW_TWO_Y} />
        <StagePanel stage={ROW_TWO[0]} col={0} y={ROW_TWO_Y} />
        <FlowLine id={id} d={`M${COL_X[2]},${rowTwoMid} L${COL_X[1] + COL_W},${rowTwoMid}`} accent="amber" />
        <FlowLine id={id} d={`M${COL_X[1]},${rowTwoMid} L${COL_X[0] + COL_W},${rowTwoMid}`} />

        {/* Down the left edge into row three */}
        <FlowLine id={id} d={`M${CENTER[0]},${ROW_TWO_Y + ROW_H} L${CENTER[0]},${ROW_THREE_Y}`} />

        {/* Row three: left to right */}
        <StagePanel
          stage={{
            title: "Draft + dry run",
            sub: ["writes nothing", "pre-approved on purpose", "prompts saved for changes"],
            tag: "ENFORCED",
          }}
          col={0}
          y={ROW_THREE_Y}
          h={ROW_THREE_H}
        />
        <StagePanel
          stage={{
            title: "Owner reviews",
            sub: ["reads the summary first", "confirms in this conversation"],
            tag: "HUMAN",
            accent: "primary",
          }}
          col={1}
          y={ROW_THREE_Y}
          h={ROW_THREE_H}
        />
        <FlowLine id={id} d={`M${COL_X[0] + COL_W},${rowThreeMid} L${COL_X[1]},${rowThreeMid}`} />
        <FlowLine id={id} d={`M${COL_X[1] + COL_W},${rowThreeMid} L${COL_X[2]},${rowThreeMid}`} accent="emerald" width={2} />

        {/* The apply gate cluster */}
        <NodePanel
          x={COL_X[2]}
          y={ROW_THREE_Y}
          w={COL_W}
          h={ROW_THREE_H}
          accent="emerald"
          emphasis
          align="left"
          title="match apply"
          sub={["ask rule + hook", "classifier", "approval prompt"]}
          titleSize={17}
          subSize={12.5}
        >
          {[
            { tag: "ENFORCED" as const, row: 0 },
            { tag: "ENFORCED" as const, row: 1 },
            { tag: "HUMAN" as const, row: 2 },
          ].map(({ tag, row }) => (
            <text
              key={row}
              x={COL_X[2] + COL_W - 14}
              y={ROW_THREE_Y + 54 + 2 + (row + 1) * 16.5 - 16.5 + 0.5}
              textAnchor="end"
              className={`${DIAGRAM_ACCENTS[TAG_ACCENT[tag]].text} font-mono font-semibold uppercase`}
              style={{ fontSize: 11.5, letterSpacing: "0.08em" }}
            >
              {tag}
            </text>
          ))}
        </NodePanel>

        {/* Bottom band: the before state and the secrets rail */}
        <NodePanel
          x={18}
          y={476}
          w={432}
          h={96}
          accent="red"
          variant="dashed"
          align="left"
          title="Before the fix"
          sub={[
            "prose-only guard on apply",
            "a bare Read reached the secrets file",
            "the title crossed the shell in quotes",
          ]}
          titleSize={17}
          subSize={12.5}
        />
        <Chip x={450 - 12} y={465} label="Before" accent="red" filled fontSize={11} anchor="end" />

        <NodePanel
          x={468}
          y={476}
          w={414}
          h={96}
          accent="emerald"
          align="left"
          title="Side rail: secrets behind deny rules"
          sub={["secrets dir, app config dir, data dir", "Read and Edit denied in every mode"]}
          titleSize={17}
          subSize={12.5}
        />
        <Chip x={882 - 12} y={465} label="ENFORCED" accent="emerald" filled fontSize={11} anchor="end" />
      </EditorialFrame>
    </DiagramWrapper>
  );
}

type CheckGroup = "BUILD" | "PROVE" | "HUMAN";

const GROUP_ACCENT: Record<CheckGroup, DiagramAccent> = {
  BUILD: "emerald",
  PROVE: "amber",
  HUMAN: "primary",
};

interface Check {
  title: string;
  sub: string[];
  group: CheckGroup;
}

const CHECKS: Check[] = [
  {
    title: "Find the enforcer",
    sub: ["every 'never' needs an ask rule, hook or deny rule", "none behind it means it is only a request"],
    group: "BUILD",
  },
  {
    title: "Prove the gate fires",
    sub: ["apply a file that does not exist", "watch for the prompt to appear"],
    group: "PROVE",
  },
  {
    title: "Attack your own gate",
    sub: ["quotes, backslashes, variables, flag order", "test what the shell runs, not what you typed"],
    group: "PROVE",
  },
  {
    title: "Deny the secrets",
    sub: ["deny rules on secrets, config and data dirs", "never pre-approve a bare Read"],
    group: "BUILD",
  },
  {
    title: "Pass ids, not strings",
    sub: ["keep untrusted text out of the shell", "read the title from the database by id"],
    group: "BUILD",
  },
  {
    title: "Read the prompt",
    sub: ["read the command before you approve it", "reviewing it is your job, not the agent's"],
    group: "HUMAN",
  },
  {
    title: "Run a separate review",
    sub: ["an agent whose job is to break it", "mine reported a High in eleven minutes"],
    group: "PROVE",
  },
  {
    title: "Remove one trifecta leg",
    sub: ["untrusted input, private data, a way out", "cut one leg instead of guarding all three"],
    group: "BUILD",
  },
];

const CARD_W = 423;
const CARD_H = 88;
const CARD_GAP_X = 18;
const CARD_GAP_Y = 20;
const CARD_Y0 = 80;

/**
 * The eight-point checklist as a two-column card grid. Each card is
 * tagged by what kind of work it is: BUILD (change the setup), PROVE
 * (test it), HUMAN (a person reads and decides).
 */
export function ActiveParticipantChecklistDiagram({ caption }: DiagramProps) {
  const id = "fnp2";
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Eight checks for anyone building with an agent. Four change the setup, three prove it works, and one is the person reading the prompt before approving."
      }
    >
      <EditorialFrame
        id={id}
        w={900}
        h={CARD_Y0 + 4 * CARD_H + 3 * CARD_GAP_Y + 46}
        eyebrow="The Eight-Point Agent Check"
        chips={[
          { label: "build", accent: "emerald" },
          { label: "prove", accent: "amber" },
          { label: "human", accent: "primary" },
        ]}
        footerRight="Active participant · run it today"
      >
        {CHECKS.map((check, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 18 + col * (CARD_W + CARD_GAP_X);
          const y = CARD_Y0 + row * (CARD_H + CARD_GAP_Y);
          const accent = GROUP_ACCENT[check.group];
          return (
            <g key={check.title}>
              <NodePanel
                x={x}
                y={y}
                w={CARD_W}
                h={CARD_H}
                align="left"
                title={check.title}
                sub={check.sub}
                titleSize={17}
                subSize={12.5}
              />
              <Chip
                x={x + CARD_W - 12}
                y={y - 11}
                label={check.group}
                accent={accent}
                filled
                fontSize={11}
                anchor="end"
              />
              <StepBadge cx={x + 30} cy={y} n={i + 1} accent={accent} />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}
