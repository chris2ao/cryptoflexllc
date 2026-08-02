"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BlogList, type BlogPostSummary } from "@/components/blog-list";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";

interface BlogIndexProps {
  posts: BlogPostSummary[];
  featured: BlogPostSummary[];
  categories: string[];
  allTags: string[];
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
  featured,
  categories,
  allTags,
}: BlogIndexProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return posts;
    const needle = activeCategory.toLowerCase();
    return posts.filter((post) =>
      post.tags.some((tag) => tag.toLowerCase() === needle)
    );
  }, [posts, activeCategory]);

  return (
    <>
      {activeCategory === null && <FeaturedPosts posts={featured} />}

      <BlogList posts={filteredPosts} allTags={allTags} />

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
