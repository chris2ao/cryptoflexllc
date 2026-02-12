"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

interface BlogPostThumbsUpProps {
  slug: string;
}

/**
 * Displays the thumbs-up count inline (used in the blog post header).
 * Fetches the count client-side so the static page still works.
 */
export function BlogPostThumbsUp({ slug }: BlogPostThumbsUpProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setCount(d.thumbsUp ?? 0))
      .catch(() => {});
  }, [slug]);

  if (count === null || count === 0) return null;

  return (
    <>
      <span>&middot;</span>
      <span className="inline-flex items-center gap-1">
        <ThumbsUp className="h-3.5 w-3.5 text-green-400" />
        {count}
      </span>
    </>
  );
}
