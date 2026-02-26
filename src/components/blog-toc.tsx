"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import type { TocHeading } from "@/lib/headings";

interface BlogTocProps {
  headings: TocHeading[];
  variant?: "inline" | "sidebar";
}

function useTocObserver(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function TocLinks({
  headings,
  activeId,
}: {
  headings: TocHeading[];
  activeId: string;
}) {
  return (
    <ul className="space-y-1 text-sm">
      {headings.map((heading) => (
        <li
          key={heading.id}
          style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
        >
          <a
            href={`#${heading.id}`}
            className={`block rounded px-2 py-1 transition-colors ${
              activeId === heading.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(heading.id)
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function BlogToc({ headings, variant = "inline" }: BlogTocProps) {
  const activeId = useTocObserver(headings);
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 3) return null;

  if (variant === "sidebar") {
    return (
      <nav
        className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
        aria-label="Table of contents"
      >
        <p className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <List className="h-4 w-4" />
          Table of Contents
        </p>
        <TocLinks headings={headings} activeId={activeId} />
      </nav>
    );
  }

  return (
    <nav
      className="mb-8 rounded-lg border border-border bg-card p-4"
      aria-label="Table of contents"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-medium text-foreground"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents
        </span>
        <span className="text-muted-foreground">{isOpen ? "\u2212" : "+"}</span>
      </button>
      {isOpen && (
        <div className="mt-3">
          <TocLinks headings={headings} activeId={activeId} />
        </div>
      )}
    </nav>
  );
}
