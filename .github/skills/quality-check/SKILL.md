---
name: quality-check
description: Run repository quality checks (compile, lint, style, spell-check, tests, and related validation), then produce an error report with likely root causes and suggested fixes.
---

# Quality Check Skill

Use this skill when the user asks to run repository quality checks and summarize failures with actionable fixes.

## Purpose

Execute the repository quality gates in a predictable order and return a concise report of:
- what passed
- what failed
- likely root cause per failure
- suggested fix per failure

## Scope Rules

- Keep changes minimal and focused on quality-check-related issues.
- Do not add new dependencies unless the user explicitly asks.
- Do not fix unrelated failures outside the user request.
- Prefer project scripts from `package.json` over ad-hoc commands.

## Command Sequence

Run from repository root.

### Core quality checks

1. `npm run style-check`
2. `npm run spell-check`
3. `npm run lint`
4. `npm run compile`
5. `npm run test`

### Optional validations (run when requested or relevant)

- `npm run build` (aggregated check path)
- `npm run check-manifests` (if manifest changes are in scope)

## Execution Behavior

- Continue running remaining checks even if one check fails.
- Capture per-command:
  - status (`pass`/`fail`)
  - exit code (if available)
  - short error summary
  - key file paths/lines from diagnostics when present
- Use platform shell commands:
  - Windows: `cmd /c "<command>"`
  - macOS: `zsh -lc "<command>"`

## Reporting Format

Return a compact report with these sections:

1. **Checks Run**
   - ordered list of commands with pass/fail status
2. **Failures Found**
   - one bullet per distinct failure containing:
     - failing command
     - primary error message
     - likely root cause
     - suggested fix (specific and minimal)
3. **Suggested Next Step**
   - whether to re-run a single failing check or full suite

## Suggested Fix Heuristics

- Formatting errors: recommend `npm run style` then re-run `npm run style-check`.
- Lint errors: recommend targeted code fixes; use `npm run lint-fix` only when safe.
- Spelling errors: update source text or approved dictionary per repo conventions.
- Compile errors: report TypeScript/Webpack diagnostics with file + symbol focus.
- Test failures: distinguish test assertion failures vs. environment/setup issues.

## Deliverables

- Command-by-command quality check result summary.
- Failure report with suggested fixes.
- Clear rerun recommendation.
