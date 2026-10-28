#!/usr/bin/env bash
# Vercel Ignored Build Step (vercel.json "ignoreCommand").
# Exit 0 skips the build, exit 1 builds.
#
# Every build is stored as a full deployment, and Hobby Deployment Storage is
# capped at 10 GB. Commits that only touch files the site never reads (notes,
# plans, the changelog, NotebookLM source assets, CI config) used to build
# and store a whole copy of the site anyway. When in doubt, this builds.
set -u

base="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$base" ] || ! git cat-file -e "${base}^{commit}" 2>/dev/null; then
  echo "No previous deployed commit to compare against; building."
  exit 1
fi

if ! changed="$(git diff --name-only "$base" HEAD)"; then
  echo "Could not diff against ${base}; building."
  exit 1
fi

if [ -z "$changed" ]; then
  echo "No file changes since ${base}; building."
  exit 1
fi

site_changes="$(printf '%s\n' "$changed" \
  | grep -Ev '^(docs/|Plans/|content-assets/|design_handoff_[^/]*/|\.github/|[^/]+\.md$)' || true)"

if [ -z "$site_changes" ]; then
  echo "Only non-site files changed since ${base}; skipping the build."
  exit 0
fi

echo "Site files changed since ${base}; building."
exit 1
