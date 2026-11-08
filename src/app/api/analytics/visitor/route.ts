/**
 * GET /api/analytics/visitor?ip=1.2.3.4
 * Visitor dossier from first-party tables. Cookie/header auth required.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { verifyApiAuth } from "@/lib/analytics-auth";
import { loadVisitorDossier } from "@/lib/analytics-queries/visitor";

export const dynamic = "force-dynamic";

function isValidIp(ip: string): boolean {
  const ipv4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^([0-9a-fA-F]{1,4}:)*:[0-9a-fA-F:]*$/;
  return ipv4.test(ip) || ipv6.test(ip);
}

function isPrivateIp(ip: string): boolean {
  const n = /^::ffff:/i.test(ip) ? ip.replace(/^::ffff:/i, "") : ip;
  if (/^127\./.test(n)) return true;
  if (/^10\./.test(n)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(n)) return true;
  if (/^192\.168\./.test(n)) return true;
  if (/^0\./.test(n)) return true;
  if (/^169\.254\./.test(n)) return true;
  if (n === "::1" || n === "0:0:0:0:0:0:0:1") return true;
  if (/^fe80:/i.test(n)) return true;
  if (/^f[cd]/i.test(n)) return true;
  return false;
}

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
