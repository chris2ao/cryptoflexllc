/** Ledgerly Cyber Editorial rebuild blog post diagrams: SVG-based, themed to site colors */

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
 * One saved Claude Design record, referenced by path from two very
 * different products, with a dashed placeholder for whatever links to
 * it next. The point: the prototype's <head> links to the record, it
 * does not inline a copy of the brand.
 */
export function DesignSystemSharedRecordDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "One saved Claude Design record (six token sheets plus base.css, styles.css, and a bundle script) is referenced by path from both cryptoflexllc.com and Ledgerly's exported prototype, never copied into either."
      }
    >
      <svg
        viewBox="0 0 880 580"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="lcer-ds-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
        </defs>

        <text x="440" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          One Design System Record, Referenced by Path
        </text>

        {/* THE RECORD */}
        <rect x="170" y="50" width="540" height="236" rx="12" className="fill-primary/10 stroke-primary" strokeWidth="2" />
        <text x="440" y="80" textAnchor="middle" className="fill-primary text-[13px] font-mono font-semibold">
          _ds/cryptoflex-design-system-&lt;uuid&gt;/
        </text>
        <text x="440" y="98" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          one saved record inside Claude Design
        </text>

        <line x1="190" y1="112" x2="690" y2="112" className="stroke-muted-foreground/20" strokeWidth="1" />

        {/* left column: 6 token sheets */}
        <text x="210" y="134" className="fill-cyan-400 text-[11px] font-mono font-semibold">6 TOKEN SHEETS</text>
        <text x="210" y="154" className="fill-muted-foreground text-[10px] font-mono">tokens/fonts.css</text>
        <text x="210" y="172" className="fill-muted-foreground text-[10px] font-mono">tokens/colors.css</text>
        <text x="210" y="190" className="fill-muted-foreground text-[10px] font-mono">tokens/typography.css</text>
        <text x="210" y="208" className="fill-muted-foreground text-[10px] font-mono">tokens/spacing.css</text>
        <text x="210" y="226" className="fill-muted-foreground text-[10px] font-mono">tokens/elevation.css</text>
        <text x="210" y="244" className="fill-muted-foreground text-[10px] font-mono">tokens/motion.css</text>

        {/* right column: plus base + compiled assets */}
        <text x="540" y="134" className="fill-violet-400 text-[11px] font-mono font-semibold">PLUS</text>
        <text x="540" y="154" className="fill-muted-foreground text-[10px] font-mono">tokens/base.css</text>
        <text x="540" y="172" className="fill-muted-foreground text-[10px] font-mono">styles.css</text>
        <text x="540" y="190" className="fill-muted-foreground text-[10px] font-mono">_ds_bundle.js</text>
        <text x="540" y="216" className="fill-muted-foreground/70 text-[9px] italic">9 &lt;link&gt;/&lt;script&gt; tags,</text>
        <text x="540" y="232" className="fill-muted-foreground/70 text-[9px] italic">one directory</text>

        <text x="440" y="270" textAnchor="middle" className="fill-emerald-400 text-[10px] font-semibold italic">
          referenced by path in every &lt;head&gt;, never inlined
        </text>

        {/* fan-out to the projects that link to it */}
        <line x1="440" y1="286" x2="440" y2="310" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="165" y1="310" x2="715" y2="310" className="stroke-muted-foreground/60" strokeWidth="1.5" />
        <line x1="165" y1="310" x2="165" y2="334" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lcer-ds-arrow)" />
        <line x1="440" y1="310" x2="440" y2="334" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lcer-ds-arrow)" />
        <line x1="715" y1="310" x2="715" y2="334" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lcer-ds-arrow)" />

        {/* Project A: cryptoflexllc.com, April 2026 */}
        <rect x="40" y="334" width="250" height="132" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="165" y="362" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">cryptoflexllc.com</text>
        <text x="165" y="382" textAnchor="middle" className="fill-muted-foreground text-[10px]">April 2026, first application</text>
        <text x="165" y="406" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">&lt;link href=&quot;…/tokens/colors.css&quot;&gt;</text>
        <text x="165" y="424" textAnchor="middle" className="fill-muted-foreground text-[9px]">marketing + blog site</text>
        <text x="165" y="448" textAnchor="middle" className="fill-cyan-400/80 text-[9px] italic">links, doesn&apos;t copy</text>

        {/* Project B: Ledgerly, August 2026 (this post's subject) */}
        <rect x="315" y="334" width="250" height="132" rx="10" className="fill-amber-500/12 stroke-amber-500" strokeWidth="2.5" />
        <text x="440" y="362" textAnchor="middle" className="fill-amber-300 text-[12px] font-semibold">Ledgerly</text>
        <text x="440" y="382" textAnchor="middle" className="fill-muted-foreground text-[10px]">August 2026, second application</text>
        <text x="440" y="406" textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">&lt;link href=&quot;…/tokens/colors.css&quot;&gt;</text>
        <text x="440" y="424" textAnchor="middle" className="fill-muted-foreground text-[9px]">personal finance dashboard</text>
        <text x="440" y="448" textAnchor="middle" className="fill-amber-400/90 text-[9px] italic">9 tags, one &lt;head&gt;</text>

        {/* Project C: whatever's next, dashed placeholder */}
        <rect x="590" y="334" width="250" height="132" rx="10" className="fill-muted-foreground/5 stroke-muted-foreground/40" strokeWidth="1.5" strokeDasharray="4 3" />
        <text x="715" y="362" textAnchor="middle" className="fill-muted-foreground text-[12px] font-semibold italic">next project</text>
        <text x="715" y="382" textAnchor="middle" className="fill-muted-foreground/80 text-[10px] italic">whatever&apos;s next</text>
        <text x="715" y="406" textAnchor="middle" className="fill-muted-foreground/70 text-[9px] font-mono italic">&lt;link href=&quot;…/tokens/…&quot;&gt;</text>
        <text x="715" y="424" textAnchor="middle" className="fill-muted-foreground/70 text-[9px] italic">same six sheets, day one</text>

        <text x="440" y="500" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          A marketing site and a personal finance dashboard, drawing from one token source.
        </text>
        <text x="440" y="518" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          Neither one had to relearn what &quot;on brand&quot; means here.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * One nav item, two sibling spans, and two different outputs: the
 * uppercase screen a person sees versus the sentence-case accessible
 * name a role-based matcher (and a screen reader) actually reads.
 * That gap is why a total visual rebuild left role-based e2e tests green.
 */
export function AccessibleNameVsVisualDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "The same nav item renders an aria-hidden decorative span and a literal sentence-case label span. CSS text-transform makes the screen read \"MY ACCOUNTS\"; the accessible name Playwright and screen readers read stays \"My accounts.\""
      }
    >
      <svg
        viewBox="0 0 820 610"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker id="lcer-name-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-muted-foreground/60" />
          </marker>
          <marker id="lcer-name-arrow-cyan" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker id="lcer-name-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
        </defs>

        <text x="410" y="26" textAnchor="middle" className="fill-foreground text-[14px] font-semibold">
          One Nav Item, Two Different Outputs
        </text>

        {/* THE DOM: two sibling spans */}
        <rect x="150" y="48" width="520" height="170" rx="10" className="fill-zinc-500/8 stroke-zinc-500/60" strokeWidth="1.5" />
        <text x="410" y="72" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">The DOM: two sibling spans</text>
        <text x="410" y="90" textAnchor="middle" className="fill-muted-foreground text-[10px]">app-sidebar.tsx renders both for every nav item</text>

        <text x="175" y="118" className="fill-rose-300 text-[11px] font-mono">&lt;span aria-hidden=&quot;true&quot;&gt;»&lt;/span&gt;</text>
        <text x="175" y="136" className="fill-muted-foreground text-[10px]">decorative mark, excluded from the accessible name</text>

        <text x="175" y="166" className="fill-emerald-300 text-[11px] font-mono">&lt;span&gt;My accounts&lt;/span&gt;</text>
        <text x="175" y="184" className="fill-muted-foreground text-[10px]">literal label, sentence case, becomes the accessible name</text>

        <line x1="410" y1="218" x2="410" y2="250" className="stroke-muted-foreground/60" strokeWidth="1.5" markerEnd="url(#lcer-name-arrow)" />

        {/* CSS transform applied to the parent */}
        <rect x="260" y="250" width="300" height="80" rx="10" className="fill-amber-500/10 stroke-amber-500" strokeWidth="1.5" />
        <text x="410" y="276" textAnchor="middle" className="fill-amber-300 text-[11px] font-mono font-semibold">text-transform: uppercase;</text>
        <text x="410" y="296" textAnchor="middle" className="fill-muted-foreground text-[9px]">applied once, to the parent wrapper</text>
        <text x="410" y="314" textAnchor="middle" className="fill-muted-foreground/70 text-[9px] italic">casing is presentation only</text>

        {/* divergent branch */}
        <line x1="350" y1="330" x2="230" y2="372" className="stroke-cyan-500/70" strokeWidth="1.5" markerEnd="url(#lcer-name-arrow-cyan)" />
        <text x="270" y="352" className="fill-cyan-400 text-[9px] font-medium">renders</text>
        <line x1="470" y1="330" x2="590" y2="372" className="stroke-emerald-500/70" strokeWidth="1.5" markerEnd="url(#lcer-name-arrow-emerald)" />
        <text x="530" y="352" className="fill-emerald-400 text-[9px] font-medium">computes</text>

        {/* LEFT: what the eye sees */}
        <rect x="60" y="372" width="340" height="170" rx="10" className="fill-cyan-500/10 stroke-cyan-500" strokeWidth="1.5" />
        <text x="230" y="398" textAnchor="middle" className="fill-cyan-300 text-[12px] font-semibold">What the eye sees</text>
        <text x="230" y="416" textAnchor="middle" className="fill-muted-foreground text-[10px]">the rendered screen</text>
        <text x="230" y="458" textAnchor="middle" className="fill-cyan-100 text-[20px] font-mono font-bold tracking-wide">MY ACCOUNTS</text>
        <text x="230" y="486" textAnchor="middle" className="fill-muted-foreground text-[10px]">mark + label, both rendered, both uppercase</text>
        <text x="230" y="506" textAnchor="middle" className="fill-cyan-400 text-[10px] italic font-medium">the visual layer changed completely</text>
        <text x="230" y="524" textAnchor="middle" className="fill-muted-foreground/70 text-[9px]">old app: sentence case. new app: this.</text>

        {/* RIGHT: what the matcher sees */}
        <rect x="420" y="372" width="340" height="170" rx="10" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="2" />
        <text x="590" y="398" textAnchor="middle" className="fill-emerald-300 text-[12px] font-semibold">What the matcher sees</text>
        <text x="590" y="416" textAnchor="middle" className="fill-muted-foreground text-[10px]">the accessible name</text>
        <text x="590" y="458" textAnchor="middle" className="fill-emerald-100 text-[18px] font-mono font-bold">&quot;My accounts&quot;</text>
        <text x="590" y="486" textAnchor="middle" className="fill-muted-foreground text-[10px]">aria-hidden mark contributes nothing</text>
        <text x="590" y="506" textAnchor="middle" className="fill-emerald-400 text-[10px] italic font-semibold">the assertion layer never moved</text>
        <text x="590" y="524" textAnchor="middle" className="fill-muted-foreground/70 text-[9px] font-mono">getByRole(&apos;link&apos;, {`{ name: /my accounts/i }`})</text>

        <text x="410" y="568" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          CSS casing and an aria-hidden span never touch the accessible name.
        </text>
        <text x="410" y="586" textAnchor="middle" className="fill-muted-foreground text-[11px] font-medium">
          That&apos;s why a total visual rebuild still left 46 role-based tests green.
        </text>
      </svg>
    </DiagramWrapper>
  );
}
