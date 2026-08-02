/** AI1 post threat-model diagrams: CI/CD indirect injection chain and the OWASP LLM Top 10 map */

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

/** One stage of the CI/CD attack chain. */
const CHAIN_STAGES = [
  {
    x: 20,
    n: "1",
    heading: "Public issue filed",
    body: [
      "Anyone can open an issue on",
      "a public repo. Instructions",
      "hidden inside an HTML",
      "comment, invisible in the",
      "rendered UI.",
    ],
    tag: "untrusted input",
    hostile: true,
  },
  {
    x: 212,
    n: "2",
    heading: "Workflow triggers",
    body: [
      "The GitHub Action fires and",
      "pulls the issue body into",
      "the agent's context, the",
      "same way it would for a",
      "legitimate report.",
    ],
    tag: "trust inherited",
    hostile: false,
  },
  {
    x: 404,
    n: "3",
    heading: "No boundary",
    body: [
      "Issue text and the agent's",
      "own instructions now share",
      "one context window. Nothing",
      "in the payload marks which",
      "is data and which is order.",
    ],
    tag: "LLM01",
    hostile: false,
  },
  {
    x: 596,
    n: "4",
    heading: "Agent acts",
    body: [
      "Induced to read",
      "/proc/self/environ on the",
      "runner. The payload frames",
      "it as a routine compliance",
      "review, so it reads normal.",
    ],
    tag: "LLM06 / ASI03",
    hostile: false,
  },
  {
    x: 788,
    n: "5",
    heading: "Secrets leave",
    body: [
      "Runner environment values,",
      "including an API key, are",
      "read back out. Credential",
      "truncated on the way to",
      "dodge secret scanning.",
    ],
    tag: "LLM02",
    hostile: true,
  },
] as const;

const TRIFECTA = [
  {
    x: 36,
    title: "Private data",
    body: "Secrets and environment values on the CI runner",
  },
  {
    x: 344,
    title: "Untrusted content",
    body: "A public issue that any account can file",
  },
  {
    x: 652,
    title: "External comms",
    body: "The agent writes results back where they can be read",
  },
] as const;

/**
 * Threat model for the June 2026 Claude Code GitHub Action disclosure.
 * Five-stage chain left to right, with the trust boundary drawn between the
 * untrusted issue and everything downstream that inherits its content.
 * Bottom band shows all three lethal-trifecta ingredients present at once,
 * then the escalation footer noting the same class reaching RCE in Cursor.
 */
export function CIPipelineInjectionDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Threat model for indirect prompt injection in CI/CD, based on the June 2026 Claude Code GitHub Action disclosure. Stage 1: an attacker files a public GitHub issue with instructions hidden inside an HTML comment, invisible in the rendered UI. Stage 2: the GitHub Action triggers and pulls the issue body into the agent's context exactly as it would a legitimate report, so the untrusted content inherits the workflow's trust. Stage 3: the issue text and the agent's own instructions share a single context window with nothing marking which is data and which is an order, the condition OWASP files as LLM01 Prompt Injection. Stage 4: the agent is induced to read /proc/self/environ on the CI runner, with the payload framed as a routine compliance review. Stage 5: runner environment values including an API key are read back out, with the credential truncated to evade secret scanning. All three ingredients of the lethal trifecta are present at once: private data on the runner, untrusted content from a public issue, and an external channel to communicate through. The same bug class reached full remote code execution in Cursor's IDE via a poisoned MCP response, tracked as CVE-2026-50548."
      }
    >
      <svg
        viewBox="0 0 980 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="ai1ThreatArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-primary/70" />
          </marker>
        </defs>

        <text
          x="490"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[15px] font-semibold"
        >
          Indirect Prompt Injection in CI/CD
        </text>
        <text
          x="490"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Claude Code GitHub Action, disclosed June 2026, patched in v2.1.128
        </text>

        {/* Trust boundary between the untrusted issue and everything downstream */}
        <line
          x1="202"
          y1="82"
          x2="202"
          y2="262"
          className="stroke-red-500/40"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text
          x="202"
          y="74"
          textAnchor="middle"
          className="fill-destructive text-[9px] font-semibold"
        >
          trust boundary
        </text>

        {/* ===================== Five-stage chain ===================== */}
        {CHAIN_STAGES.map((s) => (
          <g key={s.n}>
            <rect
              x={s.x}
              y="90"
              width="172"
              height="160"
              rx="8"
              className={
                s.hostile
                  ? "fill-red-500/8 stroke-red-500/40"
                  : "fill-muted/10 stroke-border"
              }
              strokeWidth="1"
            />
            <circle
              cx={s.x + 20}
              cy="110"
              r="10"
              className={s.hostile ? "fill-red-500/20" : "fill-primary/15"}
            />
            <text
              x={s.x + 20}
              y="114"
              textAnchor="middle"
              className={
                s.hostile
                  ? "fill-destructive text-[10px] font-semibold"
                  : "fill-foreground text-[10px] font-semibold"
              }
            >
              {s.n}
            </text>
            <text
              x={s.x + 38}
              y="114"
              className="fill-foreground text-[11px] font-semibold"
            >
              {s.heading}
            </text>
            <line
              x1={s.x + 12}
              y1="126"
              x2={s.x + 160}
              y2="126"
              className="stroke-border"
              strokeWidth="1"
            />
            {s.body.map((line, i) => (
              <text
                key={line}
                x={s.x + 12}
                y={144 + i * 13}
                className="fill-muted-foreground text-[9px]"
              >
                {line}
              </text>
            ))}
            <rect
              x={s.x + 12}
              y="220"
              width="112"
              height="18"
              rx="4"
              className={
                s.hostile ? "fill-red-500/12" : "fill-primary/10"
              }
            />
            <text
              x={s.x + 20}
              y="232"
              className={
                s.hostile
                  ? "fill-destructive text-[8px] font-semibold"
                  : "fill-foreground text-[8px] font-semibold"
              }
            >
              {s.tag}
            </text>
          </g>
        ))}

        {/* Chain arrows */}
        {[194, 386, 578, 770].map((x) => (
          <line
            key={x}
            x1={x}
            y1="170"
            x2={x + 15}
            y2="170"
            className="stroke-primary/70"
            strokeWidth="1.5"
            markerEnd="url(#ai1ThreatArrow)"
          />
        ))}

        {/* ===================== Lethal trifecta band ===================== */}
        <rect
          x="20"
          y="278"
          width="940"
          height="116"
          rx="10"
          className="fill-amber-500/6 stroke-amber-500/40"
          strokeWidth="1"
        />
        <text
          x="36"
          y="302"
          className="fill-foreground text-[12px] font-semibold"
        >
          All three ingredients of the lethal trifecta, present at once
        </text>
        <text x="36" y="318" className="fill-muted-foreground text-[9px]">
          Any two of these is usually survivable. The third is what turns a bug into an incident.
        </text>

        {TRIFECTA.map((t) => (
          <g key={t.title}>
            <rect
              x={t.x}
              y="328"
              width="292"
              height="52"
              rx="6"
              className="fill-muted/10 stroke-border"
              strokeWidth="1"
            />
            <text
              x={t.x + 14}
              y="350"
              className="fill-foreground text-[11px] font-semibold"
            >
              {t.title}
            </text>
            <text
              x={t.x + 14}
              y="366"
              className="fill-muted-foreground text-[9px]"
            >
              {t.body}
            </text>
          </g>
        ))}

        {/* ===================== Escalation footer ===================== */}
        <rect
          x="20"
          y="408"
          width="940"
          height="84"
          rx="10"
          className="fill-red-500/6 stroke-red-500/40"
          strokeWidth="1"
        />
        <text x="36" y="432" className="fill-destructive text-[12px] font-semibold">
          Same bug class, escalated
        </text>
        <text x="36" y="452" className="fill-muted-foreground text-[9px]">
          In Cursor&apos;s IDE the same pattern reached full remote code execution through a poisoned MCP response
        </text>
        <text x="36" y="466" className="fill-muted-foreground text-[9px]">
          (DuneSlide, CVE-2026-50548). Prompt injection is not a content-moderation problem.
        </text>
        <text x="36" y="482" className="fill-muted-foreground text-[8px]">
          Disclosed by RyotaK at GMO Flatt Security. Independently confirmed by Microsoft Threat Intelligence.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/** The 2025 OWASP LLM Top 10, with the four lessons anchored to their categories. */
const OWASP_LLM = [
  {
    id: "LLM01",
    title: "Prompt Injection",
    gloss: "Lesson 1: does the code enforce data versus instructions?",
    lesson: true,
  },
  {
    id: "LLM02",
    title: "Sensitive Information Disclosure",
    gloss: "What the system reveals that it was never meant to",
    lesson: false,
  },
  {
    id: "LLM03",
    title: "Supply Chain",
    gloss: "Lesson 3: a model file is software supply chain",
    lesson: true,
  },
  {
    id: "LLM04",
    title: "Data and Model Poisoning",
    gloss: "Lesson 4: corrupted training or retrieval content",
    lesson: true,
  },
  {
    id: "LLM05",
    title: "Improper Output Handling",
    gloss: "Model output trusted by whatever consumes it next",
    lesson: false,
  },
  {
    id: "LLM06",
    title: "Excessive Agency",
    gloss: "Lesson 2: authorization has to live outside the model",
    lesson: true,
  },
  {
    id: "LLM07",
    title: "System Prompt Leakage",
    gloss: "Instructions treated as though they were secrets",
    lesson: false,
  },
  {
    id: "LLM08",
    title: "Vector and Embedding Weaknesses",
    gloss: "Lesson 4: the retrieval corpus is an authz boundary",
    lesson: true,
  },
  {
    id: "LLM09",
    title: "Misinformation",
    gloss: "Confident output that is simply wrong",
    lesson: false,
  },
  {
    id: "LLM10",
    title: "Unbounded Consumption",
    gloss: "Cost and availability as a security property",
    lesson: false,
  },
] as const;

/**
 * The 2025 OWASP LLM Top 10 as a two-column map, with the five categories
 * the post's four lessons land on accented. Footer ties the same lessons to
 * the separate 2026 agentic list, since two of them only have an ASI number.
 */
export function OWASPLLMTop10Diagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The OWASP Top 10 for LLM Applications, 2025 edition. LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector and Embedding Weaknesses, LLM09 Misinformation, and LLM10 Unbounded Consumption. The four lessons in this post land on five of those categories: lesson one, the data versus instruction boundary, is LLM01. Lesson two, keeping authorization outside the model, is LLM06. Lesson three, treating a model file as software supply chain, is LLM03. Lesson four, treating a retrieval corpus as an authorization boundary, spans LLM04 and LLM08. OWASP publishes a separate Top 10 for Agentic Applications for 2026, where the same lessons map to ASI03 Identity and Privilege Abuse, ASI04 Agentic Supply Chain Vulnerabilities, and ASI06 Memory and Context Poisoning."
      }
    >
      <svg
        viewBox="0 0 980 546"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <text
          x="490"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[15px] font-semibold"
        >
          OWASP Top 10 for LLM Applications (2025)
        </text>
        <text
          x="490"
          y="46"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Four lessons from this post land on five of these categories
        </text>

        {OWASP_LLM.map((c, i) => {
          const col = i < 5 ? 0 : 1;
          const row = i % 5;
          const x = col === 0 ? 20 : 505;
          const y = 76 + row * 72;
          return (
            <g key={c.id}>
              <rect
                x={x}
                y={y}
                width="455"
                height="62"
                rx="8"
                className={
                  c.lesson
                    ? "fill-primary/8 stroke-primary/50"
                    : "fill-muted/10 stroke-border"
                }
                strokeWidth="1"
              />
              <rect
                x={x + 12}
                y={y + 14}
                width="58"
                height="20"
                rx="4"
                className={c.lesson ? "fill-primary/25" : "fill-muted/25"}
              />
              <text
                x={x + 41}
                y={y + 28}
                textAnchor="middle"
                className="fill-foreground text-[10px] font-semibold"
              >
                {c.id}
              </text>
              <text
                x={x + 82}
                y={y + 28}
                className="fill-foreground text-[12px] font-semibold"
              >
                {c.title}
              </text>
              <text
                x={x + 82}
                y={y + 46}
                className="fill-muted-foreground text-[9px]"
              >
                {c.gloss}
              </text>
            </g>
          );
        })}

        {/* Footer: the agentic list carries two of the lessons on its own numbering */}
        <rect
          x="20"
          y="452"
          width="940"
          height="76"
          rx="10"
          className="fill-muted/10 stroke-border"
          strokeWidth="1"
        />
        <text
          x="36"
          y="476"
          className="fill-foreground text-[11px] font-semibold"
        >
          The agentic list numbers the same lessons separately
        </text>
        <text x="36" y="496" className="fill-muted-foreground text-[9px]">
          OWASP publishes a distinct Top 10 for Agentic Applications (2026). Lesson 2 maps to ASI03 Identity and
        </text>
        <text x="36" y="510" className="fill-muted-foreground text-[9px]">
          Privilege Abuse, lesson 3 to ASI04 Agentic Supply Chain Vulnerabilities, and lesson 4 to ASI06 Memory
        </text>
        <text x="36" y="524" className="fill-muted-foreground text-[9px]">
          and Context Poisoning. MITRE ATLAS catalogs the concrete techniques underneath all of them.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
