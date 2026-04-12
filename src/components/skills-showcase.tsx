"use client";

import { useState, useMemo } from "react";
import { type SkillItem, type ItemCategory, categoryMeta, skillItems } from "@/lib/skills-data";
import { Search } from "lucide-react";
import { SkillsFilter } from "@/components/skills/SkillsFilter";
import { SkillDetail } from "@/components/skills/SkillDetail";
import { Sparkles, Bot, GitBranch, Terminal, Settings, Plug } from "lucide-react";

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
        <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
          {item.name}
        </h3>
        <p className="mt-1.5 font-body text-sm text-muted-foreground line-clamp-2">
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

export function SkillsShowcase() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<SkillItem | null>(null);

  const filtered = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return skillItems.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;

      if (selectedTags.length > 0) {
        const itemTagsLower = item.tags.map((t) => t.toLowerCase());
        if (!selectedTags.every((tag) => itemTagsLower.includes(tag.toLowerCase())))
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


  function clearFilters() {
    setSearchQuery("");
    setSelectedTags([]);
    setActiveCategory("all");
  }

  if (selectedItem) {
    return (
      <SkillDetail item={selectedItem} onBack={() => setSelectedItem(null)} />
    );
  }

  return (
    <>
      <SkillsFilter
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        selectedTags={selectedTags}
        filteredCount={filtered.length}
        categoryCounts={categoryCounts}
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
        onClearFilters={clearFilters}
      />

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
