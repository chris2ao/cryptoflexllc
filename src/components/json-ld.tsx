/** JSON-LD structured data components for SEO */

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
      "https://www.linkedin.com/in/chris-johnson-4a2a70253/",
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
  author: string;
  tags: string[];
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  author,
  tags,
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Person",
      name: author,
      url: "https://cryptoflexllc.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "CryptoFlex LLC",
      url: "https://cryptoflexllc.com",
      logo: {
        "@type": "ImageObject",
        url: "https://cryptoflexllc.com/CFLogo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: tags.join(", "),
    image: "https://cryptoflexllc.com/CFLogo.png",
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
