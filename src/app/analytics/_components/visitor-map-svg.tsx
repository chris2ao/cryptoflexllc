import type { MapLocation } from "@/lib/analytics-types";

const WORLD_PATHS = [
  "M160,180 Q100,160 110,120 Q140,80 200,100 Q240,140 220,190 Q200,260 150,260 Q120,240 160,180 Z",
  "M250,160 Q290,150 310,190 Q300,240 260,260 Q240,230 240,200 Q230,170 250,160 Z",
  "M260,290 Q290,280 310,320 Q320,380 290,410 Q260,400 250,370 Q245,330 260,290 Z",
  "M440,120 Q500,90 540,130 Q560,170 540,200 Q500,215 470,200 Q440,180 440,120 Z",
  "M540,220 Q580,210 620,240 Q600,310 540,340 Q500,310 490,270 Q510,230 540,220 Z",
  "M580,140 Q680,120 760,150 Q800,190 780,240 Q700,250 640,230 Q590,200 580,140 Z",
  "M780,200 Q820,210 840,260 Q830,290 790,300 Q760,280 780,200 Z",
  "M820,340 Q870,330 890,360 Q880,395 830,400 Q800,380 820,340 Z",
];

const W = 1000;
const H = 480;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

type Props = {
  data: MapLocation[];
};

export function VisitorMapSvg({ data }: Props) {
  const graticule = [] as Array<{ x1: number; y1: number; x2: number; y2: number }>;
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(lat, 0);
    graticule.push({ x1: 0, y1: y, x2: W, y2: y });
  }
  for (let lon = -150; lon <= 150; lon += 30) {
    const [x] = project(0, lon);
    graticule.push({ x1: x, y1: 0, x2: x, y2: H });
  }

  const valid = data.filter(
    (d) =>
      d.latitude != null &&
      d.longitude != null &&
      d.latitude !== "" &&
      d.longitude !== ""
  );
  const maxV = Math.max(...valid.map((d) => d.views), 1);

  return (
    <div className="ax-map-wrap">
      <svg
        className="ax-map-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Visitor map"
      >
        <rect width={W} height={H} fill="transparent" />
        {graticule.map((g, i) => (
          <line
            key={`g-${i}`}
            className="graticule"
            x1={g.x1}
            y1={g.y1}
            x2={g.x2}
            y2={g.y2}
          />
        ))}
        {WORLD_PATHS.map((d, i) => (
          <path key={`land-${i}`} className="land" d={d} />
        ))}
        {valid.map((loc, i) => {
          const lat = Number(loc.latitude);
          const lon = Number(loc.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
          const [x, y] = project(lat, lon);
          const r = 2 + (loc.views / maxV) * 8;
          const op = 0.4 + (loc.views / maxV) * 0.6;
          const delay = `${(loc.views % 17) * 120}ms`;
          const label = `${loc.city || loc.country || "Unknown"} · ${loc.views.toLocaleString()} views`;
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
