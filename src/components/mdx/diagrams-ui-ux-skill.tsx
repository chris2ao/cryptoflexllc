/** UI/UX Skill System blog post diagrams -- SVG-based, themed to site colors */

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

/** Director + 4 Specialists orchestration flow */
export function UIUXAgentOrchestrationDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The /ui-ux Director routes work to 4 specialists with sequential and parallel phases"
      }
    >
      <svg
        viewBox="0 0 900 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="uiArrow"
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
          x="450"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          /ui-ux Agent Orchestration
        </text>

        {/* Director box */}
        <rect
          x="310"
          y="45"
          width="280"
          height="65"
          rx="12"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="2"
        />
        <text
          x="450"
          y="70"
          textAnchor="middle"
          className="fill-violet-400 text-[13px] font-semibold"
        >
          ui-ux-director.md (Sonnet)
        </text>
        <text
          x="450"
          y="90"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          5 modes: Design | Build | Review | Fix | Audit
        </text>

        {/* Phase 1 label */}
        <rect
          x="20"
          y="140"
          width="860"
          height="150"
          rx="10"
          className="fill-cyan-500/5 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="160"
          className="fill-cyan-500/80 text-[11px] font-semibold"
        >
          PHASE 1: Sequential Design
        </text>

        {/* Arrow from director to Phase 1 */}
        <line
          x1="450"
          y1="110"
          x2="450"
          y2="140"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#uiArrow)"
        />

        {/* Visual Designer */}
        <rect
          x="80"
          y="175"
          width="240"
          height="90"
          rx="8"
          className="fill-rose-500/10 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="200"
          y="198"
          textAnchor="middle"
          className="fill-rose-400 text-[12px] font-semibold"
        >
          Visual Designer (Sonnet)
        </text>
        <text
          x="200"
          y="216"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Aesthetic direction, color systems
        </text>
        <text
          x="200"
          y="230"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Anti-AI-slop enforcement
        </text>
        <text
          x="200"
          y="244"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Owns: design tokens, global styles
        </text>

        {/* Arrow to Component Architect */}
        <line
          x1="320"
          y1="220"
          x2="410"
          y2="220"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#uiArrow)"
        />
        <text
          x="365"
          y="212"
          textAnchor="middle"
          className="fill-muted-foreground/50 text-[9px]"
        >
          then
        </text>

        {/* Component Architect */}
        <rect
          x="420"
          y="175"
          width="240"
          height="90"
          rx="8"
          className="fill-amber-500/10 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="540"
          y="198"
          textAnchor="middle"
          className="fill-amber-400 text-[12px] font-semibold"
        >
          Component Architect (Sonnet)
        </text>
        <text
          x="540"
          y="216"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Design tokens, composition patterns
        </text>
        <text
          x="540"
          y="230"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Responsive strategy, all 8 states
        </text>
        <text
          x="540"
          y="244"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Owns: component files, layouts
        </text>

        {/* Phase 2 label */}
        <rect
          x="20"
          y="315"
          width="860"
          height="140"
          rx="10"
          className="fill-emerald-500/5 stroke-emerald-500/30"
          strokeWidth="1"
        />
        <text
          x="40"
          y="335"
          className="fill-emerald-500/80 text-[11px] font-semibold"
        >
          PHASE 2: Parallel Review
        </text>

        {/* Arrow down to Phase 2 */}
        <line
          x1="450"
          y1="290"
          x2="450"
          y2="315"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#uiArrow)"
        />

        {/* Performance Reviewer */}
        <rect
          x="80"
          y="350"
          width="240"
          height="85"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="200"
          y="373"
          textAnchor="middle"
          className="fill-cyan-400 text-[12px] font-semibold"
        >
          Performance Reviewer (Haiku)
        </text>
        <text
          x="200"
          y="391"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Client components &lt;20%, bundle size
        </text>
        <text
          x="200"
          y="405"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Fetch waterfalls, image optimization
        </text>
        <text
          x="200"
          y="419"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Read-only: JSON severity report
        </text>

        {/* Parallel indicator */}
        <text
          x="380"
          y="395"
          textAnchor="middle"
          className="fill-emerald-500/60 text-[18px] font-bold"
        >
          ||
        </text>

        {/* UX Reviewer */}
        <rect
          x="420"
          y="350"
          width="240"
          height="85"
          rx="8"
          className="fill-emerald-500/10 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="540"
          y="373"
          textAnchor="middle"
          className="fill-emerald-400 text-[12px] font-semibold"
        >
          UX Reviewer (Sonnet)
        </text>
        <text
          x="540"
          y="391"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Nielsen heuristics + TASTE scoring
        </text>
        <text
          x="540"
          y="405"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          35-rule audit, Playwright visual QA
        </text>
        <text
          x="540"
          y="419"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Quality gate: PASS / CONDITIONAL / FAIL
        </text>

        {/* Quality Gate */}
        <rect
          x="280"
          y="480"
          width="340"
          height="50"
          rx="10"
          className="fill-violet-500/8 stroke-violet-500/50"
          strokeWidth="1.5"
        />
        <text
          x="450"
          y="503"
          textAnchor="middle"
          className="fill-violet-400 text-[12px] font-semibold"
        >
          Quality Gate (max 2 revision cycles)
        </text>
        <text
          x="450"
          y="520"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Heuristic avg &ge;3.5 + TASTE avg &ge;3.0 + no critical violations
        </text>

        {/* Arrow down to quality gate */}
        <line
          x1="450"
          y1="455"
          x2="450"
          y2="480"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#uiArrow)"
        />

        {/* Shared knowledge base badge */}
        <rect
          x="700"
          y="175"
          width="160"
          height="115"
          rx="8"
          className="fill-zinc-500/8 stroke-zinc-500/50"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="780"
          y="198"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-semibold"
        >
          Shared Knowledge
        </text>
        <text
          x="780"
          y="218"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          design-rules.md (35 rules)
        </text>
        <text
          x="780"
          y="232"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          perceptual-defaults.md
        </text>
        <text
          x="780"
          y="246"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          scaffold-templates.md (9)
        </text>
        <text
          x="780"
          y="260"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          react-performance.md (20+)
        </text>
        <text
          x="780"
          y="278"
          textAnchor="middle"
          className="fill-zinc-500/60 text-[8px]"
        >
          Also used by game-ux, blog-ux
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** Research-to-deployment pipeline */
export function UIUXResearchPipelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "From 12 community skills to a 5-agent design team: the research-to-deployment pipeline"
      }
    >
      <svg
        viewBox="0 0 900 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="rpArrow"
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
          x="450"
          y="25"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Research-to-Deployment Pipeline
        </text>

        {/* Stage 1: Sources */}
        <rect
          x="20"
          y="45"
          width="200"
          height="200"
          rx="10"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1.5"
        />
        <text
          x="120"
          y="68"
          textAnchor="middle"
          className="fill-cyan-500 text-[12px] font-semibold"
        >
          12+ Community Skills
        </text>

        {/* Tier labels */}
        <rect
          x="35"
          y="82"
          width="170"
          height="28"
          rx="4"
          className="fill-emerald-500/10"
        />
        <text
          x="120"
          y="100"
          textAnchor="middle"
          className="fill-emerald-400 text-[9px] font-medium"
        >
          Tier 1: UI/UX Pro Max, Anthropic, ALL-GOOD
        </text>

        <rect
          x="35"
          y="116"
          width="170"
          height="28"
          rx="4"
          className="fill-amber-500/10"
        />
        <text
          x="120"
          y="134"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-medium"
        >
          Tier 2: TASTE, PencilPlaybook, Vercel
        </text>

        <rect
          x="35"
          y="150"
          width="170"
          height="28"
          rx="4"
          className="fill-zinc-500/10"
        />
        <text
          x="120"
          y="168"
          textAnchor="middle"
          className="fill-zinc-400 text-[9px] font-medium"
        >
          Tier 3: AccessLint, a11y, Refactoring UI...
        </text>

        {/* Rejection badge */}
        <rect
          x="35"
          y="190"
          width="170"
          height="40"
          rx="4"
          className="fill-red-500/8 stroke-red-500/30"
          strokeWidth="1"
        />
        <text
          x="120"
          y="207"
          textAnchor="middle"
          className="fill-red-400 text-[9px] font-medium"
        >
          Rejected: Python scripts (36% have
        </text>
        <text
          x="120"
          y="220"
          textAnchor="middle"
          className="fill-red-400 text-[9px] font-medium"
        >
          prompt injection), CLI installs, Figma
        </text>

        {/* Arrow to Stage 2 */}
        <line
          x1="220"
          y1="145"
          x2="270"
          y2="145"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#rpArrow)"
        />
        <text
          x="245"
          y="138"
          textAnchor="middle"
          className="fill-muted-foreground/50 text-[8px]"
        >
          cherry-pick
        </text>

        {/* Stage 2: Knowledge Base */}
        <rect
          x="280"
          y="45"
          width="200"
          height="200"
          rx="10"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1.5"
        />
        <text
          x="380"
          y="68"
          textAnchor="middle"
          className="fill-amber-500 text-[12px] font-semibold"
        >
          Knowledge Base (4 files)
        </text>

        <rect
          x="295"
          y="82"
          width="170"
          height="24"
          rx="4"
          className="fill-amber-500/10"
        />
        <text
          x="380"
          y="98"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-medium"
        >
          design-rules.md (35 rules, 6 categories)
        </text>

        <rect
          x="295"
          y="112"
          width="170"
          height="24"
          rx="4"
          className="fill-amber-500/10"
        />
        <text
          x="380"
          y="128"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-medium"
        >
          perceptual-defaults.md (research-backed)
        </text>

        <rect
          x="295"
          y="142"
          width="170"
          height="24"
          rx="4"
          className="fill-amber-500/10"
        />
        <text
          x="380"
          y="158"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-medium"
        >
          scaffold-templates.md (9 patterns)
        </text>

        <rect
          x="295"
          y="172"
          width="170"
          height="24"
          rx="4"
          className="fill-amber-500/10"
        />
        <text
          x="380"
          y="188"
          textAnchor="middle"
          className="fill-amber-400 text-[9px] font-medium"
        >
          react-performance.md (20+ rules, 4 tiers)
        </text>

        {/* Sources merged label */}
        <text
          x="380"
          y="230"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[8px]"
        >
          Synthesized from all 12+ sources
        </text>

        {/* Arrow to Stage 3 */}
        <line
          x1="480"
          y1="145"
          x2="530"
          y2="145"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#rpArrow)"
        />
        <text
          x="505"
          y="138"
          textAnchor="middle"
          className="fill-muted-foreground/50 text-[8px]"
        >
          powers
        </text>

        {/* Stage 3: Agents */}
        <rect
          x="540"
          y="45"
          width="200"
          height="200"
          rx="10"
          className="fill-violet-500/8 stroke-violet-500/40"
          strokeWidth="1.5"
        />
        <text
          x="640"
          y="68"
          textAnchor="middle"
          className="fill-violet-500 text-[12px] font-semibold"
        >
          5-Agent Team
        </text>

        {/* Agent list */}
        {[
          { name: "Director", model: "Sonnet", color: "fill-violet-400" },
          { name: "Visual Designer", model: "Sonnet", color: "fill-rose-400" },
          { name: "Component Architect", model: "Sonnet", color: "fill-amber-400" },
          { name: "Performance Reviewer", model: "Haiku", color: "fill-cyan-400" },
          { name: "UX Reviewer", model: "Sonnet", color: "fill-emerald-400" },
        ].map((agent, i) => (
          <g key={agent.name}>
            <rect
              x="555"
              y={82 + i * 30}
              width="170"
              height="24"
              rx="4"
              className="fill-violet-500/10"
            />
            <text
              x="565"
              y={98 + i * 30}
              className={`${agent.color} text-[9px] font-medium`}
            >
              {agent.name}
            </text>
            <text
              x="715"
              y={98 + i * 30}
              textAnchor="end"
              className="fill-muted-foreground/60 text-[8px]"
            >
              {agent.model}
            </text>
          </g>
        ))}

        {/* Arrow to Stage 4 */}
        <line
          x1="740"
          y1="145"
          x2="790"
          y2="145"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#rpArrow)"
        />

        {/* Stage 4: Deployment */}
        <rect
          x="800"
          y="70"
          width="80"
          height="150"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="840"
          y="120"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px] font-semibold"
        >
          Live
        </text>
        <text
          x="840"
          y="138"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          10 new
        </text>
        <text
          x="840"
          y="150"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          files
        </text>
        <text
          x="840"
          y="168"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          1 day
        </text>
        <text
          x="840"
          y="186"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          5 agents
        </text>
        <text
          x="840"
          y="204"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          4 data
        </text>

        {/* Bottom: Integration with existing agents */}
        <rect
          x="20"
          y="280"
          width="860"
          height="80"
          rx="10"
          className="fill-zinc-500/5 stroke-zinc-500/30"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text
          x="450"
          y="303"
          textAnchor="middle"
          className="fill-zinc-400 text-[11px] font-semibold"
        >
          Existing Agent Integration
        </text>

        {/* game-ux box */}
        <rect
          x="100"
          y="315"
          width="180"
          height="30"
          rx="6"
          className="fill-cyan-500/8 stroke-cyan-500/30"
          strokeWidth="1"
        />
        <text
          x="190"
          y="334"
          textAnchor="middle"
          className="fill-cyan-400 text-[10px]"
        >
          game-ux.md (updated references)
        </text>

        {/* blog-ux box */}
        <rect
          x="360"
          y="315"
          width="180"
          height="30"
          rx="6"
          className="fill-amber-500/8 stroke-amber-500/30"
          strokeWidth="1"
        />
        <text
          x="450"
          y="334"
          textAnchor="middle"
          className="fill-amber-400 text-[10px]"
        >
          blog-ux.md (updated references)
        </text>

        {/* cryptoflexllc box */}
        <rect
          x="620"
          y="315"
          width="180"
          height="30"
          rx="6"
          className="fill-emerald-500/8 stroke-emerald-500/30"
          strokeWidth="1"
        />
        <text
          x="710"
          y="334"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px]"
        >
          cryptoflexllc.com (first target)
        </text>

        {/* The Lesson callout at bottom */}
        <rect
          x="20"
          y="390"
          width="860"
          height="75"
          rx="10"
          className="fill-rose-500/5 stroke-rose-500/30"
          strokeWidth="1"
        />
        <text
          x="450"
          y="415"
          textAnchor="middle"
          className="fill-rose-400 text-[11px] font-semibold"
        >
          The Hard Lesson
        </text>
        <text
          x="450"
          y="435"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Changing CSS tokens and fonts on existing layouts = reskin, not visual overhaul.
        </text>
        <text
          x="450"
          y="450"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          True transformation requires rewriting JSX markup and layout composition.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
