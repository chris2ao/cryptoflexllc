/**
 * AI-generated weekly newsletter intro using Claude Haiku.
 *
 * Generates a unique opening for each weekly digest email with:
 *   - A fun historical tech fact related to the upcoming week
 *   - Notable holiday callouts
 *   - An excited summary of the included blog posts
 *   - A "Quote of the Week" pulled from the blog posts
 *
 * Falls back to static text when the API key is missing or the call fails.
 */

import Anthropic from "@anthropic-ai/sdk";

interface PostInfo {
  title: string;
  description: string;
  tags: string[];
}

export interface DigestIntro {
  greeting: string;
  contentIntro: string;
  quoteHtml: string;
  fromAi: boolean;
}

const STATIC_GREETING =
  "Thanks for being a subscriber &mdash; it means a lot! Every week I share what I&rsquo;ve been learning about cybersecurity, infrastructure, AI-assisted development, and the projects I&rsquo;m building.";

const STATIC_CONTENT_INTRO =
  "Here&rsquo;s what I learned and wrote about this week:";

/** Strip HTML tags and encode quotes to prevent XSS from AI output. */
function sanitizeAiText(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/"/g, "&quot;");
}

/**
 * Generate a dynamic intro for the weekly digest email.
 * Returns static fallback text when the API key is missing or the call fails.
 */
export async function generateDigestIntro(
  posts: PostInfo[],
  sendDate: Date
): Promise<DigestIntro> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, quoteHtml: "", fromAi: false };
  }

  const weekOf = sendDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const postList = posts
    .map((p) => `- "${p.title}": ${p.description} [tags: ${p.tags.join(", ")}]`)
    .join("\n");

  const systemPrompt = [
    "You are Chris, the founder of CryptoFlex LLC. You write in first person with a warm, enthusiastic, tech-loving tone.",
    "",
    "Write exactly THREE sections separated by the delimiter ---SECTION---",
    "",
    "SECTION 1 (Greeting): Open with a fun historical tech fact related to the week of " + weekOf + ". If there are notable holidays or observances this week, weave them in naturally. Then transition into a warm, enthusiastic welcome. Keep it to 2-3 sentences.",
    "",
    "SECTION 2 (Content Intro): An excited summary of this week&rsquo;s blog posts. Sprinkle in 1-2 clever puns or wordplay related to the actual post topics (security puns, coding jokes, AI humor, etc.). Mention at least the top 3-5 posts by name and tease what readers will learn. Keep it to 2-4 sentences.",
    "",
    "SECTION 3 (Quote of the Week): Pick the single most impactful, thought-provoking, or resonant quote from the blog posts listed below. This should be a direct excerpt from one of the posts that would make a reader stop and think, or that captures a key insight. Just the quote text, nothing else. Do not add attribution or the post title.",
    "",
    "Rules:",
    "- NEVER use em dashes. Use commas, periods, colons, or parentheses instead.",
    "- Do NOT use markdown formatting (no **, no #, no bullet points).",
    "- Do NOT include a greeting like 'Hey' or 'Hi' at the start of Section 1.",
    "- Do NOT include a sign-off like 'Cheers' or 'Best' at the end of Section 2.",
    "- Use HTML entities for special characters: &rsquo; for apostrophes, &amp; for ampersands.",
    "- Write in plain text suitable for an HTML email (no HTML tags).",
    "- Be creative and avoid formulaic openings. Each newsletter should feel unique.",
  ].join("\n");

  const userPrompt = `Week of: ${weekOf}\n\nBlog posts this week:\n${postList}`;

  try {
    const client = new Anthropic({ timeout: 10_000 });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    if (!text.trim()) {
      console.error("Newsletter intro: empty AI response, using fallback");
      return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, quoteHtml: "", fromAi: false };
    }

    // Parse the three sections separated by ---SECTION---
    const sections = text
      .split(/---SECTION---/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Fallback: if no delimiter found, try splitting on double newlines (legacy format)
    const parsed = sections.length >= 2
      ? sections
      : text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

    const greeting = sanitizeAiText(parsed[0] ?? STATIC_GREETING);
    const contentIntro = sanitizeAiText(parsed[1] ?? STATIC_CONTENT_INTRO);
    const quoteText = sanitizeAiText(parsed[2] ?? "");

    // Build a styled quote block if we got one
    const quoteHtml = quoteText
      ? `<div style="margin:16px 0;padding:16px;background:#1e293b;border-radius:8px;border-left:4px solid #4dd0e1;text-align:center">
          <p style="margin:0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:1px">Quote of the Week</p>
          <p style="margin:8px 0 0;color:#e2e8f0;font-size:16px;font-style:italic;line-height:1.5">&ldquo;${quoteText}&rdquo;</p>
        </div>`
      : "";

    return { greeting, contentIntro, quoteHtml, fromAi: true };
  } catch (error) {
    console.error("Newsletter intro generation failed:", error);
    return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, quoteHtml: "", fromAi: false };
  }
}
