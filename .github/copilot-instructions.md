# Project Guidelines

## Overview
- `build-add-in` is a multi-page Microsoft Office Add-in for authoring and running TypeScript/HTML/CSS snips.
- Keep agent changes minimal, focused, and aligned with existing patterns.

## Hard Constraints
- Edit manifests only in template files: `manifests/template.xml`, `manifests/template.outlook.xml`, `manifests/template.manifest.jsonc`.
- Do not manually edit generated manifests; use `npm run manifest` and `npm run make-manifest-shared`.
- Avoid new dependencies unless clearly necessary.

## Code Style
- Follow `config/eslint.mjs`: `eqeqeq`, double quotes, semicolons, no `debugger`, no unused vars.
- Follow strict naming: variables/functions `strictCamelCase`; types/interfaces `StrictPascalCase`; enum members `PascalCase`; no `I` prefix for interfaces.
- Follow `config/prettier.json`: 4-space indent, 120 width, LF, ES5 trailing commas.
- Keep TypeScript strict-compatible (`tsconfig.json` has `strict: true`).

## Build and Test
- Runtime: Node >= 20, npm >= 10.
- Install: `npm install`
- Build: `npm run build` and `npm run compile`
- Dev server: `npm run start`
- Quality: `npm run lint`, `npm run lint-fix`, `npm run style`, `npm run style-check`, `npm run spell-check`
- E2E tests (Playwright): `npm run playwright-install` (first time), then `npm run test`

## Architecture (Quick Map)
- Webpack entries are defined in `config/webpack.config.js` (`edit`, `run`, `help`, `actions`, `settings`, `blocks`, `test`, `shared`).
- Core model is `Snip` in `src/core/Snip.ts`, persisted via `src/core/database.ts` and `src/core/storage.ts`.
- Runtime flow: `src/edit.tsx` -> `src/core/compileCode.ts` -> `src/core/parseLibraries.ts` -> `src/run.ts`.
- Source adapters live under `src/core/source/` (local DB, GitHub Gists, Office XML embed).

## Integration Points
- UI stack: React 18 + Fluent UI + Monaco.
- Gist import/export and source handling: `src/core/source/`.
- Signature verification: `src/core/pgp/` (OpenPGP).

## Security
- This add-in intentionally executes user snip code; treat imported/shared snips as untrusted.
- Follow `docs/principles.md`: minimal dependencies, no telemetry, no backend servers.
- Do not add external fetch/data paths that bypass existing trust assumptions.

## Deep References
- Detailed architecture: `docs/architecture.md`
- Threat model: `docs/threat-model.md`
- Engineering principles: `docs/principles.md`
- Localization workflow: `docs/localize.md`