# Cover Graphics Standards

Every post on cryptoflexllc.com gets a cover infographic: hand-authored
HTML rendered to PNG with headless Chrome. This document is the contract
for those covers, the counterpart of `editorial-diagram-standards.md` for
inline diagrams. The pipeline agent is `~/.claude/agents/brand-graphics.md`
(invoked by `/brand-graphics` and by the blog captain's Cover Graphic
phase); this file is the repo-side source of truth it reads first.

## The contract

| Property | Value |
|---|---|
| Design canvas | 1376x768 CSS px, `html, body { overflow: hidden }` |
| Render output | exactly 2752x1536 px (`--force-device-scale-factor=2`) |
| Crop-safe zone | nothing legible within 84 CSS px of the left or right edge (cards and the homepage lead story crop to 16:10) |
| PNG | `public/blog/<slug>/infographic.png` |
| HTML source | `content-assets/covers/<slug>/cover.html` (gitignored, kept for re-renders; edits go to the HTML, never a regenerate) |
| Frontmatter | `coverImage: /blog/<slug>/infographic.png` and a thorough `coverImageAlt` |

## What every cover shares (branding, and only branding)

- Brand tokens from `src/app/globals.css` `:root`: background, surface-1/2,
  fg tiers, primary teal, success, warning, destructive, border tiers.
- The type trio: Space Grotesk for headings, chips, and labels; Source
  Serif 4 for body copy; JetBrains Mono for commands, paths, and code.
- House motifs: diagonal hatch canvas, one soft teal radial glow in a
  corner, chip badges with accent borders, terminal blocks with three
  traffic-light dots, square accent dot before uppercase mono kickers.
- Header: series chip (`LEDGERLY`, `SECURITY ENGINEERING`) plus a
  `PART N · SUBTITLE` chip when the post belongs to a series.
- Footer strip: `CRYPTOFLEX LLC // FROM THE WORKSHOP` left, uppercase
  mono stack tags right.

That is the whole shared skeleton. Everything between the header and the
footer is bespoke to the post.

## The uniqueness rule

Two covers must never share a composition. Readers see covers side by
side on the journal, the series page, and the homepage; a repeated layout
with swapped words reads as a template, not a piece about the post.

1. **Concept first.** Before writing HTML, state the concept in one
   sentence: what is the dominant visual and why is it the article's
   story? The dominant element depicts the post's central mechanism
   (a transcript, a fan-out, a comparison, a timeline, a wire, a before
   and after), not a summary of its statistics.
2. **Check the register** below. If the concept's dominant element or
   grid matches an existing row, change it.
3. **Stat tiles are retired.** The 2x2 grid of `panel-num / panel-label /
   panel-desc` tiles was used four times before this rule existed. It is
   no longer available as a dominant element. Numbers can still appear
   as callouts inside a concept-driven layout.
4. **Copy the CSS foundation, not the layout.** Reading a recent
   `cover.html` for the page setup, font links, hatch, glow, chips, and
   footer is expected. Cloning its content structure is the failure mode
   this rule exists to stop.
5. **Report the concept.** The agent's report and the register entry
   name the concept, so the next cover can be checked against it.

## Copy on the cover

- **No metrics roll call.** A kicker, deck, stat line, or tile row made
  of inventory numbers (post counts, tests passing, files changed, lines,
  insertions, coverage percentages, version numbers presented as
  achievements) is the AI-flourish framing the owner has rejected
  ("91 POSTS · 812 TESTS PASSING · KNOWN VULNS 17→12 · NEXT.JS 16.3.0").
  Every line of copy carries the story: what was found, what it means,
  what changed. A number earns a place only when the argument turns on it
  (1,054 rows wrongly excluded; 46 tests that stayed green through a
  full rebuild), and it appears as a callout inside the concept, said in
  words, not as one entry in a stacked list of counts.
- The kicker under the header is a thesis or a contrast, in words.
  Stack tags in the footer strip (NEXT.JS 16 · SQLITE · MCP) are the one
  place a bare list of names belongs.
- Cover copy follows the same voice profile as the post: no em dashes,
  no hype labels, no telling the reader how to feel.

## Composition register

Append one row per cover. Concept and dominant element are what the next
designer checks against.

| Slug | Concept | Dominant element |
|---|---|---|
| cramdex-open-source-sans-study-app | Feature stat tiles (origin of the retired pattern) | 2x2 stat tiles + punchline |
| building-ledgerly-v1 | Feature stat tiles (retired pattern) | 2x2 stat tiles: import, dashboard, chat, reports |
| home-network-mission-control-upgrading-my-home-siem | The status board that lied: four signals that reported green beside what was actually true and the commit that fixed each, with the one check that worked as the exception | Full-width terminal-style health-board table (Signal, What It Reported, What Was True, The Fix) with green and red tinted columns; punchline and a small green exception card below |
| security-review-round-two | The vulnerability itself, side by side: a plain frontmatter fence that renders vs a labelled fence that would execute; deck line names where it hid and how it was caught | Two terminal fences over a headline, a one-line story deck, and six reviewer-lens chips |
| tryhackme-ai1-ai-security-certification | Exam split: reasoning vs flag | Horizontal split bar with two segments and stat line |
| ledgerly-mcp-tool-calling-chat | The chat turn as it happened: the question, two tool-call chips in call order, the answer with the excluded-mortgage sentence highlighted, and a pinned 1,054-rows callout | Terminal-style chat transcript panel (~60% width) with a right rail of five hops (browser, route, CLI, MCP stdio, SQLite) and a flags terminal block beneath |
| ledgerly-cyber-editorial-rebuild | One design-system record fanning out over a two-trunk teal bus into eight agent lanes, with the 46 green tests as a rail | Left record card (file tree of the nine sheets) plus a 2x4 grid of lane cards fed by arrowed bus stubs; 46-square test rail and right-aligned punchline below |

## Art director review (mandatory after every render)

Open the PNG and critique it as a graphic designer before touching the
code again. Every line below is a pass/fail check, not a suggestion.

- **One focal point.** The eye lands on the dominant element first, then
  the headline or kicker, then the supporting details. If three things
  compete, demote two.
- **Balance.** Visual mass is distributed across the canvas; nothing is
  piled to one side with a dead gutter on the other. Side elements are
  balanced against each other (left rail vs right rail), and the
  composition's optical center sits near the canvas center.
- **Grid.** Elements align to a common grid with consistent gutters
  (24 to 32 px). Cards in a row share top and bottom edges. Connector
  stubs land exactly on card edges.
- **Fill.** Text fills its container. A card with more than about
  40 to 50 px of empty interior around short text is either too large
  or its type is too small. Size the container to the content, or use
  the width (title left, details right) before shrinking anything.
- **Type scale.** Smallest text 12 px on the canvas, primary text 15 px
  or larger, callout numbers and headlines large enough to read on a
  560 px wide card. Downscale a copy with `sips -Z 560` and look: the
  big shapes and the biggest words must survive; fine print may not.
- **Color discipline.** Accents carry meaning (teal flow and info,
  green success and read-only, amber action and warnings, red danger).
  Not every panel gets its own color.
- **Edges.** Nothing touches a border, nothing is clipped, nothing sits
  inside the crop-safe margin, and the footer strip is intact.
- **Proofread.** Every rendered string matches the HTML, every number
  matches the post, and there are no em dashes.

Fix structurally (move, resize, restructure) rather than by shrinking
type. Iterate until a render passes every check in one look.

## Verification loop

1. Render with headless Chrome at 1376x768 and device scale 2.
2. Run the art director review above on the PNG.
3. `sips -g pixelWidth -g pixelHeight` must print 2752 and 1536.
4. Downscale to 560 px and confirm the card-scale read.
5. Copy outputs to their destinations, write `coverImageAlt`, and add
   the register row.
