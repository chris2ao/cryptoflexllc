import Link from "next/link";
import { formatPostDateShort } from "@/lib/post-date";
import type { SeriesSummary } from "@/lib/home-content";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"] as const;

function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

function StartCard({ s }: { s: SeriesSummary }) {
  return (
    <Link href={s.href} className="ed-path">
      <span className="ed-path-meta">
        {s.postCount} parts · updated {formatPostDateShort(s.latest.date)}
      </span>
      <h3>{s.name}</h3>
      <span className="ed-path-latest">{s.latest.title}</span>
      <span className="ed-path-cta">
        Start the series <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

/** Reading paths shown above the archive when no category filter is active. */
export function StartHere({ series }: { series: SeriesSummary[] }) {
  if (series.length === 0) return null;
  const noun = series.length === 1 ? "path" : "paths";

  return (
    <section aria-labelledby="start-here-label" className="ed-start-here">
      <div id="start-here-label" className="ed-overline">
        Start here
      </div>
      <p className="ed-start-here-lede">
        {countWord(series.length)} reading {noun} through the archive, newest first.
      </p>
      <div className="ed-paths">
        {series.map((s) => (
          <StartCard key={s.name} s={s} />
        ))}
      </div>
    </section>
  );
}
