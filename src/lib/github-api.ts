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
 * Returns true if GITHUB_TOKEN environment variable is set.
 */
export function isGitHubApiConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
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
      throw new Error("Failed to retrieve file from GitHub");
    }

    const data = await response.json();

    if (data.type !== "file" || !data.content || !data.sha) {
      console.error(`GitHub API error: ${path} is not a valid file`);
      throw new Error("Invalid file response from GitHub");
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { content, sha: data.sha };
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    throw new Error("Failed to retrieve file from GitHub");
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
      throw new Error(`GitHub API PUT returned ${response.status}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("GitHub API")) throw error;
    console.error(`Error creating file ${path}:`, error);
    throw new Error("Failed to create file on GitHub");
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
      throw new Error("Failed to delete file on GitHub");
    }
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
    throw new Error("Failed to delete file on GitHub");
  }
}
