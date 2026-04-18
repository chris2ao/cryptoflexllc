export type DonutItem = {
  label: string;
  value: number;
  color?: string;
};

type Props = {
  items: DonutItem[];
  centerLabel?: string;
  centerCaption?: string;
  ariaLabel?: string;
  formatValue?: (n: number) => string;
};

const DEFAULT_PALETTE = [
  "var(--primary)",
  "var(--ax-violet)",
  "var(--ax-amber)",
  "var(--ax-green)",
  "var(--ax-red)",
  "var(--ax-info)",
  "oklch(0.70 0.18 330)",
  "oklch(0.60 0.15 210)",
];

const defaultFormat = (n: number) => n.toLocaleString();

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Polar SVG constants: outer 40, inner 28, viewBox 0 0 100 100 centered at 50,50
const OUTER = 40;
const INNER = 28;
const CX = 50;
const CY = 50;

type SliceData = { path: string; color: string; pct: number };

function buildSlices(items: DonutItem[], total: number): SliceData[] {
  return items.reduce<{ slices: SliceData[]; cursor: number }>(
    ({ slices, cursor }, item, i) => {
      const frac = item.value / total;
      const angle = frac * Math.PI * 2;
      const start = cursor;
      const end = cursor + angle;

      const x1 = CX + OUTER * Math.cos(start);
      const y1 = CY + OUTER * Math.sin(start);
      const x2 = CX + OUTER * Math.cos(end);
      const y2 = CY + OUTER * Math.sin(end);
      const x3 = CX + INNER * Math.cos(end);
      const y3 = CY + INNER * Math.sin(end);
      const x4 = CX + INNER * Math.cos(start);
      const y4 = CY + INNER * Math.sin(start);

      const largeArc = angle > Math.PI ? 1 : 0;
      const path =
        frac >= 1 - 0.0001
          ? `M ${CX} ${CY - OUTER} A ${OUTER} ${OUTER} 0 1 1 ${CX} ${CY + OUTER} A ${OUTER} ${OUTER} 0 1 1 ${CX} ${CY - OUTER} M ${CX} ${CY - INNER} A ${INNER} ${INNER} 0 1 0 ${CX} ${CY + INNER} A ${INNER} ${INNER} 0 1 0 ${CX} ${CY - INNER} Z`
          : `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${OUTER} ${OUTER} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${INNER} ${INNER} 0 ${largeArc} 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;

      const color = item.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
      const pct = clamp(Math.round(frac * 100), 0, 100);
      return { slices: [...slices, { path, color, pct }], cursor: end };
    },
    { slices: [], cursor: -Math.PI / 2 }
  ).slices;
}

export function AxDonut({
  items,
  centerLabel,
  centerCaption,
  ariaLabel = "Breakdown chart",
  formatValue = defaultFormat,
}: Props) {
  if (!items || items.length === 0) {
    return (
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--fg-3)",
          padding: 8,
        }}
      >
        No data in range
      </p>
    );
  }

  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const slices = buildSlices(items, total);

  return (
    <div className="ax-donut-wrap">
      <div className="ax-donut-ctr">
        <svg className="ax-donut" viewBox="0 0 100 100" role="img" aria-label={ariaLabel}>
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.path}
              fill={slice.color}
              stroke="var(--surface-1)"
              strokeWidth="0.6"
            />
          ))}
        </svg>
        <div className="ax-donut-ctr-inner" aria-hidden="true">
          <div>
            {centerLabel && <div className="big">{centerLabel}</div>}
            {centerCaption && <div className="sm">{centerCaption}</div>}
          </div>
        </div>
      </div>
      <ul className="ax-donut-legend" role="list">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="lrow">
            <span
              className="sw"
              style={{
                background:
                  item.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length],
              }}
              aria-hidden="true"
            />
            <span className="name">{item.label}</span>
            <span className="v">{formatValue(item.value)}</span>
            <span className="p">{slices[i].pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

