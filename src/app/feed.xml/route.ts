import { getAllPosts } from "@/lib/blog";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const BASE_URL = "https://www.cryptoflexllc.com";
const OG_IMAGE = `${BASE_URL}/CFLogo.png`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Strip custom MDX/JSX component tags that won't render in feed readers
function stripMdxComponents(content: string): string {
  // Remove import statements
  let cleaned = content.replace(/^import\s+.*$/gm, "");
  // Remove self-closing JSX tags: <Component prop="val" />
  cleaned = cleaned.replace(/<[A-Z][A-Za-z]*\s*[^>]*\/>/g, "");
  // Remove opening + closing JSX block tags and their content: <Component>...</Component>
  cleaned = cleaned.replace(/<([A-Z][A-Za-z]*)[^>]*>[\s\S]*?<\/\1>/g, "");
  // Remove any remaining opening/closing JSX tags (standalone)
  cleaned = cleaned.replace(/<\/?[A-Z][A-Za-z]*[^>]*>/g, "");
  // Remove export statements
  cleaned = cleaned.replace(/^export\s+.*$/gm, "");
  // Collapse multiple blank lines into two
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

export async function GET() {
  const posts = getAllPosts();

  const items = await Promise.all(
    posts.map(async (post) => {
      const cleanedContent = stripMdxComponents(post.content);
      const htmlContent = await markdownToHtml(cleanedContent);

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>Chris.Johnson@cryptoflexllc.com (${escapeXml(post.author)})</author>
      <enclosure url="${OG_IMAGE}" type="image/png" length="0" />
      <media:content url="${OG_IMAGE}" medium="image" type="image/png" width="512" height="512" />
      <media:thumbnail url="${OG_IMAGE}" width="512" height="512" />
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`;
    })
  );

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CryptoFlex LLC Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Tech articles about cybersecurity, AI-assisted development, infrastructure, and projects by Chris Johnson.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${OG_IMAGE}</url>
      <title>CryptoFlex LLC Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
    ${items.join("")}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
