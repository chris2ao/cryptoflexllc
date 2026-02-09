"use client";

import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { IpIntelData } from "@/lib/analytics-types";

// Best-effort county property appraiser links by state
const STATE_PA_LINKS: Record<string, string> = {
  "Florida": "https://www.myfloridalegal.com/pages/property-appraisers",
  "California": "https://www.boe.ca.gov/proptaxes/countycontacts.htm",
  "Texas": "https://comptroller.texas.gov/taxes/property-tax/county-directory/",
  "New York": "https://www.tax.ny.gov/research/property/assess/enhanced/enhancedsearch.htm",
  "Illinois": "https://www.illinoisassessors.com/",
  "Pennsylvania": "https://munstatspa.dced.state.pa.us/FindYourMunicipality.aspx",
  "Ohio": "https://www.tax.ohio.gov/real-property/county-auditor-and-treasurer-information",
  "Georgia": "https://www.qpublic.net/ga/",
  "North Carolina": "https://www.ncdor.gov/taxes-forms/property-tax/county-assessor-contact-list",
  "Michigan": "https://www.michigan.gov/taxes/property/resources/county-equalization-directors",
};

const FALLBACK_PROPERTY_SEARCH = "https://www.realtor.com/realestateandhomes-search/";

interface IpOsintPanelProps {
  secret: string;
}

export function useIpOsintPanel() {
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState("");
  const [data, setData] = useState<IpIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = useCallback(async (ipAddress: string, secret: string) => {
    setIp(ipAddress);
    setOpen(true);
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(
        `/api/analytics/ip-intel?secret=${encodeURIComponent(secret)}&ip=${encodeURIComponent(ipAddress)}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Lookup failed" }));
        setError(err.error || "Lookup failed");
        return;
      }
      const result: IpIntelData = await res.json();
      setData(result);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  return { open, setOpen, ip, data, loading, error, lookup };
}

export function IpOsintPanel({
  secret,
  open,
  onOpenChange,
  ip,
  data,
  loading,
  error,
}: IpOsintPanelProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ip: string;
  data: IpIntelData | null;
  loading: boolean;
  error: string;
}) {
  const propertyLink = data
    ? getPropertyAppraisalLink(data.reverse_state || data.region, data.reverse_county)
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>IP Intelligence</SheetTitle>
          <SheetDescription className="font-mono">{ip}</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground text-sm">
                Looking up {ip}...
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {data && !loading && (
            <>
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {data.is_proxy && (
                  <Badge variant="destructive">VPN/Proxy</Badge>
                )}
                {data.is_hosting && (
                  <Badge variant="secondary">Hosting/DC</Badge>
                )}
                {data.is_mobile && (
                  <Badge variant="outline">Mobile</Badge>
                )}
                {!data.is_proxy && !data.is_hosting && !data.is_mobile && (
                  <Badge variant="outline">Residential</Badge>
                )}
              </div>

              {/* Network section */}
              <Section title="Network">
                <InfoRow label="ISP" value={data.isp} />
                <InfoRow label="Organization" value={data.org} />
                <InfoRow label="AS Number" value={data.as_number} />
                <InfoRow label="AS Name" value={data.as_name} />
              </Section>

              {/* WHOIS section */}
              <Section title="WHOIS Registration">
                <InfoRow label="Registered Org" value={data.whois_org || "Not available"} />
                <InfoRow label="Address" value={data.whois_address || "Not available"} />
              </Section>

              {/* Location section */}
              <Section title="Approximate Location">
                <InfoRow
                  label="Address"
                  value={data.reverse_address ? `~${data.reverse_address}` : "Not available"}
                />
                <InfoRow
                  label="City/Region"
                  value={[data.city, data.region, data.country].filter(Boolean).join(", ") || "Unknown"}
                />
                <InfoRow
                  label="Coordinates"
                  value={
                    data.latitude && data.longitude
                      ? `${data.latitude}, ${data.longitude}`
                      : "Not available"
                  }
                />
              </Section>

              {/* Property lookup */}
              {propertyLink && (
                <Section title="Property Lookup">
                  <a
                    href={propertyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    Search County Appraiser
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </Section>
              )}

              {/* Cache timestamp */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Cached: {new Date(data.cached_at).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border pb-1">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right break-all">{value || "—"}</span>
    </div>
  );
}

function getPropertyAppraisalLink(state: string, county: string): string | null {
  if (!state) return null;

  // Check if we have a direct state link
  const stateLink = STATE_PA_LINKS[state];
  if (stateLink) return stateLink;

  // Fallback to Realtor.com search with location
  const location = [county, state].filter(Boolean).join("-").replace(/\s+/g, "-");
  return location ? `${FALLBACK_PROPERTY_SEARCH}${encodeURIComponent(location)}` : null;
}
