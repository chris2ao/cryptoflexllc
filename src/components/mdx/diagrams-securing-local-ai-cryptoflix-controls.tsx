/**
 * "Local AI, Zero Trust" post diagrams, part 2: the process-level
 * controls (defense layers, sandbox profiles, recap isolation, egress).
 * Editorial SVG built on the shared primitives.
 */

import { DiagramLightbox } from "./diagram-lightbox";
import {
  EditorialFrame,
  NodePanel,
  FlowLine,
  SectionLabel,
  StepBadge,
  Chip,
  type DiagramAccent,
} from "./diagram-editorial";

interface DiagramProps {
  caption?: string;
}

/**
 * Five layers every local model job passes through, top to bottom, each
 * with the failure it produces.
 */
export function LocalAiDefenseLayersDiagram({ caption }: DiagramProps) {
  const layers: {
    title: string;
    sub: string;
    chip: string;
    accent: DiagramAccent;
    emphasis?: boolean;
  }[] = [
    {
      title: "Pins verified",
      sub: "SHA-256 and size match, folders are 0700, checked before every spawn",
      chip: "fail: tools off",
      accent: "amber",
    },
    {
      title: "Sandbox profile",
      sub: "deny default: no network, no writes, no signals, one allowed exec",
      chip: "kernel enforced",
      accent: "primary",
      emphasis: true,
    },
    {
      title: "No shell, scrubbed environment",
      sub: "nice -n 19, only PATH and TMPDIR, arguments match a token regex",
      chip: "no secrets inside",
      accent: "primary",
    },
    {
      title: "Output caps and schema",
      sub: "NDJSON line and size caps, zod checks, first line is the pinned model key",
      chip: "fixed error codes",
      accent: "primary",
    },
    {
      title: "Stored as data only",
      sub: "speech spans or face rows go in a table; nothing runs them or acts on them",
      chip: "no action follows",
      accent: "emerald",
    },
  ];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Every local model job passes through five layers in order. A failure at any layer ends the job with a fixed code, and what survives is stored as plain data."
      }
    >
      <EditorialFrame
        id="slai7"
        w={920}
        h={538}
        eyebrow="Five Layers Around One Model Job"
        chips={[
          { label: "5 layers", accent: "primary" },
          { label: "fail closed", accent: "amber" },
        ]}
        footerRight="Pin · sandbox · spawn · validate · store"
      >
        {layers.map((layer, i) => {
          const y = 76 + i * 88;
          return (
            <g key={layer.title}>
              <StepBadge cx={36} cy={y + 33} n={i + 1} accent="primary" />
              <NodePanel
                x={62}
                y={y}
                w={834}
                h={66}
                accent={layer.accent}
                emphasis={layer.emphasis}
                align="left"
                title={layer.title}
                sub={[layer.sub]}
                titleSize={17}
                subSize={12.5}
              >
                <Chip
                  x={880}
                  y={y + 22}
                  label={layer.chip}
                  accent={layer.accent}
                  filled
                  anchor="end"
                  fontSize={11}
                />
              </NodePanel>
              {i < layers.length - 1 && (
                <FlowLine id="slai7" d={`M479,${y + 66} L479,${y + 88}`} accent="muted" />
              )}
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Sandbox profiles for the two local tools: a shared deny-default base,
 * then what each tool is allowed on top.
 */
export function LocalAiSandboxLayersDiagram({ caption }: DiagramProps) {
  return (
    <DiagramLightbox
      caption={
        caption ??
        "Both local tools start from the same deny-default profile, built in code. cf-whisper needs nothing more; cf-vision gets a short list of extras it cannot work without."
      }
    >
      <EditorialFrame
        id="slai8"
        w={920}
        h={500}
        eyebrow="Sandbox Profiles Around the Local Tools"
        chips={[
          { label: "deny default", accent: "red" },
          { label: "built in code", accent: "primary" },
        ]}
        footerRight="sandbox-exec · one allowed exec · no network"
      >
        <NodePanel
          x={24}
          y={74}
          w={872}
          h={112}
          accent="primary"
          emphasis
          align="left"
          title="Base profile, shared by both tools"
          sub={[
            "(deny default)",
            '(deny mach-lookup (xpc-service-name-prefix ""))',
            '(deny mach-lookup (global-name "com.apple.trustd" "com.apple.trustd.agent"))',
          ]}
          titleSize={17}
          subSize={12.5}
        >
          <Chip x={880} y={84} label="no network" accent="red" filled anchor="end" fontSize={11} />
          <Chip x={880} y={112} label="no file writes" accent="red" filled anchor="end" fontSize={11} />
          <Chip x={880} y={140} label="no signals" accent="red" filled anchor="end" fontSize={11} />
        </NodePanel>

        {/* Fan-out to the two tools */}
        <path d="M460,186 L460,206" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <path d="M236,206 L684,206" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        <FlowLine id="slai8" d="M236,206 L236,224" accent="muted" />
        <FlowLine id="slai8" d="M684,206 L684,224" accent="muted" />

        <NodePanel
          x={24}
          y={224}
          w={424}
          h={152}
          accent="emerald"
          align="left"
          title="cf-whisper adds almost nothing"
          sub={[
            "allow exec of the one binary",
            "VAD model arrives as open fd 3",
            "no path to read, nothing to write",
            "built without Metal, CPU only",
            "stderr drained and dropped",
          ]}
          titleSize={17}
          subSize={12.5}
        />
        <NodePanel
          x={472}
          y={224}
          w={424}
          h={152}
          accent="violet"
          align="left"
          title="cf-vision adds three things"
          sub={[
            "allow exec of the one binary",
            "read metadata of its own bin/ folder",
            "GPU clients: AGXDeviceUserClient and",
            "IOSurfaceRootUserClient",
            "read the compiled SFace folder only",
          ]}
          titleSize={17}
          subSize={12.5}
        />

        <NodePanel
          x={24}
          y={396}
          w={872}
          h={60}
          accent="amber"
          variant="dashed"
          align="left"
          title="A profile that is too tight fails silently"
          sub={["without the GPU client, Vision returns no faces and no error, so the check tests that faces are found"]}
          titleSize={17}
          subSize={12.5}
        />
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * The recap writer lives in a different kind of box: one headless
 * process wrapped by four independent guards.
 */
export function LocalAiRecapIsolationDiagram({ caption }: DiagramProps) {
  const guards: {
    title: string;
    chip: string;
    accent: DiagramAccent;
    emphasis?: boolean;
    sub: string[];
  }[] = [
    {
      title: "Sandbox: allow default, then deny",
      chip: "deny list",
      accent: "primary",
      sub: [
        "denies the media drive except a private recap temp folder",
        "denies ~/.claude/secrets, ~/.ssh, app config, data and logs",
        "denies LaunchAgents, nsmb.conf writes, every hard link and clone",
      ],
    },
    {
      title: "Flags that switch things off",
      chip: "tools off",
      accent: "primary",
      emphasis: true,
      sub: [
        '--tools "" --safe-mode --setting-sources ""',
        "--strict-mcp-config --disable-slash-commands --no-chrome",
        "--no-session-persistence --permission-prompts none",
      ],
    },
    {
      title: "Scrubbed environment",
      chip: "no app secrets",
      accent: "primary",
      sub: [
        "HOME, USER, LOGNAME, LANG, PATH=/usr/bin:/bin, TMPDIR",
        "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1, working directory /",
        "no app variables and no ANTHROPIC_* variables",
      ],
    },
    {
      title: "Checks before and after",
      chip: "fails closed",
      accent: "amber",
      sub: [
        "claudeLauncherCheck.ts: no hook ran, no prompt text in ~/.claude",
        "--help must list every flag, else recaps stop with cli_changed",
        "claude auth status within the last hour, logged-in Max account",
      ],
    },
  ];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "One headless Claude process wrapped by four guards: a deny-list sandbox, command-line flags that switch off everything optional, a scrubbed environment, and checks that stop recaps instead of guessing."
      }
    >
      <EditorialFrame
        id="slai9"
        w={920}
        h={626}
        eyebrow="A Smaller Box for Claude"
        chips={[
          { label: "4 guards", accent: "primary" },
          { label: "honest limit", accent: "amber" },
        ]}
        footerRight="Well-behaved CLI · not a hostile binary"
      >
        <NodePanel
          x={24}
          y={70}
          w={872}
          h={106}
          accent="violet"
          emphasis
          terminal
          align="left"
          title="claude -p, headless"
          sub={[
            "model sonnet, effort low, on my Max plan, never the paid API",
            "input: cleaned subtitle lines. Output: schema-checked JSON",
          ]}
          titleSize={17}
          subSize={12.5}
        />

        {/* Guard rail */}
        <path d="M44,176 L44,537" fill="none" className="stroke-foreground/25" strokeWidth="1.5" />
        {guards.map((g, i) => {
          const y = 186 + i * 102;
          return (
            <g key={g.title}>
              <FlowLine id="slai9" d={`M44,${y + 45} L62,${y + 45}`} accent="muted" />
              <NodePanel
                x={62}
                y={y}
                w={834}
                h={90}
                accent={g.accent}
                emphasis={g.emphasis}
                align="left"
                title={g.title}
                sub={g.sub}
                titleSize={17}
                subSize={12.5}
              >
                <Chip
                  x={880}
                  y={y + 14}
                  label={g.chip}
                  accent={g.accent}
                  filled
                  anchor="end"
                  fontSize={11}
                />
              </NodePanel>
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}

/**
 * Every path that crosses the Mac boundary, with direction and guard.
 */
export function LocalAiEgressMapDiagram({ caption }: DiagramProps) {
  const rows: {
    left: string;
    leftSub: string;
    mid: string;
    midSub: string[];
    right: string;
    rightSub: string;
    accent: DiagramAccent;
    kind: "blocked" | "out" | "in" | "loop";
  }[] = [
    {
      left: "Local tools",
      leftSub: "cf-whisper, cf-vision",
      mid: "No network at all",
      midSub: ["sandbox denies it; a DNS probe", "fails with EAI_NONAME"],
      right: "Nowhere to go",
      rightSub: "no network in the profile",
      accent: "muted",
      kind: "blocked",
    },
    {
      left: "Plot search",
      leftSub: "server to Ollama",
      mid: "Loopback, two endpoints",
      midSub: ["catalog text and typed query only", "3xx refused, 2 MB cap, no auth header"],
      right: "Ollama",
      rightSub: "127.0.0.1:11434",
      accent: "cyan",
      kind: "loop",
    },
    {
      left: "Recap writer",
      leftSub: "Claude CLI",
      mid: "Out: subtitle text and numbers",
      midSub: ["no titles, names, overviews or paths", "the one path that leaves the Mac"],
      right: "Anthropic",
      rightSub: "via my Claude CLI login",
      accent: "amber",
      kind: "out",
    },
    {
      left: "Server",
      leftSub: "fetches cast photos",
      mid: "In: JPEGs, held in memory",
      midSub: ["strict file-name allowlist, JPEG check", "1 MB and 10 s each, 3xx refused"],
      right: "One fixed image host",
      rightSub: "public, HTTPS only",
      accent: "cyan",
      kind: "in",
    },
  ];

  return (
    <DiagramLightbox
      caption={
        caption ??
        "Four paths, four rules. The local tools have no network, Ollama is loopback only, recaps send subtitle text out, and cast photos come in from one fixed host."
      }
    >
      <EditorialFrame
        id="slai10"
        w={920}
        h={528}
        eyebrow="What Leaves the Mac, and What Comes In"
        chips={[
          { label: "1 outbound", accent: "amber" },
          { label: "1 inbound", accent: "cyan" },
        ]}
        footerRight="Four paths · one rule each"
      >
        <SectionLabel x={24} y={82} label="Inside the Mac" accent="primary" />
        <SectionLabel x={252} y={82} label="What crosses, and the guard" accent="amber" />
        <SectionLabel x={672} y={82} label="Other end" accent="cyan" />
        {rows.map((r, i) => {
          const y = 96 + i * 100;
          const cy = y + 44;
          const blocked = r.kind === "blocked";
          const leftward = r.kind === "in";
          return (
            <g key={r.left}>
              <NodePanel
                x={24}
                y={y}
                w={200}
                h={88}
                title={r.left}
                sub={[r.leftSub]}
                titleSize={17}
                subSize={12.5}
              />
              <NodePanel
                x={252}
                y={y}
                w={392}
                h={88}
                accent={r.accent}
                emphasis={r.kind === "out"}
                variant={blocked ? "dashed" : "solid"}
                title={r.mid}
                sub={r.midSub}
                titleSize={17}
                subSize={12.5}
              />
              <NodePanel
                x={672}
                y={y}
                w={224}
                h={88}
                accent={blocked ? "muted" : r.accent}
                variant={blocked ? "ghost" : "solid"}
                title={r.right}
                sub={[r.rightSub]}
                titleSize={blocked ? 17 : 16}
                subSize={12.5}
              />
              {blocked ? (
                <>
                  <FlowLine id="slai10" d={`M224,${cy} L252,${cy}`} accent="red" dashed arrow={false} />
                  <line x1="232" y1={cy - 6} x2="244" y2={cy + 6} className="stroke-red-500" strokeWidth="2.5" />
                  <line x1="244" y1={cy - 6} x2="232" y2={cy + 6} className="stroke-red-500" strokeWidth="2.5" />
                </>
              ) : leftward ? (
                <>
                  <FlowLine id="slai10" d={`M252,${cy} L224,${cy}`} accent={r.accent} width={2} />
                  <FlowLine id="slai10" d={`M672,${cy} L644,${cy}`} accent={r.accent} width={2} />
                </>
              ) : (
                <>
                  <FlowLine id="slai10" d={`M224,${cy} L252,${cy}`} accent={r.accent} width={2} />
                  <FlowLine id="slai10" d={`M644,${cy} L672,${cy}`} accent={r.accent} width={2} />
                </>
              )}
            </g>
          );
        })}
      </EditorialFrame>
    </DiagramLightbox>
  );
}
