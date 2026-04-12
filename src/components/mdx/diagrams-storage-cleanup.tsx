/** Storage Cleanup blog post diagrams -- SVG-based, themed to site colors */

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

/** Storage cleanup workflow: Discovery -> Classification -> Action per category */
export function StorageCleanupFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The 5-phase storage cleanup workflow: scan, classify, report, execute, manifest"
      }
    >
      <svg
        viewBox="0 0 920 620"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="scArrow"
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
          x="460"
          y="30"
          textAnchor="middle"
          className="fill-foreground text-base font-bold"
        >
          Storage Cleanup Pipeline
        </text>

        {/* Phase 1: Discovery - 3 parallel scan agents */}
        <rect
          x="10"
          y="50"
          width="900"
          height="120"
          rx="8"
          className="fill-muted/30 stroke-border"
          strokeWidth="1"
        />
        <text
          x="30"
          y="72"
          className="fill-primary text-sm font-semibold"
        >
          Phase 1: Discovery (Parallel)
        </text>

        {/* Agent 1 */}
        <rect
          x="30"
          y="84"
          width="270"
          height="70"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="165" y="107" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Agent 1: System Overview
        </text>
        <text x="165" y="122" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          df -h, du -sh ~/Library
        </text>
        <text x="165" y="135" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          ~/GitProjects, hidden dirs
        </text>

        {/* Agent 2 */}
        <rect
          x="320"
          y="84"
          width="270"
          height="70"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="455" y="107" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Agent 2: Library Deep Dive
        </text>
        <text x="455" y="122" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          App Support, Caches, Containers
        </text>
        <text x="455" y="135" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Mail, Messages, Logs
        </text>

        {/* Agent 3 */}
        <rect
          x="610"
          y="84"
          width="270"
          height="70"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="745" y="107" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Agent 3: Dev Artifacts
        </text>
        <text x="745" y="122" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          node_modules, .next, Xcode
        </text>
        <text x="745" y="135" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          brew cache, Playwright
        </text>

        {/* Arrow down from Discovery to Classification */}
        <line
          x1="460"
          y1="170"
          x2="460"
          y2="195"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#scArrow)"
        />

        {/* Phase 2: Classification - 4 categories */}
        <rect
          x="10"
          y="200"
          width="900"
          height="160"
          rx="8"
          className="fill-muted/30 stroke-border"
          strokeWidth="1"
        />
        <text
          x="30"
          y="222"
          className="fill-primary text-sm font-semibold"
        >
          Phase 2: Classification
        </text>

        {/* Category A - Green */}
        <rect
          x="30"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="stroke-green-500/60"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x="30"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="fill-green-500/10"
        />
        <text x="130" y="254" textAnchor="middle" className="fill-green-400 text-xs font-bold">
          A: Safely Deletable
        </text>
        <text x="130" y="270" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          .next caches (1.9 GB)
        </text>
        <text x="130" y="283" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          node_modules (1.9 GB)
        </text>
        <text x="130" y="296" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Xcode DerivedData (739 MB)
        </text>
        <text x="130" y="309" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          brew + Playwright (~1.9 GB)
        </text>
        <text x="130" y="330" textAnchor="middle" className="fill-green-400 text-[10px] font-semibold">
          Total: ~7 GB
        </text>

        {/* Category B - Blue */}
        <rect
          x="250"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="stroke-blue-500/60"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x="250"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="fill-blue-500/10"
        />
        <text x="350" y="254" textAnchor="middle" className="fill-blue-400 text-xs font-bold">
          B: Move to External
        </text>
        <text x="350" y="270" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Claude archives (2.6 GB)
        </text>
        <text x="350" y="283" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          iOS DeviceSupport (5.5 GB)
        </text>
        <text x="350" y="296" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          CoreSimulator (4.5 GB)
        </text>
        <text x="350" y="309" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Inactive repos
        </text>
        <text x="350" y="330" textAnchor="middle" className="fill-blue-400 text-[10px] font-semibold">
          Total: ~13 GB
        </text>

        {/* Category C - Amber */}
        <rect
          x="470"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="stroke-yellow-500/60"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x="470"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="fill-yellow-500/10"
        />
        <text x="570" y="254" textAnchor="middle" className="fill-yellow-400 text-xs font-bold">
          C: Settings-Based
        </text>
        <text x="570" y="276" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          iMessage Attachments
        </text>
        <text x="570" y="289" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          (29 GB local cache)
        </text>
        <text x="570" y="310" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Safe to delete from Finder
        </text>
        <text x="570" y="330" textAnchor="middle" className="fill-yellow-400 text-[10px] font-semibold">
          Potential: ~29 GB
        </text>

        {/* Category D - Gray */}
        <rect
          x="690"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="stroke-muted-foreground/40"
          strokeWidth="1.5"
          fill="none"
        />
        <rect
          x="690"
          y="234"
          width="200"
          height="110"
          rx="6"
          className="fill-muted/20"
        />
        <text x="790" y="254" textAnchor="middle" className="fill-muted-foreground text-xs font-bold">
          D: Do Not Touch
        </text>
        <text x="790" y="276" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Active project deps
        </text>
        <text x="790" y="289" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          App Support (running apps)
        </text>
        <text x="790" y="302" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          System caches
        </text>
        <text x="790" y="315" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Active git repos
        </text>
        <text x="790" y="330" textAnchor="middle" className="fill-muted-foreground/60 text-[10px] font-semibold">
          Protected
        </text>

        {/* Arrow down to execution */}
        <line
          x1="460"
          y1="360"
          x2="460"
          y2="385"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#scArrow)"
        />

        {/* Phase 3-5: Report, Execute, Manifest */}
        <rect
          x="10"
          y="390"
          width="900"
          height="220"
          rx="8"
          className="fill-muted/30 stroke-border"
          strokeWidth="1"
        />
        <text
          x="30"
          y="412"
          className="fill-primary text-sm font-semibold"
        >
          Phases 3-5: Report, Execute, Manifest
        </text>

        {/* Report */}
        <rect
          x="30"
          y="424"
          width="270"
          height="80"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="165" y="447" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Phase 3: Report
        </text>
        <text x="165" y="465" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Formatted table per category
        </text>
        <text x="165" y="478" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Delete commands + space totals
        </text>
        <text x="165" y="491" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          User reviews and approves
        </text>

        {/* Arrow from Report to Execute */}
        <line
          x1="300"
          y1="464"
          x2="320"
          y2="464"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#scArrow)"
        />

        {/* Execute */}
        <rect
          x="325"
          y="424"
          width="270"
          height="80"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="460" y="447" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Phase 4: Execute
        </text>
        <text x="460" y="465" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          rsync to external, verify sizes
        </text>
        <text x="460" y="478" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Delete originals after verify
        </text>
        <text x="460" y="491" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          rm -rf for regeneratable caches
        </text>

        {/* Arrow from Execute to Manifest */}
        <line
          x1="595"
          y1="464"
          x2="615"
          y2="464"
          className="stroke-muted-foreground/60"
          strokeWidth="1.5"
          markerEnd="url(#scArrow)"
        />

        {/* Manifest */}
        <rect
          x="620"
          y="424"
          width="270"
          height="80"
          rx="6"
          className="fill-primary/10 stroke-primary/40"
          strokeWidth="1"
        />
        <text x="755" y="447" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Phase 5: Manifest
        </text>
        <text x="755" y="465" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Log all moves to manifest.md
        </text>
        <text x="755" y="478" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Include restore commands
        </text>
        <text x="755" y="491" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          Before/after comparison
        </text>

        {/* Results bar at bottom */}
        <rect
          x="30"
          y="520"
          width="860"
          height="75"
          rx="6"
          className="fill-green-500/5 stroke-green-500/30"
          strokeWidth="1"
        />
        <text x="460" y="543" textAnchor="middle" className="fill-green-400 text-sm font-bold">
          Results: 92% full (14 GB free) to 68% full (58 GB free)
        </text>

        {/* Three result columns */}
        <text x="170" y="565" textAnchor="middle" className="fill-green-400/80 text-[10px]">
          Deleted: 7 GB (caches)
        </text>
        <text x="460" y="565" textAnchor="middle" className="fill-blue-400/80 text-[10px]">
          Moved: 13 GB (archives)
        </text>
        <text x="750" y="565" textAnchor="middle" className="fill-yellow-400/80 text-[10px]">
          iMessage: 29 GB (Finder delete)
        </text>

        <text x="460" y="585" textAnchor="middle" className="fill-foreground text-xs font-semibold">
          Total reclaimed: 43 GB
        </text>
      </svg>
    </DiagramWrapper>
  );
}
