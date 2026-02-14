/**
 * POST /api/subscribe
 * -----------------------------------------------
 * Adds an email address to the subscribers table.
 * Validates format and handles duplicates gracefully.
 * Captures IP address and Vercel geolocation headers.
 * Sends a confirmation email with the latest 5 blog posts.
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { getDb } from "@/lib/analytics";
import { unsubscribeUrl } from "@/lib/subscribers";
import { getAllPosts } from "@/lib/blog";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { withRetry } from "@/lib/email-retry";

const BASE_URL = "https://cryptoflexllc.com";

// Allow up to 30 seconds for DB insert + SMTP send
export const maxDuration = 30;

/**
 * Mask email address for logging to prevent PII exposure.
 * Example: user@domain.com -> u***@domain.com
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local[0]}***@${domain}`;
}

// Rate limiter: 5 requests per IP per hour
const subscribeRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
});

// Zod schema for input validation
const subscribeSchema = z.object({
  email: z.string().email().max(320).trim().toLowerCase(),
});

export async function POST(request: NextRequest) {
  try {
    // Content-Type validation
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // Extract IP address first for rate limiting
    const ipAddress = getClientIp(request);

    // Check rate limit
    const rateLimit = await subscribeRateLimiter.checkRateLimit(ipAddress);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many subscription requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 3600),
          },
        }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Extract Vercel geolocation headers
    const country = decodeURIComponent(
      request.headers.get("x-vercel-ip-country") || "Unknown"
    );
    const city = decodeURIComponent(
      request.headers.get("x-vercel-ip-city") || "Unknown"
    );
    const region = decodeURIComponent(
      request.headers.get("x-vercel-ip-country-region") || "Unknown"
    );

    const sql = getDb();

    // Upsert: if they previously unsubscribed, reactivate.
    // Always update geo data so we have the latest info.
    await sql`
      INSERT INTO subscribers (email, active, ip_address, country, city, region)
      VALUES (${email}, TRUE, ${ipAddress}, ${country}, ${city}, ${region})
      ON CONFLICT (email)
      DO UPDATE SET active = TRUE, subscribed_at = NOW(),
        ip_address = ${ipAddress}, country = ${country},
        city = ${city}, region = ${region}
    `;

    // Send confirmation email before responding (must await on serverless)
    try {
      console.log(`[subscribe] Sending welcome email to ${maskEmail(email)}...`);
      const emailStart = Date.now();
      await sendConfirmationEmail(email);
      console.log(`[subscribe] Welcome email sent in ${Date.now() - emailStart}ms`);
    } catch (err) {
      console.error("[subscribe] Welcome email FAILED:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------
// Confirmation email
// ---------------------------------------------------------------

async function sendConfirmationEmail(recipientEmail: string): Promise<void> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Skip if email credentials aren't configured
  if (!gmailUser || !gmailPass) {
    console.warn(
      `[welcome-email] SKIPPED: GMAIL_USER=${!!gmailUser}, GMAIL_APP_PASSWORD=${!!gmailPass}`
    );
    return;
  }

  console.log(`[welcome-email] Credentials present, creating SMTP transport...`);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPass },
  });

  console.log(`[welcome-email] Loading blog posts...`);
  const latestPosts = getAllPosts().slice(0, 5);
  console.log(`[welcome-email] Found ${latestPosts.length} posts, generating unsubscribe URL...`);
  const unsubLink = unsubscribeUrl(recipientEmail);
  console.log(`[welcome-email] Building HTML and sending to ${maskEmail(recipientEmail)}...`);

  const postRows = latestPosts
    .map(
      (p) => `
      <tr>
        <td style="padding:0 0 20px 0">
          <a href="${BASE_URL}/blog/${p.slug}" style="color:#4dd0e1;font-size:16px;font-weight:600;text-decoration:none">${escapeHtml(p.title)}</a>
          <p style="margin:4px 0 0;color:#b0b0b0;font-size:13px">${formatDate(p.date)}${p.readingTime ? ` &middot; ${escapeHtml(p.readingTime)}` : ""}</p>
          <p style="margin:4px 0 0;color:#d4d4d4;font-size:14px;line-height:1.4">${escapeHtml(p.description)}</p>
        </td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CryptoFlex!</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0a0a0f">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#141419;border-radius:12px;border:1px solid #23232d">

          <!-- Header with logo -->
          <tr>
            <td align="center" style="padding:32px 32px 20px;border-bottom:1px solid #23232d">
              <img src="${BASE_URL}/CFLogo.png" alt="CryptoFlex LLC" width="200" style="display:block;max-width:200px;height:auto" />
            </td>
          </tr>

          <!-- Welcome message -->
          <tr>
            <td style="padding:28px 32px 0">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#f0f0f0">
                Welcome to CryptoFlex!
              </h1>
              <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0 0 16px">
                Thank you so much for subscribing &mdash; I&rsquo;m really excited to have you here! I&rsquo;m Chris, and I started CryptoFlex to share everything I&rsquo;m learning about cybersecurity, infrastructure, AI-assisted development, and the projects I&rsquo;m building along the way.
              </p>
              <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0 0 16px">
                I look forward to sharing what I learn with you, and I&rsquo;m always open to feedback, ideas, or just saying hello. You can reach me anytime at <a href="mailto:Chris.Johnson@cryptoflexllc.com" style="color:#4dd0e1;text-decoration:none">Chris.Johnson@cryptoflexllc.com</a>.
              </p>
            </td>
          </tr>

          <!-- Newsletter schedule -->
          <tr>
            <td style="padding:0 32px 20px">
              <div style="background:#1a1a22;border:1px solid #23232d;border-radius:8px;padding:16px 20px;margin:8px 0">
                <p style="margin:0;font-size:15px;color:#d4d4d4;line-height:1.6">
                  <strong style="color:#f0f0f0">Your weekly newsletter</strong> arrives every <strong style="color:#4dd0e1">Monday at 9:00 AM Eastern</strong> with summaries of new posts, what I&rsquo;ve been learning, and direct links to everything new.
                </p>
              </div>
            </td>
          </tr>

          <!-- Latest posts -->
          <tr>
            <td style="padding:0 32px 8px">
              <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#f0f0f0">
                Here are the latest posts to get you started:
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${postRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 32px 28px">
              <a href="${BASE_URL}/blog" style="display:inline-block;background:#4dd0e1;color:#0e0e12;padding:12px 28px;border-radius:6px;font-weight:600;text-decoration:none;font-size:15px">Explore the Blog</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #23232d">
              <p style="margin:0;font-size:13px;color:#6b6b78;line-height:1.5;text-align:center">
                You&rsquo;re receiving this because you subscribed to the CryptoFlex blog newsletter.<br />
                <a href="${unsubLink}" style="color:#6b6b78;text-decoration:underline">Unsubscribe</a>
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#44444d;text-align:center">
                &copy; ${new Date().getFullYear()} CryptoFlex LLC &mdash; cryptoflexllc.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await withRetry(() =>
    transporter.sendMail({
      from: `"CryptoFlex LLC" <${gmailUser}>`,
      to: recipientEmail,
      subject: "Welcome to CryptoFlex! Thanks for Subscribing",
      html,
      headers: {
        "List-Unsubscribe": `<${unsubLink}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    })
  );
  console.log(`[welcome-email] SUCCESS: messageId=${info.messageId}, response=${info.response}`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
