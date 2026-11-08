import { loadTechnology } from "@/lib/analytics-queries/technology";
import { AxPanel } from "../_components/ax-panel";
import { AxDonut } from "../_components/ax-donut";

export async function TechnologySection({ days }: { days: number }) {
  const {
    browsers: typedBrowsers,
    devices: typedDevices,
    osStats: typedOs,
  } = await loadTechnology(days);

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
      <div className="ax-section-label">04 · Technology</div>
      <div className="ax-section-head">
        <h2>
          How they <em>connect.</em>
        </h2>
        <p className="lede">
          Browser, device, and OS breakdown of visitors.
        </p>
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
