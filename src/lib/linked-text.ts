export const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

export interface LinkPart {
  type: "text";
  content: string;
}

export interface LinkAnchor {
  type: "link";
  label: string;
  href: string;
  index: number;
}

export type LinkedPart = LinkPart | LinkAnchor;

/** Parse a string with optional markdown links into an array of parts. */
export function parseLinkedText(text: string): LinkedPart[] {
  const parts: LinkedPart[] = [];
  let lastIndex = 0;
  const re = new RegExp(LINK_RE.source, "g");
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "link", label: match[1], href: match[2], index: match.index });
    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}
