# Progress

## Done

### Chat 1: project setup

- Unzipped the NovaKit Lite starter into the repo root. All 22 files are byte-for-byte the same as in the zip (checked with checksums).
- Added `.gitattributes` (`* text=auto eol=lf`) and added `_inputs/` to `.gitignore`.
- Ran `git init` on `main`, committed the starter as "NovaKit Lite starter, as received" (`b9a1427`), tagged it `starter`, and pushed `main` and the tag to `Ahmed-Bilal-Khan/novapay`.
- Created and pushed `feature/salary-advance`.
- `npm install` and `npm run build` both pass, and the dev server runs at `http://localhost:5173` with no console errors.
- Converted the case brief PDF to `_inputs/brief.md`. A word-level diff against the PDF text found no differences.
- Compared the product reference PDF with `PRODUCT_REFERENCE.md`: the wording and formatting are the same, and only the quote style differs (the PDF uses curly quotes, the repo file straight ones).
- Added a Stop hook (`.claude/settings.json` → `.claude/hooks/log-prompt.mjs`) that logs each prompt to `docs/ai-log/prompts.md`, numbered and grouped by session. It's tested and live, and interrupted prompts are not logged.

### Chat 2: critique of my read, and rails

- Wrote my own read, `docs/00-my-read.md` v1, without AI (`e0847f4`).
- Round 1: the AI critiqued v1 against the brief, the product reference and the NovaKit code. I rewrote it as v2, with a table of what I accepted, adapted and rejected (`14cf4bc`).
- Round 2: the AI argued against my two rejections and found 11 remaining issues in v2. I decided each one, then fixed three stale points (`502ff05`). Both tables are at the end of `00-my-read.md`.
- Restored Session 3 prompts in `docs/ai-log/prompts.md`. An editor save had overwritten them a minute after a commit, so the hook itself wasn't at fault.
- Added `CLAUDE.md` with my working rules, plus pointers to the brief, product rules, my read and this file.
- Added `npm run check` (`scripts/check-tokens.mjs`, plain Node, nothing installed). It fails on hex colours and arbitrary Tailwind values in `src/`, with an allow-list I control (`scripts/check-allowlist.json`). Shown failing on a deliberate violation, then passing once it was removed. `npm run build` passes (`eb55cbc`).

### Chat 3: system audit

- Wrote `docs/01-system-audit.md`, an audit of NovaKit Lite against my scope. It covers:
  - the UI each scope state needs (S1–S13, plus the reviewer switcher),
  - every component and token,
  - contrast for every text and boundary pair, using the WCAG formula on the config's hex values,
  - what's inconsistent, duplicated or hard-coded,
  - the trust and accessibility shortcomings in my flows.
- Confirmed the two things my read left to the audit:
  - **The Button change.** The one-line label needs about 480px but only 318px is available. The two-line label needs about 64px of height, and Button is fixed at 56px.
  - **The attention colour.** accent-600 on accent-50 is 4.71:1, with conditions.
- Triaged every row. The AI sorted them into 26 safe defaults and 14 merged questions. I answered each question, and the answers are in the audit's "My decision" column (`92ddcbb`).
- Updated `00-my-read.md` to v2.3 with the tier-drop assumption and the attention wording (`68e2681`).
- No code changed. `npm run build` and `npm run check` pass.

## Decisions

### Chat 1: project setup

- **Flattened the zip's `novakit-lite/` folder into the repo root** so the repo is the project itself, with no extra folder level.
- **Kept the zip out of the repo with `.git/info/exclude`, not `.gitignore`,** so the only change to the starter's `.gitignore` is the `_inputs/` line that was asked for.
- **Kept `brief.md` inside `_inputs/`** so it's covered by the same ignore rule and the brief is never published.
- **Did not run `npm audit fix`,** even though the install reported 14 vulnerabilities (4 moderate, 10 high). Fixing them would change the starter's lockfile.
- **Wrote `brief.md` as Markdown that follows the PDF's layout.** The boxed sections became blockquotes, the page footers were dropped, and the sentence split across pages 1 and 2 was joined.
- **Used a Stop hook rather than UserPromptSubmit for the prompt log.** Stop doesn't fire on an interrupt, so cancelled prompts stay out of the log.
- **Gave each logged prompt and session a hidden ID marker.** This means a prompt is never logged twice, and sessions stay grouped even when they alternate.
- **Wrote the hook in Node** because Python isn't installed on this machine.

### Chat 2: critique of my read, and rails

- **Scope is depth in two places:** terms + accept, and the late path (reminder before the due date → not collected on payday → late → notice before default). The home card (eligible vs needs verification) and home after accepting are thin. The credit decline, default screen, successful repayment and viewing the advance later are cut.
- **"Declined: income unverified" shouldn't exist.** Verification becomes a step on the home card before anyone applies. This rests on an assumption that verification status is known before applying.
- **Kept the receipt after accepting:** the accept moment isn't finished until the user knows it worked.
- **Kept the reminder before the due date:** it's the one chance to prevent two of the causes of lateness.
- **No grace rule:** days late are counted from the due date and shown truthfully.
- **Attention colour (provisional):** the existing amber ramp, soft background with dark text (accent-600 on accent-50). The system audit confirms it.
- **Change Button rather than loosen principle 1:** the accept button needs a secondary line for the repayment and date. The audit confirms it.
- **The check catches hex colours and arbitrary values only,** in `src/`. The phone frame and the page backdrop behind it are allowed.
- **The starter's hard-coded colours are allow-listed as starter debt, not fixed.** Fixing them is a token or component change, which is my call. Each entry is labelled to be removed once the fix lands.
- **The prompt log keeps every prompt,** including near-duplicate resends, so it matches its own "every prompt" claim.

### Chat 3: system audit

The full record is in the "My decision" column of `docs/01-system-audit.md`. None of these is built yet.

- **Button evolves:** a second line in brand-100, a minimum height, a loading state, and secondary text in neutral-900. The "no" option must be as clear as "yes".
- **One new component, `Choice`** (native checkbox and radio). The blocked tier stays visible, with its reason in neutral-700.
- **Choosing the amount and terms + accept are two screens,** so the full cost is visible without scrolling.
- **Accept stays enabled.** Tapping it without the permission shows a neutral inline message at the checkbox. A disabled button doesn't explain itself, and nothing has failed.
- **AmountText:** a missing amount renders nothing and the screen says "not available yet". It inherits its colour, and gets a caption size and an optional sign.
- **accent is renamed to attention:**
  - body text is neutral-900 on attention-50,
  - attention-600 is only for the short status label,
  - DEFAULT is removed: nothing uses it, and removing it makes a solid amber fill impossible,
  - 100 is kept, documented as not for text.
- **New tokens `danger` #B42318 and `danger-50` #FEF3F2.** Card gets a tone (default, attention or danger). Failures are inline Cards with `role="alert"`, never a Toast.
- **Retune at the source:** neutral-500 to #6B6B6B, which fixes every caption at once, and success to #15803D.
- **Late details use native `<details>`.** The reduced payout is a full screen. BottomSheet is unused.
- **ListRow** gets wrap, a danger event row and a hidden icon. Borders become neutral-200 for Card and neutral-300 for ListRow. Components forward props and get a focus ring. The back button grows to 44px. Panel becomes an alias of Card.
- **Fixed 390×844 frame:**
  - `main` scrolls inside it, with the actions stuck to the bottom,
  - the screen background is neutral-50, so cards stand apart,
  - the reviewer switcher sits outside the frame,
  - allow-list changes come to me first.
- **Lock-screen preview** is scaffolding outside NovaKit, on neutral-900, with its copy kept in one place.
- **A reduced payout always drops to a lower tier,** so fees stay whole and there's no rounding policy to invent. Now in my Assumptions.
- **Type and the check:**
  - the font stack and root text colour move into tokens,
  - built-in font weights and `tabular-nums` are allowed,
  - the check will fail on every Tailwind default colour name except `white`, `black` and `transparent`. Those are absolutes, not palette choices.

## Open questions

- The cost section says "See 'Trust rules'", but there's no section with that name. The closest is "Trust matters most here".
- The decision is called "Declined" in the text but `decision (approved/denied)` with `denial_reason` in the glossary.
- The decline reason is `income_unverified`, but the glossary field is `income_verified`.
- The glossary lists `income_source (salaried/freelance)`, but the product is described as only for salaried users.
- `DESIGN_SYSTEM.md` doesn't exist yet. `CLAUDE.md` says every token or component change is logged there, including the check's `white`/`black`/`transparent` exception.
- Principle 4 in `00-my-read.md` still says "(provisional)", "The system audit confirms it" and "accent". All three are stale after the audit. The read is mine to update.
- Where does the lasting record of the agreement live? The receipt has to say where.

## Write-up inbox

### Assumptions

The full list is in `docs/00-my-read.md` → Assumptions. The ones that most need defending:

- Verification status is known before anyone applies (the product reference says it may be checked at application).
- Collection is automatic, on payday at 6pm once salary has landed, with its own permission given at accept.
- Automatic collection is full amount only; the user can choose to pay part manually.
- The collection permission ends when the advance is repaid or at the default date, whichever comes first.
- Default consequences shown in the prototype are placeholders.
- A reduced payout always drops to a lower tier (e.g. 10,000 → 5,000), so the fee is always a whole number of rupees, and it needs fresh consent.
- Pushing for, pending finance and compliance: no late fees and no compounding.

### What I'd want to know

The full list is in `docs/00-my-read.md` → What I'd want to know. The ones that most shape the build:

- Is there a required cancellation window?
- Is the fee legally interest? Do we need an annualised rate or a key facts statement?
- What exactly happens at default (credit bureau, collections, legal steps)?
- Can collection retry when funds are short, and is any amount protected?
- How long can a collection permission legally last?

### System flags

- Card and Panel are the same component; only the border differs.
- Hard-coded colours: Card's border `#E6E6E6`, ListRow's border `#DADADA`, and `#1a1a1a` in `index.css` (duplicates neutral-900).
- The secondary button's grey text (neutral-500) makes it look disabled, so the "no" option on an accept screen would look unavailable. It's also 3.95:1 on white, which fails WCAG AA at 15px. Captions and placeholders use the same grey, so the fine print on the accept screen would be the least readable text.
- The only status colour is success. There's no warning, error or info, and the amber accent has no defined meaning.
- Toast is success-only and has no `aria-live`. White on the success green is 3.45:1, which fails AA. (Correction: the 2.2s dismiss is in `App.jsx:25`, not in Toast.)
- TextField has no label, error state or helper text, and its border is 1.41:1, too faint to show where the input is.
- BottomSheet has no dialog role, focus trap or Escape handling, and tapping the backdrop closes it. Its grab handle suggests a swipe that isn't built.
- Button has a fixed height, 56px at large size, so the two-line accept label (about 64px) doesn't fit. It's also always full-width, has no loading state and no designed focus style.
- AmountText renders "Rs 0" when the amount is missing, which breaks my own rule. It forces `text-neutral-900`, so an amount inside a primary button would be 2.77:1. It has no caption size and no sign.
- There's no checkbox or radio button.
- Colours sit under `extend`, so Tailwind's whole default palette (`red-500`, `amber-400`…) is still available, and the first version of the check didn't see it. The starter also uses `bg-white`, `text-white`, `bg-black/40` and `shadow-xl`.
- No component forwards extra props, so none can take an `id`, `role` or `aria-*` attribute without being edited.
- ListRow truncates its title and subtitle, which would cut cost and due-date lines.
- The phone frame grows with its content, so "visible without scrolling" can't be tested, and Toast and BottomSheet can end up off-screen.
- The amber ramp: accent-600 on accent-50 is 4.71:1, a pass by 0.21. accent-600 fails on accent-100 (4.31) and neutral-100 (4.49). accent DEFAULT fails as text (2.15).
- After the accent → attention rename, the README's example `text-accent-600` will be out of date.

### AI process

- **Stopped the AI working ahead.** I opened chat 3 by only saying what it would cover. The AI started reading every file and was about to run the build. I stopped it and said not to start the audit yet.
- **Triage by short codes.** The AI sorted 122 audit rows into 26 safe defaults and 14 questions with lettered options. I answered with codes and one-line reasons.
- **Overrode the AI's recommendation on accent DEFAULT.** It said keep it, documented as never for text. I removed it, so a solid amber fill can't happen.
- **The AI flagged a gap in my own answer.** My first answer on the check (14A) didn't say whether `white` and `black` count. The AI recorded it as open instead of guessing, and I decided it: `white`, `black` and `transparent` are allowed.
- **The audit narrowed my read.** The attention-colour wording in principle 4 became "body text neutral-900, accent-600 only for the label". I accepted it and updated the read.

## Next step

1. `DESIGN_SYSTEM.md`: set up the log (what changed, why in one line, the file it lives in), with the decisions from `docs/01-system-audit.md` as the changes to come.
2. A plan for the salary-advance module (one source of truth for money and dates), for my OK before any code.
3. The token and component changes decided in the audit, one at a time. Each needs a plan I approve first, a `DESIGN_SYSTEM.md` entry, and `npm run build` and `npm run check` passing.
