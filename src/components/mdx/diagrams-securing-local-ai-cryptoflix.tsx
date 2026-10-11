/**
 * "Local AI, Zero Trust" post diagrams, part 1: the four-feature map and
 * the lessons-to-controls map. Editorial SVG built on the shared
 * primitives. Labels stay generic: no catalog service name, no titles.
 */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * The four shipped features as rows: feature and model, where it runs and
 * what goes in and out, and whether anything leaves the Mac.
 */
export function LocalAiFeatureMapDiagram({ caption }: DiagramProps) {
  const rows = [
    {
      name: "Search by plot",
      model: "nomic-embed-text",
      runs: "Ollama, loopback only",
      io: ["in: catalog text and a typed query", "out: 768-number vectors"],
      leave: "Nothing leaves",
      leaveSub: "loopback only",
      out: false,
    },
    {
      name: "Sync and quote search",
      model: "Silero speech detector",
      runs: "cf-whisper, sandboxed",
      io: ["in: 16 kHz audio", "out: validated speech spans"],
      leave: "Nothing leaves",
      leaveSub: "no network at all",
      out: false,
    },
    {
      name: "Who's on screen",
      model: "Apple Vision + SFace",
      runs: "cf-vision, sandboxed",
      io: ["in: keyframes and that title's cast photos", "out: who, when, how sure"],
      leave: "Nothing goes out",
      leaveSub: "photos are fetched in",
      out: false,
    },
    {
      name: "Previously on",
      model: "Claude (sonnet, low)",
      runs: "Claude CLI, headless",
      io: ["in: cleaned subtitle lines and numbers", "out: schema-checked JSON"],
      leave: "Subtitle text goes out",
      leaveSub: "the one outbound path",
      out: true,
    },
  ] as const;

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Four features, four different runtimes. Three stay entirely on the Mac; the recap writer is the only one whose input leaves it."
      }
    >
      <EditorialFrame
        id="slai2"
        w={920}
        h={520}
        eyebrow="The Four Features at a Glance"
        chips={[
          { label: "4 features", accent: "primary" },
          { label: "1 outbound", accent: "amber" },
        ]}
        footerRight="Model · runtime · what crosses the wire"
      >
        <SectionLabel x={24} y={84} label="Feature and model" accent="primary" />
        <SectionLabel x={310} y={84} label="Where it runs" accent="violet" />
        <SectionLabel x={706} y={84} label="Leaves the Mac?" accent="amber" />
        {rows.map((row, i) => {
          const y = 98 + i * 96;
          const cy = y + 42;
          return (
            <g key={row.name}>
              <NodePanel
                x={24}
                y={y}
                w={262}
                h={84}
                title={row.name}
                sub={[row.model]}
                align="left"
                titleSize={17}
                subSize={12.5}
              />
              <FlowLine id="slai2" d={`M286,${cy} L310,${cy}`} accent="violet" />
              <NodePanel
                x={310}
                y={y}
                w={372}
                h={84}
                accent="violet"
                title={row.runs}
                sub={[...row.io]}
                align="left"
                titleSize={17}
                subSize={12.5}
              />
              <FlowLine
                id="slai2"
                d={`M682,${cy} L706,${cy}`}
                accent={row.out ? "amber" : "emerald"}
              />
              <NodePanel
                x={706}
                y={y}
                w={190}
                h={84}
                accent={row.out ? "amber" : "emerald"}
                emphasis={row.out}
                title={row.leave}
                sub={[row.leaveSub]}
                titleSize={row.out ? 14.5 : 16}
                subSize={12.5}
              />
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

