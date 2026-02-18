---
name: localize-search
description: Scan TSX files for potentially unlocalized user-facing strings while excluding known false positives.
---

# Localize Search Skill

Use this skill to locate likely unlocalized user-facing strings in TSX files without making code changes.

## Scope Rules

- Scan TSX files under `src/`.
- Ignore all files under `src/shared/`.
- Ignore all files under `src/blocks/`.
- Ignore lines marked with `localize-scan-ignore` comments.
- Ignore strings inside `<code>...</code>` blocks.
- Ignore language tab labels `TS`, `HTML`, `CSS`, and `Libraries` in `src/components/PageEdit.tsx`.

## Commands Followed

1. Find JSX text nodes that may be user-facing:
   - query: `>\s*[A-Za-z][^<{]{0,120}<`
   - regex: `true`
   - includePattern: `src/**/*.tsx`

2. Find likely user-facing attributes with hardcoded text:
   - query: `\b(placeholder|label|title|header|tooltip|text|aria-label)\s*=\s*\{?"[A-Za-z][^"]{0,120}"\}?`
   - regex: `true`
   - includePattern: `src/**/*.tsx`

3. Find localized strings for comparison/reference:
   - query: `loc\("`
   - regex: `true`
   - includePattern: `src/**/*.tsx`

4. Post-filter results:
   - Drop any matches in `src/shared/**`.
   - Drop any matches in `src/blocks/**`.
   - Drop any matches on lines containing `localize-scan-ignore`.
   - Drop any matches where the detected literal is inside `<code>...</code>` blocks.
   - Drop `TS`, `HTML`, `CSS`, and `Libraries` tab labels in `src/components/PageEdit.tsx`.

## Output Format

Return a flat list grouped by file with:
- file path
- line reference
- literal string detected

Do not modify files in this workflow.
