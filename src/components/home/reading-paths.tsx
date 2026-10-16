import Link from "next/link";
import { formatPostDateShort } from "@/lib/post-date";
import type { SeriesSummary } from "@/lib/home-content";
import { SectionLabel } from "./section-label";

type Props = {
  index: number;
  series: SeriesSummary[];
};

function PathCard({ s }: { s: SeriesSummary }) {
  return (
    <Link href={s.href} className="ed-path reveal">
      <span className="ed-path-meta">
        {s.postCount} parts · Updated {formatPostDateShort(s.latest.date)}
      </span>
      <h3>{s.name}</h3>
      <span className="ed-path-latest">Latest: {s.latest.title}</span>
      <span className="ed-path-cta">
        Read the series <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export function ReadingPaths({ index, series }: Props) {
  if (series.length === 0) return null;

  return (
    <section id="series" className="ed-section reveal">
      <SectionLabel index={index} name="Reading Paths" />
      <div className="ed-wrap">
        <div className="ed-section-head reveal">
          <div className="ed-overline">Series</div>
          <h2>Pick a thread.</h2>
          <p className="lede">
            Most posts belong to a running series. Pick one and read it in
            order, from part one.
          </p>
        </div>

        <div className="ed-paths">
          {series.map((s) => (
            <PathCard key={s.name} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
