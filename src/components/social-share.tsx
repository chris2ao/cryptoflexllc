"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.158 3.228-4.326.718-8.1 2.49-3.2 8.525 5.506 5.846 7.07-1.924 8.418-5.705C13.35 19.976 14.134 28 20.418 22c4.9-6.035 1.126-7.807-3.2-8.525 2.558.248 5.373-.6 6.158-3.228.246-.828.624-5.79.624-6.479 0-.688-.139-1.86-.902-2.203-.66-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
    </svg>
  );
}

function HackerNewsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0v24h24V0H0zm12.8 13.4V19h-1.6v-5.6L7.7 6h1.8l2.5 5.5L14.5 6h1.8l-3.5 7.4z" />
    </svg>
  );
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const blueskyUrl = `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`;
  const hnUrl = `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="h-4 w-4" />
        Share
      </span>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Share on X (Twitter)"
      >
        <TwitterIcon className="h-4 w-4" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="h-4 w-4" />
      </a>
      <a
        href={blueskyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Share on Bluesky"
      >
        <BlueskyIcon className="h-4 w-4" />
      </a>
      <a
        href={hnUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Share on Hacker News"
      >
        <HackerNewsIcon className="h-4 w-4" />
      </a>
      <button
        onClick={copyLink}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
