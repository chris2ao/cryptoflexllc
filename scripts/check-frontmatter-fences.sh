#!/usr/bin/env bash
#
# F-C1: reject any content .mdx whose opening frontmatter fence declares a
# language (e.g. `---js`). gray-matter routes a language-tagged fence through an
# eval-based engine, which is remote code execution given a public content repo.
# A bare `---` fence and a `----` horizontal rule are both allowed.
# See docs/security/security-review-2026-08-13.md (F-C1).
#
set -euo pipefail

content_dir="${1:-src/content}"
fail=0
checked=0

while IFS= read -r -d '' file; do
  checked=$((checked + 1))
  # First line only, with any trailing CR stripped (Windows-authored files).
  first_line="$(head -n 1 "$file" | tr -d '\r')"
  # A language fence is `---` immediately followed by a non-dash, non-space
  # character (matching gray-matter's delimiter logic). Bare `---` and `----`
  # do not match.
  if [[ "$first_line" =~ ^---[^-[:space:]] ]]; then
    echo "ERROR: $file"
    echo "  opening fence declares a language, not a bare '---': '$first_line'"
    fail=1
  fi
done < <(find "$content_dir" -type f -name '*.mdx' -print0)

if [[ "$fail" -ne 0 ]]; then
  echo ""
  echo "Frontmatter fences must be a plain '---' (security review F-C1)."
  exit 1
fi

echo "Frontmatter fence check passed: $checked .mdx file(s), all open with a bare '---'."
