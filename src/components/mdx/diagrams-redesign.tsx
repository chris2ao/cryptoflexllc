/** Cryptoflex redesign blog post diagrams: SVG-based, themed to site colors */

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
 * The three-step pipeline: claude.ai/design -> handoff bundle -> Claude Code build.
 * Shows what lives in the bundle and what it unlocks on the other side.
 */
export function DesignToCodePipelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The pipeline: a design lives in claude.ai/design, exports as a structured handoff bundle, and gets rebuilt in the target codebase by Claude Code"
      }
    >
      <svg
        viewBox="0 0 900 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="rdArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/70" />
          </marker>
        </defs>

        <text
          x="450"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          claude.ai/design to Claude Code handoff
        </text>

        {/* Step 1: claude.ai/design */}
        <rect
          x="40"
          y="80"
          width="240"
          height="260"
          rx="10"
          className="fill-primary/10 stroke-primary"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="112"
          textAnchor="middle"
          className="fill-primary text-[13px] font-semibold"
        >
          claude.ai/design
        </text>
        <text
          x="160"
          y="134"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          browser-based design tool
        </text>
        <text x="60" y="168" className="fill-foreground text-[11px]">
          • pick hero variant
        </text>
        <text x="60" y="188" className="fill-foreground text-[11px]">
          • adjust accent color
        </text>
        <text x="60" y="208" className="fill-foreground text-[11px]">
          • tune motion level
        </text>
        <text x="60" y="228" className="fill-foreground text-[11px]">
          • write section copy
        </text>
        <text x="60" y="248" className="fill-foreground text-[11px]">
          • place ticker stats
        </text>
        <text x="60" y="268" className="fill-foreground text-[11px]">
          • iterate on prototype
        </text>
        <text x="60" y="298" className="fill-muted-foreground text-[10px] italic">
          Chris does the design work
        </text>
        <text x="60" y="314" className="fill-muted-foreground text-[10px] italic">
          in a browser, not Figma
        </text>

        {/* Arrow 1 */}
        <line
          x1="290"
          y1="210"
          x2="340"
          y2="210"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdArrow)"
        />
        <text
          x="315"
          y="200"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          export
        </text>

        {/* Step 2: Handoff bundle */}
        <rect
          x="350"
          y="80"
          width="240"
          height="260"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="470"
          y="112"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          Handoff bundle
        </text>
        <text
          x="470"
          y="134"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          structured spec, not HTML
        </text>
        <text x="370" y="168" className="fill-foreground text-[11px]">
          • README.md design system
        </text>
        <text x="370" y="188" className="fill-foreground text-[11px]">
          • OKLCH color tokens
        </text>
        <text x="370" y="208" className="fill-foreground text-[11px]">
          • typography + spacing
        </text>
        <text x="370" y="228" className="fill-foreground text-[11px]">
          • v1 + v2 prototype HTML
        </text>
        <text x="370" y="248" className="fill-foreground text-[11px]">
          • 10 reference screenshots
        </text>
        <text x="370" y="268" className="fill-foreground text-[11px]">
          • motion specs + easing
        </text>
        <text x="370" y="298" className="fill-muted-foreground text-[10px] italic">
          Everything a second agent
        </text>
        <text x="370" y="314" className="fill-muted-foreground text-[10px] italic">
          needs to rebuild the look
        </text>

        {/* Arrow 2 */}
        <line
          x1="600"
          y1="210"
          x2="650"
          y2="210"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdArrow)"
        />
        <text
          x="625"
          y="200"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          build
        </text>

        {/* Step 3: Claude Code */}
        <rect
          x="660"
          y="80"
          width="220"
          height="260"
          rx="10"
          className="fill-green-500/10 stroke-green-500"
          strokeWidth="1.5"
        />
        <text
          x="770"
          y="112"
          textAnchor="middle"
          className="fill-green-400 text-[13px] font-semibold"
        >
          Claude Code
        </text>
        <text
          x="770"
          y="134"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          multi-agent rebuild
        </text>
        <text x="680" y="168" className="fill-foreground text-[11px]">
          • delta-patch tokens
        </text>
        <text x="680" y="188" className="fill-foreground text-[11px]">
          • rebuild masthead
        </text>
        <text x="680" y="208" className="fill-foreground text-[11px]">
          • long-scroll home
        </text>
        <text x="680" y="228" className="fill-foreground text-[11px]">
          • motion client layer
        </text>
        <text x="680" y="248" className="fill-foreground text-[11px]">
          • propagate to routes
        </text>
        <text x="680" y="268" className="fill-foreground text-[11px]">
          • UX + security review
        </text>
        <text x="680" y="298" className="fill-muted-foreground text-[10px] italic">
          Pixel-faithful rebuild in
        </text>
        <text x="680" y="314" className="fill-muted-foreground text-[10px] italic">
          the production stack
        </text>

        {/* Footer note */}
        <text
          x="450"
          y="380"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Zero new npm dependencies across the entire rebuild.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * The build team: lead orchestrator coordinating UX/UI QA, application security,
 * researcher, and the sequential-thinking planner.
 */
export function RedesignAgentTeamDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The build team: a lead developer orchestrates UX QA, security, and research agents, with sequential thinking driving the plan"
      }
    >
      <svg
        viewBox="0 0 820 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="rdTeamArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/70" />
          </marker>
        </defs>

        <text
          x="410"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          The redesign build team
        </text>

        {/* Sequential thinking (top) */}
        <rect
          x="290"
          y="60"
          width="240"
          height="56"
          rx="10"
          className="fill-amber-500/10 stroke-amber-500/70"
          strokeWidth="1.5"
        />
        <text
          x="410"
          y="84"
          textAnchor="middle"
          className="fill-amber-400 text-[13px] font-semibold"
        >
          Sequential thinking
        </text>
        <text
          x="410"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          phase planner
        </text>

        <line
          x1="410"
          y1="116"
          x2="410"
          y2="150"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdTeamArrow)"
        />

        {/* Lead dev (center) */}
        <rect
          x="270"
          y="155"
          width="280"
          height="70"
          rx="10"
          className="fill-primary/15 stroke-primary"
          strokeWidth="2"
        />
        <text
          x="410"
          y="184"
          textAnchor="middle"
          className="fill-primary text-[14px] font-semibold"
        >
          Lead web developer
        </text>
        <text
          x="410"
          y="204"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          orchestrator · owns the phase plan
        </text>

        {/* Three specialist agents */}
        {/* UX/UI QA */}
        <line
          x1="340"
          y1="225"
          x2="200"
          y2="300"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdTeamArrow)"
        />
        <rect
          x="60"
          y="310"
          width="260"
          height="110"
          rx="10"
          className="fill-cyan-500/10 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="190"
          y="338"
          textAnchor="middle"
          className="fill-cyan-400 text-[13px] font-semibold"
        >
          UX / UI QA agent
        </text>
        <text x="80" y="362" className="fill-foreground text-[11px]">
          • landmark + heading audit
        </text>
        <text x="80" y="382" className="fill-foreground text-[11px]">
          • reduced-motion gating
        </text>
        <text x="80" y="402" className="fill-foreground text-[11px]">
          • WCAG contrast + labels
        </text>

        {/* Security */}
        <line
          x1="410"
          y1="225"
          x2="410"
          y2="300"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdTeamArrow)"
        />
        <rect
          x="280"
          y="310"
          width="260"
          height="110"
          rx="10"
          className="fill-red-500/10 stroke-red-500/80"
          strokeWidth="1.5"
        />
        <text
          x="410"
          y="338"
          textAnchor="middle"
          className="fill-red-400 text-[13px] font-semibold"
        >
          Application security agent
        </text>
        <text x="300" y="362" className="fill-foreground text-[11px]">
          • form submit state gating
        </text>
        <text x="300" y="382" className="fill-foreground text-[11px]">
          • no secrets in client code
        </text>
        <text x="300" y="402" className="fill-foreground text-[11px]">
          • CSP + rate-limit checks
        </text>

        {/* Researcher */}
        <line
          x1="480"
          y1="225"
          x2="620"
          y2="300"
          className="stroke-muted-foreground/70"
          strokeWidth="1.5"
          markerEnd="url(#rdTeamArrow)"
        />
        <rect
          x="500"
          y="310"
          width="260"
          height="110"
          rx="10"
          className="fill-green-500/10 stroke-green-500"
          strokeWidth="1.5"
        />
        <text
          x="630"
          y="338"
          textAnchor="middle"
          className="fill-green-400 text-[13px] font-semibold"
        >
          Researcher agent
        </text>
        <text x="520" y="362" className="fill-foreground text-[11px]">
          • OKLCH color precedent
        </text>
        <text x="520" y="382" className="fill-foreground text-[11px]">
          • IntersectionObserver best
        </text>
        <text x="520" y="402" className="fill-foreground text-[11px]">
          • marquee CSS patterns
        </text>

        {/* Footer note */}
        <text
          x="410"
          y="450"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Parallel reviews. The lead dev resolves every finding before the phase closes.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Editorial system propagation: one page ships, the design system spreads across every route.
 */
export function EditorialPropagationDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "One EditorialPageHeader component propagates the design system across every content route on the site"
      }
    >
      <svg
        viewBox="0 0 820 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="rdPropArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/70" />
          </marker>
        </defs>

        <text
          x="410"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          How the editorial system reached every route
        </text>

        {/* Source: globals.css + EditorialPageHeader */}
        <rect
          x="280"
          y="60"
          width="260"
          height="90"
          rx="10"
          className="fill-primary/15 stroke-primary"
          strokeWidth="2"
        />
        <text
          x="410"
          y="88"
          textAnchor="middle"
          className="fill-primary text-[13px] font-semibold"
        >
          globals.css tokens
        </text>
        <text
          x="410"
          y="108"
          textAnchor="middle"
          className="fill-primary text-[13px] font-semibold"
        >
          + EditorialPageHeader
        </text>
        <text
          x="410"
          y="128"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          one component, one stylesheet
        </text>

        {/* Fan-out arrows */}
        {[
          { x: 80, label: "/about" },
          { x: 210, label: "/blog" },
          { x: 340, label: "/portfolio" },
          { x: 470, label: "/services" },
          { x: 600, label: "/skills" },
          { x: 720, label: "/contact" },
        ].map((node) => (
          <g key={node.label}>
            <line
              x1="410"
              y1="150"
              x2={node.x + 60}
              y2="230"
              className="stroke-muted-foreground/70"
              strokeWidth="1.5"
              markerEnd="url(#rdPropArrow)"
            />
            <rect
              x={node.x}
              y="240"
              width="120"
              height="50"
              rx="8"
              className="fill-cyan-500/10 stroke-cyan-500"
              strokeWidth="1.5"
            />
            <text
              x={node.x + 60}
              y="272"
              textAnchor="middle"
              className="fill-cyan-400 text-[12px] font-semibold"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Second row for the other routes */}
        {[
          { x: 160, label: "/resources" },
          { x: 340, label: "/guestbook" },
          { x: 520, label: "/backlog" },
        ].map((node) => (
          <g key={node.label}>
            <line
              x1="410"
              y1="150"
              x2={node.x + 60}
              y2="320"
              className="stroke-muted-foreground/70"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              markerEnd="url(#rdPropArrow)"
            />
            <rect
              x={node.x}
              y="330"
              width="120"
              height="50"
              rx="8"
              className="fill-cyan-500/5 stroke-cyan-500/70"
              strokeWidth="1.2"
            />
            <text
              x={node.x + 60}
              y="362"
              textAnchor="middle"
              className="fill-cyan-400 text-[12px] font-semibold"
            >
              {node.label}
            </text>
          </g>
        ))}

        <text
          x="410"
          y="420"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          /analytics inherits the masthead + footer automatically. Its body stayed untouched.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
