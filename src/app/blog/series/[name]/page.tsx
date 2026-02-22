import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog-card";
import { getAllSeries, getSeriesPosts } from "@/lib/blog";

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((s) => ({ name: s.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  return {
    title: `Series: ${decodedName}`,
    description: `All posts in the "${decodedName}" series on CryptoFlex LLC.`,
  };
}

export default async function SeriesPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const posts = getSeriesPosts(decodedName);

  if (posts.length === 0) notFound();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to blog
          </Link>
        </div>
        <div className="mb-10">
          <Badge variant="secondary" className="mb-3">
            Series
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold">{decodedName}</h1>
          <p className="mt-2 text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this
            series
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post, i) => (
            <div key={post.slug} className="flex gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                {i < posts.length - 1 && (
                  <div className="mt-1 flex-1 w-px bg-border" />
                )}
              </div>
              <div className="flex-1 pb-6">
                <BlogCard post={post} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
