import Link from "next/link";

export type RankedItem = {
  label: string;
  value: number;
  sublabel?: string;
  flag?: string;
  href?: string;
};

/**
 * Reject external / protocol-relative paths before they become link hrefs.
 * Only accepts a single leading slash followed by a non-slash character.
 */
function isSafeInternalPath(href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false;
  if (href.startsWith("/\\")) return false;
  return true;
}

type Props = {
  items: RankedItem[];
  formatValue?: (n: number) => string;
  maxValue?: number;
  emptyText?: string;
};

const defaultFormat = (n: number) => n.toLocaleString();

export function AxRankedList({
  items,
  formatValue = defaultFormat,
  maxValue,
  emptyText = "No data in range",
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
        {emptyText}
      </p>
    );
  }

  const max = Math.max(
    maxValue ?? 0,
    ...items.map((item) => item.value),
    1
  );

  return (
    <ul className="ax-list" role="list">
      {items.map((item, i) => {
        const pct = Math.round((item.value / max) * 100);
        const Inner = (
          <>
            <span className="idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="name">
              {item.flag && (
                <span className="flag" aria-hidden="true">
                  {item.flag}
                </span>
              )}
              {item.label}
              {item.sublabel && (
                <span className="sub"> · {item.sublabel}</span>
              )}
            </span>
            <span className="bar" aria-hidden="true">
              <i style={{ width: `${pct}%` }} />
            </span>
            <span className="val">{formatValue(item.value)}</span>
          </>
        );
        return (
          <li
            key={`${item.label}-${i}`}
            className="ax-row"
            style={{ listStyle: "none" }}
          >
            {item.href && isSafeInternalPath(item.href) ? (
              <Link href={item.href} className="ax-row-link">
                {Inner}
              </Link>
            ) : (
              Inner
            )}
          </li>
        );
      })}
    </ul>
  );
}
