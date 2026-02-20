"use client";

import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  type SkillItem,
  type ItemCategory,
  categoryMeta,
  skillItems,
  getAllTags,
} from "@/lib/skills-data";
import {
  Sparkles,
  Bot,
  GitBranch,
  Terminal,
  Settings,
  Plug,
  Search,
  X,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

const categoryIcons: Record<ItemCategory, React.ElementType> = {
  skill: Sparkles,
  agent: Bot,
  hook: GitBranch,
  command: Terminal,
  configuration: Settings,
  mcp: Plug,
};

const categories: { key: ItemCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "skill", label: "Skills" },
  { key: "agent", label: "Agents" },
  { key: "hook", label: "Hooks" },
  { key: "command", label: "Commands" },
  { key: "configuration", label: "Configs" },
  { key: "mcp", label: "MCPs" },
];

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

function SkillCard({
  item,
  onClick,
}: {
  item: SkillItem;
  onClick: () => void;
}) {
  const meta = categoryMeta[item.category];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${meta.bgColor}`}
        >
          <CategoryIcon category={item.category} className={`h-5 w-5 ${meta.color}`} />
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${meta.bgColor} ${meta.color}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            +{item.tags.length - 3}
          </span>
        )}
      </div>
    </button>
  );
}

function SkillDetail({
  item,
  onBack,
}: {
  item: SkillItem;
  onBack: () => void;
}) {
  const meta = categoryMeta[item.category];

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-200">
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
                    {dep}
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
                  <span className="pt-0.5">{step}</span>
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

export function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<SkillItem | null>(null);

  const allTags = useMemo(() => getAllTags(), []);

  const filtered = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return skillItems.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory)
        return false;

      if (selectedTags.length > 0) {
        const itemTagsLower = item.tags.map((t) => t.toLowerCase());
        if (
          !selectedTags.every((tag) =>
            itemTagsLower.includes(tag.toLowerCase())
          )
        )
          return false;
      }

      if (term) {
        const haystack = [item.name, item.description, ...item.tags]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedTags]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: skillItems.length };
    for (const item of skillItems) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, []);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedTags([]);
    setActiveCategory("all");
  }

  const hasFilters =
    searchQuery.trim() !== "" ||
    selectedTags.length > 0 ||
    activeCategory !== "all";

  if (selectedItem) {
    return (
      <SkillDetail
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills, agents, hooks, commands..."
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.key;
          const count = categoryCounts[cat.key] || 0;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {cat.key !== "all" && (
                <CategoryIcon
                  category={cat.key as ItemCategory}
                  className="h-3.5 w-3.5"
                />
              )}
              {cat.label}
              <span
                className={`ml-0.5 text-xs ${
                  isActive ? "text-primary/70" : "text-muted-foreground/60"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tag filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isActive = selectedTags.includes(tag);
            return (
              <button key={tag} onClick={() => toggleTag(tag)} type="button">
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className="cursor-pointer text-xs transition-colors"
                >
                  {tag}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count + clear */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {filtered.length} of {skillItems.length} items
          </span>
          <button
            onClick={clearFilters}
            type="button"
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card px-6 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 text-muted-foreground">
            No items match your filters.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <SkillCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}
    </>
  );
}
