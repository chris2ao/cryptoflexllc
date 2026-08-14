# Editorial Diagram Standards

Inline SVG diagrams must carry the same visual weight as the brand cover
infographics. Plain outlined boxes joined by crossing diagonal lines are
below the bar. This document is the contract for every new or reworked
diagram component in `src/components/mdx/diagrams-*.tsx`.

## The system

- **Primitives**: `src/components/mdx/diagram-editorial.tsx` exports
  `EditorialFrame`, `NodePanel`, `FlowLine`, `Chip`, `SectionLabel`,
  `StepBadge`, `TerminalDots`, `elbowPath`, `monoWidth`, and
  `DIAGRAM_ACCENTS`. Every diagram is built from these; do not hand-roll
  rects and lines for things the primitives already do.
- **Exemplars**: `ReviewPipelineDiagram` in
  `diagrams-security-review-round-two.tsx` is the canonical reference.
  The rest of that file, `diagrams-ledgerly-cyber-editorial-rebuild.tsx`,
  and `diagrams-ledgerly-mcp-tool-calling-chat.tsx` show the style across
  flows, comparisons, stacks, and sequences.

## Frame

- Every diagram sits in an `EditorialFrame`: hatched canvas, corner glow,
  square-dot eyebrow header, chip badges top-right, and the
  `CRYPTOFLEX LLC // FROM THE WORKSHOP` footer strip with a short
  uppercase context string on the right.
- The frame `id` prop must be unique per diagram across the whole site
  (it namespaces markers, patterns, and gradients).
- Content stays inside `y = 58 .. h - 44`. Width 880 to 960; height
  whatever the layout needs. Tall beats cramped.

## Composition

- **Orthogonal connectors only** (`FlowLine` + `elbowPath`). Never
  diagonal crossing lines. Fan-in and fan-out use a bus: one trunk line
  with short arrowed stubs.
- Nodes are `NodePanel`s: surface fill, accent border, heading title,
  mono sublines. Use `emphasis` for the panel the story hinges on,
  `terminal` (traffic-light dots) for processes/runtimes, `dashed` or
  `ghost` for placeholders and notifications.
- `SectionLabel` for lanes and phases (BEFORE/AFTER, SAFE/DANGER).
  `StepBadge` for numbered sequences. `Chip` for statuses and one-line
  claims ("holds real secrets", "undocumented").
- One idea per diagram. If a layout needs more than ~12 panels, split it.

## Color and type

- Accents come only from `DIAGRAM_ACCENTS` (primary, cyan, emerald,
  amber, red, violet, muted) with the house semantics: teal/cyan = flow
  and info, emerald = safe/success/fixed, amber = action/warning/verify,
  red = danger/critical, violet = engines and tooling, muted = neutral.
- **Text fills must survive the light theme.** The accent map already
  routes text through theme-flipping tokens (`fill-success`,
  `fill-warning`, `fill-destructive`, `fill-primary`); any custom text
  uses those, `fill-foreground`, or `fill-muted-foreground`. Never put
  literal light shades (`fill-amber-300`) on text; translucent washes
  and borders are fine as literals. `dark:` variants never match on this
  site (dark is the `:root` default, `.light` is the override).
- Tailwind classes must be complete static strings; never interpolate
  fragments. Text uses semantic fills (`fill-foreground`,
  `fill-muted-foreground`, accent fills). No `dark:` variants; the
  semantic tokens already adapt to both themes.
- Titles use `font-heading`, labels and code use `font-mono` via
  `style={{ fontSize: N }}`. Minimums at frame width 960: titles 14,
  mono 10.5. If text will not fit at minimum size, restructure the
  layout instead of shrinking type.
- No em dashes in any string.

## Verification loop (mandatory)

1. Add the component to a dev-only gallery route
   (`src/app/dev-diagrams*/page.tsx`, guarded by
   `process.env.NODE_ENV !== "development"` + `notFound()`, container
   `mx-auto max-w-[760px] px-4 pt-44 pb-12`), one diagram at a time.
2. Screenshot with headless Chrome against the running dev server:
   `--headless=new --screenshot=<out.png> --window-size=760,<h>
   --force-device-scale-factor=2 --hide-scrollbars
   --virtual-time-budget=15000 --disable-gpu <gallery-url>`
3. Read the PNG and inspect: no text escaping panels, no collisions,
   arrows land on panel edges, chips clear of the eyebrow, footer strip
   intact, smallest text still legible.
4. Check the light theme: temporarily wrap the diagram in
   `<div className="light bg-background">` on the gallery route and
   screenshot again (headless Chrome only renders the dark default).
   Text and chips must stay legible.
5. Fix structurally and re-render until it passes in one look, then
   `npx tsc --noEmit`, then delete the gallery route before commit.

## Registration

New component files must be registered in all three registries:
`src/components/mdx/index.ts`, the component map in
`src/app/blog/[slug]/page.tsx`, and the component map in
`src/app/backlog/[slug]/page.tsx`. Missing the backlog registry is a
known failure. Restyling an existing component in place needs no
registry changes as long as exported names are unchanged.
