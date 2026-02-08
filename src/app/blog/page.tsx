import type { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tech articles about security, infrastructure, and projects.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Thoughts on tech projects, cybersecurity, infrastructure, and
            things I&apos;m learning.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
