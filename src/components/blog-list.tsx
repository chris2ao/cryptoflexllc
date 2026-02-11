"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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

  const [search, setSearch] = useState("");

  // Read selected tags from URL query params
  const selectedTags = useMemo(
    () => searchParams.getAll("tag"),
    [searchParams]
  );

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
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("tag");
    const isSelected = current.some(
      (t) => t.toLowerCase() === tag.toLowerCase()
    );

    // Rebuild tag params
    params.delete("tag");
    if (isSelected) {
      // Remove this tag
      for (const t of current) {
        if (t.toLowerCase() !== tag.toLowerCase()) {
          params.append("tag", t);
        }
      }
    } else {
      // Add this tag
      for (const t of current) {
        params.append("tag", t);
      }
      params.append("tag", tag);
    }

    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : "/blog", { scroll: false });
  }

  function clearFilters() {
    setSearch("");
    router.push("/blog", { scroll: false });
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
          placeholder="Search posts..."
          className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
      {hasFilters && (
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
        <p className="text-muted-foreground">
          No posts match your filters.
        </p>
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
