"use client";

import { useState } from "react";

interface YouTubeEmbedProps {
  /** The YouTube video ID (the part after `watch?v=`). */
  id: string;
  /** Accessible title for the video; also used as the play-button label. */
  title: string;
  /** Optional caption rendered beneath the player. */
  caption?: string;
  /** Optional start offset in seconds. */
  start?: number;
}

/**
 * Privacy-friendly, lazy-loaded YouTube embed.
 *
 * Renders a lightweight thumbnail "facade" first and only swaps in the actual
 * iframe once the reader clicks play. This keeps YouTube's scripts (and cookies)
 * off the page until they are wanted, and avoids the layout/perf cost of an
 * always-mounted iframe. The embed uses the youtube-nocookie.com domain.
 */
export function YouTubeEmbed({ id, title, caption, start }: YouTubeEmbedProps) {
  const [active, setActive] = useState(false);

  const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const src =
    `https://www.youtube-nocookie.com/embed/${id}` +
    `?autoplay=1&rel=0${start ? `&start=${start}` : ""}`;

  return (
    <figure className="not-prose my-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={src}
            title={title}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer bg-cover bg-center"
            style={{ backgroundImage: `url(${thumbnail})` }}
          >
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/15" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600/90 shadow-lg transition-transform group-hover:scale-110">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="ml-1 h-7 w-7"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
