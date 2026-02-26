/** JSON-LD structured data components for SEO */
import { BASE_URL } from "@/lib/constants";

interface WebsiteJsonLdProps {
  url: string;
  name: string;
  description: string;
}

export function WebsiteJsonLd({ url, name, description }: WebsiteJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    publisher: {
      "@type": "Organization",
      name: "CryptoFlex LLC",
      url,
      logo: {
        "@type": "ImageObject",
        url: `${url}/CFLogo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PersonJsonLdProps {
  name: string;
  url: string;
  jobTitle: string;
  description: string;
}

export function PersonJsonLd({
  name,
  url,
  jobTitle,
  description,
}: PersonJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${url}/about`,
    jobTitle,
    description,
    worksFor: {
      "@type": "Organization",
      name: "CryptoFlex LLC",
      url,
    },
    sameAs: [
      "https://github.com/chris2ao",
      "https://www.linkedin.com/in/chris-johnson-secops/",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  tags: string[];
  schemaType?: "Article" | "TechArticle" | "HowTo";
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  tags,
  schemaType = "Article",
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "CryptoFlex LLC",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/CFLogo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: tags.join(", "),
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
