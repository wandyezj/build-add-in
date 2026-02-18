---
name: localize-update
description: Wrap unlocalized user-facing TSX strings with loc() using minimal, targeted source edits.
---

# Localize Update Skill

Use this skill when a user asks to convert existing hardcoded UI strings into localized strings.

## Purpose

Apply minimal, targeted localization updates in TSX files by wrapping user-facing literals in `loc("...")`.

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
    - Include a quick scan for common missed patterns before editing:
       - Hardcoded tooltip/content props (for example `content="..."`, `tip="..."`).
       - Hardcoded section/drawer/header text nodes not wrapped in `loc("...")`.
       - JSX text literals between tags in `src/components/**`.
2. In each target TSX file:
   - Wrap hardcoded UI strings as `loc("...")`.
   - Add `loc` import when missing: `import { loc } from "../core/localize/loc";` (adjust relative path as needed).
3. Run extraction:
   - Windows: `cmd /c "npm run extract-loc"`
   - macOS: `zsh -lc "npm run extract-loc"`
4. Validate:
   - Confirm no obvious placeholder/format regressions.
   - Spot-check generated localization artifacts (`localize/extract-loc.tsv`, language map, enums) to make sure newly wrapped strings are included.
   - Ensure no new errors or warnings in the console.
5. Report:
   - Commands run
   - Files changed
   - Any follow-up needed (typically run `localize-strings` next)

## Notes

- English is fallback when translations are missing.
- Brand/product names are not auto-ignored; verify each new case before exclusion.
- This skill does not run translation/embed; use `localize-strings` for localization artifacts.
- Do not add new dependencies.
- Keep TSV/JSON formatting tool-driven via project scripts.
