# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **build-add-in**, a Microsoft Office Add-in (taskpane) that lets users write, edit, and run TypeScript/HTML/CSS code snippets ("snips") inside Word, Excel, PowerPoint, and Outlook. It integrates with GitHub Gists for sharing and supports GPG-signed snippets. Compiles to static files hosted via GitHub Pages.

Requires Node >= 20.0, npm >= 10.0.

## Common Commands

| Command | Purpose |
| --------- | --------- |
| `npm run build` | Full pipeline: clean, style-check, spell-check, lint, compile |
| `npm run compile` | Webpack production build (outputs to `dist/`) |
| `npm run start` | Dev server with HTTPS on port 3000 |
| `npm run lint` | ESLint check |
| `npm run lint-fix` | ESLint auto-fix |
| `npm run style` | Format with Prettier |
| `npm run style-check` | Check formatting |
| `npm run spell-check` | cspell spell check |
| `npm run test` | Compile then run Playwright E2E tests (Chromium) |


### Manifest Editing

Only edit the following template manifest files directly:

- `manifests/template.xml` (Word/Excel/PowerPoint)
- `manifests/template.outlook.xml` (Outlook).
- `manifests/template.manifest.jsonc` (Shared manifest for all apps)

Other XML manifest files are generated via `npm run manifest`.

Other JSON manifest files are generated via `npm run make-manifest-shared`


### First-Time Test Setup

```bash
npm run playwright-install   # Install Chromium browser (required once)
```

## Architecture

### Multi-Page Webpack App

Each page is a separate webpack entry point (`config/webpack.config.js`) with its own HTML template. Pages communicate via localStorage and URL hash parameters.

- **edit** (`src/edit.tsx`) — Main editor UI with Monaco, file tabs for TS/HTML/CSS/Libraries
- **run** (`src/run.ts`) — Executes compiled snippets, loads external libraries, handles embedded/signed snippets
- **settings** (`src/settings.tsx`) — Settings UI generated from metadata-driven setting definitions
- **blocks** (`src/blocks.tsx`) — Parameterized code template generator
- **actions** (`src/actions.ts`) — Keyboard shortcuts handler (shared runtime default)
- **help** (`src/help.tsx`) — Help/documentation page
- **shared** (`src/shared.tsx`) — Shared snippet viewer
- **test** (`src/test.ts`) — Testing page

### Core Data Model

The central data type is `Snip` (`src/core/Snip.ts`): an object with `id`, `name`, `modified` timestamp, optional `author` (GPG-verified), and `files` map (typescript, html, css, libraries). Snips are stored in IndexedDB (`src/core/database.ts`) with the current active snip reference in localStorage (`src/core/storage.ts`).

### Source System

`src/core/source/` contains handlers for loading snippets from different origins: local IndexedDB, GitHub Gists, and Office document XML (embed). The embed system stores snippets inside Office document custom XML parts. `GenericItemSource` provides the common abstraction.

### Compilation Pipeline

1. User edits TypeScript in Monaco editor (`src/components/Editor.tsx`)
2. `src/core/compileCode.ts` transpiles TypeScript to JavaScript at runtime using the `typescript` package (runtime dependency, not just build-time)
3. `src/core/parseLibraries.ts` loads external JS/CSS libraries
4. `src/run.ts` executes the compiled code with Office.js context

### Settings System

Settings (`src/core/setting.ts` + `src/core/settings/`) use a metadata-driven pattern: each setting has a type (boolean/string/enum), default value, and validation. The settings UI auto-generates from these definitions.

### Code Blocks

`src/blocks/` implements a template system with parameterized placeholders (`{{paramName}}`). Block parameters (string, number, boolean, enum) are defined alongside template code, and the UI generates input controls from parameter metadata.

### GPG Signatures

`src/core/pgp/` handles GPG signature verification using the `openpgp` library. Snip authors are verified against GitHub GPG keys via the `SnipAuthor` type.

### UI Layer

React 18 with Fluent UI (`@fluentui/react-components`) for Office-consistent theming. Monaco Editor for code editing (TypeScript, HTML, CSS languages enabled). Components live in `src/components/`.

### Localization

`src/core/localize/` provides i18n support. Strings are extracted via `npm run extract-loc` and embedded via `npm run embed-loc`.

## Code Style Rules

**ESLint** (`config/eslint.mjs`):

- Strict equality (`===`) required
- Double quotes, always semicolons
- `strictCamelCase` for variables/functions; `StrictPascalCase` for types/interfaces
- Interfaces must NOT have `I` prefix (e.g., use `Snip` not `ISnip`)
- Exported functions may use `StrictPascalCase` (React components)
- Enum members use `PascalCase`
- No leading/trailing underscores (except unused parameters)

**Prettier** (`config/prettier.json`):

- 120 char line width, 4-space indent, LF line endings, ES5 trailing commas

**TypeScript** (`tsconfig.json`):

- Strict mode, ESNext target/module, React JSX

## Project Principles

- Minimal dependencies to reduce attack surface
- No telemetry, no external data loading, no backend servers
- Cross-platform: runs in any Chromium-based browser
