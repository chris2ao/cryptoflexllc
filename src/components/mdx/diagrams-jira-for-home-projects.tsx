/** Jira for Home Projects blog post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
  elbowPath,
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

interface BoardColumn {
  title: string;
  sub: string;
  accent: DiagramAccent;
  emphasis: boolean;
}

const BOARD_COLUMNS: readonly BoardColumn[] = [
  { title: "Backlog", sub: "unscheduled", accent: "muted", emphasis: false },
  { title: "Ready", sub: "next up", accent: "primary", emphasis: false },
  { title: "In Progress", sub: "work started", accent: "cyan", emphasis: false },
  { title: "Waiting on me", sub: "needs the owner", accent: "amber", emphasis: true },
  { title: "Done", sub: "verified", accent: "emerald", emphasis: false },
] as const;

interface BoardCard {
  col: number;
  key: string;
  summary: string;
}

interface BoardLane {
  name: string;
  epic: string;
  cards: readonly BoardCard[];
}

const BOARD_LANES: readonly BoardLane[] = [
  {
    name: "CryptoFlix",
    epic: "CLAUD-1",
    cards: [
      { col: 3, key: "CLAUD-263", summary: "9.5.1 owner checks" },
      { col: 4, key: "CLAUD-224", summary: "Release 9.4.1" },
    ],
  },
  {
    name: "cryptoflexllc",
    epic: "CLAUD-6",
    cards: [
      { col: 0, key: "CLAUD-226", summary: "Vendor font subsets" },
      { col: 4, key: "CLAUD-225", summary: "Self-host fonts" },
    ],
  },
  {
    name: "CJClaudin_Mac",
    epic: "CLAUD-2",
    cards: [{ col: 0, key: "CLAUD-222", summary: "Trash old space" }],
  },
] as const;

const COL_W = 158;
const COL_GAP = 14;
const COL_X0 = 27;

/**
 * Five custom status columns across the top, one swimlane per project
 * epic below. Cards are real items from the board, placed in the column
 * they were in when the post was written.
 */
export function JiraBoardLifecycleDiagram({ caption }: DiagramProps) {
  const headerY = 60;
  const headerH = 64;
  const laneTop = 152;
  const laneStep = 92;
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Five columns, one swimlane per project epic. Waiting on me is the column that separates owner-only steps from work Claude can do alone. The cards are real items from the board."
      }
    >
      <EditorialFrame
        id="jhp1"
        w={900}
        h={laneTop + laneStep * BOARD_LANES.length + 22}
        eyebrow="The Board: One Swimlane Per Project"
        chips={[
          { label: "5 columns", accent: "primary" },
          { label: "grouped by epic", accent: "cyan" },
        ]}
        footerRight="Epic per project · status per column"
        maxWidthClass="max-w-3xl"
      >
        {/* Column headers */}
        {BOARD_COLUMNS.map((col, i) => {
          const x = COL_X0 + i * (COL_W + COL_GAP);
          return (
            <g key={col.title}>
              <NodePanel
                x={x}
                y={headerY}
                w={COL_W}
                h={headerH}
                accent={col.accent}
                emphasis={col.emphasis}
                title={col.title}
                sub={[col.sub]}
                titleSize={17}
                subSize={12.5}
              />
              {i < BOARD_COLUMNS.length - 1 && (
                <FlowLine
                  id="jhp1"
                  d={`M${x + COL_W + 1},${headerY + headerH / 2} L${x + COL_W + COL_GAP - 1},${headerY + headerH / 2}`}
                  accent="muted"
                />
              )}
            </g>
          );
        })}

        {/* Swimlanes */}
        {BOARD_LANES.map((lane, li) => {
          const top = laneTop + li * laneStep;
          const labelY = top + 4;
          const cardY = top + 14;
          return (
            <g key={lane.name}>
              <rect
                x={14}
                y={top - 16}
                width={872}
                height={laneStep - 8}
                rx={10}
                className="fill-foreground/[0.03] stroke-foreground/10"
                strokeWidth="1"
              />
              {BOARD_COLUMNS.map((col, ci) => (
                <rect
                  key={col.title}
                  x={COL_X0 + ci * (COL_W + COL_GAP)}
                  y={cardY - 4}
                  width={COL_W}
                  height={60}
                  rx={8}
                  className="fill-foreground/[0.035]"
                />
              ))}
              <SectionLabel x={28} y={labelY} label={lane.name} accent="primary" fontSize={12.5} />
              <Chip
                x={872}
                y={top - 10}
                label={`Epic ${lane.epic}`}
                accent="muted"
                fontSize={11}
                anchor="end"
              />
              {lane.cards.map((card) => {
                const col = BOARD_COLUMNS[card.col];
                const x = COL_X0 + card.col * (COL_W + COL_GAP);
                return (
                  <NodePanel
                    key={card.key}
                    x={x}
                    y={cardY}
                    w={COL_W}
                    h={52}
                    accent={col.accent}
                    emphasis={col.emphasis}
                    title={card.key}
                    sub={[card.summary]}
                    titleSize={15}
                    subSize={12}
                  />
                );
              })}
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramWrapper>
  );
}

/**
 * Session work files and moves items as it goes. /wrap-up Step 4d sweeps
 * what fell through, the owner confirms, and Jira is updated. When Jira is
 * unreachable the updates are parked in vector memory and picked up by a
 * later wrap-up, so nothing ever blocks.
 */
export function JiraWrapUpSweepDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The rule files and moves items during the session. The wrap-up sweep catches what fell through, the owner confirms the list, and Jira is updated. With no Jira access, updates wait in vector memory tagged jira-pending for a later wrap-up."
      }
    >
      <EditorialFrame
        id="jhp2"
        w={900}
        h={430}
        eyebrow="Wrap-Up Step 4d: Jira Sync"
        chips={[
          { label: "owner confirms", accent: "amber" },
          { label: "never blocks", accent: "emerald" },
        ]}
        footerRight="Session · sweep · confirm · Jira"
        maxWidthClass="max-w-3xl"
      >
        {/* Row 1: the happy path */}
        <NodePanel
          x={20}
          y={98}
          w={160}
          h={124}
          accent="cyan"
          title="Session work"
          sub={["rule files and", "moves items", "as it goes"]}
          titleSize={17}
          subSize={12.5}
          terminal
        />
        <FlowLine id="jhp2" d="M180,160 L216,160" accent="cyan" />

        <NodePanel
          x={216}
          y={82}
          w={300}
          h={156}
          accent="primary"
          emphasis
          title="/wrap-up sweep"
          sub={[
            "items touched this session",
            "jira-pending notes",
            "deferrals never filed",
            "stale In Progress",
            "proposed Done items",
          ]}
          titleSize={18}
          subSize={12.5}
        />
        <FlowLine id="jhp2" d="M516,160 L552,160" accent="amber" />

        <NodePanel
          x={552}
          y={104}
          w={160}
          h={112}
          accent="amber"
          emphasis
          title="Owner confirms"
          sub={["apply all", "pick", "skip"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="jhp2" d="M712,160 L748,160" accent="emerald" />

        <NodePanel
          x={748}
          y={104}
          w={132}
          h={112}
          accent="emerald"
          title="Jira"
          sub={["filed, moved,", "one line each"]}
          titleSize={18}
          subSize={12.5}
        />

        {/* Row 2: the fallback path */}
        <FlowLine id="jhp2" d={elbowPath(100, 216, 216, 340, "v")} accent="amber" dashed />
        <Chip x={110} y={262} label="No Jira access" accent="amber" fontSize={11} />

        <NodePanel
          x={216}
          y={298}
          w={300}
          h={84}
          accent="amber"
          variant="dashed"
          title="Vector memory"
          sub={["tagged jira-pending", "no secrets stored"]}
          titleSize={17}
          subSize={12.5}
        />
        <FlowLine id="jhp2" d="M366,298 L366,240" accent="amber" dashed />
        <text
          x={378}
          y={274}
          className="fill-warning font-mono"
          style={{ fontSize: 12.5 }}
        >
          read by the next wrap-up
        </text>

        <NodePanel
          x={552}
          y={298}
          w={328}
          h={84}
          accent="emerald"
          variant="dashed"
          title="Never blocks wrap-up"
          sub={["on any Jira error: say so,", "park the update, carry on"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramWrapper>
  );
}
