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
- **Design for the rendered size, not the viewBox.** The frame scales
  into a container that is at most 768 px wide (`max-w-3xl`), so a
  920-unit frame renders at about 0.83x and a 960-unit frame at 0.8x.
  An 11 px mono subline becomes 9 px on screen. Do the multiplication
  before picking sizes, and prefer the narrow end of the width range
  when the layout allows.

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
- **Balance the mass, not just the geometry.** A centered main column
  with every side element (return paths, side-cars, annotations) on one
  side reads as off-center. Balance side elements against each other
  (return path on the left rail, side-car on the right rail) or shift the
  column so the composition's optical center sits at the frame center.
- **Fill the panels.** A 560-wide panel holding two short centered lines
  is mostly empty. Size panels to their content, use the width (title
  left, details right, or a chip on the right edge), or narrow the
  panel; do not leave more than about 40 px of empty interior around
  short text. Enlarge type before adding height.

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
  `style={{ fontSize: N }}`. Targets at frame width 880 to 920: titles
  17 to 18, mono sublines and edge labels 12.5 or larger. Hard floor at
  any width: titles 14, mono 10.5, and only for a single dense label,
  never for the diagram's main copy. If text will not fit, restructure
  the layout instead of shrinking type. `NodePanel` sublines default to
  the legacy 11 px; pass `subSize={12.5}` (or larger) and `titleSize`
  on every new panel so the defaults stop deciding the type scale.
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
3a. **Art director pass** on the same screenshot, pass/fail on each:
   the composition's optical center is at the frame center (side
   elements balanced, no dead gutter on one side); one focal point and a
   clear hierarchy; a common grid with consistent gutters; every panel
   filled by its content rather than mostly empty; type comfortably
   legible at the rendered 760 px width without zooming; accents carry
   meaning rather than coloring every panel differently. A diagram that
   is technically correct but fails this pass is not done.
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
