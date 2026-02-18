---
name: localize-update
description: Wrap unlocalized user-facing TSX strings with loc(), update localization artifacts, and validate output.
---

# Localize Update Skill

Use this skill when a user asks to convert existing hardcoded UI strings into localized strings.

## Purpose

Apply minimal, targeted localization updates in TSX files by wrapping user-facing literals in `loc("...")`, then regenerate localization outputs.

## Scope Rules

- Target only user-facing strings requested by the user.
- Prefer minimal edits; do not refactor unrelated logic.
- Preserve existing component behavior and structure.
- Skip scan exclusions from `localize-search`:
  - Files under `src/shared/**`
  - Lines marked with `localize-scan-ignore`
  - Strings inside `<code>...</code>` blocks
  - Language tab labels `TS`, `HTML`, `CSS`, `Libraries` in `src/components/PageEdit.tsx`

## Update Workflow

1. Identify target strings and file locations.
2. In each target TSX file:
   - Wrap hardcoded UI strings as `loc("...")`.
   - Add `loc` import when missing: `import { loc } from "../core/localize/loc";` (adjust relative path as needed).
3. Run extraction:
   - Windows: `cmd /c "npm run extract-loc"`
   - macOS: `zsh -lc "npm run extract-loc"`
4. Run embedding:
   - Windows: `cmd /c "npm run embed-loc"`
   - macOS: `zsh -lc "npm run embed-loc"`
5. Validate:
   - Confirm no obvious placeholder/format regressions.
   - Spot-check generated localization artifacts (`src/core/localize/strings.json`, language map, enums).
6. Report:
   - Commands run
   - Files changed
   - Any follow-up needed (for example, translation review)

## Notes

- English is fallback when translations are missing.
- Do not add new dependencies.
- Keep TSV/JSON formatting tool-driven via project scripts.
