/**
 * AI-generated weekly newsletter intro using Claude Haiku.
 *
 * Generates a unique opening for each weekly digest email with:
 *   - A fun historical tech fact related to the upcoming week
 *   - Notable holiday callouts
 *   - An excited summary of the included blog posts
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
    return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, fromAi: false };
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
    "Write exactly TWO paragraphs separated by a blank line.",
    "Paragraph 1: Open with a fun historical tech fact tied to the week of " + weekOf + ". If there are notable holidays or observances this week, weave them in naturally.",
    "Paragraph 2: Give an excited, brief summary of the blog posts included this week. Mention each post by name and hint at what readers will learn.",
    "Rules:",
    "- NEVER use em dashes. Use commas, periods, colons, or parentheses instead.",
    "- Do NOT use markdown formatting (no **, no #, no bullet points).",
    "- Do NOT include a greeting like 'Hey' or 'Hi' at the start.",
    "- Do NOT include a sign-off like 'Cheers' or 'Best' at the end.",
    "- Use HTML entities for special characters: &rsquo; for apostrophes, &amp; for ampersands.",
    "- Keep each paragraph to 2-3 sentences.",
    "- Write in plain text suitable for an HTML email (no tags).",
  ].join("\n");

  const userPrompt = `Week of: ${weekOf}\n\nBlog posts this week:\n${postList}`;

  try {
    const client = new Anthropic({ timeout: 10_000 });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    if (!text.trim()) {
      console.error("Newsletter intro: empty AI response, using fallback");
      return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, fromAi: false };
    }

    const paragraphs = text
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const greeting = sanitizeAiText(paragraphs[0] ?? STATIC_GREETING);
    const contentIntro = sanitizeAiText(paragraphs[1] ?? STATIC_CONTENT_INTRO);

    return { greeting, contentIntro, fromAi: true };
  } catch (error) {
    console.error("Newsletter intro generation failed:", error);
    return { greeting: STATIC_GREETING, contentIntro: STATIC_CONTENT_INTRO, fromAi: false };
  }
}
