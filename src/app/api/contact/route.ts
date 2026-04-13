import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

const rateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { allowed, retryAfter } = await rateLimiter.checkRateLimit(
    `contact:${ip}`
  );
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many messages. Try again in ${retryAfter} seconds.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.error("[contact] RESEND_API_KEY not configured");
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: "CryptoFlex Contact Form <contact@cryptoflexllc.com>",
      to: "chrisjohnson@cryptoflexllc.com",
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px;">
          <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Name:</td>
              <td style="padding: 8px;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Email:</td>
              <td style="padding: 8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; vertical-align: top;">Subject:</td>
              <td style="padding: 8px;">${escapeHtml(subject)}</td>
            </tr>
          </table>
          <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
          <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      `,
    });

    console.log(`[contact] Message from ${name} <${email}> sent via Resend`);
  } catch (error) {
    console.error("[contact] Email send failed:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
