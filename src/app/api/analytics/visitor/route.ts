/**
 * GET /api/analytics/visitor?ip=1.2.3.4
 * Visitor dossier from first-party tables. Cookie/header auth required.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { isPrivateIp, isValidIp } from "@/lib/ip-enrichment/ip-validate";
import { loadVisitorDossier } from "@/lib/analytics-queries/visitor";

export const dynamic = "force-dynamic";



export async function GET(request: NextRequest) {
  if (!verifyApiAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.nextUrl.searchParams.get("ip");
  if (!ip || !isValidIp(ip)) {
    return NextResponse.json({ error: "Invalid IP address" }, { status: 400 });
  }
  if (isPrivateIp(ip)) {
    return NextResponse.json(
      { error: "Private IP addresses are not supported" },
      { status: 400 },
    );
  }

  try {
    const dossier = await loadVisitorDossier(getDb(), ip);
    return NextResponse.json({ dossier });
  } catch (error) {
    console.error("Visitor dossier error:", error);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
