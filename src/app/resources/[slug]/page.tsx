import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllResources, getResourceBySlug } from "@/lib/resources";
import { SlideCarousel } from "@/components/slide-carousel";
import { weekOneSlides } from "@/components/slides/week-one-slides";
import { BASE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | CryptoFlex LLC`,
    description: resource.description,
    alternates: {
      canonical: `${BASE_URL}/resources/${slug}`,
    },
  };
}

const slideMap: Record<string, typeof weekOneSlides> = {
  "week-one-carousel": weekOneSlides,
};

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  const slides = slideMap[slug];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/resources"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Resources
        </Link>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
          {resource.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{resource.description}</p>

        {slides && (
          <div className="mt-10">
            <SlideCarousel slides={slides} />
          </div>
        )}

        {resource.type === "infographic" && (
          <div className="mt-10">
            <iframe
              src={`/resources/${slug}.html`}
              title={resource.title}
              className="w-full rounded-lg border border-border"
              style={{ height: "1100px" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
