import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock fs and path before imports
const mockExistsSync = vi.fn();
const mockReaddirSync = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock("fs", () => ({
  existsSync: (...args: any[]) => mockExistsSync(...args),
  readdirSync: (...args: any[]) => mockReaddirSync(...args),
  readFileSync: (...args: any[]) => mockReadFileSync(...args),
  default: {
    existsSync: (...args: any[]) => mockExistsSync(...args),
    readdirSync: (...args: any[]) => mockReaddirSync(...args),
    readFileSync: (...args: any[]) => mockReadFileSync(...args),
  },
}));

import { getAllPosts, getAllTags, getPostBySlug } from "./blog";

describe("blog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue([]);
    mockReadFileSync.mockReturnValue("");
  });

  describe("getAllPosts", () => {
    it("returns empty array if content directory does not exist", () => {
      mockExistsSync.mockReturnValue(false);

      const posts = getAllPosts();

      expect(posts).toEqual([]);
      expect(mockExistsSync).toHaveBeenCalled();
    });

    it("returns empty array if no MDX files exist", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue([] as any);

      const posts = getAllPosts();

      expect(posts).toEqual([]);
    });

    it("parses MDX files and returns blog posts", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["post1.mdx", "post2.mdx"] as any);

      mockReadFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes("post1.mdx")) {
          return `---
title: First Post
date: 2026-01-01
author: Alice
readingTime: 5 min
description: First post description
tags: [tech, ai]
---
# Content for post 1`;
        }
        if (filePath.toString().includes("post2.mdx")) {
          return `---
title: Second Post
date: 2026-01-02
author: Bob
readingTime: 3 min
description: Second post description
tags: [coding]
---
# Content for post 2`;
        }
        return "";
      });

      const posts = getAllPosts();

      expect(posts).toHaveLength(2);
      expect(posts[0].slug).toBe("post2");
      expect(posts[0].title).toBe("Second Post");
      expect(posts[0].date).toBe("2026-01-02");
      expect(posts[1].slug).toBe("post1");
      expect(posts[1].date).toBe("2026-01-01");
    });

    it("sorts posts by date descending (newest first)", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue([
        "old.mdx",
        "recent.mdx",
        "oldest.mdx",
      ] as any);

      mockReadFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes("old.mdx")) {
          return `---
title: Old Post
date: 2025-06-01
---
Content`;
        }
        if (filePath.toString().includes("recent.mdx")) {
          return `---
title: Recent Post
date: 2026-02-01
---
Content`;
        }
        if (filePath.toString().includes("oldest.mdx")) {
          return `---
title: Oldest Post
date: 2025-01-01
---
Content`;
        }
        return "";
      });

      const posts = getAllPosts();

      expect(posts.map((p) => p.slug)).toEqual(["recent", "old", "oldest"]);
      expect(posts[0].date).toBe("2026-02-01");
      expect(posts[2].date).toBe("2025-01-01");
    });

    it("uses default values for missing frontmatter fields", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["minimal.mdx"] as any);
      mockReadFileSync.mockReturnValue(`---
title: Minimal Post
---
Just content`);

      const posts = getAllPosts();

      expect(posts[0].slug).toBe("minimal");
      expect(posts[0].title).toBe("Minimal Post");
      expect(posts[0].date).toBe("1970-01-01");
      expect(posts[0].author).toBe("");
      expect(posts[0].readingTime).toBe("");
      expect(posts[0].description).toBe("");
      expect(posts[0].tags).toEqual([]);
    });

    it("uses slug as title if title is missing", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["no-title.mdx"] as any);
      mockReadFileSync.mockReturnValue(`---
date: 2026-01-01
---
Content`);

      const posts = getAllPosts();

      expect(posts[0].title).toBe("no-title");
    });

    it("filters out non-MDX files", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue([
        "post.mdx",
        "README.md",
        "image.png",
        ".DS_Store",
      ] as any);
      mockReadFileSync.mockReturnValue(`---
title: Test
date: 2026-01-01
---
Content`);

      const posts = getAllPosts();

      expect(posts).toHaveLength(1);
      expect(posts[0].slug).toBe("post");
    });
  });

  describe("getAllTags", () => {
    it("returns empty array if no posts", () => {
      mockExistsSync.mockReturnValue(false);

      const tags = getAllTags();

      expect(tags).toEqual([]);
    });

    it("extracts unique tags from all posts", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["post1.mdx", "post2.mdx"] as any);

      mockReadFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes("post1.mdx")) {
          return `---
title: Post 1
date: 2026-01-01
tags: [tech, ai, coding]
---
Content`;
        }
        if (filePath.toString().includes("post2.mdx")) {
          return `---
title: Post 2
date: 2026-01-02
tags: [coding, design]
---
Content`;
        }
        return "";
      });

      const tags = getAllTags();

      expect(tags).toEqual(["ai", "coding", "design", "tech"]);
    });

    it("sorts tags alphabetically (case-insensitive)", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["post.mdx"] as any);
      mockReadFileSync.mockReturnValue(`---
title: Post
date: 2026-01-01
tags: [Zebra, apple, Banana]
---
Content`);

      const tags = getAllTags();

      expect(tags).toEqual(["apple", "Banana", "Zebra"]);
    });

    it("handles posts with no tags", () => {
      mockExistsSync.mockReturnValue(true);
      mockReaddirSync.mockReturnValue(["post1.mdx", "post2.mdx"] as any);

      mockReadFileSync.mockImplementation((filePath) => {
        if (filePath.toString().includes("post1.mdx")) {
          return `---
title: Post 1
date: 2026-01-01
tags: [tech]
---
Content`;
        }
        if (filePath.toString().includes("post2.mdx")) {
          return `---
title: Post 2
date: 2026-01-02
---
Content`;
        }
        return "";
      });

      const tags = getAllTags();

      expect(tags).toEqual(["tech"]);
    });
  });

  describe("getPostBySlug", () => {
    it("returns undefined if post file does not exist", () => {
      mockExistsSync.mockReturnValue(false);

      const post = getPostBySlug("non-existent");

      expect(post).toBeUndefined();
    });

    it("returns post data for valid slug", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(`---
title: Test Post
date: 2026-01-15
author: Charlie
readingTime: 10 min
description: A test post
tags: [test, demo]
---
# This is the content`);

      const post = getPostBySlug("test-post");

      expect(post).toEqual({
        slug: "test-post",
        title: "Test Post",
        date: "2026-01-15",
        author: "Charlie",
        readingTime: "10 min",
        description: "A test post",
        tags: ["test", "demo"],
        content: "# This is the content",
      });
    });

    it("uses default values for missing frontmatter", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(`---
title: Minimal
---
Content here`);

      const post = getPostBySlug("minimal");

      expect(post?.slug).toBe("minimal");
      expect(post?.title).toBe("Minimal");
      expect(post?.date).toBe("1970-01-01");
      expect(post?.author).toBe("");
      expect(post?.readingTime).toBe("");
      expect(post?.description).toBe("");
      expect(post?.tags).toEqual([]);
      expect(post?.content).toBe("Content here");
    });

    it("protects against path traversal with forward slashes", () => {
      const post = getPostBySlug("../../../etc/passwd");

      expect(post).toBeUndefined();
    });

    it("protects against path traversal with backslashes", () => {
      const post = getPostBySlug("..\\..\\..\\windows\\system32");

      expect(post).toBeUndefined();
    });

    it("protects against relative path components", () => {
      const post = getPostBySlug("normal..post");

      expect(post).toBeUndefined();
    });

    it("allows normal slugs with hyphens and alphanumeric", () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(`---
title: Valid Post
---
Content`);

      const post = getPostBySlug("my-valid-post-123");

      expect(post).toBeDefined();
      expect(post?.slug).toBe("my-valid-post-123");
    });
  });
});
