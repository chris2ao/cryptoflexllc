import Link from "next/link";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <nav
      aria-label="Blog categories"
      className="mb-8 flex flex-wrap gap-2"
    >
      {categories.map((category) => {
        const isActive =
          category === "All"
            ? activeCategory === null
            : activeCategory === category;

        const href =
          category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`;

        return (
          <Link
            key={category}
            href={href}
            scroll={false}
            rel={category === "All" ? undefined : "nofollow"}
            aria-current={isActive ? "page" : undefined}
            className={`
              inline-flex items-center rounded-md px-3 py-1 text-sm font-heading font-medium
              border transition-colors focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-ring focus-visible:ring-offset-2
              ${
                isActive
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }
            `}
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}
