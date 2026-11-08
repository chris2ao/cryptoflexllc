import type { ReferrerClass } from "@/lib/traffic/referrer";
import type {
  ReferrerClassRow,
  ReferrerHostRow,
} from "@/lib/analytics-queries/content";
import { AxRankedList } from "./ax-ranked-list";

const CLASS_ORDER: readonly ReferrerClass[] = [
  "search",
  "ai",
  "social",
  "newsletter",
  "direct",
  "other",
  "internal",
  "forged",
];

const CLASS_LABELS: Record<ReferrerClass, string> = {
  search: "Search",
  ai: "AI",
  social: "Social",
  newsletter: "Newsletter",
  direct: "Direct",
  other: "Other",
  internal: "Internal",
  forged: "Forged",
};

const CLASS_NOTES: Partial<Record<ReferrerClass, string>> = {
  internal: "our own pages and previews",
  forged: "crawlers sending a false referrer",
};

type Props = {
  classes: ReferrerClassRow[];
  hosts: ReferrerHostRow[];
};

export function ReferrerClasses({ classes, hosts }: Props) {
  const viewsByClass = new Map(classes.map((c) => [c.cls, c.views]));

  const hostItems = hosts.map((h) => ({
    label: h.host,
    sublabel: h.cls,
    value: h.views,
  }));

  return (
    <div>
      <div className="ax-class-chips">
        {CLASS_ORDER.map((cls) => {
          const views = viewsByClass.get(cls) ?? 0;
          const note = CLASS_NOTES[cls];
          return (
            <div
              key={cls}
              data-class={cls}
              className={`ax-class-chip${views === 0 ? " dim" : ""}`}
            >
              <span className="lbl">{CLASS_LABELS[cls]}</span>
              <span className="cnt">{views.toLocaleString()}</span>
              {note && <span className="note">{note}</span>}
            </div>
          );
        })}
      </div>
      <AxRankedList items={hostItems} emptyText="No referrers in range" />
    </div>
  );
}
