"use client";

import { useState } from "react";
import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
}

// On phones the full topic list is 180+ chips (over 2,000px tall), so only the
// first few show until the reader asks for the rest. Every link stays in the
// HTML so crawlers and desktop readers see them all.
export const MOBILE_VISIBLE_CATEGORIES = 16;

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const hasOverflow = categories.length > MOBILE_VISIBLE_CATEGORIES;

  return (
    <div className="mb-8">
      <nav aria-label="Blog categories" id="blog-categories" className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
          const isActive =
            category === "All"
              ? activeCategory === null
              : activeCategory === category;

          const href =
            category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`;

          const collapsed = !expanded && !isActive && index >= MOBILE_VISIBLE_CATEGORIES;

          return (
            <Link
              key={category}
              href={href}
              scroll={false}
              rel={category === "All" ? undefined : "nofollow"}
              aria-current={isActive ? "page" : undefined}
              className={`
                inline-flex items-center rounded-md px-3 py-1 text-sm font-heading font-medium [@media(pointer:coarse)]:min-h-9
                border transition-colors focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-ring focus-visible:ring-offset-2
                ${collapsed ? "max-sm:hidden" : ""}
                ${
                  isActive
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }
              `}
            >
              {category}
            </Link>
          );
        })}
      </nav>
      {hasOverflow && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="blog-categories"
          className="mt-4 w-full min-h-11 rounded-md border border-border px-4 text-sm font-heading font-medium text-muted-foreground sm:hidden"
        >
          {expanded ? "Show fewer topics" : `Show all ${categories.filter((c) => c !== "All").length} topics`}
        </button>
      )}
    </div>
  );
}
