"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import type { BlogPost } from "@/lib/blog";

/** Serializable subset of BlogPost (no raw MDX content) */
export type BlogPostSummary = Omit<BlogPost, "content">;

interface BlogListProps {
  posts: BlogPostSummary[];
  allTags: string[];
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [search, setSearch] = useState("");

  // Keyboard shortcut: Ctrl/Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fuse.js instance for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 3 },
          { name: "description", weight: 2 },
          { name: "tags", weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
      }),
    [posts]
  );

  // Read selected tags from URL query params
  const selectedTags = useMemo(
    () => searchParams.getAll("tag"),
    [searchParams]
  );

  // Filter posts: must match ALL selected tags AND fuzzy search text
  const filtered = useMemo(() => {
    let results: BlogPostSummary[];

    const term = search.trim();
    if (term) {
      results = fuse.search(term).map((r) => r.item);
    } else {
      results = [...posts];
    }

    if (selectedTags.length > 0) {
      results = results.filter((post) => {
        const postTagsLower = post.tags.map((t) => t.toLowerCase());
        return selectedTags.every((tag) =>
          postTagsLower.includes(tag.toLowerCase())
        );
      });
    }

    return results;
  }, [posts, selectedTags, search, fuse]);

  function toggleTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("tag");
    const isSelected = current.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );

    // Rebuild tag params
    params.delete("tag");
    if (isSelected) {
      for (const t of current) {
        if (t.toLowerCase() !== tag.toLowerCase()) {
          params.append("tag", t);
        }
      }
    } else {
      for (const t of current) {
        params.append("tag", t);
      }
      params.append("tag", tag);
    }

    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  }

  function trackSearchQuery(query: string) {
    if (query.length < 2) return;
    try {
      const payload = JSON.stringify({
        query,
        path: window.location.pathname,
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/analytics/track-search",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/analytics/track-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Silently fail - analytics must not disrupt UX
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      trackSearchQuery(value.trim());
    }, 1000);
  }

  function clearFilters() {
    setSearch("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    router.push("/blog", { scroll: false });
  }

  const hasFilters = search.trim() !== "" || selectedTags.length > 0;

  return (
    <>
      {/* Search input with icon */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search posts... (Ctrl+K)"
          className="w-full max-w-md rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Tag filter bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const isActive = selectedTags.some(
            (t) => t.toLowerCase() === tag.toLowerCase()
          );
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              type="button"
            >
              <Badge
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer transition-colors"
              >
                {tag}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Result count + clear */}
      {hasFilters && filtered.length > 0 && (
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {posts.length} posts
          </span>
          <button
            onClick={clearFilters}
            type="button"
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Post grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-lg text-muted-foreground mb-4">
            No posts match your filters.
          </p>
          <button
            onClick={clearFilters}
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
