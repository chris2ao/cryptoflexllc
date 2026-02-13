/**
 * Unit tests for the AI-generated newsletter intro module.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockCreate = vi.fn();

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate };
  },
}));

describe("generateDigestIntro", () => {
  const testPosts = [
    {
      title: "Building Secure APIs",
      description: "A deep dive into API security best practices",
      tags: ["security", "api"],
    },
    {
      title: "AI-Assisted Development",
      description: "How Claude Code changed my workflow",
      tags: ["ai", "tooling"],
    },
  ];
  const testDate = new Date("2026-02-16");

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
  });

  it("should return AI-generated two-paragraph intro on success", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: "This week marks the anniversary of the first email.\n\nI&rsquo;m excited to share two posts with you.",
        },
      ],
    });

    const { generateDigestIntro } = await import("./newsletter-intro");
    const result = await generateDigestIntro(testPosts, testDate);

    expect(result.fromAi).toBe(true);
    expect(result.greeting).toBe(
      "This week marks the anniversary of the first email."
    );
    expect(result.contentIntro).toBe(
      "I&rsquo;m excited to share two posts with you."
    );
  });

  it("should return static fallback when ANTHROPIC_API_KEY is missing", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    const { generateDigestIntro } = await import("./newsletter-intro");
    const result = await generateDigestIntro(testPosts, testDate);

    expect(result.fromAi).toBe(false);
    expect(result.greeting).toContain("Thanks for being a subscriber");
    expect(result.contentIntro).toContain("what I learned");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("should return static fallback when API call throws", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API timeout"));

    const { generateDigestIntro } = await import("./newsletter-intro");
    const result = await generateDigestIntro(testPosts, testDate);

    expect(result.fromAi).toBe(false);
    expect(result.greeting).toContain("Thanks for being a subscriber");
  });

  it("should handle single-paragraph response gracefully", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: "Just one paragraph here, no blank line separator.",
        },
      ],
    });

    const { generateDigestIntro } = await import("./newsletter-intro");
    const result = await generateDigestIntro(testPosts, testDate);

    expect(result.fromAi).toBe(true);
    expect(result.greeting).toBe(
      "Just one paragraph here, no blank line separator."
    );
    // Falls back to static content intro since no second paragraph
    expect(result.contentIntro).toContain("what I learned");
  });

  it("should return fallback for empty AI response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "" }],
    });

    const { generateDigestIntro } = await import("./newsletter-intro");
    const result = await generateDigestIntro(testPosts, testDate);

    expect(result.fromAi).toBe(false);
    expect(result.greeting).toContain("Thanks for being a subscriber");
  });

  it("should pass correct model and params to Anthropic", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Para 1.\n\nPara 2." }],
    });

    const { generateDigestIntro } = await import("./newsletter-intro");
    await generateDigestIntro(testPosts, testDate);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-haiku-4-5-latest",
        max_tokens: 400,
        system: expect.stringContaining("CryptoFlex LLC"),
        messages: [
          {
            role: "user",
            content: expect.stringContaining("Building Secure APIs"),
          },
        ],
      })
    );
  });

  it("should include post data in the prompt", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{ type: "text", text: "Para 1.\n\nPara 2." }],
    });

    const { generateDigestIntro } = await import("./newsletter-intro");
    await generateDigestIntro(testPosts, testDate);

    const callArgs = mockCreate.mock.calls[0][0];
    const userMessage = callArgs.messages[0].content;

    expect(userMessage).toContain("Building Secure APIs");
    expect(userMessage).toContain("AI-Assisted Development");
    expect(userMessage).toContain("security, api");
  });
});
