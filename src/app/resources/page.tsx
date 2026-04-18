import type { Metadata } from "next";
import { getAllResources } from "@/lib/resources";
import { ResourceCard } from "@/components/resource-card";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { BASE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Carousels, guides, slide decks, infographics, and downloadable references from CryptoFlex LLC.",
  alternates: {
    canonical: `${BASE_URL}/resources`,
  },
  openGraph: {
    title: "Resources — CryptoFlex LLC",
    description:
      "Visual recaps, slide decks, infographics, and downloadable references.",
    url: `${BASE_URL}/resources`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Resources&author=Chris+Johnson`,
        width: 1200,
        height: 630,
        alt: "CryptoFlex LLC Resources",
      },
    ],
  },
};

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <>
      <EditorialPageHeader
        sectionLabel="§ 07 / Resources"
        overline="Library"
        title={<>Visual <em className="text-italic-serif" style={{ color: "var(--fg-2)" }}>recaps.</em></>}
        lede="Carousels, slide decks, infographics, and downloadable reference material from the work in progress."
      />
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.slug} resource={resource} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
