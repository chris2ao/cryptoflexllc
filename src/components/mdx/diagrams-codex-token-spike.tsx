/** Codex token-spike blog post diagrams: SVG-based, themed to site colors */

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
 * Before/after of the background cron token load. The "before" column stacks the
 * roll-call token bomb and four agent-wrapped jobs all draining one weekly
 * subscription cap to 100%. The "after" column shows a zero-token digest plus two
 * intentional jobs leaving the cap with headroom.
 */
export function TokenBudgetFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Before: a daily roll-call burning 400k-600k tokens plus four agent-wrapped healthchecks drain one weekly Codex cap to 100%. After: a zero-token daily digest absorbs the healthcheck signal, leaving only the weekly memory synthesis and a zero-token backup against the cap."
      }
    >
      <svg
        viewBox="0 0 940 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="tbArrow"
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
          x="470"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Background Cron Token Load: Before and After
        </text>

        {/* ===================== BEFORE PANEL ===================== */}
        <rect
          x="20"
          y="48"
          width="430"
          height="490"
          rx="10"
          className="fill-rose-500/5 stroke-rose-500/40"
          strokeWidth="1"
        />
        <text
          x="40"
          y="72"
          className="fill-rose-500/90 text-[12px] font-semibold"
        >
          Before: ~11 gpt-5.5 agent runs/day
        </text>

        {/* Roll-call token bomb */}
        <rect
          x="40"
          y="88"
          width="390"
          height="58"
          rx="8"
          className="fill-rose-500/10 stroke-rose-500/50"
          strokeWidth="1"
        />
        <text x="56" y="112" className="fill-foreground text-[11px] font-semibold">
          report:daily-roll-call
        </text>
        <text x="56" y="130" className="fill-muted-foreground text-[10px]">
          reads all 7 transcripts + memory
        </text>
        <text
          x="414"
          y="122"
          textAnchor="end"
          className="fill-rose-500 text-[12px] font-semibold"
        >
          400k-600k tok/day
        </text>

        {/* Four agent-wrapped jobs */}
        <rect
          x="40"
          y="158"
          width="390"
          height="118"
          rx="8"
          className="fill-rose-500/8 stroke-rose-500/40"
          strokeWidth="1"
        />
        <text x="56" y="180" className="fill-foreground text-[11px] font-semibold">
          4 agentTurn jobs wrap a shell script
        </text>
        <text x="56" y="200" className="fill-muted-foreground text-[10px]">
          report:roll-call-validator
        </text>
        <text x="56" y="218" className="fill-muted-foreground text-[10px]">
          healthcheck:team-usage (every 8h)
        </text>
        <text x="56" y="236" className="fill-muted-foreground text-[10px]">
          healthcheck:update-status (every 8h)
        </text>
        <text x="56" y="254" className="fill-muted-foreground text-[10px]">
          healthcheck:cron-health
        </text>
        <text
          x="414"
          y="200"
          textAnchor="end"
          className="fill-rose-500 text-[11px] font-semibold"
        >
          boots a model
        </text>
        <text
          x="414"
          y="216"
          textAnchor="end"
          className="fill-muted-foreground text-[10px]"
        >
          to run `sh`
        </text>

        {/* Watchdog flapping */}
        <rect
          x="40"
          y="288"
          width="390"
          height="50"
          rx="8"
          className="fill-amber-500/8 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text x="56" y="308" className="fill-foreground text-[11px] font-semibold">
          watchdog flapping: ~120 restarts/day
        </text>
        <text x="56" y="326" className="fill-muted-foreground text-[10px]">
          interrupts cron mid-turn, forces retries
        </text>

        {/* Arrow down to cap */}
        <line
          x1="235"
          y1="338"
          x2="235"
          y2="392"
          className="stroke-muted-foreground/50"
          strokeWidth="1.5"
          markerEnd="url(#tbArrow)"
        />

        {/* Weekly cap bar BEFORE (100%) */}
        <text x="40" y="382" className="fill-muted-foreground text-[10px]">
          Weekly Codex subscription cap
        </text>
        <rect
          x="40"
          y="396"
          width="390"
          height="26"
          rx="6"
          className="fill-muted/40 stroke-muted-foreground/30"
          strokeWidth="1"
        />
        <rect
          x="40"
          y="396"
          width="390"
          height="26"
          rx="6"
          className="fill-rose-500/70"
        />
        <text
          x="235"
          y="414"
          textAnchor="middle"
          className="fill-background text-[12px] font-semibold"
        >
          Week window: 100% used
        </text>
        <text x="40" y="446" className="fill-muted-foreground text-[10px]">
          5-hour window: 1% (drain was in the past, not now)
        </text>

        {/* ===================== AFTER PANEL ===================== */}
        <rect
          x="490"
          y="48"
          width="430"
          height="490"
          rx="10"
          className="fill-emerald-500/5 stroke-emerald-500/40"
          strokeWidth="1"
        />
        <text
          x="510"
          y="72"
          className="fill-emerald-500/90 text-[12px] font-semibold"
        >
          After: 1 weekly agent job + 2 zero-token jobs
        </text>

        {/* Zero-token digest */}
        <rect
          x="510"
          y="88"
          width="390"
          height="76"
          rx="8"
          className="fill-emerald-500/10 stroke-emerald-500/50"
          strokeWidth="1"
        />
        <text x="526" y="112" className="fill-foreground text-[11px] font-semibold">
          report:daily-digest (command payload)
        </text>
        <text x="526" y="130" className="fill-muted-foreground text-[10px]">
          daily-digest.py: usage + updates + cron health
        </text>
        <text x="526" y="148" className="fill-muted-foreground text-[10px]">
          self-delivers via openclaw message send
        </text>
        <text
          x="884"
          y="112"
          textAnchor="end"
          className="fill-emerald-500 text-[12px] font-semibold"
        >
          0 tokens
        </text>

        {/* Kept backup */}
        <rect
          x="510"
          y="176"
          width="390"
          height="48"
          rx="8"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1"
        />
        <text x="526" y="196" className="fill-foreground text-[11px] font-semibold">
          backup:openclaw-config-github
        </text>
        <text x="526" y="214" className="fill-muted-foreground text-[10px]">
          command payload, git push
        </text>
        <text
          x="884"
          y="204"
          textAnchor="end"
          className="fill-emerald-500 text-[11px] font-semibold"
        >
          0 tokens
        </text>

        {/* Kept weekly synthesis */}
        <rect
          x="510"
          y="236"
          width="390"
          height="48"
          rx="8"
          className="fill-cyan-500/8 stroke-cyan-500/40"
          strokeWidth="1"
        />
        <text x="526" y="256" className="fill-foreground text-[11px] font-semibold">
          memory:weekly-synthesis
        </text>
        <text x="526" y="274" className="fill-muted-foreground text-[10px]">
          agentTurn, Mondays, intentional reasoning
        </text>
        <text
          x="884"
          y="266"
          textAnchor="end"
          className="fill-cyan-500 text-[11px] font-semibold"
        >
          weekly
        </text>

        {/* Watchdog fixed */}
        <rect
          x="510"
          y="296"
          width="390"
          height="42"
          rx="8"
          className="fill-emerald-500/8 stroke-emerald-500/40"
          strokeWidth="1"
        />
        <text x="526" y="322" className="fill-foreground text-[11px] font-semibold">
          watchdog: TCP probe, fails open (no flapping)
        </text>

        {/* Arrow down to cap */}
        <line
          x1="705"
          y1="338"
          x2="705"
          y2="392"
          className="stroke-muted-foreground/50"
          strokeWidth="1.5"
          markerEnd="url(#tbArrow)"
        />

        {/* Weekly cap bar AFTER (headroom) */}
        <text x="510" y="382" className="fill-muted-foreground text-[10px]">
          Weekly Codex subscription cap
        </text>
        <rect
          x="510"
          y="396"
          width="390"
          height="26"
          rx="6"
          className="fill-muted/40 stroke-muted-foreground/30"
          strokeWidth="1"
        />
        <rect
          x="510"
          y="396"
          width="120"
          height="26"
          rx="6"
          className="fill-emerald-500/70"
        />
        <text
          x="570"
          y="414"
          textAnchor="middle"
          className="fill-background text-[11px] font-semibold"
        >
          headroom
        </text>
        <text x="510" y="446" className="fill-muted-foreground text-[10px]">
          background floor reduced to ~2 agent runs/day
        </text>

        {/* Footnote */}
        <text
          x="470"
          y="512"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Deterministic work moved to no-agent command payloads = zero Codex tokens, immune to the rate limit.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
