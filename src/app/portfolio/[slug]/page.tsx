import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const studies = getAllCaseStudies();
  return studies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.description,
    alternates: { canonical: `${BASE_URL}/portfolio/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/portfolio"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to portfolio
        </Link>

        <header className="mt-6 mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tech.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {study.title}
          </h1>
          {study.client && (
            <p className="mt-2 text-muted-foreground">
              Client: {study.client}
            </p>
          )}
        </header>

        {/* Summary cards */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {study.challenge && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Challenge
              </h3>
              <p className="text-sm">{study.challenge}</p>
            </div>
          )}
          {study.outcome && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">
                Outcome
              </h3>
              <p className="text-sm">{study.outcome}</p>
            </div>
          )}
        </div>

        {/* Full writeup */}
        <div className="prose dark:prose-invert prose-zinc max-w-none prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <MDXRemote
            source={study.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </div>
    </article>
  );
}
