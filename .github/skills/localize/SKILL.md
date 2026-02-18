---
name: localize
description: Run the build-add-in localization workflow when UI strings are added or changed, including extracting strings, generating translation prompts, updating TSV language files, embedding localized output, and validating results.
---

# Localization Workflow Skill

Use this skill when the user asks to localize new or changed UI strings in this repository.

## Purpose

Apply the documented localization process in `docs/localize.md` and related `localize/` files.

## Repository Rules

- Only localize UI strings.
- Ensure UI strings are wrapped in `loc("...")` before running localization tooling.
- If a language translation is missing, English is the fallback.
- Keep changes minimal and aligned with the existing project style.

## Required Workflow

1. Inspect changed UI files and verify new user-facing strings are wrapped with `loc("...")`.
2. Run string extraction:
   - `npm run extract-loc`
3. Perform translation directly:
   - Use `localize/translate-prompt.txt` as the translation prompt.
   - Generate translated TSV output.
   - Apply results to `localize/strings.tsv`.
4. Embed localized language resources:
   - `npm run embed-loc`
5. Validate output quality:
   - Spot-check changed strings in `src/core/localize/strings.json` and generated artifacts.
   - Confirm no obvious formatting or placeholder regressions.
6. Report exactly what changed and any errors or issues encountered.

## Operating Behavior

- Execute translation directly as part of the workflow; only ask the user for input if translation fails or output is ambiguous.
- Automatically run localization commands using the platform shell:
   - Windows: run in `cmd` (`cmd /c "npm run extract-loc"` and `cmd /c "npm run embed-loc"`).
   - macOS: run in `zsh` (`zsh -lc "npm run extract-loc"` and `zsh -lc "npm run embed-loc"`).
- Preserve TSV formatting exactly (tabs, column order, escaping).
- Do not introduce new dependencies.
- Prefer targeted edits; avoid unrelated refactors.

## Expected Deliverables

- Updated localization source files (typically `localize/strings.tsv`, plus embedded outputs).
- Short summary including:
   - Commands run.
   - Files changed.
   - Any manual follow-up required.

## Quick References

- Process guide: `docs/localize.md`
- Prompt template: `localize/translate-prompt.txt`
- Localization table: `localize/strings.tsv`
- Embed command source flow: `npm run embed-loc`