import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  WebsiteJsonLd,
  PersonJsonLd,
  ArticleJsonLd,
  BreadcrumbJsonLd,
} from "./json-ld";

describe("WebsiteJsonLd", () => {
  it("renders valid JSON-LD script tag", () => {
    const { container } = render(
      <WebsiteJsonLd
        url="https://example.com"
        name="Example Site"
        description="An example website"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("includes correct schema.org context", () => {
    const { container } = render(
      <WebsiteJsonLd
        url="https://example.com"
        name="Example Site"
        description="An example website"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("WebSite");
  });

  it("includes website metadata", () => {
    const { container } = render(
      <WebsiteJsonLd
        url="https://example.com"
        name="Example Site"
        description="An example website"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.name).toBe("Example Site");
    expect(data.url).toBe("https://example.com");
    expect(data.description).toBe("An example website");
  });

  it("includes publisher organization", () => {
    const { container } = render(
      <WebsiteJsonLd
        url="https://example.com"
        name="Example Site"
        description="An example website"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.publisher["@type"]).toBe("Organization");
    expect(data.publisher.name).toBe("CryptoFlex LLC");
    expect(data.publisher.url).toBe("https://example.com");
    expect(data.publisher.logo["@type"]).toBe("ImageObject");
    expect(data.publisher.logo.url).toBe("https://example.com/CFLogo.png");
  });

  it("includes search action", () => {
    const { container } = render(
      <WebsiteJsonLd
        url="https://example.com"
        name="Example Site"
        description="An example website"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.potentialAction["@type"]).toBe("SearchAction");
    expect(data.potentialAction.target["@type"]).toBe("EntryPoint");
    expect(data.potentialAction.target.urlTemplate).toBe(
      "https://example.com/blog?q={search_term_string}"
    );
    expect(data.potentialAction["query-input"]).toBe(
      "required name=search_term_string"
    );
  });
});

describe("PersonJsonLd", () => {
  it("renders valid JSON-LD script tag", () => {
    const { container } = render(
      <PersonJsonLd
        name="John Doe"
        url="https://example.com"
        jobTitle="Developer"
        description="A software developer"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("includes correct schema.org type", () => {
    const { container } = render(
      <PersonJsonLd
        name="John Doe"
        url="https://example.com"
        jobTitle="Developer"
        description="A software developer"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
  });

  it("includes person metadata", () => {
    const { container } = render(
      <PersonJsonLd
        name="John Doe"
        url="https://example.com"
        jobTitle="Developer"
        description="A software developer"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.name).toBe("John Doe");
    expect(data.url).toBe("https://example.com/about");
    expect(data.jobTitle).toBe("Developer");
    expect(data.description).toBe("A software developer");
  });

  it("includes worksFor organization", () => {
    const { container } = render(
      <PersonJsonLd
        name="John Doe"
        url="https://example.com"
        jobTitle="Developer"
        description="A software developer"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.worksFor["@type"]).toBe("Organization");
    expect(data.worksFor.name).toBe("CryptoFlex LLC");
    expect(data.worksFor.url).toBe("https://example.com");
  });

  it("includes sameAs social links", () => {
    const { container } = render(
      <PersonJsonLd
        name="John Doe"
        url="https://example.com"
        jobTitle="Developer"
        description="A software developer"
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.sameAs).toEqual([
      "https://github.com/chris2ao",
      "https://www.linkedin.com/in/chris-johnson-4a2a70253/",
    ]);
  });
});

describe("ArticleJsonLd", () => {
  it("renders valid JSON-LD script tag", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test", "article"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("includes correct schema.org type", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Article");
  });

  it("includes article metadata", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.headline).toBe("Test Article");
    expect(data.description).toBe("A test article");
    expect(data.url).toBe("https://example.com/article");
    expect(data.datePublished).toBe("2026-02-10");
    expect(data.dateModified).toBe("2026-02-10");
  });

  it("includes author person", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.author["@type"]).toBe("Person");
    expect(data.author.name).toBe("Test Author");
    expect(data.author.url).toBe("https://cryptoflexllc.com/about");
  });

  it("includes publisher organization", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.publisher["@type"]).toBe("Organization");
    expect(data.publisher.name).toBe("CryptoFlex LLC");
    expect(data.publisher.url).toBe("https://cryptoflexllc.com");
    expect(data.publisher.logo.url).toBe("https://cryptoflexllc.com/CFLogo.png");
  });

  it("includes mainEntityOfPage", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.mainEntityOfPage["@type"]).toBe("WebPage");
    expect(data.mainEntityOfPage["@id"]).toBe("https://example.com/article");
  });

  it("formats keywords from tags", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["react", "typescript", "testing"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.keywords).toBe("react, typescript, testing");
  });

  it("includes image", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={["test"]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.image).toBe("https://cryptoflexllc.com/CFLogo.png");
  });

  it("handles empty tags array", () => {
    const { container } = render(
      <ArticleJsonLd
        title="Test Article"
        description="A test article"
        url="https://example.com/article"
        datePublished="2026-02-10"
        author="Test Author"
        tags={[]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.keywords).toBe("");
  });
});

describe("BreadcrumbJsonLd", () => {
  it("renders valid JSON-LD script tag", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://example.com" },
          { name: "Blog", url: "https://example.com/blog" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it("includes correct schema.org type", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://example.com" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
  });

  it("creates list items with correct positions", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://example.com" },
          { name: "Blog", url: "https://example.com/blog" },
          { name: "Post", url: "https://example.com/blog/post" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.itemListElement).toHaveLength(3);
    expect(data.itemListElement[0].position).toBe(1);
    expect(data.itemListElement[1].position).toBe(2);
    expect(data.itemListElement[2].position).toBe(3);
  });

  it("includes correct name and URL for each item", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://example.com" },
          { name: "Blog", url: "https://example.com/blog" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.itemListElement[0]["@type"]).toBe("ListItem");
    expect(data.itemListElement[0].name).toBe("Home");
    expect(data.itemListElement[0].item).toBe("https://example.com");

    expect(data.itemListElement[1]["@type"]).toBe("ListItem");
    expect(data.itemListElement[1].name).toBe("Blog");
    expect(data.itemListElement[1].item).toBe("https://example.com/blog");
  });

  it("handles single breadcrumb item", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[{ name: "Home", url: "https://example.com" }]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.itemListElement).toHaveLength(1);
    expect(data.itemListElement[0].position).toBe(1);
  });

  it("handles empty breadcrumb list", () => {
    const { container } = render(<BreadcrumbJsonLd items={[]} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.itemListElement).toHaveLength(0);
  });

  it("handles special characters in breadcrumb names", () => {
    const { container } = render(
      <BreadcrumbJsonLd
        items={[
          { name: "Home & Garden", url: "https://example.com" },
          { name: 'Blog "Posts"', url: "https://example.com/blog" },
        ]}
      />
    );

    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);

    expect(data.itemListElement[0].name).toBe("Home & Garden");
    expect(data.itemListElement[1].name).toBe('Blog "Posts"');
  });
});
