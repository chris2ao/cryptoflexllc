"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "@/lib/analytics-types";

// Leaflet requires the browser's window object, so we must disable SSR
const VisitorMapInner = dynamic(
  () => import("./visitor-map").then((mod) => mod.VisitorMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Visitor Map</h2>
        <div className="h-[400px] rounded-lg bg-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function VisitorMapDynamic({ data }: { data: MapLocation[] }) {
  return <VisitorMapInner data={data} />;
}
