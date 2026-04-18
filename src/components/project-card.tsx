import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  title: string;
  description: string;
  tech: string[];
  link?: string;
}

export function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <Card className="h-full transition-colors hover:border-primary/30 bg-card border border-border/40 rounded-lg">
      <CardHeader className="pb-3">
        <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-body text-muted-foreground mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <Badge key={t} variant="secondary" className="text-xs font-mono text-primary/80">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (!project.link) {
    return <div className="group block">{inner}</div>;
  }

  const isExternal = /^https?:\/\//.test(project.link);
  if (isExternal) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={project.link} className="group block">
      {inner}
    </Link>
  );
}
