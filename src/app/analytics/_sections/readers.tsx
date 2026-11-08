import type { TrafficScope } from "@/lib/analytics-queries/shared";
import { loadReaders } from "@/lib/analytics-queries/readers";
import { VisitorMapDynamic } from "../_components/visitor-map-dynamic";
import { AxPanel } from "../_components/ax-panel";
import { AxRankedList } from "../_components/ax-ranked-list";
import { AxDonut } from "../_components/ax-donut";
import { NewVsReturningChart } from "./lazy-charts";

export async function ReadersSection({ days, scope = "humans" }: { days: number; scope?: TrafficScope }) {
  const {
    mapLocations: typedMapLocations,
    topCountries: typedCountries,
    newVsReturning: typedNewVsReturning,
    browsers: typedBrowsers,
    devices: typedDevices,
    osStats: typedOs,
  } = await loadReaders(days, scope);

  const countryItems = typedCountries.slice(0, 10).map((c) => ({
    label: c.country || "Unknown",
    value: c.views,
    sublabel: `${c.unique_visitors.toLocaleString()} visitors`,
  }));

  const browserItems = typedBrowsers.slice(0, 6).map((b) => ({
    label: b.browser || "Unknown",
    value: b.count,
  }));
  const deviceItems = typedDevices.map((d) => ({
    label: d.device_type || "Unknown",
    value: d.count,
  }));
  const osItems = typedOs.slice(0, 6).map((o) => ({
    label: o.os || "Unknown",
    value: o.count,
  }));

  const totalBrowsers = browserItems.reduce((s, i) => s + i.value, 0);
  const totalDevices = deviceItems.reduce((s, i) => s + i.value, 0);
  const totalOs = osItems.reduce((s, i) => s + i.value, 0);

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">02 · Readers</div>
      <div className="ax-section-head">
        <h2>
          Who&apos;s <em>reading.</em>
        </h2>
        <p className="lede">
          Where readers come from, how often they return, and what they use to
          get here.
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

      <div className="ax-grid-3">
        <AxPanel title="Browsers" kicker={`${totalBrowsers.toLocaleString()} HITS`}>
          <AxDonut
            items={browserItems}
            centerLabel={String(browserItems.length)}
            centerCaption="Browsers"
            ariaLabel="Browser breakdown"
          />
        </AxPanel>
        <AxPanel title="Devices" kicker={`${totalDevices.toLocaleString()} HITS`}>
          <AxDonut
            items={deviceItems}
            centerLabel={String(deviceItems.length)}
            centerCaption="Devices"
            ariaLabel="Device type breakdown"
          />
        </AxPanel>
        <AxPanel title="Operating systems" kicker={`${totalOs.toLocaleString()} HITS`}>
          <AxDonut
            items={osItems}
            centerLabel={String(osItems.length)}
            centerCaption="OS"
            ariaLabel="Operating system breakdown"
          />
        </AxPanel>
      </div>
    </div>
  );
}
