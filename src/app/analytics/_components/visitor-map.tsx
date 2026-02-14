"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapLocation } from "@/lib/analytics-types";
import { PanelWrapper } from "./panel-wrapper";

function getRadius(views: number, maxViews: number): number {
  const min = 4;
  const max = 18;
  if (maxViews <= 1) return min;
  return min + ((views / maxViews) * (max - min));
}

export function VisitorMap({ data }: { data: MapLocation[] }) {
  const valid = data.filter(
    (d) => d.latitude && d.longitude && d.latitude !== "0" && d.longitude !== "0"
  );

  if (valid.length === 0) {
    return (
      <PanelWrapper
        title="Visitor Map"
        tooltip="Geographic distribution of visitors based on IP geolocation"
      >
        <p className="text-muted-foreground text-sm text-center py-8">
          No location data yet
        </p>
      </PanelWrapper>
    );
  }

  const maxViews = Math.max(...valid.map((d) => d.views));

  return (
    <PanelWrapper
      title="Visitor Map"
      tooltip="Geographic distribution of visitors based on IP geolocation"
    >
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", background: "#1a1a2e" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />
          {valid.map((loc, i) => (
            <CircleMarker
              key={`${loc.latitude}-${loc.longitude}-${i}`}
              center={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
              radius={getRadius(loc.views, maxViews)}
              pathOptions={{
                color: "var(--chart-1)",
                fillColor: "oklch(0.75 0.15 195)",
                fillOpacity: 0.6,
                weight: 1,
              }}
            >
              <Tooltip>
                <div className="text-xs">
                  <strong>{loc.city || "Unknown"}, {loc.country || "Unknown"}</strong>
                  <br />
                  {loc.views} view{loc.views !== 1 ? "s" : ""}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </PanelWrapper>
  );
}
