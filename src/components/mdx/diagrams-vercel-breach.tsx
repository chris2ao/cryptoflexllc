/** Vercel breach incident response diagrams: SVG-based, themed to site colors */

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
 * Five-party supply chain attack chain: commodity malware on a personal device
 * cascades through SaaS OAuth until it reaches customer production secrets.
 */
export function SupplyChainAttackDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "A 5-party attack chain. Commodity infostealer on a personal device cascades through two SaaS OAuth relationships and lands in customer production environment variables."
      }
    >
      <svg
        viewBox="0 0 940 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="vbArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-rose-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="470"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Fourth-Party Supply Chain: Lumma Stealer to cryptoflexllc
        </text>

        {/* Step 1: Lumma Stealer */}
        <rect
          x="20"
          y="60"
          width="170"
          height="130"
          rx="10"
          className="fill-rose-500/12 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="105"
          y="83"
          textAnchor="middle"
          className="fill-rose-300 text-[11px] font-semibold"
        >
          1. Infostealer
        </text>
        <text
          x="105"
          y="103"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Lumma Stealer
        </text>
        <text
          x="105"
          y="119"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          via Roblox lure
        </text>
        <text
          x="105"
          y="140"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Personal device of a
        </text>
        <text
          x="105"
          y="154"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Context.ai employee
        </text>
        <text
          x="105"
          y="175"
          textAnchor="middle"
          className="fill-rose-400/80 text-[9px]"
        >
          Commodity malware
        </text>

        <line
          x1="190"
          y1="125"
          x2="215"
          y2="125"
          className="stroke-rose-500/80"
          strokeWidth="1.5"
          markerEnd="url(#vbArrow)"
        />

        {/* Step 2: Google Workspace */}
        <rect
          x="215"
          y="60"
          width="170"
          height="130"
          rx="10"
          className="fill-rose-500/12 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="300"
          y="83"
          textAnchor="middle"
          className="fill-rose-300 text-[11px] font-semibold"
        >
          2. Workspace
        </text>
        <text
          x="300"
          y="103"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Context.ai
        </text>
        <text
          x="300"
          y="119"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Google Workspace
        </text>
        <text
          x="300"
          y="140"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Creds harvested
        </text>
        <text
          x="300"
          y="154"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          from the infected host
        </text>
        <text
          x="300"
          y="175"
          textAnchor="middle"
          className="fill-rose-400/80 text-[9px]"
        >
          Party 2 compromise
        </text>

        <line
          x1="385"
          y1="125"
          x2="410"
          y2="125"
          className="stroke-rose-500/80"
          strokeWidth="1.5"
          markerEnd="url(#vbArrow)"
        />

        {/* Step 3: OAuth pivot */}
        <rect
          x="410"
          y="60"
          width="170"
          height="130"
          rx="10"
          className="fill-rose-500/12 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="495"
          y="83"
          textAnchor="middle"
          className="fill-rose-300 text-[11px] font-semibold"
        >
          3. OAuth pivot
        </text>
        <text
          x="495"
          y="103"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Vercel employee
        </text>
        <text
          x="495"
          y="119"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          used enterprise SSO
        </text>
        <text
          x="495"
          y="133"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          on Context.ai consumer
        </text>
        <text
          x="495"
          y="155"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Allow All permissions
        </text>
        <text
          x="495"
          y="175"
          textAnchor="middle"
          className="fill-rose-400/80 text-[9px]"
        >
          Token replay to Vercel
        </text>

        <line
          x1="580"
          y1="125"
          x2="605"
          y2="125"
          className="stroke-rose-500/80"
          strokeWidth="1.5"
          markerEnd="url(#vbArrow)"
        />

        {/* Step 4: Vercel internal */}
        <rect
          x="605"
          y="60"
          width="170"
          height="130"
          rx="10"
          className="fill-rose-500/12 stroke-rose-500"
          strokeWidth="1.5"
        />
        <text
          x="690"
          y="83"
          textAnchor="middle"
          className="fill-rose-300 text-[11px] font-semibold"
        >
          4. Vercel internal
        </text>
        <text
          x="690"
          y="103"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Env var enumeration
        </text>
        <text
          x="690"
          y="119"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          on subset of customers
        </text>
        <text
          x="690"
          y="140"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          Only non-Sensitive
        </text>
        <text
          x="690"
          y="154"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          values were readable
        </text>
        <text
          x="690"
          y="175"
          textAnchor="middle"
          className="fill-rose-400/80 text-[9px]"
        >
          March to April 19, 2026
        </text>

        <line
          x1="775"
          y1="125"
          x2="800"
          y2="125"
          className="stroke-rose-500/80"
          strokeWidth="1.5"
          markerEnd="url(#vbArrow)"
        />

        {/* Step 5: Me */}
        <rect
          x="800"
          y="60"
          width="130"
          height="130"
          rx="10"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="865"
          y="83"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          5. Me
        </text>
        <text
          x="865"
          y="103"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          9 env vars
        </text>
        <text
          x="865"
          y="119"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          flagged
        </text>
        <text
          x="865"
          y="140"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Need To
        </text>
        <text
          x="865"
          y="154"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Rotate
        </text>
        <text
          x="865"
          y="175"
          textAnchor="middle"
          className="fill-amber-400/80 text-[9px]"
        >
          Customer impact
        </text>

        {/* Distance annotation */}
        <text
          x="470"
          y="225"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          Five degrees of separation. Zero touches on the customer.
        </text>

        {/* Relationship detail row */}
        <rect
          x="20"
          y="245"
          width="910"
          height="100"
          rx="10"
          className="fill-zinc-500/6 stroke-zinc-500/40"
          strokeWidth="1"
        />
        <text
          x="40"
          y="267"
          className="fill-zinc-400 text-[11px] font-semibold"
        >
          Trust relationships that made each hop possible
        </text>
        <text x="40" y="287" className="fill-muted-foreground text-[10px]">
          1 to 2: Employee logged in from infected host. Browser session cookies
          and saved credentials were local files.
        </text>
        <text x="40" y="304" className="fill-muted-foreground text-[10px]">
          2 to 3: Shared SSO boundary. Vercel employee used enterprise Google
          account to sign up for Context.ai consumer product, granted Allow All.
        </text>
        <text x="40" y="321" className="fill-muted-foreground text-[10px]">
          3 to 4: Valid Vercel-employee session was replayed. No MFA prompt
          because the session was already authenticated.
        </text>
        <text x="40" y="338" className="fill-muted-foreground text-[10px]">
          4 to 5: Env vars without the Sensitive flag are stored readable to
          internal tooling. The Sensitive flag is the only thing that gates that.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * The AI-assisted incident response loop as it actually ran.
 * User describes event, Claude Code scopes and plans, executes in parallel,
 * returns results, user confirms UI-gated steps, Claude verifies state.
 */
export function AIResponseLoopDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The AI-assisted incident response loop. Five stages, parallel execution where possible, and a verification gate after every mutation. The user stays in the driver's seat for anything that touches an external UI."
      }
    >
      <svg
        viewBox="0 0 920 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="vbrArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker
            id="vbrArrowEmerald"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="460"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Incident Response Loop with Claude Code
        </text>

        {/* Stage 1: Describe */}
        <rect
          x="40"
          y="55"
          width="240"
          height="80"
          rx="10"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="160"
          y="82"
          textAnchor="middle"
          className="fill-cyan-300 text-[12px] font-semibold"
        >
          1. Describe
        </text>
        <text
          x="160"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          User pastes breach writeup
        </text>
        <text
          x="160"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          plus access to relevant repos
        </text>

        <line
          x1="280"
          y1="95"
          x2="340"
          y2="95"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrow)"
        />

        {/* Stage 2: Scope + plan */}
        <rect
          x="340"
          y="55"
          width="240"
          height="80"
          rx="10"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="460"
          y="82"
          textAnchor="middle"
          className="fill-violet-300 text-[12px] font-semibold"
        >
          2. Scope and plan
        </text>
        <text
          x="460"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          grep env vars, map blast radius,
        </text>
        <text
          x="460"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          write plan.md with checkboxes
        </text>

        <line
          x1="580"
          y1="95"
          x2="640"
          y2="95"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrow)"
        />

        {/* Stage 3: Parallel execution */}
        <rect
          x="640"
          y="55"
          width="240"
          height="80"
          rx="10"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="760"
          y="82"
          textAnchor="middle"
          className="fill-amber-300 text-[12px] font-semibold"
        >
          3. Execute in parallel
        </text>
        <text
          x="760"
          y="102"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          API calls, CLI commands,
        </text>
        <text
          x="760"
          y="118"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          log pulls, secret scans
        </text>

        {/* Execution detail pod */}
        <rect
          x="40"
          y="175"
          width="840"
          height="130"
          rx="10"
          className="fill-amber-500/5 stroke-amber-500/40"
          strokeWidth="1.2"
        />
        <text
          x="60"
          y="197"
          className="fill-amber-400 text-[11px] font-semibold"
        >
          Parallel tool calls in a single message (the Claude Code force multiplier)
        </text>

        <rect x="60" y="210" width="195" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="157" y="231" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">grep ~/.claude/secrets</text>

        <rect x="265" y="210" width="195" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="362" y="231" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">curl /v6/deployments</text>

        <rect x="470" y="210" width="195" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="567" y="231" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">curl /v3/events</text>

        <rect x="675" y="210" width="195" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="772" y="231" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">curl /v5/user/tokens</text>

        <rect x="60" y="250" width="260" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="190" y="271" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">git log --all for committed secrets</text>

        <rect x="330" y="250" width="260" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="460" y="271" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">vercel env rm and re-add --sensitive</text>

        <rect x="600" y="250" width="270" height="34" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1" />
        <text x="735" y="271" textAnchor="middle" className="fill-amber-200 text-[10px] font-medium">openssl rand -hex 32 (HMAC regen)</text>

        <line
          x1="760"
          y1="135"
          x2="760"
          y2="175"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrow)"
        />

        {/* Arrow from exec pod to verify */}
        <line
          x1="460"
          y1="305"
          x2="460"
          y2="335"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrow)"
        />

        {/* Stage 4: Return + confirm */}
        <rect
          x="40"
          y="335"
          width="400"
          height="80"
          rx="10"
          className="fill-violet-500/12 stroke-violet-500"
          strokeWidth="1.5"
        />
        <text
          x="240"
          y="362"
          textAnchor="middle"
          className="fill-violet-300 text-[12px] font-semibold"
        >
          4. Return results, confirm UI-gated steps
        </text>
        <text
          x="240"
          y="382"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Neon password reset, Google app password regen,
        </text>
        <text
          x="240"
          y="398"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          Resend key delete, 2FA enrollment
        </text>

        <line
          x1="440"
          y1="375"
          x2="480"
          y2="375"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrow)"
        />

        {/* Stage 5: Verify */}
        <rect
          x="480"
          y="335"
          width="400"
          height="80"
          rx="10"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="680"
          y="362"
          textAnchor="middle"
          className="fill-emerald-300 text-[12px] font-semibold"
        >
          5. Verify state
        </text>
        <text
          x="680"
          y="382"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          vercel env ls (Sensitive flag true on all 9),
        </text>
        <text
          x="680"
          y="398"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          psql old URL (fails), smoke-test prod
        </text>

        {/* Loop back arrow */}
        <line
          x1="680"
          y1="415"
          x2="680"
          y2="460"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
        />
        <line
          x1="680"
          y1="460"
          x2="160"
          y2="460"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
        />
        <line
          x1="160"
          y1="460"
          x2="160"
          y2="135"
          className="stroke-emerald-500/80"
          strokeWidth="1.5"
          markerEnd="url(#vbrArrowEmerald)"
        />
        <text
          x="420"
          y="452"
          textAnchor="middle"
          className="fill-emerald-400 text-[10px]"
        >
          Next item on the checklist, same loop
        </text>

        {/* Footer: total */}
        <text
          x="460"
          y="502"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
        >
          Nine rotations plus hardening plus audit, all in roughly one hour.
        </text>
        <text
          x="460"
          y="521"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[10px]"
        >
          Estimated manual time: 6 to 8 hours, with higher chance of missed steps.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * The nine credentials ladder, ordered by blast radius.
 * Shows what breaks downstream if each is compromised, so rotation order makes sense.
 */
export function RotationLadderDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Nine credentials sorted by blast radius. Top of the ladder is the credential that would let an attacker rotate every other credential, so it goes first. The HMAC secrets sit last because they only sign locally."
      }
    >
      <svg
        viewBox="0 0 920 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="460"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Rotation Priority by Blast Radius
        </text>

        {/* Headers */}
        <text
          x="30"
          y="60"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          Order
        </text>
        <text
          x="90"
          y="60"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          Credential
        </text>
        <text
          x="330"
          y="60"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          What breaks if compromised
        </text>
        <text
          x="790"
          y="60"
          className="fill-muted-foreground text-[11px] font-semibold"
        >
          Blast radius
        </text>

        {/* Row 1: VERCEL_API_TOKEN */}
        <rect x="20" y="72" width="880" height="42" rx="6" className="fill-rose-500/15 stroke-rose-500" strokeWidth="1.3" />
        <text x="50" y="98" textAnchor="middle" className="fill-rose-300 text-[12px] font-semibold">1</text>
        <text x="90" y="90" className="fill-foreground text-[11px] font-semibold">VERCEL_API_TOKEN</text>
        <text x="90" y="105" className="fill-muted-foreground text-[9px]">Vercel account token</text>
        <text x="330" y="98" className="fill-muted-foreground text-[10px]">Modify deployments, envs, domains. Lets attacker re-rotate the others.</text>
        <text x="790" y="98" className="fill-rose-300 text-[10px] font-semibold">Catastrophic</text>

        {/* Row 2: DATABASE_URL */}
        <rect x="20" y="120" width="880" height="42" rx="6" className="fill-rose-500/12 stroke-rose-500/80" strokeWidth="1.3" />
        <text x="50" y="146" textAnchor="middle" className="fill-rose-300 text-[12px] font-semibold">2</text>
        <text x="90" y="138" className="fill-foreground text-[11px] font-semibold">DATABASE_URL</text>
        <text x="90" y="153" className="fill-muted-foreground text-[9px]">Neon Postgres</text>
        <text x="330" y="146" className="fill-muted-foreground text-[10px]">Read and write every subscriber, comment, and analytics row.</text>
        <text x="790" y="146" className="fill-rose-300 text-[10px] font-semibold">Severe</text>

        {/* Row 3: GITHUB_TOKEN */}
        <rect x="20" y="168" width="880" height="42" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1.3" />
        <text x="50" y="194" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">3</text>
        <text x="90" y="186" className="fill-foreground text-[11px] font-semibold">GITHUB_TOKEN</text>
        <text x="90" y="201" className="fill-muted-foreground text-[9px]">Personal access token</text>
        <text x="330" y="194" className="fill-muted-foreground text-[10px]">Push to repos. Scope-dependent, so limit to Contents: Read and write.</text>
        <text x="790" y="194" className="fill-amber-300 text-[10px] font-semibold">High</text>

        {/* Row 4: ANTHROPIC */}
        <rect x="20" y="216" width="880" height="42" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1.3" />
        <text x="50" y="242" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">4</text>
        <text x="90" y="234" className="fill-foreground text-[11px] font-semibold">ANTHROPIC_API_KEY</text>
        <text x="90" y="249" className="fill-muted-foreground text-[9px]">console.anthropic.com</text>
        <text x="330" y="242" className="fill-muted-foreground text-[10px]">Billing fraud, prompt exfiltration via usage logs.</text>
        <text x="790" y="242" className="fill-amber-300 text-[10px] font-semibold">High</text>

        {/* Row 5: RESEND */}
        <rect x="20" y="264" width="880" height="42" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1.3" />
        <text x="50" y="290" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">5</text>
        <text x="90" y="282" className="fill-foreground text-[11px] font-semibold">RESEND_API_KEY</text>
        <text x="90" y="297" className="fill-muted-foreground text-[9px]">resend.com</text>
        <text x="330" y="290" className="fill-muted-foreground text-[10px]">Send mail as contact@cryptoflexllc.com (phishing, reputation damage).</text>
        <text x="790" y="290" className="fill-amber-300 text-[10px] font-semibold">High</text>

        {/* Row 6: GMAIL */}
        <rect x="20" y="312" width="880" height="42" rx="6" className="fill-amber-500/12 stroke-amber-500/80" strokeWidth="1.3" />
        <text x="50" y="338" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">6</text>
        <text x="90" y="330" className="fill-foreground text-[11px] font-semibold">GMAIL_APP_PASSWORD</text>
        <text x="90" y="345" className="fill-muted-foreground text-[9px]">Google App Password</text>
        <text x="330" y="338" className="fill-muted-foreground text-[10px]">SMTP send as my personal Gmail. App-password scope, not full account.</text>
        <text x="790" y="338" className="fill-amber-300 text-[10px] font-semibold">Medium</text>

        {/* Row 7: ANALYTICS */}
        <rect x="20" y="360" width="880" height="42" rx="6" className="fill-zinc-500/12 stroke-zinc-500/80" strokeWidth="1.3" />
        <text x="50" y="386" textAnchor="middle" className="fill-zinc-300 text-[12px] font-semibold">7</text>
        <text x="90" y="378" className="fill-foreground text-[11px] font-semibold">ANALYTICS_SECRET</text>
        <text x="90" y="393" className="fill-muted-foreground text-[9px]">HMAC signing key</text>
        <text x="330" y="386" className="fill-muted-foreground text-[10px]">Forge analytics dashboard auth cookies. Local, no external surface.</text>
        <text x="790" y="386" className="fill-zinc-300 text-[10px] font-semibold">Low</text>

        {/* Row 8: SUBSCRIBER */}
        <rect x="20" y="408" width="880" height="42" rx="6" className="fill-zinc-500/12 stroke-zinc-500/80" strokeWidth="1.3" />
        <text x="50" y="434" textAnchor="middle" className="fill-zinc-300 text-[12px] font-semibold">8</text>
        <text x="90" y="426" className="fill-foreground text-[11px] font-semibold">SUBSCRIBER_SECRET</text>
        <text x="90" y="441" className="fill-muted-foreground text-[9px]">HMAC signing key</text>
        <text x="330" y="434" className="fill-muted-foreground text-[10px]">Forge unsubscribe tokens. Side effect: old unsubscribe links invalidate.</text>
        <text x="790" y="434" className="fill-zinc-300 text-[10px] font-semibold">Low</text>

        {/* Row 9: CRON */}
        <rect x="20" y="456" width="880" height="42" rx="6" className="fill-zinc-500/12 stroke-zinc-500/80" strokeWidth="1.3" />
        <text x="50" y="482" textAnchor="middle" className="fill-zinc-300 text-[12px] font-semibold">9</text>
        <text x="90" y="474" className="fill-foreground text-[11px] font-semibold">CRON_SECRET</text>
        <text x="90" y="489" className="fill-muted-foreground text-[9px]">HMAC signing key</text>
        <text x="330" y="482" className="fill-muted-foreground text-[10px]">Trigger Vercel cron endpoints. Vercel re-signs automatically after redeploy.</text>
        <text x="790" y="482" className="fill-zinc-300 text-[10px] font-semibold">Low</text>

        {/* Footer note */}
        <text
          x="30"
          y="520"
          className="fill-muted-foreground/70 text-[10px]"
        >
          Order rule: rotate the credential with the largest downstream blast radius first, so an attacker with a stale copy cannot use it to interfere with the rotation of the others.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
