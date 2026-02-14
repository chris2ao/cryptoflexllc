/**
 * POST /api/analytics/logout
 * -----------------------------------------------
 * Deletes the analytics session cookie to log out the user.
 */

import { NextResponse } from "next/server";
import { getAnalyticsCookieName } from "@/lib/analytics-auth";

export async function POST() {
  const cookieName = getAnalyticsCookieName();

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(cookieName);
  return response;
}
