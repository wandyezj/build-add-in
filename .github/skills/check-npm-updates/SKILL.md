---
name: check-npm-updates
description: Run the npm package update check script and summarize available updates.
---

# Update Packages Skill

Use this skill when the user asks to check for npm dependency updates.

## Purpose

Run the repository script that checks package updates and report what can be updated.

## Command

Run from repository root:

- macOS: `npm run check-npm-updates`
- Windows: `cmd /c "npm run check-npm-updates"`

## Execution Rules

- Do not modify `package.json` or lockfiles in this skill.
- Do not install, upgrade, or remove dependencies.
- Capture command outcome:
  - status (`pass`/`fail`)
  - exit code (if available)
  - concise summary of update candidates

## Reporting Format

Return:

1. **Command Run**
   - exact command and status
2. **Available Updates**
   - grouped list of dependencies with current and target versions when provided by output

## Notes

- Keep this skill read-only regarding dependency files.
- If the script fails due to missing dependencies, recommend running `npm install` first.
