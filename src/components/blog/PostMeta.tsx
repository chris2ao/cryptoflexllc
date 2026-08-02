import { formatPostDate } from "@/lib/post-date";

interface PostMetaProps {
  date: string;
  author?: string;
  readingTime?: string;
}

export function PostMeta({ date, author, readingTime }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      {author && <span>{author}</span>}
      {author && <span>&middot;</span>}
      <time dateTime={date}>{formatPostDate(date)}</time>
      {readingTime && <span>&middot;</span>}
      {readingTime && <span>{readingTime}</span>}
    </div>
  );
}
