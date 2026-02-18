---
name: localize
description: Orchestrate full localization by running localize-search, localize-update, and localize-strings in sequence.
---

# Localize Orchestrator Skill

Use this skill when the user asks for end-to-end localization of newly added or changed UI strings.

## Purpose

Run the localization pipeline in a fixed order so missed strings are found, wrapped, translated, and embedded.

## Required Order

1. `localize-search`
   - Find potentially unlocalized user-facing strings.
   - Produce a candidate list with file path, line reference, detected string, and review status.
   - If no candidates remain after filtering, stop and report a no-op result.
2. `localize-update`
   - Apply `loc("...")` updates for the selected candidate strings.
   - Keep this step source-edit only (no translation or embedding).
3. `localize-strings`
   - Run extraction + translation workflow to update `localize/strings.tsv`.
   - Embed localized resources and validate generated outputs.

## Execution Rules

- Do not skip steps unless the user explicitly asks.
- Preserve `localize-search` exclusions and review behavior (including brand/product-name review before exclusion).
- Keep edits minimal and scoped to localization.
- Use existing project scripts and avoid new dependencies.
- Avoid duplicate command execution across steps.

## Reporting Requirements

Return a concise combined report with:
- Search findings summary (including excluded/reviewed cases).
- Files changed by update step.
- Translation/localization artifacts changed by strings step.
- Commands run and any failures/follow-ups.

## Skill References

- Search: `.github/skills/localize-search/SKILL.md`
- Update: `.github/skills/localize-update/SKILL.md`
- Strings: `.github/skills/localize-strings/SKILL.md`
