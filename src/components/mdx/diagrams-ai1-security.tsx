/** AI1 AI Security certification blog post diagrams: SVG-based, themed to site colors */

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
 * How the AI1 exam is scored. Left panel: 13 scenarios split into 7 static
 * (web-based) and 6 live (AI chatbot, the centerpiece). Center panel: the
 * live-scenario grading split, 80% AI transcript grader vs 20% flag
 * submission, drawn as a donut so the asymmetry reads at a glance. Right
 * panel: the five AI-graded rubric tiers as a descending ladder. Bottom:
 * the 70% pass line across the final averaged grade.
 */
export function AI1ScoringModelDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "13 hands-on scenarios across 4 sections, every scenario weighted equally regardless of raw marks available. 7 static web scenarios: selection questions score +1 for correct, 0 for a grey-area answer, and -1 for incorrect, floored at zero. Justification questions are AI-graded to a rubric. 6 live AI chatbot scenarios, the centerpiece, are graded 80% by an AI transcript reviewer against technique, reasoning, adaptability, and conduct, and 20% by flag submission checked against an answer key with partial credit. Final grade averages all 13 scenario scores. 70% or above passes. Universal disqualifiers zero an AI-graded response outright regardless of other content."
      }
    >
      <svg
        viewBox="0 0 980 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="ai1ScoreArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-primary/70" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="490"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[15px] font-semibold"
        >
          How the AI1 Exam Is Scored
        </text>
        <text
          x="490"
          y="48"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          13 hands-on scenarios across 4 sections, each weighted equally
        </text>

        {/* ===================== LEFT PANEL: 13 scenarios ===================== */}
        <rect
          x="20"
          y="64"
          width="300"
          height="474"
          rx="12"
          className="fill-muted/10 stroke-border"
          strokeWidth="1"
        />
        <text
          x="170"
          y="90"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          13 Scenarios / 4 Sections
        </text>
        <text
          x="170"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Scenario score = points / marks available
        </text>
        <text
          x="170"
          y="120"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Final grade = average of all 13 scores
        </text>

        {/* Box A: 7 Static */}
        <rect
          x="36"
          y="136"
          width="268"
          height="170"
          rx="8"
          className="fill-muted/15 stroke-border"
          strokeWidth="1"
        />
        <text
          x="170"
          y="160"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          7 Static (web-based)
        </text>
        <line x1="52" y1="172" x2="288" y2="172" className="stroke-border" strokeWidth="1" />
        <text x="52" y="192" className="fill-muted-foreground text-[10px]">
          Selection questions:
        </text>
        <text x="52" y="208" className="fill-foreground text-[10px]">
          +1 correct, 0 grey-area,
        </text>
        <text x="52" y="223" className="fill-foreground text-[10px]">
          -1 incorrect (floored at 0)
        </text>
        <line x1="52" y1="241" x2="288" y2="241" className="stroke-border" strokeWidth="1" />
        <text x="52" y="258" className="fill-muted-foreground text-[10px]">
          Justification questions:
        </text>
        <text x="52" y="274" className="fill-foreground text-[10px]">
          AI-graded to a rubric
        </text>

        {/* Box B: 6 Live (centerpiece) */}
        <rect
          x="36"
          y="316"
          width="268"
          height="222"
          rx="8"
          className="fill-primary/10 stroke-primary"
          strokeWidth="1.5"
        />
        <text
          x="170"
          y="340"
          textAnchor="middle"
          className="fill-primary text-[13px] font-semibold"
        >
          6 Live (AI chatbot)
        </text>
        <text
          x="170"
          y="356"
          textAnchor="middle"
          className="fill-primary text-[8px] font-bold"
        >
          THE CENTERPIECE
        </text>
        <line x1="52" y1="368" x2="288" y2="368" className="stroke-primary/30" strokeWidth="1" />
        <text x="52" y="388" className="fill-muted-foreground text-[10px]">
          Graded from two inputs:
        </text>
        <circle cx="58" cy="404" r="4" className="fill-primary" />
        <text x="70" y="408" className="fill-foreground text-[10px] font-semibold">
          80% AI grader (transcript)
        </text>
        <circle cx="58" cy="424" r="4" className="fill-amber-500" />
        <text x="70" y="428" className="fill-foreground text-[10px] font-semibold">
          20% flag submission
        </text>
        <text x="52" y="448" className="fill-muted-foreground text-[9px]">
          Evaluates technique, reasoning,
        </text>
        <text x="52" y="460" className="fill-muted-foreground text-[9px]">
          adaptability, and conduct.
        </text>
        <text x="52" y="478" className="fill-muted-foreground text-[9px]">
          Extracted values vs answer key,
        </text>
        <text x="52" y="490" className="fill-muted-foreground text-[9px]">
          partial credit allowed.
        </text>

        {/* Connector: live scenarios feed the 80/20 split */}
        <line
          x1="304"
          y1="427"
          x2="402"
          y2="250"
          className="stroke-primary/50"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          markerEnd="url(#ai1ScoreArrow)"
        />

        {/* ===================== CENTER PANEL: 80/20 split ===================== */}
        <rect
          x="340"
          y="64"
          width="300"
          height="474"
          rx="12"
          className="fill-card/40 stroke-primary/50"
          strokeWidth="1.2"
        />
        <text
          x="490"
          y="90"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          Live Scenario Grading
        </text>
        <text
          x="490"
          y="106"
          textAnchor="middle"
          className="fill-primary text-[10px] font-semibold"
        >
          The 80/20 split
        </text>

        {/* Donut: 80% AI grader, 20% flag submission */}
        <circle
          cx="490"
          cy="232"
          r="72"
          fill="none"
          className="stroke-muted"
          strokeWidth="30"
        />
        <circle
          cx="490"
          cy="232"
          r="72"
          fill="none"
          className="stroke-primary"
          strokeWidth="30"
          strokeDasharray="361.91 452.39"
          transform="rotate(-90 490 232)"
        />
        <circle
          cx="490"
          cy="232"
          r="72"
          fill="none"
          className="stroke-amber-500"
          strokeWidth="30"
          strokeDasharray="90.48 452.39"
          strokeDashoffset="-361.91"
          transform="rotate(-90 490 232)"
        />
        <text
          x="490"
          y="226"
          textAnchor="middle"
          className="fill-foreground text-[20px] font-bold"
        >
          80 / 20
        </text>
        <text
          x="490"
          y="244"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          AI grader / flag
        </text>

        {/* Legend row 1: AI grader */}
        <rect x="366" y="336" width="14" height="14" rx="3" className="fill-primary" />
        <text x="388" y="347" className="fill-foreground text-[11px] font-semibold">
          AI Grader: 80%
        </text>
        <text x="366" y="364" className="fill-muted-foreground text-[8px]">
          Reviews the full transcript vs
        </text>
        <text x="366" y="376" className="fill-muted-foreground text-[8px]">
          marking criteria: technique,
        </text>
        <text x="366" y="388" className="fill-muted-foreground text-[8px]">
          reasoning, adaptability, conduct.
        </text>

        {/* Legend row 2: Flag submission */}
        <rect x="366" y="406" width="14" height="14" rx="3" className="fill-amber-500" />
        <text x="388" y="417" className="fill-foreground text-[11px] font-semibold">
          Flag Submission: 20%
        </text>
        <text x="366" y="434" className="fill-muted-foreground text-[8px]">
          Extracted values checked
        </text>
        <text x="366" y="446" className="fill-muted-foreground text-[8px]">
          against answer key,
        </text>
        <text x="366" y="458" className="fill-muted-foreground text-[8px]">
          partial credit allowed.
        </text>

        {/* Disqualifier footnote */}
        <circle cx="372" cy="482" r="4" className="fill-red-500" />
        <text x="384" y="486" className="fill-muted-foreground text-[8px]">
          Universal disqualifiers zero
        </text>
        <text x="384" y="498" className="fill-muted-foreground text-[8px]">
          an AI-graded response outright.
        </text>

        {/* Connector to rubric ladder */}
        <line
          x1="640"
          y1="232"
          x2="660"
          y2="232"
          className="stroke-primary/60"
          strokeWidth="1.5"
          markerEnd="url(#ai1ScoreArrow)"
        />

        {/* ===================== RIGHT PANEL: rubric tiers ===================== */}
        <rect
          x="660"
          y="64"
          width="300"
          height="474"
          rx="12"
          className="fill-muted/10 stroke-border"
          strokeWidth="1"
        />
        <text
          x="810"
          y="90"
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
        >
          AI-Graded Rubric Tiers
        </text>
        <text
          x="810"
          y="106"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          How a live transcript response scores
        </text>

        {/* Row 1: Full marks */}
        <text x="680" y="134" className="fill-foreground text-[10px] font-semibold">
          Full marks
        </text>
        <rect x="680" y="140" width="260" height="12" rx="4" className="fill-emerald-500" />
        <text x="680" y="168" className="fill-muted-foreground text-[8px]">
          All key concepts covered,
        </text>
        <text x="680" y="180" className="fill-muted-foreground text-[8px]">
          specific technical reasoning.
        </text>

        {/* Row 2: Partial upper */}
        <text x="680" y="214" className="fill-foreground text-[10px] font-semibold">
          Partial (upper)
        </text>
        <rect x="680" y="220" width="200" height="12" rx="4" className="fill-emerald-500/60" />
        <text x="680" y="248" className="fill-muted-foreground text-[8px]">
          At least 70% of key points; one
        </text>
        <text x="680" y="260" className="fill-muted-foreground text-[8px]">
          important element vague or missing.
        </text>

        {/* Row 3: Partial lower */}
        <text x="680" y="294" className="fill-foreground text-[10px] font-semibold">
          Partial (lower)
        </text>
        <rect x="680" y="300" width="140" height="12" rx="4" className="fill-amber-500" />
        <text x="680" y="328" className="fill-muted-foreground text-[8px]">
          At least 40%; relevant understanding
        </text>
        <text x="680" y="340" className="fill-muted-foreground text-[8px]">
          with major gaps.
        </text>

        {/* Row 4: Minimal */}
        <text x="680" y="374" className="fill-foreground text-[10px] font-semibold">
          Minimal
        </text>
        <rect x="680" y="380" width="80" height="12" rx="4" className="fill-amber-500/50" />
        <text x="680" y="408" className="fill-muted-foreground text-[8px]">
          Under 40%; surface-level,
        </text>
        <text x="680" y="420" className="fill-muted-foreground text-[8px]">
          but not wrong.
        </text>

        {/* Row 5: Zero */}
        <text x="680" y="454" className="fill-foreground text-[10px] font-semibold">
          Zero
        </text>
        <rect x="680" y="460" width="30" height="12" rx="4" className="fill-red-500" />
        <text x="680" y="488" className="fill-muted-foreground text-[8px]">
          Blank, incorrect, or
        </text>
        <text x="680" y="500" className="fill-muted-foreground text-[8px]">
          contradicts the correct answer.
        </text>

        {/* ===================== BOTTOM: pass line ===================== */}
        <text
          x="490"
          y="566"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Final Grade = Average of All 13 Scenario Scores
        </text>
        <rect
          x="40"
          y="582"
          width="900"
          height="30"
          rx="6"
          className="fill-muted/30 stroke-border"
          strokeWidth="1"
        />
        <rect x="40" y="582" width="630" height="30" rx="6" className="fill-red-500/6" />
        <rect x="670" y="582" width="270" height="30" rx="6" className="fill-emerald-500/12" />
        <line
          x1="670"
          y1="574"
          x2="670"
          y2="620"
          className="stroke-emerald-500"
          strokeWidth="2"
        />
        <text
          x="670"
          y="568"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          70% PASS LINE
        </text>
        <text x="40" y="630" className="fill-muted-foreground text-[9px]">
          0%
        </text>
        <text x="940" y="630" textAnchor="end" className="fill-muted-foreground text-[9px]">
          100%
        </text>
        <text
          x="490"
          y="652"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px] italic"
        >
          7 static + 6 live scenarios, each scored independently, then averaged.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * AI agent data flow, user input through retrieval, model, output, and
 * action, with a visible dashed trust boundary between the untrusted
 * input/retrieval side and the trusted model/output/action side. Four
 * lessons are pinned at their exact points in the flow: data vs
 * instructions at retrieval, provenance at the retrieval corpus, supply
 * chain at the model artifact, and authorization enforced in code at the
 * action boundary.
 */
export function AI1TrustBoundaryDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "User input and retrieved content enter untrusted; the model, its output, and the action step run trusted. Four lessons pinned to where they live: retrieved content (a calendar entry, wiki page, document, or issue comment) must be handled as inert data, never concatenated into the instruction context, since indirect injection rides in on exactly that content. Authorization for the action step is enforced deterministically in code, keyed on identity, not on anything a user or document can phrase, because a model that is both guard and judge can be talked into opening its own gate. Model artifacts are software supply chain: SafeTensors cannot execute, pickle runs arbitrary code on load, and a checksum or signature proves origin and integrity, not that the contents are benign. A retrieval corpus is itself an authorization boundary, since similarity-only retrieval has no concept of truth or authority, so most similar quietly becomes most repeated by whoever could write to the corpus; provenance, cryptographically bound rather than string-matched, is the fix."
      }
    >
      <svg
        viewBox="0 0 980 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="ai1FlowArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker
            id="ai1FlowArrowPrimary"
            markerWidth="9"
            markerHeight="7"
            refX="8"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L9,3.5 L0,7 Z" className="fill-primary" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="490"
          y="28"
          textAnchor="middle"
          className="fill-foreground text-[15px] font-semibold"
        >
          AI Agent Trust Boundaries
        </text>
        <text
          x="490"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Four lessons pinned to where they live in the flow
        </text>

        {/* Zone backgrounds */}
        <rect
          x="15"
          y="60"
          width="390"
          height="215"
          rx="14"
          className="fill-red-500/5 stroke-red-500/25"
          strokeWidth="1.2"
        />
        <rect
          x="405"
          y="60"
          width="550"
          height="215"
          rx="14"
          className="fill-emerald-500/5 stroke-emerald-500/25"
          strokeWidth="1.2"
        />
        <text
          x="105"
          y="76"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-bold"
        >
          UNTRUSTED INPUT
        </text>
        <text
          x="675"
          y="76"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-bold"
        >
          TRUSTED EXECUTION
        </text>

        {/* Trust boundary line */}
        <line
          x1="405"
          y1="60"
          x2="405"
          y2="275"
          className="stroke-foreground/40"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <text
          x="405"
          y="168"
          textAnchor="middle"
          transform="rotate(-90 405 168)"
          className="fill-foreground text-[9px] font-bold"
        >
          TRUST BOUNDARY: POLICE THIS CROSSING
        </text>

        {/* Retrieval corpus (feeds Retrieval) */}
        <rect
          x="220"
          y="62"
          width="150"
          height="64"
          rx="8"
          className="fill-red-500/6 stroke-red-500/35"
          strokeWidth="1"
        />
        <text
          x="295"
          y="82"
          textAnchor="middle"
          className="fill-foreground text-[10px] font-semibold"
        >
          Retrieval Corpus
        </text>
        <text
          x="295"
          y="97"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          calendar, wiki, docs, issues
        </text>
        <rect
          x="235"
          y="104"
          width="120"
          height="18"
          rx="9"
          className="fill-amber-500/12 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text
          x="295"
          y="116"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-semibold"
        >
          Lesson 4: provenance
        </text>
        <line
          x1="295"
          y1="126"
          x2="295"
          y2="170"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#ai1FlowArrow)"
        />

        {/* Node 1: User Input */}
        <rect
          x="30"
          y="170"
          width="150"
          height="96"
          rx="10"
          className="fill-red-500/8 stroke-red-500/40"
          strokeWidth="1.2"
        />
        <text
          x="105"
          y="204"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          User Input
        </text>
        <text
          x="105"
          y="220"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          prompt / chat message
        </text>
        <text
          x="105"
          y="248"
          textAnchor="middle"
          className="fill-foreground text-[8px] italic"
        >
          untrusted
        </text>

        {/* Node 2: Retrieval */}
        <rect
          x="220"
          y="170"
          width="150"
          height="96"
          rx="10"
          className="fill-red-500/8 stroke-red-500/40"
          strokeWidth="1.2"
        />
        <text
          x="295"
          y="194"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Retrieval
        </text>
        <text
          x="295"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          content fetched into context
        </text>
        <rect
          x="232"
          y="220"
          width="126"
          height="34"
          rx="8"
          className="fill-amber-500/12 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text
          x="295"
          y="234"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-semibold"
        >
          Lesson 1:
        </text>
        <text
          x="295"
          y="247"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-semibold"
        >
          data, not instructions
        </text>

        {/* Node 3: Model */}
        <rect
          x="410"
          y="170"
          width="150"
          height="96"
          rx="10"
          className="fill-emerald-500/6 stroke-emerald-500/40"
          strokeWidth="1.2"
        />
        <text
          x="485"
          y="194"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Model
        </text>
        <text
          x="485"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          weights + config file
        </text>
        <rect
          x="422"
          y="220"
          width="126"
          height="34"
          rx="8"
          className="fill-primary/12 stroke-primary/40"
          strokeWidth="1"
        />
        <text
          x="485"
          y="234"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-semibold"
        >
          Lesson 3:
        </text>
        <text
          x="485"
          y="247"
          textAnchor="middle"
          className="fill-foreground text-[8px] font-semibold"
        >
          artifact = supply chain
        </text>

        {/* Node 4: Output */}
        <rect
          x="600"
          y="170"
          width="150"
          height="96"
          rx="10"
          className="fill-emerald-500/6 stroke-emerald-500/40"
          strokeWidth="1.2"
        />
        <text
          x="675"
          y="206"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Output
        </text>
        <text
          x="675"
          y="222"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          response / tool call
        </text>
        <text
          x="675"
          y="248"
          textAnchor="middle"
          className="fill-foreground text-[8px] italic"
        >
          trusted
        </text>

        {/* Node 5: Action */}
        <rect
          x="790"
          y="170"
          width="150"
          height="96"
          rx="10"
          className="fill-emerald-500/6 stroke-emerald-500/40"
          strokeWidth="1.2"
        />
        <text
          x="865"
          y="194"
          textAnchor="middle"
          className="fill-foreground text-[12px] font-semibold"
        >
          Action
        </text>
        <text
          x="865"
          y="210"
          textAnchor="middle"
          className="fill-muted-foreground text-[8px]"
        >
          execute / write / send
        </text>
        <rect
          x="802"
          y="220"
          width="126"
          height="34"
          rx="8"
          className="fill-primary/12 stroke-primary/40"
          strokeWidth="1"
        />
        <rect x="810" y="230" width="10" height="8" rx="1.5" className="fill-primary" />
        <path
          d="M812,230 v-4 a3,3 0 0 1 6,0 v4"
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <text x="826" y="234" className="fill-foreground text-[8px] font-semibold">
          Lesson 2:
        </text>
        <text x="826" y="247" className="fill-foreground text-[8px] font-semibold">
          auth lives in code
        </text>

        {/* Pipeline arrows */}
        <line
          x1="180"
          y1="218"
          x2="220"
          y2="218"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#ai1FlowArrow)"
        />
        <line
          x1="370"
          y1="218"
          x2="410"
          y2="218"
          className="stroke-primary"
          strokeWidth="2.5"
          markerEnd="url(#ai1FlowArrowPrimary)"
        />
        <line
          x1="560"
          y1="218"
          x2="600"
          y2="218"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#ai1FlowArrow)"
        />
        <line
          x1="750"
          y1="218"
          x2="790"
          y2="218"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#ai1FlowArrow)"
        />

        {/* Footer takeaway */}
        <text
          x="490"
          y="310"
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
        >
          The critical crossing: retrieval to model.
        </text>
        <text
          x="490"
          y="328"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Content entering the model&apos;s instruction context must be policed there.
        </text>
        <text
          x="490"
          y="344"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          The action boundary (right) is enforced in code, never left to the model alone.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
