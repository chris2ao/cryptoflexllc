import { slugify, getTextContent } from "@/lib/headings";

/**
 * Factory for MDX heading components with hover anchor links.
 * Shared by the blog and backlog post pages so drafts preview
 * with identical heading rendering.
 */
export function createHeading(level: number) {
  const Component = ({
    children,
    ...props
  }: React.ComponentPropsWithoutRef<"h1">) => {
    const text = getTextContent(children);
    const id = slugify(text);
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag id={id} className="group" {...props}>
        {children}
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity no-underline"
          aria-label="Link to section"
        >
          #
        </a>
      </Tag>
    );
  };
  Component.displayName = `H${level}`;
  return Component;
}
