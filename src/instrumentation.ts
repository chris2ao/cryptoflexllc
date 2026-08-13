/**
 * Next.js instrumentation hook. Runs once when a server instance boots.
 *
 * Validates required environment variables at startup (F-M6). The env.ts schema
 * previously never executed because nothing imported it, so a missing or weak
 * secret (for example a short ANALYTICS_SECRET) went unnoticed and the tidy
 * schema created false assurance.
 *
 * This runs in WARN-ONLY mode: a validation failure is logged loudly but does
 * NOT crash the process, because throwing on a weak secret would take production
 * down before the secret could be corrected. Once the deployed secrets are
 * confirmed to satisfy the schema, flip this to fail-fast by rethrowing.
 * See docs/security/security-review-2026-08-13.md.
 */
export async function register() {
  const { getEnv } = await import("./lib/env");
  try {
    getEnv();
    console.log("[env] Boot-time environment validation passed.");
  } catch (err) {
    console.error(
      "[env] Boot-time environment validation FAILED (warn-only). " +
        "Fix the flagged variables (F-M6); this will become fatal once secrets are confirmed.",
      err
    );
  }
}
