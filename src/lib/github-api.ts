/**
 * GitHub REST API client for CryptoFlex LLC repository operations.
 *
 * Provides type-safe wrappers around GitHub's REST API for reading, creating,
 * and deleting files in the cryptoflexllc repository.
 *
 * Required environment variable:
 * - GITHUB_TOKEN: Personal access token with repo scope
 *
 * All operations target the main branch of chris2ao/cryptoflexllc.
 */

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "chris2ao";
const REPO_NAME = "cryptoflexllc";
const REPO_BRANCH = "main";

/**
 * Builds headers required for GitHub API requests.
 * Includes authentication token and API version.
 */
function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/**
 * Checks if the GitHub API is properly configured.
 *
 * Only asserts that a token is present, not that it still works. An expired
 * token passes this check and fails later with a 401, so callers should
 * surface the status from the failing request rather than assuming that a
 * configured token is a valid one.
 */
export function isGitHubApiConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
}

/** Error carrying the HTTP status of a failed GitHub API response. */
export class GitHubApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

/**
 * Maps a failed response to a message that names the actual problem.
 *
 * These messages reach the admin UI, so they should say what to do next.
 * A bare "Failed to retrieve file" makes an expired token, a missing file,
 * and a rate limit look identical, which sends you to the runtime logs to
 * find a status code the client already had.
 */
function describeFailure(method: string, status: number): string {
  switch (status) {
    case 401:
      return `GitHub rejected the credentials (401). GITHUB_TOKEN is set but not valid; it has most likely expired and needs rotating.`;
    case 403:
      return `GitHub refused the request (403). The token may lack Contents write permission on the repository, or the rate limit is exhausted.`;
    case 404:
      return `GitHub returned 404. The path does not exist on ${REPO_BRANCH}, or the token cannot see this repository.`;
    case 409:
      return `GitHub returned 409. The file changed underneath this request; reload and retry.`;
    case 422:
      return `GitHub returned 422. The file already exists, or the request was malformed.`;
    default:
      return `GitHub API ${method} returned ${status}.`;
  }
}

/**
 * Validates a repository path to prevent directory traversal.
 * Only allows paths under src/content/ for defense-in-depth.
 */
function validateRepoPath(repoPath: string): void {
  if (
    repoPath.includes("..") ||
    repoPath.includes("//") ||
    !repoPath.startsWith("src/content/")
  ) {
    throw new Error("Invalid repository path");
  }
}

/**
 * Retrieves file contents from the repository.
 *
 * @param path - Repository path (e.g., "src/content/blog/post.mdx")
 * @returns Object containing decoded file content and SHA hash
 * @throws Error if file not found or API request fails
 */
export async function getFileContents(
  path: string
): Promise<{ content: string; sha: string }> {
  validateRepoPath(path);
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${REPO_BRANCH}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error(
        `GitHub API error: GET ${path} returned ${response.status}`
      );
      throw new GitHubApiError(
        describeFailure("GET", response.status),
        response.status
      );
    }

    const data = await response.json();

    if (data.type !== "file" || !data.content || !data.sha) {
      console.error(`GitHub API error: ${path} is not a valid file`);
      throw new GitHubApiError(
        `GitHub returned a response for ${path} that is not a readable file. Files over 1 MB are not returned inline by the contents API.`
      );
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { content, sha: data.sha };
  } catch (error) {
    // Preserve the diagnosed failure; only wrap genuinely unexpected errors.
    if (error instanceof GitHubApiError) throw error;
    console.error(`Error fetching file ${path}:`, error);
    throw new GitHubApiError(
      `Could not reach the GitHub API to read ${path}.`
    );
  }
}

/**
 * Creates a new file in the repository.
 *
 * @param path - Repository path (e.g., "src/content/blog/post.mdx")
 * @param content - File content as UTF-8 string
 * @param message - Commit message
 * @throws Error if file already exists or API request fails
 */
export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<void> {
  validateRepoPath(path);
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
  const encodedContent = Buffer.from(content, "utf-8").toString("base64");

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        content: encodedContent,
        branch: REPO_BRANCH,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(
        `GitHub API error: PUT ${path} returned ${response.status}`,
        body
      );
      throw new GitHubApiError(
        describeFailure("PUT", response.status),
        response.status
      );
    }
  } catch (error) {
    if (error instanceof GitHubApiError) throw error;
    console.error(`Error creating file ${path}:`, error);
    throw new GitHubApiError(
      `Could not reach the GitHub API to create ${path}.`
    );
  }
}

/**
 * Deletes a file from the repository.
 *
 * @param path - Repository path (e.g., "src/content/blog/post.mdx")
 * @param sha - SHA hash of the file to delete (get from getFileContents)
 * @param message - Commit message
 * @throws Error if file not found or API request fails
 */
export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  validateRepoPath(path);
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        sha,
        branch: REPO_BRANCH,
      }),
    });

    if (!response.ok) {
      console.error(
        `GitHub API error: DELETE ${path} returned ${response.status}`
      );
      throw new GitHubApiError(
        describeFailure("DELETE", response.status),
        response.status
      );
    }
  } catch (error) {
    if (error instanceof GitHubApiError) throw error;
    console.error(`Error deleting file ${path}:`, error);
    throw new GitHubApiError(
      `Could not reach the GitHub API to delete ${path}.`
    );
  }
}
