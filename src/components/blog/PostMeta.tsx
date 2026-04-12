interface PostMetaProps {
  date: string;
  author?: string;
  readingTime?: string;
}

function formatDate(dateStr: string): string {
  // Append time to avoid UTC-vs-local shift on bare YYYY-MM-DD strings
  const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`;
  return new Date(normalized).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostMeta({ date, author, readingTime }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {author && <span>{author}</span>}
      {author && <span>&middot;</span>}
      <time dateTime={date}>{formatDate(date)}</time>
      {readingTime && <span>&middot;</span>}
      {readingTime && <span>{readingTime}</span>}
    </div>
  );
}
