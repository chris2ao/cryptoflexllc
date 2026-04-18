import type { MapLocation } from "@/lib/analytics-types";
import { WORLD_LAND_PATHS } from "@/lib/world-map-data";

const W = 1000;
const H = 500;
const ORIGIN_LAT = 27.95;
const ORIGIN_LON = -82.46;
const CYCLE_MS = 3600;
const STAGGER_MS = 400;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

function arcPath(
  from: [number, number],
  to: [number, number]
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const bulge = Math.min(dist * 0.25, 140);
  // Always bow toward screen-top (negative y direction)
  const nx = -dy / dist;
  const ny = dx / dist;
  const sign = ny > 0 ? 1 : -1;
  const cx = mx + nx * bulge * sign;
  const cy = my + ny * bulge * sign - bulge;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

function buildGraticule(): string[] {
  const lines: string[] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(lat, -180);
    lines.push(`M0,${y.toFixed(1)}L${W},${y.toFixed(1)}`);
  }
  for (let lon = -150; lon <= 150; lon += 30) {
    const [x] = project(0, lon);
    lines.push(`M${x.toFixed(1)},0L${x.toFixed(1)},${H}`);
  }
  return lines;
}

type Props = {
  data: MapLocation[];
};

export function VisitorMapWorld({ data }: Props) {
  const graticuleLines = buildGraticule();
  const origin = project(ORIGIN_LAT, ORIGIN_LON);

  const valid = data.filter(
    (d) =>
      d.latitude != null &&
      d.longitude != null &&
      d.latitude !== "" &&
      d.longitude !== "" &&
      !Number.isNaN(Number(d.latitude)) &&
      !Number.isNaN(Number(d.longitude))
  );

  const maxV = Math.max(...valid.map((d) => d.views), 1);

  return (
    <div className="ax-map-wrap">
      <svg
        className="ax-world-map"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Visitor map showing ${valid.length} location${valid.length !== 1 ? "s" : ""}`}
      >
        <rect width={W} height={H} fill="transparent" />

        {/* Graticule grid */}
        {graticuleLines.map((d, i) => (
          <path key={`g-${i}`} className="graticule" d={d} />
        ))}

        {/* World land masses */}
        {WORLD_LAND_PATHS.map((d, i) => (
          <path key={`land-${i}`} className="ax-world-land" d={d} />
        ))}

        {/* Arc guide rails (faint full-path traces) */}
        {valid.map((loc, i) => {
          const lat = Number(loc.latitude);
          const lon = Number(loc.longitude);
          const dest = project(lat, lon);
          const d = arcPath(origin, dest);
          return (
            <path
              key={`arc-guide-${i}`}
              className="ax-arc-guide"
              d={d}
            />
          );
        })}

        {/* Animated arc heads */}
        {valid.map((loc, i) => {
          const lat = Number(loc.latitude);
          const lon = Number(loc.longitude);
          const dest = project(lat, lon);
          const d = arcPath(origin, dest);
          const delay = `${i * STAGGER_MS}ms`;
          const duration = `${CYCLE_MS}ms`;
          return (
            <path
              key={`arc-head-${i}`}
              className="ax-arc-head"
              d={d}
              style={{
                animationDelay: delay,
                animationDuration: duration,
              }}
            />
          );
        })}

        {/* Origin pulse ring at Tampa */}
        <circle
          className="ax-origin-pulse"
          cx={origin[0]}
          cy={origin[1]}
          r={7}
        />
        {/* Origin dot */}
        <circle
          className="ax-origin"
          cx={origin[0]}
          cy={origin[1]}
          r={4}
        />

        {/* Destination dots */}
        {valid.map((loc, i) => {
          const lat = Number(loc.latitude);
          const lon = Number(loc.longitude);
          const [x, y] = project(lat, lon);
          const r = 2 + (loc.views / maxV) * 8;
          const op = 0.4 + (loc.views / maxV) * 0.6;
          const delay = `${(loc.views % 17) * 120}ms`;
          const label = `${loc.city || loc.country || "Unknown"} \u00b7 ${loc.views.toLocaleString()} views`;
          return (
            <g key={`dot-${i}`}>
              <circle
                className="dot-pulse"
                cx={x}
                cy={y}
                r={r * 1.5}
                style={{ animationDelay: delay }}
              />
              <circle className="dot" cx={x} cy={y} r={r} opacity={op}>
                <title>{label}</title>
              </circle>
            </g>
          );
        })}
      </svg>
      <div className="ax-map-legend" aria-hidden="true">
        <span>Visits</span>
        <span className="scale">
          {[0.2, 0.4, 0.6, 0.8, 1].map((op, i) => (
            <i
              key={i}
              style={{
                background: `color-mix(in oklab, var(--primary) ${op * 100}%, transparent)`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
