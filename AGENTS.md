# AGENTS.md

`vue-modern-cropper` is a small publishable Vue 3 component library: a typed, ESM-only wrapper over
`cropperjs` v2 (peer dependency). One SFC (`lib/ModernCropper.vue`), plus a Vite/UnoCSS demo app in
`docs/` that is deployed to GitHub Pages.

## Docs

Where knowledge lives, and when to reach for each:

| tier | what it holds | when you use it |
| --- | --- | --- |
| `AGENTS.md` — this file | orientation and the rules that prevent defects | read every session; write when a rule is learned the hard way |
| `.agentDocs/` | depth: module rationale, traps with their causes, compatibility | read on demand, before touching that area; write when a rule needs its reasoning kept |
| `docs/` | how-to and reference for a person using this package | read when the task is user-facing; write in the same commit as the change |
| `README.md` | the first read, for a person | write alongside `docs/` |

- **One home per fact.** State the rule here, keep the reasoning in `.agentDocs/` and link it — never both.
- **A dead pointer is a bug.** If the target is gone, delete the pointer rather than leave it.
- Move depth behind a pointer once a section outgrows a screen or two; keep the rule inline.

## Commands

```sh
pnpm run dev                 # Vite dev server for the docs demo (root: docs/)
pnpm run build               # alias for build:lib
pnpm run build:lib           # vite build --mode lib + vue-tsc -> dist/ (what ships)
pnpm run build:docs          # vite build --mode docs -> dist-docs/ (the Pages artifact)
pnpm run prerelease          # = `build:lib`; the release workflow calls it
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
- ESLint (`@antfu/eslint-config`) owns lint and formatting; `docs/` is ignored, so demo code is unlinted.
- ESM only: `"type": "module"` with an `import`-only `exports` map; do not add a CJS build.
- Aliases `~/*` → `lib/*` and `@/*` → `docs/*`, in `vite.config.ts` and `tsconfig.json`.
- Comments explain non-obvious intent, not mechanics.

## How to work here

- **Check the callers before you change anything.** Grep who uses it and which tests name it. If the
  impact is unclear, say so — do not guess.
- **Never overwrite or delete a large section you have not understood.** Read it, or say what you could
  not determine and ask.
- **Do not invent requirements.** Build what was asked; surface what else you notice and let it be
  decided.
- **Fix the class, not the instance.** A copied helper, a rule stated twice, a guard bypassed by a
  second path is one problem: one implementation, one guard. That is the work, not a follow-up to ask
  for. Stay inside the task rather than refactoring the world.
- **Verify before claiming, and say what you checked.** A passing test is not evidence it pins
  anything — **break the thing it guards and watch it fail.** If it still passes, either the test is
  decoration or a different guard is running; find out which. Where a stub cannot answer the question,
  drive the real thing.
- **Never write an identifier from memory.** A commit hash, path, line number or version must be quoted
  from the source; a plausible-looking invented one is worse than none.
- **A stated blocker is a hypothesis, not a fact.** Re-test "cannot install X" / "tool unavailable"
  before inheriting it, and never report a failure your own flag forced.
- **Report the risk with the change** — correctness, security, operational and integration; plus what
  you could not verify and every assumption you made. An unverified claim marked as such beats a
  confident one that is wrong.
- **Missing recall of this repo?** Read this file, `.agentDocs/` and `git log` before acting, then ask
  1–3 focused questions rather than guessing at intent.

## Conciseness

**Prune verbose, keep correctness** — code, comments, docs alike.

- Code: a comment only for non-obvious *intent*, never to restate the line, and never long. A block
  arguing for its own change is a commit message.
- Docs: one idea per sentence. Cut anything that would not change what a reader does.
- Delete history `git log` already holds — keep the *rule* that came out of it, not the story.
- **Never drop a caveat to save a line.** Concise means no filler, not fewer facts.

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
