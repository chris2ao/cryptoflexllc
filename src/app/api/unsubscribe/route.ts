/**
 * GET /api/unsubscribe?email=...&token=...
 * -----------------------------------------------
 * Deactivates a subscriber. The token is an HMAC of the email
 * so only someone who received the newsletter can unsubscribe
 * (prevents malicious unsubscriptions).
 *
 * Returns a simple HTML page confirming the action.
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/analytics";
import { makeUnsubscribeToken } from "@/lib/subscribers";
import crypto from "crypto";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").toLowerCase().trim();
  const token = searchParams.get("token") ?? "";

  if (!email || !token) {
    return new NextResponse(htmlPage("Invalid link", "The unsubscribe link is invalid or expired."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Reject tokens that aren't valid hex before attempting buffer comparison,
  // otherwise Buffer.from(token, "hex") silently truncates and timingSafeEqual
  // throws a RangeError on mismatched buffer lengths (returns 500 instead of 403).
  if (!/^[0-9a-f]+$/i.test(token)) {
    return new NextResponse(htmlPage("Invalid link", "The unsubscribe link is invalid or expired."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Verify HMAC token (timing-safe comparison)
  const expected = makeUnsubscribeToken(email);
  const valid = crypto.timingSafeEqual(
    Buffer.from(token, "hex"),
    Buffer.from(expected, "hex")
  );

  if (!valid) {
    return new NextResponse(htmlPage("Invalid link", "The unsubscribe link is invalid or expired."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const sql = getDb();
    await sql`
      UPDATE subscribers SET active = FALSE WHERE email = ${email}
    `;

    return new NextResponse(
      htmlPage(
        "Unsubscribed",
        "You have been unsubscribed from the CryptoFlex weekly digest. Sorry to see you go!"
      ),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return new NextResponse(
      htmlPage("Error", "Something went wrong. Please try again later."),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — CryptoFlex LLC</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0e0e12; color: #f0f0f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { text-align: center; max-width: 420px; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #a0a0a0; line-height: 1.6; }
    a { color: #4dd0e1; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <img src="${BASE_URL}/CFLogo.png" alt="CryptoFlex LLC" width="180" style="margin-bottom:1.5rem" />
    <h1>${title}</h1>
    <p>${message}</p>
    <p style="margin-top:1.5rem"><a href="${BASE_URL}/blog">Back to the blog</a></p>
  </div>
</body>
</html>`;
}
