/**
 * GET /api/cron/catch-up-digest
 * -----------------------------------------------
 * One-time endpoint to resend the weekly digest to all active
 * subscribers with an apology for the delay. Sends to everyone
 * so nobody is missed.
 *
 * Required env vars: same as weekly-digest
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import nodemailer from "nodemailer";
import { getDb } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import { unsubscribeUrl } from "@/lib/subscribers";
import { withRetry } from "@/lib/email-retry";

export const maxDuration = 300;

const BASE_URL = "https://cryptoflexllc.com";

function utm(campaign: string, content?: string): string {
  const params = `utm_source=newsletter&utm_medium=email&utm_campaign=${campaign}`;
  return content ? `${params}&utm_content=${encodeURIComponent(content)}` : params;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  return `${local[0]}***@${domain}`;
}

export async function GET(request: NextRequest) {
  // ---- Auth ----
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") ?? "";
  const expectedHeader = `Bearer ${cronSecret}`;
  let cronAuthed = false;
  if (cronSecret && authHeader.length === expectedHeader.length) {
    try {
      cronAuthed = timingSafeEqual(
        Buffer.from(authHeader),
        Buffer.from(expectedHeader)
      );
    } catch {
      cronAuthed = false;
    }
  }
  if (!cronAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ---- 1. Get posts from the last 14 days (wider window for catch-up) ----
    const allPosts = getAllPosts();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const recentPosts = allPosts.filter(
      (p) => new Date(p.date) >= twoWeeksAgo
    );

    const MAX_DIGEST_POSTS = 10;
    const totalRecentPosts = recentPosts.length;
    const digestPosts = recentPosts.slice(0, MAX_DIGEST_POSTS);
    const hasNewPosts = digestPosts.length > 0;

    // ---- 2. Fetch all active subscribers ----
    const sql = getDb();
    const rows = await sql`
      SELECT email FROM subscribers WHERE active = TRUE
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        reason: "no active subscribers",
      });
    }

    const recipients = rows.map((r) => ({ email: r.email as string }));

    // ---- 3. Configure Gmail SMTP transport (pooled) ----
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 5,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ---- 4. Send to each missed subscriber concurrently ----
    const CONCURRENCY = 5;
    let sent = 0;

    const subject = hasNewPosts
      ? `This Week at CryptoFlex - ${digestPosts.length} New Post${digestPosts.length > 1 ? "s" : ""}! (Delayed)`
      : "This Week at CryptoFlex - Quick Update (Delayed)";

    for (let i = 0; i < recipients.length; i += CONCURRENCY) {
      const batch = recipients.slice(i, i + CONCURRENCY);

      const results = await Promise.allSettled(
        batch.map(async ({ email }) => {
          const html = buildCatchUpHtml(digestPosts, hasNewPosts, email, totalRecentPosts);
          await withRetry(() =>
            transporter.sendMail({
              from: `"CryptoFlex LLC" <${process.env.GMAIL_USER}>`,
              to: email,
              subject,
              html,
              headers: {
                "List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              },
            })
          );
        })
      );

      for (let j = 0; j < results.length; j++) {
        if (results[j].status === "fulfilled") {
          sent++;
        } else {
          console.error(
            `[catch-up-digest] Failed to send to ${maskEmail(batch[j].email)} after retries:`,
            (results[j] as PromiseRejectedResult).reason
          );
        }
      }
    }

    transporter.close();

    return NextResponse.json({
      ok: true,
      sent,
      total: recipients.length,
      posts: digestPosts.length,
      totalPosts: totalRecentPosts,
    });
  } catch (error) {
    console.error("Catch-up digest error:", error);
    return NextResponse.json(
      { error: "Failed to send catch-up digest" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------
// Catch-up email template (with apology intro)
// ---------------------------------------------------------------

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
}

function buildCatchUpHtml(
  posts: PostSummary[],
  hasNewPosts: boolean,
  recipientEmail: string,
  totalPosts: number
): string {
  const unsubLink = unsubscribeUrl(recipientEmail);

  const postRows = posts
    .map(
      (p) => `
      <tr>
        <td style="padding:0 0 24px 0">
          <a href="${BASE_URL}/blog/${p.slug}?${utm("catch-up-digest", p.slug)}" style="color:#4dd0e1;font-size:18px;font-weight:600;text-decoration:none">${escapeHtml(p.title)}</a>
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

  const extraPosts = totalPosts - posts.length;
  const overflowNote = extraPosts > 0
    ? `<p style="font-size:15px;line-height:1.6;color:#94a3b8;margin:16px 0 0;text-align:center;font-style:italic">
        Plus ${extraPosts} more post${extraPosts > 1 ? "s" : ""} on the blog this week!
      </p>`
    : "";

  const contentSection = hasNewPosts
    ? `
      <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 8px">
        Here&rsquo;s what I wrote about this week:
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px">
        ${postRows}
      </table>
      ${overflowNote}
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding:8px 0 0">
            <a href="${BASE_URL}/blog?${utm("catch-up-digest", "cta-read-blog")}" style="display:inline-block;background:#4dd0e1;color:#0e0e12;padding:12px 28px;border-radius:6px;font-weight:600;text-decoration:none;font-size:15px">Read the Blog</a>
          </td>
        </tr>
      </table>`
    : `
      <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0">
        No new posts this week, but I&rsquo;m working on some great content behind the scenes. Stay tuned for next week!
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CryptoFlex Weekly Digest</title>
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

          <!-- Greeting with apology -->
          <tr>
            <td style="padding:28px 32px 0">
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:#f0f0f0">
                This Week at CryptoFlex
              </h1>
              <p style="font-size:16px;line-height:1.6;color:#d4d4d4;margin:0 0 20px">
                Sorry this is a day late! I&rsquo;m still learning, and I ran into a technical issue with the newsletter delivery. I think I&rsquo;ve worked out the kinks now, so you should be good to go going forward. Thanks for your patience, and thanks for being a subscriber!
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
                &copy; ${new Date().getFullYear()} CryptoFlex LLC | cryptoflexllc.com
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
