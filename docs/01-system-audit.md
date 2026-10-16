# System audit: NovaKit Lite against my scope

An audit of every token in `tailwind.config.js`, `src/index.css` and every file in `src/novakit/`, measured against the Scope section of `docs/00-my-read.md`. No code was changed.

**How to read the tables**

- **Proposal:** *keep* (fine as it is), *evolve* (change the existing thing), *new* (add something), *flag-don't-fix* (record it, leave it alone because my scope doesn't need it).
- **Source:** *FI* = matches my First impressions in `00-my-read.md`. *PF* = already in the System flags in `docs/progress.md`. *New* = not in either.
- **My decision:** *Accept (safe default)* = a low-risk row accepted as proposed. Every other entry is a decision I made on 16 Oct 2026.
- **Contrast:** the WCAG 2.x formula, computed from the hex values in the config. Text needs 4.5:1. Large text needs 3:1, and "large" means at least 24px regular or 18.66px bold (700). So `text-title` (20px, weight 600) is **not** large text and needs 4.5:1. Only `text-display` (28px, 700) is large. UI boundaries need 3:1 where the boundary is what identifies the control (WCAG 1.4.11). Disabled controls are exempt.
- **Not checked:** nothing was rendered in a browser for this audit. Native checkbox and radio colours depend on the browser.

---

## 0. What this audit confirms

| Question from my read | Answer | Evidence | My decision |
|---|---|---|---|
| Should Button change rather than loosen principle 1? | **Confirmed.** The one-line label "Accept Rs 10,000 · repay Rs 10,300 on 28 Jul" is about 44 characters at 20px semibold, roughly 480px. The space inside a full-width button in the frame is 318px (358px content width minus `px-5`). Two lines fit: "Accept Rs 10,000" in `text-title` is about 175px and "Repay Rs 10,300 on 28 Jul" in `text-caption` about 165px. Together with padding they need about 64px, but Button is fixed at 56px (`h-14`, `Button.jsx:21`). | `Button.jsx:17`, `Button.jsx:20-21` | Evolve Button: a second line (brand-100), a minimum height, a loading state, secondary text in neutral-900. The "no" option must be as clear as "yes" |
| Does the attention colour (accent-600 on accent-50) hold? | **Confirmed, with conditions.** accent-600 on accent-50 is **4.71:1**, which passes AA with a 0.21 margin. It fails on accent-100 (4.31) and on neutral-100 (4.49), and accent DEFAULT fails everywhere as text (2.15). Safe rule: attention surfaces are accent-50 only, body copy on them is neutral-900 (16.33), and accent-600 is used only for the short status label. | Section 4 | Rename accent to attention. Body text neutral-900 on attention-50, attention-600 only for the short status label. Remove DEFAULT. Keep 100, documented as not for text |

---

## 1. The UI each scope state needs

Personas: A = salary Rs 68,000 into NovaPay on the 28th, limit Rs 10,000, today 7 Jul, due 28 Jul. B = paid into a bank account, needs verification.

| # | State | What the screen needs | NovaKit it can use | Gap | My decision |
|---|---|---|---|---|---|
| S1 | Home card: eligible (A) | Own balance, an advance card that doesn't claim an offer exists, one entry button | Card, AmountText, Button | None, once copy changes | Accept (safe default) |
| S2 | Home card: needs verification (B) | The same card in a "verify first" state: what to verify, the steps, one button (stubbed or working) | Card, Button, ListRow (steps) | No numbered or step list. ListRow can carry steps if its icon slot takes a number | Accept (safe default) |
| S3 | Choose amount | Three tiers in ascending order, equal weight, nothing pre-selected. Each shows amount, fee in rupees, total and due date. Rs 15,000 is shown but blocked, with its reason in readable text | AmountText | **No radio or selectable option.** A disabled option's reason needs ≥4.5:1 text, so it can't be disabled grey | Its own screen, before terms + accept. Tiers use `Choice` (radio). The blocked tier stays visible, with its reason in neutral-700 |
| S4 | Terms + accept | Above the fold: you receive, fee (Rs), total to repay, due date and time. One line on lateness, with expandable details (placeholder default consequences). An unticked collection permission that states when it ends. A two-line accept button. A way out that doesn't look disabled | Card, ListRow (cost rows), AmountText, Button | **No checkbox. No disclosure. Button can't hold two lines. Secondary button looks disabled.** ListRow truncates. No fixed viewport, so "above the fold" can't be tested | Its own screen after choosing the amount, so the full cost is visible without scrolling (principle 1). `Choice` checkbox, a two-line Button, native `<details>`, the fixed frame |
| S5 | Processing | Button in a busy state that can't be tapped twice, label saying what's happening | Button | **No loading or busy state** | Button loading state |
| S6 | Network failure on accept | A failure message that stays on screen, says nothing was taken, and offers a retry | Card, Button | **No inline message and no error colour.** Toast is the only feedback component, and it is success-only and transient | An inline Card with `tone="danger"` and `role="alert"`, with a retry. Never a Toast |
| S7 | Reduced payout, fresh consent | New amounts compared with old, a fresh unticked permission, and accept or decline | As S4 | Same gaps as S4. BottomSheet isn't safe for consent (section 6) | A full screen with a fresh, unticked `Choice`. The payout drops to a lower tier, so the fee stays in whole rupees |
| S8 | Receipt | What was agreed (amounts, date, time, permission and when it ends), where the record lives, Done | Card, ListRow, AmountText, Button | ListRow truncation. Where the record lives is an open question | ListRow `wrap` for the summary rows. Where the record lives stays an open question |
| S9 | Home after accepting | Own balance first. The advance shown separately (owed, due date). Transactions showing money in and out without ambiguity | Card, AmountText, ListRow | **Direction of money is shown only by a glyph**, and AmountText has no sign. The advance's status needs a calm surface | AmountText's optional sign, plus words ("Received", "Collected"). Glyphs `aria-hidden` |
| S10 | Reminder before due date | A lock-screen preview (no amount, "loan" or "overdue") and the in-app reminder (amount, date, 6pm, "salary into NovaPay") | Card, AmountText | **No notification preview.** That's prototype scaffolding, not a NovaKit component (Q6) | Lock-screen preview as scaffolding outside NovaKit, on neutral-900, with its copy kept in one place |
| S11 | Not collected on payday | Red only on the event row ("We couldn't collect on 28 Jul"), the cause in plain words (4 variants), and a next step that works | Card, ListRow, Button | **No danger colour, and ListRow has no event tone** | Danger only on the failed-event row (ListRow `tone="danger"`) |
| S12 | Late | Status in the attention colour (soft background, dark text, no icons), days late counted from 28 Jul, next steps (report a payroll delay so reminders pause, pay part manually as a stub) | Card, Button, AmountText | **Card has no attention tone.** The amber has no defined meaning yet | Card `tone="attention"`: attention-50 surface, neutral-900 body, attention-600 status label |
| S13 | Notice before default | Attention surface, date of default, placeholder consequences labelled as placeholder, a next step | Card, Button | Same as S12 | As S12. Consequences are labelled as placeholder |
| R | Reviewer state switcher | Jump between S1–S13 outside the phone frame | — | **Scaffolding, not NovaKit.** It sits on the backdrop, so the allow-list or check may need to know about it (Q7) | Outside a fixed 390×844 frame. Needs an allow-list change, which I approve before it's made |

---

## 2. Components

### 2a. Existing components

| Component | Used by | Sufficient? | What's missing or wrong | Proposal | Source | My decision |
|---|---|---|---|---|---|---|
| **Button** | S1, S2, S4–S9, S11–S13 | No | (1) Fixed height `h-11`/`h-14` (`Button.jsx:20-21`), so no second line. (2) Secondary text is neutral-500 (`:28`), 3.95:1, and looks disabled. (3) Always `w-full` (`:17`). `className` can't reliably override it, because Tailwind resolves conflicts by CSS order, not class order. (4) No loading or busy state. (5) No designed focus style; it relies on the browser default. (6) Doesn't forward other props (`:32-36`), so no `aria-describedby`, `aria-busy`, `form`. (7) `font-semibold` is a Tailwind built-in, not a token (`:17`) | **Evolve:** optional `subLabel` on a second line (caption size, brand-100 on brand = 5.10:1), `min-h` instead of `h`, `loading` (disabled + `aria-busy` + label), secondary text → neutral-900 or neutral-700, a `focus-visible` ring from `brand`, forward `...rest`. Leave the width alone unless a screen needs it | FI (1, 2), PF (2, 3), New (4–7) | Evolve as proposed, with secondary text in neutral-900. The "no" option must be as clear as "yes" |
| **Card** | Every state | No | (1) Border `#E6E6E6` hard-coded (`Card.jsx:9`). (2) No tone, so there's no attention surface (S12, S13) and no failure surface (S6). (3) `bg-white` is a built-in. (4) Doesn't forward props, so no `role="alert"` or `aria-live` | **Evolve:** border → `neutral-200` (#ECECEC, nearest existing token), add `tone` = `default` \| `attention` \| `danger` (soft background + dark text, no icons), forward `...rest` | FI (1), New (2, 4) | Evolve as proposed |
| **Panel** | None | — | A duplicate of Card. Only the border differs: `neutral-300` (`Panel.jsx:9`) against Card's `#E6E6E6`. Unused in `src/` | **Flag-don't-fix**, then retire or alias it to Card when Card changes. Don't use it in the flow | FI | Alias Panel to Card |
| **ListRow** | S2, S4, S7, S8, S9, S11 | No | (1) Border `#DADADA` hard-coded (`ListRow.jsx:15`). (2) Title and subtitle `truncate` (`:25`, `:27`), which would cut cost labels or the due-date line. (3) Subtitle is neutral-500 (`:27`), 3.95:1. (4) The icon slot is a 36px grey circle (`:20`), with no number for steps and no `aria-hidden`. (5) No event tone, so there's nowhere for red on the failed collection row. (6) Divs, not list or description-list semantics | **Evolve:** border → `neutral-300` (#D9D9D9, one step off #DADADA), `wrap` prop (no truncate), `tone="danger"` for the event row only, icon slot `aria-hidden`. Subtitle contrast is fixed at the token (section 3) | PF (1), New (2–6) | Evolve as proposed |
| **AmountText** | S1, S3, S4, S7–S12 | No | (1) `amount ?? 0` (`AmountText.jsx:11`) renders **"Rs 0" when data is missing**, and "Rs NaN" for NaN. That breaks a CLAUDE.md rule. (2) Forces `text-neutral-900` (`:13`). Inside a primary Button that's **2.77:1** on brand and 1.75:1 when pressed. (3) No caption size. (4) No sign or direction. (5) Prints up to 3 decimals (249.995 → "249.995") | **Evolve:** missing amount → render nothing and warn in dev (the screen decides what to show), colour inherits by default, add `caption`, optional `sign`. Rounding belongs in the module (Q8) | PF (2, 3), New (1, 4, 5) | Evolve as proposed. When an amount is missing, the screen says "not available yet" |
| **AppBar** | All in-app states | Mostly | (1) Back target 36px (`AppBar.jsx:12`). That passes WCAG 2.5.8 (24px) but is under 44px. (2) The "‹" glyph isn't an icon. (3) Back has to be suppressible during processing (S5). It already is, since `onBack` is optional | **Keep**, with the back target raised to 44px (`h-11 w-11`) | New | Keep, with the back target raised to 44px |
| **BottomSheet** | Possibly the S4 details | No | (1) No `role="dialog"`, `aria-modal`, focus trap or Escape (`BottomSheet.jsx:8-17`). (2) Tapping the backdrop closes it (`:11`). (3) A grab handle (`:15`) suggests swipe, which isn't built: **a visible control that doesn't work.** (4) No max height or scrolling. (5) `bg-black/40` and `bg-white` are built-ins | **Flag-don't-fix.** Use native `<details>` for S4's details and a full screen for S7. Fix the sheet only if a state truly needs it | PF (1, 2), New (3, 4) | Flag-don't-fix. Unused: S4's details use native `<details>`, S7 is a full screen |
| **Toast** | None needed | — | (1) Success-only (`Toast.jsx:10`). (2) White on success is 3.45:1. (3) No `role="status"` or `aria-live`. (4) **Correction to progress.md:** Toast doesn't time itself. `App.jsx:25` closes it after 2.2s. (5) The starter uses the success style for a TODO message (`App.jsx:77`) | **Flag-don't-fix.** Don't use it for failure, consent or anything that has to be read. If it's used at all (e.g. "Reminders paused"), add `role="status"`. The success fix is at the token | FI (1), PF (2, 3), New (4, 5) | Accept (safe default). Never used for failure or consent |
| **TextField** | None (amount is by tier, part-payment is stubbed) | — | No label, error or helper (`TextField.jsx:14-29`). Border neutral-300 is 1.41:1, which fails 1.4.11 for an input. `focus:outline-none` (`:25`). Doesn't forward `id`/`name`/`aria-*` | **Flag-don't-fix** | PF, New (border, props) | Accept (safe default) |
| **index.js** | — | Yes | Barrel export | **Keep** | — | Accept (safe default) |

### 2b. What's missing

| Need | States | Can something existing do it? | Proposal | Source | My decision |
|---|---|---|---|---|---|
| Checkbox (collection permission) | S4, S7 | No. No component renders a form control with a label. TextField is a text input | **New: `Choice`**, one component for both checkbox and radio: a native `<input>` inside a `<label>`, `accent-brand` (Tailwind's `accent-color` utility, reads the existing token), a 24px control, label + description, `disabled` + a visible reason. The native unchecked border is about #767676, 4.54:1 | FI | New `Choice`, as a checkbox |
| Radio (tier choice) | S3 | No. ListRow is display-only. Bending it into a form control would add `as`, input slot, checked, disabled and name, at which point it's a different component | **The same `Choice`**, `type="radio"`. One new component rather than two | FI | The same `Choice`, `type="radio"` |
| Inline message (failure, attention status) | S6, S11–S13 | Yes, if Card gets a tone | **Evolve Card** (above). No new Alert or Banner | New | Card tone. No new component |
| Expandable details | S4 | Partly. BottomSheet is unsafe as it is (2a) | **No component.** Native `<details>/<summary>` in the screen, styled with tokens. Keyboard and screen-reader support come with it | New | Native `<details>` |
| Loading state | S5 | Yes, if Button evolves | **Evolve Button** (above). No spinner, no icon library | New | Button loading state |
| Cost summary rows | S4, S7, S8 | Yes, if ListRow gets `wrap` | **Evolve ListRow** (above) | New | ListRow `wrap` |
| Lock-screen notification preview | S10 | No | **Prototype scaffolding** outside NovaKit, using neutral-900 or brand-800 as the lock-screen background (white text 17.40 / 11.42). See Q6 | New | Scaffolding outside NovaKit, on neutral-900 |
| Fixed device viewport with a sticky action area | S4 (above the fold), S5–S7 | No. The frame grows with content (`App.jsx:31`, `min-h-[780px]`) | **Change the phone frame** to a fixed height with `main` scrolling inside it. Needs an allow-list change, which is yours (Q7) | New | Fixed 390×844 frame, `main` scrolls, sticky action area, neutral-50 screen background. Allow-list change approved by me first |

---

## 3. Tokens

### 3a. Colour

| Token | Value | Used in `src/` today | Scope use | Sufficient? | Issue | Proposal | Source | My decision |
|---|---|---|---|---|---|---|---|---|
| `brand` | #4F46E5 | Button primary | Accept, focus, selected | Yes | White on it 6.29. On white 6.29 | **Keep** | — | Accept (safe default) |
| `brand-pressed` | #3730A3 | Button active | Same | Yes | Named by state inside a numeric ramp (no 500/600/700) | **Keep.** Flag the name | New | Accept (safe default) |
| `brand-50/100/200/400/800` | — | None | brand-100 as the button sub-line (5.10 on brand). brand-800 for the lock screen | Yes | brand-200 on brand is 4.22, so it can't be the sub-line | **Keep** | New | Accept (safe default). brand-100 is the button's second line |
| `accent` (ramp) | — | None | Attention | Partly | Comment says "for highlights and expressive moments" (`tailwind.config.js:20`). No meaning, so anyone would use it for a late screen | **Evolve: rename to `attention`** and document the allowed pairs. Nothing in `src/` uses it, so renaming is free. The README example `text-accent-600` (`README.md:40`) goes stale | FI | Rename to `attention` |
| `accent-50` | #FFF7E6 | None | Attention surface | Yes | 1.07 against white, so the surface alone doesn't separate it from the page. The status label has to carry the meaning (1.4.1) | **Keep** (as `attention-50`) | New | Keep as `attention-50`, the only attention surface |
| `accent-100` | #FDECC8 | None | — | No | accent-600 on it is **4.31**, which fails | **Keep, not for text surfaces.** Document it | New | Keep as `attention-100`, documented as not for text |
| `accent` DEFAULT | #F59E0B | None | — | No | 2.15 as text on white, and white on it is 2.15. A solid amber badge would fail and break "no solid fills" | **Keep, never for text or fills.** Or remove it, since nothing uses it | New | Remove. Nothing uses it, and removing it makes a solid amber fill impossible |
| `accent-600` | #B45309 | None | Attention label | Yes, narrowly | 4.71 on accent-50, 5.02 on white, **4.49 on neutral-100 (fails)** | **Keep** (as `attention-600`) | PF | Keep as `attention-600`, for the status label only |
| `neutral-50` | #FAFAFA | None | Possible screen background | Yes | — | **Keep** | — | Accept (safe default). It becomes the screen background |
| `neutral-100` | #F2F2F2 | ListRow icon, AppBar border, disabled field | Same | Yes | — | **Keep** | — | Accept (safe default) |
| `neutral-200` | #ECECEC | None | Card border | Yes | — | **Keep. Reuse it for Card's border** | New | Reuse for Card's border |
| `neutral-300` | #D9D9D9 | Borders, disabled fill, sheet handle | Same, plus ListRow divider | Yes for decoration | 1.41 on white, so it can't be the only boundary of an input or checkbox | **Keep. Reuse it for ListRow's divider.** Never for control outlines | New | Reuse for ListRow's divider. Never for control outlines |
| `neutral-500` | #808080 | Captions, subtitles, secondary button text, placeholder, disabled text | All fine print on S4 | **No** | **3.95 on white**, 3.78 on neutral-50, 3.53 on neutral-100, 3.70 on accent-50. It's the colour of every caption, so the fine print on the accept screen would be the least readable text | **Evolve at the token:** #6B6B6B passes everywhere (5.33 / 5.11 / 4.76 / 5.00). Or move text to neutral-700 and keep 500 for borders (3.95 passes as a boundary). See Q3 | PF | Retune to #6B6B6B. Fix at the source: one value fixes every caption |
| `neutral-700` | #4D4D4D | Body, AppBar back, ListRow icon | Body, reasons | Yes | 8.45 on white | **Keep** | — | Accept (safe default) |
| `neutral-900` | #1A1A1A | Headings, amounts | Same, attention body | Yes | Duplicated as `#1a1a1a` in `index.css:7` | **Keep.** Point `:root` at it | PF | Keep. `:root` points at it, and its allow-list entry is removed |
| `success` | #1E9E5A | Toast | Possibly S8 | No | White on it is **3.45**, and as text on white 3.45. Single value, no ramp | **Evolve at the token:** #15803D gives 5.02 both ways. Not needed for my scope if the receipt uses neutral + brand | FI, PF | Retune to #15803D |
| *(missing)* danger | — | — | The failed event (S6, S11) | — | No red exists. Amber is reserved for attention, so failure can't borrow it. Tailwind's `red-*` is still live under `extend`, and the check doesn't catch it | **New: `danger` (text) + `danger-50` (soft background).** Candidate #B42318 on #FEF3F2 is 6.05, on white 6.57, neutral-900 on #FEF3F2 16.01 | FI | Add `danger` #B42318 and `danger-50` #FEF3F2 |
| Built-ins: `white`, `black/40` | — | 7× `bg-white`, 2× `text-white`, scrim | Everywhere | — | Not from the config, so the check doesn't see them | **Flag.** Already an open question in progress.md (Q10) | PF | The check fails on every Tailwind default colour name except `white`, `black` and `transparent`. Reason for the exception: they're absolutes, not palette choices (white surfaces and text on fills, black only as the base of the scrim, transparent for resets), so a token would only rename them. Goes into DESIGN_SYSTEM.md when the check is updated |

### 3b. Type, radius, shadow

| Token | Value | Used | Sufficient? | Issue | Proposal | Source | My decision |
|---|---|---|---|---|---|---|---|
| `text-display` | 28/34, 700 | Balance | Yes | The only true "large text" | **Keep** | — | Accept (safe default) |
| `text-title` | 20/26, 600 | AppBar, headings, Button lg | Yes | 600 isn't bold for WCAG, so title text needs 4.5:1 | **Keep** | New | Accept (safe default) |
| `text-body` | 15/22, 400 | Body, Button md | Yes | Button adds `font-semibold`, overriding the token's weight | **Keep** | New | Accept (safe default) |
| `text-caption` | 13/18, 400 | Captions | Yes, once the colour is fixed | Paired with neutral-500 everywhere | **Keep** | — | Accept (safe default) |
| *(missing)* font family | — | `index.css:6` | No | The stack lives in CSS, not the config, so type isn't fully from `tailwind.config.js` | **Evolve:** move the same stack to `theme.extend.fontFamily.sans`. Not a new font | New | Move the stack to `fontFamily.sans` |
| *(missing)* font weight | — | `font-semibold` (Button) | — | Built-in, not a token. Does "type comes only from the config" cover weight? | **Q9** | New | Built-in font weights allowed |
| *(missing)* numerals | — | — | — | Amounts in a cost summary should line up. `tabular-nums` is a built-in utility | **Q9** | New | `tabular-nums` allowed |
| `rounded-sm/md/lg` | 8 / 12 / 20 | md, lg | Yes | `sm` unused. `rounded-full` is a built-in (3 uses). At 24px, Choice's control can't take 8px without looking round | **Keep.** Native control radius is the browser's | New | Accept (safe default) |
| `shadow-card` | — | Card, Panel, Toast | Yes | `shadow-xl` (built-in) on the frame | **Keep** | PF | Accept (safe default) |

### 3c. Proposed additions, and why nothing existing does the job

| Addition | Why nothing existing works | My decision |
|---|---|---|
| `Choice` component (checkbox + radio) | NovaKit has no form control except a text input. The permission has to be its own unticked control, and the tiers a single-choice group with a disabled option. Making ListRow or TextField do it would turn them into a different component under an old name | Approved |
| `danger` + `danger-50` tokens | The only colours are indigo, amber, greys and one green. Indigo means action, amber is becoming attention, and failure needs to differ from both so "red only on the event" can be followed. Without a token, someone will grab Tailwind's `red-500` and the check won't catch it | Approved |
| *Not* an addition: `attention` | A rename of the existing `accent` ramp, not a new colour | Approved, with DEFAULT removed |
| *Not* an addition: font-family token | Moves the existing stack from CSS into the config | Approved |

---

## 4. Contrast

### 4a. Text, on the surfaces it actually sits on

| Foreground | Background | Where | Ratio | Needed | Result |
|---|---|---|---|---|---|
| neutral-900 | white | AppBar title `AppBar.jsx:17`, ListRow title `ListRow.jsx:25`, AmountText `AmountText.jsx:13`, TextField `TextField.jsx:23` | 17.40 | 4.5 | Pass |
| neutral-900 | accent-50 | Attention body (proposed) | 16.33 | 4.5 | Pass |
| neutral-700 | white | Body `App.jsx:45`, back `AppBar.jsx:12` | 8.45 | 4.5 | Pass |
| neutral-700 | neutral-100 | ListRow icon glyph `ListRow.jsx:20` | 7.55 | 4.5 | Pass |
| neutral-700 | accent-50 | Attention secondary text (proposed) | 7.93 | 4.5 | Pass |
| **neutral-500** | **white** | Caption `App.jsx:36`, subtitle `ListRow.jsx:27`, secondary button `Button.jsx:28`, placeholder `TextField.jsx:24` | **3.95** | 4.5 | **Fail** |
| **neutral-500** | **neutral-50** | Captions on a grey screen background | **3.78** | 4.5 | **Fail** |
| **neutral-500** | **accent-50** | A caption inside an attention card | **3.70** | 4.5 | **Fail** |
| neutral-500 | neutral-100 | Disabled field `TextField.jsx:26` | 3.53 | — | Exempt (disabled) |
| neutral-500 | neutral-300 | Disabled primary `Button.jsx:26` | 2.80 | — | Exempt, but see 6.8 |
| neutral-300 | white | Disabled secondary `Button.jsx:28` | 1.41 | — | Exempt |
| white | brand | Primary button `Button.jsx:26` | 6.29 | 4.5 | Pass |
| white | brand-pressed | Pressed primary | 9.93 | 4.5 | Pass |
| brand-100 | brand | Button sub-line (proposed) | 5.10 | 4.5 | Pass |
| **brand-200** | **brand** | Button sub-line, if chosen | **4.22** | 4.5 | **Fail** |
| **neutral-900** | **brand** | AmountText inside a primary Button | **2.77** | 4.5 | **Fail** |
| **neutral-900** | **brand-pressed** | Same, pressed | **1.75** | 4.5 | **Fail** |
| **white** | **success** | Toast `Toast.jsx:10` | **3.45** | 4.5 | **Fail** |
| **success** | **white** | Success as text | **3.45** | 4.5 | **Fail** |
| accent-600 | accent-50 | Attention label (proposed) | 4.71 | 4.5 | Pass (0.21 margin) |
| accent-600 | white | Attention label on white | 5.02 | 4.5 | Pass |
| **accent-600** | **accent-100** | — | **4.31** | 4.5 | **Fail** |
| **accent-600** | **neutral-100** | — | **4.49** | 4.5 | **Fail** |
| **accent** | **white** / **white on accent** | — | **2.15** | 4.5 | **Fail** |
| brand | white | Links | 6.29 | 4.5 | Pass |
| brand | brand-50 | Selected tier text on a tinted fill | 5.62 | 4.5 | Pass |
| white | neutral-900 / brand-800 | Lock-screen preview (proposed) | 17.40 / 11.42 | 4.5 | Pass |

### 4b. UI boundaries

| Boundary | Against | Where | Ratio | Needs 3:1? | Result |
|---|---|---|---|---|---|
| **neutral-300** | **white** | TextField border `TextField.jsx:24` | **1.41** | Yes, it marks where the input is | **Fail** (TextField is out of scope) |
| neutral-300 | white | Secondary button border `Button.jsx:28` | 1.41 | No, the label identifies it | Pass by exemption, but with grey text it reads as disabled |
| brand | white | TextField focus border `:25`, primary fill | 6.29 | Yes | Pass |
| brand | neutral-300 | Focus change, unfocused → focused | 4.45 | Yes | Pass |
| brand/30 | white | Focus ring `TextField.jsx:25` | 1.60 | Supplementary | n/a, the border carries focus |
| UA checkbox (~#767676) | white | Proposed `Choice` | 4.54 | Yes | Pass (browser-dependent) |
| neutral-500 | white | If Choice is custom-drawn | 3.95 | Yes | Pass |
| #E6E6E6 | white | Card border `Card.jsx:9` | 1.25 | No (decorative) | — |
| #DADADA | white | ListRow divider `ListRow.jsx:15` | 1.40 | No | — |
| neutral-300 | white | Panel `Panel.jsx:9`, sheet handle `BottomSheet.jsx:15` | 1.41 | No | — |
| neutral-100 | white | AppBar divider `AppBar.jsx:7` | 1.12 | No | — |
| accent-50 | white | Attention surface edge | 1.07 | No, but the label must carry the meaning | — |
| white sheet | scrim (black/40 over white = #999) | `BottomSheet.jsx:10,14` | 2.85 | No | — |

### 4c. Failures in summary

| # | Pair | Ratio | Where it bites in my scope | My decision |
|---|---|---|---|---|
| C1 | neutral-500 on white / neutral-50 / accent-50 | 3.95 / 3.78 / 3.70 | Every caption on S3, S4, S7, S8, and the secondary "way out" button | Fixed by retuning neutral-500 to #6B6B6B |
| C2 | neutral-900 (AmountText) on brand / brand-pressed | 2.77 / 1.75 | The accept button, if it uses AmountText for its amount | Fixed by AmountText inheriting its colour |
| C3 | white on success, success on white | 3.45 | Toast, any success text on the receipt | Fixed by retuning success to #15803D |
| C4 | accent-600 on accent-100 / neutral-100 | 4.31 / 4.49 | Late states, if the wrong surface is chosen | Attention text only on attention-50. attention-100 documented as not for text |
| C5 | accent on white, white on accent | 2.15 | A solid amber badge | Gone: accent DEFAULT is removed |
| C6 | brand-200 on brand | 4.22 | Button sub-line, if chosen | The second line uses brand-100, not brand-200 |
| C7 | neutral-300 input border on white | 1.41 | TextField (out of scope) | Accept (safe default) |

---

## 5. Inconsistent, duplicated or hard-coded

| # | Finding | Where | Kind | Proposal | Source | My decision |
|---|---|---|---|---|---|---|
| I1 | Card and Panel are the same component | `Card.jsx`, `Panel.jsx` | Duplicated | Retire Panel or alias it to Card | FI | Alias Panel to Card |
| I2 | Four border greys for one job: #E6E6E6, #DADADA, neutral-300, neutral-100 | `Card.jsx:9`, `ListRow.jsx:15`, `Panel.jsx:9`, `AppBar.jsx:7` | Inconsistent | Two tokens: neutral-200 (surfaces), neutral-300 (dividers) | FI, PF | neutral-200 for surfaces, neutral-300 for dividers |
| I3 | `#1a1a1a` root text duplicates neutral-900 | `index.css:7` | Hard-coded | Point at the token | PF | Point `:root` at neutral-900 and remove its allow-list entry |
| I4 | The font stack lives in CSS, not the config | `index.css:6` | Hard-coded | Move it to `fontFamily.sans` | New | Move it to `fontFamily.sans` |
| I5 | Built-ins used instead of tokens: `bg-white` ×7, `text-white` ×2, `bg-black/40`, `shadow-xl`, `rounded-full` ×3, `font-semibold` | Several | Inconsistent | Q9, Q10 | PF (colour, shadow), New (radius, weight) | Built-in weights and `tabular-nums` allowed. Colours as in I6 |
| I6 | Colours are under `extend`, so **Tailwind's whole default palette** (`red-500`, `amber-400`…) is still available, and the check misses all of it | `tailwind.config.js:8-9` | Inconsistent | Q10 | New | The check fails on every Tailwind default colour name except `white`, `black` and `transparent`. Reason for the exception: they're absolutes, not palette choices (white surfaces and text on fills, black only as the base of the scrim, transparent for resets), so a token would only rename them. Goes into DESIGN_SYSTEM.md when the check is updated |
| I7 | `font-semibold` on Button overrides the type tokens' own weights | `Button.jsx:17` | Inconsistent | Q9 | New | Built-in weights allowed |
| I8 | `brand-pressed` is named by state in a numeric ramp | `tailwind.config.js:17` | Inconsistent | Flag-don't-fix | New | Accept (safe default) |
| I9 | `success` is one value. Every other colour is a ramp | `tailwind.config.js:36` | Inconsistent | Flag-don't-fix | New | Accept (safe default) |
| I10 | Unused tokens: brand-50/100/200/400/800, all accent, neutral-50, neutral-200, `rounded-sm` | Config | — | Keep. Some get used in my scope | New | Accept (safe default) |
| I11 | Toast's timing is in the caller, not the component. progress.md says Toast auto-dismisses | `App.jsx:25` | Correction | Fix the wording in progress.md | New | Accept (safe default) |
| I12 | The success Toast is used for a TODO message | `App.jsx:77` | Inconsistent | Goes away when App is replaced | New | Accept (safe default) |
| I13 | Component APIs don't match: BottomSheet `open`+`onClose`, Toast `open` only. **No component forwards other props**, so none can take `id`, `role` or `aria-*` | All of `src/novakit` | Inconsistent | Forward `...rest` in the components my scope uses | New | Forward `...rest` in the components my scope uses |
| I14 | Text glyphs as icons (‹ ✓ ↑ ↓), with no icon set. ListRow's aren't hidden from screen readers | `AppBar.jsx:14`, `Toast.jsx:11`, `App.jsx:57,63,69` | Inconsistent | Keep the glyphs (no new library), `aria-hidden` them | New | Keep the glyphs, `aria-hidden` |
| I15 | The README documents Card and Panel identically and lists no focus state | `README.md` | Inconsistent | Note it in the write-up | New | Accept (safe default) |
| I16 | `className` can't reliably override built-in classes (Button `w-full`/`h-*`, AmountText colour), because Tailwind resolves by CSS order | `Button.jsx:36`, `AmountText.jsx:13` | Inconsistent | Props instead of overrides | New | Props instead of `className` overrides |
| I17 | Persona data hard-coded in the screen: balance 4,250, salary 68,000, transactions | `App.jsx:38,60,66,72` | Hard-coded | Read from the salary-advance module (CLAUDE.md) | New | Accept (safe default) |
| I18 | The page title is "NovaKit Lite" | `index.html:6` | Inconsistent | Flag-don't-fix | New | Accept (safe default) |

---

## 6. Shortcomings that would hurt trust or accessibility in my flows

| # | Shortcoming | Where it bites | Why it matters | Mitigation | Source | My decision |
|---|---|---|---|---|---|---|
| 6.1 | AmountText shows **"Rs 0"** (or "Rs NaN") when the amount is missing (`AmountText.jsx:11`) | S4, S7, S8, S9, S11 | A guessed or zero amount on a cost screen is a false statement about money. It breaks a CLAUDE.md rule | Render nothing for a missing amount. The screen shows "not available yet" and hides the action | New | Render nothing. The screen says "not available yet" |
| 6.2 | Fine print is the least readable text (neutral-500, 3.95) | S3, S4, S7, S8 | Low-contrast terms are the classic hidden-cost pattern, and it fails AA | Fix at the token (C1, Q3) | PF | Retune neutral-500 to #6B6B6B |
| 6.3 | The secondary button looks disabled | S4, S7 (the way out) | If "Not now" looks unavailable, saying no feels impossible: pressure by styling | Secondary text → neutral-900 or neutral-700 | FI | Secondary text neutral-900. The "no" option must be as clear as "yes" |
| 6.4 | The amount in the accept button would be 2.77:1 | S4, S7 | The number the person taps must be the most readable thing on the screen | AmountText inherits colour | New | AmountText inherits its colour |
| 6.5 | The accept button can't carry the repayment line | S4, S7 | Principle 1 fails | Button `subLabel` + `min-h` | FI | Button second line and minimum height |
| 6.6 | No busy state, so a second tap is possible | S5 | Fear of borrowing twice, or of not knowing whether it worked | Button `loading`. The module ignores a repeat submit | New | Button loading state. The module ignores a repeat submit |
| 6.7 | No checkbox, so the permission can't be its own control | S4, S7 | Consent gets bundled into the button | `Choice` | FI | `Choice` |
| 6.8 | A disabled accept button is 2.80:1 and doesn't say why | S4, S7 | People don't know what's blocking them | State the reason in visible text by the button, or keep it enabled and show an inline message on tap (Q2) | New | Accept stays enabled. Tapping it without the permission shows an inline message at the checkbox, in neutral. A disabled button doesn't explain itself, and nothing has failed |
| 6.9 | The over-limit tier's reason, styled as disabled grey | S3 | The reason is information, so it needs 4.5:1. Hiding or greying it reads as "you're not good enough" | The tier stays in the list. Its reason is in neutral-700 | New | The tier stays in the list, with its reason in neutral-700 |
| 6.10 | Toast as the only feedback: transient, no `aria-live`, 3.45:1 | S6 | A network failure that disappears leaves people unsure whether they borrowed | Failures are an inline Card (`tone="danger"`, `role="alert"`) with a retry. Toast never carries failure or consent | FI, PF | Inline Card, `tone="danger"`, `role="alert"`. Toast never carries failure or consent |
| 6.11 | BottomSheet: no dialog semantics, dismissed by a backdrop tap, a fake grab handle, no scrolling | S4 details, S7 | A consent that can be dismissed by accident is ambiguous. Keyboard and screen-reader users lose their place | Native `<details>` for S4, a full screen for S7 | PF, New | Native `<details>` for S4, a full screen for S7. BottomSheet unused |
| 6.12 | ListRow truncates | S4, S8 | "Repay on 28 Jul at 6pm, once salary lands" cut to "Repay on 28 Jul at…" hides terms | ListRow `wrap` | New | ListRow `wrap` |
| 6.13 | No danger colour | S6, S11 | Red ends up on the person instead of the event, or comes from raw `red-500` | `danger` tokens, used only by event rows and failure messages | FI | Add `danger` and `danger-50`, used only by event rows and failure messages |
| 6.14 | Amber has no defined meaning, and DEFAULT fails as text | S12, S13 | A solid amber "LATE" badge is alarm styling | Rename to `attention` with allowed pairs only | FI | Rename to `attention`, with DEFAULT removed |
| 6.15 | The frame grows with content (`App.jsx:31`) | S4 and every overlay | "Visible without scrolling" can't be tested. Toast and BottomSheet sit at the frame's bottom, which can be off-screen | Fixed device height, `main` scrolls, a sticky action area (Q7) | New | Fixed 390×844 frame, `main` scrolls, sticky action area |
| 6.16 | No component forwards `aria-*` | S4, S6, S7 | The checkbox can't point to its description, the button can't point to the cost summary, and errors can't be announced | Forward `...rest` | New | Forward `...rest` |
| 6.17 | No designed focus style on Button or Back. TextField removes the outline | All | Keyboard users can't see where they are, depending on the browser | `focus-visible` ring from `brand` on Button and Choice | New | A `focus-visible` ring from `brand` on Button and Choice |
| 6.18 | The direction of money is only a glyph, and amounts have no sign | S9 | The advance in and the collection out must be impossible to confuse | Words ("Received", "Collected") plus the `sign` option, glyphs `aria-hidden` | New | Words plus the `sign` option. Glyphs `aria-hidden` |
| 6.19 | AmountText prints up to 3 decimals | S7 | A reduced payout could show "Rs 217.5" or worse | Rounding rule in the module, after you decide (Q8) | New | No rounding needed: a reduced payout drops to a lower tier, so fees stay whole |
| 6.20 | Cards on a white frame are separated only by a 1.25:1 border | S4 | Weak grouping on the most important screen | Screen background neutral-50 (captions then need C1 fixed), or Card border neutral-300 | New | Screen background neutral-50. Cards need to stand apart on the accept screen, and it's safe once neutral-500 is retuned |
| 6.21 | No lock-screen preview exists | S10 | The rule (no amount, "loan" or "overdue") is untestable without one | Scaffolding with its copy in one place (Q6) | New | Scaffolding on neutral-900, with its copy in one place |

---

## 7. Questions this raises for you

| # | Question | Why it's yours | My decision |
|---|---|---|---|
| Q1 | Are S3 (choose amount) and S4 (terms + accept) one screen or two? | Flow. If they're one, everything on S4 has to fit above the fold together with three tiers | Two screens. Principle 1 needs the full cost visible without scrolling |
| Q2 | Is accept disabled until the permission is ticked, or enabled with an inline message on tap? | Flow and copy intent | Enabled, with an inline message at the checkbox on tap, in neutral. A disabled button doesn't explain itself, and nothing has failed |
| Q3 | neutral-500: retune the token to about #6B6B6B, or move text to neutral-700 and keep 500 for boundaries? | Token change | Retune to #6B6B6B. Fix at the source: one value fixes every caption |
| Q4 | Rename `accent` → `attention`? Keep or remove accent DEFAULT and accent-100? | Token change | Rename. Remove DEFAULT: nothing uses it, and removing it makes a solid amber fill impossible. Keep 100, documented as not for text |
| Q5 | Add `danger` + `danger-50`? The candidate values are in 3a | New token | Add, at #B42318 and #FEF3F2 |
| Q6 | Is the lock-screen preview in scope as scaffolding outside NovaKit? | Scope | Yes, as scaffolding on neutral-900, with its copy in one place |
| Q7 | Change the phone frame to a fixed height (e.g. 390×844) and update the allow-list? Where does the reviewer switcher live, and does the check cover it? | Your allow-list | Fixed 390×844 frame. The switcher sits outside the frame. Allow-list changes come to me before they're made |
| Q8 | Is a reduced payout always a lower tier, or any amount? How is the 3% rounded? | Policy, not in the product reference or Assumptions | Always a lower tier. Tiers keep fees whole, so there's no rounding policy to invent. To add to my Assumptions |
| Q9 | Does "type only from `tailwind.config.js`" cover font weight and `tabular-nums`? | Rule interpretation | Built-in font weights and `tabular-nums` are allowed. The font stack moves into the config |
| Q10 | Should the check catch Tailwind built-ins, or should colours move out of `extend` so built-ins stop existing? | Already open in progress.md, and I6 sharpens it | The check fails on every Tailwind default colour name except `white`, `black` and `transparent`. Reason for the exception: they're absolutes, not palette choices (white surfaces and text on fills, black only as the base of the scrim, transparent for resets), so a token would only rename them. Goes into DESIGN_SYSTEM.md when the check is updated |
| Q11 | Retire Panel, or leave it unused? | Component change | Alias Panel to Card |
