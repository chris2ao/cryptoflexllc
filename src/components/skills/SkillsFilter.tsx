"use client";

import { type ItemCategory, skillItems } from "@/lib/skills-data";
import {
  Sparkles,
  Bot,
  GitBranch,
  Terminal,
  Settings,
  Plug,
  Search,
  X,
} from "lucide-react";

const categoryIcons: Record<ItemCategory, React.ElementType> = {
  skill: Sparkles,
  agent: Bot,
  hook: GitBranch,
  command: Terminal,
  configuration: Settings,
  mcp: Plug,
};

export const categories: { key: ItemCategory | "all"; label: string }[] = [
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

interface SkillsFilterProps {
  searchQuery: string;
  activeCategory: ItemCategory | "all";
  selectedTags: string[];
  filteredCount: number;
  categoryCounts: Record<string, number>;
  onSearchChange: (value: string) => void;
  onCategoryChange: (cat: ItemCategory | "all") => void;
  onClearFilters: () => void;
}

export function SkillsFilter({
  searchQuery,
  activeCategory,
  selectedTags,
  filteredCount,
  categoryCounts,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}: SkillsFilterProps) {
  const hasFilters =
    searchQuery.trim() !== "" || selectedTags.length > 0 || activeCategory !== "all";

  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search skills, agents, hooks, commands..."
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
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
              onClick={() => onCategoryChange(cat.key)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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

      {/* Results count + clear */}
      {hasFilters && (
        <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            Showing {filteredCount} of {skillItems.length} items
          </span>
          <button
            onClick={onClearFilters}
            type="button"
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
