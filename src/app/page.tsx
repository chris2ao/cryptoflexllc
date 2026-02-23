import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { BlogCard } from "@/components/blog-card";
import { SubscribeInline } from "@/components/subscribe-inline";
import { ThirdConflictPromo } from "@/components/third-conflict-promo";
import { CannCannPromo } from "@/components/cann-cann-promo";
import { StatsSection } from "@/components/animated-counter";
import { getAllPosts } from "@/lib/blog";

export default function HomePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Stats */}
      <StatsSection
        stats={[
          { value: allPosts.length, label: "Blog Posts" },
          { value: 591, label: "Tests Passing" },
          { value: 98, label: "Code Coverage", suffix: "%" },
          { value: 5, label: "Active Projects" },
        ]}
      />

      {/* Featured Blog Posts */}
      {posts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Latest Posts
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Thoughts on tech, security, and building things.
                </p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex">
                <Link href="/blog">View all posts</Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Button asChild variant="ghost">
                <Link href="/blog">View all posts</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About Teaser */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">About Me</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              I&apos;m a military veteran who transitioned into IT and found
              my way to cybersecurity. My career has taken me from software
              development to sysadmin work to security engineering, and now
              into cybersecurity defense operations.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              CryptoFlex LLC is my Florida-registered IT consulting company.
              This site is where I share what I&apos;m working on and learning.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/about">Read my full story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscribe Inline */}
      <SubscribeInline />

      {/* Resources Teaser */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">Resources</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Visual recaps, slide decks, and reference material from my
              projects. Start with the &quot;7 Days, 117 Commits&quot; carousel
              for the full build story.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/resources">Browse resources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Third Conflict Promo */}
      <ThirdConflictPromo />

      {/* Cann Cann Promo */}
      <CannCannPromo />

      {/* Services Teaser */}
      <section className="py-16 sm:py-20 border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Need IT Help?
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              I&apos;m available for IT consulting, security assessments,
              and infrastructure projects through CryptoFlex LLC.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/services">View services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
