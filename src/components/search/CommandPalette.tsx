"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, BookOpen, User, Briefcase, Zap, Library, Mail, MessageSquare } from "lucide-react";

export interface CommandPalettePost {
  slug: string;
  title: string;
  tags: string[];
  date: string;
}

interface CommandPaletteProps {
  posts: CommandPalettePost[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Blog", href: "/blog", icon: <BookOpen className="h-4 w-4" /> },
  { label: "About", href: "/about", icon: <User className="h-4 w-4" /> },
  { label: "Portfolio", href: "/portfolio", icon: <Briefcase className="h-4 w-4" /> },
  { label: "Skills", href: "/skills", icon: <Zap className="h-4 w-4" /> },
  { label: "Resources", href: "/resources", icon: <Library className="h-4 w-4" /> },
  { label: "Contact", href: "/contact", icon: <Mail className="h-4 w-4" /> },
  { label: "Guestbook", href: "/guestbook", icon: <MessageSquare className="h-4 w-4" /> },
];

interface Result {
  id: string;
  type: "post" | "nav";
  label: string;
  href: string;
  meta?: string;
  icon?: React.ReactNode;
}

export function CommandPalette({ posts }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build filtered results
  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();

    const navResults: Result[] = NAV_ITEMS.filter(
      (item) => q === "" || item.label.toLowerCase().includes(q)
    ).map((item) => ({
      id: `nav-${item.href}`,
      type: "nav" as const,
      label: item.label,
      href: item.href,
      icon: item.icon,
    }));

    const postResults: Result[] = posts
      .filter((post) => {
        if (q === "") return true;
        return (
          post.title.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      })
      .slice(0, 8)
      .map((post) => ({
        id: `post-${post.slug}`,
        type: "post" as const,
        label: post.title,
        href: `/blog/${post.slug}`,
        meta: post.date,
        icon: <BookOpen className="h-4 w-4" />,
      }));

    return [...navResults, ...postResults];
  }, [query, posts]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setSelectedIndex(0);
  }

  function openPalette() {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }

  function closePalette() {
    setOpen(false);
    setQuery("");
  }

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Sync dialog open/close with native <dialog> API
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      // Focus input after modal opens
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  // Handle native dialog close (e.g. Escape key)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setOpen(false);
      setQuery("");
    }
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[selectedIndex];
      if (item) navigate(item.href);
    }
  }

  // Click on the backdrop (the dialog element itself, outside the panel)
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      closePalette();
    }
  }

  const navResults = results.filter((r) => r.type === "nav");
  const postResults = results.filter((r) => r.type === "post");

  // Global index offset for posts section
  const postOffset = navResults.length;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      className="
        m-0 p-0 max-w-none max-h-none w-full h-full
        bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm
        open:flex open:items-start open:justify-center open:pt-[15vh]
      "
      aria-label="Command palette"
    >
      <div
        className="
          relative w-full max-w-xl mx-4
          bg-[var(--surface-2)] border border-primary/20
          rounded-lg shadow-xl overflow-hidden
          flex flex-col
        "
        style={{ boxShadow: "0 0 0 1px oklch(0.72 0.17 192 / 0.15), 0 20px 60px oklch(0 0 0 / 0.6)" }}
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-primary/15">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search posts or navigate..."
            className="
              flex-1 bg-transparent text-sm text-foreground
              placeholder:text-muted-foreground
              focus:outline-none
            "
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="command-palette-list"
            aria-activedescendant={
              results[selectedIndex] ? `cp-item-${results[selectedIndex].id}` : undefined
            }
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div
          id="command-palette-list"
          role="listbox"
          className="overflow-y-auto max-h-[60vh] py-2"
        >
          {results.length === 0 && (
            <p className="px-4 py-6 text-sm text-center text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* Navigation section */}
          {navResults.length > 0 && (
            <section>
              <p className="px-4 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                Navigation
              </p>
              {navResults.map((item, i) => (
                <ResultRow
                  key={item.id}
                  item={item}
                  index={i}
                  isSelected={i === selectedIndex}
                  onSelect={navigate}
                  onHover={setSelectedIndex}
                />
              ))}
            </section>
          )}

          {/* Posts section */}
          {postResults.length > 0 && (
            <section className="mt-1">
              <p className="px-4 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                Blog Posts
              </p>
              {postResults.map((item, i) => (
                <ResultRow
                  key={item.id}
                  item={item}
                  index={postOffset + i}
                  isSelected={postOffset + i === selectedIndex}
                  onSelect={navigate}
                  onHover={setSelectedIndex}
                />
              ))}
            </section>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-primary/10 text-[11px] text-muted-foreground font-mono">
          <span><kbd className="rounded border border-border bg-muted px-1 py-0.5">↑↓</kbd> navigate</span>
          <span><kbd className="rounded border border-border bg-muted px-1 py-0.5">↵</kbd> open</span>
          <span><kbd className="rounded border border-border bg-muted px-1 py-0.5">esc</kbd> close</span>
        </div>
      </div>
    </dialog>
  );
}

interface ResultRowProps {
  item: Result;
  index: number;
  isSelected: boolean;
  onSelect: (href: string) => void;
  onHover: (index: number) => void;
}

function ResultRow({ item, index, isSelected, onSelect, onHover }: ResultRowProps) {
  return (
    <button
      id={`cp-item-${item.id}`}
      role="option"
      aria-selected={isSelected}
      type="button"
      onClick={() => onSelect(item.href)}
      onMouseEnter={() => onHover(index)}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-left
        transition-colors
        ${
          isSelected
            ? "bg-primary/15 text-foreground"
            : "text-foreground/80 hover:bg-primary/8"
        }
      `}
    >
      <span
        className={`shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
      >
        {item.icon}
      </span>
      <span className="flex-1 text-sm truncate">{item.label}</span>
      {item.meta && (
        <span className="shrink-0 text-[11px] text-muted-foreground font-mono">
          {item.meta}
        </span>
      )}
      {isSelected && (
        <span className="shrink-0 text-[11px] text-primary font-mono">↵</span>
      )}
    </button>
  );
}
