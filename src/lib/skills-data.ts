export type ItemCategory =
  | "skill"
  | "agent"
  | "hook"
  | "command"
  | "configuration"
  | "mcp";

export interface SkillItem {
  id: string;
  name: string;
  category: ItemCategory;
  description: string;
  summary: string;
  tags: string[];
  dependencies: string[];
  integrationSteps: string[];
  codeSnippet: string;
  author: string;
  repo: string;
}

export const categoryMeta: Record<
  ItemCategory,
  { label: string; color: string; bgColor: string }
> = {
  skill: {
    label: "Skill",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10 border-cyan-400/20",
  },
  agent: {
    label: "Agent",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/20",
  },
  hook: {
    label: "Hook",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10 border-orange-400/20",
  },
  command: {
    label: "Command",
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/20",
  },
  configuration: {
    label: "Config",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/20",
  },
  mcp: {
    label: "MCP",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10 border-pink-400/20",
  },
};

export const skillItems: SkillItem[] = [
  // ── Custom Skills ──────────────────────────────────────────────
  {
    id: "wrap-up",
    name: "/wrap-up",
    category: "skill",
    description:
      "12-step end-of-session agent that pulls repos, updates docs, extracts skills, and pushes changes.",
    summary:
      "A comprehensive end-of-session workflow that automates everything you'd normally forget to do before closing your terminal. It pulls all repos, updates CHANGELOG and README files, syncs MEMORY.md with new learnings, runs the skill-extractor agent to capture debugging instincts, cleans up session state, stages changes, and commits with a structured message. Designed to run as the last thing you do in every session so nothing falls through the cracks.",
    tags: ["Session Management", "Documentation", "Git", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "skill-extractor agent",
      "changelog-writer agent",
    ],
    integrationSteps: [
      "Copy skills/wrap-up/SKILL.md to ~/.claude/skills/wrap-up/SKILL.md",
      "Ensure agents/ directory is in ~/.claude/agents/",
      "Run /wrap-up at the end of any coding session",
      "Review the generated changelog and memory updates before pushing",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/wrap-up
cp skills/wrap-up/SKILL.md ~/.claude/skills/wrap-up/SKILL.md

# Usage — run at end of session
/wrap-up`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-post",
    name: "/blog-post",
    category: "skill",
    description:
      "Interactive blog writing agent that guides topic selection, writes MDX content, and validates output.",
    summary:
      "An interactive skill that walks you through writing a complete blog post. It asks for your topic and angle, references the blog style guide and MDX reference, then delegates content generation to a Sonnet-class model for high-quality prose. The output is a properly formatted MDX file with frontmatter, callout components, and code blocks ready to commit to your blog's content directory.",
    tags: ["Blog", "Content", "MDX", "Writing"],
    dependencies: [
      "Claude Code CLI",
      "blog-style-guide.md",
      "blog-mdx-reference.md",
    ],
    integrationSteps: [
      "Copy skills/blog-post/SKILL.md to ~/.claude/skills/blog-post/SKILL.md",
      "Copy skills/blog-style-guide.md and blog-mdx-reference.md to ~/.claude/skills/",
      "Invoke /blog-post and follow the interactive prompts",
      "Review generated MDX file in src/content/blog/",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/blog-post
cp skills/blog-post/SKILL.md ~/.claude/skills/blog-post/SKILL.md
cp skills/blog-style-guide.md ~/.claude/skills/
cp skills/blog-mdx-reference.md ~/.claude/skills/

# Usage
/blog-post`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "multi-repo-status",
    name: "/multi-repo-status",
    category: "skill",
    description:
      "Quick dashboard showing git status across all project repos in parallel.",
    summary:
      "Spawns parallel agents to check git status across all your project repositories simultaneously. Returns a unified dashboard showing which repos have uncommitted changes, unpushed commits, or diverged branches. Useful when you're juggling multiple projects and need a quick health check before wrapping up.",
    tags: ["Git", "DevOps", "Automation", "Multi-Repo"],
    dependencies: ["Claude Code CLI", "Git", "Multiple cloned repositories"],
    integrationSteps: [
      "Copy skills/multi-repo-status/SKILL.md to ~/.claude/skills/multi-repo-status/SKILL.md",
      "Update repo paths in SKILL.md to match your project layout",
      "Run /multi-repo-status for a quick dashboard",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/multi-repo-status
cp skills/multi-repo-status/SKILL.md \\
   ~/.claude/skills/multi-repo-status/SKILL.md

# Usage
/multi-repo-status`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "skill-catalog",
    name: "/skill-catalog",
    category: "skill",
    description:
      "Full inventory of all agents, skills, commands, and hooks with descriptions.",
    summary:
      "Generates a comprehensive catalog of every capability available in your Claude Code configuration. Scans agents, skills, commands, rules, scripts, and hooks directories, then produces a formatted inventory with descriptions, dependencies, and usage notes. Helpful for onboarding new team members or auditing your setup.",
    tags: ["Documentation", "Inventory", "Automation"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy skills/skill-catalog/SKILL.md to ~/.claude/skills/skill-catalog/SKILL.md",
      "Run /skill-catalog to see your full capability inventory",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/skill-catalog
cp skills/skill-catalog/SKILL.md \\
   ~/.claude/skills/skill-catalog/SKILL.md

# Usage
/skill-catalog`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  {
    id: "cmux",
    name: "/cmux",
    category: "skill",
    description:
      "Terminal CLI reference for tmux/screen multiplexer commands and workflows.",
    summary:
      "A quick-reference skill for terminal multiplexer operations. Covers tmux and screen commands, session management, window splitting, pane navigation, and copy mode. Useful when you need to set up complex terminal layouts or manage multiple long-running processes during development sessions.",
    tags: ["Terminal", "DevOps", "Productivity"],
    dependencies: ["Claude Code CLI", "tmux or screen"],
    integrationSteps: [
      "Copy skills/cmux/SKILL.md to ~/.claude/skills/cmux/SKILL.md",
      "Run /cmux for terminal multiplexer reference",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/cmux
cp skills/cmux/SKILL.md ~/.claude/skills/cmux/SKILL.md

# Usage
/cmux`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "content-validation",
    name: "/content-validation",
    category: "skill",
    description:
      "Validates content beyond HTTP status codes with deep structural and semantic checks.",
    summary:
      "Goes beyond basic HTTP status code checking to validate actual content quality. Checks for broken links, missing images, malformed HTML, accessibility violations, SEO metadata completeness, and content rendering issues. Useful as a post-deploy validation step or during content review workflows.",
    tags: ["Content", "Validation", "Quality", "DevOps"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy skills/content-validation/SKILL.md to ~/.claude/skills/content-validation/SKILL.md",
      "Run /content-validation against your content directory or URL",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/content-validation
cp skills/content-validation/SKILL.md ~/.claude/skills/content-validation/SKILL.md

# Usage
/content-validation`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cross-platform-parsing",
    name: "/cross-platform-parsing",
    category: "skill",
    description:
      "Safe text parsing patterns that work across Windows (PowerShell) and Unix (Bash) environments.",
    summary:
      "A reference skill for handling text parsing differences between Windows and Unix platforms. Covers line ending normalization (CRLF vs LF), path separator handling, stdin reading patterns, encoding detection, and string quoting rules. Essential for anyone maintaining scripts that run on both platforms.",
    tags: ["Platform", "Windows", "Shell", "PowerShell"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy skills/cross-platform-parsing/SKILL.md to ~/.claude/skills/cross-platform-parsing/SKILL.md",
      "Reference /cross-platform-parsing when writing cross-platform scripts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/cross-platform-parsing
cp skills/cross-platform-parsing/SKILL.md ~/.claude/skills/cross-platform-parsing/SKILL.md

# Usage
/cross-platform-parsing`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-dev",
    name: "/game-dev",
    category: "skill",
    description:
      "Game development team orchestration with 6 specialized agents (director, designer, developer, artist, UX, writer).",
    summary:
      "Orchestrates a full game development team of 6 specialized agents. The game-director (Opus) acts as captain, coordinating the game-designer (mechanics/systems), game-developer (engine/loop), game-artist (sprites/animations), game-ux (menus/HUD), and game-writer (story/dialogue). Each agent has domain-specific expertise and the director coordinates their work into a cohesive game.",
    tags: ["Game Development", "Orchestration", "Multi-Agent", "Creative"],
    dependencies: [
      "Claude Code CLI",
      "Game development team agents",
    ],
    integrationSteps: [
      "Copy skills/game-dev/SKILL.md to ~/.claude/skills/game-dev/SKILL.md",
      "Ensure all 6 game team agents are installed in ~/.claude/agents/",
      "Run /game-dev to orchestrate the game development team",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/game-dev
cp skills/game-dev/SKILL.md ~/.claude/skills/game-dev/SKILL.md

# Install all game team agents
cp agents/game-director.md ~/.claude/agents/
cp agents/game-designer.md ~/.claude/agents/
cp agents/game-developer.md ~/.claude/agents/
cp agents/game-artist.md ~/.claude/agents/
cp agents/game-ux.md ~/.claude/agents/
cp agents/game-writer.md ~/.claude/agents/

# Usage
/game-dev`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "gws",
    name: "/gws",
    category: "skill",
    description:
      "Google Workspace CLI integration for Drive, Gmail, Calendar, and other Google services.",
    summary:
      "A unified interface for interacting with Google Workspace services from Claude Code. Covers Gmail (search, read, draft, label), Google Calendar (events, availability, scheduling), and Google Drive operations. Consolidates multiple Google service interactions into a single skill with consistent patterns.",
    tags: ["Google", "Productivity", "Email", "Calendar"],
    dependencies: ["Claude Code CLI", "Google OAuth credentials"],
    integrationSteps: [
      "Copy skills/gws/SKILL.md to ~/.claude/skills/gws/SKILL.md",
      "Configure Google OAuth for the required service APIs",
      "Run /gws for Google Workspace operations",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/gws
cp skills/gws/SKILL.md ~/.claude/skills/gws/SKILL.md

# Usage
/gws`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "memory-architecture",
    name: "/memory-architecture",
    category: "skill",
    description:
      "Two-tier memory system configuration with vector memory and knowledge graph coordination.",
    summary:
      "A configuration and reference skill for setting up the two-tier memory architecture. Covers vector memory (semantic search with embeddings) and knowledge graph (entity relationships) coordination, deduplication strategies, memory quality scoring, and ingestion pipelines. Ensures the memory systems work together without overlap or data loss.",
    tags: ["Memory", "Architecture", "Configuration"],
    dependencies: [
      "Claude Code CLI",
      "vector-memory MCP server",
      "memory MCP server",
    ],
    integrationSteps: [
      "Copy skills/memory-architecture/SKILL.md to ~/.claude/skills/memory-architecture/SKILL.md",
      "Ensure both memory MCP servers are configured",
      "Run /memory-architecture for setup guidance and reference",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/memory-architecture
cp skills/memory-architecture/SKILL.md ~/.claude/skills/memory-architecture/SKILL.md

# Usage
/memory-architecture`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "multi-agent-orchestration",
    name: "/multi-agent-orchestration",
    category: "skill",
    description:
      "Patterns for structuring multi-agent teams with captain agents, parallel workers, and result synthesis.",
    summary:
      "A reference skill for designing multi-agent orchestration patterns. Covers the captain-agent pattern (one coordinator dispatching parallel workers), model routing heuristics (Haiku for scanning, Sonnet for generation, Opus for decisions), result aggregation strategies, and error handling across agent teams. The foundation for skills like /game-dev and /blog-post.",
    tags: ["Multi-Agent", "Architecture", "Orchestration", "Workflow"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy skills/multi-agent-orchestration/SKILL.md to ~/.claude/skills/multi-agent-orchestration/SKILL.md",
      "Reference when designing new multi-agent workflows",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/multi-agent-orchestration
cp skills/multi-agent-orchestration/SKILL.md ~/.claude/skills/multi-agent-orchestration/SKILL.md

# Usage
/multi-agent-orchestration`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-content",
    name: "/notebooklm-content",
    category: "skill",
    description:
      "Creates branded infographics, slides, and content from blog posts using NotebookLM integration.",
    summary:
      "Orchestrates the creation of branded visual content from existing blog posts using NotebookLM. Generates infographics, presentation slides, and summary cards with consistent branding. Uses the notebooklm-assistant and notebooklm-content agents for the heavy lifting, with the skill providing the orchestration workflow.",
    tags: ["Content", "NotebookLM", "Branding", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "notebooklm-assistant agent",
      "notebooklm-content agent",
    ],
    integrationSteps: [
      "Copy skills/notebooklm-content/SKILL.md to ~/.claude/skills/notebooklm-content/SKILL.md",
      "Ensure notebooklm agents are installed",
      "Run /notebooklm-content with a blog post path",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/notebooklm-content
cp skills/notebooklm-content/SKILL.md ~/.claude/skills/notebooklm-content/SKILL.md

# Usage
/notebooklm-content`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "openclaw-ops",
    name: "/openclaw-ops",
    category: "skill",
    description:
      "Configuration and operations reference for OpenClaw systems integration.",
    summary:
      "An operations skill for managing OpenClaw system configurations, bridge connections, and deployment workflows. Covers the bridge-launcher script, environment setup, and operational procedures for the OpenClaw integration layer.",
    tags: ["OpenClaw", "Operations", "Configuration"],
    dependencies: ["Claude Code CLI", "OpenClaw bridge"],
    integrationSteps: [
      "Copy skills/openclaw-ops/SKILL.md to ~/.claude/skills/openclaw-ops/SKILL.md",
      "Ensure bridge-launcher.sh script is installed",
      "Run /openclaw-ops for operations reference",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/openclaw-ops
cp skills/openclaw-ops/SKILL.md ~/.claude/skills/openclaw-ops/SKILL.md

# Usage
/openclaw-ops`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Custom Agents ──────────────────────────────────────────────
  {
    id: "changelog-writer",
    name: "Changelog Writer",
    category: "agent",
    description:
      "Auto-generates CHANGELOG.md entries from git diffs using Haiku for speed.",
    summary:
      "A lightweight agent assigned to the Haiku model for fast, cost-effective changelog generation. It reads git diffs between the last tag and HEAD, categorizes changes (added, changed, fixed, removed), and appends a properly formatted entry to CHANGELOG.md following the Keep a Changelog convention. Designed to run as part of the /wrap-up workflow but can be invoked standalone.",
    tags: ["Git", "Documentation", "Automation"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Copy agents/changelog-writer.md to ~/.claude/agents/",
      "The agent is auto-invoked by /wrap-up or can be called via Task tool",
      "Ensure your repo has a CHANGELOG.md file initialized",
    ],
    codeSnippet: `# Install
cp agents/changelog-writer.md ~/.claude/agents/

# The agent is invoked automatically via the Task tool:
# Task(subagent_type="changelog-writer", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "multi-repo-orchestrator",
    name: "Multi-Repo Orchestrator",
    category: "agent",
    description:
      "Runs parallel git operations across all project repositories simultaneously.",
    summary:
      "Coordinates git operations (pull, status, push, branch cleanup) across multiple repositories in parallel. Uses Haiku for cost efficiency since git operations don't need complex reasoning. Each repo gets its own Task agent, and results are aggregated into a unified report. Supports custom operations via prompt injection.",
    tags: ["Git", "DevOps", "Multi-Repo", "Automation"],
    dependencies: ["Claude Code CLI", "Git", "Multiple cloned repositories"],
    integrationSteps: [
      "Copy agents/multi-repo-orchestrator.md to ~/.claude/agents/",
      "Update the repo paths list in the agent definition",
      "Invoke via Task tool or through /multi-repo-status skill",
    ],
    codeSnippet: `# Install
cp agents/multi-repo-orchestrator.md ~/.claude/agents/

# Invoked via Task tool with specific operations
# Task(subagent_type="multi-repo-orchestrator")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "session-analyzer",
    name: "Session Analyzer",
    category: "agent",
    description:
      "Extracts patterns and learnings from archived session transcripts using Sonnet.",
    summary:
      "A Sonnet-class agent that reads session archive transcripts and extracts recurring patterns, debugging strategies, and workflow optimizations. Identifies what went well, what was repeated unnecessarily, and what could be automated. Produces structured output that feeds into the skill-extractor agent for creating new learned skills.",
    tags: ["Session Management", "Analysis", "Learning"],
    dependencies: ["Claude Code CLI", "Session archive transcripts"],
    integrationSteps: [
      "Copy agents/session-analyzer.md to ~/.claude/agents/",
      "Ensure session transcripts are archived (see hooks.md)",
      "Run via Task tool pointing to a transcript directory",
    ],
    codeSnippet: `# Install
cp agents/session-analyzer.md ~/.claude/agents/

# Analyze a specific session transcript
# Task(subagent_type="session-analyzer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "deploy-verifier",
    name: "Deploy Verifier",
    category: "agent",
    description:
      "Post-deploy verification agent that checks production site health and functionality.",
    summary:
      "A Haiku-powered agent that runs after deployments to verify the production site is functioning correctly. Checks HTTP status codes, validates critical pages load, verifies security headers (CSP, HSTS), tests API endpoints, and confirms assets are served correctly. Reports any issues found with severity levels.",
    tags: ["CI/CD", "DevOps", "Security", "Verification"],
    dependencies: ["Claude Code CLI", "curl or web fetch capability"],
    integrationSteps: [
      "Copy agents/deploy-verifier.md to ~/.claude/agents/",
      "Update the target URL to your production domain",
      "Run after each deployment or integrate into CI pipeline",
    ],
    codeSnippet: `# Install
cp agents/deploy-verifier.md ~/.claude/agents/

# Run post-deploy verification
# Task(subagent_type="deploy-verifier", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "config-sync",
    name: "Config Sync",
    category: "agent",
    description:
      "Detects configuration drift between local ~/.claude/ and the git repo.",
    summary:
      "Compares your local Claude Code configuration files against the canonical versions in the claude-code-config git repository. Identifies added, modified, and deleted files, then produces a diff report. Helps prevent configuration drift when you make local tweaks that should be committed back to the repo, or when the repo has updates you haven't pulled.",
    tags: ["DevOps", "Configuration", "Git", "Automation"],
    dependencies: ["Claude Code CLI", "Git", "claude-code-config repo cloned"],
    integrationSteps: [
      "Copy agents/config-sync.md to ~/.claude/agents/",
      "Clone claude-code-config repo to a known path",
      "Run to detect drift between local config and repo",
    ],
    codeSnippet: `# Install
cp agents/config-sync.md ~/.claude/agents/

# Detect config drift
# Task(subagent_type="config-sync", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "context-health",
    name: "Context Health Monitor",
    category: "agent",
    description:
      "Monitors context window usage and suggests optimal compaction points.",
    summary:
      "Tracks context window consumption during long sessions and alerts when you're approaching limits. Suggests ideal points to compact the conversation, identifies which parts of context are most valuable to preserve, and recommends when to start a fresh session. Runs on Haiku for minimal overhead.",
    tags: ["Performance", "Session Management", "Automation"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/context-health.md to ~/.claude/agents/",
      "Invoke periodically during long sessions",
      "Follow compaction suggestions to maintain session quality",
    ],
    codeSnippet: `# Install
cp agents/context-health.md ~/.claude/agents/

# Check context health mid-session
# Task(subagent_type="context-health", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "skill-extractor",
    name: "Skill Extractor (Homunculus v2)",
    category: "agent",
    description:
      "Extracts debugging instincts from session transcripts and creates reusable learned skills.",
    summary:
      "The Homunculus v2 agent — named for the idea of creating a 'little person' inside Claude who remembers hard-won debugging knowledge. Analyzes session transcripts for moments where you hit a wall, found a non-obvious solution, or discovered a platform gotcha. Produces structured learned skill files with the problem, the wrong approach, and the correct fix. These skills are loaded into future sessions so you never debug the same issue twice.",
    tags: ["Learning", "Documentation", "Session Management", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Session archive transcripts",
      "skills/learned/ directory",
    ],
    integrationSteps: [
      "Copy agents/skill-extractor.md to ~/.claude/agents/",
      "Ensure session transcripts are being archived",
      "Run after difficult debugging sessions to capture learnings",
      "Review extracted skills in skills/learned/",
    ],
    codeSnippet: `# Install
cp agents/skill-extractor.md ~/.claude/agents/

# Extract skills from a session transcript
# Task(subagent_type="skill-extractor", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "evolve-synthesizer",
    name: "Evolve Synthesizer",
    category: "agent",
    description:
      "Sonnet-class agent that synthesizes instincts into new agents, skills, and commands.",
    summary:
      "The evolution engine of the Homunculus system. Analyzes clusters of related instincts and synthesizes them into higher-order components: new agents, learned skills, or commands. When 3+ instincts cluster around a theme with sufficient confidence, this agent promotes them into reusable, permanent components. Works with the promote-evolved.sh script to install synthesized components.",
    tags: ["Homunculus", "Learning", "Evolution", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Homunculus instincts directory",
      "promote-evolved.sh script",
    ],
    integrationSteps: [
      "Copy agents/evolve-synthesizer.md to ~/.claude/agents/",
      "Ensure instincts directory has sufficient data",
      "Run to synthesize instincts into higher-order components",
    ],
    codeSnippet: `# Install
cp agents/evolve-synthesizer.md ~/.claude/agents/

# Synthesize instincts into new components
# Task(subagent_type="evolve-synthesizer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "gmail-assistant",
    name: "Gmail Assistant",
    category: "agent",
    description:
      "Sonnet-class daily inbox cleanup with auto-labeling, 14-day rolling search window, and content-aware classification.",
    summary:
      "An intelligent email management agent that processes your Gmail inbox. Uses a 14-day rolling window for searches, performs quick scan before bulk-trashing, and applies content-aware classification to categorize and label emails. v2 adds smart labeling rules and a safety check that previews actions before executing destructive operations like bulk delete.",
    tags: ["Email", "Gmail", "Productivity", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Gmail MCP or Google OAuth",
    ],
    integrationSteps: [
      "Copy agents/gmail-assistant.md to ~/.claude/agents/",
      "Configure Gmail API access",
      "Invoke for inbox cleanup and organization",
    ],
    codeSnippet: `# Install
cp agents/gmail-assistant.md ~/.claude/agents/

# Daily inbox cleanup
# Task(subagent_type="gmail-assistant", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-assistant",
    name: "NotebookLM Assistant",
    category: "agent",
    description:
      "Sonnet-class agent orchestrating NotebookLM workflows via MCP tools.",
    summary:
      "Orchestrates workflows with Google NotebookLM using MCP server tools instead of CLI wrappers. Manages notebook creation, source ingestion, content generation, and export operations. Migrated from a CLI wrapper to native MCP integration for better reliability and richer tool interactions.",
    tags: ["NotebookLM", "Google", "Orchestration", "MCP"],
    dependencies: [
      "Claude Code CLI",
      "NotebookLM MCP server",
    ],
    integrationSteps: [
      "Copy agents/notebooklm-assistant.md to ~/.claude/agents/",
      "Configure NotebookLM MCP server",
      "Invoke to manage NotebookLM workflows",
    ],
    codeSnippet: `# Install
cp agents/notebooklm-assistant.md ~/.claude/agents/

# Task(subagent_type="notebooklm-assistant", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-content-agent",
    name: "NotebookLM Content Creator",
    category: "agent",
    description:
      "Sonnet-class agent that creates branded infographics and slides from blog content.",
    summary:
      "Transforms blog posts and documentation into branded visual content using NotebookLM. Creates infographics, presentation slides, and summary cards with consistent CryptoFlex branding. Works with the notebooklm-assistant agent for NotebookLM API interactions.",
    tags: ["Content", "NotebookLM", "Branding", "Creative"],
    dependencies: [
      "Claude Code CLI",
      "notebooklm-assistant agent",
    ],
    integrationSteps: [
      "Copy agents/notebooklm-content.md to ~/.claude/agents/",
      "Ensure notebooklm-assistant agent is installed",
      "Invoke with a blog post path for content creation",
    ],
    codeSnippet: `# Install
cp agents/notebooklm-content.md ~/.claude/agents/

# Task(subagent_type="notebooklm-content", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Game Development Team (6) ──────────────────────────────
  {
    id: "game-director",
    name: "Game Director",
    category: "agent",
    description:
      "Opus-class captain agent orchestrating the full game development team.",
    summary:
      "The captain agent for the game development team. Runs on Opus for complex creative and architectural decisions. Coordinates game-designer, game-developer, game-artist, game-ux, and game-writer into a cohesive development pipeline. Manages task decomposition, conflict resolution between team members, and final integration of all game components.",
    tags: ["Game Development", "Orchestration", "Multi-Agent", "Captain"],
    dependencies: ["Claude Code CLI", "Game development team agents"],
    integrationSteps: [
      "Copy agents/game-director.md to ~/.claude/agents/",
      "Ensure all game team agents are installed",
      "Invoked via /game-dev skill or Task tool",
    ],
    codeSnippet: `# Install
cp agents/game-director.md ~/.claude/agents/

# Task(subagent_type="game-director", model="opus")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-designer",
    name: "Game Designer",
    category: "agent",
    description:
      "Sonnet-class mechanics designer for game systems, balance, and progression.",
    summary:
      "Designs game mechanics, progression systems, difficulty curves, resource economies, and combat/interaction systems. Creates game design documents with balancing parameters and feedback loops. Coordinates with game-developer for technical feasibility.",
    tags: ["Game Development", "Design", "Mechanics"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/game-designer.md to ~/.claude/agents/",
      "Coordinated by game-director agent",
    ],
    codeSnippet: `# Install
cp agents/game-designer.md ~/.claude/agents/

# Task(subagent_type="game-designer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-developer",
    name: "Game Developer",
    category: "agent",
    description:
      "Sonnet-class engine logic, game loop, physics, and core systems developer.",
    summary:
      "Implements core game engine logic including the game loop, physics systems, collision detection, input handling, state management, and rendering pipelines. Translates game-designer specifications into working code. Handles performance optimization and platform-specific adaptations.",
    tags: ["Game Development", "Engineering", "Engine"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/game-developer.md to ~/.claude/agents/",
      "Coordinated by game-director agent",
    ],
    codeSnippet: `# Install
cp agents/game-developer.md ~/.claude/agents/

# Task(subagent_type="game-developer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-artist",
    name: "Game Artist",
    category: "agent",
    description:
      "Sonnet-class visual artist for sprites, animations, tilesets, and visual effects.",
    summary:
      "Creates visual assets for games including sprite sheets, character animations, tilesets, particle effects, and UI art. Designs within the art style established by game-director and coordinates with game-ux for interface elements. Produces asset specifications and CSS/canvas rendering code.",
    tags: ["Game Development", "Art", "Visual", "Creative"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/game-artist.md to ~/.claude/agents/",
      "Coordinated by game-director agent",
    ],
    codeSnippet: `# Install
cp agents/game-artist.md ~/.claude/agents/

# Task(subagent_type="game-artist", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-ux",
    name: "Game UX Designer",
    category: "agent",
    description:
      "Sonnet-class UX/UI designer for menus, HUD elements, and player interface.",
    summary:
      "Designs game user interfaces including menus, HUD overlays, inventory screens, dialog boxes, settings panels, and tutorial flows. Ensures consistent UX patterns, accessible controls, and responsive layouts. Works with game-artist for visual styling and game-developer for implementation.",
    tags: ["Game Development", "UX", "UI", "Design"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/game-ux.md to ~/.claude/agents/",
      "Coordinated by game-director agent",
    ],
    codeSnippet: `# Install
cp agents/game-ux.md ~/.claude/agents/

# Task(subagent_type="game-ux", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-writer",
    name: "Game Writer",
    category: "agent",
    description:
      "Haiku-class story, dialogue, lore, and world-building writer for games.",
    summary:
      "Crafts game narratives including main storylines, character dialogue, item descriptions, lore entries, quest text, and world-building documents. Runs on Haiku for efficient text generation at scale. Maintains consistency with the game world established by game-director and game-designer.",
    tags: ["Game Development", "Writing", "Narrative", "Creative"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/game-writer.md to ~/.claude/agents/",
      "Coordinated by game-director agent",
    ],
    codeSnippet: `# Install
cp agents/game-writer.md ~/.claude/agents/

# Task(subagent_type="game-writer", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Blog Production Team (5) ────────────────────────────────
  {
    id: "blog-captain",
    name: "Blog Captain",
    category: "agent",
    description:
      "Opus-class captain agent orchestrating the full blog production pipeline.",
    summary:
      "The captain agent for the blog production team. Runs on Opus for complex orchestration decisions. Coordinates blog-writer (drafts), blog-editor (review), blog-voice (tone consistency), and blog-ux (build verification) into a cohesive pipeline. Replaced the earlier blog-post-orchestrator with a proper team-based approach matching the game-dev pattern.",
    tags: ["Blog", "Content", "Orchestration", "Multi-Agent"],
    dependencies: [
      "Claude Code CLI",
      "Blog production team agents",
    ],
    integrationSteps: [
      "Copy agents/blog-captain.md to ~/.claude/agents/",
      "Ensure all blog team agents are installed",
      "Invoked via /blog-post skill or Task tool",
    ],
    codeSnippet: `# Install
cp agents/blog-captain.md ~/.claude/agents/

# Captain orchestrates the team:
# Task(subagent_type="blog-captain", model="opus")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-writer",
    name: "Blog Writer",
    category: "agent",
    description:
      "Sonnet-class agent that drafts and revises MDX blog posts with style guide adherence.",
    summary:
      "The primary content creation agent in the blog production team. Runs on Sonnet for high-quality prose generation. Drafts MDX blog posts following the style guide, handles revisions based on editor feedback, and ensures proper frontmatter, code blocks, and callout component usage.",
    tags: ["Blog", "Content", "Writing", "MDX"],
    dependencies: ["Claude Code CLI", "blog-style-guide.md"],
    integrationSteps: [
      "Copy agents/blog-writer.md to ~/.claude/agents/",
      "Coordinated by blog-captain agent",
    ],
    codeSnippet: `# Install
cp agents/blog-writer.md ~/.claude/agents/

# Task(subagent_type="blog-writer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-editor",
    name: "Blog Editor",
    category: "agent",
    description:
      "Sonnet-class senior editor for content review, fact-checking, and quality assurance.",
    summary:
      "Reviews blog post drafts for technical accuracy, clarity, tone consistency, and style guide compliance. Provides structured feedback to the blog-writer agent for revisions. Catches common issues like broken links, incorrect code examples, and inconsistent terminology.",
    tags: ["Blog", "Content", "Review", "Quality"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/blog-editor.md to ~/.claude/agents/",
      "Coordinated by blog-captain agent",
    ],
    codeSnippet: `# Install
cp agents/blog-editor.md ~/.claude/agents/

# Task(subagent_type="blog-editor", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-voice",
    name: "Blog Voice",
    category: "agent",
    description:
      "Sonnet-class agent that maintains voice profile consistency across all blog content.",
    summary:
      "Maintains a voice profile derived from existing blog posts and ensures new content matches the established tone, vocabulary, and writing patterns. Compares draft text against the voice profile and flags deviations. Works with the blog-voice-diff.sh script for quantitative voice analysis.",
    tags: ["Blog", "Content", "Voice", "Consistency"],
    dependencies: ["Claude Code CLI", "blog-voice-diff.sh script"],
    integrationSteps: [
      "Copy agents/blog-voice.md to ~/.claude/agents/",
      "Coordinated by blog-captain agent",
    ],
    codeSnippet: `# Install
cp agents/blog-voice.md ~/.claude/agents/

# Task(subagent_type="blog-voice", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-ux",
    name: "Blog UX",
    category: "agent",
    description:
      "Haiku-class build verification and MDX structure analysis for blog posts.",
    summary:
      "Handles the technical verification side of blog production. Validates MDX syntax, checks component imports, verifies build success, analyzes page structure for accessibility, and confirms responsive layout. Runs on Haiku for speed since the work is primarily structural validation rather than content analysis.",
    tags: ["Blog", "UX", "Validation", "MDX"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/blog-ux.md to ~/.claude/agents/",
      "Coordinated by blog-captain agent",
    ],
    codeSnippet: `# Install
cp agents/blog-ux.md ~/.claude/agents/

# Task(subagent_type="blog-ux", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "pre-commit-checker",
    name: "Pre-Commit Checker",
    category: "agent",
    description:
      "Security and quality checks that run before every commit to catch issues early.",
    summary:
      "Scans staged files for security issues (hardcoded secrets, exposed API keys, path traversal vulnerabilities), code quality problems (unused imports, console.log statements), and style violations before allowing a commit. Uses the security.md rules as its checklist. Lightweight enough to run on Haiku without noticeable delay.",
    tags: ["Security", "Git", "Quality", "Automation"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Copy agents/pre-commit-checker.md to ~/.claude/agents/",
      "Configure as a pre-commit hook or invoke manually before commits",
      "Review flagged issues and fix before committing",
    ],
    codeSnippet: `# Install
cp agents/pre-commit-checker.md ~/.claude/agents/

# Runs automatically via hook or manually:
# Task(subagent_type="pre-commit-checker", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "session-checkpoint",
    name: "Session Checkpoint",
    category: "agent",
    description:
      "Creates mid-session state snapshots for recovery and context preservation.",
    summary:
      "Captures the current state of your working session — open tasks, modified files, in-progress reasoning, and conversation highlights — into a checkpoint file. Useful for long sessions where you might need to context-switch or recover from a crash. Checkpoints can be loaded into new sessions to resume where you left off.",
    tags: ["Session Management", "Recovery", "Automation"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy agents/session-checkpoint.md to ~/.claude/agents/",
      "Invoke periodically during long sessions",
      "Load checkpoint files when resuming work",
    ],
    codeSnippet: `# Install
cp agents/session-checkpoint.md ~/.claude/agents/

# Create a checkpoint
# Task(subagent_type="session-checkpoint")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "sync-orchestrator",
    name: "Sync Orchestrator",
    category: "agent",
    description:
      "Coordinates configuration synchronization across machines and environments.",
    summary:
      "Manages the synchronization of Claude Code configurations between your local machine, the git repo, and other environments. Handles merge conflicts, detects which side has newer changes, and produces a sync plan before making any modifications. Works with the config-sync agent for drift detection.",
    tags: ["DevOps", "Configuration", "Multi-Repo", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "config-sync agent",
    ],
    integrationSteps: [
      "Copy agents/sync-orchestrator.md to ~/.claude/agents/",
      "Ensure config-sync agent is installed",
      "Run when setting up a new machine or after repo updates",
    ],
    codeSnippet: `# Install
cp agents/sync-orchestrator.md ~/.claude/agents/

# Synchronize configurations
# Task(subagent_type="sync-orchestrator")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "home-sync",
    name: "Home Sync",
    category: "agent",
    description:
      "Syncs ~/.claude/ directory with the canonical claude-code-config repository.",
    summary:
      "Keeps your home directory's .claude/ configuration in sync with the claude-code-config git repository. Detects local changes that need to be committed upstream and repo changes that need to be pulled down. Handles the bidirectional sync with conflict resolution prompts.",
    tags: ["DevOps", "Configuration", "Git", "Automation"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Copy agents/home-sync.md to ~/.claude/agents/",
      "Clone claude-code-config to a known path",
      "Run periodically to keep configs in sync",
    ],
    codeSnippet: `# Install
cp agents/home-sync.md ~/.claude/agents/

# Sync home config with repo
# Task(subagent_type="home-sync")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "wrap-up-orchestrator",
    name: "Wrap-Up Orchestrator",
    category: "agent",
    description:
      "Coordinates all wrap-up sub-agents for comprehensive end-of-session cleanup.",
    summary:
      "The master orchestrator for the /wrap-up skill. Coordinates the changelog-writer, skill-extractor, config-sync, and multi-repo-orchestrator agents in the correct sequence. Ensures all documentation is updated, all repos are clean, and all learnings are captured before the session ends.",
    tags: ["Session Management", "Orchestration", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "changelog-writer agent",
      "skill-extractor agent",
      "config-sync agent",
    ],
    integrationSteps: [
      "Copy agents/wrap-up-orchestrator.md to ~/.claude/agents/",
      "Ensure all dependent agents are installed",
      "Automatically invoked by /wrap-up skill",
    ],
    codeSnippet: `# Install
cp agents/wrap-up-orchestrator.md ~/.claude/agents/

# Invoked automatically by /wrap-up
# Task(subagent_type="wrap-up-orchestrator")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Commands ──────────────────────────────────────────────────
  {
    id: "cmd-wrap-up",
    name: "/wrap-up (Command)",
    category: "command",
    description:
      "Backward-compatible command version of the /wrap-up skill for older Claude Code versions.",
    summary:
      "The original command implementation of the wrap-up workflow, maintained for backward compatibility with Claude Code versions that don't support the newer skills system. Functionally identical to the /wrap-up skill but uses the commands/ directory format with YAML frontmatter.",
    tags: ["Session Management", "Documentation", "Git", "Legacy"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Copy commands/wrap-up.md to ~/.claude/commands/",
      "Ensure YAML frontmatter is present (required for commands)",
      "The skill version takes priority if both exist",
    ],
    codeSnippet: `# Install
cp commands/wrap-up.md ~/.claude/commands/

# Usage (if skill version not installed)
/wrap-up`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-blog-post",
    name: "/blog-post (Command)",
    category: "command",
    description:
      "Backward-compatible command version of the /blog-post skill for older Claude Code versions.",
    summary:
      "The original command implementation of the blog post workflow. Maintained for environments that don't support the skills system. Uses YAML frontmatter format required by the commands/ directory.",
    tags: ["Blog", "Content", "MDX", "Legacy"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy commands/blog-post.md to ~/.claude/commands/",
      "Ensure YAML frontmatter is present",
      "The skill version takes priority if both exist",
    ],
    codeSnippet: `# Install
cp commands/blog-post.md ~/.claude/commands/

# Usage (if skill version not installed)
/blog-post`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Hooks / Scripts ────────────────────────────────────────────
  {
    id: "blog-inventory",
    name: "Blog Inventory",
    category: "hook",
    description:
      "Shell script that scans and catalogs all blog posts with metadata for quick reference.",
    summary:
      "Scans the blog content directory and produces a formatted inventory of all posts including title, date, tags, word count, and reading time. Useful for content planning, identifying gaps in topic coverage, and tracking publishing cadence.",
    tags: ["Blog", "Documentation", "Shell"],
    dependencies: ["Bash", "Blog content directory"],
    integrationSteps: [
      "Copy scripts/blog-inventory.sh to your project",
      "Make executable: chmod +x scripts/blog-inventory.sh",
      "Run: ./scripts/blog-inventory.sh",
    ],
    codeSnippet: `# Install
cp scripts/blog-inventory.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/blog-inventory.sh

# Run
~/.claude/scripts/blog-inventory.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cleanup-session",
    name: "Cleanup Session",
    category: "hook",
    description:
      "Cleans up temporary files, caches, and artifacts from completed Claude Code sessions.",
    summary:
      "Post-session cleanup script that removes temporary files, clears build caches, and archives session transcripts. Prevents disk space accumulation from long-running Claude Code usage. Can be configured as a session-end hook or run manually.",
    tags: ["Session Management", "Automation", "Shell"],
    dependencies: ["Bash"],
    integrationSteps: [
      "Copy scripts/cleanup-session.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Optionally configure as a session-end hook",
    ],
    codeSnippet: `# Install
cp scripts/cleanup-session.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/cleanup-session.sh

# Run manually or configure as hook
~/.claude/scripts/cleanup-session.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "config-diff",
    name: "Config Diff",
    category: "hook",
    description:
      "Compares local Claude Code config against the repo version and shows differences.",
    summary:
      "A shell script companion to the config-sync agent. Produces a colorized diff between your local ~/.claude/ configuration and the claude-code-config repository. Faster than the agent for quick checks — shows exactly which lines changed without the overhead of spawning an AI agent.",
    tags: ["Configuration", "DevOps", "Shell"],
    dependencies: ["Bash", "diff", "Git"],
    integrationSteps: [
      "Copy scripts/config-diff.sh to ~/.claude/scripts/",
      "Update REPO_PATH variable to your clone location",
      "Run to see local vs repo differences",
    ],
    codeSnippet: `# Install
cp scripts/config-diff.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/config-diff.sh

# Run
~/.claude/scripts/config-diff.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "context-health-script",
    name: "Context Health Check",
    category: "hook",
    description:
      "Quick shell-level context window health check without spawning an agent.",
    summary:
      "A lightweight shell script that estimates current context window usage based on conversation length and file reads. Faster than the context-health agent for a quick sanity check. Outputs a simple traffic-light status: green (under 50%), yellow (50-80%), red (over 80%).",
    tags: ["Performance", "Session Management", "Shell"],
    dependencies: ["Bash"],
    integrationSteps: [
      "Copy scripts/context-health.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run mid-session for a quick context check",
    ],
    codeSnippet: `# Install
cp scripts/context-health.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/context-health.sh

# Run
~/.claude/scripts/context-health.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "git-stats",
    name: "Git Stats",
    category: "hook",
    description:
      "Generates commit statistics, contributor activity, and repo health metrics.",
    summary:
      "Produces a formatted report of git repository statistics including commit count, lines changed, most active files, commit frequency, and contributor breakdown. Useful for weekly status reports, sprint retrospectives, or tracking development velocity.",
    tags: ["Git", "DevOps", "Analytics", "Shell"],
    dependencies: ["Bash", "Git"],
    integrationSteps: [
      "Copy scripts/git-stats.sh to your project or ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run in any git repository for stats",
    ],
    codeSnippet: `# Install
cp scripts/git-stats.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/git-stats.sh

# Run in any git repo
~/.claude/scripts/git-stats.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "sync-survey",
    name: "Sync Survey",
    category: "hook",
    description:
      "Surveys all sync points between local config, repos, and remote to detect drift.",
    summary:
      "A pre-sync diagnostic script that surveys the state of all configuration sync points. Checks local ~/.claude/ against the repo, compares branch states across repos, and identifies any environment-specific overrides. Produces a report that the sync-orchestrator agent uses to plan its sync strategy.",
    tags: ["Configuration", "DevOps", "Multi-Repo", "Shell"],
    dependencies: ["Bash", "Git"],
    integrationSteps: [
      "Copy scripts/sync-survey.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run before sync operations for a status overview",
    ],
    codeSnippet: `# Install
cp scripts/sync-survey.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/sync-survey.sh

# Run
~/.claude/scripts/sync-survey.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "validate-mdx",
    name: "Validate MDX",
    category: "hook",
    description:
      "Validates MDX blog post files for correct frontmatter, syntax, and component usage.",
    summary:
      "Parses MDX files and validates frontmatter fields (title, date, description, tags are required), checks for proper component imports, validates code block language annotations, and catches common MDX syntax errors. Can be run as a pre-commit hook to prevent broken blog posts from being committed.",
    tags: ["Blog", "Validation", "MDX", "Shell"],
    dependencies: ["Bash", "Blog content directory"],
    integrationSteps: [
      "Copy scripts/validate-mdx.sh to your project",
      "Make executable: chmod +x",
      "Run against your content directory or individual files",
      "Optionally configure as a pre-commit hook",
    ],
    codeSnippet: `# Install
cp scripts/validate-mdx.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/validate-mdx.sh

# Validate all MDX files
~/.claude/scripts/validate-mdx.sh src/content/blog/

# Validate a single file
~/.claude/scripts/validate-mdx.sh src/content/blog/my-post.mdx`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "wrap-up-survey",
    name: "Wrap-Up Survey",
    category: "hook",
    description:
      "Pre-wrap-up diagnostic that surveys session state before running the full wrap-up.",
    summary:
      "Runs before the /wrap-up skill to gather session state — uncommitted changes, modified files, new learnings, and pending tasks. Produces a structured report that the wrap-up-orchestrator uses to decide which sub-agents to invoke. Skips unnecessary steps (e.g., changelog-writer if no commits since last run).",
    tags: ["Session Management", "Automation", "Shell"],
    dependencies: ["Bash", "Git"],
    integrationSteps: [
      "Copy scripts/wrap-up-survey.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Automatically invoked by /wrap-up or run manually",
    ],
    codeSnippet: `# Install
cp scripts/wrap-up-survey.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/wrap-up-survey.sh

# Run
~/.claude/scripts/wrap-up-survey.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Configurations / Rules ─────────────────────────────────────
  {
    id: "rule-agentic-workflow",
    name: "Agentic Workflow Rules",
    category: "configuration",
    description:
      "Mandatory task decomposition and parallel agent patterns for Claude Code sessions.",
    summary:
      "Defines how Claude Code should break down complex tasks into smaller, parallelizable units of work. Requires the Task tool for multi-step operations, enforces the use of TodoWrite for progress tracking, and establishes patterns for agent orchestration. This is the foundation rule that makes Claude Code behave like a coordinated engineering team rather than a single-threaded assistant.",
    tags: ["Workflow", "Automation", "Core"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/core/agentic-workflow.md to ~/.claude/rules/core/",
      "Rules are loaded automatically on every session",
      "No additional configuration needed",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
cp rules/core/agentic-workflow.md ~/.claude/rules/core/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-coding-style",
    name: "Coding Style Rules",
    category: "configuration",
    description:
      "Immutability preferences, file organization conventions, and writing style enforcement.",
    summary:
      "Establishes coding conventions including preference for immutable data structures, functional patterns over mutation, consistent file organization (exports at top, implementation below), and writing style rules (including the infamous em-dash prohibition). Applied globally across all projects.",
    tags: ["Code Quality", "Style", "Core"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/core/coding-style.md to ~/.claude/rules/core/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
cp rules/core/coding-style.md ~/.claude/rules/core/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-security",
    name: "Security Checklist",
    category: "configuration",
    description:
      "Pre-commit security checklist, secret management, and vulnerability prevention rules.",
    summary:
      "A comprehensive security ruleset that enforces pre-commit scanning for hardcoded secrets, API keys, and credentials. Includes rules for input validation, path traversal prevention, SSRF protection, and secure cookie handling. References OWASP Top 10 and applies security-first thinking to every code change.",
    tags: ["Security", "Core", "OWASP"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/core/security.md to ~/.claude/rules/core/",
      "Automatically active in all sessions",
      "Works with pre-commit-checker agent for enforcement",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
cp rules/core/security.md ~/.claude/rules/core/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-git-workflow",
    name: "Git Workflow Rules",
    category: "configuration",
    description:
      "Conventional commits, PR conventions, and feature branch workflow enforcement.",
    summary:
      "Enforces conventional commit message format, feature branch naming conventions, PR template compliance, and TDD-driven development workflow. Includes rules for commit body formatting (the 'Hulk Hogan body' convention — short, punchy descriptions), branch naming patterns, and merge strategy preferences.",
    tags: ["Git", "Workflow", "Development"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Copy rules/development/git-workflow.md to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
cp rules/development/git-workflow.md ~/.claude/rules/development/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-patterns",
    name: "Architecture Patterns",
    category: "configuration",
    description:
      "Repository pattern, API response envelopes, and architectural conventions.",
    summary:
      "Defines preferred architectural patterns including the Repository pattern for data access, standardized API response envelope format, error handling conventions, and service layer organization. Ensures consistency across all projects.",
    tags: ["Architecture", "API", "Development"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/development/patterns.md to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
cp rules/development/patterns.md ~/.claude/rules/development/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-testing",
    name: "Testing Standards",
    category: "configuration",
    description:
      "TDD enforcement with RED-GREEN-REFACTOR cycle and 80% coverage targets.",
    summary:
      "Enforces test-driven development using the RED-GREEN-REFACTOR cycle. Requires writing failing tests before implementation, sets an 80% code coverage target, and establishes conventions for test file organization, naming, mocking strategies, and assertion patterns. Works with the TDD guide agent from the everything-claude-code plugin.",
    tags: ["Testing", "TDD", "Development"],
    dependencies: ["Claude Code CLI", "Test framework (Vitest, Jest, etc.)"],
    integrationSteps: [
      "Copy rules/development/testing.md to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
cp rules/development/testing.md ~/.claude/rules/development/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-hooks",
    name: "Hooks Configuration",
    category: "configuration",
    description:
      "Hook types, file protection rules, and context preservation strategies.",
    summary:
      "Defines the Claude Code hooks system configuration including pre-commit hooks, session-start hooks, file protection patterns (preventing modification of critical config files), and context preservation hooks that archive important state. Covers hook execution order, error handling, and platform-specific considerations.",
    tags: ["Hooks", "Automation", "Operations"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/operations/hooks.md to ~/.claude/rules/operations/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
cp rules/operations/hooks.md ~/.claude/rules/operations/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-performance",
    name: "Performance & Model Routing",
    category: "configuration",
    description:
      "Model routing (Haiku/Sonnet/Opus) and cost optimization strategies.",
    summary:
      "Defines when to use each model tier for optimal cost-performance balance. Haiku for simple lookups, git operations, and formatting tasks. Sonnet for code generation, analysis, and content writing. Opus for complex architectural decisions and nuanced reasoning. Includes token budget guidelines and strategies for reducing context window consumption.",
    tags: ["Performance", "Cost", "Operations"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/operations/performance.md to ~/.claude/rules/operations/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
cp rules/operations/performance.md ~/.claude/rules/operations/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-windows",
    name: "Windows Platform Rules",
    category: "configuration",
    description:
      "PowerShell stdin, path mangling, and OneDrive workarounds for Windows environments.",
    summary:
      "Captures all the Windows-specific gotchas discovered through painful debugging sessions. Covers PowerShell stdin handling (the $input silent failure), Git Bash path mangling that breaks npm, OneDrive sync interference with node_modules, and Windows-specific hook execution differences. Essential for anyone running Claude Code on Windows.",
    tags: ["Windows", "PowerShell", "Operations", "Platform"],
    dependencies: ["Claude Code CLI", "Windows"],
    integrationSteps: [
      "Copy rules/operations/windows-platform.md to ~/.claude/rules/operations/",
      "Only needed on Windows machines",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install (Windows only)
mkdir -p ~/.claude/rules/operations
cp rules/operations/windows-platform.md ~/.claude/rules/operations/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-agents",
    name: "Agent Orchestration Rules",
    category: "configuration",
    description:
      "Plugin and custom agent coordination, activation triggers, and escalation patterns.",
    summary:
      "Defines how plugin agents (from everything-claude-code) and custom agents work together. Establishes activation triggers — when a planner agent should be invoked vs. a security reviewer vs. a TDD guide. Covers agent escalation patterns, inter-agent communication, and model assignment conventions.",
    tags: ["Agents", "Orchestration", "Operations"],
    dependencies: [
      "Claude Code CLI",
      "everything-claude-code plugin (optional)",
    ],
    integrationSteps: [
      "Copy rules/agents.md to ~/.claude/rules/",
      "Install everything-claude-code plugin for full agent support",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
cp rules/agents.md ~/.claude/rules/

# Optional: install plugin for plugin agents
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  {
    id: "rule-memory-management",
    name: "Memory Management Rules",
    category: "configuration",
    description:
      "Five-layer memory system coordination: auto memory, vector memory, knowledge graph, homunculus, and session archive.",
    summary:
      "Defines how five distinct memory systems work together without duplication. Auto memory (MEMORY.md) handles stable per-project facts. Vector memory stores detailed context queried on demand. The knowledge graph models entity relationships. Homunculus captures behavioral patterns via hooks. Session archives preserve full transcripts. Each system has clear boundaries for what to save and when, plus triggers for writing to vector memory after significant events.",
    tags: ["Memory", "Architecture", "Core"],
    dependencies: [
      "Claude Code CLI",
      "vector-memory MCP server",
      "memory MCP server (knowledge graph)",
    ],
    integrationSteps: [
      "Copy rules/core/memory-management.md to ~/.claude/rules/core/",
      "Ensure vector-memory and memory MCP servers are configured",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
cp rules/core/memory-management.md ~/.claude/rules/core/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-blog-content",
    name: "Blog Content Rules",
    category: "configuration",
    description:
      "Blog writing guardrails: no private repo links, public repo allowlist, link safety checks.",
    summary:
      "Prevents broken links in blog posts by enforcing rules about which GitHub repositories can be linked. Only public repos (chris2ao/cryptoflexllc, chris2ao/claude-code-config) may be linked directly. All other repos are private and must be referenced as inline code without hyperlinks. This rule prevents readers from encountering 404 errors when clicking repository links in published posts.",
    tags: ["Blog", "Content", "Security", "Core"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/content/blog-content.md to ~/.claude/rules/content/",
      "Automatically active in all sessions",
      "Applies when writing or editing blog posts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/content
cp rules/content/blog-content.md ~/.claude/rules/content/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── MCP Servers ────────────────────────────────────────────────
  {
    id: "mcp-memory",
    name: "Memory Server",
    category: "mcp",
    description:
      "Persistent knowledge graph across sessions for cross-session memory.",
    summary:
      "The @modelcontextprotocol/server-memory MCP server provides Claude Code with a persistent knowledge graph that survives across sessions. Claude can store entities, relationships, and observations during a session and retrieve them in future sessions. This is the closest thing to giving Claude a long-term memory. Particularly valuable for project context that would otherwise be lost between sessions — architecture decisions, naming conventions, known issues, and team preferences.",
    tags: ["MCP", "Memory", "Persistence"],
    dependencies: ["Node.js", "npx"],
    integrationSteps: [
      "Ensure Node.js is installed",
      "Run the claude mcp add command below",
      "Memory is available in all future sessions automatically",
      "Claude will store and retrieve knowledge graph entities",
    ],
    codeSnippet: `# Install
claude mcp add --scope user memory \\
  -- npx -y @modelcontextprotocol/server-memory

# Verify
claude mcp list`,
    author: "Anthropic / MCP Community",
    repo: "modelcontextprotocol/servers",
  },
  {
    id: "mcp-context7",
    name: "Context7 (Live Docs)",
    category: "mcp",
    description:
      "Live documentation lookup for any library — gets current docs instead of training data.",
    summary:
      "The @upstash/context7-mcp server gives Claude Code access to live, up-to-date documentation for any library or framework. Instead of relying on potentially outdated training data, Claude can look up the current docs for React, Next.js, Tailwind, or any other library in real time. Eliminates hallucinated API references and ensures you get accurate, version-specific documentation.",
    tags: ["MCP", "Documentation", "Libraries"],
    dependencies: ["Node.js", "npx"],
    integrationSteps: [
      "Ensure Node.js is installed",
      "Run the claude mcp add command below",
      "Claude will automatically use live docs when referencing libraries",
    ],
    codeSnippet: `# Install
claude mcp add --scope user context7 \\
  -- npx -y @upstash/context7-mcp

# Verify
claude mcp list`,
    author: "Upstash",
    repo: "upstash/context7-mcp",
  },

  {
    id: "mcp-vector-memory",
    name: "Vector Memory",
    category: "mcp",
    description:
      "Semantic vector memory for storing, searching, and managing long-term knowledge with embeddings.",
    summary:
      "A persistent vector database MCP server that gives Claude Code semantic memory. Stores memories with embeddings for similarity search, supports tags, quality ratings, and association graphs between related memories. Includes ingestion for bulk-loading documents (PDF, TXT, MD, JSON) and deduplication cleanup. This is the backbone of the five-layer memory system, handling detailed context that auto memory is too small for.",
    tags: ["MCP", "Memory", "Persistence", "Embeddings"],
    dependencies: ["Python 3.10+", "uv (Python package manager)"],
    integrationSteps: [
      "Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh",
      "Clone the vector-memory-mcp repo",
      "Run via: uv run vector-memory-mcp --db-path ~/.claude/memory.db",
      "Add to claude mcp config with appropriate args",
    ],
    codeSnippet: `# Install
claude mcp add --scope user vector-memory \\
  -- uv run --directory /path/to/vector-memory-mcp \\
  vector-memory-mcp --db-path ~/.claude/memory.db

# Key tools: memory_store, memory_search, memory_list,
# memory_delete, memory_ingest, memory_quality, memory_graph`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-github",
    name: "GitHub",
    category: "mcp",
    description:
      "Full GitHub API access: repos, issues, PRs, code search, file contents, and commits.",
    summary:
      "The official GitHub MCP server provides Claude Code with direct access to the GitHub API. Supports repository operations (search, create, fork), issue management (create, update, list, comment), pull request workflows (create, review, merge, list files), code search across repositories, file content retrieval, branch management, and commit history. Essential for any workflow that interacts with GitHub beyond basic git operations.",
    tags: ["MCP", "GitHub", "Git", "DevOps"],
    dependencies: ["GitHub Personal Access Token"],
    integrationSteps: [
      "Generate a GitHub PAT with appropriate scopes",
      "Add the MCP server with your token as an environment variable",
      "Claude Code can now manage repos, issues, and PRs directly",
    ],
    codeSnippet: `# Install
claude mcp add --scope user github \\
  -- npx -y @modelcontextprotocol/server-github

# Set token in environment
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_...

# Key tools: create_pull_request, search_code,
# list_issues, get_file_contents, create_branch`,
    author: "Anthropic / MCP Community",
    repo: "modelcontextprotocol/servers",
  },
  {
    id: "mcp-sequential-thinking",
    name: "Sequential Thinking",
    category: "mcp",
    description:
      "Chain-of-thought reasoning engine for breaking down complex problems step by step.",
    summary:
      "An MCP server that provides structured, multi-step reasoning for complex problems. Supports branching, revision of previous thoughts, and dynamic adjustment of the reasoning depth. Useful for architectural decisions, debugging strategies, and any problem that benefits from explicit step-by-step analysis with the ability to course-correct mid-reasoning.",
    tags: ["MCP", "Reasoning", "Analysis"],
    dependencies: ["Node.js", "npx"],
    integrationSteps: [
      "Install via claude mcp add",
      "Claude uses it automatically for complex reasoning tasks",
      "Supports branching and revision of thought chains",
    ],
    codeSnippet: `# Install
claude mcp add --scope user sequential-thinking \\
  -- npx -y @modelcontextprotocol/server-sequential-thinking

# Verify
claude mcp list`,
    author: "Anthropic / MCP Community",
    repo: "modelcontextprotocol/servers",
  },
  {
    id: "mcp-obsidian",
    name: "Obsidian",
    category: "mcp",
    description:
      "Obsidian vault integration for reading, writing, and searching notes with smart semantic search.",
    summary:
      "Connects Claude Code to your Obsidian knowledge base via the Local REST API plugin. Read and write vault files, search with text or semantic queries, use Dataview DQL for structured queries, patch content relative to headings or blocks, and execute Templater templates. Turns Obsidian into a programmable knowledge layer that Claude Code can query and update during development sessions.",
    tags: ["MCP", "Obsidian", "Notes", "Knowledge"],
    dependencies: [
      "Obsidian with Local REST API plugin",
      "Smart Connections plugin (for semantic search)",
    ],
    integrationSteps: [
      "Install the Local REST API plugin in Obsidian",
      "Enable the API and note the port and API key",
      "Add the Obsidian MCP server to your Claude config",
      "Optionally install Smart Connections for semantic search",
    ],
    codeSnippet: `# Key tools available:
# get_vault_file — read any note
# create_vault_file — create/update notes
# search_vault_simple — text search
# search_vault_smart — semantic search
# patch_vault_file — insert at headings/blocks
# execute_template — run Templater templates
# list_vault_files — browse vault structure`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-project-tools",
    name: "Project Tools",
    category: "mcp",
    description:
      "Custom MCP server with cached repo status, blog post inventory, style guide, and validation.",
    summary:
      "A custom-built MCP server providing project-specific utilities. Includes cached git status across all project repos (faster than running git commands), blog post inventory with frontmatter metadata, blog style guide access, MDX validation against style rules, and session artifact counting. Designed to reduce repeated boilerplate queries during development sessions.",
    tags: ["MCP", "DevOps", "Blog", "Custom"],
    dependencies: ["Node.js", "Project repository access"],
    integrationSteps: [
      "The server is configured in the project's MCP settings",
      "Provides faster access to frequently-queried project data",
      "Results are cached for performance",
    ],
    codeSnippet: `# Key tools available:
# repo_status — cached git status across all repos
# blog_posts — blog inventory with metadata
# style_guide — cached blog reference docs
# validate_blog_post — check MDX against style rules
# session_artifacts — count session outputs`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Learned Skills (23) ────────────────────────────────────────
  {
    id: "learned-powershell-stdin",
    name: "PowerShell stdin Hooks",
    category: "skill",
    description:
      "PowerShell's $input silently fails in hooks. Use [Console]::In.ReadToEnd() + dot-sourcing.",
    summary:
      "When Claude Code hooks are invoked via PowerShell's -File parameter, the $input automatic variable silently returns nothing. The fix is to use [Console]::In.ReadToEnd() for reading stdin and invoke the script via dot-sourcing instead of -File. This is a platform-specific gotcha that wastes hours if you don't know about it.",
    tags: ["PowerShell", "Windows", "Hooks", "Platform"],
    dependencies: ["PowerShell", "Claude Code CLI"],
    integrationSteps: [
      "Replace $input with [Console]::In.ReadToEnd() in hook scripts",
      "Use dot-sourcing (. ./script.ps1) instead of -File parameter",
      "Test hooks in isolation before integrating",
    ],
    codeSnippet: `# Wrong — $input silently returns nothing
$hookData = $input | ConvertFrom-Json

# Correct — explicit stdin read
$hookData = [Console]::In.ReadToEnd() | ConvertFrom-Json`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-mcp-config-location",
    name: "MCP Config Location",
    category: "skill",
    description:
      "~/.claude/mcp-servers.json is for Claude Desktop, not Claude Code. Use ~/.claude.json.",
    summary:
      "A common mistake: creating ~/.claude/mcp-servers.json to configure MCP servers for Claude Code. That file is for Claude Desktop. Claude Code reads its MCP configuration from ~/.claude.json (or via the claude mcp add CLI command). Mixing these up results in MCP servers that appear configured but never actually connect.",
    tags: ["MCP", "Configuration", "Claude Code"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Use 'claude mcp add' command instead of editing files directly",
      "Check ~/.claude.json for Claude Code MCP config",
      "Check ~/.claude/mcp-servers.json only for Claude Desktop",
    ],
    codeSnippet: `# Correct: use the CLI
claude mcp add --scope user memory \\
  -- npx -y @modelcontextprotocol/server-memory

# Verify config location
cat ~/.claude.json  # Claude Code
cat ~/.claude/mcp-servers.json  # Claude Desktop (different!)`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-command-yaml",
    name: "Command YAML Frontmatter",
    category: "skill",
    description:
      "Custom slash commands are silently ignored without YAML frontmatter.",
    summary:
      "Claude Code custom commands in the commands/ directory require YAML frontmatter at the top of the .md file. Without it, the command file is silently ignored — no error, no warning, just nothing happens when you type the slash command. The frontmatter must include at minimum a name field.",
    tags: ["Commands", "Claude Code", "Configuration"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Add YAML frontmatter to all command .md files",
      "Include at minimum: name field",
      "Test command registration with /help",
    ],
    codeSnippet: `---
name: my-command
description: What this command does
---

# Command instructions below the frontmatter
Your prompt content here...`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-git-bash-path",
    name: "Git Bash Path Mangling",
    category: "skill",
    description:
      "Git Bash rewrites Windows paths, breaking npm module resolution.",
    summary:
      "Git Bash on Windows automatically rewrites paths that look like Unix paths, which breaks npm module resolution when paths contain forward slashes. The MSYS_NO_PATHCONV=1 environment variable disables this behavior. This affects any command that passes paths as arguments through Git Bash.",
    tags: ["Windows", "Git", "Platform", "npm"],
    dependencies: ["Git Bash", "Windows"],
    integrationSteps: [
      "Set MSYS_NO_PATHCONV=1 before commands that use paths",
      "Or add to .bashrc for persistent fix",
      "Use PowerShell instead of Git Bash when possible",
    ],
    codeSnippet: `# Fix: disable path mangling
export MSYS_NO_PATHCONV=1
npm install some-package

# Or per-command
MSYS_NO_PATHCONV=1 node ./scripts/build.js`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-nextjs-metadata",
    name: "Next.js Client Metadata",
    category: "skill",
    description:
      "Can't export metadata from 'use client' components. Fix: wrapper layout.tsx.",
    summary:
      "Next.js App Router doesn't allow exporting the metadata object from components marked with 'use client'. The fix is to create a separate layout.tsx file (server component) that exports the metadata, and keep the client component as page.tsx. This pattern is required for any page that needs both client-side interactivity and SEO metadata.",
    tags: ["Next.js", "React", "SEO"],
    dependencies: ["Next.js 13+"],
    integrationSteps: [
      "Create layout.tsx in the route directory for metadata export",
      "Keep page.tsx as the client component",
      "Move metadata export from page.tsx to layout.tsx",
    ],
    codeSnippet: `// layout.tsx (server component)
export const metadata = {
  title: "My Page",
  description: "Page description for SEO",
};
export default function Layout({ children }) {
  return children;
}

// page.tsx (client component)
"use client";
export default function Page() {
  return <div>Interactive content</div>;
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-mdx-sort",
    name: "MDX Same-Date Sort",
    category: "skill",
    description:
      "Blog posts with identical date strings sort non-deterministically. Use ISO timestamps.",
    summary:
      "When multiple MDX blog posts share the same date string (e.g., '2026-02-14'), their sort order becomes non-deterministic across builds. The fix is to use full ISO timestamps with time components (e.g., '2026-02-14T08:00:00') to guarantee consistent ordering.",
    tags: ["MDX", "Blog", "Next.js"],
    dependencies: ["MDX content system"],
    integrationSteps: [
      "Update all blog post dates to include time: '2026-02-14T08:00:00'",
      "Ensure sort function uses getTime() for comparison",
      "Add time offsets to same-day posts",
    ],
    codeSnippet: `---
# Wrong — non-deterministic when multiple posts share a date
date: "2026-02-14"

# Correct — deterministic ordering
date: "2026-02-14T08:00:00"
---`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-slug-traversal",
    name: "Slug Path Traversal Guard",
    category: "skill",
    description:
      "URL slug parameters in path.join() allow path traversal attacks. Always validate.",
    summary:
      "Using user-supplied URL slugs directly in path.join() or fs.readFile() enables path traversal attacks (e.g., ../../../etc/passwd). Always validate slugs against a whitelist or check for directory separator characters before using them in file system operations. This is a critical security issue in any dynamic routing system.",
    tags: ["Security", "OWASP", "Next.js"],
    dependencies: [],
    integrationSteps: [
      "Add slug validation before any file system operation",
      "Check for '/', '\\\\', and '..' in slug values",
      "Use allowlist comparison when possible",
    ],
    codeSnippet: `// Guard against path traversal
export function getPostBySlug(slug: string) {
  if (
    slug.includes("/") ||
    slug.includes("\\\\") ||
    slug.includes("..")
  ) {
    return undefined;
  }
  // Safe to use slug in path operations
  const filePath = path.join(contentDir, \`\${slug}.mdx\`);
  return fs.readFileSync(filePath, "utf-8");
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-cookie-auth",
    name: "Cookie Auth over Query Strings",
    category: "skill",
    description:
      "Use httpOnly cookies with HMAC tokens, not ?secret=X in URLs.",
    summary:
      "Passing authentication tokens as URL query parameters (?secret=abc123) exposes them in server logs, browser history, referer headers, and analytics. The secure alternative is httpOnly cookies with HMAC-derived tokens. This applies to any authenticated endpoint, including admin dashboards, API routes, and webhook callbacks.",
    tags: ["Security", "Authentication", "OWASP"],
    dependencies: [],
    integrationSteps: [
      "Replace query string auth with httpOnly cookies",
      "Generate HMAC tokens from a server-side secret",
      "Set Secure, SameSite, and httpOnly flags on cookies",
    ],
    codeSnippet: `// Wrong — secret in URL
// GET /admin?secret=abc123

// Correct — httpOnly cookie
import { cookies } from "next/headers";
import crypto from "crypto";

function setAuthCookie(secret: string) {
  const token = crypto
    .createHmac("sha256", process.env.AUTH_SECRET!)
    .update(secret)
    .digest("hex");
  cookies().set("auth", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-ssrf-prevention",
    name: "SSRF IP Validation",
    category: "skill",
    description:
      "Validate IPs against private ranges before making external API calls.",
    summary:
      "Server-Side Request Forgery (SSRF) attacks trick your server into making requests to internal services. Before making any outbound HTTP request with a user-supplied URL, resolve the hostname and validate the IP isn't in private ranges (10.x, 172.16-31.x, 192.168.x, 127.x, ::1). This prevents attackers from using your server as a proxy to internal infrastructure.",
    tags: ["Security", "OWASP", "API"],
    dependencies: [],
    integrationSteps: [
      "Add IP validation function to your HTTP client wrapper",
      "Resolve hostnames before making requests",
      "Block requests to private IP ranges",
    ],
    codeSnippet: `import dns from "dns/promises";

const PRIVATE_RANGES = [
  /^10\\./,
  /^172\\.(1[6-9]|2\\d|3[01])\\./,
  /^192\\.168\\./,
  /^127\\./,
  /^0\\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
];

async function isSafeUrl(url: string): Promise<boolean> {
  const { hostname } = new URL(url);
  const { address } = await dns.lookup(hostname);
  return !PRIVATE_RANGES.some((r) => r.test(address));
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-shallow-fetch",
    name: "Shallow Fetch Force Push",
    category: "skill",
    description:
      "git fetch --depth=1 then git push --force fails. Use full fetch first.",
    summary:
      "Shallow clones (git fetch --depth=1) don't have enough history for force pushes to work correctly. Git needs the full commit graph to calculate what to push. The fix is to run git fetch --unshallow or a full fetch before any force push operation. This commonly bites CI/CD pipelines that use shallow clones for speed.",
    tags: ["Git", "CI/CD", "DevOps"],
    dependencies: ["Git"],
    integrationSteps: [
      "Run git fetch --unshallow before force push operations",
      "Or use full fetch in CI/CD instead of --depth=1",
      "Check if repo is shallow: git rev-parse --is-shallow-repository",
    ],
    codeSnippet: `# Wrong — fails with shallow clone
git fetch --depth=1 origin main
git push --force origin feature

# Correct — full fetch first
git fetch --unshallow origin
git push --force origin feature

# Check if shallow
git rev-parse --is-shallow-repository  # true/false`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-vercel-waf",
    name: "Vercel WAF Syntax",
    category: "skill",
    description:
      "vercel.json uses routes with mitigate, not rules. Syntax is unique.",
    summary:
      "Vercel's Web Application Firewall configuration in vercel.json uses a non-obvious syntax. Security rules go under a 'routes' array with 'mitigate' objects, not under a 'rules' key. The mitigate object uses conditions with rate limiting, IP blocking, and geographic restrictions. Getting the syntax wrong results in silent failures — no errors, just no protection.",
    tags: ["Security", "Vercel", "DevOps", "Configuration"],
    dependencies: ["Vercel"],
    integrationSteps: [
      "Add mitigate rules under 'routes' in vercel.json",
      "Test with vercel dev before deploying",
      "Verify rules are active in Vercel dashboard",
    ],
    codeSnippet: `// vercel.json — correct WAF syntax
{
  "routes": [
    {
      "src": "/api/(.*)",
      "mitigate": {
        "rateLimit": {
          "window": "1m",
          "limit": 60
        }
      }
    }
  ]
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-anthropic-model-id",
    name: "Anthropic Model ID Format",
    category: "skill",
    description:
      "Haiku requires exact date suffix (-20251001), not -latest.",
    summary:
      "When using the Anthropic API, Haiku model IDs require an exact date suffix (e.g., claude-3-5-haiku-20251001). Using -latest or omitting the date suffix may not work as expected for all model tiers. Always check the current model IDs in the Anthropic documentation before hardcoding them.",
    tags: ["API", "Anthropic", "Claude Code"],
    dependencies: ["Anthropic API"],
    integrationSteps: [
      "Use exact model IDs with date suffixes",
      "Check docs.anthropic.com for current model IDs",
      "Update hardcoded IDs when new versions release",
    ],
    codeSnippet: `// Wrong — may not resolve correctly
const model = "claude-3-5-haiku-latest";

// Correct — exact date suffix
const model = "claude-3-5-haiku-20251001";

// Sonnet and Opus support -latest
const sonnet = "claude-sonnet-4-20250514";`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-vitest-mock",
    name: "Vitest Class Mock Constructor",
    category: "skill",
    description:
      "Arrow functions can't be new'd. Use class in vi.mock factories.",
    summary:
      "When mocking classes in Vitest, using arrow functions in vi.mock() factories fails because arrow functions can't be called with new. The fix is to use a class declaration or a regular function inside the mock factory. This is a JavaScript language constraint, not a Vitest bug.",
    tags: ["Testing", "Vitest", "TypeScript"],
    dependencies: ["Vitest"],
    integrationSteps: [
      "Replace arrow functions with classes in vi.mock factories",
      "Use regular functions if class syntax is too verbose",
      "Test mock instantiation separately",
    ],
    codeSnippet: `// Wrong — arrow functions can't be new'd
vi.mock("./MyClass", () => ({
  MyClass: () => ({ doThing: vi.fn() }),
}));

// Correct — use a class
vi.mock("./MyClass", () => ({
  MyClass: class {
    doThing = vi.fn();
  },
}));`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-token-safety",
    name: "Token Secret Safety",
    category: "skill",
    description:
      "Reading config files with plaintext API keys exposes them in session transcripts.",
    summary:
      "When Claude Code reads files that contain API keys, tokens, or secrets, those values become part of the session transcript. This means they persist in conversation history and could be exposed through session archiving or logging. The fix is to use environment variables and .env files (which Claude Code should be configured to never read), and validate that sensitive config files are in .gitignore.",
    tags: ["Security", "Configuration", "Claude Code"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Move all secrets to .env files",
      "Add .env to .gitignore",
      "Configure Claude Code to skip .env files in file reads",
      "Use process.env references instead of reading config files",
    ],
    codeSnippet: `# .gitignore
.env
.env.local
.env.production

# Access secrets via environment variables
# Never read .env files directly in Claude Code sessions
const apiKey = process.env.API_KEY;`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-heredoc-pollution",
    name: "HEREDOC Permission Pollution",
    category: "skill",
    description:
      "HEREDOC commit bodies with parentheses pollute auto-approved permissions.",
    summary:
      "When using HEREDOC syntax for git commit messages that contain parentheses, Claude Code's auto-approval system may incorrectly parse the parentheses as permission patterns, polluting the approved permissions list. The fix is to use single-quoted HEREDOC delimiters (<<'EOF') to prevent shell expansion, and avoid special characters in commit message bodies.",
    tags: ["Git", "Claude Code", "Security"],
    dependencies: ["Claude Code CLI", "Git"],
    integrationSteps: [
      "Use single-quoted HEREDOC delimiters: <<'EOF'",
      "Avoid parentheses in commit message bodies when possible",
      "Review auto-approved permissions periodically",
    ],
    codeSnippet: `# Wrong — parentheses may pollute permissions
git commit -m "$(cat <<EOF
feat: add auth (JWT-based)
EOF
)"

# Correct — single-quoted delimiter
git commit -m "$(cat <<'EOF'
feat: add auth (JWT-based)
EOF
)"`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-mdx-design-system",
    name: "MDX Blog Design System",
    category: "skill",
    description:
      "Custom MDX callout components and product badges for rich blog posts.",
    summary:
      "A design system for MDX blog posts including Warning, Stop, Info, Tip, and Security callout components, plus product logo badges (Vercel, Cloudflare, Next.js). These components are registered with MDXRemote and available in all blog posts without explicit imports. Standardizes the visual language across all content.",
    tags: ["Blog", "MDX", "Design", "Components"],
    dependencies: ["next-mdx-remote", "React", "Tailwind CSS"],
    integrationSteps: [
      "Create callout components in src/components/mdx/",
      "Register components with MDXRemote in the blog renderer",
      "Use directly in MDX files: <Warning>text</Warning>",
    ],
    codeSnippet: `{/* Available in any MDX blog post */}

<Warning>This action cannot be undone.</Warning>

<Tip>Use keyboard shortcuts for faster navigation.</Tip>

<Security>
  Always validate user input on the server side.
</Security>

<Info>This feature requires Next.js 13+.</Info>`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-debug-diagnostics",
    name: "Claude Code Debug Diagnostics",
    category: "skill",
    description:
      "claude doctor requires interactive TTY. Use --debug --debug-file instead.",
    summary:
      "The claude doctor command requires an interactive TTY and fails in non-interactive environments (CI, background processes, screen/tmux sometimes). The alternative is to use --debug and --debug-file flags to write diagnostic output to a file, then analyze that file. This is the reliable way to debug Claude Code connection and configuration issues.",
    tags: ["Claude Code", "Debugging", "DevOps"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Use --debug --debug-file=/tmp/claude-debug.log",
      "Analyze the debug file for connection/config issues",
      "Use claude doctor only in interactive terminals",
    ],
    codeSnippet: `# When claude doctor fails (non-interactive)
claude --debug --debug-file=/tmp/claude-debug.log

# Then read the log
cat /tmp/claude-debug.log

# Interactive terminals can use doctor
claude doctor`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-ps-var-stripping",
    name: "Git Bash Variable Stripping",
    category: "skill",
    description:
      "Git Bash strips $ from inline PowerShell commands. Fix: use temp .ps1 files.",
    summary:
      "When running PowerShell commands from Git Bash, the $ character in variable references gets stripped by Bash's shell expansion before PowerShell receives the command. This means $env:PATH becomes env:PATH, silently breaking the command. The fix is to write PowerShell commands to a temporary .ps1 file and execute that file, bypassing Bash's expansion entirely.",
    tags: ["Windows", "PowerShell", "Git", "Platform"],
    dependencies: ["Git Bash", "PowerShell", "Windows"],
    integrationSteps: [
      "Write PowerShell commands to temp .ps1 files",
      "Execute via: powershell -File ./temp-script.ps1",
      "Delete temp file after execution",
    ],
    codeSnippet: `# Wrong — Git Bash strips the $
powershell -Command "echo $env:PATH"
# PowerShell receives: echo env:PATH

# Correct — use a temp file
echo 'echo $env:PATH' > /tmp/script.ps1
powershell -File /tmp/script.ps1
rm /tmp/script.ps1`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Missing Skill: /sync ───────────────────────────────────────
  {
    id: "sync",
    name: "/sync",
    category: "skill",
    description:
      "Config synchronization tool that detects drift and syncs ~/.claude/ with target repos.",
    summary:
      "A synchronization skill that runs a survey to detect configuration drift between your local ~/.claude/ directory and two target repositories (claude-code-config and CJClaudin_home). Prompts which repos to sync and how to handle post-copy operations (commit + push, review first, or copy files only). Uses the sync-orchestrator agent under the hood with secret-detection scanning before any copy.",
    tags: ["Configuration", "DevOps", "Git", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "sync-orchestrator agent",
      "sync-survey.sh script",
    ],
    integrationSteps: [
      "Copy skills/sync/SKILL.md to ~/.claude/skills/sync/SKILL.md",
      "Ensure agents/sync-orchestrator.md is installed",
      "Ensure scripts/sync-survey.sh is installed and executable",
      "Run /sync to detect drift and synchronize configs",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/sync
cp skills/sync/SKILL.md ~/.claude/skills/sync/SKILL.md

# Usage
/sync`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Missing Learned Skills (5) ─────────────────────────────────
  {
    id: "learned-context-compaction",
    name: "Context Compaction Pre-Flight",
    category: "skill",
    description:
      "Strategic planning for massive sessions (900+ turns). Plan phases, commit incrementally.",
    summary:
      "Long Claude Code sessions (900+ turns, 30MB+ transcripts) require strategic planning to avoid context window exhaustion. The key is to plan work in phases, commit after each phase, update MEMORY.md with progress, and compact the context between phases. Without this, the last 20% of context produces noticeably lower quality output as the model struggles to maintain coherence across the full history.",
    tags: ["Performance", "Session Management", "Workflow"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Plan work in discrete phases before starting",
      "Commit and push after each phase completes",
      "Update MEMORY.md with phase progress and decisions",
      "Compact context between phases using /compact",
    ],
    codeSnippet: `# Session planning pattern
# Phase 1: Research and plan (commit when done)
# Phase 2: Implement core feature (commit when done)
# Phase 3: Tests and validation (commit when done)
# Phase 4: Documentation and cleanup (commit when done)

# Between each phase:
# 1. Commit all changes
# 2. Update MEMORY.md with decisions
# 3. Use /compact to free context
# 4. Start next phase with fresh context`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-interactive-freeze",
    name: "Interactive Mode Freeze Recovery",
    category: "skill",
    description:
      "TUI freeze from corrupted project state. Fix: rename project state dir, restart.",
    summary:
      "Claude Code's interactive TUI can freeze when the project state directory (~/.claude/projects/...) becomes corrupted, often from a crashed session or concurrent access. The fix is to rename the corrupted project state directory and restart Claude Code — it recreates the state directory automatically. This is faster than debugging the corruption.",
    tags: ["Claude Code", "Debugging", "Recovery"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Identify the frozen project state directory in ~/.claude/projects/",
      "Rename it: mv <dir> <dir>.bak",
      "Restart Claude Code — state is recreated automatically",
      "If the issue persists, check for disk space or permission issues",
    ],
    codeSnippet: `# Find the project state directory
ls ~/.claude/projects/

# Rename the corrupted state
mv ~/.claude/projects/<project-hash> \\
   ~/.claude/projects/<project-hash>.bak

# Restart Claude Code
claude`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-settings-validation",
    name: "Settings Validation Debugging",
    category: "skill",
    description:
      "\"Found N invalid settings files\" — debug with --debug, check YAML quoting and MCP type field.",
    summary:
      "The cryptic 'Found N invalid settings files' error on Claude Code startup usually means a settings.json or settings.local.json file has syntax issues. Common causes: missing quotes around YAML values, missing \"type\": \"stdio\" in MCP server configs, or trailing commas in JSON. Debug with `claude --debug` to see which specific file is invalid, then fix the syntax.",
    tags: ["Claude Code", "Configuration", "Debugging"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Run claude --debug to identify the invalid file",
      "Check for missing 'type': 'stdio' in MCP configs",
      "Validate JSON syntax (no trailing commas, proper quoting)",
      "Re-run claude to verify the fix",
    ],
    codeSnippet: `# Debug to find the invalid file
claude --debug 2>&1 | grep -i "invalid\\|error\\|settings"

# Common fix: add missing type to MCP configs
# Wrong:
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}

# Correct — add "type": "stdio"
{
  "mcpServers": {
    "memory": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-blog-pipeline",
    name: "Blog Post Production Pipeline",
    category: "skill",
    description:
      "Repeatable 8-step blog pipeline. Always delegate writing to Sonnet. Calibrate tone from recent posts.",
    summary:
      "A battle-tested 8-step pipeline for producing consistent, high-quality blog posts with Claude Code. Key insights: always delegate prose writing to Sonnet (not Haiku or Opus), read 2-3 recent posts to calibrate tone and style before writing, use dynamic post discovery (scan the directory) instead of hardcoded post lists, and validate MDX output before committing. The pipeline covers topic selection, research, outline, writing, validation, review, series navigation, and publish.",
    tags: ["Blog", "Content", "Workflow", "Automation"],
    dependencies: ["Claude Code CLI", "MDX content system"],
    integrationSteps: [
      "Use /blog-post skill for the full automated pipeline",
      "Or follow the 8 steps manually for more control",
      "Always read 2-3 recent posts before writing for tone calibration",
      "Validate MDX with validate-mdx.sh before committing",
    ],
    codeSnippet: `# The 8-step blog production pipeline:
# 1. Topic Selection — interactive prompts
# 2. Research — parallel agents mine git logs, changelogs
# 3. Tone Calibration — read 2-3 recent posts
# 4. Outline — structure with sections, callouts
# 5. Write — delegate to Sonnet via blog-post-orchestrator
# 6. Validate — em dashes, GIFs, frontmatter, MDX syntax
# 7. Review — code review pass for technical accuracy
# 8. Publish — build, commit, push

# Quick start:
/blog-post`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "learned-parallel-decomposition",
    name: "Parallel Agent Decomposition",
    category: "skill",
    description:
      "Break tasks into parallel agents for 45% time savings. Route by specialization.",
    summary:
      "Complex tasks should be decomposed into parallel agents rather than executed sequentially. A case study on em-dash removal across 20 blog posts showed 45% time savings using 4 parallel Haiku agents vs. sequential processing. The routing heuristic: Haiku for exploration and file scanning, Sonnet for content generation and analysis, Opus for architecture and security decisions. Each agent gets a focused scope and returns structured results to a captain agent for synthesis.",
    tags: ["Performance", "Workflow", "Automation", "Architecture"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Identify independent sub-tasks in your workflow",
      "Assign each to a parallel Task agent with the right model",
      "Use a captain agent pattern to collect and synthesize results",
      "Route: Haiku=scan, Sonnet=generate, Opus=decide",
    ],
    codeSnippet: `# Captain Agent Pattern example:
# 1. Captain (Sonnet) breaks down the task
# 2. Spawns parallel workers:
#    Task(model="haiku")  — scan files
#    Task(model="haiku")  — check dependencies
#    Task(model="haiku")  — validate configs
# 3. Captain collects results and synthesizes

# Model routing heuristic:
# Haiku  — exploration, file scanning, formatting
# Sonnet — code generation, analysis, writing
# Opus   — architecture, security, complex reasoning`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Lifecycle Hooks ─────────────────────────────────────────────
  {
    id: "hook-save-session",
    name: "Save Session Hook",
    category: "hook",
    description:
      "SessionEnd hook that archives full conversation transcripts with timestamps and summaries.",
    summary:
      "A PowerShell hook script that triggers on SessionEnd events. Archives the full conversation transcript with a timestamp and session ID, creates a human-readable summary, and updates an index file for easy browsing. This creates a persistent, searchable archive of all your Claude Code sessions — invaluable for the session-analyzer and skill-extractor agents.",
    tags: ["Session Management", "PowerShell", "Automation", "Hooks"],
    dependencies: ["PowerShell", "Claude Code CLI"],
    integrationSteps: [
      "Copy save-session.ps1 to .claude/hooks/ in your project",
      "Add SessionEnd hook entry to .claude/settings.local.json",
      "Set async: false to ensure archival completes before exit",
      "Transcripts are saved with timestamps for later analysis",
    ],
    codeSnippet: `# .claude/settings.local.json
{
  "hooks": {
    "SessionEnd": [
      {
        "type": "command",
        "command": "powershell -File .claude/hooks/save-session.ps1",
        "async": false
      }
    ]
  }
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-log-activity",
    name: "Log Activity Hook",
    category: "hook",
    description:
      "PostToolUse hook that logs every Bash/Edit/Write operation with timestamps to activity_log.txt.",
    summary:
      "An async PowerShell hook that fires after every tool use (Bash, Edit, Write, NotebookEdit). Logs each operation with a timestamp, session ID, tool name, and operation details to an activity_log.txt file. This creates an audit trail of everything Claude Code does in your project — useful for debugging, compliance, and understanding session patterns. Runs async to avoid slowing down the main workflow.",
    tags: ["Monitoring", "PowerShell", "Automation", "Hooks"],
    dependencies: ["PowerShell", "Claude Code CLI"],
    integrationSteps: [
      "Copy log-activity.ps1 to .claude/hooks/ in your project",
      "Add PostToolUse hook entry to .claude/settings.local.json",
      "Set async: true so logging doesn't block operations",
      "Review activity_log.txt for audit trail",
    ],
    codeSnippet: `# .claude/settings.local.json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "powershell -File .claude/hooks/log-activity.ps1",
        "async": true
      }
    ]
  }
}

# Output format in activity_log.txt:
# [2026-02-20T14:30:00] (session-abc) Bash | npm run build
# [2026-02-20T14:30:05] (session-abc) Edit | src/app/page.tsx`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },


  // ── New Lifecycle Hooks ────────────────────────────────────────
  {
    id: "hook-file-guard",
    name: "File Guard Hook",
    category: "hook",
    description:
      "PreToolUse hook that blocks edits on sensitive files like settings.json, memory.db, and env files.",
    summary:
      "A protective hook that fires before any tool use and blocks modifications to sensitive files. Prevents accidental edits to settings.json, memory databases, environment files, and other critical configuration. Acts as a safety net against both human error and AI agent mistakes.",
    tags: ["Security", "Hooks", "Protection", "Automation"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/file-guard.sh to ~/.claude/hooks/",
      "Add PreToolUse hook entry to settings.json",
      "Configure protected file patterns in the script",
    ],
    codeSnippet: `# settings.json hook config
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/file-guard.sh"
      }
    ]
  }
}`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-kg-update-detect",
    name: "Knowledge Graph Update Detector",
    category: "hook",
    description:
      "PostToolUse hook that detects changes to the knowledge graph and logs entity updates.",
    summary:
      "Monitors tool use for operations that modify the knowledge graph (via the memory MCP server) and logs entity additions, updates, and relationship changes. Provides an audit trail of how the knowledge graph evolves across sessions.",
    tags: ["Memory", "Hooks", "Knowledge Graph", "Monitoring"],
    dependencies: ["Bash", "Claude Code CLI", "memory MCP server"],
    integrationSteps: [
      "Copy hooks/kg-update-detect.sh to ~/.claude/hooks/",
      "Add PostToolUse hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/kg-update-detect.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/kg-update-detect.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-memory-checkpoint",
    name: "Memory Checkpoint Hook",
    category: "hook",
    description:
      "Stop hook that runs an end-of-session memory checklist before allowing session exit.",
    summary:
      "Fires on session stop events and runs a checklist to ensure important context has been persisted to memory systems. Checks for unsaved learnings, uncommitted knowledge graph updates, and pending vector memory writes. Warns if the session is ending with important context that would be lost.",
    tags: ["Memory", "Hooks", "Session Management", "Automation"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/memory-checkpoint.sh to ~/.claude/hooks/",
      "Add Stop hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/memory-checkpoint.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/memory-checkpoint.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-memory-nudge",
    name: "Memory Nudge Hook",
    category: "hook",
    description:
      "PostToolUse hook that reminds Claude to save important context to memory systems.",
    summary:
      "A gentle nudge hook that monitors tool use patterns and reminds Claude to persist important context when it detects significant events (new debugging patterns, architecture decisions, configuration changes) that should be saved to vector memory or the knowledge graph.",
    tags: ["Memory", "Hooks", "Automation"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/memory-nudge.sh to ~/.claude/hooks/",
      "Add PostToolUse hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/memory-nudge.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/memory-nudge.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-observe-homunculus",
    name: "Homunculus Observer Hook",
    category: "hook",
    description:
      "PostToolUse hook that captures behavioral observations for the Homunculus learning system.",
    summary:
      "The data collection hook for the Homunculus continuous learning system. Observes Claude Code's behavior during sessions and captures patterns: debugging approaches, tool usage sequences, common mistakes, and successful strategies. These observations feed into the instincts system where they can eventually be promoted to learned skills or new agents.",
    tags: ["Homunculus", "Learning", "Hooks", "Automation"],
    dependencies: ["Bash", "Claude Code CLI", "Homunculus instincts directory"],
    integrationSteps: [
      "Copy hooks/observe-homunculus.sh to ~/.claude/hooks/",
      "Ensure homunculus/instincts/ directory exists",
      "Add PostToolUse hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/observe-homunculus.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/observe-homunculus.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-session-scratchpad",
    name: "Session Scratchpad Hook",
    category: "hook",
    description:
      "PostToolUse hook that writes session state to a scratchpad file for context preservation.",
    summary:
      "Maintains a running scratchpad of the current session state including active tasks, modified files, key decisions, and in-progress work. Updated after each tool use. The scratchpad survives context compaction and can be loaded into new sessions for continuity.",
    tags: ["Session Management", "Hooks", "Context", "Automation"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/session-scratchpad.sh to ~/.claude/hooks/",
      "Add PostToolUse hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/session-scratchpad.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/session-scratchpad.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-pre-compact",
    name: "Pre-Compact Hook",
    category: "hook",
    description:
      "PreCompact hook that preserves critical context before context window compaction.",
    summary:
      "Fires before Claude Code compacts the context window and saves critical state that might be lost during compaction. Captures current task progress, key decisions, and working memory to a checkpoint file that can be referenced after compaction. Ensures continuity across compaction boundaries.",
    tags: ["Performance", "Hooks", "Context", "Session Management"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/pre-compact.sh to ~/.claude/hooks/",
      "Add PreCompact hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/pre-compact.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/pre-compact.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-prompt-notify",
    name: "Prompt Notification Hook",
    category: "hook",
    description:
      "Stop hook that plays a notification sound when Claude Code needs user attention.",
    summary:
      "Plays an audio notification when a Claude Code session stops and needs user input. Useful for long-running tasks where you've switched to another window. Uses platform-native sound commands (afplay on macOS, paplay on Linux).",
    tags: ["Hooks", "Notifications", "Productivity"],
    dependencies: ["Bash", "Audio system"],
    integrationSteps: [
      "Copy hooks/prompt-notify.sh to ~/.claude/hooks/",
      "Add Stop hook entry to settings.json",
    ],
    codeSnippet: `# Install
cp hooks/prompt-notify.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/prompt-notify.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-dispatch",
    name: "Hook Dispatcher",
    category: "hook",
    description:
      "Central routing dispatcher that fans out hook events to multiple handler scripts.",
    summary:
      "A meta-hook that acts as a central dispatcher for multiple hook event types. Instead of configuring each hook individually in settings.json, configure dispatch.sh once and it routes events to the appropriate handler scripts based on event type. Simplifies hook management when you have many hooks installed.",
    tags: ["Hooks", "Automation", "Architecture"],
    dependencies: ["Bash", "Claude Code CLI"],
    integrationSteps: [
      "Copy hooks/dispatch.sh to ~/.claude/hooks/",
      "Configure as the single hook handler for each event type",
      "Add handler scripts to the dispatch routing table",
    ],
    codeSnippet: `# Install
cp hooks/dispatch.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/dispatch.sh

# Single dispatcher handles all events
# instead of configuring each hook separately`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── New Scripts ────────────────────────────────────────────────
  {
    id: "sync-status",
    name: "Sync Status",
    category: "hook",
    description:
      "Quick sync status check showing local vs remote config drift at a glance.",
    summary:
      "A lightweight companion to sync-survey.sh that gives a quick pass/fail status for each sync point. Shows which configs are in sync, which have local changes, and which have upstream updates. Faster than the full survey for a quick health check.",
    tags: ["Configuration", "DevOps", "Shell"],
    dependencies: ["Bash", "Git"],
    integrationSteps: [
      "Copy scripts/sync-status.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run for a quick sync overview",
    ],
    codeSnippet: `# Install
cp scripts/sync-status.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/sync-status.sh

# Run
~/.claude/scripts/sync-status.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-voice-diff",
    name: "Blog Voice Diff",
    category: "hook",
    description:
      "Compares a draft blog post's voice against the established style guide and recent posts.",
    summary:
      "Quantitative voice analysis tool that compares a draft post against the established voice profile. Measures sentence length distribution, vocabulary complexity, tone markers, and stylistic patterns. Produces a diff report showing where the draft deviates from the target voice. Used by the blog-voice agent for automated consistency checks.",
    tags: ["Blog", "Content", "Voice", "Analysis"],
    dependencies: ["Bash", "Blog content directory"],
    integrationSteps: [
      "Copy scripts/blog-voice-diff.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run against a draft MDX file",
    ],
    codeSnippet: `# Install
cp scripts/blog-voice-diff.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/blog-voice-diff.sh

# Run
~/.claude/scripts/blog-voice-diff.sh src/content/blog/draft.mdx`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "env-script",
    name: "Environment Setup",
    category: "hook",
    description:
      "Shared environment variables and path configuration for all scripts and hooks.",
    summary:
      "A sourced script that establishes shared environment variables used by all other scripts and hooks. Sets paths to repos, config directories, memory databases, and platform-specific variables. Sourced at the top of other scripts to ensure consistent configuration.",
    tags: ["Configuration", "Shell", "Environment"],
    dependencies: ["Bash"],
    integrationSteps: [
      "Copy scripts/env.sh to ~/.claude/scripts/",
      "Source from other scripts: source ~/.claude/scripts/env.sh",
      "Update paths for your environment",
    ],
    codeSnippet: `# Install
cp scripts/env.sh ~/.claude/scripts/

# Source in other scripts
source ~/.claude/scripts/env.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "memory-maintenance",
    name: "Memory Maintenance",
    category: "hook",
    description:
      "Python script for vector memory database cleanup, deduplication, and quality scoring.",
    summary:
      "A maintenance utility for the vector memory database. Identifies and removes duplicate memories, recalculates quality scores based on access patterns, cleans up orphaned associations, and compacts the SQLite database. Should be run periodically to keep the memory system performant and relevant.",
    tags: ["Memory", "Maintenance", "Python", "Database"],
    dependencies: ["Python 3.10+", "vector-memory database"],
    integrationSteps: [
      "Copy scripts/memory-maintenance.py to ~/.claude/scripts/",
      "Run periodically: python ~/.claude/scripts/memory-maintenance.py",
    ],
    codeSnippet: `# Install
cp scripts/memory-maintenance.py ~/.claude/scripts/

# Run maintenance
python ~/.claude/scripts/memory-maintenance.py \\
  --db-path ~/.claude/memory.db`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "promote-evolved",
    name: "Promote Evolved Components",
    category: "hook",
    description:
      "Promotes evolved Homunculus components (agents, skills, commands) to the main config.",
    summary:
      "When the evolve-synthesizer agent creates new components from instinct clusters, this script promotes them from the homunculus/evolved/ staging directory to the main agents/, skills/, or commands/ directories. Handles naming conflicts, creates backups, and updates the component index.",
    tags: ["Homunculus", "Evolution", "Automation", "Shell"],
    dependencies: ["Bash", "Homunculus system"],
    integrationSteps: [
      "Copy scripts/promote-evolved.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run after evolve-synthesizer creates new components",
    ],
    codeSnippet: `# Install
cp scripts/promote-evolved.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/promote-evolved.sh

# Promote evolved components
~/.claude/scripts/promote-evolved.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "bridge-launcher",
    name: "Bridge Launcher",
    category: "hook",
    description:
      "Launches the OpenClaw bridge connection for cross-system integration.",
    summary:
      "A startup script for the OpenClaw bridge that handles connection initialization, authentication, health checks, and reconnection logic. Used by the /openclaw-ops skill for managing the bridge lifecycle.",
    tags: ["OpenClaw", "Integration", "Shell"],
    dependencies: ["Bash", "OpenClaw bridge"],
    integrationSteps: [
      "Copy scripts/bridge-launcher.sh to ~/.claude/scripts/",
      "Make executable: chmod +x",
      "Run to launch the OpenClaw bridge",
    ],
    codeSnippet: `# Install
cp scripts/bridge-launcher.sh ~/.claude/scripts/
chmod +x ~/.claude/scripts/bridge-launcher.sh

# Launch bridge
~/.claude/scripts/bridge-launcher.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "memory-toggle",
    name: "Memory Toggle (Windows)",
    category: "hook",
    description:
      "PowerShell script to toggle vector memory server on/off for Windows environments.",
    summary:
      "A Windows-specific PowerShell utility that starts, stops, or restarts the vector memory MCP server. Handles the platform-specific process management differences on Windows, including proper stdin/stdout pipe handling and process cleanup.",
    tags: ["Windows", "Memory", "PowerShell", "Platform"],
    dependencies: ["PowerShell", "vector-memory MCP server"],
    integrationSteps: [
      "Copy scripts/memory-toggle.ps1 to ~/.claude/scripts/",
      "Run: powershell -File ~/.claude/scripts/memory-toggle.ps1",
    ],
    codeSnippet: `# Toggle vector memory on Windows
powershell -File ~/.claude/scripts/memory-toggle.ps1 start
powershell -File ~/.claude/scripts/memory-toggle.ps1 stop
powershell -File ~/.claude/scripts/memory-toggle.ps1 restart`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── New Rules ──────────────────────────────────────────────────
  {
    id: "rule-context-preservation",
    name: "Context Preservation Rules",
    category: "configuration",
    description:
      "Strategies for preserving critical context across compaction boundaries and session restarts.",
    summary:
      "Defines patterns for ensuring important context survives context window compaction and session boundaries. Covers pre-compaction checkpointing, MEMORY.md update triggers, scratchpad management, and session handoff protocols. Works with the pre-compact hook and session-scratchpad hook for automated preservation.",
    tags: ["Context", "Session Management", "Operations"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Copy rules/operations/context-preservation.md to ~/.claude/rules/operations/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
cp rules/operations/context-preservation.md ~/.claude/rules/operations/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-macos-platform",
    name: "macOS Platform Rules",
    category: "configuration",
    description:
      "Shell configuration, Homebrew patterns, notification handling, and macOS-specific conventions.",
    summary:
      "Captures macOS-specific configuration patterns and conventions. Covers shell configuration (zsh as default), Homebrew package management patterns, native notification integration (for prompt-notify hook), clipboard handling, and filesystem case-sensitivity considerations. The macOS counterpart to the Windows Platform rules.",
    tags: ["macOS", "Platform", "Shell", "Operations"],
    dependencies: ["Claude Code CLI", "macOS"],
    integrationSteps: [
      "Copy rules/operations/macos-platform.md to ~/.claude/rules/operations/",
      "Only needed on macOS machines",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install (macOS only)
mkdir -p ~/.claude/rules/operations
cp rules/operations/macos-platform.md ~/.claude/rules/operations/`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Superpowers Plugin Skills ──────────────────────────────────
  {
    id: "superpowers-gateway",
    name: "Using Superpowers (Auto)",
    category: "skill",
    description:
      "Gateway skill that auto-activates superpowers plugin capabilities based on context.",
    summary:
      "The entry point for the everything-claude-code superpowers system. Automatically activates the appropriate superpower skill based on the current context and task type. Acts as a router that dispatches to specialized skills like brainstorming, writing-plans, TDD, systematic-debugging, etc.",
    tags: ["Superpowers", "Plugin", "Automation", "Gateway"],
    dependencies: ["Claude Code CLI", "everything-claude-code plugin"],
    integrationSteps: [
      "Install the everything-claude-code plugin",
      "Superpowers activate automatically based on context",
    ],
    codeSnippet: `# Installed via the everything-claude-code plugin
# Activates automatically — no manual invocation needed`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-brainstorming",
    name: "Brainstorming",
    category: "skill",
    description:
      "Structured design refinement through iterative brainstorming and idea exploration.",
    summary:
      "A superpower skill for structured brainstorming sessions. Guides through divergent thinking, idea clustering, constraint analysis, and convergent selection. Produces actionable design decisions from open-ended exploration.",
    tags: ["Superpowers", "Plugin", "Planning", "Creative"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-writing-plans",
    name: "Writing Plans",
    category: "skill",
    description:
      "Structured task breakdown and implementation planning with dependency analysis.",
    summary:
      "Breaks down complex tasks into structured implementation plans with clear dependencies, ordering, and acceptance criteria. Produces plans that can be executed by the executing-plans superpower or by subagent-driven-development.",
    tags: ["Superpowers", "Plugin", "Planning"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via /plan or superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers
# Invoke via: /plan`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-executing-plans",
    name: "Executing Plans",
    category: "skill",
    description:
      "Offline execution of structured plans with progress tracking and checkpoint management.",
    summary:
      "Takes plans produced by writing-plans and executes them step by step with progress tracking, checkpoint management, and rollback capability. Handles task dependencies and sequencing automatically.",
    tags: ["Superpowers", "Plugin", "Execution"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated after plan creation"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-subagent-dev",
    name: "Subagent-Driven Development",
    category: "skill",
    description:
      "In-session task execution using parallel subagents for maximum throughput.",
    summary:
      "Decomposes implementation tasks and dispatches them to parallel subagents within the current session. Each subagent gets a focused scope and returns structured results. Maximizes throughput for tasks that can be parallelized.",
    tags: ["Superpowers", "Plugin", "Multi-Agent", "Performance"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-tdd",
    name: "Test-Driven Development",
    category: "skill",
    description:
      "RED-GREEN-REFACTOR TDD cycle enforcement with automated test generation and validation.",
    summary:
      "Enforces the TDD workflow: write a failing test (RED), implement the minimum code to pass (GREEN), then refactor. Generates test skeletons, validates test isolation, and ensures proper coverage. Works with the testing rules for consistent test quality.",
    tags: ["Superpowers", "Plugin", "Testing", "TDD"],
    dependencies: ["everything-claude-code plugin", "Test framework"],
    integrationSteps: ["Installed via plugin", "Activated via /tdd or superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers
# Invoke via: /tdd`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-debugging",
    name: "Systematic Debugging",
    category: "skill",
    description:
      "4-phase root cause analysis: reproduce, isolate, diagnose, and fix.",
    summary:
      "A structured debugging methodology with four phases: reproduce the issue reliably, isolate the failing component, diagnose the root cause (not just symptoms), and implement a targeted fix. Prevents shotgun debugging and ensures fixes address the actual problem.",
    tags: ["Superpowers", "Plugin", "Debugging"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway on bug reports"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-verification",
    name: "Verification Before Completion",
    category: "skill",
    description:
      "Evidence-based validation that work is truly complete before marking tasks done.",
    summary:
      "Prevents premature task completion by requiring evidence that the work actually works. Checks for passing tests, successful builds, no regressions, and proper documentation before allowing a task to be marked as complete.",
    tags: ["Superpowers", "Plugin", "Quality", "Verification"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via /verify or superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers
# Invoke via: /verify`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-worktrees",
    name: "Using Git Worktrees",
    category: "skill",
    description:
      "Isolated workspace setup using git worktrees for parallel development branches.",
    summary:
      "Sets up git worktrees for working on multiple branches simultaneously without stashing or switching. Each worktree gets an isolated copy of the repo at a specific branch, enabling parallel development, testing, and comparison. Handles cleanup and lifecycle management.",
    tags: ["Superpowers", "Plugin", "Git", "Workflow"],
    dependencies: ["everything-claude-code plugin", "Git"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-finish-branch",
    name: "Finishing a Development Branch",
    category: "skill",
    description:
      "Merge/PR decision workflow for completed feature branches with quality gates.",
    summary:
      "Guides the process of finishing a development branch: running final tests, checking for merge conflicts, deciding between merge and PR, writing PR descriptions, and cleaning up after merge. Ensures branches are properly closed out.",
    tags: ["Superpowers", "Plugin", "Git", "Workflow"],
    dependencies: ["everything-claude-code plugin", "Git"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-request-review",
    name: "Requesting Code Review",
    category: "skill",
    description:
      "Dispatches the code-reviewer agent to review completed work before submission.",
    summary:
      "Prepares and dispatches a code review request to the code-reviewer agent. Generates a review context summary, identifies high-risk areas, and presents the review findings. Used before creating PRs or merging branches.",
    tags: ["Superpowers", "Plugin", "Code Review"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via /code-review or superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers
# Invoke via: /code-review`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-receive-review",
    name: "Receiving Code Review",
    category: "skill",
    description:
      "Evaluates code review feedback before implementing changes to filter noise.",
    summary:
      "Processes code review feedback with critical evaluation. Not all review comments are actionable or correct. This skill evaluates each piece of feedback, determines if it's valid, and decides whether to implement, push back, or discuss. Prevents blind implementation of review suggestions.",
    tags: ["Superpowers", "Plugin", "Code Review"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-parallel-agents",
    name: "Dispatching Parallel Agents",
    category: "skill",
    description:
      "Concurrent agent execution with result aggregation and error handling.",
    summary:
      "Patterns for dispatching multiple agents in parallel, collecting their results, handling partial failures, and synthesizing outputs. Covers agent fan-out, result aggregation, timeout handling, and captain-agent coordination.",
    tags: ["Superpowers", "Plugin", "Multi-Agent", "Performance"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-writing-skills",
    name: "Writing Skills",
    category: "skill",
    description:
      "TDD-based skill authoring methodology for creating robust, testable Claude Code skills.",
    summary:
      "A meta-skill for writing new skills using test-driven development. Covers skill file structure, YAML frontmatter, prompt engineering for skill instructions, testing skill behavior, and the skill review cycle. Produces skills that are reliable and maintainable.",
    tags: ["Superpowers", "Plugin", "Skills", "TDD"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Activated via superpowers gateway"],
    codeSnippet: `# Part of everything-claude-code plugin superpowers`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
  {
    id: "superpowers-code-reviewer",
    name: "Code Reviewer Agent (Plugin)",
    category: "agent",
    description:
      "Plugin agent that reviews completed work for quality, security, and correctness.",
    summary:
      "A specialized review agent from the everything-claude-code plugin. Reviews code changes for quality issues, security vulnerabilities, performance problems, and architectural concerns. Dispatched by the requesting-code-review superpower skill. Provides structured feedback with severity levels.",
    tags: ["Superpowers", "Plugin", "Code Review", "Quality"],
    dependencies: ["everything-claude-code plugin"],
    integrationSteps: ["Installed via plugin", "Dispatched by requesting-code-review skill"],
    codeSnippet: `# Part of everything-claude-code plugin
# Dispatched automatically via /code-review`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },

  // ── Homunculus System ──────────────────────────────────────────
  {
    id: "homunculus-system",
    name: "Homunculus Continuous Learning",
    category: "configuration",
    description:
      "50 personal instincts, identity templates, and evolutionary agent system for continuous learning.",
    summary:
      "The Homunculus is a continuous learning system that gives Claude Code a form of persistent behavioral memory. It captures 50 personal instincts organized into 6 categories (Claude Code, Security, Next.js, Platform, Workflow, API/Testing). Each instinct starts at 0.4 confidence and increases with supporting evidence. When 3+ instincts cluster around a theme, the evolve-synthesizer agent can promote them into permanent learned skills, new agents, or commands. Behavioral observations are captured by the observe-homunculus.sh hook during every session.",
    tags: ["Homunculus", "Learning", "Evolution", "Core"],
    dependencies: [
      "Claude Code CLI",
      "observe-homunculus.sh hook",
      "evolve-synthesizer agent",
      "promote-evolved.sh script",
    ],
    integrationSteps: [
      "Copy homunculus/ directory to ~/.claude/homunculus/",
      "Install observe-homunculus.sh hook",
      "Install evolve-synthesizer agent",
      "Instincts are captured automatically during sessions",
      "Run evolve-synthesizer periodically to check for promotions",
    ],
    codeSnippet: `# Install the full Homunculus system
cp -r homunculus/ ~/.claude/homunculus/

# Install the observer hook
cp hooks/observe-homunculus.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/observe-homunculus.sh

# Install the evolution agent
cp agents/evolve-synthesizer.md ~/.claude/agents/

# Check for promotable instinct clusters
# Task(subagent_type="evolve-synthesizer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Plugin Configuration ───────────────────────────────────────
  {
    id: "plugin-everything-claude-code",
    name: "everything-claude-code Plugin",
    category: "configuration",
    description:
      "13 specialized agents, 30+ commands, and 30+ skills from the gold-standard Claude Code plugin.",
    summary:
      "The everything-claude-code plugin by Affaan Mustafa is the foundation of this configuration. It provides 13 specialized plugin agents (planner, architect, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, e2e-runner, refactor-cleaner, doc-updater, and more) that automatically activate based on context. Includes 30+ slash commands (/plan, /verify, /tdd, /code-review, /security, /build-fix) and 30+ embedded skills. Agents orchestrate automatically — complex features trigger the planner, code changes trigger the reviewer, bugs trigger the TDD guide.",
    tags: ["Plugin", "Agents", "Orchestration", "Core"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Add the marketplace entry to ~/.claude/settings.json",
      "Install the plugin via the commands below",
      "Plugin agents activate automatically based on context",
      "Use /plan, /verify, /tdd, /security for manual invocation",
    ],
    codeSnippet: `# Install the plugin
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code

# settings.json configuration
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  },
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  }
}`,
    author: "Affaan Mustafa",
    repo: "affaan-m/everything-claude-code",
  },
];

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const item of skillItems) {
    for (const tag of item.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}

export function getItemsByCategory(category: ItemCategory): SkillItem[] {
  return skillItems.filter((item) => item.category === category);
}
