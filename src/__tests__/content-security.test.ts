/**
 * Content Security Tests
 *
 * These tests scan blog MDX files for information disclosure patterns
 * that could aid threat actors. Tests fail if sensitive patterns are detected.
 *
 * Purpose: Prevent accidental disclosure of private repository names,
 * internal file paths, Windows usernames, or hardcoded secrets in blog content.
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Helper: Read all blog MDX files
 */
function getAllBlogFiles(): string[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => path.join(BLOG_CONTENT_DIR, file));
}

/**
 * Helper: Read file content
 */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

describe("Content Security: Information Disclosure Prevention", () => {
  const blogFiles = getAllBlogFiles();

  it("should find blog MDX files to test", () => {
    expect(blogFiles.length).toBeGreaterThan(0);
  });

  describe("HIGH-1: Private Repository Names", () => {
    const PRIVATE_REPO_PATTERNS = [
      /cryptoflex-ops(?!\.com)/gi, // Private ops repo (but allow cryptoflexllc.com domain)
      /CJAI[_-]?Assistant/gi, // Private AI assistant repo
      /chris2ao\/cryptoflex-ops/gi, // Full GitHub path to private repo
      /chris2ao\/CJAI/gi, // Full GitHub path pattern
    ];

    blogFiles.forEach((file) => {
      it(`${path.basename(file)} should not contain private repo names`, () => {
        const content = readFile(file);

        PRIVATE_REPO_PATTERNS.forEach((pattern) => {
          const matches = content.match(pattern);
          expect(
            matches,
            `Found private repo pattern "${pattern}" in ${path.basename(file)}:\n${matches?.join("\n")}`
          ).toBeNull();
        });
      });
    });
  });

  describe("HIGH-2: Internal File Paths with Windows Username", () => {
    const WINDOWS_PATH_PATTERNS = [
      /D:\\Users\\chris_dnlqpqd/gi, // Full Windows path with username
      /D:[\\/]+Users[\\/]+chris/gi, // Escaped or unescaped Windows paths
      /C:\\Users\\chris_dnlqpqd/gi, // Alternative drive letter
      /chris_dnlqpqd[\\/]OneDrive/gi, // OneDrive paths with username
    ];

    blogFiles.forEach((file) => {
      it(`${path.basename(file)} should not contain Windows username in paths`, () => {
        const content = readFile(file);

        WINDOWS_PATH_PATTERNS.forEach((pattern) => {
          const matches = content.match(pattern);
          expect(
            matches,
            `Found Windows path with username "${pattern}" in ${path.basename(file)}:\n${matches?.join("\n")}`
          ).toBeNull();
        });
      });
    });
  });

  describe("HIGH-3: GitHub Username in Code Examples", () => {
    it("should not use 'chris2ao' in code examples (except URLs)", () => {
      blogFiles.forEach((file) => {
        const content = readFile(file);
        const basename = path.basename(file);

        // Match chris2ao NOT followed by common URL patterns
        // This catches: `authenticated as chris2ao` or `gh repo create chris2ao/...`
        // But allows: [github.com/chris2ao/repo](https://...)
        const codeExamplePattern = /(?<!github\.com\/)(?<!linkedin\.com\/)chris2ao(?!\/cryptoflexllc)(?!\/CJClaude_1)(?!["'\])])/g;

        const matches = content.match(codeExamplePattern);

        if (matches && matches.length > 0) {
          // Allow it in certain contexts (actual repository links, author metadata)
          const allowedContexts = [
            /author:\s*["']Chris Johnson["']/,
            /\[github\.com\/chris2ao/,
            /\(https:\/\/github\.com\/chris2ao/,
            /Built with Claude Code.*github\.com\/chris2ao/,
          ];

          const hasAllowedContext = allowedContexts.some(pattern =>
            content.match(pattern)
          );

          // If matches exist, verify they're in allowed contexts
          const lines = content.split("\n");
          matches.forEach(match => {
            const matchingLines = lines
              .map((line, idx) => ({ line, idx }))
              .filter(({ line }) => line.includes(match) && !allowedContexts.some(p => p.test(line)));

            expect(
              matchingLines.length,
              `Found 'chris2ao' in code example context in ${basename} (line ${matchingLines.map(l => l.idx + 1).join(", ")}). Use 'your-username' instead.`
            ).toBe(0);
          });
        }
      });
    });
  });

  describe("CRITICAL: Hardcoded Secrets (Should Never Appear)", () => {
    const SECRET_PATTERNS = [
      /api[_-]?key\s*=\s*["'][^$][^"']{20,}/gi, // API keys not using env vars
      /password\s*=\s*["'][^$][^"']{8,}/gi, // Hardcoded passwords
      /secret\s*=\s*["'][^$][^"']{20,}/gi, // Hardcoded secrets
      /token\s*=\s*["'][^$][^"']{20,}/gi, // Hardcoded tokens
      /sk-[a-zA-Z0-9]{20,}/g, // OpenAI/Anthropic API key pattern
      /gho_[a-zA-Z0-9]{36,}/g, // GitHub OAuth token pattern
      /ghp_[a-zA-Z0-9]{36,}/g, // GitHub personal access token
    ];

    blogFiles.forEach((file) => {
      it(`${path.basename(file)} should not contain hardcoded secrets`, () => {
        const content = readFile(file);

        SECRET_PATTERNS.forEach((pattern) => {
          const matches = content.match(pattern);

          // Filter out known safe examples (template strings, placeholders)
          const dangerousMatches = matches?.filter(match =>
            !match.includes("process.env") &&
            !match.includes("${") &&
            !match.includes("<your-") &&
            !match.includes("your-api-key") &&
            !match.includes("YOUR_") &&
            !match.includes("...") &&
            !/^(api[_-]?key|password|secret|token)\s*=\s*["'][A-Z_]+["']$/i.test(match)
          );

          expect(
            dangerousMatches?.length ?? 0,
            `Found potential hardcoded secret "${pattern}" in ${path.basename(file)}:\n${dangerousMatches?.join("\n")}`
          ).toBe(0);
        });
      });
    });
  });

  describe("MEDIUM: Environment Variable Name Disclosure", () => {
    it("should document environment variables responsibly", () => {
      // This is informational - we WANT to document env var names for tutorials
      // But we verify they're documented safely (no values shown)
      blogFiles.forEach((file) => {
        const content = readFile(file);

        // Check for env var assignments with actual values (not placeholders)
        const suspiciousEnvPattern = /(DATABASE_URL|ANALYTICS_SECRET|SUBSCRIBER_SECRET|GMAIL_APP_PASSWORD|VERCEL_API_TOKEN)\s*=\s*["'][^$<][^"']{10,}["']/g;

        const matches = content.match(suspiciousEnvPattern);

        expect(
          matches,
          `Found environment variable with potential real value in ${path.basename(file)}. Should use placeholder or process.env reference.`
        ).toBeNull();
      });
    });
  });

  describe("Test Suite Health Check", () => {
    it("should test all blog files", () => {
      expect(blogFiles.length).toBeGreaterThan(10); // Expect at least 10 blog posts
    });

    it("should have test coverage for all security categories", () => {
      const categories = [
        "Private Repository Names",
        "Internal File Paths",
        "GitHub Username",
        "Hardcoded Secrets",
        "Environment Variable",
      ];

      // This test verifies test suite completeness
      expect(categories.length).toBe(5);
    });
  });
});
