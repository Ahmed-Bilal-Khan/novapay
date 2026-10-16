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

### Chat 3, continued: the module and the system changes

- **Salary-advance module:** `src/advance/salaryAdvance.js` is now the one place for money and dates. It covers personas, offer, terms, reduced payout, accept, collection, status, reminders, wallet, date formatting and reviewer scenarios S1–S13.
  - `scripts/check-advance.mjs` has 28 checks and runs as part of `npm run check`.
  - The check was shown failing on deliberate mutations: default on day 31, and the never-paused rule removed.
  - Commits: `fae6a48`, `4532811`.
- **My read** is updated to v2.4 with this chat's assumptions and questions (`c6a2bb1`).
- **Frozen copy:** `src/review/novakit-v0/` keeps the starter components for before/after. It isn't exported, and its two hard-coded borders are allow-listed (`24957d7`).
- **Tokens:**
  - neutral-500 → #6B6B6B and success → #15803D,
  - `danger` and `danger-50` added,
  - `accent` renamed to `attention`, with DEFAULT removed,
  - the font stack moved to `fontFamily.sans`, and the root colour now reads neutral-900.

  `DESIGN_SYSTEM.md` is created with an entry per change and before-and-after contrast (`eca45f1`).
- **The check** now also fails on Tailwind's default colour names, except `white`, `black` and `transparent`. It was shown failing on five deliberate violations (`eca45f1`).
- **Components, one commit each,** every one checked in the running app (before-and-after measurements) or in rendered HTML:
  - `Choice` is new (`68bcaeb`),
  - Button (`46271be`), AmountText with `formatAmount` (`06696de`), Card tones (`bf4a4b3`), ListRow (`27e5692`),
  - AppBar (`2b3ad3a`, then a larger glyph in `c421ee3`),
  - Panel as an alias of Card (`e1171a8`).
- **Phone frame:** fixed at 390×844, `main` scrolls, a sticky action area, a neutral-50 screen background (`8199d1e`), and the desktop scrollbar hidden (`9f0367c`).
- **The allow-list is down to 6:** three for the phone frame, the backdrop, and two for the frozen copy. Every starter-debt entry is gone.
- `npm run build` and `npm run check` pass after every commit. Nothing is pushed.

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

### Chat 3, continued: the module and the system changes

**The module**
- **Conventions:** `today` is always passed in, unknown values are `null` and never 0, and dates stay strings. Every state is reproducible, and no screen does date maths.
- **Default on day 30 (27 Aug),** because "30+ days" read literally includes day 30.
- **Collection only when salary lands, never from other incoming money.** That's what the user agrees to. Collecting from any money drifts towards sweeping funds.
- **Reminders:**
  - before the due date: 25 Jul at 10:00,
  - the not-collected notice: 6pm, when the attempt fails. 10:00 would go out before the attempt,
  - late reminders every 7 days (a placeholder cadence),
  - at most 2 in any 7 days in a row.
- **The notice before default (20 Aug) is never paused,** even after a payroll delay is reported, because a material consequence must always be announced. Whether a delay should move the default date is a question, not a rule.
- **`acceptTerms` is idempotent:** accepting the same terms twice returns the same advance, never a second one.
- **The wallet shows the real balance,** with "Includes Rs 10,000 from your advance" on home after accepting only. On later days the balance is `null`, because spending isn't modelled. Elsewhere the advance card says "Received Rs 10,000 on 7 Jul · Rs 10,300 to repay on 28 Jul".
- **The late state (S12) is viewed on 2 Aug** (5 days late).

**The system**
- **The frozen copy is allow-listed rather than skipped by the check,** so the exception stays narrow and visible.
- **`formatAmount` in AmountText is the single money formatter,** so money in strings and in components always matches.
- **Card tone borders:** attention-100 for attention, and neutral-200 for danger. Both are as faint against the page as the default edge (1.17 and 1.18:1). Full danger red would be an alarm line.
- **Panel is a deprecated alias of Card,** so imports keep working and the duplicate is gone.
- **The desktop scrollbar is hidden inside the frame,** because phones overlay theirs.

**Calls the AI made during the build, flagged and not overruled**
- **Button keeps its colours while loading,** because it's working, not unavailable. Its second line stays visible, so the height never changes.
- **The AppBar glyph uses `text-display`, not the suggested `text-title`.** Measured, `text-title` only took it from 5px to 7px wide.
- **A real zero still formats as "Rs 0".** Only missing data returns `null`, and a number passed as a string counts as missing.

## Open questions

- The cost section says "See 'Trust rules'", but there's no section with that name. The closest is "Trust matters most here".
- The decision is called "Declined" in the text but `decision (approved/denied)` with `denial_reason` in the glossary.
- The decline reason is `income_unverified`, but the glossary field is `income_verified`.
- The glossary lists `income_source (salaried/freelance)`, but the product is described as only for salaried users.
- `DESIGN_SYSTEM.md` doesn't exist yet. `CLAUDE.md` says every token or component change is logged there, including the check's `white`/`black`/`transparent` exception.
- Principle 4 in `00-my-read.md` still says "(provisional)", "The system audit confirms it" and "accent". All three are stale after the audit. The read is mine to update.
- Where does the lasting record of the agreement live? The receipt has to say where.

### Added in chat 3, continued

- **The module states something my read doesn't:** "the payout lands in the wallet when it's accepted" (`received_on = accepted_on`). Its comment marks it as from my read, but it isn't there yet. I either add it to my Assumptions, or it changes.
- **Is a real "Rs 0" acceptable?** For example, nothing left to repay. The rule only covers missing data.
- **Button loading keeps the brand colour.** I haven't confirmed that, or chosen the disabled grey instead.
- **Should the danger card get a pink edge?** That would need a new `danger-100` token. Today it uses neutral-200.
- **Should `Choice` insist on a `disabledReason`?** Today a disabled option can have none.
- **The check doesn't catch a colour name that doesn't exist.** A leftover `text-accent-600` would build silently with no colour.
- **How do I show colours before the change?** The frozen v0 copy freezes component code, not token values, so it now shows the new colours. A true "before" needs the `starter` tag.
- **The frame plus padding is 892px tall,** so on shorter laptop screens the page scrolls and the action area can sit below the browser's fold. Do I scale the frame to fit?
- **Toast sits over the sticky action area** when both show.
- **The transcript export from this chat includes the brief's full text,** because it was read in the chat. `_inputs/` is ignored so the brief is never published, so the export shouldn't be committed or pushed as it is.

**Resolved since:** `DESIGN_SYSTEM.md` now exists (`eca45f1`), including the check's `white`/`black`/`transparent` exception.

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
- *Added in chat 3, continued:*
  - Collection is attempted only when salary lands, never from other incoming money.
  - Reminders:
    - 25 Jul at 10:00,
    - the not-collected notice at 6pm when the attempt fails,
    - late reminders every 7 days (placeholder cadence),
    - the notice before default on 20 Aug, never paused,
    - default on day 30 (27 Aug).
  - Wallet balance is Rs 4,250 for both personas.
  - A reduced payout can't go below Rs 5,000. That case isn't designed.
  - Not yet in my read: the payout lands in the wallet on the day it's accepted.

### What I'd want to know

The full list is in `docs/00-my-read.md` → What I'd want to know. The ones that most shape the build:

- Is there a required cancellation window?
- Is the fee legally interest? Do we need an annualised rate or a key facts statement?
- What exactly happens at default (credit bureau, collections, legal steps)?
- Can collection retry when funds are short, and is any amount protected?
- How long can a collection permission legally last?
- *Added in chat 3, continued:*
  - Should a reported payroll delay move the default date?
  - What happens if a reduced payout is needed from the lowest tier?

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
- *Added in chat 3, continued, found while changing the system:*
  - **The dev server keeps the old Tailwind config.** After a change to `tailwind.config.js` it served stale CSS until it was restarted.
  - **The check only knows the names it's given.** It catches Tailwind's default colour names but not ones that don't exist, which build silently.
  - **Exporting a helper from a `.jsx` file** (`formatAmount` from `AmountText.jsx`) costs Vite's fast refresh for that file, so edits reload the whole page.
  - **Native checkbox and radio rendering varies by browser,** so check `Choice`'s 24px control and focus ring on each.
  - **The "‹" glyph was about 5px wide at the inherited 16px,** even inside a 44px target.
  - **On Windows the frame's scroll area showed a classic scrollbar.** It's now hidden.
  - **The README prose still says "a warm amber accent"** after the rename. Only its example was updated.

### AI process

- **Stopped the AI working ahead.** I opened chat 3 by only saying what it would cover. The AI started reading every file and was about to run the build. I stopped it and said not to start the audit yet.
- **Triage by short codes.** The AI sorted 122 audit rows into 26 safe defaults and 14 questions with lettered options. I answered with codes and one-line reasons.
- **Overrode the AI's recommendation on accent DEFAULT.** It said keep it, documented as never for text. I removed it, so a solid amber fill can't happen.
- **The AI flagged a gap in my own answer.** My first answer on the check (14A) didn't say whether `white` and `black` count. The AI recorded it as open instead of guessing, and I decided it: `white`, `black` and `transparent` are allowed.
- **The audit narrowed my read.** The attention-colour wording in principle 4 became "body text neutral-900, accent-600 only for the label". I accepted it and updated the read.
- *Added in chat 3, continued:*
  - **Rejected AI output (candidate for the write-up).** The AI's first module paused every reminder after a payroll delay, including the notice before default. I changed it: that notice is never paused, because a material consequence must always be announced. A check now guards it.
  - **Reworked AI output.** The AI's wallet said "Includes Rs 10,000 from your advance" on every day. I limited it to home after accepting, because once money is spent the claim isn't true and spending isn't modelled.
  - **The AI caught a contradiction in my spec.** I asked for every reminder at 10:00, but the not-collected notice can't go out before the 6pm attempt. I confirmed 6pm.
  - **The AI's own suggestion failed when measured.** `text-title` for the back glyph barely helped, so it used `text-display` and said why.
  - **Proving the rails work:**
    - each check was shown failing on a deliberate mutation,
    - each component change was measured before and after in the running app,
    - every temporary probe was removed.
  - **The AI attributed a rule to my read that isn't there:** "the payout lands when accepted". It was caught while writing this file and is now an open question.

### Pushback

Critique points I rejected, with my reasons.

- **S3 critique, R6: say what happens if salary doesn't land.** S4 is the commitment point and covers it. Putting it here makes S3 longer, which the critique's own B2 says is already a problem.
- **S3 critique, R7: the blocked Rs 15,000 works as an anchor.** Showing the limit honestly is the over-limit moment the brief asks for. There's no "unlock" language, and it sits last, in ascending order. Hiding it would be less transparent.
- **S3 critique, R8: "Nothing is borrowed yet" lowers resistance.** It's true, and it sits on "Review terms", not on the commit button. Saying what hasn't happened yet lowers pressure; it doesn't lower scrutiny.
- **S3 critique, SR6: the terms sit outside the form.** Reading order reaches the card before the choices. Moving the card into the form wouldn't help anyone.

## Next step

The foundations are done: tokens, components, the module and the frame.

1. **Small loose ends in my read:**
   - principle 4's stale wording ("provisional", "the audit confirms it", "accent"),
   - whether the payout lands on the day it's accepted, as an assumption.
2. **The reviewer state switcher** in `src/review/`, beside the frame, driven by `scenario()` from the module.
3. **Screens, one state per request, each with a plan I approve first.**
   - Start with S3 (choose amount), then S4 (terms + accept), as two screens.
   - Every number and date comes from the module, and every money string from `formatAmount`.

