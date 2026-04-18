import type { MapLocation } from "@/lib/analytics-types";
import { VisitorMapWorld } from "./visitor-map-world";

/**
 * Visitor map wrapper. Renders a real equirectangular world map with animated
 * arc traces from Tampa, FL to each visitor location.
 */
export function VisitorMapDynamic({ data }: { data: MapLocation[] }) {
  return <VisitorMapWorld data={data} />;
}
