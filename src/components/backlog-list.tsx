"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { BacklogCard } from "@/components/backlog-card";
import type { BlogPost } from "@/lib/blog";

/** Serializable subset of BlogPost (no raw MDX content) */
export type BacklogPostSummary = Omit<BlogPost, "content">;

interface BacklogListProps {
  posts: BacklogPostSummary[];
  allTags: string[];
}

export function BacklogList({ posts, allTags }: BacklogListProps) {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts: must match ALL selected tags AND search text
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return posts.filter((post) => {
      // Tag filter (AND logic)
      if (selectedTags.length > 0) {
        const postTagsLower = post.tags.map((t) => t.toLowerCase());
        const allTagsMatch = selectedTags.every((tag) =>
          postTagsLower.includes(tag.toLowerCase())
        );
        if (!allTagsMatch) return false;
      }

      // Text search
      if (term) {
        const haystack = [
          post.title,
          post.description,
          ...post.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [posts, selectedTags, search]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const isSelected = prev.some(
        (t) => t.toLowerCase() === tag.toLowerCase()
      );
      if (isSelected) {
        return prev.filter((t) => t.toLowerCase() !== tag.toLowerCase());
      }
      return [...prev, tag];
    });
  }

  function clearFilters() {
    setSearch("");
    setSelectedTags([]);
  }

  const hasFilters = search.trim() !== "" || selectedTags.length > 0;

  return (
    <>
      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drafts..."
          className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
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
      )}

      {/* Result count + clear */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {posts.length} drafts
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
        <p className="text-muted-foreground">
          No drafts match your filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BacklogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
