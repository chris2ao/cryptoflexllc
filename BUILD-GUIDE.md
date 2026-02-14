# How I Built CryptoFlexLLC.com with Claude Code & Next.js

A step-by-step guide to building a personal tech blog and portfolio site from scratch using Next.js 15, Tailwind CSS v4, shadcn/ui, and MDX, with an AI copilot along for the ride.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Step 1: Scaffold the Project](#step-1-scaffold-the-project)
4. [Step 2: Initialize shadcn/ui](#step-2-initialize-shadcnui)
5. [Step 3: Install Dependencies](#step-3-install-dependencies)
6. [Step 4: Configure the Dark Theme](#step-4-configure-the-dark-theme)
7. [Step 5: Build the Layout (Nav + Footer)](#step-5-build-the-layout-nav--footer)
8. [Step 6: Build the Homepage](#step-6-build-the-homepage)
9. [Step 7: Build the Blog System](#step-7-build-the-blog-system)
10. [Step 8: Build the Remaining Pages](#step-8-build-the-remaining-pages)
11. [Step 9: SEO & Polish](#step-9-seo--polish)
12. [Step 10: Verify the Build](#step-10-verify-the-build)
13. [Step 11: Deploy](#step-11-deploy)
14. [Project Structure Reference](#project-structure-reference)
15. [What's Next](#whats-next)

---

## Introduction

### What We're Building

This guide walks through every step of building [cryptoflexllc.com](https://cryptoflexllc.com), a personal tech blog and professional portfolio for a cybersecurity professional. It's a real production site, not a tutorial toy.

By the end, you'll have:

- A dark-themed, responsive website with a sticky glassmorphism navbar
- A blog system powered by MDX files (Markdown + JSX) - just drop in a `.mdx` file and it shows up on the site
- Pages for About, Services, Portfolio, and Contact
- SEO metadata, Open Graph tags, and a custom 404 page
- A production build ready to deploy to Vercel

### Why This Stack?

| Technology | Why I Chose It |
|---|---|
| **Next.js 15** | App Router gives you server components by default: better performance, simpler data fetching, and the file-based routing means your folder structure *is* your URL structure. |
| **React 19** | Latest React with Server Components support. No need for `useEffect` to fetch data anymore. |
| **Tailwind CSS v4** | The new version moves all configuration into CSS via `@theme` blocks (no more `tailwind.config.ts`). Faster builds, less config. |
| **shadcn/ui** | Not a component library you install, it copies real component source code into your project. You own the code and can modify anything. Built on Radix primitives (accessible by default). |
| **MDX** | Write blog posts in Markdown with the ability to embed React components. Posts are just files in your repo (no database, no CMS). |

### The Claude Code Factor

I built this site with the help of [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's CLI tool for AI-assisted development. You absolutely don't need Claude Code to follow this guide (every command and every line of code is right here). But if you do use it, the iteration loop is remarkably fast: describe what you want, review the code, tweak, repeat.

---

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** (check with `node --version`)
- **npm** (comes with Node.js, check with `npm --version`)
- **Git** (check with `git --version`)
- **GitHub CLI** (optional, for deployment: `gh --version`)
- A code editor (VS Code, Cursor, etc.)

> **Windows users:** If you're on Windows, all commands work in PowerShell, Git Bash, or Windows Terminal. I used Windows for this entire build. Watch out for path separator issues in a few places (I'll call them out when they come up).

---

## Step 1: Scaffold the Project

### Create the Next.js App

Run the `create-next-app` command with these specific flags:

```bash
npx create-next-app@latest cryptoflexllc --typescript --tailwind --app --src-dir --eslint
```

Here's what each flag does:

| Flag | What It Does |
|---|---|
| `--typescript` | Enables TypeScript (`.tsx` files instead of `.jsx`) |
| `--tailwind` | Sets up Tailwind CSS (in v4, this means PostCSS integration via `@tailwindcss/postcss`) |
| `--app` | Uses the App Router (not the older Pages Router) |
| `--src-dir` | Puts your code under `src/` to keep the root directory clean |
| `--eslint` | Adds ESLint with Next.js-specific rules |

When prompted, accept the defaults for everything else (import alias `@/*`, etc.).

### What You Get

After scaffolding, your project looks like this:

```
cryptoflexllc/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx      # Root layout (wraps every page)
│       ├── page.tsx         # Homepage (/)
│       └── favicon.ico
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
└── .gitignore
```

### Verify It Works

```bash
cd cryptoflexllc
npm run dev
```

Open `http://localhost:3000`. You should see the default Next.js welcome page. That's our blank canvas.

> **Gotcha (Windows):** If `npx` gives you a "command not found" error, make sure Node.js is in your system PATH. Sometimes a fresh terminal window fixes it.

---

## Step 2: Initialize shadcn/ui

### What is shadcn/ui?

[shadcn/ui](https://ui.shadcn.com) is not a typical component library. Instead of `npm install some-library`, it copies actual component source code into your project under `src/components/ui/`. You own the code and can read it, modify it, or restyle it however you want.

Under the hood, the components are built on [Radix Primitives](https://www.radix-ui.com/), headless, accessible UI components. shadcn/ui wraps them with good defaults, Tailwind styling, and a consistent design system.

### Initialize

```bash
npx shadcn init
```

When prompted:

- **Style:** `new-york` (cleaner, more modern look than the default)
- **Base color:** `zinc` (neutral grays, we'll customize the accent color ourselves)
- **CSS variables:** `yes` (this is how we'll theme the whole site from one place)

This creates a `components.json` config file and sets up the path aliases:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

It also creates `src/lib/utils.ts` — a small utility for merging Tailwind classes:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This `cn()` function is the secret sauce that lets you combine Tailwind classes without conflicts (you'll see it everywhere in shadcn/ui components).

### Add the Components We Need

```bash
npx shadcn add button card badge separator sheet
```

This copies five component files into `src/components/ui/`:

| Component | What It's For |
|---|---|
| `button.tsx` | CTAs, form submissions, navigation buttons. Uses CVA (Class Variance Authority) for variant/size props. |
| `card.tsx` | Blog post cards, service cards, portfolio cards. Modular: Card, CardHeader, CardTitle, CardContent, CardFooter. |
| `badge.tsx` | Tags on blog posts, skill badges on About page. |
| `separator.tsx` | Horizontal dividers between sections. |
| `sheet.tsx` | Mobile hamburger menu drawer. Built on Radix Dialog. |

---

## Step 3: Install Dependencies

### The MDX Stack

We need several packages to make the blog system work:

```bash
npm install gray-matter next-mdx-remote @mdx-js/loader @mdx-js/react @next/mdx
```

Here's what each one does:

| Package | Purpose |
|---|---|
| `gray-matter` | Parses YAML frontmatter from `.mdx` files (title, date, tags, etc.) |
| `next-mdx-remote` | Renders MDX content on the server (this is what turns your Markdown into React components) |
| `@mdx-js/loader` | Webpack loader for MDX files |
| `@mdx-js/react` | React provider for MDX component resolution |
| `@next/mdx` | Next.js official MDX integration |

### Code Highlighting

For syntax-highlighted code blocks in blog posts:

```bash
npm install rehype-pretty-code shiki remark-gfm
```

| Package | Purpose |
|---|---|
| `rehype-pretty-code` | Transforms code blocks in MDX into beautifully highlighted HTML |
| `shiki` | The syntax highlighting engine (uses VS Code's TextMate grammars for accurate coloring) |
| `remark-gfm` | GitHub Flavored Markdown support (tables, strikethrough, task lists) |

### Typography

```bash
npm install @tailwindcss/typography
```

This Tailwind plugin provides the `prose` classes that make long-form text (blog posts) look great without styling every element individually. It handles headings, paragraphs, lists, links, code blocks, blockquotes, and more.

### All at Once

If you prefer one command:

```bash
npm install gray-matter next-mdx-remote @mdx-js/loader @mdx-js/react @next/mdx rehype-pretty-code shiki remark-gfm @tailwindcss/typography
```

---

## Step 4: Configure the Dark Theme

This is where the site gets its identity. We're going all-in on dark mode with a cyan accent color.

### Understanding Tailwind CSS v4

If you've used Tailwind before, v4 is a paradigm shift. There's **no `tailwind.config.ts` file**. All configuration lives directly in CSS using `@theme` blocks (it's actually simpler once you get used to it).

Here's the import structure at the top of `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));
```

- `@import "tailwindcss"` - loads all of Tailwind's utility classes
- `@import "tw-animate-css"` - animation utilities (used by shadcn/ui transitions)
- `@import "shadcn/tailwind.css"` - shadcn's base configuration
- `@plugin "@tailwindcss/typography"` - enables `prose` classes for blog content
- `@custom-variant dark` - defines how dark mode selectors work (class-based)

### The Theme Block

The `@theme inline` block maps CSS variables to Tailwind utility classes:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  /* ... and more */
}
```

This is what lets you write `bg-background` or `text-primary` in your Tailwind classes. The `@theme` block bridges the CSS variables to Tailwind's utility class system.

### The Color Palette

Here's where it gets interesting. All colors use the **OKLCH color space**:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.141 0.005 285.823);    /* Near-black with a blue tint */
  --foreground: oklch(0.985 0 0);               /* Almost white */
  --primary: oklch(0.75 0.15 195);              /* Cyan (the accent) */
  --primary-foreground: oklch(0.141 0.005 285.823); /* Dark text on cyan buttons */
  --card: oklch(0.178 0.005 285.823);           /* Slightly lighter than bg */
  --card-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);          /* Mid-tone gray */
  --muted-foreground: oklch(0.705 0.015 286.067); /* Lighter gray for secondary text */
  --border: oklch(1 0 0 / 10%);                 /* Semi-transparent white */
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.75 0.15 195);                 /* Focus rings match accent */
}
```

**Why OKLCH?** It's a perceptually uniform color space, meaning two colors with the same "lightness" value actually *look* equally bright to human eyes. Traditional hex/RGB doesn't have this property. OKLCH has three components:

- **L** (lightness): 0 = black, 1 = white
- **C** (chroma): How saturated the color is
- **H** (hue): The color itself (195 = cyan, 285 = purple-blue)

The key design decision: we only define one set of variables (dark mode) because the site is always in dark mode. If you wanted a light/dark toggle, you'd add a `.dark` selector with separate values.

### The Base Layer

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

This sets sensible defaults: all borders use the border color, focus outlines use the ring color, and the body gets the background and text colors (every component inherits these automatically).

---

## Step 5: Build the Layout (Nav + Footer)

### Root Layout

The root layout in Next.js wraps every page. Here's the code from `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CryptoFlex LLC | Chris Johnson",
    template: "%s | CryptoFlex LLC",
  },
  description:
    "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
  openGraph: {
    title: "CryptoFlex LLC | Chris Johnson",
    description:
      "Personal tech blog and portfolio of Chris Johnson — veteran, engineer, and cybersecurity professional.",
    url: "https://cryptoflexllc.com",
    siteName: "CryptoFlex LLC",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Key things to notice:

1. **`className="dark"` on `<html>`** - forces dark mode site-wide. No toggle needed.
2. **Geist fonts** - loaded via `next/font/google` which automatically optimizes them (self-hosted, no layout shift).
3. **`flex flex-col` + `flex-1`** - this is the sticky footer trick. The body is a flex column, and `<main>` grows to fill available space, pushing the footer to the bottom even on short pages.
4. **`title.template`** - any page that exports `title: "About"` in its metadata will render as "About | CryptoFlex LLC" in the browser tab.

### Navigation Component

`src/components/nav.tsx` is a client component (it needs `useState` and `usePathname`):

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];
```

The nav has two modes:

**Desktop (md and up):** Horizontal links with active state highlighting. The current page link turns cyan (`text-primary`).

```tsx
<nav className="hidden md:flex items-center gap-1">
  {links.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={`px-3 py-2 text-sm rounded-md transition-colors ${
        pathname === link.href
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {link.label}
    </Link>
  ))}
</nav>
```

**Mobile (below md):** A hamburger menu that opens a Sheet (drawer) from the right side. The Sheet component comes from shadcn/ui, built on Radix Dialog, so it handles focus trapping, escape key, click-outside, and screen reader announcements automatically.

The header itself uses a glassmorphism effect:

```tsx
<header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
```

- `sticky top-0` — stays visible while scrolling
- `bg-background/80` — 80% opacity background
- `backdrop-blur-md` — blurs the content behind it, creating the glass effect

### Footer Component

`src/components/footer.tsx` is a server component (no interactivity needed):

```tsx
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Column 1: Branding */}
          {/* Column 2: Navigation links */}
          {/* Column 3: Social/connect links */}
        </div>
        <Separator className="my-8" />
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CryptoFlex LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

The three-column grid collapses to a single column on mobile (`grid-cols-1` → `sm:grid-cols-3`). The year in the copyright updates automatically.

---

## Step 6: Build the Homepage

The homepage (`src/app/page.tsx`) has four sections:

### 1. Hero Section

`src/components/hero.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Gradient background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary tracking-wide uppercase">
            CryptoFlex LLC
          </p>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Hi, I'm <span className="text-primary">Chris Johnson</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Veteran turned cybersecurity professional. I write about tech
            projects, security, infrastructure, and the things I'm learning
            along the way.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/blog">Read the Blog</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">About Me</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

The gradient background creates a subtle glow effect without being distracting. The `blur-3xl` on the radial gradient softens it into a smooth ambient light.

The `asChild` prop on `Button` is a Radix pattern that means "don't render a `<button>`, render whatever child component I pass" (in this case, a `<Link>`). This gives you the button's styling on a Next.js link.

### 2. Latest Blog Posts

The homepage fetches the three most recent blog posts and renders them in a responsive grid:

```tsx
const posts = getAllPosts().slice(0, 3);

// ...

<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {posts.map((post) => (
    <BlogCard key={post.slug} post={post} />
  ))}
</div>
```

Because this is a **Server Component** (no `"use client"` directive), `getAllPosts()` runs on the server at build time. No API calls, no loading states: the data is already there when the HTML is generated.

### 3. About Teaser

A brief paragraph about the author with a "Read my full story" link to the About page.

### 4. Services Teaser

A short pitch for consulting services with a "View services" link.

Both teasers use `border-t border-border/40` to create subtle section separators.

---

## Step 7: Build the Blog System

This is the most technically interesting part of the site. We're building a file-based blog system where adding a new post is as simple as creating an `.mdx` file.

### The Blog Utility: `src/lib/blog.ts`

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image?: string;
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "1970-01-01",
      description: data.description ?? "",
      tags: data.tags ?? [],
      image: data.image,
      content,
    };
  });

  // Sort by date descending (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "1970-01-01",
    description: data.description ?? "",
    tags: data.tags ?? [],
    image: data.image,
    content,
  };
}
```

How it works:

1. Reads all `.mdx` files from `src/content/blog/`
2. Uses `gray-matter` to split each file into **frontmatter** (YAML metadata at the top) and **content** (the actual Markdown)
3. Derives the URL slug from the filename (`my-post.mdx` becomes `/blog/my-post`)
4. Sorts by date (newest first) for the listing page

This runs on the server at build time with no database, no API, no CMS. Your blog posts are version-controlled in Git alongside your code.

### Blog Listing Page: `src/app/blog/page.tsx`

```tsx
import { BlogCard } from "@/components/blog-card";
import { getAllPosts } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Thoughts on tech projects, cybersecurity, infrastructure, and
          things I'm learning.
        </p>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

### BlogCard Component: `src/components/blog-card.tsx`

```tsx
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/50 bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.description}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
```

The `group` / `group-hover:` pattern is a Tailwind trick: wrapping the whole card in a Link with `className="group"` means any child can react to the parent being hovered. The title turns cyan on card hover, and the border gets a subtle cyan tint.

`line-clamp-3` truncates the description to 3 lines with an ellipsis (clean and consistent regardless of description length).

### Blog Post Page: `src/app/blog/[slug]/page.tsx`

This is a **dynamic route**. The `[slug]` folder means Next.js creates a page for each blog post. Here's the full implementation:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary/90 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border">
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
```

Key concepts:

1. **`generateStaticParams()`** - tells Next.js which slugs to pre-build at compile time. Every `.mdx` file becomes a static HTML page.

2. **`generateMetadata()`** - each blog post gets its own `<title>` and Open Graph tags, so links shared on social media show the correct title and description.

3. **`MDXRemote`** from `next-mdx-remote/rsc` - renders the MDX content as React components on the server. No client-side JavaScript needed for the blog post body.

4. **The prose classes** - `prose-invert` makes the typography work on dark backgrounds. The customizations after it (`prose-a:text-primary`, `prose-pre:bg-zinc-900`, etc.) override specific elements to match our design system.

5. **`notFound()`** - if someone visits `/blog/nonexistent-slug`, Next.js serves the 404 page automatically.

### Writing a Blog Post

Create a file at `src/content/blog/my-first-post.mdx`:

```mdx
---
title: "My First Post"
date: "2026-02-07"
description: "A short description that appears on the blog listing page."
tags: ["Next.js", "Tutorial"]
---

# My First Post

Write your content here in Markdown. You can use all standard Markdown:

- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks with syntax highlighting
- Images, blockquotes, tables, etc.

## Subheadings Work Too

Everything between the `---` fences at the top is frontmatter (metadata).
Everything below is the post content.
```

The frontmatter fields:

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title (shown on cards and the post page) |
| `date` | Yes | ISO date string (determines sort order) |
| `description` | Yes | Shows on the blog listing card (keep it under 160 chars for SEO) |
| `tags` | Yes | Array of strings (rendered as badges) |
| `image` | No | Cover image URL (not currently displayed, but the field is ready) |

---

## Step 8: Build the Remaining Pages

### About Page (`src/app/about/page.tsx`)

The About page uses a 2/3 + 1/3 grid layout:

- **Left (2 columns):** bio text and a career timeline
- **Right (1 column):** photo placeholder and skills badges

The career timeline is a custom component built with Tailwind: a vertical line with dots at each career stage.

```tsx
<div className="flex gap-4">
  <div className="flex flex-col items-center">
    <div className="h-3 w-3 rounded-full bg-primary" />  {/* Cyan dot */}
    <div className="flex-1 w-px bg-border" />             {/* Vertical line */}
  </div>
  <div className="pb-6">
    <p className="font-medium text-foreground">Military Service</p>
    <p className="text-sm">Intelligence analyst, learned to think like an adversary...</p>
  </div>
</div>
```

Skills are rendered as `<Badge variant="secondary">` components. Adding a new skill is just adding a string to the array.

### Services Page (`src/app/services/page.tsx`)

Three service cards in a responsive grid. Each card has a title, description, and bullet list of specific offerings. The data is a simple array of objects at the top of the file:

```typescript
const services = [
  {
    title: "Security Consulting",
    description: "Security assessments, vulnerability analysis...",
    items: [
      "Security posture assessments",
      "Vulnerability analysis",
      "Security architecture review",
      "Incident response planning",
    ],
  },
  // ... more services
];
```

This pattern (data as a const array, rendered with `.map()`) keeps the component clean and makes it easy to add, remove, or reorder services.

### Portfolio Page (`src/app/portfolio/page.tsx`)

Same pattern as Services but using the `ProjectCard` component. Each project has a title, description, and array of tech tags displayed as badges.

`ProjectCard` has a nice touch: if the project has a `link` property, the entire card becomes a clickable `<a>` tag. If not, it's a static `<div>`.

```tsx
const Wrapper = project.link ? "a" : "div";
const wrapperProps = project.link
  ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
  : {};

return (
  <Wrapper {...wrapperProps} className="group block">
    <Card>...</Card>
  </Wrapper>
);
```

### Contact Page (`src/app/contact/page.tsx`)

The Contact page is a **client component** (`"use client"`) because it uses form state. Instead of a backend API, it opens the user's email client with pre-filled fields using a `mailto:` link:

```typescript
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const data = new FormData(form);
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const message = data.get("message") as string;

  const subject = encodeURIComponent(`Contact from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  window.location.href = `mailto:chris@cryptoflexllc.com?subject=${subject}&body=${body}`;
  setSubmitted(true);
}
```

This is a pragmatic choice with no backend needed, no spam concerns, and it works everywhere. The form fields use native `<input>` and `<textarea>` elements styled with Tailwind to match the shadcn/ui design system.

> **Why a separate layout?** The Contact page has its own `layout.tsx` with metadata. This is necessary because `page.tsx` is a client component (uses `useState`), and you can't export `metadata` from a client component in Next.js. The solution: put the metadata in a server component layout that wraps the client page.

---

## Step 9: SEO & Polish

### Metadata API

Next.js 15's Metadata API handles SEO tags declaratively. The root layout sets defaults:

```typescript
export const metadata: Metadata = {
  title: {
    default: "CryptoFlex LLC | Chris Johnson",
    template: "%s | CryptoFlex LLC",
  },
  description: "Personal tech blog and portfolio...",
  openGraph: {
    title: "CryptoFlex LLC | Chris Johnson",
    description: "...",
    url: "https://cryptoflexllc.com",
    siteName: "CryptoFlex LLC",
    locale: "en_US",
    type: "website",
  },
};
```

Each page can override by exporting its own `metadata`:

```typescript
// src/app/about/page.tsx
export const metadata: Metadata = {
  title: "About",  // Renders as "About | CryptoFlex LLC"
  description: "Chris Johnson — military veteran, cybersecurity professional...",
};
```

Blog posts generate metadata dynamically via `generateMetadata()`, including Open Graph `article` type and `publishedTime`.

### Custom 404 Page

`src/app/not-found.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-32 px-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go Home</Link>
      </Button>
    </section>
  );
}
```

Clean, on-brand, with a clear call to action. Centered vertically with generous padding.

---

## Step 10: Verify the Build

### Run the Production Build

```bash
npm run build
```

A successful build outputs a route table showing every page:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    xxx B    xxx kB
├ ○ /about                               xxx B    xxx kB
├ ○ /blog                                xxx B    xxx kB
├ ● /blog/[slug]                         xxx B    xxx kB
│   └ /blog/building-with-claude-code
├ ○ /contact                             xxx B    xxx kB
├ ○ /not-found                           xxx B    xxx kB
├ ○ /portfolio                           xxx B    xxx kB
└ ○ /services                            xxx B    xxx kB
```

Legend:
- **○** - Static (pre-rendered at build time)
- **●** - SSG (static generation with dynamic params)

Every route should be either ○ or ●. If you see **λ** (server-rendered on every request), something is forcing dynamic rendering that shouldn't be.

### Preview Locally

```bash
npm run dev
```

Open `http://localhost:3000` and check:

1. Homepage loads with hero, blog cards, and teaser sections
2. Nav links work and highlight the current page
3. Blog listing shows all posts
4. Individual blog posts render MDX content correctly
5. Mobile hamburger menu opens and closes
6. 404 page works (try `/nonexistent`)
7. All pages are responsive at different screen widths

---

## Step 10.5: Testing

This project uses [Vitest](https://vitest.dev/) for fast, modern unit and integration testing. The test setup is configured for Next.js with React 19 and requires 80% minimum code coverage.

### Vitest Setup

Vitest is configured in `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",           // Browser-like environment
    globals: true,                  // Global test functions (describe, it, expect)
    setupFiles: ["./src/__tests__/setup.ts"],  // Runs before tests
    include: ["src/**/*.test.{ts,tsx}"],  // Find tests in src/
    coverage: {
      provider: "v8",               // Coverage provider
      reporter: ["text", "text-summary"],
      include: ["src/lib/**", "src/app/api/**", "src/components/**"],
      exclude: [
        "src/__tests__/setup.ts",
        "src/**/*.test.*",
        "src/components/ui/**",     // shadcn/ui components excluded
        "src/components/mdx/**",    // MDX wrapper components excluded
        "src/lib/analytics-types.ts",
      ],
      thresholds: {
        statements: 80,  // Minimum coverage requirements
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Use @ import alias
    },
  },
});
```

Key settings:
- **jsdom environment**: Simulates a browser DOM for component testing
- **globals: true**: No need to import `describe`, `it`, `expect` in each test
- **coverage thresholds**: Tests fail if coverage drops below 80%

### Test Scripts

Add these to your `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest",           // Run tests once
    "test:watch": "vitest --watch",  // Watch mode: re-run on file changes
    "test:coverage": "vitest --coverage",  // Generate coverage report
    "test:ui": "vitest --ui"    // (Optional) Visual test dashboard
  }
}
```

Usage:

```bash
# Run all tests once
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Generate and display coverage report
npm run test:coverage

# Watch mode with visual UI (if vitest UI package installed)
npm run test:ui
```

### Test File Conventions

Tests are colocated with their source files for easier navigation. Each file has a corresponding `.test.ts` or `.test.tsx`:

```
src/
├── lib/
│   ├── blog.ts           # Source file
│   └── blog.test.ts      # Tests for blog.ts
│   ├── utils.ts          # Source file
│   └── utils.test.ts     # Tests for utils.ts
├── components/
│   ├── hero.tsx          # Source file
│   └── hero.test.tsx     # Tests for hero.tsx
│   ├── blog-card.tsx     # Source file
│   └── blog-card.test.tsx # Tests for blog-card.tsx
└── app/
    └── api/
        ├── route.ts      # API endpoint
        └── route.test.ts # API tests
```

Colocating tests makes them easy to find and encourages keeping tests up to date as code changes. When a file moves, its test moves with it.

### Mocking Patterns

Vitest provides powerful mocking utilities for dependencies, modules, and asynchronous operations:

#### Module Mocking with `vi.mock()`

Mock an entire module before it's imported:

```typescript
import { describe, it, expect, vi } from "vitest";
import * as fs from "fs";

vi.mock("fs");

describe("blog utility", () => {
  it("reads files from the correct directory", () => {
    const mockRead = vi.mocked(fs.readFileSync);
    mockRead.mockReturnValue("---\ntitle: Test\n---\n# Content");

    // Test code that uses fs.readFileSync
    expect(mockRead).toHaveBeenCalled();
  });
});
```

#### Mocking with `vi.mocked()`

After mocking a module, use `vi.mocked()` to get a fully typed mock:

```typescript
vi.mock("@/lib/blog");
import { getAllPosts } from "@/lib/blog";

const mockGetAllPosts = vi.mocked(getAllPosts);
mockGetAllPosts.mockReturnValue([
  { slug: "test", title: "Test Post", content: "..." },
]);
```

This is safer than manual type casting and preserves TypeScript types.

#### Mocking with Tagged Template Literals

For complex mock data, use tagged template literals to keep tests readable:

```typescript
const mockPost = (content: string): BlogPost => ({
  slug: "test-post",
  title: "Test Post",
  date: "2026-02-14",
  description: "A test post",
  tags: ["test"],
  content,
});

it("parses blog post frontmatter", () => {
  const post = mockPost(`
    # Heading
    Some paragraph text.
  `);

  expect(post.content).toContain("Heading");
});
```

#### Mocking Async Operations

Mock async functions to avoid real API calls:

```typescript
vi.mock("@/lib/api");
import { fetchData } from "@/lib/api";

describe("data fetching", () => {
  it("handles successful responses", async () => {
    vi.mocked(fetchData).mockResolvedValue({ id: 1, name: "Test" });

    const result = await fetchData();
    expect(result.name).toBe("Test");
  });

  it("handles errors", async () => {
    vi.mocked(fetchData).mockRejectedValue(new Error("Network error"));

    await expect(fetchData()).rejects.toThrow("Network error");
  });
});
```

#### Spy on Implementation Without Mocking

Use `vi.spyOn()` to track calls without replacing the function:

```typescript
import * as math from "@/lib/math";

describe("calculations", () => {
  it("calls add correctly", () => {
    const spy = vi.spyOn(math, "add");

    math.add(2, 3);

    expect(spy).toHaveBeenCalledWith(2, 3);
    expect(spy).toHaveReturnedWith(5);  // Spy doesn't block execution
  });
});
```

### Coverage Thresholds

The project requires **80% minimum coverage** across statements, branches, functions, and lines. When you run tests:

```bash
npm run test:coverage
```

You'll see output like:

```
File                           | % Stmts | % Branches | % Funcs | % Lines
---------|---------|-----------|---------|-----------|
All files|    82.5 |      75.2 |     88.3 |      82.5
src/lib/blog.ts                   95.2       100       100       95.2
src/components/hero.tsx           76.3        60        75       76.3
```

If coverage drops below 80%, the test run fails. To achieve and maintain good coverage:

1. Test happy paths (main user flows)
2. Test error cases (invalid input, API failures)
3. Test edge cases (empty lists, null values, boundary conditions)
4. Test user interactions (clicks, form submissions)

### Example Test Files

#### Testing a Utility: `src/lib/blog.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog utility", () => {
  describe("getAllPosts", () => {
    it("returns posts sorted by date (newest first)", () => {
      const posts = getAllPosts();
      const dates = posts.map(p => new Date(p.date).getTime());

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
      }
    });

    it("returns empty array if no posts exist", () => {
      const posts = getAllPosts();
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe("getPostBySlug", () => {
    it("returns post by slug", () => {
      const post = getPostBySlug("example-post");

      expect(post).toBeDefined();
      if (post) {
        expect(post.slug).toBe("example-post");
      }
    });

    it("returns undefined for nonexistent slug", () => {
      const post = getPostBySlug("nonexistent");
      expect(post).toBeUndefined();
    });
  });
});
```

#### Testing a Component: `src/components/blog-card.test.tsx`

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/blog";

describe("BlogCard", () => {
  const mockPost: BlogPost = {
    slug: "test-post",
    title: "Test Post Title",
    date: "2026-02-14",
    description: "This is a test post description.",
    tags: ["testing", "vitest"],
    content: "# Content",
  };

  it("renders post title", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText(/February 14, 2026/)).toBeInTheDocument();
  });

  it("renders tags as badges", () => {
    render(<BlogCard post={mockPost} />);
    expect(screen.getByText("testing")).toBeInTheDocument();
    expect(screen.getByText("vitest")).toBeInTheDocument();
  });

  it("links to the blog post", () => {
    render(<BlogCard post={mockPost} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/test-post");
  });
});
```

#### Testing an API Route: `src/app/api/example/route.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/example", () => {
  it("returns 200 and data", async () => {
    const request = new Request("http://localhost:3000/api/example");
    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("message");
  });
});
```

### Best Practices

1. **Test behavior, not implementation**: Write tests that verify "what the code does," not "how it does it." This makes tests more resilient to refactoring.

2. **Use descriptive test names**: `it("sorts posts by date newest first")` is clearer than `it("works")`.

3. **Arrange-Act-Assert (AAA) pattern**:
   ```typescript
   it("calculates total price", () => {
     // Arrange
     const items = [{ price: 10 }, { price: 20 }];

     // Act
     const total = calculateTotal(items);

     // Assert
     expect(total).toBe(30);
   });
   ```

4. **Keep mocks simple**: Only mock what the test needs. Leave other dependencies real when possible.

5. **Test error paths**: Don't just test the happy path. What happens when data is missing or invalid?

6. **Use `vi.mocked()` for type safety**: It's better than manual casting and catches type errors at compile time.

---

## Step 11: Deploy

### Push to GitHub

```bash
git init
git add .
git commit -m "feat: Build CryptoFlex LLC website"
gh repo create chris2ao/cryptoflexllc --public --source=. --push
```

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your `chris2ao/cryptoflexllc` GitHub repo
4. Vercel auto-detects Next.js — accept all defaults
5. Click Deploy

That's it. Vercel handles the build, CDN, SSL, and deployment (every push to `main` triggers a new deployment automatically).

### Custom Domain (Optional)

If you have a domain (like `cryptoflexllc.com`):

1. In Vercel project settings → Domains → Add domain
2. At your domain registrar (Squarespace, Namecheap, etc.), add a CNAME record:
   - **Name:** `www` (or `@` for apex domain)
   - **Value:** `cname.vercel-dns.com`
3. Vercel automatically provisions an SSL certificate

> **DNS propagation** can take a few minutes to a few hours. Be patient, and if it doesn't work immediately, give it time.

---

## Project Structure Reference

Here's the complete file tree with descriptions:

```
cryptoflexllc/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx            # About page — bio, timeline, skills
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx        # Dynamic blog post — MDX rendering
│   │   │   └── page.tsx            # Blog listing — grid of all posts
│   │   ├── contact/
│   │   │   ├── layout.tsx          # Metadata wrapper (client page workaround)
│   │   │   └── page.tsx            # Contact form — mailto: approach
│   │   ├── portfolio/
│   │   │   └── page.tsx            # Portfolio — project cards
│   │   ├── services/
│   │   │   └── page.tsx            # Services — consulting offerings
│   │   ├── globals.css             # Theme, colors, Tailwind v4 config
│   │   ├── layout.tsx              # Root layout — Nav, Footer, fonts, meta
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── page.tsx                # Homepage — hero, posts, teasers
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/
│   │   │   ├── badge.tsx           # shadcn/ui Badge
│   │   │   ├── button.tsx          # shadcn/ui Button (variants + sizes)
│   │   │   ├── card.tsx            # shadcn/ui Card (modular)
│   │   │   ├── separator.tsx       # shadcn/ui Separator
│   │   │   └── sheet.tsx           # shadcn/ui Sheet (mobile drawer)
│   │   ├── blog-card.tsx           # Blog post card for listings
│   │   ├── footer.tsx              # Site footer (3-column grid)
│   │   ├── hero.tsx                # Homepage hero section
│   │   ├── nav.tsx                 # Sticky nav + mobile hamburger
│   │   └── project-card.tsx        # Portfolio project card
│   ├── content/
│   │   └── blog/
│   │       └── *.mdx               # Blog posts (add more here!)
│   └── lib/
│       ├── blog.ts                 # Blog utility (getAllPosts, getPostBySlug)
│       └── utils.ts                # cn() class merge utility
├── public/                         # Static assets (images, etc.)
├── components.json                 # shadcn/ui configuration
├── eslint.config.mjs               # ESLint rules
├── next.config.ts                  # Next.js config (minimal)
├── package.json                    # Dependencies and scripts
├── postcss.config.mjs              # PostCSS + Tailwind v4
└── tsconfig.json                   # TypeScript config
```

### Dependency Reference

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.1.6 | React framework with SSR, routing, optimization |
| `react` / `react-dom` | 19.2.3 | UI library |
| `tailwindcss` | ^4 | Utility-first CSS framework (v4 — CSS-based config) |
| `@tailwindcss/postcss` | ^4 | PostCSS integration for Tailwind v4 |
| `@tailwindcss/typography` | ^0.5.19 | `prose` classes for long-form content |
| `tw-animate-css` | ^1.4.0 | CSS animation utilities for transitions |
| `shadcn` | ^3.8.4 | CLI for adding UI components |
| `radix-ui` | ^1.4.3 | Accessible headless UI primitives |
| `lucide-react` | ^0.563.0 | SVG icon library |
| `class-variance-authority` | ^0.7.1 | Variant management for component props |
| `clsx` | ^2.1.1 | Conditional class name utility |
| `tailwind-merge` | ^3.4.0 | Intelligent Tailwind class merging |
| `gray-matter` | ^4.0.3 | YAML frontmatter parser |
| `next-mdx-remote` | ^5.0.0 | Server-side MDX rendering |
| `@mdx-js/loader` | ^3.1.1 | Webpack MDX loader |
| `@mdx-js/react` | ^3.1.1 | React MDX provider |
| `@next/mdx` | ^16.1.6 | Next.js MDX integration |
| `rehype-pretty-code` | ^0.14.1 | Syntax highlighting for code blocks |
| `shiki` | ^3.22.0 | Syntax highlighting engine (VS Code grammars) |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown |
| `typescript` | ^5 | Type safety |

---

## What's Next

This is a solid foundation. Here are some directions to take it:

### More Blog Posts

The easiest way to grow the site: just drop `.mdx` files into `src/content/blog/`. No code changes needed. Write about what you know, what you're learning, what you're building.

### Replace Placeholder Content

- Add a real photo to the About page (replace the gray box)
- Fill in the LinkedIn and GitHub URLs in the footer
- Add links to portfolio projects
- Customize the services to match your actual offerings

### Possible Enhancements

- **RSS feed** - generate an XML feed from your MDX posts
- **Search** - client-side search across blog posts (Fuse.js or similar)
- **Analytics** - Vercel Analytics, Plausible, or Umami for privacy-friendly tracking
- **Real contact form** - replace `mailto:` with a form service (Formspree, Resend)
- **Image optimization** - use Next.js `<Image>` component for blog post images
- **Code copy button** - add a "copy to clipboard" button on code blocks
- **Table of contents** - auto-generate a TOC from blog post headings
- **Reading time** - calculate and display estimated reading time
- **Related posts** - suggest posts with matching tags at the bottom of each post

### The Bigger Picture

This site is a living project. Every new blog post, every tweak to the design, every feature addition is an opportunity to learn more about Next.js, React, and modern web development. The code is open source, so fork it, modify it, and make it yours.

---

*Built with [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), and [Claude Code](https://docs.anthropic.com/en/docs/claude-code).*
