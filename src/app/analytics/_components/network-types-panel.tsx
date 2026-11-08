import { AxRankedList, type RankedItem } from "./ax-ranked-list";
import type { NetworkTypeRow } from "@/lib/analytics-queries/security-intel";

const LABELS: Record<NetworkTypeRow["type"], string> = {
  residential: "Residential",
  datacenter: "Datacenter",
  proxy: "Proxy or VPN",
  tor: "Tor",
  unknown: "Unknown",
};

const ORDER: NetworkTypeRow["type"][] = [
  "residential",
  "datacenter",
  "proxy",
  "tor",
  "unknown",
];

export function NetworkTypesPanel({ data }: { data: NetworkTypeRow[] }) {
  const items: RankedItem[] = [...data]
    .sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type))
    .map((r) => ({
      label: LABELS[r.type],
      value: r.visitors,
      sublabel: `${r.views.toLocaleString()} views`,
    }));
  return <AxRankedList items={items} emptyText="No network data in range" />;
}
