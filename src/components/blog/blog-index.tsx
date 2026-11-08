"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BlogList, type BlogPostSummary } from "@/components/blog-list";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { StartHere } from "@/components/blog/start-here";
import { resolveTopic } from "@/lib/tag-alias";
import type { SeriesSummary } from "@/lib/home-content";

interface BlogIndexProps {
  posts: BlogPostSummary[];
  startHere: SeriesSummary[];
  categories: string[];
}

/**
 * Category filtering for the blog index.
 *
 * This used to run on the server, which meant reading searchParams and so
 * opting the whole /blog route into dynamic rendering: a function invocation
 * and a fresh render on every request, including every crawler hit, to
 * recompute a list that only changes at deploy time.
 *
 * The filter itself is a plain array pass over data the client already
 * receives, and BlogList alongside it was already reading ?tag= from the URL
 * client-side. Doing the same for ?category= lets /blog prerender.
 */
export function BlogIndex({
  posts,
  startHere,
  categories,
}: BlogIndexProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    const needles = [activeCategory, resolveTopic(activeCategory)]
      .filter((n): n is string => n !== null)
      .map((n) => n.toLowerCase());
    return posts.filter((post) =>
      post.tags.some((tag) => needles.includes(tag.toLowerCase()))
    );
  }, [posts, activeCategory]);

  return (
    <>
      {activeCategory === null && <StartHere series={startHere} />}

      <BlogList posts={filteredPosts} />

      {/* Category filter below posts for browsing by topic */}
      <div className="mt-16 pt-12 border-t border-border/40">
        <h2 className="font-heading text-lg font-semibold mb-4 text-muted-foreground">
          Browse by Topic
        </h2>
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
        />
      </div>
    </>
  );
}
