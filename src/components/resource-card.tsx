import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block">
      <Card className="h-full transition-colors hover:border-primary/30 bg-card border border-border/40 rounded-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs font-mono capitalize text-primary/80">
              {resource.type}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              {resource.date}
            </span>
          </div>
          <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-body text-muted-foreground mb-4">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-mono text-primary/80">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
