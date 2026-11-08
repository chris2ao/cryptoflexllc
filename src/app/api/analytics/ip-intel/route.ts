/**
 * GET /api/analytics/ip-intel?ip=1.2.3.4
 * -----------------------------------------------
 * On-demand IP intelligence lookup. Protected by cookie/header auth.
 * Delegates to the enrichment pipeline (7-day cache, then ipapi.is, RDAP,
 * Tor exit list and Spamhaus DROP). Returns { enrichment, cached }.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { enrichIp } from "@/lib/ip-enrichment/enrich";
import { isPrivateIp, isValidIp } from "@/lib/ip-enrichment/ip-validate";

export async function GET(request: NextRequest) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.nextUrl.searchParams.get("ip");
  if (!ip || !isValidIp(ip)) {
    return NextResponse.json({ error: "Invalid IP address" }, { status: 400 });
  }

  // Block private/loopback IPs to prevent SSRF
  if (isPrivateIp(ip)) {
    return NextResponse.json({ error: "Private IP addresses are not supported" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const { enrichment, cached } = await enrichIp(sql, ip);
    return NextResponse.json({ enrichment, cached });
  } catch (error) {
    console.error("IP intel lookup error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
