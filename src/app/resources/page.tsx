import type { Metadata } from "next";
import { getAllResources } from "@/lib/resources";
import { ResourceCard } from "@/components/resource-card";

export const metadata: Metadata = {
  title: "Resources | CryptoFlex LLC",
  description:
    "Carousels, guides, and downloadable resources from CryptoFlex LLC.",
  alternates: {
    canonical: "https://www.cryptoflexllc.com/resources",
  },
};

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Resources</h1>
        <p className="mt-2 text-muted-foreground">
          Visual recaps, guides, and reference material.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource.slug} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}
