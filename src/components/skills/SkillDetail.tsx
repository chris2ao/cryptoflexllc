"use client";

import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { type SkillItem, categoryMeta } from "@/lib/skills-data";
import { ArrowLeft, Copy, Check, ExternalLink, Sparkles, Bot, GitBranch, Terminal, Settings, Plug } from "lucide-react";
import { type ItemCategory } from "@/lib/skills-data";
import { parseLinkedText } from "@/lib/linked-text";

const categoryIcons: Record<ItemCategory, React.ElementType> = {
  skill: Sparkles,
  agent: Bot,
  hook: GitBranch,
  command: Terminal,
  configuration: Settings,
  mcp: Plug,
};

function CategoryIcon({
  category,
  className,
}: {
  category: ItemCategory;
  className?: string;
}) {
  const Icon = categoryIcons[category];
  return <Icon className={className} />;
}

function LinkedText({ text }: { text: string }) {
  const parts = parseLinkedText(text);
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "link") {
          return (
            <a
              key={i}
              href={part.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {part.label}
            </a>
          );
        }
        return <span key={i}>{part.content}</span>;
      })}
    </>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md border border-border/40 bg-background/80 p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <pre className="overflow-x-auto rounded-lg border border-border/40 bg-background p-4 text-sm font-mono text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface SkillDetailProps {
  item: SkillItem;
  onBack: () => void;
}

export function SkillDetail({ item, onBack }: SkillDetailProps) {
  const meta = categoryMeta[item.category];

  return (
    <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-4 duration-200">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </button>

      <div className="rounded-xl border border-border/40 bg-card">
        {/* Header */}
        <div className="border-b border-border/40 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${meta.bgColor}`}
            >
              <CategoryIcon
                category={item.category}
                className={`h-6 w-6 ${meta.color}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold">{item.name}</h2>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.bgColor} ${meta.color}`}
                >
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                by {item.author}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">How It Works</h3>
            <p className="text-muted-foreground leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Dependencies */}
          {item.dependencies.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Dependencies</h3>
              <ul className="space-y-2">
                {item.dependencies.map((dep) => (
                  <li
                    key={dep}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <LinkedText text={dep} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Integration Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Integration Steps</h3>
            <ol className="space-y-3">
              {item.integrationSteps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">
                    <LinkedText text={step} />
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Code Snippet */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
            <CodeBlock code={item.codeSnippet} />
          </div>

          {/* Source */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/40">
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
            <a
              href={`https://github.com/${item.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {item.repo}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
