# Mobile UX Fix Plan

Date: 2026-10-03. Branch: `fix/mobile-ux`.

## Why

A reader reported the site is hard to use on phones. A Playwright audit (WebKit iPhone 13 / iPhone SE, Chromium Pixel 5) against production found:

- Every page measures 605px wide on a 390px phone, so it pans sideways and the Menu button sits off-screen (x=519-605).
- Root cause: unlayered rules in `globals.css` (`.masthead-social`, `.btn-editorial`) set `display: inline-flex`, which beats Tailwind v4's `hidden` (utilities live in `@layer utilities`; unlayered CSS always wins). `.status-pill` also re-sets `display` after its own 768px hide rule.
- Between 769 and 900px nothing in the header navigates: `.masthead-nav` hides at 900px and below, the Menu button hides at 768px and above.
- Diagrams are about 900px wide and shrink to about 300px, so their text renders at 3-4px. Only `ScorecardDiagram` has a phone layout.
- Other issues: no touch path to search, a modal newsletter popup interrupts reading, TOC jumps land under the sticky header, the copy-code button is invisible on touch, 14px inputs trigger iOS focus zoom, and several tap targets are under 36px.

## Global rules

1. Never pair a Tailwind display/visibility utility with a custom class that sets `display`. Do responsive show/hide in `globals.css`, placed after the base rule.
2. No interpolated Tailwind class fragments. Use static class strings.
3. Desktop (1024px and up) must look the same unless a section says otherwise.
4. Tap targets: 44px for primary controls (menu, close buttons, copy, share), at least 36px for chips and dense lists.
5. Wrap `:hover` rules you touch in `@media (hover: hover)` so taps do not leave a stuck hover state.
6. No em dashes in code comments or UI text.

## Workstreams (parallel, file-disjoint)

### A. Header, navigation, search

Owns: `src/components/nav.tsx`, `ui/sheet.tsx`, `theme-toggle.tsx`, `reading-progress.tsx`, `back-to-top.tsx`, `footer.tsx`, `search/CommandPalette.tsx`, `src/app/layout.tsx`. In `globals.css`: the Masthead section (subnav included), the Footer section, `.reading-progress`, and `.ax-toolbar`.

1. Masthead overflow: hide the Subscribe button and social icons below 640px, and the status pill at 768px and below, in CSS. Then `.masthead-right { justify-self: end }`.
2. Show the Menu button up to 900px so it matches the `.masthead-nav` hide breakpoint.
3. Search: add a touch-visible search button in the masthead and a Search entry in the mobile menu. Open the palette through a shared mechanism. In the palette, use `dvh` units and a 16px input on mobile.
4. Tap targets: menu trigger, theme toggle and sheet close at 44px. Menu links `py-3`. Footer icon links get a 44px hit area.
5. Reading progress: move it off the middle of the header and make it 2-3px tall.
6. Subnav: add a right-edge fade when it scrolls, and a 44px tap height on mobile.
7. `layout.tsx`: add `export const viewport` with `themeColor` for light and dark, and change body `min-h-screen` to `min-h-dvh`.
8. `.ax-toolbar`: make it `position: static` at 768px and below.

### B. Post reading experience

Owns: `blog-toc.tsx`, the heading anchor component, `mdx/code-block.tsx`, `mdx/image-lightbox.tsx`, `mdx/cover-image-lightbox.tsx`, `social-share.tsx`, and the 2 posts with raw `<img>`. In `globals.css`: the Blog Post Page section, the prose code and table rules in Component Overrides, and `.ed-tag`.

1. Prose headings get a `scroll-margin-top` that clears the sticky header stack.
2. On screens narrower than 1024px, the inline TOC starts collapsed, and its links get about 40px rows.
3. The copy-code button shows on touch and is 40-44px. Mobile `pre` gets tighter padding and about 12.5px text.
4. The "Click to enlarge" hint shows on touch ("Tap to enlarge"). Lightbox close buttons are 44px, with `touch-action: pinch-zoom`.
5. Share icons are 44px and wrap.
6. Prose text and inline code get `overflow-wrap: anywhere` (`pre` excluded).
7. Tables: cells wrap, a scroll shadow shows overflow, and the wrapper gutter matches the 20px padding.
8. Tag chips and heading anchor links get bigger hit areas.

### C. Diagrams on phones

Owns: `mdx/diagram-editorial.tsx`, `mdx/diagram-lightbox.tsx`, `mdx/diagrams*.tsx`, new helper files, and the MDX component-map entries for diagrams.

Below 768px, every wide diagram must be readable, with SVG text at about 8px CSS or larger. Pan horizontally with a min-width, and show a visible "swipe / tap to enlarge" hint. Use one shared mechanism, not 94 hand edits. Leave the existing `ScorecardDiagram` phone frame untouched. The diagram lightbox gets a touch-visible hint, a 44px close button and pinch zoom, and opens readable on phones. At 768px and up, nothing changes.

### D. Popup, forms, blog index

Owns: `newsletter/NewsletterPopup.tsx`, `blog-list.tsx`, the comment form, `subscribe-inline.tsx`, `subscribe-form.tsx`, `contact-form.tsx`, and any other form inputs.

1. Popup below 640px: non-modal (`show()`, no backdrop, no scroll lock). On `/blog/<slug>` it also waits for 60% scroll depth. The close button is 44px and the input 16px. Desktop is unchanged.
2. All inputs, textareas and selects use 16px text on mobile (`text-base sm:text-sm`).
3. Blog index below 640px shows 12 cards, with a "Show more posts" button that adds 12 at a time. Every card stays in the HTML. The count resets when the filter or search changes.

## Verification

- `npx vitest run`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Run Playwright against `next start` at 320, 390, 768 and 820px. Check that `scrollWidth` equals the viewport, the Menu button is visible, a TOC jump lands below the header, the copy button is visible, a diagram is readable, and the popup is non-modal on phones.
- Parallel code-reviewer and security-reviewer passes on the combined diff.
