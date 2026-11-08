import { loadActivity } from "@/lib/analytics-queries/activity";
import { DataTable } from "../_components/data-table";
import { RecentVisitsTable } from "../_components/recent-visits-table";
import { AxPanel } from "../_components/ax-panel";

export async function ActivitySection({ days }: { days: number }) {
  const {
    recent: typedRecent,
    topPages,
    topCountries,
    browsers,
    devices,
    osStats,
    referrers,
  } = await loadActivity(days);

  return (
    <div className="ax-wrap ax-section">
      <div className="ax-section-label">08 · Activity</div>
      <div className="ax-section-head">
        <h2>
          Recent <em>visits.</em>
        </h2>
        <p className="lede">
          Live visit log with filter chips, plus top pages / countries /
          browsers / devices / OS / referrers.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <RecentVisitsTable data={typedRecent} />
      </div>

      <div className="ax-grid-2">
        <AxPanel title="Top pages" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Page", "Views", "Unique"]}
            rows={topPages.map((r: Record<string, unknown>) => [
              String(r.page_path),
              String(r.views),
              String(r.unique_views),
            ])}
          />
        </AxPanel>
        <AxPanel title="Countries" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Country", "Views", "Unique"]}
            rows={topCountries.map((r: Record<string, unknown>) => [
              String(r.country),
              String(r.views),
              String(r.unique_visitors),
            ])}
          />
        </AxPanel>
        <AxPanel title="Browsers" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["Browser", "Count"]}
            rows={browsers.map((r: Record<string, unknown>) => [
              String(r.browser),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Devices" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["Device Type", "Count"]}
            rows={devices.map((r: Record<string, unknown>) => [
              String(r.device_type),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Operating systems" kicker="BY COUNT">
          <DataTable
            title=""
            headers={["OS", "Count"]}
            rows={osStats.map((r: Record<string, unknown>) => [
              String(r.os),
              String(r.count),
            ])}
          />
        </AxPanel>
        <AxPanel title="Referrers" kicker="BY VIEWS">
          <DataTable
            title=""
            headers={["Domain", "Views", "Unique"]}
            rows={referrers.map((r: Record<string, unknown>) => [
              String(r.referrer_domain),
              String(r.views),
              String(r.unique_visitors),
            ])}
          />
        </AxPanel>
      </div>
    </div>
  );
}
