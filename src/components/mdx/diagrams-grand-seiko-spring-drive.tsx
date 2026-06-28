/** Grand Seiko Spring Drive blog post diagrams -- SVG-based, themed to site colors */

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
 * Spring Drive Tri-Synchro Regulator energy flow diagram.
 * Shows how the mainspring powers everything and the feedback loop
 * that holds the glide wheel to exactly 8 rotations per second.
 */
export function SpringDriveEnergyFlowDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Spring Drive's Tri-Synchro Regulator: the mainspring is the only power source. The glide wheel both generates the electricity that runs the quartz reference and is held to exactly 8 rotations per second by an electromagnetic brake -- no battery, no escapement."
      }
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="gsArrowCy"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-cyan-500/80" />
          </marker>
          <marker
            id="gsArrowAm"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-amber-500/80" />
          </marker>
          <marker
            id="gsArrowEm"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-emerald-500/80" />
          </marker>
          <marker
            id="gsArrowFu"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" className="fill-fuchsia-500/80" />
          </marker>
          <marker
            id="gsArrowRe"
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
          x="400"
          y="22"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Spring Drive -- Tri-Synchro Regulator Energy Flow
        </text>

        {/* === MAINSPRING === */}
        <rect
          x="30"
          y="40"
          width="180"
          height="74"
          rx="8"
          className="fill-amber-500/15 stroke-amber-500"
          strokeWidth="1.5"
        />
        <text
          x="120"
          y="64"
          textAnchor="middle"
          className="fill-amber-300 text-[11px] font-semibold"
        >
          WOUND MAINSPRING
        </text>
        <text
          x="120"
          y="82"
          textAnchor="middle"
          className="fill-amber-200/70 text-[9px]"
        >
          sole power source
        </text>
        <text
          x="120"
          y="96"
          textAnchor="middle"
          className="fill-amber-200/70 text-[9px]"
        >
          no battery
        </text>

        {/* Mainspring -> Gear Train */}
        <line
          x1="210"
          y1="77"
          x2="280"
          y2="77"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowAm)"
        />
        <text
          x="245"
          y="70"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[8px]"
        >
          mechanical
        </text>
        <text
          x="245"
          y="82"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[8px]"
        >
          energy
        </text>

        {/* === GEAR TRAIN === */}
        <rect
          x="280"
          y="40"
          width="160"
          height="74"
          rx="8"
          className="fill-cyan-500/12 stroke-cyan-500"
          strokeWidth="1.5"
        />
        <text
          x="360"
          y="67"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          GEAR TRAIN
        </text>
        <text
          x="360"
          y="85"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          transmits power
        </text>
        <text
          x="360"
          y="99"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          to hands + glide wheel
        </text>

        {/* Gear Train -> Hands (right branch) */}
        <line
          x1="440"
          y1="60"
          x2="560"
          y2="60"
          className="stroke-cyan-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowCy)"
        />

        {/* === HANDS === */}
        <rect
          x="560"
          y="34"
          width="200"
          height="52"
          rx="8"
          className="fill-cyan-500/10 stroke-cyan-400/60"
          strokeWidth="1.2"
        />
        <text
          x="660"
          y="58"
          textAnchor="middle"
          className="fill-cyan-300 text-[11px] font-semibold"
        >
          WATCH HANDS
        </text>
        <text
          x="660"
          y="74"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          continuous glide motion
        </text>

        {/* Gear Train -> Glide Wheel (down branch) */}
        <line
          x1="360"
          y1="114"
          x2="360"
          y2="174"
          className="stroke-amber-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowAm)"
        />

        {/* === GLIDE WHEEL === */}
        <rect
          x="240"
          y="174"
          width="240"
          height="80"
          rx="8"
          className="fill-emerald-500/12 stroke-emerald-500"
          strokeWidth="1.5"
        />
        <text
          x="360"
          y="200"
          textAnchor="middle"
          className="fill-emerald-300 text-[12px] font-semibold"
        >
          GLIDE WHEEL
        </text>
        <text
          x="360"
          y="218"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          spins at 8 rotations / sec
        </text>
        <text
          x="360"
          y="232"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          held by electromagnetic brake
        </text>
        <text
          x="360"
          y="246"
          textAnchor="middle"
          className="fill-emerald-400/70 text-[9px] font-semibold"
        >
          no escapement -- no tick
        </text>

        {/* Glide Wheel -> Coil/Stator (down) */}
        <line
          x1="360"
          y1="254"
          x2="360"
          y2="304"
          className="stroke-emerald-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowEm)"
        />
        <text
          x="380"
          y="272"
          className="fill-muted-foreground/60 text-[8px]"
        >
          acts as
        </text>
        <text
          x="380"
          y="284"
          className="fill-muted-foreground/60 text-[8px]"
        >
          generator
        </text>

        {/* === COIL / STATOR === */}
        <rect
          x="240"
          y="304"
          width="240"
          height="60"
          rx="8"
          className="fill-emerald-500/10 stroke-emerald-500/60"
          strokeWidth="1.2"
        />
        <text
          x="360"
          y="328"
          textAnchor="middle"
          className="fill-emerald-300 text-[11px] font-semibold"
        >
          COIL + STATOR
        </text>
        <text
          x="360"
          y="346"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          generates tiny electric current
        </text>

        {/* Coil -> IC + Quartz (right) */}
        <line
          x1="480"
          y1="334"
          x2="560"
          y2="334"
          className="stroke-fuchsia-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowFu)"
        />
        <text
          x="520"
          y="326"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[8px]"
        >
          powers
        </text>

        {/* === IC + QUARTZ CRYSTAL === */}
        <rect
          x="560"
          y="296"
          width="210"
          height="80"
          rx="8"
          className="fill-fuchsia-500/12 stroke-fuchsia-500"
          strokeWidth="1.5"
        />
        <text
          x="665"
          y="318"
          textAnchor="middle"
          className="fill-fuchsia-300 text-[11px] font-semibold"
        >
          IC + QUARTZ CRYSTAL
        </text>
        <text
          x="665"
          y="336"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          32,768 Hz reference
        </text>
        <text
          x="665"
          y="350"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          compares glide-wheel speed
        </text>
        <text
          x="665"
          y="364"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[9px]"
        >
          to quartz frequency
        </text>

        {/* IC -> EM Brake (down then left -- feedback loop) */}
        {/* Down from IC box */}
        <line
          x1="665"
          y1="376"
          x2="665"
          y2="430"
          className="stroke-rose-500/70"
          strokeWidth="1.5"
        />
        {/* Left toward glide wheel */}
        <line
          x1="665"
          y1="430"
          x2="390"
          y2="430"
          className="stroke-rose-500/70"
          strokeWidth="1.5"
        />
        {/* Up to glide wheel */}
        <line
          x1="390"
          y1="430"
          x2="390"
          y2="255"
          className="stroke-rose-500/70"
          strokeWidth="1.5"
          markerEnd="url(#gsArrowRe)"
        />

        {/* Feedback loop label */}
        <rect
          x="440"
          y="416"
          width="180"
          height="28"
          rx="5"
          className="fill-rose-500/10 stroke-rose-500/40"
          strokeWidth="1"
        />
        <text
          x="530"
          y="426"
          textAnchor="middle"
          className="fill-rose-300 text-[9px] font-semibold"
        >
          ELECTROMAGNETIC BRAKE
        </text>
        <text
          x="530"
          y="438"
          textAnchor="middle"
          className="fill-muted-foreground/70 text-[8px]"
        >
          slows wheel if too fast
        </text>

        {/* Legend */}
        <text
          x="400"
          y="478"
          textAnchor="middle"
          className="fill-muted-foreground/60 text-[9px]"
        >
          Red path = feedback loop (quartz reference controls electromagnetic brake on glide wheel)
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Three-column comparison: Mechanical vs Quartz vs Spring Drive.
 */
export function SpringDriveComparisonDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "Spring Drive is a third category: mainspring-powered like a mechanical watch, quartz-accurate, with a continuously gliding seconds hand and no battery."
      }
    >
      <svg
        viewBox="0 0 800 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="400"
          y="22"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Mechanical vs Quartz vs Spring Drive
        </text>

        {/* Column backgrounds */}
        {/* Mechanical */}
        <rect
          x="20"
          y="36"
          width="228"
          height="358"
          rx="8"
          className="fill-slate-500/8 stroke-slate-400/40"
          strokeWidth="1"
        />
        {/* Quartz */}
        <rect
          x="264"
          y="36"
          width="228"
          height="358"
          rx="8"
          className="fill-slate-500/8 stroke-slate-400/40"
          strokeWidth="1"
        />
        {/* Spring Drive -- highlighted */}
        <rect
          x="508"
          y="36"
          width="272"
          height="358"
          rx="8"
          className="fill-emerald-500/10 stroke-emerald-500"
          strokeWidth="2"
        />

        {/* Column headers */}
        <text
          x="134"
          y="62"
          textAnchor="middle"
          className="fill-slate-300 text-[12px] font-semibold"
        >
          MECHANICAL
        </text>
        <text
          x="378"
          y="62"
          textAnchor="middle"
          className="fill-slate-300 text-[12px] font-semibold"
        >
          QUARTZ
        </text>
        <text
          x="644"
          y="62"
          textAnchor="middle"
          className="fill-emerald-300 text-[13px] font-bold"
        >
          SPRING DRIVE
        </text>

        {/* Row dividers */}
        {[100, 188, 270, 350].map((y) => (
          <line
            key={y}
            x1="20"
            y1={y}
            x2="780"
            y2={y}
            className="stroke-muted-foreground/20"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}

        {/* Row labels (left gutter) */}
        {[
          { y: 76, label: "Power source" },
          { y: 140, label: "Regulator" },
          { y: 226, label: "Seconds hand" },
          { y: 306, label: "Accuracy" },
        ].map(({ y, label }) => (
          <text
            key={label}
            x="12"
            y={y}
            className="fill-muted-foreground/60 text-[8px] font-semibold"
            style={{ writingMode: "horizontal-tb" }}
          />
        ))}

        {/* Row: Power source (y ~76-100) */}
        <text x="134" y="80" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Power source</text>
        <text x="134" y="94" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Mainspring</text>

        <text x="378" y="80" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Power source</text>
        <text x="378" y="94" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Battery</text>

        <text x="644" y="80" textAnchor="middle" className="fill-emerald-200 text-[10px] font-semibold">Power source</text>
        <text x="644" y="94" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Mainspring (no battery)</text>

        {/* Row: Regulator (y 100-188) */}
        <text x="134" y="120" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Regulator</text>
        <text x="134" y="136" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Escapement +</text>
        <text x="134" y="150" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">balance wheel</text>

        <text x="378" y="120" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Regulator</text>
        <text x="378" y="136" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Quartz crystal +</text>
        <text x="378" y="150" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">stepper motor</text>

        <text x="644" y="120" textAnchor="middle" className="fill-emerald-200 text-[10px] font-semibold">Regulator</text>
        <text x="644" y="136" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Quartz-regulated</text>
        <text x="644" y="150" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">electromagnetic brake</text>
        <text x="644" y="164" textAnchor="middle" className="fill-muted-foreground/70 text-[8px]">no escapement, no tick</text>

        {/* Row: Seconds hand (y 188-270) */}
        <text x="134" y="208" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Seconds hand</text>
        <text x="134" y="224" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Ticks ~6-8x per sec</text>
        <text x="134" y="238" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">(steps)</text>

        <text x="378" y="208" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Seconds hand</text>
        <text x="378" y="224" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">Ticks once per second</text>
        <text x="378" y="238" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">(steps)</text>

        <text x="644" y="208" textAnchor="middle" className="fill-emerald-200 text-[10px] font-semibold">Seconds hand</text>
        <text x="644" y="224" textAnchor="middle" className="fill-emerald-300 text-[10px] font-bold">Glides continuously</text>
        <text x="644" y="240" textAnchor="middle" className="fill-emerald-400/80 text-[9px]">no steps, no ticks</text>

        {/* Row: Accuracy (y 270-350) */}
        <text x="134" y="290" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Typical accuracy</text>
        <text x="134" y="306" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">~+/-10-20 sec/day</text>

        <text x="378" y="290" textAnchor="middle" className="fill-slate-200 text-[10px] font-semibold">Typical accuracy</text>
        <text x="378" y="306" textAnchor="middle" className="fill-muted-foreground/80 text-[9px]">~+/-15 sec/month</text>

        <text x="644" y="290" textAnchor="middle" className="fill-emerald-200 text-[10px] font-semibold">Typical accuracy</text>
        <text x="644" y="306" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">+/-1 sec/day</text>
        <text x="644" y="320" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">+/-15 sec/month</text>

        {/* Spring Drive badge */}
        <rect
          x="544"
          y="356"
          width="200"
          height="28"
          rx="6"
          className="fill-emerald-500/20 stroke-emerald-500/60"
          strokeWidth="1"
        />
        <text
          x="644"
          y="374"
          textAnchor="middle"
          className="fill-emerald-300 text-[10px] font-semibold"
        >
          A third category of watch
        </text>

        {/* Bottom note */}
        <text
          x="400"
          y="408"
          textAnchor="middle"
          className="fill-muted-foreground/50 text-[8px]"
        >
          Spring Drive combines mechanical power with quartz-level accuracy and a unique continuously gliding seconds hand.
        </text>
      </svg>
    </DiagramWrapper>
  );
}

/**
 * Horizontal timeline of Grand Seiko and Spring Drive milestones.
 */
export function GrandSeikoTimelineDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "From 'the ideal watch' to Spring Drive: a 28-year engineering obsession. Akahane began in 1977 and died in 1998, months before the 1999 debut."
      }
    >
      <svg
        viewBox="0 0 800 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        {/* Title */}
        <text
          x="400"
          y="22"
          textAnchor="middle"
          className="fill-foreground text-[14px] font-semibold"
        >
          Grand Seiko + Spring Drive -- Key Milestones
        </text>

        {/* Timeline spine */}
        <line
          x1="40"
          y1="160"
          x2="760"
          y2="160"
          className="stroke-muted-foreground/40"
          strokeWidth="2"
        />

        {/* Arrow head on right */}
        <path
          d="M756,155 L764,160 L756,165 Z"
          className="fill-muted-foreground/40"
        />

        {/*
          Milestones:
          1960, 1967, 1977, 1998, 1999, 2004, 2017
          Spread across x: 70, 160, 290, 450, 510, 590, 720
        */}

        {/* 1960 -- above */}
        <circle cx="70" cy="160" r="5" className="fill-amber-500 stroke-amber-300" strokeWidth="1.5" />
        <line x1="70" y1="155" x2="70" y2="90" className="stroke-amber-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="10" y="44" width="122" height="46" rx="6" className="fill-amber-500/12 stroke-amber-500/60" strokeWidth="1" />
        <text x="71" y="62" textAnchor="middle" className="fill-amber-300 text-[11px] font-bold">1960</text>
        <text x="71" y="76" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Grand Seiko founded</text>
        <text x="71" y="88" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">&ldquo;the ideal watch&rdquo;</text>

        {/* 1967 -- below */}
        <circle cx="175" cy="160" r="5" className="fill-cyan-500 stroke-cyan-300" strokeWidth="1.5" />
        <line x1="175" y1="165" x2="175" y2="226" className="stroke-cyan-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="112" y="226" width="128" height="46" rx="6" className="fill-cyan-500/10 stroke-cyan-500/50" strokeWidth="1" />
        <text x="176" y="244" textAnchor="middle" className="fill-cyan-300 text-[11px] font-bold">1967</text>
        <text x="176" y="258" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">44GS + Grammar</text>
        <text x="176" y="270" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">of Design</text>

        {/* 1977 -- above */}
        <circle cx="305" cy="160" r="6" className="fill-emerald-500 stroke-emerald-300" strokeWidth="2" />
        <line x1="305" y1="154" x2="305" y2="90" className="stroke-emerald-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="230" y="40" width="152" height="50" rx="6" className="fill-emerald-500/12 stroke-emerald-500" strokeWidth="1.5" />
        <text x="306" y="58" textAnchor="middle" className="fill-emerald-300 text-[11px] font-bold">1977</text>
        <text x="306" y="72" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Akahane conceives</text>
        <text x="306" y="84" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Spring Drive concept</text>
        <text x="306" y="96" textAnchor="middle" className="fill-emerald-400/70 text-[8px] font-semibold">Suwa Seikosha</text>

        {/* 1998 -- below */}
        <circle cx="460" cy="160" r="6" className="fill-rose-600 stroke-rose-400" strokeWidth="2" />
        <line x1="460" y1="166" x2="460" y2="226" className="stroke-rose-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="385" y="226" width="152" height="54" rx="6" className="fill-rose-500/10 stroke-rose-500/50" strokeWidth="1.5" />
        <text x="461" y="244" textAnchor="middle" className="fill-rose-300 text-[11px] font-bold">1998</text>
        <text x="461" y="258" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Akahane passes away</text>
        <text x="461" y="272" textAnchor="middle" className="fill-rose-400/80 text-[8px] font-semibold">months before launch</text>

        {/* 1999 -- above */}
        <circle cx="540" cy="160" r="6" className="fill-emerald-500 stroke-emerald-300" strokeWidth="2" />
        <line x1="540" y1="154" x2="540" y2="90" className="stroke-emerald-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="466" y="40" width="150" height="50" rx="6" className="fill-emerald-500/15 stroke-emerald-500" strokeWidth="1.5" />
        <text x="541" y="58" textAnchor="middle" className="fill-emerald-300 text-[11px] font-bold">1999</text>
        <text x="541" y="72" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">First Spring Drive</text>
        <text x="541" y="84" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">manual cal. 7R68</text>

        {/* 2004 -- below */}
        <circle cx="630" cy="160" r="5" className="fill-fuchsia-500 stroke-fuchsia-300" strokeWidth="1.5" />
        <line x1="630" y1="165" x2="630" y2="226" className="stroke-fuchsia-500/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="556" y="226" width="150" height="54" rx="6" className="fill-fuchsia-500/10 stroke-fuchsia-500/50" strokeWidth="1" />
        <text x="631" y="244" textAnchor="middle" className="fill-fuchsia-300 text-[11px] font-bold">2004</text>
        <text x="631" y="258" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Automatic cal. 9R65</text>
        <text x="631" y="272" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">72-hour power reserve</text>

        {/* 2017 -- above */}
        <circle cx="730" cy="160" r="6" className="fill-amber-400 stroke-amber-200" strokeWidth="2" />
        <line x1="730" y1="154" x2="730" y2="90" className="stroke-amber-400/60" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="658" y="40" width="140" height="50" rx="6" className="fill-amber-500/12 stroke-amber-400/60" strokeWidth="1.5" />
        <text x="728" y="58" textAnchor="middle" className="fill-amber-300 text-[11px] font-bold">2017</text>
        <text x="728" y="72" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">Grand Seiko becomes</text>
        <text x="728" y="84" textAnchor="middle" className="fill-muted-foreground/80 text-[8px]">independent brand</text>

        {/* Akahane span annotation */}
        <line
          x1="305"
          y1="308"
          x2="460"
          y2="308"
          className="stroke-rose-500/50"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <text
          x="382"
          y="324"
          textAnchor="middle"
          className="fill-rose-400/80 text-[8px]"
        >
          Akahane&apos;s 21-year quest (1977-1998)
        </text>

        {/* Bottom note */}
        <text
          x="400"
          y="340"
          textAnchor="middle"
          className="fill-muted-foreground/40 text-[8px]"
        >
          28 years from concept to debut
        </text>
      </svg>
    </DiagramWrapper>
  );
}
