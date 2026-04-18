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
  const ogUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(resource.title)}&author=Chris+Johnson`;
  return {
    title: resource.title,
    description: resource.description,
    alternates: {
      canonical: `${BASE_URL}/resources/${slug}`,
    },
    openGraph: {
      title: resource.title,
      description: resource.description,
      url: `${BASE_URL}/resources/${slug}`,
      type: "article",
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description,
      images: [ogUrl],
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
          <div className="mt-10 flex flex-col gap-4">
            {resource.downloadPath.endsWith(".pdf") ? (
              <iframe
                src={resource.downloadPath}
                title={resource.title}
                className="w-full rounded-lg border border-border"
                style={{ height: "80vh", minHeight: "600px" }}
              />
            ) : /\.(png|jpe?g|gif|webp|svg)$/i.test(resource.downloadPath) ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <img
                  src={resource.downloadPath}
                  alt={resource.title}
                  className="w-full h-auto"
                />
              </div>
            ) : null}
            <div className="flex justify-center">
              <a
                href={resource.downloadPath}
                download
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {resource.downloadLabel ?? "Download PDF"}
              </a>
            </div>
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
