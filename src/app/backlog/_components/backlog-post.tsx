"use client";

import { PostActionBar } from "./post-action-bar";

interface BacklogPostProps {
  post: {
    slug: string;
    title: string;
    date: string;
    author: string;
    readingTime: string;
    tags: string[];
  };
  githubConfigured: boolean;
  children: React.ReactNode;
}

export function BacklogPost({
  post,
  githubConfigured,
  children,
}: BacklogPostProps) {
  return (
    <article className="rounded-lg border border-border bg-card mb-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            {post.author && <span>{post.author}</span>}
            <span>{post.date}</span>
            {post.readingTime && <span>{post.readingTime}</span>}
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <PostActionBar slug={post.slug} disabled={!githubConfigured} />
      </div>

      {/* Rendered MDX content */}
      <div className="p-6">{children}</div>
    </article>
  );
}
