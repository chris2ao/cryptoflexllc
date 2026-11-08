"use client";

import { useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/blog-card";
import { ShowMoreButton } from "@/components/blog/show-more-button";
import { usePaging } from "@/components/blog/use-paging";
import { resolveTopic } from "@/lib/tag-alias";
import type { BlogPost } from "@/lib/blog";

export { PAGE_SIZE_MOBILE, PAGE_SIZE_DESKTOP } from "@/components/blog/use-paging";

/** Serializable subset of BlogPost (no raw MDX content) */
export type BlogPostSummary = Omit<BlogPost, "content">;

interface BlogListProps {
  posts: BlogPostSummary[];
}

function buildFuse(posts: BlogPostSummary[]): Fuse<BlogPostSummary> {
  return new Fuse(posts, {
    keys: [
      { name: "title", weight: 3 },
      { name: "description", weight: 2 },
      { name: "tags", weight: 1 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });
}

/**
 * Must match ALL selected tags AND the search text. An old tag name matches
 * posts tagged with its topic; a dropped tag matches only a literal tag.
 */
function filterPosts(
  posts: BlogPostSummary[],
  fuse: Fuse<BlogPostSummary>,
  search: string,
  selectedTags: string[]
): BlogPostSummary[] {
  const term = search.trim();
  const results = term ? fuse.search(term).map((r) => r.item) : [...posts];
  if (selectedTags.length === 0) return results;
  return results.filter((post) => {
    const postTagsLower = post.tags.map((t) => t.toLowerCase());
    return selectedTags.every((tag) => {
      const topic = resolveTopic(tag);
      return (
        postTagsLower.includes(tag.toLowerCase()) ||
        (topic !== null && postTagsLower.includes(topic.toLowerCase()))
      );
    });
  });
}

function trackSearchQuery(query: string) {
  if (query.length < 2) return;
  try {
    const payload = JSON.stringify({ query, path: window.location.pathname });
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

function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search posts..."
        className="w-full max-w-md rounded-md border border-input bg-background py-2 pl-9 pr-3 text-base sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-lg text-muted-foreground mb-4">
        No posts match your filters.
      </p>
      <button
        onClick={onClear}
        type="button"
        className="text-sm text-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

function ResultCount({
  shown,
  total,
  onClear,
}: {
  shown: number;
  total: number;
  onClear: () => void;
}) {
  return (
    <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
      <span>
        Showing {shown} of {total} posts
      </span>
      <button
        onClick={onClear}
        type="button"
        className="text-primary hover:underline"
      >
        Clear filters
      </button>
    </div>
  );
}

export function BlogList({ posts }: BlogListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [search, setSearch] = useState("");

  const fuse = useMemo(() => buildFuse(posts), [posts]);
  const selectedTags = useMemo(() => searchParams.getAll("tag"), [searchParams]);
  const filtered = useMemo(
    () => filterPosts(posts, fuse, search, selectedTags),
    [posts, fuse, search, selectedTags]
  );
  const paging = usePaging(
    filtered.length,
    `${search.trim()}|${selectedTags.join(",")}`
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => trackSearchQuery(value.trim()), 1000);
  }

  function clearFilters() {
    setSearch("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push("/blog", { scroll: false });
  }

  const hasFilters = search.trim() !== "" || selectedTags.length > 0;

  return (
    <>
      <SearchBox value={search} onChange={handleSearchChange} />
      {hasFilters && filtered.length > 0 && (
        <ResultCount shown={filtered.length} total={posts.length} onClear={clearFilters} />
      )}
      {filtered.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, index) => (
            <div key={post.slug} className={paging.cardClass(index)}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      )}
      <ShowMoreButton
        mobileShown={paging.mobileShown}
        desktopShown={paging.desktopShown}
        hasMoreMobile={paging.hasMoreMobile}
        hasMoreDesktop={paging.hasMoreDesktop}
        total={filtered.length}
        onClick={paging.showMore}
      />
    </>
  );
}
