import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "@/components/blog-list";
import { SubscribeForm } from "@/components/subscribe-form";
import { getAllPosts, getAllTags } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tech articles about cybersecurity, AI-assisted development with Claude Code, web infrastructure, Next.js, and hands-on engineering projects.",
  alternates: {
    canonical: "https://cryptoflexllc.com/blog",
  },
  openGraph: {
    title: "Blog — CryptoFlex LLC",
    description:
      "Tech articles about cybersecurity, AI-assisted development, and hands-on engineering projects.",
    url: "https://cryptoflexllc.com/blog",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  // Strip raw MDX content before passing to client component
  const summaries = posts.map(({ content: _, ...rest }) => rest);

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

        {/* Subscribe form */}
        <div className="mb-12 max-w-xl">
          <SubscribeForm />
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        ) : (
          <Suspense>
            <BlogList posts={summaries} allTags={allTags} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
