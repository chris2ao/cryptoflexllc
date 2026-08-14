/** Ledgerly Cyber Editorial rebuild blog post diagrams: editorial SVG, themed to site colors */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  Chip,
  SectionLabel,
} from "./diagram-editorial";

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
      <EditorialFrame
        id="lcer1"
        w={920}
        h={630}
        eyebrow="One Design System Record, Referenced by Path"
        chips={[
          { label: "1 record", accent: "primary" },
          { label: "3 consumers", accent: "muted" },
        ]}
        footerRight="One record, many consumers"
        maxWidthClass="max-w-4xl"
      >
        {/* Shared record */}
        <NodePanel x={60} y={70} w={800} h={222} accent="primary" emphasis terminal title="">
          <text x={110} y={100} className="fill-primary font-heading font-semibold" style={{ fontSize: 16 }}>
            Design System Record
          </text>
          <text x={110} y={118} className="fill-muted-foreground font-mono" style={{ fontSize: 11 }}>
            _ds/cryptoflex-design-system-&lt;uuid&gt;/
          </text>
          <line x1={90} y1={132} x2={830} y2={132} className="stroke-foreground/25" strokeWidth={1} />

          {/* left column: six token sheets */}
          <text x={100} y={152} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/fonts.css</text>
          <text x={100} y={169} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/colors.css</text>
          <text x={100} y={186} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/typography.css</text>
          <text x={100} y={203} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/spacing.css</text>
          <text x={100} y={220} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/elevation.css</text>
          <text x={100} y={237} className="fill-cyan-500 font-mono" style={{ fontSize: 11 }}>tokens/motion.css</text>

          {/* right column: compiled assets */}
          <text x={480} y={152} className="fill-violet-500 font-mono" style={{ fontSize: 11 }}>tokens/base.css</text>
          <text x={480} y={169} className="fill-violet-500 font-mono" style={{ fontSize: 11 }}>styles.css</text>
          <text x={480} y={186} className="fill-violet-500 font-mono" style={{ fontSize: 11 }}>_ds_bundle.js</text>
          <text x={480} y={206} className="fill-muted-foreground font-mono italic" style={{ fontSize: 10.5 }}>9 link/script tags,</text>
          <text x={480} y={222} className="fill-muted-foreground font-mono italic" style={{ fontSize: 10.5 }}>one directory</text>

          <text x={460} y={270} textAnchor="middle" className="fill-emerald-500 font-mono italic" style={{ fontSize: 11 }}>
            referenced by path in &lt;head&gt;, never inlined
          </text>
        </NodePanel>

        {/* Bus: record fans out to every consumer */}
        <path d="M460,292 L460,340" fill="none" className="stroke-primary/50" strokeWidth={1.5} />
        <path d="M185,340 L735,340" fill="none" className="stroke-primary/50" strokeWidth={1.5} />
        <FlowLine id="lcer1" d="M185,340 L185,420" accent="cyan" />
        <FlowLine id="lcer1" d="M460,340 L460,420" accent="amber" />
        <FlowLine id="lcer1" d="M735,340 L735,420" accent="muted" />

        {/* Consumer 1: cryptoflexllc.com */}
        <NodePanel
          x={60}
          y={420}
          w={250}
          h={140}
          accent="cyan"
          title="cryptoflexllc.com"
          sub={["April 2026", "marketing + blog site", "links, doesn't copy"]}
        />

        {/* Consumer 2: Ledgerly, this rebuild */}
        <NodePanel
          x={335}
          y={420}
          w={250}
          h={140}
          accent="amber"
          emphasis
          title="Ledgerly"
          sub={["August 2026", "personal finance dashboard", "9 tags, one <head>"]}
        >
          <Chip x={575} y={430} label="THIS REBUILD" accent="amber" filled anchor="end" />
        </NodePanel>

        {/* Consumer 3: next project, placeholder */}
        <NodePanel
          x={610}
          y={420}
          w={250}
          h={140}
          accent="muted"
          variant="dashed"
          title="next project"
          sub={["whatever's next", "day one, same six sheets", "no rebuild required"]}
        />
      </EditorialFrame>
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
      <EditorialFrame
        id="lcer2"
        w={920}
        h={730}
        eyebrow="One Nav Item, Two Different Outputs"
        chips={[
          { label: "46 tests green", accent: "emerald" },
          { label: "CSS only", accent: "amber" },
        ]}
        footerRight="Casing is presentation only"
        maxWidthClass="max-w-4xl"
      >
        {/* The DOM */}
        <SectionLabel x={60} y={72} label="The DOM" accent="muted" />
        <NodePanel x={60} y={88} w={800} h={152} accent="muted" title="">
          <text x={460} y={112} textAnchor="middle" className="fill-muted-foreground font-mono italic" style={{ fontSize: 10.5 }}>
            app-sidebar.tsx renders both spans for every nav item
          </text>
          <line x1={90} y1={124} x2={830} y2={124} className="stroke-foreground/25" strokeWidth={1} />

          <text x={100} y={150} className="fill-red-500 font-mono" style={{ fontSize: 11.5 }}>
            &lt;span aria-hidden=&quot;true&quot;&gt;»&lt;/span&gt;
          </text>
          <text x={100} y={168} className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            decorative mark, excluded from the accessible name
          </text>

          <text x={100} y={196} className="fill-emerald-500 font-mono" style={{ fontSize: 11.5 }}>
            &lt;span&gt;My accounts&lt;/span&gt;
          </text>
          <text x={100} y={214} className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            literal label, sentence case, becomes the accessible name
          </text>
        </NodePanel>

        <FlowLine id="lcer2" d="M460,240 L460,266" accent="muted" />

        {/* The CSS rule */}
        <SectionLabel x={60} y={284} label="The CSS Rule" accent="amber" />
        <NodePanel x={300} y={300} w={320} h={90} accent="amber" emphasis title="">
          <text x={460} y={332} textAnchor="middle" className="fill-amber-500 font-mono font-semibold" style={{ fontSize: 12 }}>
            text-transform: uppercase;
          </text>
          <text x={460} y={352} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            applied once, to the parent wrapper
          </text>
          <text x={460} y={370} textAnchor="middle" className="fill-muted-foreground font-mono italic" style={{ fontSize: 10.5 }}>
            casing is presentation only
          </text>
        </NodePanel>

        {/* Diverge: rendered pixels vs. accessible name */}
        <path d="M460,390 L460,410" fill="none" className="stroke-amber-500/50" strokeWidth={1.5} />
        <path d="M250,410 L670,410" fill="none" className="stroke-amber-500/50" strokeWidth={1.5} />
        <FlowLine id="lcer2" d="M250,410 L250,436" accent="cyan" />
        <FlowLine id="lcer2" d="M670,410 L670,436" accent="emerald" />
        <text x={240} y={428} textAnchor="end" className="fill-cyan-500 font-mono" style={{ fontSize: 10.5 }}>renders</text>
        <text x={680} y={428} textAnchor="start" className="fill-emerald-500 font-mono" style={{ fontSize: 10.5 }}>computes</text>

        <SectionLabel x={60} y={422} label="The Outcome" accent="primary" />

        {/* What the eye sees */}
        <NodePanel x={60} y={436} w={380} h={190} accent="cyan" title="">
          <text x={250} y={466} textAnchor="middle" className="fill-cyan-500 font-heading font-semibold" style={{ fontSize: 15 }}>
            What the eye sees
          </text>
          <text x={250} y={484} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            the rendered screen
          </text>
          <line x1={90} y1={498} x2={410} y2={498} className="stroke-foreground/25" strokeWidth={1} />
          <text x={250} y={548} textAnchor="middle" className="fill-cyan-500 font-mono font-bold" style={{ fontSize: 20 }}>
            MY ACCOUNTS
          </text>
          <text x={250} y={572} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            mark + label, both rendered, both uppercase
          </text>
          <text x={250} y={590} textAnchor="middle" className="fill-cyan-500 font-mono italic" style={{ fontSize: 10.5 }}>
            the visual layer changed completely
          </text>
          <text x={250} y={608} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            old app: sentence case. new app: this.
          </text>
        </NodePanel>

        {/* What the matcher sees */}
        <NodePanel x={480} y={436} w={380} h={190} accent="emerald" emphasis title="">
          <text x={670} y={466} textAnchor="middle" className="fill-emerald-500 font-heading font-semibold" style={{ fontSize: 15 }}>
            What the matcher sees
          </text>
          <text x={670} y={484} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            the accessible name
          </text>
          <line x1={510} y1={498} x2={830} y2={498} className="stroke-foreground/25" strokeWidth={1} />
          <text x={670} y={548} textAnchor="middle" className="fill-emerald-500 font-mono font-bold" style={{ fontSize: 18 }}>
            &quot;My accounts&quot;
          </text>
          <text x={670} y={572} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            aria-hidden mark contributes nothing
          </text>
          <text x={670} y={590} textAnchor="middle" className="fill-emerald-500 font-mono italic" style={{ fontSize: 10.5 }}>
            the assertion layer never moved
          </text>
          <text x={670} y={608} textAnchor="middle" className="fill-muted-foreground font-mono" style={{ fontSize: 10.5 }}>
            getByRole(&apos;link&apos;, {`{ name: /my accounts/i }`})
          </text>
        </NodePanel>

        <text x={460} y={656} textAnchor="middle" className="fill-foreground font-heading font-medium" style={{ fontSize: 12.5 }}>
          CSS changes pixels. It never touches the accessible name.
        </text>
        <text x={460} y={676} textAnchor="middle" className="fill-muted-foreground font-heading font-medium" style={{ fontSize: 12.5 }}>
          That&apos;s why a total visual rebuild still left 46 role-based tests green.
        </text>
      </EditorialFrame>
    </DiagramWrapper>
  );
}
