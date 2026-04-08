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
      "[skill-extractor agent](https://github.com/chris2ao/claude-code-config/blob/master/agents/skill-extractor.md)",
      "[changelog-writer agent](https://github.com/chris2ao/claude-code-config/blob/master/agents/changelog-writer.md)",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/wrap-up/SKILL.md) to ~/.claude/skills/wrap-up/",
      "Download [wrap-up-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/wrap-up-orchestrator.md) to ~/.claude/agents/",
      "Download [skill-extractor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/skill-extractor.md) and [changelog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/changelog-writer.md) to ~/.claude/agents/",
      "Run /wrap-up at the end of any coding session",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/wrap-up ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/wrap-up/SKILL.md \\
  -o ~/.claude/skills/wrap-up/SKILL.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/wrap-up-orchestrator.md \\
  -o ~/.claude/agents/wrap-up-orchestrator.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/skill-extractor.md \\
  -o ~/.claude/agents/skill-extractor.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/changelog-writer.md \\
  -o ~/.claude/agents/changelog-writer.md

# Usage
/wrap-up`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-post",
    name: "/blog-post",
    category: "skill",
    description:
      "5-agent blog production team that guides topic selection, writes MDX content, and validates output.",
    summary:
      "An interactive skill that walks you through writing a complete blog post using a coordinated team of five agents: a captain (Opus) that directs the pipeline, a writer (Sonnet) that drafts MDX content, a voice guardian that ensures consistency with your established writing style, an editor that scores drafts on hook strength, pacing, and accuracy, and a UX reviewer that validates the build and MDX structure. The output is a properly formatted MDX file ready to commit.",
    tags: ["Blog", "Content", "MDX", "Writing", "Multi-Agent"],
    dependencies: [
      "Claude Code CLI",
      "[blog-captain.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-captain.md)",
      "[blog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-writer.md)",
      "[blog-voice.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-voice.md)",
      "[blog-editor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-editor.md)",
      "[blog-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-ux.md)",
      "[blog-style-guide.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-style-guide.md)",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-post/SKILL.md) to ~/.claude/skills/blog-post/",
      "Download [blog-style-guide.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-style-guide.md) and [blog-mdx-reference.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-mdx-reference.md) to ~/.claude/skills/",
      "Download blog team agents (blog-captain, blog-writer, blog-voice, blog-editor, blog-ux) to ~/.claude/agents/",
      "Invoke /blog-post and follow the interactive prompts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/blog-post ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/blog-post/SKILL.md \\
  -o ~/.claude/skills/blog-post/SKILL.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/blog-style-guide.md \\
  -o ~/.claude/skills/blog-style-guide.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/blog-mdx-reference.md \\
  -o ~/.claude/skills/blog-mdx-reference.md

# Download blog team agents
for agent in blog-captain blog-writer blog-voice blog-editor blog-ux; do
  curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/$agent.md \\
    -o ~/.claude/agents/$agent.md
done

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
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/multi-repo-status/SKILL.md) to ~/.claude/skills/multi-repo-status/",
      "Update repo paths in SKILL.md to match your project layout",
      "Run /multi-repo-status for a quick dashboard",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/multi-repo-status
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/multi-repo-status/SKILL.md \\
  -o ~/.claude/skills/multi-repo-status/SKILL.md

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
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/skill-catalog/SKILL.md) to ~/.claude/skills/skill-catalog/",
      "Run /skill-catalog to see your full capability inventory",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/skill-catalog
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/skill-catalog/SKILL.md \\
  -o ~/.claude/skills/skill-catalog/SKILL.md

# Usage
/skill-catalog`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "ingest-sessions",
    name: "/ingest-sessions",
    category: "skill",
    description:
      "Processes session archive transcripts, extracts insights, and stores them in vector memory.",
    summary:
      "A session ingestion skill that reads archived Claude Code session transcripts and extracts actionable insights, debugging patterns, and workflow learnings. Stores the extracted knowledge in vector memory with proper tags for later retrieval. Works with the session-analyzer agent to identify recurring patterns and the skill-extractor agent to produce reusable learned skills from raw transcripts.",
    tags: ["Session Management", "Memory", "Learning", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "vector-memory MCP server",
      "Session archive transcripts",
    ],
    integrationSteps: [
      "Ensure session transcripts are archived in .claude/session_archive/",
      "Ensure vector-memory MCP server is configured",
      "Download [ingest-sessions.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/ingest-sessions.md) to ~/.claude/commands/",
      "Run /ingest-sessions to process new transcripts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/ingest-sessions.md \\
  -o ~/.claude/commands/ingest-sessions.md

# Usage
/ingest-sessions`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "sync",
    name: "/sync",
    category: "skill",
    description:
      "Bidirectional config sync between live ~/.claude/ and three Git repositories.",
    summary:
      "Compares your live Claude Code configuration against three repos (CJClaudin_Mac, CJClaude_1, claude-code-config) using a survey script that hashes every file. Presents a drift summary, asks for sync direction and targets, then spawns a sync-orchestrator agent to copy files, handle security blocks, skip platform-specific files, and commit and push to each repo.",
    tags: ["Config Sync", "Git", "Multi-Repo", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[sync-orchestrator agent](https://github.com/chris2ao/claude-code-config/blob/master/agents/sync-orchestrator.md)",
      "[sync-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/sync-survey.sh)",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/sync/SKILL.md) to ~/.claude/skills/sync/",
      "Download [sync-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/sync-orchestrator.md) to ~/.claude/agents/",
      "Download [sync-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/sync-survey.sh) to ~/.claude/scripts/",
      "Run /sync to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/sync ~/.claude/agents ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/sync/SKILL.md \\
  -o ~/.claude/skills/sync/SKILL.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/sync-orchestrator.md \\
  -o ~/.claude/agents/sync-orchestrator.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/sync-survey.sh \\
  -o ~/.claude/scripts/sync-survey.sh
chmod +x ~/.claude/scripts/sync-survey.sh

# Usage
/sync`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmux",
    name: "/cmux",
    category: "skill",
    description:
      "Complete CLI reference for cmux, the Ghostty-based macOS terminal built for AI coding agents.",
    summary:
      "Covers workspaces, panes, browser automation, notifications, sidebar metadata, and multi-agent orchestration patterns. Includes commands for sending input to panes, reading screen output, and managing an embedded browser with full DOM interaction and JavaScript execution.",
    tags: ["macOS", "Terminal", "Automation", "Multi-Agent", "Browser"],
    dependencies: ["Claude Code CLI", "cmux application (macOS)"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/cmux/SKILL.md) to ~/.claude/skills/cmux/",
      "Install cmux from https://cmux.app and create the CLI symlink",
      "Run /cmux to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/cmux
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/cmux/SKILL.md \\
  -o ~/.claude/skills/cmux/SKILL.md

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
      "Validate content integrity beyond HTTP status codes for media, API responses, and data contracts.",
    summary:
      "Teaches three validation patterns that catch common silent failures: CDN placeholders that return HTTP 200 with broken content, API field name mismatches between documentation and actual responses, and Gmail API format modes that omit recipient headers. Each pattern includes concrete code examples and known failure cases.",
    tags: ["Validation", "API", "Media", "Gmail", "Data Contracts"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/content-validation/SKILL.md) to ~/.claude/skills/content-validation/",
      "Run /content-validation to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/content-validation
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/content-validation/SKILL.md \\
  -o ~/.claude/skills/content-validation/SKILL.md

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
      "Safe text and CLI output parsing patterns that work correctly across Windows and Unix environments.",
    summary:
      "Provides three concrete patterns to prevent silent data corruption in cross-platform code: CRLF-safe regex for line endings, execFileSync instead of execSync to bypass Windows shell metacharacter interpretation, and correct handling of positional whitespace in structured CLI output like git status.",
    tags: ["Cross-Platform", "Windows", "Parsing", "CLI", "TypeScript"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/cross-platform-parsing/SKILL.md) to ~/.claude/skills/cross-platform-parsing/",
      "Run /cross-platform-parsing to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/cross-platform-parsing
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/cross-platform-parsing/SKILL.md \\
  -o ~/.claude/skills/cross-platform-parsing/SKILL.md

# Usage
/cross-platform-parsing`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "deep-research",
    name: "/deep-research",
    category: "skill",
    description:
      "Produce thorough, cited research reports from multiple web sources using a three-tier search and scrape stack.",
    summary:
      "Orchestrates parallel research agents using Exa for semantic search, Firecrawl for JavaScript-rendered page scraping, and WebSearch/WebFetch as a fallback tier. Each run breaks the topic into sub-questions, searches 15-30 sources in parallel, deep-reads key sources, and synthesizes a structured report with inline citations, a source list, and methodology notes.",
    tags: ["Research", "Exa", "Firecrawl", "Web Search", "Citations"],
    dependencies: ["Claude Code CLI", "Exa MCP server", "Firecrawl MCP server"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/deep-research/SKILL.md) to ~/.claude/skills/deep-research/",
      "Add EXA_API_KEY and FIRECRAWL_API_KEY to your environment",
      "Add the exa and firecrawl MCP servers to ~/.claude.json",
      "Run /deep-research to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/deep-research
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/deep-research/SKILL.md \\
  -o ~/.claude/skills/deep-research/SKILL.md

# Usage
/deep-research`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-dev",
    name: "/game-dev",
    category: "skill",
    description:
      "Orchestrates a coordinated team of game development specialists to create, fix, debug, or enhance games.",
    summary:
      "Runs a user discovery flow to gather the project path, mode (create, fix, debug, add), tech stack, and desired team composition, then spawns a game-director agent to coordinate the appropriate specialists. The six available specialist roles are game-director, game-developer, game-artist, game-designer, game-writer, and game-ux, with team size scaled from a minimal two-person pair up to the full six-agent studio.",
    tags: ["Game Development", "Multi-Agent", "Web Games", "Canvas", "Phaser"],
    dependencies: [
      "Claude Code CLI",
      "[game-director](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-director.md)",
      "[game-developer](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-developer.md)",
      "[game-artist](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-artist.md)",
      "[game-designer](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-designer.md)",
      "[game-writer](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-writer.md)",
      "[game-ux](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-ux.md)",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/game-dev/SKILL.md) to ~/.claude/skills/game-dev/",
      "Download all game team agents to ~/.claude/agents/",
      "Run /game-dev to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/game-dev ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/game-dev/SKILL.md \\
  -o ~/.claude/skills/game-dev/SKILL.md

# Download game team agents
for agent in game-director game-developer game-artist game-designer game-writer game-ux; do
  curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/\\$agent.md \\
    -o ~/.claude/agents/\\$agent.md
done

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
      "Interact with Google Workspace services via the gws CLI, covering Drive, Gmail, Calendar, Docs, Sheets, Slides, Tasks, and more.",
    summary:
      "Provides a safety-tiered command reference for the gws CLI with auto-execute for reads, confirmation gates for creates, dry-run enforcement for modifications, and explicit-request-only rules for deletes. Emphasizes runtime schema discovery via gws schema so Claude learns any API surface on demand.",
    tags: ["Google Workspace", "Gmail", "Drive", "Calendar", "CLI"],
    dependencies: [
      "Claude Code CLI",
      "gws CLI (npm install -g @googleworkspace/cli)",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/gws/SKILL.md) to ~/.claude/skills/gws/",
      "Install the gws CLI: npm install -g @googleworkspace/cli",
      "Authenticate: gws auth login",
      "Run /gws to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/gws
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/gws/SKILL.md \\
  -o ~/.claude/skills/gws/SKILL.md

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
      "Design and configure a two-tier persistent memory system for Claude sessions using rules and a vector database.",
    summary:
      "Explains why single-layer memory fails and how to combine rule-based triggers (CLAUDE.md and rules directories) with a SQLite-vec vector database for persistent recall across sessions. Covers hybrid search weight tuning and a session-restart pattern for debugging sessions that stall after multiple failed hypotheses.",
    tags: ["Memory", "Vector Database", "SQLite", "Persistence", "MCP"],
    dependencies: ["Claude Code CLI", "mcp-memory-service MCP server"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/memory-architecture/SKILL.md) to ~/.claude/skills/memory-architecture/",
      "Install and configure mcp-memory-service",
      "Run /memory-architecture to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/memory-architecture
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/memory-architecture/SKILL.md \\
  -o ~/.claude/skills/memory-architecture/SKILL.md

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
      "Patterns for structuring multi-agent teams with phase gating, dependency mapping, sandbox constraints, and infrastructure selection.",
    summary:
      "Covers four structural patterns for large parallel builds: a four-phase gate sequence (plan, build, review, polish), dependency mapping before spawning parallel streams, a return-content-as-output workaround for restricted paths, and a comparison of Channels, Remote Control, and Dispatch modes for choosing the right agent infrastructure.",
    tags: ["Multi-Agent", "Orchestration", "Phase Gating", "Parallel", "Architecture"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/multi-agent-orchestration/SKILL.md) to ~/.claude/skills/multi-agent-orchestration/",
      "Run /multi-agent-orchestration to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/multi-agent-orchestration
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/multi-agent-orchestration/SKILL.md \\
  -o ~/.claude/skills/multi-agent-orchestration/SKILL.md

# Usage
/multi-agent-orchestration`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-content-skill",
    name: "/notebooklm-content",
    category: "skill",
    description:
      "Create branded infographics and slide decks from blog posts using Google NotebookLM.",
    summary:
      "Accepts a blog post slug or MDX file path, loads the content into a NotebookLM notebook via MCP, primes it with branding guidelines, and generates infographics or slide decks. Output goes through a QA review cycle covering spelling, accuracy, brand compliance, and DLP scanning before delivery.",
    tags: ["NotebookLM", "Content", "Infographic", "Slides", "Blog"],
    dependencies: [
      "Claude Code CLI",
      "[notebooklm-content agent](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-content.md)",
      "notebooklm MCP server",
    ],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/notebooklm-content/SKILL.md) to ~/.claude/skills/notebooklm-content/",
      "Download [notebooklm-content.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-content.md) to ~/.claude/agents/",
      "Install notebooklm MCP server and authenticate",
      "Run /notebooklm-content to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/notebooklm-content
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/notebooklm-content/SKILL.md \\
  -o ~/.claude/skills/notebooklm-content/SKILL.md

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
      "Configuration gotchas and operational patterns for OpenClaw multi-agent systems.",
    summary:
      "Documents four non-obvious failure modes in OpenClaw: the doctor command reverting manual config, the correct nesting depth for memorySearch config, the double-nested agents.agents path when parsing status JSON, and a cron-based watchdog to restart Telegram long-polling connections that silently die after eight minutes idle.",
    tags: ["OpenClaw", "Multi-Agent", "Telegram", "Configuration", "Operations"],
    dependencies: ["Claude Code CLI", "OpenClaw (multi-agent runtime)"],
    integrationSteps: [
      "Download [SKILL.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/openclaw-ops/SKILL.md) to ~/.claude/skills/openclaw-ops/",
      "Run /openclaw-ops to invoke",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/skills/openclaw-ops
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/openclaw-ops/SKILL.md \\
  -o ~/.claude/skills/openclaw-ops/SKILL.md

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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[changelog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/changelog-writer.md)",
    ],
    integrationSteps: [
      "Download [changelog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/changelog-writer.md) to ~/.claude/agents/",
      "The agent is auto-invoked by /wrap-up or can be called via Task tool",
      "Ensure your repo has a CHANGELOG.md file initialized",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/changelog-writer.md \\
  -o ~/.claude/agents/changelog-writer.md

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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[multi-repo-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/multi-repo-orchestrator.md)",
      "Multiple cloned repositories",
    ],
    integrationSteps: [
      "Download [multi-repo-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/multi-repo-orchestrator.md) to ~/.claude/agents/",
      "Update the repo paths list in the agent definition",
      "Invoke via Task tool or through /multi-repo-status skill",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/multi-repo-orchestrator.md \\
  -o ~/.claude/agents/multi-repo-orchestrator.md

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
    dependencies: [
      "Claude Code CLI",
      "[session-analyzer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/session-analyzer.md)",
      "Session archive transcripts",
    ],
    integrationSteps: [
      "Download [session-analyzer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/session-analyzer.md) to ~/.claude/agents/",
      "Ensure session transcripts are archived (see hooks.md)",
      "Run via Task tool pointing to a transcript directory",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/session-analyzer.md \\
  -o ~/.claude/agents/session-analyzer.md

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
    dependencies: [
      "Claude Code CLI",
      "[deploy-verifier.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/deploy-verifier.md)",
      "curl or web fetch capability",
    ],
    integrationSteps: [
      "Download [deploy-verifier.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/deploy-verifier.md) to ~/.claude/agents/",
      "Update the target URL to your production domain",
      "Run after each deployment or integrate into CI pipeline",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/deploy-verifier.md \\
  -o ~/.claude/agents/deploy-verifier.md

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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[config-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/config-sync.md)",
      "claude-code-config repo cloned",
    ],
    integrationSteps: [
      "Download [config-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/config-sync.md) to ~/.claude/agents/",
      "Clone claude-code-config repo to a known path",
      "Run to detect drift between local config and repo",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/config-sync.md \\
  -o ~/.claude/agents/config-sync.md

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
    dependencies: [
      "Claude Code CLI",
      "[context-health.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/context-health.md)",
    ],
    integrationSteps: [
      "Download [context-health.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/context-health.md) to ~/.claude/agents/",
      "Invoke periodically during long sessions",
      "Follow compaction suggestions to maintain session quality",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/context-health.md \\
  -o ~/.claude/agents/context-health.md

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
      "The Homunculus v2 agent named for the idea of creating a 'little person' inside Claude who remembers hard-won debugging knowledge. Analyzes session transcripts for moments where you hit a wall, found a non-obvious solution, or discovered a platform gotcha. Produces structured learned skill files with the problem, the wrong approach, and the correct fix. These skills are loaded into future sessions so you never debug the same issue twice.",
    tags: ["Learning", "Documentation", "Session Management", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[skill-extractor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/skill-extractor.md)",
      "Session archive transcripts",
      "skills/learned/ directory",
    ],
    integrationSteps: [
      "Download [skill-extractor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/skill-extractor.md) to ~/.claude/agents/",
      "Ensure session transcripts are being archived",
      "Run after difficult debugging sessions to capture learnings",
      "Review extracted skills in skills/learned/",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/skill-extractor.md \\
  -o ~/.claude/agents/skill-extractor.md

# Extract skills from a session transcript
# Task(subagent_type="skill-extractor", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-post-orchestrator",
    name: "Blog Captain (blog-captain)",
    category: "agent",
    description:
      "Opus-class captain that orchestrates the full blog post pipeline across five specialist agents.",
    summary:
      "The blog-captain agent runs as the director of the /blog-post skill's five-agent team. It uses the game-director pattern: runs a six-phase pipeline (discover, outline, write, voice-check, edit, UX-verify), gates between phases, runs up to two revision cycles, and delivers a finished MDX file. Delegates prose to blog-writer (Sonnet), voice scoring to blog-voice, editorial review to blog-editor, and build validation to blog-ux.",
    tags: ["Blog", "Content", "Orchestration", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[blog-captain.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-captain.md)",
      "[blog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-writer.md)",
      "[blog-voice.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-voice.md)",
      "[blog-editor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-editor.md)",
      "[blog-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-ux.md)",
    ],
    integrationSteps: [
      "Download [blog-captain.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-captain.md) to ~/.claude/agents/",
      "Download the remaining blog team agents (blog-writer, blog-voice, blog-editor, blog-ux) to ~/.claude/agents/",
      "Invoke via /blog-post skill or directly via Task tool",
    ],
    codeSnippet: `# Install blog captain + full team
mkdir -p ~/.claude/agents
for agent in blog-captain blog-writer blog-voice blog-editor blog-ux; do
  curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/\\$agent.md \\
    -o ~/.claude/agents/\\$agent.md
done

# Invoked automatically by /blog-post skill
# or directly:
# Task(subagent_type="blog-captain", model="opus")`,
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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[pre-commit-checker.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/pre-commit-checker.md)",
    ],
    integrationSteps: [
      "Download [pre-commit-checker.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/pre-commit-checker.md) to ~/.claude/agents/",
      "Configure as a pre-commit hook or invoke manually before commits",
      "Review flagged issues and fix before committing",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/pre-commit-checker.md \\
  -o ~/.claude/agents/pre-commit-checker.md

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
      "Captures the current state of your working session (open tasks, modified files, in-progress reasoning, and conversation highlights) into a checkpoint file. Useful for long sessions where you might need to context-switch or recover from a crash. Checkpoints can be loaded into new sessions to resume where you left off.",
    tags: ["Session Management", "Recovery", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[session-checkpoint.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/session-checkpoint.md)",
    ],
    integrationSteps: [
      "Download [session-checkpoint.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/session-checkpoint.md) to ~/.claude/agents/",
      "Invoke periodically during long sessions",
      "Load checkpoint files when resuming work",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/session-checkpoint.md \\
  -o ~/.claude/agents/session-checkpoint.md

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
      "[sync-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/sync-orchestrator.md)",
      "[config-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/config-sync.md)",
    ],
    integrationSteps: [
      "Download [sync-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/sync-orchestrator.md) to ~/.claude/agents/",
      "Ensure config-sync agent is installed",
      "Run when setting up a new machine or after repo updates",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/sync-orchestrator.md \\
  -o ~/.claude/agents/sync-orchestrator.md

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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[home-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/home-sync.md)",
    ],
    integrationSteps: [
      "Download [home-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/home-sync.md) to ~/.claude/agents/",
      "Clone claude-code-config to a known path",
      "Run periodically to keep configs in sync",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/home-sync.md \\
  -o ~/.claude/agents/home-sync.md

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
      "Multi-repo housekeeping: updates CHANGELOG, README, saves memory delta, commits, and pushes all repos.",
    summary:
      "The master orchestrator for the /wrap-up skill. Iterates over all configured repos and, for each, pulls latest, updates CHANGELOG.md (via changelog-writer), extracts new instincts (via skill-extractor), syncs MEMORY.md, stages changes, and commits with a structured message. Runs each repo's operations in parallel for speed, then sequentially pushes to avoid race conditions.",
    tags: ["Wrap-Up", "Git", "Automation", "Multi-Repo"],
    dependencies: [
      "Claude Code CLI",
      "[wrap-up-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/wrap-up-orchestrator.md)",
      "[changelog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/changelog-writer.md)",
      "[skill-extractor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/skill-extractor.md)",
    ],
    integrationSteps: [
      "Download [wrap-up-orchestrator.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/wrap-up-orchestrator.md) to ~/.claude/agents/",
      "Download changelog-writer and skill-extractor agents to ~/.claude/agents/",
      "Automatically invoked by /wrap-up skill",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/wrap-up-orchestrator.md \\
  -o ~/.claude/agents/wrap-up-orchestrator.md

# Invoked automatically by /wrap-up
# Task(subagent_type="wrap-up-orchestrator")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-editor",
    name: "Blog Editor",
    category: "agent",
    description:
      "Reviews blog drafts for hook strength, pacing, entertainment value, and factual accuracy.",
    summary:
      "A specialist agent in the /blog-post five-agent team. Scores each draft on four dimensions: hook strength (does the opening grab attention?), pacing (does the article flow without drag?), entertainment (is it genuinely engaging?), and accuracy (are technical claims correct?). Returns a numeric score and a list of specific revision requests for the blog-writer.",
    tags: ["Blog", "Content", "Writing", "QA"],
    dependencies: [
      "Claude Code CLI",
      "[blog-editor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-editor.md)",
    ],
    integrationSteps: [
      "Download [blog-editor.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-editor.md) to ~/.claude/agents/",
      "Agent is invoked automatically by blog-captain during the /blog-post pipeline",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/blog-editor.md \\
  -o ~/.claude/agents/blog-editor.md

# Invoked by blog-captain (not called directly)
# Task(subagent_type="blog-editor", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-ux",
    name: "Blog UX Reviewer",
    category: "agent",
    description:
      "Build verification and MDX structural analysis for blog posts.",
    summary:
      "The final gate in the /blog-post pipeline. Runs a build check (next build or next lint), validates MDX structure (all imports present, no unclosed tags, frontmatter fields complete), checks image alt text, and verifies series navigation links are correct. Reports pass or fail with a specific list of issues that block publishing.",
    tags: ["Blog", "MDX", "Build Verification", "UX"],
    dependencies: [
      "Claude Code CLI",
      "[blog-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-ux.md)",
      "Node.js",
    ],
    integrationSteps: [
      "Download [blog-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-ux.md) to ~/.claude/agents/",
      "Agent is invoked automatically by blog-captain as the final pipeline phase",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/blog-ux.md \\
  -o ~/.claude/agents/blog-ux.md

# Invoked by blog-captain as the UX gate
# Task(subagent_type="blog-ux", model="haiku")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-voice",
    name: "Blog Voice Guardian",
    category: "agent",
    description:
      "Maintains the living voice profile and scores blog drafts for voice consistency.",
    summary:
      "Reads the living voice profile (blog-voice-profile.md seeded from the full post archive) and scores each draft for consistency on tone, vocabulary, sentence rhythm, and personal-setup framing. Returns a voice score plus specific phrases to change. Also proposes additive-only updates to the voice profile when a draft introduces a new idiom or convention worth preserving.",
    tags: ["Blog", "Voice", "Writing Style", "Content"],
    dependencies: [
      "Claude Code CLI",
      "[blog-voice.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-voice.md)",
      "[blog-voice-profile.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-voice-profile.md)",
    ],
    integrationSteps: [
      "Download [blog-voice.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-voice.md) to ~/.claude/agents/",
      "Download [blog-voice-profile.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-voice-profile.md) to ~/.claude/skills/",
      "Agent is invoked automatically by blog-captain",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents ~/.claude/skills
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/blog-voice.md \\
  -o ~/.claude/agents/blog-voice.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/blog-voice-profile.md \\
  -o ~/.claude/skills/blog-voice-profile.md

# Invoked by blog-captain for voice scoring
# Task(subagent_type="blog-voice", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-writer",
    name: "Blog Writer",
    category: "agent",
    description:
      "Drafts and revises MDX blog posts following the established style guide.",
    summary:
      "The prose engine of the /blog-post team. Receives an outline from blog-captain, reads 2-3 recent posts for tone calibration, and produces complete MDX drafts with proper frontmatter, callout components, and code blocks. Also handles revision cycles based on feedback from blog-editor and blog-voice. Always runs on Sonnet for the best writing quality.",
    tags: ["Blog", "Writing", "MDX", "Content"],
    dependencies: [
      "Claude Code CLI",
      "[blog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-writer.md)",
      "[blog-style-guide.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-style-guide.md)",
    ],
    integrationSteps: [
      "Download [blog-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/blog-writer.md) to ~/.claude/agents/",
      "Download [blog-style-guide.md](https://github.com/chris2ao/claude-code-config/blob/master/skills/blog-style-guide.md) to ~/.claude/skills/",
      "Agent is invoked automatically by blog-captain",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents ~/.claude/skills
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/blog-writer.md \\
  -o ~/.claude/agents/blog-writer.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/skills/blog-style-guide.md \\
  -o ~/.claude/skills/blog-style-guide.md

# Invoked by blog-captain for prose drafting
# Task(subagent_type="blog-writer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "evolve-synthesizer",
    name: "Evolve Synthesizer",
    category: "agent",
    description:
      "Clusters Homunculus instincts and generates evolved agents, skills, and commands.",
    summary:
      "The intelligence layer of the /evolve command. Reads all instinct files from the Homunculus pipeline, performs semantic clustering to find recurring behavioral patterns, and generates candidate evolved agents, skills, and commands. Each candidate includes reasoning for why the pattern warrants a new component. The captain reviews candidates before any are promoted to the active configuration.",
    tags: ["Homunculus", "Learning", "Agent Generation", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[evolve-synthesizer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/evolve-synthesizer.md)",
      "Homunculus instinct files in ~/.claude/homunculus/instincts/",
    ],
    integrationSteps: [
      "Download [evolve-synthesizer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/evolve-synthesizer.md) to ~/.claude/agents/",
      "Ensure instincts are being captured via the observe-homunculus hook",
      "Run /evolve to invoke and review candidates",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/evolve-synthesizer.md \\
  -o ~/.claude/agents/evolve-synthesizer.md

# Invoked by /evolve command
# Task(subagent_type="evolve-synthesizer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-artist",
    name: "Game Artist",
    category: "agent",
    description:
      "Visual layer specialist: rendering, sprites, particles, and CSS animations.",
    summary:
      "Part of the /game-dev six-agent team. Responsible for the visual presentation of the game: Canvas 2D rendering pipelines, sprite sheet management, particle systems, CSS animations, color palettes, and responsive layouts. Works from the game-designer's TypeScript interfaces and produces visual components that the game-developer integrates into the engine.",
    tags: ["Game Dev", "Canvas", "Rendering", "CSS"],
    dependencies: [
      "Claude Code CLI",
      "[game-artist.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-artist.md)",
    ],
    integrationSteps: [
      "Download [game-artist.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-artist.md) to ~/.claude/agents/",
      "Agent is invoked by game-director when the /game-dev skill runs",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/game-artist.md \\
  -o ~/.claude/agents/game-artist.md

# Invoked by game-director
# Task(subagent_type="game-artist", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-designer",
    name: "Game Designer",
    category: "agent",
    description:
      "Design specs: core loop, mechanics, balance, and TypeScript interfaces.",
    summary:
      "Part of the /game-dev team. Authors the game design document, defines the core gameplay loop, specifies mechanics and balance parameters, and produces TypeScript interface definitions that all other agents implement. Ensures the game is fun and achievable within the team's time budget.",
    tags: ["Game Dev", "Design", "Mechanics", "TypeScript"],
    dependencies: [
      "Claude Code CLI",
      "[game-designer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-designer.md)",
    ],
    integrationSteps: [
      "Download [game-designer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-designer.md) to ~/.claude/agents/",
      "Agent is invoked by game-director as the first phase",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/game-designer.md \\
  -o ~/.claude/agents/game-designer.md

# Invoked by game-director in the design phase
# Task(subagent_type="game-designer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-developer",
    name: "Game Developer",
    category: "agent",
    description:
      "Engine, state management, game loop, physics, AI, and TDD implementation.",
    summary:
      "The core implementation agent of the /game-dev team. Implements the game engine, state machine, game loop (requestAnimationFrame), physics, enemy AI, collision detection, and all game logic. Follows TDD: writes tests first, then implementation. Uses TypeScript with strict mode and the interfaces defined by game-designer.",
    tags: ["Game Dev", "TypeScript", "TDD", "State Management"],
    dependencies: [
      "Claude Code CLI",
      "[game-developer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-developer.md)",
    ],
    integrationSteps: [
      "Download [game-developer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-developer.md) to ~/.claude/agents/",
      "Agent is invoked by game-director for engine implementation",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/game-developer.md \\
  -o ~/.claude/agents/game-developer.md

# Invoked by game-director for core engine work
# Task(subagent_type="game-developer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-director",
    name: "Game Director",
    category: "agent",
    description:
      "Captain that orchestrates the full game team across create, fix, debug, and add modes.",
    summary:
      "The orchestration layer of the /game-dev skill. Reads the user's mode (create, fix, debug, add) and project path, selects the appropriate team composition (from a two-person pair up to the full six-agent studio), and coordinates parallel execution across game-designer, game-developer, game-artist, game-writer, and game-ux. Uses phase gating to ensure dependencies are resolved before each phase starts.",
    tags: ["Game Dev", "Orchestration", "Multi-Agent", "Architecture"],
    dependencies: [
      "Claude Code CLI",
      "[game-director.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-director.md)",
      "[game-developer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-developer.md)",
      "[game-artist.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-artist.md)",
    ],
    integrationSteps: [
      "Download [game-director.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-director.md) to ~/.claude/agents/",
      "Download all game team agents to ~/.claude/agents/",
      "Invoked automatically by the /game-dev skill",
    ],
    codeSnippet: `# Install full game team
mkdir -p ~/.claude/agents
for agent in game-director game-developer game-artist game-designer game-writer game-ux; do
  curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/\\$agent.md \\
    -o ~/.claude/agents/\\$agent.md
done

# Task(subagent_type="game-director", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-ux",
    name: "Game UX Designer",
    category: "agent",
    description:
      "UI, menus, HUD, input handling, and accessibility for web games.",
    summary:
      "Part of the /game-dev team. Designs and implements all user-facing UI: main menu, pause screen, HUD overlays, score displays, settings panels, and tutorial tooltips. Handles keyboard, mouse, touch, and gamepad input mapping. Ensures all interactive elements are accessible and keyboard-navigable.",
    tags: ["Game Dev", "React", "UX", "Accessibility"],
    dependencies: [
      "Claude Code CLI",
      "[game-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-ux.md)",
    ],
    integrationSteps: [
      "Download [game-ux.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-ux.md) to ~/.claude/agents/",
      "Agent is invoked by game-director for UI phases",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/game-ux.md \\
  -o ~/.claude/agents/game-ux.md

# Invoked by game-director for UI work
# Task(subagent_type="game-ux", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "game-writer",
    name: "Game Writer",
    category: "agent",
    description:
      "Narrative, dialogue, world-building, and tutorial text as TypeScript data.",
    summary:
      "Part of the /game-dev team. Writes all in-game text: story narrative, character dialogue trees, enemy flavor text, item descriptions, tutorial prompts, and achievement labels. Delivers content as typed TypeScript data structures (not raw strings) so the game-developer can consume it directly without parsing.",
    tags: ["Game Dev", "Writing", "Narrative", "Dialogue"],
    dependencies: [
      "Claude Code CLI",
      "[game-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-writer.md)",
    ],
    integrationSteps: [
      "Download [game-writer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/game-writer.md) to ~/.claude/agents/",
      "Agent is invoked by game-director when narrative content is needed",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/game-writer.md \\
  -o ~/.claude/agents/game-writer.md

# Invoked by game-director for narrative content
# Task(subagent_type="game-writer", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "gmail-assistant",
    name: "Gmail Assistant",
    category: "agent",
    description:
      "Daily inbox cleanup: classifies emails, auto-labels 9 categories, VIP detection, follow-up tracking, and attention summary.",
    summary:
      "A comprehensive Gmail automation agent designed to run as a daily unattended batch job. Classifies every new email into one of 9 categories (newsletters, receipts, action required, FYI, calendar, promotions, social, support, other), applies Gmail labels, detects VIP senders based on reply history, flags follow-up items, and sends a single attention-required summary email. Uses Gmail batch API for efficiency and logs run metrics to JSONL.",
    tags: ["Gmail", "Email", "Automation", "Productivity"],
    dependencies: [
      "Claude Code CLI",
      "[gmail-assistant.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/gmail-assistant.md)",
      "Gmail MCP server",
      "Google OAuth credentials",
    ],
    integrationSteps: [
      "Download [gmail-assistant.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/gmail-assistant.md) to ~/.claude/agents/",
      "Configure Gmail MCP server with OAuth credentials",
      "Schedule as a daily automated run via cron or launchd",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/gmail-assistant.md \\
  -o ~/.claude/agents/gmail-assistant.md

# Run manually:
# Task(subagent_type="gmail-assistant", model="sonnet")

# Or schedule daily (macOS launchd / Linux cron)`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-assistant",
    name: "NotebookLM Assistant",
    category: "agent",
    description:
      "General NotebookLM orchestrator for notebooks, sources, content generation, and research.",
    summary:
      "A general-purpose NotebookLM agent that handles the full range of NotebookLM operations: creating and managing notebooks, adding sources (URL, text, Drive, file), querying notebooks, generating audio overviews, and running cross-notebook research. Used as a foundation layer by the notebooklm-content agent for branded content generation.",
    tags: ["NotebookLM", "Google", "Research", "Content Generation"],
    dependencies: [
      "Claude Code CLI",
      "[notebooklm-assistant.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-assistant.md)",
      "notebooklm MCP server",
    ],
    integrationSteps: [
      "Download [notebooklm-assistant.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-assistant.md) to ~/.claude/agents/",
      "Install notebooklm MCP server: claude mcp add notebooklm -- npx -y notebooklm-mcp",
      "Authenticate: run nlm login in your terminal",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/notebooklm-assistant.md \\
  -o ~/.claude/agents/notebooklm-assistant.md

# Install MCP server
claude mcp add notebooklm -- npx -y notebooklm-mcp

# Authenticate
nlm login

# Task(subagent_type="notebooklm-assistant", model="sonnet")`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "notebooklm-content",
    name: "NotebookLM Content Agent",
    category: "agent",
    description:
      "Creates branded infographics and slide decks from blog posts with QA and DLP review.",
    summary:
      "A specialized agent that loads blog posts into NotebookLM, primes it with CryptoFlex LLC branding guidelines, and generates visual assets: infographics (used in blog posts), slide decks (used on LinkedIn), and audio overviews. Output goes through a QA cycle that checks for spelling errors, truncated words (a known NotebookLM issue), brand compliance, and a DLP scan for private information before delivery.",
    tags: ["NotebookLM", "Content", "Brand", "Infographics", "DLP"],
    dependencies: [
      "Claude Code CLI",
      "[notebooklm-content.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-content.md)",
      "notebooklm MCP server",
    ],
    integrationSteps: [
      "Download [notebooklm-content.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/notebooklm-content.md) to ~/.claude/agents/",
      "Install notebooklm MCP server and authenticate (nlm login)",
      "Invoked automatically by the /notebooklm-content skill",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/notebooklm-content.md \\
  -o ~/.claude/agents/notebooklm-content.md

# Invoked by /notebooklm-content skill
# Task(subagent_type="notebooklm-content", model="sonnet")`,
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
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[wrap-up.md (command)](https://github.com/chris2ao/claude-code-config/blob/master/commands/wrap-up.md)",
    ],
    integrationSteps: [
      "Download [wrap-up.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/wrap-up.md) to ~/.claude/commands/",
      "Ensure YAML frontmatter is present (required for commands)",
      "The skill version takes priority if both exist",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/wrap-up.md \\
  -o ~/.claude/commands/wrap-up.md

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
    dependencies: [
      "Claude Code CLI",
      "[blog-post.md (command)](https://github.com/chris2ao/claude-code-config/blob/master/commands/blog-post.md)",
    ],
    integrationSteps: [
      "Download [blog-post.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/blog-post.md) to ~/.claude/commands/",
      "Ensure YAML frontmatter is present",
      "The skill version takes priority if both exist",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/blog-post.md \\
  -o ~/.claude/commands/blog-post.md

# Usage (if skill version not installed)
/blog-post`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-claude-config-sync",
    name: "/claude-config-sync",
    category: "command",
    description:
      "Syncs live ~/.claude/ configuration to the claude-code-config repo with parallel agents.",
    summary:
      "Orchestrates a full config sync from your live ~/.claude/ directory to the canonical claude-code-config repository. Spawns parallel agents to diff, copy, and stage changes for each component type (agents, skills, commands, hooks, rules). Skips secrets and platform-specific files. Commits and pushes when done.",
    tags: ["Config Sync", "Git", "Automation", "DevOps"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[claude-config-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/claude-config-sync.md)",
    ],
    integrationSteps: [
      "Download [claude-config-sync.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/claude-config-sync.md) to ~/.claude/commands/",
      "Ensure claude-code-config repo is cloned locally",
      "Run /claude-config-sync to sync live config to repo",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/claude-config-sync.md \\
  -o ~/.claude/commands/claude-config-sync.md

# Usage
/claude-config-sync`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-evolve",
    name: "/evolve",
    category: "command",
    description:
      "Clusters Homunculus instincts into evolved skills, agents, and commands.",
    summary:
      "Triggers the Homunculus evolution pipeline. Reads instinct files, invokes the evolve-synthesizer agent to cluster them, presents candidate evolved components for review, and writes accepted candidates to the evolved/ staging directory. Supports full (reprocess all instincts) and incremental (only new instincts since last run) modes.",
    tags: ["Homunculus", "Learning", "Agent Generation", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[evolve.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/evolve.md)",
      "[evolve-synthesizer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/evolve-synthesizer.md)",
    ],
    integrationSteps: [
      "Download [evolve.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/evolve.md) to ~/.claude/commands/",
      "Download [evolve-synthesizer.md](https://github.com/chris2ao/claude-code-config/blob/master/agents/evolve-synthesizer.md) to ~/.claude/agents/",
      "Run /evolve to cluster instincts and generate candidates",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands ~/.claude/agents
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/evolve.md \\
  -o ~/.claude/commands/evolve.md
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/agents/evolve-synthesizer.md \\
  -o ~/.claude/agents/evolve-synthesizer.md

# Usage
/evolve
/evolve full`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-kb-article",
    name: "/kb-article",
    category: "command",
    description:
      "Authors a knowledge base article with YAML frontmatter and canonical tags.",
    summary:
      "Creates a structured knowledge base article in the project's KB directory. Prompts for title, category, and content, then produces a Markdown file with proper YAML frontmatter (title, date, tags, related articles). Enforces a consistent KB article format across the knowledge base.",
    tags: ["Documentation", "Knowledge Base", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[kb-article.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/kb-article.md)",
    ],
    integrationSteps: [
      "Download [kb-article.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/kb-article.md) to ~/.claude/commands/",
      "Run /kb-article and follow the prompts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/kb-article.md \\
  -o ~/.claude/commands/kb-article.md

# Usage
/kb-article`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-knowledge-graph-sync",
    name: "/Knowledge-Graph-Sync",
    category: "command",
    description:
      "Reconciles the MCP knowledge graph against actual files on disk.",
    summary:
      "Runs a five-phase reconciliation between the knowledge graph (MCP memory server) and the actual files in ~/.claude/. Phase 1 reads the graph. Phase 2 scans disk files. Phase 3 identifies drift (missing entities, stale paths, incorrect descriptions). Phase 4 prompts for approval. Phase 5 applies updates. Prevents the KG from accumulating stale entries as the config evolves.",
    tags: ["Knowledge Graph", "Memory", "Automation", "DevOps"],
    dependencies: [
      "Claude Code CLI",
      "[Knowledge-Graph-Sync.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/Knowledge-Graph-Sync.md)",
      "memory MCP server (knowledge graph)",
    ],
    integrationSteps: [
      "Download [Knowledge-Graph-Sync.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/Knowledge-Graph-Sync.md) to ~/.claude/commands/",
      "Ensure memory MCP server is configured",
      "Run /Knowledge-Graph-Sync periodically during session wrap-up",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/Knowledge-Graph-Sync.md \\
  -o ~/.claude/commands/Knowledge-Graph-Sync.md

# Usage
/Knowledge-Graph-Sync`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-memory-audit",
    name: "/memory-audit",
    category: "command",
    description:
      "Scans vector memory for contradictions, duplicates, and stale entries.",
    summary:
      "Queries the vector memory store and runs a three-pass audit: finds contradicting facts (same topic, different answers), identifies duplicate clusters (near-identical memories that can be merged), and flags stale entries (outdated facts that should be marked superseded). Produces a report with proposed cleanup actions for review before applying.",
    tags: ["Memory", "Vector Memory", "Maintenance", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[memory-audit.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/memory-audit.md)",
      "vector-memory MCP server",
    ],
    integrationSteps: [
      "Download [memory-audit.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/memory-audit.md) to ~/.claude/commands/",
      "Ensure vector-memory MCP server is configured",
      "Run /memory-audit periodically to keep memory clean",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/memory-audit.md \\
  -o ~/.claude/commands/memory-audit.md

# Usage
/memory-audit`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "cmd-smart-compact",
    name: "/smart-compact",
    category: "command",
    description:
      "Saves in-flight context to vector memory and session scratchpad before running /compact.",
    summary:
      "A safer version of /compact that preserves critical context before compressing the conversation. Saves the current task, key decisions, open questions, and active file list to vector memory and to a session scratchpad in ~/.claude/session-state/. Then runs /compact. On resume, context can be recovered from either store.",
    tags: ["Context Management", "Memory", "Session Management", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "[smart-compact.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/smart-compact.md)",
      "vector-memory MCP server",
    ],
    integrationSteps: [
      "Download [smart-compact.md](https://github.com/chris2ao/claude-code-config/blob/master/commands/smart-compact.md) to ~/.claude/commands/",
      "Use /smart-compact instead of /compact during long sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/commands
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/commands/smart-compact.md \\
  -o ~/.claude/commands/smart-compact.md

# Usage (replaces /compact)
/smart-compact`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── Hooks / Scripts ────────────────────────────────────────────
  {
    id: "hook-file-guard",
    name: "File Guard Hook",
    category: "hook",
    description:
      "PreToolUse hook that blocks edits to .env, .pem, .key, and credentials files.",
    summary:
      "A PreToolUse hook that intercepts Edit and Write tool calls and blocks them if the target file matches a sensitive pattern: .env, .env.*, *.pem, *.key, credentials.json, or *.secret. Exits with a non-zero code and a clear error message, preventing accidental secret exposure. Essential when running Claude Code with auto-accept permissions enabled.",
    tags: ["Security", "Hooks", "File Protection", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[file-guard.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/file-guard.sh)",
    ],
    integrationSteps: [
      "Download [file-guard.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/file-guard.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/file-guard.sh",
      "Register as a PreToolUse hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/file-guard.sh \\
  -o ~/.claude/hooks/file-guard.sh
chmod +x ~/.claude/hooks/file-guard.sh

# Register in ~/.claude/settings.json:
# "hooks": { "PreToolUse": [{ "type": "command",
#   "command": "~/.claude/hooks/file-guard.sh" }] }`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-memory-nudge",
    name: "Memory Nudge Hook",
    category: "hook",
    description:
      "PostToolUse hook that counts work units and reminds you to save to vector memory.",
    summary:
      "Fires after every tool use, increments a work-unit counter, and once the threshold (default: 3) is reached, outputs a reminder to save important context to vector memory. Prevents the common pattern of finishing a session without persisting decisions or bug fixes. The threshold is configurable.",
    tags: ["Memory", "Hooks", "Automation", "Session Management"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[memory-nudge.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/memory-nudge.sh)",
    ],
    integrationSteps: [
      "Download [memory-nudge.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/memory-nudge.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/memory-nudge.sh",
      "Register as a PostToolUse hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/memory-nudge.sh \\
  -o ~/.claude/hooks/memory-nudge.sh
chmod +x ~/.claude/hooks/memory-nudge.sh

# Register in ~/.claude/settings.json:
# "hooks": { "PostToolUse": [{ "type": "command",
#   "command": "~/.claude/hooks/memory-nudge.sh" }] }`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-memory-checkpoint",
    name: "Memory Checkpoint Hook",
    category: "hook",
    description:
      "Stop hook that runs a five-category memory review checklist at session end.",
    summary:
      "A Stop hook that fires when Claude Code ends a session. Presents a structured five-category checklist (tasks completed, decisions made, bugs found, gotchas discovered, errors resolved) and prompts to save anything uncaptured to vector memory. Runs once per session to avoid duplication. This is the second layer of the dual-layer memory reliability system.",
    tags: ["Memory", "Hooks", "Session Management", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[memory-checkpoint.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/memory-checkpoint.sh)",
    ],
    integrationSteps: [
      "Download [memory-checkpoint.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/memory-checkpoint.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/memory-checkpoint.sh",
      "Register as a Stop hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/memory-checkpoint.sh \\
  -o ~/.claude/hooks/memory-checkpoint.sh
chmod +x ~/.claude/hooks/memory-checkpoint.sh

# Register in ~/.claude/settings.json:
# "hooks": { "Stop": [{ "type": "command",
#   "command": "~/.claude/hooks/memory-checkpoint.sh" }] }`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-observe-homunculus",
    name: "Observe Homunculus Hook",
    category: "hook",
    description:
      "PostToolUse hook that captures tool usage patterns to JSONL for the Homunculus learning pipeline.",
    summary:
      "Appends a structured JSONL record to observations.jsonl after every tool use. Each record includes the tool name, parameters (sanitized), timestamp, and session ID. These observations feed the Homunculus behavioral pattern extraction pipeline that the /evolve command processes into new skills and agents.",
    tags: ["Homunculus", "Learning", "Hooks", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[observe-homunculus.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/observe-homunculus.sh)",
    ],
    integrationSteps: [
      "Download [observe-homunculus.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/observe-homunculus.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/observe-homunculus.sh",
      "Register as an async PostToolUse hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/observe-homunculus.sh \\
  -o ~/.claude/hooks/observe-homunculus.sh
chmod +x ~/.claude/hooks/observe-homunculus.sh

# Register with async: true so it doesn't block tool calls`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-kg-update-detect",
    name: "KG Update Detect Hook",
    category: "hook",
    description:
      "PostToolUse hook that detects config file edits and reminds Claude to update the knowledge graph.",
    summary:
      "Watches for Edit and Write operations on known Claude Code config files (agents/, skills/, hooks/, commands/, rules/). When it detects a config change, it outputs a reminder to update the MCP knowledge graph entity for that component. Prevents the graph from drifting out of sync with the actual files.",
    tags: ["Knowledge Graph", "Memory", "Hooks", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[kg-update-detect.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/kg-update-detect.sh)",
    ],
    integrationSteps: [
      "Download [kg-update-detect.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/kg-update-detect.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/kg-update-detect.sh",
      "Register as a PostToolUse hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/kg-update-detect.sh \\
  -o ~/.claude/hooks/kg-update-detect.sh
chmod +x ~/.claude/hooks/kg-update-detect.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-pre-compact",
    name: "Pre-Compact Hook",
    category: "hook",
    description:
      "PreCompact hook that saves session context to a scratchpad before compaction.",
    summary:
      "Fires before /compact runs. Writes a structured session scratchpad to ~/.claude/session-state/{project}-{timestamp}.md covering the current task, progress, key decisions, active files, and next steps. This scratchpad is the recovery source when context has been compacted and you need to resume mid-task.",
    tags: ["Context Management", "Hooks", "Session Management", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[pre-compact.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/pre-compact.sh)",
    ],
    integrationSteps: [
      "Download [pre-compact.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/pre-compact.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/pre-compact.sh",
      "Register as a PreCompact hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/pre-compact.sh \\
  -o ~/.claude/hooks/pre-compact.sh
chmod +x ~/.claude/hooks/pre-compact.sh

# Register in ~/.claude/settings.json:
# "hooks": { "PreCompact": [{ "type": "command",
#   "command": "~/.claude/hooks/pre-compact.sh" }] }`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-dispatch",
    name: "Hook Dispatcher",
    category: "hook",
    description:
      "Cross-platform hook dispatcher that routes to .sh on macOS and .ps1 on Windows.",
    summary:
      "A thin wrapper hook that detects the current platform and dispatches to the platform-appropriate hook implementation. On macOS it calls the .sh version, on Windows it invokes PowerShell with the .ps1 version. Eliminates the need to maintain separate settings.json files per platform.",
    tags: ["Cross-Platform", "Hooks", "Windows", "macOS"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[dispatch.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/dispatch.sh)",
    ],
    integrationSteps: [
      "Download [dispatch.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/dispatch.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/dispatch.sh",
      "Use as the single hook command entry in settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/dispatch.sh \\
  -o ~/.claude/hooks/dispatch.sh
chmod +x ~/.claude/hooks/dispatch.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-session-scratchpad",
    name: "Session Scratchpad Hook",
    category: "hook",
    description:
      "PostToolUse hook that counts tool calls and reminds Claude to update the session scratchpad.",
    summary:
      "Counts tool invocations and, at a configured interval (default every 10 tool calls), outputs a nudge to update the session state scratchpad. The scratchpad is the in-flight context recovery document written to ~/.claude/session-state/. Pairs with the pre-compact hook to ensure context is never lost.",
    tags: ["Context Management", "Hooks", "Session Management", "Automation"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[session-scratchpad.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/session-scratchpad.sh)",
    ],
    integrationSteps: [
      "Download [session-scratchpad.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/session-scratchpad.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/session-scratchpad.sh",
      "Register as a PostToolUse hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/session-scratchpad.sh \\
  -o ~/.claude/hooks/session-scratchpad.sh
chmod +x ~/.claude/hooks/session-scratchpad.sh`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "hook-prompt-notify",
    name: "Prompt Notify Hook",
    category: "hook",
    description:
      "Stop hook that plays a notification sound when Claude finishes and needs attention.",
    summary:
      "A Stop hook that fires when Claude Code completes a task and is waiting for the next prompt. Plays a system notification sound (using osascript on macOS) so you know Claude is done even if you've switched to another window. Eliminates the need to watch the terminal while waiting for long tasks to complete.",
    tags: ["Productivity", "Hooks", "macOS", "Notifications"],
    dependencies: [
      "Bash",
      "Claude Code CLI",
      "[prompt-notify.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/prompt-notify.sh)",
      "macOS (osascript)",
    ],
    integrationSteps: [
      "Download [prompt-notify.sh](https://github.com/chris2ao/claude-code-config/blob/master/hooks/prompt-notify.sh) to ~/.claude/hooks/",
      "Make executable: chmod +x ~/.claude/hooks/prompt-notify.sh",
      "Register as a Stop hook in ~/.claude/settings.json",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/hooks
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/hooks/prompt-notify.sh \\
  -o ~/.claude/hooks/prompt-notify.sh
chmod +x ~/.claude/hooks/prompt-notify.sh

# Register in ~/.claude/settings.json:
# "hooks": { "Stop": [{ "type": "command",
#   "command": "~/.claude/hooks/prompt-notify.sh" }] }`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "blog-inventory",
    name: "Blog Inventory",
    category: "hook",
    description:
      "Shell script that scans and catalogs all blog posts with metadata for quick reference.",
    summary:
      "Scans the blog content directory and produces a formatted inventory of all posts including title, date, tags, word count, and reading time. Useful for content planning, identifying gaps in topic coverage, and tracking publishing cadence.",
    tags: ["Blog", "Documentation", "Shell"],
    dependencies: [
      "Bash",
      "[blog-inventory.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/blog-inventory.sh)",
      "Blog content directory",
    ],
    integrationSteps: [
      "Download [blog-inventory.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/blog-inventory.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/blog-inventory.sh",
      "Run: ~/.claude/scripts/blog-inventory.sh",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/blog-inventory.sh \\
  -o ~/.claude/scripts/blog-inventory.sh
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
    dependencies: [
      "Bash",
      "[cleanup-session.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/cleanup-session.sh)",
    ],
    integrationSteps: [
      "Download [cleanup-session.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/cleanup-session.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/cleanup-session.sh",
      "Optionally configure as a session-end hook",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/cleanup-session.sh \\
  -o ~/.claude/scripts/cleanup-session.sh
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
      "A shell script companion to the config-sync agent. Produces a colorized diff between your local ~/.claude/ configuration and the claude-code-config repository. Faster than the agent for quick checks: shows exactly which lines changed without the overhead of spawning an AI agent.",
    tags: ["Configuration", "DevOps", "Shell"],
    dependencies: [
      "Bash",
      "diff",
      "Git",
      "[config-diff.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/config-diff.sh)",
    ],
    integrationSteps: [
      "Download [config-diff.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/config-diff.sh) to ~/.claude/scripts/",
      "Update REPO_PATH variable to your clone location",
      "Run to see local vs repo differences",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/config-diff.sh \\
  -o ~/.claude/scripts/config-diff.sh
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
    dependencies: [
      "Bash",
      "[context-health.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/context-health.sh)",
    ],
    integrationSteps: [
      "Download [context-health.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/context-health.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/context-health.sh",
      "Run mid-session for a quick context check",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/context-health.sh \\
  -o ~/.claude/scripts/context-health.sh
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
    dependencies: [
      "Bash",
      "Git",
      "[git-stats.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/git-stats.sh)",
    ],
    integrationSteps: [
      "Download [git-stats.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/git-stats.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/git-stats.sh",
      "Run in any git repository for stats",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/git-stats.sh \\
  -o ~/.claude/scripts/git-stats.sh
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
    dependencies: [
      "Bash",
      "Git",
      "[sync-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/sync-survey.sh)",
    ],
    integrationSteps: [
      "Download [sync-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/sync-survey.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/sync-survey.sh",
      "Run before sync operations for a status overview",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/sync-survey.sh \\
  -o ~/.claude/scripts/sync-survey.sh
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
    dependencies: [
      "Bash",
      "[validate-mdx.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/validate-mdx.sh)",
      "Blog content directory",
    ],
    integrationSteps: [
      "Download [validate-mdx.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/validate-mdx.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/validate-mdx.sh",
      "Run against your content directory or individual files",
      "Optionally configure as a pre-commit hook",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/validate-mdx.sh \\
  -o ~/.claude/scripts/validate-mdx.sh
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
      "Runs before the /wrap-up skill to gather session state: uncommitted changes, modified files, new learnings, and pending tasks. Produces a structured report that the wrap-up-orchestrator uses to decide which sub-agents to invoke. Skips unnecessary steps (e.g., changelog-writer if no commits since last run).",
    tags: ["Session Management", "Automation", "Shell"],
    dependencies: [
      "Bash",
      "Git",
      "[wrap-up-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/wrap-up-survey.sh)",
    ],
    integrationSteps: [
      "Download [wrap-up-survey.sh](https://github.com/chris2ao/claude-code-config/blob/master/scripts/wrap-up-survey.sh) to ~/.claude/scripts/",
      "Make executable: chmod +x ~/.claude/scripts/wrap-up-survey.sh",
      "Automatically invoked by /wrap-up or run manually",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/scripts
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/scripts/wrap-up-survey.sh \\
  -o ~/.claude/scripts/wrap-up-survey.sh
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
    dependencies: [
      "Claude Code CLI",
      "[agentic-workflow.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/agentic-workflow.md)",
    ],
    integrationSteps: [
      "Download [agentic-workflow.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/agentic-workflow.md) to ~/.claude/rules/core/",
      "Rules are loaded automatically on every session",
      "No additional configuration needed",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/core/agentic-workflow.md \\
  -o ~/.claude/rules/core/agentic-workflow.md`,
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
      "Establishes coding conventions including preference for immutable data structures, functional patterns over mutation, consistent file organization (exports at top, implementation below), and writing style rules (including the em-dash prohibition). Applied globally across all projects.",
    tags: ["Code Quality", "Style", "Core"],
    dependencies: [
      "Claude Code CLI",
      "[coding-style.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/coding-style.md)",
    ],
    integrationSteps: [
      "Download [coding-style.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/coding-style.md) to ~/.claude/rules/core/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/core/coding-style.md \\
  -o ~/.claude/rules/core/coding-style.md`,
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
    dependencies: [
      "Claude Code CLI",
      "[security.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/security.md)",
    ],
    integrationSteps: [
      "Download [security.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/security.md) to ~/.claude/rules/core/",
      "Automatically active in all sessions",
      "Works with pre-commit-checker agent for enforcement",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/core/security.md \\
  -o ~/.claude/rules/core/security.md`,
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
      "Enforces conventional commit message format, feature branch naming conventions, PR template compliance, and TDD-driven development workflow. Includes rules for commit body formatting (short, punchy descriptions), branch naming patterns, and merge strategy preferences.",
    tags: ["Git", "Workflow", "Development"],
    dependencies: [
      "Claude Code CLI",
      "Git",
      "[git-workflow.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/git-workflow.md)",
    ],
    integrationSteps: [
      "Download [git-workflow.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/git-workflow.md) to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/development/git-workflow.md \\
  -o ~/.claude/rules/development/git-workflow.md`,
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
    dependencies: [
      "Claude Code CLI",
      "[patterns.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/patterns.md)",
    ],
    integrationSteps: [
      "Download [patterns.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/patterns.md) to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/development/patterns.md \\
  -o ~/.claude/rules/development/patterns.md`,
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
    dependencies: [
      "Claude Code CLI",
      "[testing.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/testing.md)",
      "Test framework (Vitest, Jest, etc.)",
    ],
    integrationSteps: [
      "Download [testing.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/testing.md) to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/development/testing.md \\
  -o ~/.claude/rules/development/testing.md`,
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
    dependencies: [
      "Claude Code CLI",
      "[hooks.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/hooks.md)",
    ],
    integrationSteps: [
      "Download [hooks.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/hooks.md) to ~/.claude/rules/operations/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/operations/hooks.md \\
  -o ~/.claude/rules/operations/hooks.md`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-performance",
    name: "Performance and Model Routing",
    category: "configuration",
    description:
      "Model routing (Haiku/Sonnet/Opus) and cost optimization strategies.",
    summary:
      "Defines when to use each model tier for optimal cost-performance balance. Haiku for simple lookups, git operations, and formatting tasks. Sonnet for code generation, analysis, and content writing. Opus for complex architectural decisions and nuanced reasoning. Includes token budget guidelines and strategies for reducing context window consumption.",
    tags: ["Performance", "Cost", "Operations"],
    dependencies: [
      "Claude Code CLI",
      "[performance.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/performance.md)",
    ],
    integrationSteps: [
      "Download [performance.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/performance.md) to ~/.claude/rules/operations/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/operations/performance.md \\
  -o ~/.claude/rules/operations/performance.md`,
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
    dependencies: [
      "Claude Code CLI",
      "Windows",
      "[windows-platform.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/windows-platform.md)",
    ],
    integrationSteps: [
      "Download [windows-platform.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/windows-platform.md) to ~/.claude/rules/operations/",
      "Only needed on Windows machines",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install (Windows only)
mkdir -p ~/.claude/rules/operations
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/operations/windows-platform.md \\
  -o ~/.claude/rules/operations/windows-platform.md`,
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
      "Defines how plugin agents (from everything-claude-code) and custom agents work together. Establishes activation triggers: when a planner agent should be invoked vs. a security reviewer vs. a TDD guide. Covers agent escalation patterns, inter-agent communication, and model assignment conventions.",
    tags: ["Agents", "Orchestration", "Operations"],
    dependencies: [
      "Claude Code CLI",
      "[agents.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/agents.md)",
      "everything-claude-code plugin (optional)",
    ],
    integrationSteps: [
      "Download [agents.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/agents.md) to ~/.claude/rules/",
      "Install everything-claude-code plugin for full agent support",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/agents.md \\
  -o ~/.claude/rules/agents.md

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
      "[memory-management.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/memory-management.md)",
      "vector-memory MCP server",
      "memory MCP server (knowledge graph)",
    ],
    integrationSteps: [
      "Download [memory-management.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/core/memory-management.md) to ~/.claude/rules/core/",
      "Ensure vector-memory and memory MCP servers are configured",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/core
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/core/memory-management.md \\
  -o ~/.claude/rules/core/memory-management.md`,
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
    dependencies: [
      "Claude Code CLI",
      "[blog-content.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/content/blog-content.md)",
    ],
    integrationSteps: [
      "Download [blog-content.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/content/blog-content.md) to ~/.claude/rules/content/",
      "Automatically active in all sessions",
      "Applies when writing or editing blog posts",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/content
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/content/blog-content.md \\
  -o ~/.claude/rules/content/blog-content.md`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-plan-docs",
    name: "Plan Documentation Rules",
    category: "configuration",
    description:
      "Plans saved as markdown files to docs/plans/ in the current project.",
    summary:
      "Enforces that implementation plans are always saved as markdown files in docs/plans/ (not in docs/superpowers/plans/ or any other location). Plans use descriptive filenames like auth-refactor-plan.md and should be committed alongside the code they describe. This ensures plans are versioned, reviewable, and findable.",
    tags: ["Documentation", "Planning", "Development"],
    dependencies: [
      "Claude Code CLI",
      "[plan-docs.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/plan-docs.md)",
    ],
    integrationSteps: [
      "Download [plan-docs.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/development/plan-docs.md) to ~/.claude/rules/development/",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/development
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/development/plan-docs.md \\
  -o ~/.claude/rules/development/plan-docs.md`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-context-preservation",
    name: "Context Preservation Rules",
    category: "configuration",
    description:
      "How Claude recovers context after compaction: scratchpad, vector memory, and user confirmation flow.",
    summary:
      "Defines the three-step context recovery flow for post-compaction sessions: check ~/.claude/session-state/ for the most recent scratchpad, query vector memory with task keywords, and present recovered context to the user for confirmation before acting. Also defines when to write scratchpad updates (when nudged by hook) and what to include (task, progress, decisions, files, next steps, but never secrets).",
    tags: ["Context Management", "Memory", "Operations", "Session Management"],
    dependencies: [
      "Claude Code CLI",
      "[context-preservation.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/context-preservation.md)",
    ],
    integrationSteps: [
      "Download [context-preservation.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/context-preservation.md) to ~/.claude/rules/operations/",
      "Pair with the pre-compact and session-scratchpad hooks for full coverage",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install
mkdir -p ~/.claude/rules/operations
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/operations/context-preservation.md \\
  -o ~/.claude/rules/operations/context-preservation.md`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "rule-macos-platform",
    name: "macOS Platform Rules",
    category: "configuration",
    description:
      "macOS-specific shell, path, MCP server, and hooks conventions.",
    summary:
      "Documents macOS-specific conventions for Claude Code: zsh as the default shell, Homebrew tool paths (/opt/homebrew/bin/), npx-based MCP server commands (no cmd /c wrapper), osascript for system notifications, APFS case-insensitivity caveats, and .sh hook scripts with executable permissions. The counterpart to the Windows platform rules.",
    tags: ["macOS", "Platform", "Operations", "Hooks"],
    dependencies: [
      "Claude Code CLI",
      "macOS",
      "[macos-platform.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/macos-platform.md)",
    ],
    integrationSteps: [
      "Download [macos-platform.md](https://github.com/chris2ao/claude-code-config/blob/master/rules/operations/macos-platform.md) to ~/.claude/rules/operations/",
      "Only needed on macOS machines",
      "Automatically active in all sessions",
    ],
    codeSnippet: `# Install (macOS only)
mkdir -p ~/.claude/rules/operations
curl -sL https://raw.githubusercontent.com/chris2ao/claude-code-config/master/rules/operations/macos-platform.md \\
  -o ~/.claude/rules/operations/macos-platform.md`,
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
      "The @modelcontextprotocol/server-memory MCP server provides Claude Code with a persistent knowledge graph that survives across sessions. Claude can store entities, relationships, and observations during a session and retrieve them in future sessions. This is the closest thing to giving Claude a long-term memory. Particularly valuable for project context that would otherwise be lost between sessions -architecture decisions, naming conventions, known issues, and team preferences.",
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
      "Live documentation lookup for any library -gets current docs instead of training data.",
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
    id: "mcp-gmail",
    name: "Gmail",
    category: "mcp",
    description:
      "Gmail integration for searching, reading, drafting, and managing email from Claude Code.",
    summary:
      "Connects Claude Code to your Gmail account for email management. Supports searching with Gmail's full query syntax, reading individual messages and full threads, creating drafts (including replies), listing labels, and viewing your profile. Read-focused by design to prevent accidental sends. Pair with explicit user confirmation for any email actions.",
    tags: ["MCP", "Email", "Gmail", "Productivity"],
    dependencies: ["Google OAuth credentials"],
    integrationSteps: [
      "Configure Google OAuth for Gmail API access",
      "Add the Gmail MCP server to your config",
      "Claude can search, read, and draft emails",
      "Sending requires explicit user confirmation",
    ],
    codeSnippet: `# Key tools available:
# gmail_search_messages -full Gmail search syntax
# gmail_read_message -read a specific email
# gmail_read_thread -read full conversation
# gmail_create_draft -compose draft emails
# gmail_list_labels -see your label structure
# gmail_list_drafts -review unsent drafts`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-google-calendar",
    name: "Google Calendar",
    category: "mcp",
    description:
      "Google Calendar integration for viewing, creating, and managing events and finding meeting times.",
    summary:
      "Full Google Calendar integration that lets Claude Code manage your schedule. List events across calendars, create and update events with attendees and video conferencing, find mutual availability for meetings, check your free time, respond to invitations, and delete events. Supports recurring events, conference room booking, and multi-calendar queries.",
    tags: ["MCP", "Calendar", "Google", "Productivity"],
    dependencies: ["Google OAuth credentials"],
    integrationSteps: [
      "Configure Google OAuth for Calendar API access",
      "Add the Google Calendar MCP server to your config",
      "Claude can view, create, and manage calendar events",
      "Event creation and deletion require user confirmation",
    ],
    codeSnippet: `# Key tools available:
# gcal_list_events -view events in any calendar
# gcal_create_event -schedule with attendees + Meet
# gcal_find_meeting_times -mutual availability
# gcal_find_my_free_time -personal schedule gaps
# gcal_update_event -modify existing events
# gcal_respond_to_event -accept/decline invitations`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-vercel",
    name: "Vercel",
    category: "mcp",
    description:
      "Vercel deployment management: deploy, inspect builds, view logs, and search Vercel docs.",
    summary:
      "Integrates Claude Code with the Vercel platform for deployment and hosting operations. Deploy projects directly, inspect deployment details and build logs, view runtime logs with filtering, manage projects and teams, check domain availability, and search Vercel documentation. Supports both production and preview deployments with authentication for protected URLs.",
    tags: ["MCP", "Vercel", "DevOps", "Deployment"],
    dependencies: ["Vercel account and token"],
    integrationSteps: [
      "Configure Vercel authentication token",
      "Add the Vercel MCP server to your config",
      "Claude can deploy, inspect, and debug Vercel deployments",
    ],
    codeSnippet: `# Key tools available:
# deploy_to_vercel -deploy current project
# get_deployment_build_logs -debug build failures
# get_runtime_logs -view application output
# list_deployments -see deployment history
# search_vercel_documentation -query Vercel docs
# check_domain_availability_and_price -domain lookup`,
    author: "Vercel",
    repo: "chris2ao/claude-code-config",
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
# get_vault_file -read any note
# create_vault_file -create/update notes
# search_vault_simple -text search
# search_vault_smart -semantic search
# patch_vault_file -insert at headings/blocks
# execute_template -run Templater templates
# list_vault_files -browse vault structure`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-excalidraw",
    name: "Excalidraw",
    category: "mcp",
    description:
      "Hand-drawn diagram creation with Excalidraw elements rendered with draw-on animations.",
    summary:
      "An MCP server that lets Claude Code create hand-drawn style diagrams using Excalidraw. Elements stream in one by one with draw-on animations for a polished presentation effect. Useful for architecture diagrams, flowcharts, data models, and system designs directly from your Claude Code session without leaving the terminal.",
    tags: ["MCP", "Diagrams", "Visualization"],
    dependencies: ["Excalidraw MCP server"],
    integrationSteps: [
      "Add the Excalidraw MCP server to your config",
      "Call read_me first to learn the element format",
      "Use create_view to render diagrams with JSON element arrays",
    ],
    codeSnippet: `# Key tools available:
# read_me -get element format reference + color palettes
# create_view -render hand-drawn diagram from elements

# Usage pattern:
# 1. Call read_me to learn the format
# 2. Build element JSON array
# 3. Call create_view with the elements`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-claude-in-chrome",
    name: "Claude in Chrome",
    category: "mcp",
    description:
      "Full browser automation: click, type, screenshot, navigate, read pages, and execute JavaScript.",
    summary:
      "A Chrome extension MCP server that gives Claude Code full browser automation capabilities. Take screenshots, read page accessibility trees, find elements by natural language, fill forms, click buttons, navigate URLs, execute JavaScript, read console logs and network requests, record GIF animations, and manage browser tabs. Essential for web testing, scraping, and any task requiring visual browser interaction.",
    tags: ["MCP", "Browser", "Automation", "Testing"],
    dependencies: ["Chrome browser", "Claude in Chrome extension"],
    integrationSteps: [
      "Install the Claude in Chrome extension from the Chrome Web Store",
      "The MCP server connects automatically when the extension is active",
      "Use tabs_context_mcp first to discover available tabs",
      "Take screenshots, interact with pages, and automate workflows",
    ],
    codeSnippet: `# Key tools available:
# computer -mouse/keyboard actions + screenshots
# read_page -accessibility tree of page elements
# find -natural language element search
# form_input -fill form fields
# navigate -go to URLs, back/forward
# javascript_tool -execute JS in page context
# get_page_text -extract article text
# read_console_messages -browser console output
# gif_creator -record browser session GIFs`,
    author: "ArcadeAI",
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
# repo_status -cached git status across all repos
# blog_posts -blog inventory with metadata
# style_guide -cached blog reference docs
# validate_blog_post -check MDX against style rules
# session_artifacts -count session outputs`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-claude-preview",
    name: "Claude Preview",
    category: "mcp",
    description:
      "Dev server management with live preview: screenshots, accessibility snapshots, DOM inspection, and interaction.",
    summary:
      "An MCP server for managing development servers and previewing web applications. Start dev servers from a launch.json config, take screenshots, inspect DOM elements with computed styles, click elements, fill forms, check console and server logs, view network requests, and resize viewports for responsive testing. Replaces the need to switch between terminal and browser during development.",
    tags: ["MCP", "Development", "Preview", "Testing"],
    dependencies: [".claude/launch.json configuration"],
    integrationSteps: [
      "Create .claude/launch.json with your dev server configurations",
      "Use preview_start to launch servers",
      "Take screenshots and inspect elements without leaving Claude Code",
      "Check build logs and console output directly",
    ],
    codeSnippet: `# .claude/launch.json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "dev",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}

# Key tools: preview_start, preview_screenshot,
# preview_snapshot, preview_inspect, preview_click,
# preview_logs, preview_network, preview_resize`,
    author: "Anthropic",
    repo: "anthropics/claude-code",
  },
  {
    id: "mcp-mermaid",
    name: "Mermaid Diagrams",
    category: "mcp",
    description:
      "Validate and render Mermaid diagrams with syntax checking and interactive UI widgets.",
    summary:
      "An MCP server that validates Mermaid diagram syntax and renders diagrams to interactive UI widgets. Each rendered diagram includes the diagram code, a Copy Code button, and the visual output. Invalid syntax provides a link to repair the diagram in Mermaid Live. Supports all Mermaid diagram types: flowcharts, sequence diagrams, class diagrams, state diagrams, ERDs, Gantt charts, and more.",
    tags: ["MCP", "Diagrams", "Visualization", "Documentation"],
    dependencies: ["Mermaid MCP server"],
    integrationSteps: [
      "Add the Mermaid MCP server to your config",
      "Use validate_and_render_mermaid_diagram with diagram code",
      "Rendered diagrams appear as interactive widgets",
    ],
    codeSnippet: `# Key tool: validate_and_render_mermaid_diagram
# Supports all Mermaid diagram types:
# - flowchart, sequence, class, state
# - ERD, Gantt, pie, mindmap, timeline

# Example usage:
# validate_and_render_mermaid_diagram(
#   diagramCode: "graph TD; A-->B; B-->C",
#   title: "Simple Flow"
# )`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-registry",
    name: "MCP Registry",
    category: "mcp",
    description:
      "Discover and connect new MCP servers from a searchable registry of available integrations.",
    summary:
      "A meta-MCP server that helps discover and connect new MCP integrations. Search the registry by keywords to find connectors for external services (Asana, Jira, Slack, etc.), then suggest connectors to the user with one-click Connect buttons. Also handles re-authentication when tool calls fail with credential errors. The gateway to expanding Claude Code's integration surface.",
    tags: ["MCP", "Discovery", "Integration"],
    dependencies: ["MCP Registry account"],
    integrationSteps: [
      "The registry server is pre-configured",
      "Use search_mcp_registry to find available connectors",
      "Use suggest_connectors to present options to the user",
      "User clicks Connect to authenticate and enable new integrations",
    ],
    codeSnippet: `# Key tools available:
# search_mcp_registry -find connectors by keyword
# suggest_connectors -show Connect buttons to user

# Example: user says "check my Asana tasks"
# 1. search_mcp_registry(keywords: ["asana", "tasks"])
# 2. suggest_connectors(uuids: ["<asana-uuid>"])
# 3. User clicks Connect to authenticate`,
    author: "Community",
    repo: "chris2ao/claude-code-config",
  },
  {
    id: "mcp-exa",
    name: "Exa (Semantic Search)",
    category: "mcp",
    description:
      "Semantic web search via the Exa API for AI-optimized results and date filtering.",
    summary:
      "The Exa MCP server gives Claude Code access to Exa's semantic search engine. Unlike keyword search, Exa finds pages that are conceptually similar to your query. Supports LinkedIn profile search, date-filtered news, domain-restricted searches, and the get_code_context_exa tool for finding real code examples. Requires an EXA_API_KEY environment variable.",
    tags: ["MCP", "Search", "Exa", "Research"],
    dependencies: ["Node.js", "npx", "EXA_API_KEY"],
    integrationSteps: [
      "Get an API key from exa.ai",
      "Add EXA_API_KEY to your shell environment or ~/.claude/secrets/secrets.env",
      "Install the MCP server with the command below",
    ],
    codeSnippet: `# Set your API key
export EXA_API_KEY=your-key-here

# Install
claude mcp add exa -- npx -y @modelcontextprotocol/server-exa

# Key tools:
# web_search_exa: semantic search
# get_code_context_exa: find real code examples
# crawling_exa: crawl a list of URLs`,
    author: "Exa / MCP Community",
    repo: "modelcontextprotocol/servers",
  },
  {
    id: "mcp-firecrawl",
    name: "Firecrawl (JS-Rendered Scraping)",
    category: "mcp",
    description:
      "Scrapes JavaScript-rendered pages, bypasses anti-bot protection, and extracts structured content.",
    summary:
      "The Firecrawl MCP server lets Claude Code scrape pages that require JavaScript execution. Where standard WebFetch returns a blank page for SPAs or Cloudflare-protected sites, Firecrawl renders the full DOM and extracts clean Markdown content. Supports crawling, mapping site structure, and extracting structured data. Requires a FIRECRAWL_API_KEY environment variable.",
    tags: ["MCP", "Scraping", "Firecrawl", "Research"],
    dependencies: ["Node.js", "npx", "FIRECRAWL_API_KEY"],
    integrationSteps: [
      "Get an API key from firecrawl.dev",
      "Add FIRECRAWL_API_KEY to your shell environment or ~/.claude/secrets/secrets.env",
      "Install the MCP server with the command below",
    ],
    codeSnippet: `# Set your API key
export FIRECRAWL_API_KEY=your-key-here

# Install
claude mcp add firecrawl -- npx -y firecrawl-mcp

# Key tools:
# firecrawl_scrape: scrape a single URL to Markdown
# firecrawl_crawl: crawl a site recursively
# firecrawl_map: map all URLs on a site
# firecrawl_search: search + scrape results`,
    author: "Firecrawl / MCP Community",
    repo: "mendableai/firecrawl",
  },
  {
    id: "mcp-notebooklm",
    name: "NotebookLM",
    category: "mcp",
    description:
      "Google NotebookLM operations: notebooks, sources, queries, audio, and infographic generation.",
    summary:
      "The NotebookLM MCP server exposes the full NotebookLM API to Claude Code. Create and manage notebooks, add sources from URLs, text, Drive, or local files, query notebooks with follow-up chat, generate audio overviews, create infographics and slide decks via the studio, and run cross-notebook research queries. Authentication uses the nlm CLI tool.",
    tags: ["MCP", "NotebookLM", "Google", "Research", "Content Generation"],
    dependencies: ["Node.js", "npx", "nlm CLI (notebooklm-mcp)"],
    integrationSteps: [
      "Install the MCP server with the command below",
      "Authenticate: run nlm login in your terminal",
      "Claude Code can now manage NotebookLM notebooks directly",
    ],
    codeSnippet: `# Install
claude mcp add notebooklm -- npx -y notebooklm-mcp

# Authenticate
nlm login

# Key tools:
# notebook_create / notebook_list / notebook_get
# source_add (url|text|drive|file)
# notebook_query: ask questions to the notebook
# studio_create (audio|infographic|slides)
# download_artifact: save generated assets`,
    author: "Community",
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
    codeSnippet: `# Wrong -$input silently returns nothing
$hookData = $input | ConvertFrom-Json

# Correct -explicit stdin read
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
      "Claude Code custom commands in the commands/ directory require YAML frontmatter at the top of the .md file. Without it, the command file is silently ignored -no error, no warning, just nothing happens when you type the slash command. The frontmatter must include at minimum a name field.",
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
# Wrong -non-deterministic when multiple posts share a date
date: "2026-02-14"

# Correct -deterministic ordering
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
    codeSnippet: `// Wrong -secret in URL
// GET /admin?secret=abc123

// Correct -httpOnly cookie
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
    codeSnippet: `# Wrong -fails with shallow clone
git fetch --depth=1 origin main
git push --force origin feature

# Correct -full fetch first
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
      "Vercel's Web Application Firewall configuration in vercel.json uses a non-obvious syntax. Security rules go under a 'routes' array with 'mitigate' objects, not under a 'rules' key. The mitigate object uses conditions with rate limiting, IP blocking, and geographic restrictions. Getting the syntax wrong results in silent failures -no errors, just no protection.",
    tags: ["Security", "Vercel", "DevOps", "Configuration"],
    dependencies: ["Vercel"],
    integrationSteps: [
      "Add mitigate rules under 'routes' in vercel.json",
      "Test with vercel dev before deploying",
      "Verify rules are active in Vercel dashboard",
    ],
    codeSnippet: `// vercel.json -correct WAF syntax
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
    codeSnippet: `// Wrong -may not resolve correctly
const model = "claude-3-5-haiku-latest";

// Correct -exact date suffix
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
    codeSnippet: `// Wrong -arrow functions can't be new'd
vi.mock("./MyClass", () => ({
  MyClass: () => ({ doThing: vi.fn() }),
}));

// Correct -use a class
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
    codeSnippet: `# Wrong -parentheses may pollute permissions
git commit -m "$(cat <<EOF
feat: add auth (JWT-based)
EOF
)"

# Correct -single-quoted delimiter
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
    codeSnippet: `# Wrong -Git Bash strips the $
powershell -Command "echo $env:PATH"
# PowerShell receives: echo env:PATH

# Correct -use a temp file
echo 'echo $env:PATH' > /tmp/script.ps1
powershell -File /tmp/script.ps1
rm /tmp/script.ps1`,
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
      "Claude Code's interactive TUI can freeze when the project state directory (~/.claude/projects/...) becomes corrupted, often from a crashed session or concurrent access. The fix is to rename the corrupted project state directory and restart Claude Code -it recreates the state directory automatically. This is faster than debugging the corruption.",
    tags: ["Claude Code", "Debugging", "Recovery"],
    dependencies: ["Claude Code CLI"],
    integrationSteps: [
      "Identify the frozen project state directory in ~/.claude/projects/",
      "Rename it: mv <dir> <dir>.bak",
      "Restart Claude Code -state is recreated automatically",
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
      "\"Found N invalid settings files\" -debug with --debug, check YAML quoting and MCP type field.",
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

# Correct -add "type": "stdio"
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
# 1. Topic Selection -interactive prompts
# 2. Research -parallel agents mine git logs, changelogs
# 3. Tone Calibration -read 2-3 recent posts
# 4. Outline -structure with sections, callouts
# 5. Write -delegate to Sonnet via blog-post-orchestrator
# 6. Validate -em dashes, GIFs, frontmatter, MDX syntax
# 7. Review -code review pass for technical accuracy
# 8. Publish -build, commit, push

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
#    Task(model="haiku")  -scan files
#    Task(model="haiku")  -check dependencies
#    Task(model="haiku")  -validate configs
# 3. Captain collects results and synthesizes

# Model routing heuristic:
# Haiku  -exploration, file scanning, formatting
# Sonnet -code generation, analysis, writing
# Opus   -architecture, security, complex reasoning`,
    author: "Chris Johnson",
    repo: "chris2ao/claude-code-config",
  },

  // ── PowerShell Hooks (2) ───────────────────────────────────────
  {
    id: "hook-save-session",
    name: "Save Session Hook",
    category: "hook",
    description:
      "SessionEnd hook that archives full conversation transcripts with timestamps and summaries.",
    summary:
      "A PowerShell hook script that triggers on SessionEnd events. Archives the full conversation transcript with a timestamp and session ID, creates a human-readable summary, and updates an index file for easy browsing. This creates a persistent, searchable archive of all your Claude Code sessions -invaluable for the session-analyzer and skill-extractor agents.",
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
      "An async PowerShell hook that fires after every tool use (Bash, Edit, Write, NotebookEdit). Logs each operation with a timestamp, session ID, tool name, and operation details to an activity_log.txt file. This creates an audit trail of everything Claude Code does in your project -useful for debugging, compliance, and understanding session patterns. Runs async to avoid slowing down the main workflow.",
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

  // ── Plugin Configuration ───────────────────────────────────────
  {
    id: "plugin-everything-claude-code",
    name: "everything-claude-code Plugin",
    category: "configuration",
    description:
      "13 specialized agents, 30+ commands, and 30+ skills from the gold-standard Claude Code plugin.",
    summary:
      "The everything-claude-code plugin by Affaan Mustafa is the foundation of this configuration. It provides 13 specialized plugin agents (planner, architect, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, e2e-runner, refactor-cleaner, doc-updater, and more) that automatically activate based on context. Includes 30+ slash commands (/plan, /verify, /tdd, /code-review, /security, /build-fix) and 30+ embedded skills. Agents orchestrate automatically -complex features trigger the planner, code changes trigger the reviewer, bugs trigger the TDD guide.",
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
