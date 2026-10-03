# MELLOW.md

`mellow-proxy-panel` is the Mellow Studios fork of
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center):
the themed, pinned management panel of the studio's subscription proxy,
`Mellow-Studios/mellow-proxy`. It is one patch set carried on upstream release
tags. Nothing here is filed upstream.

- Upstream base: tag `v1.25.2`, commit `752e0ee`
- Install, proxy config and deploy: the MellowBox record, repository
  `Mellow-Studios/mellowbox`; MellowOps record `content/projects/mellowbox/`

## Branches

- `main` mirrors upstream. Never commit to it.
- `mellow`, the default branch, carries the patch set on the base tag.

## Patch admission

A change enters only when it stays small, carries a test where the code it
touches has tests, and has an entry below with its origin.

## Patch set

1. "Show emails" toggle in the quota toolbar. Origin: the studio's own
   addition, 2026-10-02, after Theo's panel, the source practitioner's setup.
   Off by default, kept in localStorage under `cli-proxy-show-emails`. While
   off, every credential name on the quota page (card, timeline lane, toast,
   reset confirmation) shows each email as its first character, `***`, and
   the domain. Files: `maskEmails` in `src/utils/quota/identity.ts`;
   `src/stores/useShowEmailsStore.ts`, its export in `src/stores/index.ts`,
   its key in `src/utils/constants.ts`; `quota_management.show_emails` in the
   four `src/i18n/locales/` files; `tests/quotaEmailMask.test.ts`; under
   `src/features/quota/`: `QuotaPage.tsx`, `QuotaPage.module.scss`,
   `components/QuotaCard.tsx`, `components/QuotaTimeline.tsx`,
   `hooks/useQuotaActions.ts`, `providers/claude/ClaudeResetGrants.tsx`.
2. Mellow theme. Pending; the design brief adds it.

Fork files, no behaviour: this file, the first line of `AGENTS.md`, and
`runs/` in `.gitignore` for scratch output.

## Build

`bun install --frozen-lockfile`, then `bun run build`. Output: one
self-contained `dist/index.html`, the only file in `dist/`. The home node
installs it as `static/management.html` beside the proxy config; the proxy
pins it with `management.disable-auto-update-panel: true`.

## Rebase onto a new upstream tag

Runs only in a MellowOps maintain run.

1. `git fetch --tags https://github.com/router-for-me/Cli-Proxy-API-Management-Center.git`
2. `git rebase --onto <new tag> <old tag> mellow`
3. On a conflict, stop and report the file and the patch. Never resolve it
   silently.
4. `bun run verify` (tests, lint, build), or `bun run test`, `bun run lint`
   and `bun run build` in turn.
5. Update the upstream base line in this file.
