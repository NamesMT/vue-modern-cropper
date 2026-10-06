# AGENTS.md

`vue-modern-cropper` is a small publishable Vue 3 component library: a typed, ESM-only wrapper over
`cropperjs` v2 (peer dependency). One SFC (`lib/ModernCropper.vue`), plus a Vite/UnoCSS demo app in
`docs/` that is deployed to GitHub Pages.

## Commands

```sh
pnpm run dev                 # Vite dev server for the docs demo (root: docs/)
pnpm run build               # alias for build:lib
pnpm run build:lib           # vite build --mode lib + vue-tsc -> dist/ (what ships)
pnpm run build:docs          # vite build --mode docs -> dist-docs/ (the Pages artifact)
pnpm run preview             # preview the built docs site
pnpm run lint                # eslint (@antfu/eslint-config) — owns formatting; the only gate
pnpm run prepublishOnly      # build:lib (fires automatically before `npm publish`)
pnpm run release:check 1.9.0 # validate a version against package.json
pnpm run release:preview     # print the changelog the next release would get
```

## Structure

- `lib/index.ts` — entry (re-exports `ModernCropper` default + named); `lib/ModernCropper.vue` — the
  whole component.
- `docs/` — Vite demo app (`App.vue`, `components/`, `composables/`, `plugins/`).
- `scripts/check-release-version.mjs`, `scripts/release-notes.mjs` — release-workflow helpers.
- `vite.config.ts` — one config, two modes: `lib` (bundles to `dist/`, CSS inlined at runtime) and
  the docs build (to `dist-docs/`); `unocss.config.ts` drives UnoCSS.
- `tsconfig.json` type-checks `lib/` + `docs/`; `tsconfig.build.json` emits `lib/` declarations only.
- `.github/workflows/` — `docs.yml` (Pages deploy on push to `main`) and `release.yml` (manual).

## Conventions

- Conventional commits (`feat:`, `fix:`, `chore:`, …) — changelogen derives the changelog from them.
- ESLint via `@antfu/eslint-config` owns formatting: no Prettier, single quotes, 2-space indent.
  `docs/` is ignored, so demo code is unlinted.
- ESM only: `"type": "module"` with an `import`-only `exports` map; do not add a CJS build.
- Aliases `~/*` → `lib/*` and `@/*` → `docs/*`, in `vite.config.ts` and `tsconfig.json`.
- Comments explain non-obvious intent, not mechanics.

## Docs

Three tiers, so a reader loads only what the task needs:

1. **`AGENTS.md`** (this file) — orientation and the rules that prevent defects. Read every session.
2. **`.agentDocs/`** — depth that would bloat this file: module rationale, traps with their causes,
   compatibility rules. Read on demand.
3. **`README.md` / `docs/`** — for a person using the package, not for an agent.

**There is no `.agentDocs/` here yet and none is needed at this size.** Create one when a section
above outgrows a screen or two: move the *reasoning* out and keep the *rule* here with a pointer to
it — nobody reads a file they do not open. Each document opens with a one-line scope, and this file
links it.

## How to work here

- **Check who calls it before you change it; if impact is unclear, say so** rather than guessing.
- **Never overwrite or delete a large section you have not understood.**
- **Do not invent requirements; surface what looks needed.**
- **Report the risk, not only the change** — correctness, security, operational, integration.
- **Fix the root cause, not the instance** — fix the class: one implementation, one formatter, one
  guard; that is the work, not a follow-up to ask for.
- **Verify before claiming, and say which direction you checked** — no tests here, so a green lint
  proves nothing.
- **Missing recall of this project?** Read this file and `git log` first.

## Conciseness (applies everywhere)

Prune verbose, keep correctness — code, comments, docs alike: a comment only for non-obvious intent,
one idea per sentence, keep the rule rather than the history `git log` holds. Never drop a caveat to
save a line.

## User-facing docs

`README.md` and the `docs/` demo are the only places a person reads: concise first read, depth behind
`<details>` spoilers, visuals for skimmers. Docs ship with the change, in the same commit.

## Releasing

Version-first and manual: dispatch **Actions → Release → Run workflow** with `X.Y.Z`. `release.yml`
is the only publish path (a pushed tag publishes nothing). `dry-run` still runs changelogen
(`package.json` bump, `CHANGELOG.md`, release commit + `v<version>` tag) and stops only before
push, GitHub release and npm publish (OIDC; one-time trusted-publisher setup in the README).

## Gotchas

- No test suite — no Vitest, no `test` or `test:types` script. `pnpm run lint` is the only static
  gate; `vue-tsc` type-checks `lib/` inside `build:lib`, which `release.yml` runs as its Build step.
- `release.yml` runs Node 24; `docs.yml` runs Node 22.
- `.npmrc` sets `enable-pre-post-scripts=true`, so `npm publish` re-runs `prepublishOnly`: the lib is
  rebuilt during publishing, after the workflow's own Build step.
- changelogen runs with `--clean` and fails when `git status --porcelain` is non-empty; the generated
  `dist/`, `dist-docs/` and `docs/components.d.ts` are gitignored and do not count.
- `docs/index.html` requests `/favicon.svg`, but `public/favicon.svg` sits outside the `root: './docs'` Vite
  root, so the built site 404s the icon.
- `lib/ModernCropper.vue` imports `SetNonNullable` from `type-fest`, a dev-only dependency: the emitted
  `dist/*.d.ts` still references `type-fest`, which consumers cannot resolve.
