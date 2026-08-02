import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getFileContents, createFile, GitHubApiError } from "./github-api";

const PATH = "src/content/backlog/example.mdx";

function mockResponse(status: number, body: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as Response;
}

describe("github-api error reporting", () => {
  beforeEach(() => {
    vi.stubEnv("GITHUB_TOKEN", "test-token");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // Regression: every failure used to collapse into "Failed to retrieve file
  // from GitHub", so an expired token looked identical to a missing file. The
  // status was only visible in the Vercel runtime logs.
  it("names an expired token on 401 and keeps the status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse(401)));

    await expect(getFileContents(PATH)).rejects.toThrow(/401/);
    await expect(getFileContents(PATH)).rejects.toThrow(/expired/i);

    const error = await getFileContents(PATH).catch((e) => e);
    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error.status).toBe(401);
  });

  it("distinguishes 403, 404, and 422 from each other", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse(403)));
    await expect(getFileContents(PATH)).rejects.toThrow(/permission|rate limit/i);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse(404)));
    await expect(getFileContents(PATH)).rejects.toThrow(/does not exist/i);

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse(422)));
    await expect(createFile(PATH, "body", "msg")).rejects.toThrow(/already exists/i);
  });

  it("does not let the catch-all swallow a diagnosed failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse(401)));
    const error = await getFileContents(PATH).catch((e) => e);
    expect(error.message).not.toMatch(/Could not reach/);
  });

  it("reports a transport failure distinctly from an HTTP failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    const error = await getFileContents(PATH).catch((e) => e);
    expect(error).toBeInstanceOf(GitHubApiError);
    expect(error.message).toMatch(/Could not reach/);
    expect(error.status).toBeUndefined();
  });

  it("still returns decoded content on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        mockResponse(200, {
          type: "file",
          content: Buffer.from("hello", "utf-8").toString("base64"),
          sha: "abc123",
        })
      )
    );

    await expect(getFileContents(PATH)).resolves.toEqual({
      content: "hello",
      sha: "abc123",
    });
  });

  it("rejects paths outside src/content/", async () => {
    vi.stubGlobal("fetch", vi.fn());
    await expect(getFileContents("../../etc/passwd")).rejects.toThrow(
      /Invalid repository path/
    );
  });
});
