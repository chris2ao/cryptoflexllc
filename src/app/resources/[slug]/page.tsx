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
              style={{ height: resource.iframeHeight ?? "1100px" }}
            />
          </div>
        )}

        {resource.type === "document" && resource.downloadPath && (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
            <p className="text-center text-muted-foreground">
              {resource.description}
            </p>
            <a
              href={resource.downloadPath}
              download
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {resource.downloadLabel ?? "Download PDF"}
            </a>
          </div>
        )}

        {resource.type === "audio" && resource.downloadPath && (
          <div className="mt-10 flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            <p className="text-center text-muted-foreground">
              {resource.description}
            </p>
            <audio controls className="w-full max-w-lg">
              <source src={resource.downloadPath} type="audio/mp4" />
              Your browser does not support the audio element.
            </audio>
            <a
              href={resource.downloadPath}
              download
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {resource.downloadLabel ?? "Download Audio"}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
