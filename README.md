# CryptoFlex LLC

Personal tech blog and professional portfolio for Chris Johnson — veteran, cybersecurity professional, and lifelong tinkerer.

**Live site:** [cryptoflexllc.com](https://cryptoflexllc.com)

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.1.6 | React framework (App Router, SSR, static generation) |
| [React](https://react.dev) | 19.2.3 | UI library |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | Utility-first CSS (v4 — config-in-CSS via `@theme`) |
| [shadcn/ui](https://ui.shadcn.com) | New York style | UI components (Button, Card, Badge, Sheet, Separator) |
| [MDX](https://mdxjs.com) | via next-mdx-remote | Blog posts in Markdown + JSX |
| [TypeScript](https://typescriptlang.org) | 5.x | Type safety |
| [Vercel](https://vercel.com) | — | Hosting & deployment |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/chris2ao/cryptoflexllc.git
cd cryptoflexllc

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build (static generation) |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── about/page.tsx          # Bio, career timeline, skills
│   ├── blog/
│   │   ├── [slug]/page.tsx     # Dynamic blog post (MDX rendering)
│   │   └── page.tsx            # Blog listing
│   ├── contact/
│   │   ├── layout.tsx          # Metadata (client component workaround)
│   │   └── page.tsx            # Contact form (mailto:)
│   ├── portfolio/page.tsx      # Project cards
│   ├── services/page.tsx       # Consulting services
│   ├── globals.css             # Theme, dark mode, Tailwind v4 config
│   ├── layout.tsx              # Root layout (Nav, Footer, fonts, SEO)
│   ├── not-found.tsx           # Custom 404
│   └── page.tsx                # Homepage (hero, blog previews, CTAs)
├── components/
│   ├── ui/                     # shadcn/ui components (owned source code)
│   ├── blog-card.tsx           # Blog post card
│   ├── footer.tsx              # 3-column footer
│   ├── hero.tsx                # Homepage hero section
│   ├── nav.tsx                 # Sticky nav + mobile hamburger menu
│   └── project-card.tsx        # Portfolio project card
├── content/
│   └── blog/                   # Blog posts (*.mdx files)
└── lib/
    ├── blog.ts                 # Blog utilities (getAllPosts, getPostBySlug)
    └── utils.ts                # cn() class merge helper
```

## Blog System

Blog posts are `.mdx` files in `src/content/blog/`. To add a new post:

1. Create a file like `src/content/blog/my-new-post.mdx`
2. Add frontmatter at the top:

```mdx
---
title: "My New Post"
date: "2026-02-07"
description: "A short description for the listing page."
tags: ["Tag1", "Tag2"]
---

Your post content goes here. Standard Markdown works.
```

3. The post appears automatically at `/blog/my-new-post`

No database, no CMS — posts are files in the repo, version-controlled with Git.

### Frontmatter Fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `date` | Yes | ISO date string (determines sort order) |
| `description` | Yes | Shown on blog listing cards |
| `tags` | Yes | Array of strings (rendered as badges) |
| `image` | No | Cover image URL (reserved for future use) |

## Design

- **Dark-first** — always dark mode, no toggle
- **Cyan accent** — OKLCH `(0.75, 0.15, 195)` for primary color
- **Geist fonts** — Sans + Mono, loaded via `next/font`
- **Glassmorphism nav** — sticky header with backdrop blur
- **Responsive** — mobile-first with hamburger drawer

## Deployment

The site is deployed on [Vercel](https://vercel.com) with automatic deployments on push to `main`.

**Custom domain setup:**
1. Add domain in Vercel project settings
2. Create CNAME record at your registrar pointing to `cname.vercel-dns.com`
3. Vercel provisions SSL automatically

## Build Guide

For a complete, step-by-step walkthrough of how this site was built from scratch, see **[BUILD-GUIDE.md](BUILD-GUIDE.md)**.

## License

MIT
