import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block">
      <Card className="h-full transition-colors hover:border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs capitalize">
              {resource.type}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {resource.date}
            </span>
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
