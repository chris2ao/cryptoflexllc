import type { MapLocation } from "@/lib/analytics-types";
import { VisitorMapSvg } from "./visitor-map-svg";

/**
 * Visitor map wrapper. Previously mounted a Leaflet map via `next/dynamic` with
 * ssr:false; the editorial redesign replaces that with a lightweight SVG
 * equirectangular projection that renders server-side too.
 */
export function VisitorMapDynamic({ data }: { data: MapLocation[] }) {
  return <VisitorMapSvg data={data} />;
}
