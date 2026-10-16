# Design system log

Every token or component change in NovaKit Lite: what changed, why (one line), and the file it lives in. Newest first. The decisions behind each change are in `docs/01-system-audit.md`.

## Changes

| Date | What changed | Why | File | Audit |
|---|---|---|---|---|
| 16 Oct 2026 | Added `Choice`: one component for checkbox and radio. A native input inside a label, controlled only (never pre-checked), 24px control in `accent-brand`, the whole row tappable at 44px or more, label in neutral-900, description and disabled reason in neutral-700 linked by `aria-describedby`, a `brand` focus-visible ring, extra props forwarded to the input. Radio groups are a caller's `<fieldset>` and `<legend>`, not a component | The collection permission has to be its own unticked control and the tiers a single choice with a readable blocked reason, and nothing in NovaKit renders a form control with a label | `src/novakit/Choice.jsx`, `src/novakit/index.js` | 2A, 6.7, 6.9 |
| 16 Oct 2026 | `npm run check` also fails on Tailwind's default colour names (`text-red-500`, `bg-neutral-400`, `border-current`, `theme("colors.red.500")`…). A family we define, like `neutral`, passes only for our own shades | Our colours sit under `extend`, so Tailwind's whole default palette still builds and the check didn't see it | `scripts/check-tokens.mjs` | 14A, I6, Q10 |
| 16 Oct 2026 | Root text colour reads `theme("colors.neutral.900")` instead of `#1a1a1a`. Its starter-debt allow-list entry is removed | It duplicated neutral-900 as a hard-coded value | `src/index.css`, `scripts/check-allowlist.json` | 14A, I3 |
| 16 Oct 2026 | Font stack moved to `fontFamily.sans` (same fonts, no new ones). Tailwind's base styles apply it | Type should come only from the config | `tailwind.config.js`, `src/index.css` | 14A, I4 |
| 16 Oct 2026 | `accent` renamed to `attention` (50, 100, 600). DEFAULT (#F59E0B) removed. 100 documented as not for text. README example updated | Gives amber one meaning (attention). Nothing used DEFAULT, and removing it makes a solid amber fill impossible | `tailwind.config.js`, `README.md` | 6A, Q4 |
| 16 Oct 2026 | Added `danger` #B42318 and `danger-50` #FEF3F2 | Red only on the event that failed, and nothing red existed | `tailwind.config.js` | 7A, Q5 |
| 16 Oct 2026 | `success` #1E9E5A → #15803D | White on success was 3.45:1, which fails AA | `tailwind.config.js` | 8A |
| 16 Oct 2026 | `neutral-500` #808080 → #6B6B6B | Every caption, subtitle and secondary label was 3.95:1 on white, which fails AA. One value fixes them all | `tailwind.config.js` | 8A, Q3 |

## Contrast, before and after

| Pair | Before | After |
|---|---|---|
| neutral-500 on white | 3.95 ✗ | 5.33 ✓ |
| neutral-500 on neutral-50 | 3.78 ✗ | 5.11 ✓ |
| neutral-500 on neutral-100 | 3.53 ✗ | 4.76 ✓ |
| neutral-500 on attention-50 | 3.70 ✗ | 5.00 ✓ |
| neutral-500 on neutral-300 (disabled button) | 2.80 | 3.78 (disabled, exempt) |
| White on success, success on white | 3.45 ✗ | 5.02 ✓ |
| danger on white / on danger-50 | — | 6.57 ✓ / 6.05 ✓ |
| neutral-900 / neutral-700 on danger-50 | — | 16.01 ✓ / 7.78 ✓ |
| attention-600 on attention-50 (unchanged values) | 4.71 ✓ | 4.71 ✓ |
| attention-600 on attention-100 (not for text) | 4.31 ✗ | 4.31 ✗ |
| White on accent DEFAULT, DEFAULT on white | 2.15 ✗ | Removed |

## Exceptions to `npm run check`

| Exception | Why | Where |
|---|---|---|
| Tailwind's `white`, `black` and `transparent` | They're absolutes, not palette choices: white surfaces and text on fills, black only as the base of the scrim, transparent for resets. A token would only rename them | `scripts/check-tokens.mjs` |
| Phone frame size and radius, page backdrop | Scaffolding around the prototype, not the product | `scripts/check-allowlist.json` |
| Card and ListRow hard-coded borders | Starter debt. Remove each entry when its border moves to a token | `scripts/check-allowlist.json` |
| `src/review/novakit-v0/` borders | Frozen starter copy for before/after. Never edited, never imported | `scripts/check-allowlist.json` |
