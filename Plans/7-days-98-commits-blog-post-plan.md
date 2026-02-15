# Plan: "7 Days, 98 Commits" - One Comprehensive Blog Post

## Context

Chris built cryptoflexllc.com from scratch in 7 days (Feb 7-14, 2026) using Claude Code: 98 commits, 24 PRs, 17 blog posts, 410+ tests at 98% coverage, full production stack. This is **one blog post** telling that complete story as a fun, accessible journey. Heavy on mistakes, lessons learned, wit, puns, and memes. Fully accessible to non-technical readers via `<Info>` explainer boxes.

---

## Origin Story (for the opening section)

Chris is an early ChatGPT adopter (GPT-3.5 research preview). Works in tech, self-described nerd. Used practically every AI tool: ChatGPT, Claude, Perplexity, Copilot, custom in-house tools, Ollama local models, OpenRouter cloud models. Early ChatGPT felt like "a really powerful search engine." Fast forward to now and AI is in everything, even refrigerators ("if you feel attacked, I'm sorry").

**The inciting moment**: A colleague demoed Claude Code, building a full repeatable workflow with unit testing and deploying to prod in about an hour. Something that normally takes days. Chris's reaction: "What the hell?! I need to learn this." Downloaded Claude Code on a Friday night and started the journey.

**Tone directives**: Wit, puns, and memes throughout. Self-deprecating humor about mistakes. The post should feel like a friend telling you about their wild week over coffee, not a tutorial.

---

## The Post

- **File**: `src/content/blog/7-days-98-commits-building-a-production-site-with-ai.mdx`
- **Title**: "7 Days, 98 Commits: Building a Production Website with AI"
- **Reading Time**: ~25 min read
- **Tags**: `["Journey", "Claude Code", "AI", "Next.js", "Web Development"]`
- **Accessibility**: Full. Every technical concept (Git, commits, CI/CD, API, database, etc.) gets an `<Info>` callout box with a plain-language explanation.

### Post Structure

```
## Opening Hook
  - The "what the hell" moment watching the colleague demo
  - "I downloaded Claude Code on a Friday night like a normal person"
  - Thesis: In 7 days, I went from FTP mindset to production-grade site
  - GIF: "I have no idea what I'm doing" dog at computer

## The Background: My AI Journey So Far
  - Early ChatGPT adopter (GPT-3.5 research preview)
  - "It felt like a really powerful search engine"
  - Used everything: Claude, ChatGPT, Perplexity, Copilot, Ollama, OpenRouter
  - AI is now in everything including refrigerators (joke)
  - The colleague demo that changed everything
  - GIF: mind-blown reaction

## Day 1: From Zero to Live (Feb 7)
  <Info> boxes: What is Next.js? What is Vercel? What is CI/CD?
  - First create-next-app, first build, first deploy
  - "Wait... it's live? On the internet? Already?"
  - Mistakes: old-school FTP mindset, PowerShell gotchas on Windows
  - GIF: celebration / "it works!"
  - Diagram: JourneyTimelineDiagram (7-day overview)

## Day 2: Analytics and Paranoia (Feb 8)
  <Info> boxes: What is a database? What is an API?
  - "The site is live. So who's looking at it?" (spoiler: bots)
  - Custom analytics with Neon Postgres, IP OSINT panel
  - Mistake: built a whole dashboard with zero authentication
  - First security hardening: cookie auth, rate limiting
  - GIF: "this is fine" meme

## Day 3: Design System and Self-Sabotage (Feb 9-10)
  <Info> box: What is a WAF (Web Application Firewall)?
  - MDX design system: callouts, badges, SVG diagrams
  - 4 commits to size a logo correctly ("the logo saga")
  - WAF rules that blocked own site (routes/src vs rules/route typo)
  - GIF: panic/alarm when site goes down

## Day 4: Dear Subscriber (Feb 11)
  <Info> boxes: What is HMAC? What is a cron job?
  - Newsletter subscription system from scratch
  - SEO deep-dive (metadata, sitemaps, structured data)
  - WAF blocking new API routes... again
  - GIF: "you've got mail" or frustrated email meme

## Day 5: The 5-PR Welcome Email (Feb 12)
  <Info> box: What is a CVE (security vulnerability)?
  - Subscriber-only comments system
  - The comedy of errors: 5 pull requests to send ONE welcome email
    - PR 20: Fix a CVE first
    - PR 21: Build the endpoint
    - PR 22: GET vs POST confusion
    - PR 23: Firewall blocks it (again!)
    - PR 24: Move endpoint, finally works
  - GIF: facepalm + victory dance
  - Diagram: WelcomeEmailSagaDiagram (comic-strip flowchart)

## Day 6: The Reckoning (Feb 13)
  <Info> boxes: What is test coverage? What is a security audit?
  - 410 tests, 98% coverage ("ship it is not a testing strategy")
  - AI newsletter intros via Claude Haiku
    - The model ID that doesn't exist (claude-haiku-4-5-latest = 404)
  - 4-agent security sprint: 60 findings in 30 minutes
  - vi.mock gotcha (arrow functions can't be new'd)
  - GIF: shocked reaction (60 findings)

## Day 7: Polish and Ship (Feb 14)
  - RSS feeds, GA4 custom events, UTM tracking
  - Rate limit cron gotcha (Hobby plan = daily, not every 6 hours)
  - Replacing broken images with Giphy GIFs (meta!)
  - Valentine's Day launch
  - GIF: celebration / finish line
  - Diagram: BeforeAfterArchitectureDiagram (Day 1 vs Day 7)

## What I Learned (Top Takeaways)
  - Free infrastructure is insanely capable (Vercel + Neon + Claude)
  - Your WAF will block you more than it blocks attackers
  - Write tests before you think you need them
  - AI doesn't replace knowing what you want to build
  - The best debugging tool is a good night's sleep (which I didn't get)

## The Week in Numbers (summary table)
  | 98 commits | 24 PRs | 17 blog posts | 410+ tests |
  | 98% coverage | 60 security findings fixed | 7 days | 1 mind blown |

## Footer
  Previous/Next navigation + series link
```

---

## Agent Team

| Agent | Role | Model | What They Do |
|-------|------|-------|-------------|
| **orchestrator** | Team Lead | opus | Coordinates, integrates, final assembly |
| **researcher** | Data Miner | haiku | Mines git log, commits, PRs for stories, mistakes, stats per day |
| **writer** | Content Creator | sonnet | Writes the full blog post from research brief |
| **tech-editor** | Quality Gate | sonnet | Reviews technical accuracy, tone consistency, em-dash compliance, accessibility, pun quality |
| **ux-designer** | Visual Designer | sonnet | Creates 3 SVG diagrams, selects ~10 Giphy GIFs, reviews visual flow and spacing |

### Workflow

```
Phase 1: Research + Design (parallel)
  researcher -> comprehensive research brief with key stories, mistakes, stats per day
  ux-designer -> 3 SVG diagram components + ~10 Giphy GIF selections with URLs

Phase 2: Writing
  writer -> full blog post draft (~4,000-6,000 words) from research brief + GIF manifest
           Style ref: building-with-claude-code.mdx (uses all MDX components)
           Tone: witty, punny, self-deprecating, accessible

Phase 3: Review (parallel)
  tech-editor -> reviews for:
    - Technical accuracy (commit counts, feature descriptions, timeline)
    - No em dashes (firm style rule)
    - <Info> boxes present for all technical concepts
    - Puns land, tone is consistent, accessible to non-tech
    - Code snippets have correct language annotations
  ux-designer -> reviews for:
    - GIF placement at emotional peaks (not random)
    - Diagram integration points make sense
    - Visual rhythm (not too text-heavy between visual elements)
    - Alt text on all images

Phase 4: Revisions
  writer -> applies feedback from both reviewers

Phase 5: Integration
  orchestrator -> register diagram components, update nav chain, npm run build
```

### Context Window Management

One post = manageable context. No batching needed.
- Research brief: ~500 lines
- Style reference (1 existing post): ~500 lines
- GIF manifest + diagram names: ~50 lines
- Total per agent: ~1,050 lines, well within limits

---

## New SVG Diagram Components

**File**: `src/components/mdx/diagrams-journey.tsx`

Pattern reference: `src/components/mdx/diagrams.tsx` (existing file with DiagramWrapper, viewBox sizing, Tailwind classes)

### 1. `JourneyTimelineDiagram`
- Horizontal timeline with 7 day-nodes on a line
- Each node: circle with day number + 2-word label below
- Labels: "First Deploy", "Analytics", "Design System", "Newsletter", "Comments", "Testing", "Polish"
- Cyan accent color for nodes, dark background
- ~100 lines SVG

### 2. `WelcomeEmailSagaDiagram`
- Comic-strip style flowchart of the 5-PR journey to send one email
- 5 steps in sequence, each with: PR number, title, outcome icon (checkmark or X)
- PR 20: "Fix CVE" (green check), PR 21: "Build endpoint" (green check), PR 22: "POST -> GET" (yellow warning), PR 23: "WAF blocks it" (red X), PR 24: "Move endpoint" (green check + party emoji)
- The comedy centerpiece of the post
- ~120 lines SVG

### 3. `BeforeAfterArchitectureDiagram`
- Split view: "Day 1" left vs "Day 7" right
- Day 1: simple 3-box stack (Next.js -> Vercel -> Browser)
- Day 7: full architecture (Neon Postgres, Newsletter/Cron, Comments, Analytics, WAF, 410 Tests, AI Intros, RSS, GA4)
- Visual "wow" for the conclusion section
- ~120 lines SVG

---

## GIF Strategy (~10 GIFs)

Placement at emotional peaks, not random decoration:

| Section | Mood | Search Terms |
|---------|------|-------------|
| Opening hook | Clueless excitement | "dog computer", "no idea what doing" |
| Background/colleague demo | Mind blown | "mind blown", "shocked", "what" |
| Day 1 deploy | It works! | "celebration", "it works", "magic" |
| Day 2 security holes | Denial | "this is fine", "everything fine fire" |
| Day 3 WAF blocks site | Panic | "panic", "alarm", "oh no" |
| Day 4 newsletter | Success | "you got mail", "email excited" |
| Day 5 facepalm (PR saga) | Frustration | "facepalm", "are you kidding me" |
| Day 5 email finally works | Relief | "victory dance", "finally" |
| Day 6 findings | Shock | "shocked", "surprised", "jaw drop" |
| Day 7 / Closing | Triumph | "mic drop", "celebration", "finish line" |

All use stable Giphy CDN: `https://media.giphy.com/media/{ID}/giphy.gif`

---

## Files to Create

1. `src/content/blog/7-days-98-commits-building-a-production-site-with-ai.mdx` (~4,000-6,000 words)
2. `src/components/mdx/diagrams-journey.tsx` (3 diagram components, ~340 lines)

## Files to Modify

1. `src/components/mdx/index.ts` - Export 3 new diagram components
2. `src/app/blog/[slug]/page.tsx` - Register diagrams in MDXRemote components prop
3. `src/content/blog/mining-your-claude-code-sessions.mdx` - Add "Next" link to new post

---

## Navigation Chain Update

Current last post: `mining-your-claude-code-sessions.mdx` (no Next link)

New chain:
```
...mining-your-claude-code-sessions -> 7-days-98-commits (end of series)
```

New post's footer:
```
Previous: Mine Over Matter (/blog/mining-your-claude-code-sessions)
```

Update mining post's footer to add:
```
Next: 7 Days, 98 Commits (/blog/7-days-98-commits-building-a-production-site-with-ai)
```

Post date: `2026-02-15T08:00:00`

---

## Verification

1. `npm run build` - All blog posts compile successfully
2. `npm run test` - Existing 410+ tests still pass
3. `npm run dev` - New post renders, diagrams display, GIFs load
4. Navigation chain: Previous/Next links work both directions
5. No em dashes anywhere in new content
6. All `<Info>`, `<Tip>`, `<Warning>` callouts render correctly
7. All Giphy URLs load (not 404)
