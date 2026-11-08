import { loadAudience } from "@/lib/analytics-queries/audience";
import { VisitorMapDynamic } from "../_components/visitor-map-dynamic";
import { AxPanel } from "../_components/ax-panel";
import { AxRankedList } from "../_components/ax-ranked-list";
import { NewVsReturningChart } from "./lazy-charts";

export async function AudienceSection({ days }: { days: number }) {
  const {
    mapLocations: typedMapLocations,
    topCountries: typedCountries,
    newVsReturning: typedNewVsReturning,
  } = await loadAudience(days);

  const countryItems = typedCountries.slice(0, 10).map((c) => ({
    label: c.country || "Unknown",
    value: c.views,
    sublabel: `${c.unique_visitors.toLocaleString()} visitors`,
  }));

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">02 · Audience</div>
      <div className="ax-section-head">
        <h2>
          Who&apos;s <em>coming through.</em>
        </h2>
        <p className="lede">
          Geographic distribution, new vs returning, and the long tail of
          where visitors originate.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <AxPanel title="Visitor map" kicker={`${typedMapLocations.length} CITIES`}>
          <VisitorMapDynamic data={typedMapLocations} />
        </AxPanel>
      </div>

      <div className="ax-grid-12" style={{ marginBottom: 20 }}>
        <AxPanel title="Top countries" kicker={`TOP ${countryItems.length}`}>
          <AxRankedList items={countryItems} />
        </AxPanel>
        <AxPanel title="New vs returning" kicker="DAILY">
          <NewVsReturningChart data={typedNewVsReturning} />
        </AxPanel>
      </div>
    </div>
  );
}
