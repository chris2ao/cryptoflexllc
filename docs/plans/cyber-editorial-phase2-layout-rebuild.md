# Cyber Editorial Phase 2: Layout Rebuild

*Created: 2026-04-12 | Status: FUTURE (not started)*

## Context

Phase 1 of the Cyber Editorial overhaul applied a design system update (fonts, colors, tokens, security fixes, new features) but kept the existing page layouts and component structures. The result is a reskin, not a rebuild. The site still feels like a template with better colors.

Phase 2 will rebuild the actual layout composition and component markup to deliver a visually distinctive site.

## Direction

**Reference site: [codewithmukesh.com/blog/](https://codewithmukesh.com/blog/)**

Key elements to adopt:
- **Image-forward blog cards**: Featured image at top of each card, creating a visual scanning path
- **Category-first organization**: Prominent category tabs with post counts
- **Editor's picks / featured carousel**: Horizontal scrolling featured section
- **View count transparency**: Public metrics (views, read time) visible on cards
- **Dark-first with vibrant accents**: Deep purple/dark backgrounds with colorful category badges
- **Search UX**: Command palette style (Ctrl+K) with instant results (already built)

## Scope

### Hero Redesign
- Completely new composition (not text-left, photo-right)
- Consider: full-width hero with background image/pattern, text overlay, animated element
- Or: editorial-style with large display heading, no photo (save photo for About page)
- The hero should make someone stop and look, not scroll past

### Blog Card Rebuild
- Image-forward: featured image or generated OG image at top of card
- Larger, more visually impactful cards
- Category badge overlaid on image
- View count + read time visible
- Hover: card lifts with teal glow (already implemented)
- Consider: different card sizes for featured vs regular posts

### Page Layout Overhaul
- Break out of the uniform max-w-6xl centered column for some sections
- Full-bleed hero and feature sections
- Asymmetric layouts where appropriate
- Visual breaks between sections (not just padding + border-t)
- Consider: sidebar layout for blog list (filters on left, posts on right)

### Blog Post Reading Experience
- Wider prose column with proper measure (65-75 characters)
- More prominent heading typography
- Pull quotes or highlighted excerpts
- Better visual breaks between sections
- Consider: sticky sidebar TOC (already exists, but could be more prominent)

### Component-Level Changes
- All components get new JSX markup, not just className updates
- Cards, buttons, badges, navigation all redesigned at the markup level
- New visual elements: decorative borders, accent lines, section dividers

## Prerequisites
- Phase 1 complete (design tokens, fonts, features all in place)
- Blog post OG images generated (needed for image-forward cards)
- Decision on whether to keep shadcn/ui Card or build custom

## Estimated Effort
This is a significant effort: every major component gets new markup, not just styling. Plan for iterative development with UX Reviewer feedback at each major milestone.

## Compatibility Notes
- All MDX component names must be preserved (Tip, Info, Warning, Stop, Security, etc.)
- Content directories must not move
- Frontmatter fields must not change
- See `cyber-editorial-overhaul-plan.md` "Contracts That MUST NOT Change" section
