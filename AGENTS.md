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
