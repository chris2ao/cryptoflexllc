/** Journey blog post diagrams -- SVG-based, themed to site colors */

interface DiagramProps {
  caption?: string;
}

function DiagramWrapper({
  caption,
  children,
}: DiagramProps & { children: React.ReactNode }) {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-lg border border-border/60 bg-card/50 p-6 overflow-x-auto">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function JourneyTimelineDiagram({ caption }: DiagramProps) {
  const days = [
    { num: 1, label: "First Deploy" },
    { num: 2, label: "Analytics" },
    { num: 3, label: "Design System" },
    { num: 4, label: "Newsletter" },
    { num: 5, label: "Comments" },
    { num: 6, label: "Testing" },
    { num: 7, label: "Polish" },
  ];

  return (
    <DiagramWrapper
      caption={caption ?? "7 days, 117 commits: from zero to production"}
    >
      <svg
        viewBox="0 0 800 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-2xl mx-auto"
      >
        <defs>
          <marker
            id="journey-arrow"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-cyan-500" />
          </marker>
        </defs>

        {/* Timeline connecting line */}
        <line
          x1="70"
          y1="50"
          x2="730"
          y2="50"
          className="stroke-foreground/40"
          strokeWidth="2"
        />

        {/* Day nodes */}
        {days.map((day, index) => {
          const x = 70 + index * 110;
          return (
            <g key={day.num}>
              {/* Circle node */}
              <circle
                cx={x}
                cy="50"
                r="20"
                className="fill-cyan-500/20 stroke-cyan-500"
                strokeWidth="2"
              />
              {/* Day number */}
              <text
                x={x}
                y="55"
                textAnchor="middle"
                className="fill-cyan-500 text-[16px] font-bold"
              >
                {day.num}
              </text>
              {/* Label below */}
              {(() => {
                const words = day.label.split(" ");
                return (
                  <>
                    <text
                      x={x}
                      y="95"
                      textAnchor="middle"
                      className="fill-foreground text-[12px] font-medium"
                    >
                      {words[0]}
                    </text>
                    {words.length > 1 && (
                      <text
                        x={x}
                        y="110"
                        textAnchor="middle"
                        className="fill-foreground text-[12px] font-medium"
                      >
                        {words.slice(1).join(" ")}
                      </text>
                    )}
                  </>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}

export function WelcomeEmailSagaDiagram({ caption }: DiagramProps) {
  const prs = [
    { num: 20, title: "Fix CVE", status: "success", icon: "✓" },
    { num: 21, title: "Build Endpoint", status: "success", icon: "✓" },
    { num: 22, title: "POST to GET", status: "warning", icon: "⚠" },
    { num: 23, title: "WAF Blocks It", status: "error", icon: "✗" },
    { num: 24, title: "Move Endpoint", status: "party", icon: "🎉" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "stroke-green-500 fill-green-500/10";
      case "warning":
        return "stroke-amber-500 fill-amber-500/10";
      case "error":
        return "stroke-red-500 fill-red-500/10";
      case "party":
        return "stroke-green-500 fill-green-500/20";
      default:
        return "stroke-foreground/60 fill-card/50";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "success":
        return "fill-green-500";
      case "warning":
        return "fill-amber-500";
      case "error":
        return "fill-red-500";
      case "party":
        return "fill-green-500";
      default:
        return "fill-foreground";
    }
  };

  return (
    <DiagramWrapper
      caption={
        caption ??
        "5 pull requests to send one welcome email. We don't talk about PR 23."
      }
    >
      <svg
        viewBox="0 0 800 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-3xl mx-auto"
      >
        <defs>
          <marker
            id="saga-arrow-green"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-green-500" />
          </marker>
          <marker
            id="saga-arrow-amber"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-amber-500" />
          </marker>
          <marker
            id="saga-arrow-red"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-red-500" />
          </marker>
        </defs>

        {/* PR boxes */}
        {prs.map((pr, index) => {
          const x = 20 + index * 155;
          const arrowMarker =
            pr.status === "error"
              ? "saga-arrow-red"
              : pr.status === "warning"
                ? "saga-arrow-amber"
                : "saga-arrow-green";

          return (
            <g key={pr.num}>
              {/* PR box */}
              <rect
                x={x}
                y="40"
                width="130"
                height="100"
                rx="8"
                className={getStatusColor(pr.status)}
                strokeWidth="2"
              />

              {/* PR number header */}
              <rect
                x={x}
                y="40"
                width="130"
                height="30"
                rx="8"
                className="fill-foreground/5"
              />
              <text
                x={x + 65}
                y="60"
                textAnchor="middle"
                className="fill-foreground text-[11px] font-bold"
              >
                PR #{pr.num}
              </text>

              {/* Title */}
              <text
                x={x + 65}
                y="95"
                textAnchor="middle"
                className="fill-foreground text-[12px] font-medium"
              >
                {pr.title.split(" ")[0]}
              </text>
              <text
                x={x + 65}
                y="110"
                textAnchor="middle"
                className="fill-foreground text-[12px] font-medium"
              >
                {pr.title.split(" ").slice(1).join(" ")}
              </text>

              {/* Status icon */}
              {pr.status === "party" ? (
                <text
                  x={x + 65}
                  y="130"
                  textAnchor="middle"
                  className="text-[20px]"
                >
                  {pr.icon}
                </text>
              ) : (
                <text
                  x={x + 65}
                  y="132"
                  textAnchor="middle"
                  className={`${getIconColor(pr.status)} text-[24px] font-bold`}
                >
                  {pr.icon}
                </text>
              )}

              {/* Arrow to next PR */}
              {index < prs.length - 1 && (
                <line
                  x1={x + 130}
                  y1="90"
                  x2={x + 155}
                  y2="90"
                  className={
                    pr.status === "error"
                      ? "stroke-red-500"
                      : pr.status === "warning"
                        ? "stroke-amber-500"
                        : "stroke-green-500"
                  }
                  strokeWidth="2"
                  markerEnd={`url(#${arrowMarker})`}
                />
              )}
            </g>
          );
        })}
      </svg>
    </DiagramWrapper>
  );
}

export function BeforeAfterArchitectureDiagram({ caption }: DiagramProps) {
  return (
    <DiagramWrapper
      caption={
        caption ??
        "What 117 commits and 7 sleepless nights look like in architecture form"
      }
    >
      <svg
        viewBox="0 0 900 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl mx-auto"
      >
        <defs>
          <marker
            id="arch-arrow-muted"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
          </marker>
          <marker
            id="arch-arrow-cyan"
            viewBox="0 0 10 7"
            refX="9"
            refY="3.5"
            markerWidth="8"
            markerHeight="6"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" className="fill-cyan-500" />
          </marker>
        </defs>

        {/* Day 1 label */}
        <text
          x="120"
          y="30"
          textAnchor="middle"
          className="fill-muted-foreground text-[16px] font-bold"
        >
          Day 1
        </text>

        {/* Day 1: Simple stack (left side) */}
        <g>
          {/* Next.js */}
          <rect
            x="50"
            y="60"
            width="140"
            height="50"
            rx="8"
            className="stroke-muted-foreground/60 fill-muted/30"
            strokeWidth="1.5"
          />
          <text
            x="120"
            y="90"
            textAnchor="middle"
            className="fill-muted-foreground text-[14px] font-medium"
          >
            Next.js
          </text>

          {/* Arrow down */}
          <line
            x1="120"
            y1="110"
            x2="120"
            y2="145"
            className="stroke-muted-foreground/60"
            strokeWidth="2"
            markerEnd="url(#arch-arrow-muted)"
          />

          {/* Vercel */}
          <rect
            x="50"
            y="145"
            width="140"
            height="50"
            rx="8"
            className="stroke-muted-foreground/60 fill-muted/30"
            strokeWidth="1.5"
          />
          <text
            x="120"
            y="175"
            textAnchor="middle"
            className="fill-muted-foreground text-[14px] font-medium"
          >
            Vercel
          </text>

          {/* Arrow down */}
          <line
            x1="120"
            y1="195"
            x2="120"
            y2="230"
            className="stroke-muted-foreground/60"
            strokeWidth="2"
            markerEnd="url(#arch-arrow-muted)"
          />

          {/* Browser */}
          <rect
            x="50"
            y="230"
            width="140"
            height="50"
            rx="8"
            className="stroke-muted-foreground/60 fill-muted/30"
            strokeWidth="1.5"
          />
          <text
            x="120"
            y="260"
            textAnchor="middle"
            className="fill-muted-foreground text-[14px] font-medium"
          >
            Browser
          </text>
        </g>

        {/* Vertical divider with arrow */}
        <line
          x1="300"
          y1="50"
          x2="300"
          y2="300"
          className="stroke-foreground/30"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <text
          x="300"
          y="320"
          textAnchor="middle"
          className="fill-foreground/50 text-[14px]"
        >
          →
        </text>

        {/* Day 7 label */}
        <text
          x="600"
          y="30"
          textAnchor="middle"
          className="fill-cyan-500 text-[16px] font-bold"
        >
          Day 7
        </text>

        {/* Day 7: Full architecture (right side, hub-and-spoke) */}
        <g>
          {/* Center: Next.js App */}
          <rect
            x="530"
            y="150"
            width="140"
            height="50"
            rx="8"
            className="stroke-cyan-500 fill-cyan-500/20"
            strokeWidth="2"
          />
          <text
            x="600"
            y="175"
            textAnchor="middle"
            className="fill-cyan-500 text-[14px] font-bold"
          >
            Next.js App
          </text>

          {/* Top row */}
          {/* Neon Postgres */}
          <rect
            x="360"
            y="60"
            width="100"
            height="40"
            rx="6"
            className="stroke-green-500 fill-green-500/10"
            strokeWidth="1.5"
          />
          <text
            x="410"
            y="82"
            textAnchor="middle"
            className="fill-green-500 text-[11px] font-medium"
          >
            Neon
          </text>
          <text
            x="410"
            y="94"
            textAnchor="middle"
            className="fill-green-500 text-[11px] font-medium"
          >
            Postgres
          </text>
          <line
            x1="460"
            y1="90"
            x2="570"
            y2="155"
            className="stroke-green-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* Newsletter Cron */}
          <rect
            x="480"
            y="60"
            width="100"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="530"
            y="82"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            Newsletter
          </text>
          <text
            x="530"
            y="94"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            Cron
          </text>
          <line
            x1="550"
            y1="100"
            x2="580"
            y2="150"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* Comments */}
          <rect
            x="600"
            y="60"
            width="80"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="640"
            y="85"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            Comments
          </text>
          <line
            x1="630"
            y1="100"
            x2="610"
            y2="150"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* Analytics */}
          <rect
            x="700"
            y="60"
            width="80"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="740"
            y="85"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            Analytics
          </text>
          <line
            x1="720"
            y1="90"
            x2="640"
            y2="155"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* Bottom row */}
          {/* WAF */}
          <rect
            x="360"
            y="250"
            width="70"
            height="40"
            rx="6"
            className="stroke-amber-500 fill-amber-500/10"
            strokeWidth="1.5"
          />
          <text
            x="395"
            y="275"
            textAnchor="middle"
            className="fill-amber-500 text-[11px] font-medium"
          >
            WAF
          </text>
          <line
            x1="430"
            y1="265"
            x2="550"
            y2="195"
            className="stroke-amber-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* 410 Tests */}
          <rect
            x="450"
            y="250"
            width="80"
            height="40"
            rx="6"
            className="stroke-green-500 fill-green-500/10"
            strokeWidth="1.5"
          />
          <text
            x="490"
            y="275"
            textAnchor="middle"
            className="fill-green-500 text-[11px] font-medium"
          >
            410 Tests
          </text>
          <line
            x1="510"
            y1="250"
            x2="580"
            y2="200"
            className="stroke-green-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* AI Intros */}
          <rect
            x="550"
            y="250"
            width="80"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="590"
            y="275"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            AI Intros
          </text>
          <line
            x1="600"
            y1="250"
            x2="600"
            y2="200"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* RSS */}
          <rect
            x="650"
            y="250"
            width="60"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="680"
            y="275"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            RSS
          </text>
          <line
            x1="670"
            y1="250"
            x2="620"
            y2="200"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />

          {/* GA4 */}
          <rect
            x="730"
            y="250"
            width="60"
            height="40"
            rx="6"
            className="stroke-cyan-500 fill-cyan-500/10"
            strokeWidth="1.5"
          />
          <text
            x="760"
            y="275"
            textAnchor="middle"
            className="fill-cyan-500 text-[11px] font-medium"
          >
            GA4
          </text>
          <line
            x1="740"
            y1="260"
            x2="650"
            y2="195"
            className="stroke-cyan-500/60"
            strokeWidth="1.5"
            markerEnd="url(#arch-arrow-cyan)"
          />
        </g>
      </svg>
    </DiagramWrapper>
  );
}
