/**
 * GET /api/send-welcome-blast
 * -----------------------------------------------
 * One-time endpoint to send a belated welcome email to all
 * existing active subscribers who missed the original welcome.
 * Protected by CRON_SECRET.
 *
 * Trigger with:
 *   curl https://cryptoflexllc.com/api/send-welcome-blast \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDb } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import { unsubscribeUrl } from "@/lib/subscribers";

const BASE_URL = "https://cryptoflexllc.com";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return NextResponse.json(
      { error: "Email credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT email FROM subscribers WHERE active = TRUE
    `;

    if (rows.length === 0) {
      return NextResponse.json({ ok: true, sent: 0, reason: "no subscribers" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass },
    });

    const latestPosts = getAllPosts().slice(0, 5);

    let sent = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const email = row.email as string;
      try {
        const unsubLink = unsubscribeUrl(email);
        const html = buildWelcomeBlastHtml(latestPosts, unsubLink);

        await transporter.sendMail({
          from: `"CryptoFlex LLC" <${gmailUser}>`,
          to: email,
          subject:
            "A Belated Welcome (and a Thank You) from CryptoFlex",
          html,
          headers: {
            "List-Unsubscribe": `<${unsubLink}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });
        sent++;
      } catch (err) {
        errors.push(`${email}: ${(err as Error).message}`);
      }
    }

    return NextResponse.json({ ok: true, sent, total: rows.length, errors });
  } catch (error) {
    console.error("Welcome blast error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome blast" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------
// Email template
// ---------------------------------------------------------------

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
}

function buildWelcomeBlastHtml(
  posts: PostSummary[],
  unsubLink: string
): string {
  const postRows = posts
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A Belated Welcome from CryptoFlex</title>
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
                A Belated Welcome &mdash; and a Thank You
              </h1>
              <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0 0 16px">
                Hey! I&rsquo;m Chris, and I owe you a proper welcome. When you first subscribed to CryptoFlex, you should have received a welcome email &mdash; but that didn&rsquo;t happen, and I&rsquo;m sorry about that.
              </p>
              <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0 0 16px">
                I&rsquo;m still learning and building this site as I go, and I heard the feedback. The welcome email is now set up properly for new subscribers, but I didn&rsquo;t want to leave you hanging without one. So here it is &mdash; better late than never!
              </p>
              <p style="font-size:16px;line-height:1.7;color:#d4d4d4;margin:0 0 16px">
                Thank you so much for subscribing and sticking around. It genuinely means a lot to me that you&rsquo;re here. I started CryptoFlex to share everything I&rsquo;m learning about cybersecurity, infrastructure, AI-assisted development, and the projects I&rsquo;m building along the way &mdash; and having people actually interested in following along is what keeps me going.
              </p>
            </td>
          </tr>

          <!-- What to expect -->
          <tr>
            <td style="padding:0 32px 20px">
              <div style="background:#1a1a22;border:1px solid #23232d;border-radius:8px;padding:16px 20px;margin:8px 0">
                <p style="margin:0 0 8px;font-size:15px;color:#f0f0f0;font-weight:600">What you can expect:</p>
                <p style="margin:0;font-size:15px;color:#d4d4d4;line-height:1.6">
                  A <strong style="color:#4dd0e1">weekly newsletter every Monday at 9:00 AM Eastern</strong> with summaries of new posts, what I&rsquo;ve been learning, and direct links to everything new. You can also now <strong style="color:#4dd0e1">leave comments on blog posts</strong> as a subscriber &mdash; I&rsquo;d love to hear your thoughts.
                </p>
              </div>
            </td>
          </tr>

          <!-- Latest posts -->
          <tr>
            <td style="padding:0 32px 8px">
              <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#f0f0f0">
                In case you missed anything, here are the latest posts:
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${postRows}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:0 32px 20px">
              <a href="${BASE_URL}/blog" style="display:inline-block;background:#4dd0e1;color:#0e0e12;padding:12px 28px;border-radius:6px;font-weight:600;text-decoration:none;font-size:15px">Explore the Blog</a>
            </td>
          </tr>

          <!-- Personal note -->
          <tr>
            <td style="padding:0 32px 28px">
              <p style="font-size:15px;line-height:1.7;color:#d4d4d4;margin:0">
                I&rsquo;m always open to feedback, ideas, or just saying hello. You can reach me anytime at <a href="mailto:Chris.Johnson@cryptoflexllc.com" style="color:#4dd0e1;text-decoration:none">Chris.Johnson@cryptoflexllc.com</a>.
              </p>
              <p style="font-size:15px;line-height:1.7;color:#d4d4d4;margin:12px 0 0">
                Thanks again for being here &mdash; more good stuff is on the way.
              </p>
              <p style="font-size:15px;color:#d4d4d4;margin:12px 0 0">
                &mdash; Chris
              </p>
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
