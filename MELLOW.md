# MELLOW.md

`mellow-proxy-panel` is the Mellow Studios fork of
[Cli-Proxy-API-Management-Center](https://github.com/router-for-me/Cli-Proxy-API-Management-Center):
the themed, pinned management panel of the studio's subscription proxy,
`Mellow-Studios/mellow-proxy`. It is one patch set carried on upstream release
tags. Nothing here is filed upstream.

- Version: `1.25.6-mellow.1`
- Upstream base: tag `v1.25.6`, commit `5aa1ad6`
- Last sync: 2026-10-08
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
2. Mellow theme. Origin: the studio, 2026-10-02, on the Charcoal Ledger
   palette of MellowOps root `DESIGN.md` (exact values in MellowOps
   `src/renderer/styles.css`). A fourth theme, `mellow`, in the picker; it
   resolves to `dark` for every `resolvedTheme` consumer, so provider badges,
   logos and the code editor take their dark variants. Files: the
   `[data-theme='mellow']` block in `src/styles/themes.scss` (every token the
   dark block sets, glass tokens opaque with no blur, focus ring, selection,
   and opaque header pill and popovers); `'mellow'` in the `Theme` union in
   `src/types/common.ts`; `AppliedTheme`, `normalizeResolvedTheme` and
   `applyTheme` in `src/stores/useThemeStore.ts`; the `THEME_CARDS` entry and
   the header icon ternary in `src/components/layout/MainLayout.tsx`;
   `theme.mellow` in the four `src/i18n/locales/` files; in
   `src/styles/components.scss`, a `[data-theme='mellow']` block that inverts
   `.btn-primary` and tints `.btn-danger`, and token reads in place of
   `$primary-color` in `.input:focus` and of the `$success-color`,
   `$warning-color` and `$error-color` values in `.status-badge`, which keep
   the upstream themes' values. Dark-only rules reach Mellow by selector
   extension, never by copy: every `[data-theme='dark']` selector outside
   `themes.scss` gains a `[data-theme='mellow']` sibling in the same rule
   (`QuotaBody.module.scss`, `AuthFileQuota.module.scss`,
   `ProviderResourcePanel.module.scss`, `ProviderCategoryList.module.scss`,
   `OAuthPage.module.scss`). The one exception is the `[data-theme='dark']`
   `.btn` colour block in `components.scss`, which forces `#fff` and is not
   extended. On a rebase conflict in one of those selectors, keep upstream's
   rule and re-add the `mellow` sibling; a new upstream dark-only rule needs
   the same sibling. Derived values: green is the one action signal, so
   `--info-color` is the secondary text colour; where a Ledger pairing fails
   WCAG AA at the panel's sizes, `--failure-badge-text` mixes 20% `#fbf7f0`
   into danger, `--bg-error-light` is a 7% danger tint, and
   `--text-quaternary` equals `--text-tertiary`, the Ledger's faint text.

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
5. Build with `VERSION=<upstream>-mellow.N bun run build`; update the version, upstream base and last sync lines in this file.
