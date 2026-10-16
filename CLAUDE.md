# Working rules

NovaPay salary-advance case study, built on NovaKit Lite. These rules apply to every chat in this project.

## File safety

- Never create, modify or delete files outside `D:\Frontend\Side Projects\Finance App`. Ask me before deleting any file, inside the project or out.
- Don't edit `docs/00-my-read.md` unless I ask. It's my thinking, not yours.
- Never push to GitHub, or install a package, without asking me first.

## Where things are

- The brief: `_inputs/brief.md`
- Product rules: `PRODUCT_REFERENCE.md`
- My read, including my Assumptions: `docs/00-my-read.md`
- Handoff between chats: `docs/progress.md`
- Allow-list for `npm run check`: `scripts/check-allowlist.json` (mine; ask before changing it)

## AI role

- I decide the flow, the copy intent, the scope, and every token or component change. You implement and critique.
- For anything new, propose a short plan first and wait for my OK before writing code.
- If a product rule is unclear, ask me. Never invent policy. Anything not in `PRODUCT_REFERENCE.md` or my Assumptions section is a question, not a fact.

## One source of truth (money and dates)

- All salary-advance logic lives in one module: tiers (5k/10k/15k), the limit, the fee (3% of the amount paid out), a reduced payout, totals, the due date, the collection time (payday at 6pm, once salary has landed), days late, and the default date (30+ days).
- Screens never calculate money or dates themselves. They only read from the module.
- Persona A: salary of Rs 68,000 paid into NovaPay on the 28th, limit Rs 10,000, today 7 Jul, due 28 Jul. Persona B: paid into a bank account, needs verification. Every screen uses these.
- Days late are counted from the due date and shown truthfully. No grace rule.

## Design system

- Colours, type, radius and shadow come only from `tailwind.config.js`. No hex values and no arbitrary `[..]` values in `src/`, except the phone frame. `npm run check` enforces this.
- Extend an existing component before creating a new one. Ask me before adding any new component or token.
- Fix problems at the token, not wherever it happens to be used.
- Log every token or component change in `DESIGN_SYSTEM.md`: what changed, why (one line), and the file it lives in.
- No new fonts, icon libraries or images unless I approve them.

## Trust and copy

- Nothing is pre-ticked or pre-selected. Tiers are in ascending order with equal visual weight.
- The accept button names the amount; its second line names the repayment and date. Exception: the second line can be left out when the rest of the screen already gives enough context, so the line would only repeat it (S4: the repayment and date are in "Your advance", visible without scrolling).
- The cost (amount received, fee in rupees, total, due date) is visible on the accept screen without scrolling.
- The permission to collect is its own unticked checkbox, and it states when it ends.
- Never show "Rs 0" or a guessed number when data is missing.
- Red only on the event that failed, never on a person's status. Late states use the attention colour: amber, soft background, dark text, no solid fills, no alarm icons.
- No urgency, guilt or blame wording. Every bad-news screen gives a next step that works.
- Never say "no interest". Never promise "never" about fees.
- Lock-screen previews never show an amount, "loan" or "overdue".
- Any copy that states a policy must match my Assumptions. Placeholder policy copy is labelled as a placeholder.

## Workflow

- One screen or state per request.
- Every visible control works, or isn't shown.
- Run `npm run build` and `npm run check` before calling anything done.
- Never rewrite a working screen wholesale without showing me the diff first.
- Commit when a step is done, with the reason in the message, not just the change.
- When I reject an output: commit it as "AI draft: …", then revert it with "Reject: [what was wrong]".
- At the end of each chat, update `docs/progress.md`, including the Write-up inbox.
