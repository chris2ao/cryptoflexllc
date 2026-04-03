# Changelog

All notable changes to this project are documented here.

## 2026-04-03 - Claude Code Features Blog Post with Custom SVG Diagrams

### What changed
- **Created** comprehensive blog post on 12 Claude Code features every engineer should know with 14 features, detailed explanations, and visual diagrams
- **Implemented** three custom SVG React diagram components (ConfigStackDiagram, PermissionLevelsDiagram, SerialVsParallelDiagram) following CryptoFlex brand colors and patterns
- **Generated** NotebookLM infographic and 18-slide presentation deck from blog post content
- **Added** diagrams-claude-code-features.tsx component with lightbox-enabled interactive visuals
- **Updated** both backlog/[slug]/page.tsx and blog/[slug]/page.tsx component maps to register new diagram components
- **Produced** LinkedIn draft post summarizing key engineering insights

### What was learned
- MDX component registration must occur in both backlog and blog post page components to ensure rendering works across both content types
- Custom SVG diagram components can be theme-aware using Tailwind color classes while maintaining visual consistency
- NotebookLM content generation produces production-ready assets (infographic, slide deck, PDF) from a single blog post, enabling rapid content repurposing
- End-to-end content pipeline spans blog creation, visual design, asset generation, and social media promotion, with each phase generating distinct deliverables

---
