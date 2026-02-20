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
    id: "blog-post-orchestrator",
    name: "Blog Post Orchestrator",
    category: "agent",
    description:
      "Orchestrates the full blog post creation pipeline from ideation to published MDX.",
    summary:
      "A meta-agent that coordinates the entire blog post workflow. Delegates to specialized sub-agents for content research, outline generation, prose writing, MDX formatting, image sourcing, and SEO optimization. Ensures consistent style guide adherence and proper frontmatter generation.",
    tags: ["Blog", "Content", "Orchestration", "Automation"],
    dependencies: [
      "Claude Code CLI",
      "blog-style-guide.md",
      "blog-mdx-reference.md",
    ],
    integrationSteps: [
      "Copy agents/blog-post-orchestrator.md to ~/.claude/agents/",
      "Ensure blog style guide and MDX reference are in place",
      "Invoke via Task tool for full pipeline execution",
    ],
    codeSnippet: `# Install
cp agents/blog-post-orchestrator.md ~/.claude/agents/

# Run the orchestrator
# Task(subagent_type="blog-post-orchestrator")`,
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

  // ── Learned Skills (18) ────────────────────────────────────────
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
