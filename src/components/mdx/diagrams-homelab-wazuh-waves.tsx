/** Homelab Wazuh, Part 2 diagrams: wave dependency flow + parallel agent fan-out */

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
 * Nine-wave deployment flow with the captain pattern: each authoring wave
 * fans out parallel sub-agents, the Multipass E2E gate sits between
 * authoring (Waves 0-3) and live deploy (Waves 5+). This post covers
 * Waves 0-4 plus first contact in Wave 5.
 */
export function WazuhWavesDependencyDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Nine-wave deployment flow. Authoring waves (0-3) run repo-local with parallel sub-agents. Wave 4 is the Multipass end-to-end gate. Wave 5+ touches the live server. Captain owns every gate; sub-agents do the work."
      }
    >
      <svg
        viewBox="0 0 980 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="wwArrow"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker
            id="wwArrowAmber"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
        </defs>

        <text
          x="490"
          y="26"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Captain-orchestrated waves: this post covers 0 through first contact in 5
        </text>

        {/* Repo-local band */}
        <rect
          x="20"
          y="50"
          width="600"
          height="480"
          rx="12"
          className="fill-emerald-500/6 stroke-emerald-500/40"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="40"
          y="72"
          className="fill-emerald-300 text-[10px] font-semibold"
        >
          Repo-local authoring (no live server)
        </text>

        {/* Live band */}
        <rect
          x="640"
          y="50"
          width="320"
          height="480"
          rx="12"
          className="fill-amber-500/6 stroke-amber-500/40"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="660"
          y="72"
          className="fill-amber-300 text-[10px] font-semibold"
        >
          Live server (gates required)
        </text>

        {/* Wave 0 */}
        <rect
          x="40"
          y="92"
          width="200"
          height="62"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="114"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          Wave 0: Pre-flight
        </text>
        <text
          x="140"
          y="132"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Keychain vault wrapper
        </text>
        <text
          x="140"
          y="146"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          5 plan patches
        </text>

        {/* Wave 1 */}
        <rect
          x="40"
          y="184"
          width="200"
          height="62"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="206"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          Wave 1: Repo hygiene
        </text>
        <text
          x="140"
          y="224"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          pre-commit, CI, Makefile
        </text>
        <text
          x="140"
          y="238"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          Ansible scaffold + vault
        </text>

        {/* Parallel fan dots Wave 1 */}
        <circle cx="270" cy="200" r="4" className="fill-cyan-400" />
        <circle cx="290" cy="215" r="4" className="fill-cyan-400" />
        <circle cx="270" cy="230" r="4" className="fill-cyan-400" />
        <text
          x="320"
          y="218"
          className="fill-muted-foreground text-[9px]"
        >
          3 workers
        </text>

        {/* Wave 2 */}
        <rect
          x="40"
          y="276"
          width="200"
          height="62"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="298"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          Wave 2: 5 Ansible roles
        </text>
        <text
          x="140"
          y="316"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          common, hardening, docker
        </text>
        <text
          x="140"
          y="330"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          apcupsd, rsyslog_udm
        </text>

        {/* Parallel fan dots Wave 2 */}
        <circle cx="270" cy="292" r="4" className="fill-cyan-400" />
        <circle cx="290" cy="307" r="4" className="fill-cyan-400" />
        <circle cx="270" cy="322" r="4" className="fill-cyan-400" />
        <text
          x="320"
          y="310"
          className="fill-muted-foreground text-[9px]"
        >
          3 workers x 2 batches
        </text>

        {/* Wave 3 */}
        <rect
          x="40"
          y="368"
          width="200"
          height="62"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="140"
          y="390"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          Wave 3: Compose + manager
        </text>
        <text
          x="140"
          y="408"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          docker-compose, manager role
        </text>
        <text
          x="140"
          y="422"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          ILM policy, certs
        </text>

        {/* Captain synthesis lane */}
        <rect
          x="270"
          y="368"
          width="320"
          height="62"
          rx="8"
          className="fill-violet-500/10 stroke-violet-500/70"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x="430"
          y="390"
          textAnchor="middle"
          className="fill-violet-300 text-[10px] font-semibold"
        >
          Captain synthesis
        </text>
        <text
          x="430"
          y="408"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          bootstrap.yml, group_vars/all
        </text>
        <text
          x="430"
          y="422"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          (file-collision serialization)
        </text>

        {/* Captain synthesis lane Wave 2 */}
        <rect
          x="270"
          y="276"
          width="320"
          height="62"
          rx="8"
          className="fill-violet-500/10 stroke-violet-500/70"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x="430"
          y="298"
          textAnchor="middle"
          className="fill-violet-300 text-[10px] font-semibold"
        >
          Captain synthesis
        </text>
        <text
          x="430"
          y="316"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          bootstrap.yml, group_vars/all
        </text>
        <text
          x="430"
          y="330"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          (one author owns each file)
        </text>

        {/* Wave 4 (gate) */}
        <rect
          x="40"
          y="460"
          width="550"
          height="60"
          rx="8"
          className="fill-yellow-500/12 stroke-yellow-500"
          strokeWidth="2"
        />
        <text
          x="315"
          y="482"
          textAnchor="middle"
          className="fill-yellow-300 text-[11px] font-semibold"
        >
          Wave 4 gate: Multipass E2E (ephemeral vault)
        </text>
        <text
          x="315"
          y="500"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          4 attempts, 2 real bugs caught (cert filename, docker entrypoint), 1 arm64 wall hit
        </text>

        {/* Arrows down within left band */}
        <line
          x1="140"
          y1="154"
          x2="140"
          y2="184"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#wwArrow)"
        />
        <line
          x1="140"
          y1="246"
          x2="140"
          y2="276"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#wwArrow)"
        />
        <line
          x1="140"
          y1="338"
          x2="140"
          y2="368"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#wwArrow)"
        />
        <line
          x1="140"
          y1="430"
          x2="140"
          y2="460"
          className="stroke-cyan-500/80"
          strokeWidth="1.5"
          markerEnd="url(#wwArrow)"
        />

        {/* Wave 4 -> Wave 5 across band */}
        <line
          x1="590"
          y1="490"
          x2="660"
          y2="220"
          className="stroke-amber-500/80"
          strokeWidth="1.5"
          markerEnd="url(#wwArrowAmber)"
        />

        {/* Wave 5 (live, in-progress in this post) */}
        <rect
          x="660"
          y="184"
          width="280"
          height="74"
          rx="8"
          className="fill-amber-500/12 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="800"
          y="206"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          Wave 5: First contact
        </text>
        <text
          x="800"
          y="224"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          sudo-rs swap, vault rotate
        </text>
        <text
          x="800"
          y="238"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          group_vars shadow fix
        </text>
        <text
          x="800"
          y="252"
          textAnchor="middle"
          className="fill-muted-foreground text-[9px]"
        >
          bootstrap: 28 ok, 20 changed
        </text>

        {/* Waves 6-9 future */}
        <rect
          x="660"
          y="280"
          width="280"
          height="62"
          rx="8"
          className="fill-muted/20 stroke-muted-foreground/40"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <text
          x="800"
          y="302"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-semibold"
        >
          Waves 6-9: next post
        </text>
        <text
          x="800"
          y="320"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          stack stand-up, agents,
        </text>
        <text
          x="800"
          y="334"
          textAnchor="middle"
          className="fill-muted-foreground/80 text-[9px]"
        >
          UDM Pro syslog, day-2 ops
        </text>

        {/* footer */}
        <text
          x="490"
          y="552"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          Captain owns every gate. Sub-agents fan out for parallel files. File collisions serialize through the captain.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
