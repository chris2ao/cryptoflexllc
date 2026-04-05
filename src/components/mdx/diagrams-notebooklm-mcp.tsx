/** NotebookLM MCP Integration blog post diagrams -- SVG-based, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return (
    <DiagramLightbox caption={caption}>
      {children}
    </DiagramLightbox>
  );
}

/** Architecture diagram: Claude Code session connecting to MCP server and agent */
export function NotebookLMMCPArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Architecture: Claude Code session connects to notebooklm-mcp-cli via MCP protocol, orchestrated by a custom agent"
      }
    >
      <svg
        viewBox="0 0 800 460"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="nmArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="400"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          NotebookLM MCP Integration Architecture
        </text>

        {/* Claude Code Session box */}
        <rect
          x="250"
          y="50"
          width="300"
          height="60"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500/50"
          strokeWidth="1.5"
        />
        <text
          x="400"
          y="76"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Claude Code Session
        </text>
        <text
          x="400"
          y="98"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Opus / Sonnet model
        </text>

        {/* Arrow down to MCP Server */}
        <line
          x1="310"
          y1="110"
          x2="310"
          y2="165"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#nmArrow)"
        />
        <text
          x="270"
          y="140"
          className="fill-muted-foreground/70 text-[9px]"
        >
          MCP Protocol
        </text>

        {/* Arrow down to Agent */}
        <line
          x1="490"
          y1="110"
          x2="490"
          y2="165"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#nmArrow)"
        />
        <text
          x="505"
          y="140"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Spawns
        </text>

        {/* MCP Server box */}
        <rect
          x="60"
          y="170"
          width="320"
          height="120"
          rx="10"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1.5"
        />
        <text
          x="220"
          y="196"
          textAnchor="middle"
          className="fill-emerald-400 text-[12px] font-semibold"
        >
          MCP Server: notebooklm-mcp-cli
        </text>

        {/* Tool badges inside MCP box */}
        {[
          { label: "notebook_*", x: 95 },
          { label: "source_*", x: 200 },
          { label: "audio_*", x: 300 },
        ].map((tool) => (
          <g key={tool.label}>
            <rect
              x={tool.x}
              y="210"
              width="85"
              height="24"
              rx="6"
              className="fill-emerald-500/15 stroke-emerald-500/60"
              strokeWidth="1"
            />
            <text
              x={tool.x + 42}
              y="226"
              textAnchor="middle"
              className="fill-emerald-400 text-[9px] font-mono"
            >
              {tool.label}
            </text>
          </g>
        ))}

        <text
          x="220"
          y="260"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          35 tools, v0.5.16, 3,252 stars
        </text>

        {/* Agent box */}
        <rect
          x="420"
          y="170"
          width="320"
          height="120"
          rx="10"
          className="fill-violet-500/8 stroke-violet-500/40"
          strokeWidth="1.5"
        />
        <text
          x="580"
          y="196"
          textAnchor="middle"
          className="fill-violet-400 text-[12px] font-semibold"
        >
          Agent: notebooklm-assistant
        </text>

        {/* Agent capabilities */}
        {[
          { label: "Orchestration", y: 215 },
          { label: "Error Recovery", y: 235 },
          { label: "Artifact Management", y: 255 },
        ].map((cap) => (
          <g key={cap.label}>
            <circle cx="460" cy={cap.y} r="3" className="fill-violet-400/60" />
            <text
              x="470"
              y={cap.y + 4}
              className="fill-muted-foreground text-[10px]"
            >
              {cap.label}
            </text>
          </g>
        ))}

        <text
          x="580"
          y="278"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          5 workflow patterns
        </text>

        {/* Arrow from MCP to Google */}
        <line
          x1="220"
          y1="290"
          x2="220"
          y2="345"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#nmArrow)"
        />
        <text
          x="230"
          y="325"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Internal API
        </text>

        {/* Google NotebookLM box */}
        <rect
          x="80"
          y="350"
          width="280"
          height="55"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="220"
          y="376"
          textAnchor="middle"
          className="fill-amber-400 text-[12px] font-semibold"
        >
          Google NotebookLM
        </text>
        <text
          x="220"
          y="395"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Reverse-engineered endpoints (no official API)
        </text>

        {/* Auth box */}
        <rect
          x="420"
          y="350"
          width="320"
          height="55"
          rx="10"
          className="fill-red-500/8 stroke-red-500/40"
          strokeWidth="1.5"
        />
        <text
          x="580"
          y="376"
          textAnchor="middle"
          className="fill-red-400 text-[12px] font-semibold"
        >
          Cookie Auth
        </text>
        <text
          x="580"
          y="395"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          ~/.notebooklm-mcp-cli/profiles/auth.json (expires 2-4 weeks)
        </text>

        {/* Arrow from Google to Auth */}
        <line
          x1="360"
          y1="377"
          x2="416"
          y2="377"
          className="stroke-muted-foreground/40"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Platform badges */}
        <rect
          x="60"
          y="425"
          width="100"
          height="22"
          rx="6"
          className="fill-cyan-500/10 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="110"
          y="440"
          textAnchor="middle"
          className="fill-cyan-400 text-[9px] font-mono"
        >
          Windows
        </text>
        <rect
          x="170"
          y="425"
          width="100"
          height="22"
          rx="6"
          className="fill-cyan-500/10 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="220"
          y="440"
          textAnchor="middle"
          className="fill-cyan-400 text-[9px] font-mono"
        >
          macOS
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** Superpowers pipeline: brainstorming -> writing-plans -> subagent-driven-development */
export function SuperpowersPipelineDiagram({ caption }: DiagramProps) {
  const phases = [
    {
      label: "Brainstorming",
      desc: "Structured Q&A",
      detail: "1 question at a time",
      color: "fill-cyan-500",
      bg: "fill-cyan-500/10",
      stroke: "stroke-cyan-500",
    },
    {
      label: "Design Doc",
      desc: "Spec written",
      detail: "docs/plans/*.md",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/10",
      stroke: "stroke-emerald-500",
    },
    {
      label: "Writing Plans",
      desc: "Task decomposition",
      detail: "7 tasks, bite-sized",
      color: "fill-violet-500",
      bg: "fill-violet-500/10",
      stroke: "stroke-violet-500",
    },
    {
      label: "Subagent Dev",
      desc: "Parallel execution",
      detail: "agents per task",
      color: "fill-amber-500",
      bg: "fill-amber-500/10",
      stroke: "stroke-amber-500",
    },
    {
      label: "Verification",
      desc: "Smoke test",
      detail: "CLI + MCP checks",
      color: "fill-emerald-500",
      bg: "fill-emerald-500/10",
      stroke: "stroke-emerald-500",
    },
  ];

  const boxW = 130;
  const boxH = 75;
  const gap = 16;
  const startX = 28;
  const y = 50;
  const svgW = startX + phases.length * (boxW + gap);

  return (
    <DiagramWrapper
      caption={
        caption ??
        "The superpowers pipeline: from structured brainstorming through parallel execution to verification"
      }
    >
      <svg
        viewBox={`0 0 ${svgW} 150`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="spArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x={svgW / 2}
          y="25"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Superpowers Plugin Pipeline
        </text>

        {phases.map((phase, i) => {
          const x = startX + i * (boxW + gap);
          return (
            <g key={phase.label}>
              {/* Phase number */}
              <circle
                cx={x + 15}
                cy={y + 2}
                r="10"
                className={`${phase.bg} ${phase.stroke}`}
                strokeWidth="1"
              />
              <text
                x={x + 15}
                y={y + 6}
                textAnchor="middle"
                className={`${phase.color} text-[9px] font-bold`}
              >
                {i + 1}
              </text>

              {/* Box */}
              <rect
                x={x}
                y={y + 15}
                width={boxW}
                height={boxH}
                rx="8"
                className={`${phase.bg} ${phase.stroke}`}
                strokeWidth="1.5"
              />
              <text
                x={x + boxW / 2}
                y={y + 38}
                textAnchor="middle"
                className={`${phase.color} text-[11px] font-semibold`}
              >
                {phase.label}
              </text>
              <text
                x={x + boxW / 2}
                y={y + 54}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px]"
              >
                {phase.desc}
              </text>
              <text
                x={x + boxW / 2}
                y={y + 67}
                textAnchor="middle"
                className="fill-muted-foreground/60 text-[8px]"
              >
                {phase.detail}
              </text>

              {/* Arrow to next */}
              {i < phases.length - 1 && (
                <line
                  x1={x + boxW}
                  y1={y + 52}
                  x2={x + boxW + gap}
                  y2={y + 52}
                  className="stroke-muted-foreground/40"
                  strokeWidth="1.5"
                  markerEnd="url(#spArrow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}

/** Execution timeline: 7 tasks with parallel execution highlighted */
export function ExecutionTimelineDiagram({ caption }: DiagramProps) {
  const tasks = [
    { label: "Install CLI", status: "done", color: "fill-emerald-500", bg: "fill-emerald-500/10", stroke: "stroke-emerald-500" },
    { label: "Register MCP", status: "done", color: "fill-emerald-500", bg: "fill-emerald-500/10", stroke: "stroke-emerald-500" },
    { label: "Authenticate", status: "done", color: "fill-emerald-500", bg: "fill-emerald-500/10", stroke: "stroke-emerald-500" },
    { label: "Write Agent", status: "parallel", color: "fill-violet-500", bg: "fill-violet-500/10", stroke: "stroke-violet-500" },
    { label: "Smoke Test", status: "done", color: "fill-emerald-500", bg: "fill-emerald-500/10", stroke: "stroke-emerald-500" },
    { label: "Mac Plan", status: "parallel", color: "fill-violet-500", bg: "fill-violet-500/10", stroke: "stroke-violet-500" },
    { label: "Commit + Sync", status: "done", color: "fill-emerald-500", bg: "fill-emerald-500/10", stroke: "stroke-emerald-500" },
  ];

  const colW = 100;
  const rowH = 52;
  const startX = 40;
  const startY = 55;
  const svgW = startX + tasks.length * colW + 20;
  const svgH = startY + rowH * 2 + 50;

  return (
    <DiagramWrapper
      caption={
        caption ??
        "Execution timeline: 7 tasks with tasks 4 and 6 running in parallel via subagents"
      }
    >
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x={svgW / 2}
          y="25"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Subagent Execution Timeline
        </text>
        <text
          x={svgW / 2}
          y="42"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Sequential tasks in green, parallel subagents in purple
        </text>

        {/* Sequential row */}
        {tasks.map((task, i) => {
          if (task.status === "parallel") return null;
          const x = startX + i * colW;
          return (
            <g key={task.label}>
              <rect
                x={x}
                y={startY}
                width={colW - 8}
                height="40"
                rx="6"
                className={`${task.bg} ${task.stroke}`}
                strokeWidth="1.5"
              />
              <text
                x={x + (colW - 8) / 2}
                y={startY + 18}
                textAnchor="middle"
                className={`${task.color} text-[10px] font-semibold`}
              >
                {task.label}
              </text>
              <text
                x={x + (colW - 8) / 2}
                y={startY + 32}
                textAnchor="middle"
                className="fill-muted-foreground text-[8px]"
              >
                Task {i + 1}
              </text>
            </g>
          );
        })}

        {/* Parallel bracket for tasks 4 and 6 */}
        <rect
          x={startX + 3 * colW - 5}
          y={startY - 5}
          width={colW * 3 + 2}
          height={rowH + 55}
          rx="8"
          className="stroke-violet-500/30"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
        <text
          x={startX + 3 * colW + colW * 1.5}
          y={startY + rowH + 45}
          textAnchor="middle"
          className="fill-violet-400/60 text-[9px]"
        >
          Parallel execution window
        </text>

        {/* Parallel tasks stacked */}
        {/* Task 4: Write Agent (upper parallel slot) */}
        <rect
          x={startX + 3 * colW}
          y={startY}
          width={colW - 8}
          height="40"
          rx="6"
          className="fill-violet-500/10 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x={startX + 3 * colW + (colW - 8) / 2}
          y={startY + 18}
          textAnchor="middle"
          className="fill-violet-400 text-[10px] font-semibold"
        >
          Write Agent
        </text>
        <text
          x={startX + 3 * colW + (colW - 8) / 2}
          y={startY + 32}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          Task 4
        </text>

        {/* Task 6: Mac Plan (lower parallel slot) */}
        <rect
          x={startX + 5 * colW}
          y={startY}
          width={colW - 8}
          height="40"
          rx="6"
          className="fill-violet-500/10 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x={startX + 5 * colW + (colW - 8) / 2}
          y={startY + 18}
          textAnchor="middle"
          className="fill-violet-400 text-[10px] font-semibold"
        >
          Mac Plan
        </text>
        <text
          x={startX + 5 * colW + (colW - 8) / 2}
          y={startY + 32}
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          Task 6
        </text>
      </svg>
    </DiagramWrapper>
  );
}
