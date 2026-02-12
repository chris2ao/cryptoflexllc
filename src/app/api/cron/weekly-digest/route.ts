/**
 * GET /api/cron/weekly-digest
 * -----------------------------------------------
 * Triggered by Vercel Cron every Monday at 9 AM ET.
 * Fetches blog posts published in the last 7 days, builds a
 * branded HTML email, and sends it to all active subscribers
 * via Gmail SMTP (Google Workspace).
 *
 * Required env vars:
 *   CRON_SECRET       – Vercel cron secret for auth
 *   GMAIL_USER        – e.g. Chris.Johnson@cryptoflexllc.com
 *   GMAIL_APP_PASSWORD – Google Workspace App Password
 *   SUBSCRIBER_SECRET  – HMAC secret for unsubscribe tokens
 *   DATABASE_URL       – Neon Postgres connection string
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDb } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import { unsubscribeUrl } from "@/lib/subscribers";

const BASE_URL = "https://cryptoflexllc.com";

export async function GET(request: NextRequest) {
  // ---- Auth: Vercel Cron sends this header automatically ----
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ---- 1. Get posts from the last 7 days ----
    const allPosts = getAllPosts();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentPosts = allPosts.filter(
      (p) => new Date(p.date) >= oneWeekAgo
    );

    // If no new posts this week, still send a short "catch you next week" note
    const hasNewPosts = recentPosts.length > 0;

    // ---- 2. Fetch active subscribers ----
    const sql = getDb();
    const rows = await sql`
      SELECT email FROM subscribers WHERE active = TRUE
    `;

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, reason: "no subscribers" });
    }

    // ---- 3. Configure Gmail SMTP transport ----
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ---- 4. Send to each subscriber ----
    let sent = 0;
    for (const row of rows) {
      const email = row.email as string;
      const html = buildEmailHtml(recentPosts, hasNewPosts, email);

      await transporter.sendMail({
        from: `"CryptoFlex LLC" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: hasNewPosts
          ? `This Week at CryptoFlex — ${recentPosts.length} New Post${recentPosts.length > 1 ? "s" : ""}!`
          : "This Week at CryptoFlex — Quick Update",
        html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      sent++;
    }

    return NextResponse.json({ ok: true, sent, posts: recentPosts.length });
  } catch (error) {
    console.error("Weekly digest error:", error);
    return NextResponse.json(
      { error: "Failed to send weekly digest" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------
// Email template builder
// ---------------------------------------------------------------

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
}

function buildEmailHtml(
  posts: PostSummary[],
  hasNewPosts: boolean,
  recipientEmail: string
): string {
  const unsubLink = unsubscribeUrl(recipientEmail);

  const postRows = posts
    .map(
      (p) => `
      <tr>
        <td style="padding:0 0 24px 0">
          <a href="${BASE_URL}/blog/${p.slug}" style="color:#4dd0e1;font-size:18px;font-weight:600;text-decoration:none">${escapeHtml(p.title)}</a>
          <p style="margin:6px 0 4px;color:#b0b0b0;font-size:13px">${formatDate(p.date)}${p.readingTime ? ` · ${escapeHtml(p.readingTime)}` : ""}</p>
          <p style="margin:0;color:#d4d4d4;font-size:15px;line-height:1.5">${escapeHtml(p.description)}</p>
          ${
            p.tags.length > 0
              ? `<p style="margin:8px 0 0;font-size:12px">${p.tags
                  .map(
                    (t) =>
                      `<span style="display:inline-block;background:#1e293b;color:#94a3b8;padding:2px 8px;border-radius:4px;margin-right:4px">${escapeHtml(t)}</span>`
                  )
                  .join("")}</p>`
              : ""
          }
        </td>
      </tr>`
    )
    .join("");

  const contentSection = hasNewPosts
    ? `
      <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 8px">
        Here&rsquo;s what I learned and wrote about this week:
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px">
        ${postRows}
      </table>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding:8px 0 0">
            <a href="${BASE_URL}/blog" style="display:inline-block;background:#4dd0e1;color:#0e0e12;padding:12px 28px;border-radius:6px;font-weight:600;text-decoration:none;font-size:15px">Read the Blog</a>
          </td>
        </tr>
      </table>`
    : `
      <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0">
        No new posts this week &mdash; but I&rsquo;m working on some great content behind the scenes. Stay tuned for next week!
      </p>
      <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:16px 0 0">
        In the meantime, check out the latest posts on the blog:
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px">
        <tr>
          <td align="center">
            <a href="${BASE_URL}/blog" style="display:inline-block;background:#4dd0e1;color:#0e0e12;padding:12px 28px;border-radius:6px;font-weight:600;text-decoration:none;font-size:15px">Visit the Blog</a>
          </td>
        </tr>
      </table>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CryptoFlex Weekly Digest</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#0a0a0f">
    <tr>
      <td align="center" style="padding:32px 16px">
        <!-- Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#141419;border-radius:12px;border:1px solid #23232d">

          <!-- Header with logo -->
          <tr>
            <td align="center" style="padding:32px 32px 20px;border-bottom:1px solid #23232d">
              <img src="${BASE_URL}/CFLogo.png" alt="CryptoFlex LLC" width="200" style="display:block;max-width:200px;height:auto" />
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:28px 32px 0">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#f0f0f0">
                ${hasNewPosts ? "This Week at CryptoFlex" : "Hey from CryptoFlex!"}
              </h1>
              <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 20px">
                Thanks for being a subscriber &mdash; it means a lot! Every week I share what I&rsquo;ve been learning about cybersecurity, infrastructure, AI-assisted development, and the projects I&rsquo;m building.
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:0 32px 28px">
              ${contentSection}
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
