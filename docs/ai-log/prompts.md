# AI prompt log

Every prompt sent to Claude Code in this project, grouped by session. Interrupted prompts are not logged.

## Session 1

<!-- session:bea1b80e-bc48-4862-83ac-19d0294f016a -->

### Prompt 1

<!-- prompt:e8536837-9069-4444-b41d-f43a799fc933 -->

> Set up a project hook that appends each prompt I send to docs/ai-log/prompts.md, numbered and grouped by session, with no timestamps. Use a Stop hook, not UserPromptSubmit: when Claude finishes responding, read the session transcript (transcript_path from the hook input) and append the most recent user prompt. Stop doesn't fire when I interrupt, so prompts I cancel aren't logged. Show me the hook config, then test it: I'll send a prompt and interrupt it, then send a normal one, and you show me prompts.md.

### Prompt 2

<!-- prompt:e62e2dae-e132-464d-86e2-6ffeed930e28 -->

> Create docs/progress.md with these sections:
> - Done: what this chat set up.
> - Decisions: any setup decisions and why.
> - Open questions: the four inconsistencies you found in the product reference (the missing "Trust rules" section, Declined vs denied/denial_reason, income_unverified vs income_verified, income_source freelance in a salaried-only product). List them only; don't resolve them.
> - Write-up inbox, with three sub-lists: Assumptions, What I'd want to know, System flags. Leave them empty for now.
> - Next step: Phase 0, my own read (no AI).
> Commit it with a message giving the reason.

### Prompt 3

<!-- prompt:fbb3b99a-d38d-4c29-b4a9-351328c59b1a -->

> Commit .claude/ and docs/ai-log/ with a reason-giving message, then push feature/salary-advance.

### Prompt 4

<!-- prompt:c28cd1fd-137e-4b9a-90eb-4057b8fac140 -->

> Export this chat's transcript to docs/ai-log/raw/project-setup.md

### Prompt 5

<!-- prompt:26f47c22-0b1b-496d-b77a-996fe4d9420b -->

> Commit docs/ai-log/raw/project-setup.md and the updated docs/ai-log/prompts.md with a reason-giving message, then push feature/salary-advance.

## Session 2

<!-- session:64c6f4f7-eddd-4b77-8bcf-7852456bfd15 -->

### Prompt 1

<!-- prompt:e269053c-6454-4b74-9b07-03ba5c0c54d5 -->

> Prompt logging test
>
> Prompt logging test 2

### Prompt 2

<!-- prompt:4da3cf79-ce34-444d-bd0a-45ccf64a2f36 -->

> Final normal test

### Prompt 3

<!-- prompt:c74a4e68-e336-410c-aa8e-3b123db171b0 -->

> /variants-ahmed this is a skill test

## Session 3

<!-- session:ff2079df-e4fc-45a5-8f12-b55f049f04d3 -->

### Prompt 1

<!-- prompt:d0f2c120-b541-4c37-a736-b3802215789a -->

> Read docs/progress.md. Phase is Critique of my read and setting up rails. My intent: I want to use this session as a critique of how I understood the problem, my impressions and some rules I have set. Propose a plan before touching code.

### Prompt 2

<!-- prompt:273ab08d-42c6-4bb9-b345-ea2570abe67f -->

> Read _inputs/brief.md, PRODUCT_REFERENCE.md and docs/00-my-read.md. Don't design anything and don't write code.
>
> 1.  Where is my reasoning weak or unsupported?
>
> 2.  What does the brief ask for that my plan doesn't cover?
>
> 3. Which of my assumptions would a lending compliance person or regulator challenge, and why?
>
> 4.  Which of my principles are vague enough that they couldn't fail a screen?
>
> 5. Does my scope cover the necessary areas and does it follow the Depth over breadth rule set in the breif?
>
> Be blunt and specific.

### Prompt 3

<!-- prompt:bbed4f3a-a610-433b-92a2-7b9d089ad6c6 -->

> I've updated docs/00-my-read.md to v2 after your critique. The "Response to the AI critique" table at the end shows what I accepted, adapted and rejected.
>
> I'm rejecting two of your points:
> 1. Cutting the record: The receipt right after accepting is the accept moment, and "no record" is on my own predatory list. Only the later "view your advance" screens are cut..
> 2. Cutting the reminder before the due date: The brief names "a repayment is coming due". The late path starts there.
>
> Please:
> 1. Argue against both rejections as strongly as you can, then tell me whether anything in your argument should change my call.
> 2. Check v2 for anything still unsupported or contradictory. A short list only.
>
> Don't edit 00-my-read.md. I'll make any changes myself.

### Prompt 4

<!-- prompt:ac0b8d4c-9b4e-4403-8397-3d25062598dc -->

> Two corrections. First, you're right about the table: it misattributed three points to you. I'm correcting those rows to match what you actually said. Second, my last message went out with placeholders instead of my reasons. My actual reasons: [receipt: the accept moment isn't finished until the user knows it worked], [reminder: it's the only chance to prevent two of the causes of lateness].
>
> I accept your round-2 argument on both reasons. Next I'll fix the 11 issues you added, then decide the rest myself.

### Prompt 5

<!-- prompt:6691a333-4a11-4baf-9910-e2e3b4c50f19 -->

> Two corrections. First, you're right about the table: it misattributed three points to you. I'm correcting those rows to match what you actually said. Second, my last message went out with placeholders instead of my reasons. My actual reasons: receipt: the accept moment isn't finished until the user knows it worked, reminder: it's the only chance to prevent two of the causes of lateness.
>
> I accept your round-2 argument on both reasons. Next I'll fix the 11 issues you added, then decide the rest myself.

### Prompt 6

<!-- prompt:b5178b20-51fc-4c5e-a91d-ad9244dfc1b8 -->

> I've decided how to handle your 11 round-2 points. Apply these decisions to docs/00-my-read.md. Change only what's listed, keep my wording where I give it, and don't add anything of your own. Show me the diff before saving.
>
> 1. Collection timing. In "Why someone ends up late" and Assumptions: collection happens on payday once salary has landed, at a fixed time (6pm), and the reminder before the due date says exactly when. In the Scope late path, rename "collection failed" to "Not collected on payday". Causes: salary didn't arrive, salary arrived short of Rs 10,300, balance dropped below Rs 10,300 before 6pm, or salary moved to a bank account. Keep "spent before collection" as a cause, since the 6pm time makes it possible.
>
> 2. Second persona. Add to Assumptions: "A second user is paid into a bank account, so the wallet can't see their income. They see the 'Verify your salary' home card." Also add: "Verification status is known before applying. The product reference says income may or may not be verified at application, so this is my assumption." Under Thin in Scope, name this as the second persona's home-card state.
>
> 3. Grace period. Remove the 5-day rule. Replace the "Due date vs salary arriving" paragraph with: "Days late are counted from 28 Jul, as the product reference says, and shown truthfully. The tone is calm from day 1. If payroll is delayed, the user can tell us and reminders pause."
>
> 4. Retries and part-payments. In principle 5, replace "at most once a day" with "attempted once each time new money lands, never on a daily loop (whether retries are allowed is an open question)". In Assumptions: "Automatic collection is full amount only. The user can choose to pay part manually (shown on the late screen, stubbed in the prototype)."
>
> 5. Default consequences. In the Scope terms + accept section, after the default consequences line, add "placeholder copy until compliance confirms". Add to Assumptions: "Default consequences shown in the prototype are placeholders."
>
> 6. Red. Replace principle 4's last bullet with: "Red only on the event that failed (e.g. 'We couldn't collect on 28 Jul'), never on the person's status card or the late screen. Their status uses the attention colour."
>
> 7. Home after accepting. Add to Thin in Scope: "Home after accepting: their own balance first, with the advance shown separately. This is where the receipt's Done goes, and it makes principle 5 testable."
>
> 8. Button. Add to First impressions: "Button has a fixed height and 20px text at large size. A descriptive label like 'Accept Rs 10,000 · repay Rs 10,300 on 28 Jul' probably won't fit. I'd rather change Button (a secondary line and a minimum height) than loosen principle 1. The audit will confirm." In Scope, change the button line to: main label "Accept Rs 10,000", secondary line "Repay Rs 10,300 on 28 Jul".
>
> 9. What's working. Replace the first bullet with: "It converts, so people want it. That doesn't prove they understand it." Mark the fixed-fee and payday-timing bullets as "(from the product reference, not observed)".
>
> 10. Metrics. Add to "How I'd know it's good": "Repeat borrowing: how often someone borrows again within 7 days of repaying. It should stay low."
>
> 11. Permission end date. Change the collection permission in Scope to: "I allow NovaPay to collect Rs 10,300 from my wallet on 28 Jul, or when my salary lands after that, until this advance is repaid or the default date, whichever comes first." Add to Assumptions: "After default, automatic collection stops. We ask for permission again, or the user pays manually." Add to "What I'd want to know": "How long can a collection permission legally last, and what does re-asking after default require?"
>
> Critique table: correct three rows so they match what you actually said:
> - "Separate permission to collect from the wallet": change the reason to "Becomes the checkbox, so consent is specific rather than a generic 'I agree'".
> - Replace "Cut the record" with: "Cut v1's separate 'Record of the advance' screen | Accept | Moved to 'With more time'".
> - Replace "Cut the pre-due reminder" with: "Your suggested late path left out the reminder before the due date | Reject | It's the one chance to prevent two of the four causes of lateness: salary moved to a bank, and money spent before collection".
> Then add: "Keep a receipt after accepting (my addition, not a critique point) | Keep | The accept moment isn't finished until the user knows it worked. It will say where the lasting record lives, which is still an open question".
>
> Then add a "Round 2" table underneath, with columns Point | My call | What changed, one row per decision above. Points 3 and 9 are "Accept"; points 1, 4, 8 and 11 are "Adapt"; the rest are "Accept".

### Prompt 7

<!-- prompt:d5cd86f0-cac4-49d5-a143-c4d25fb92f31 -->

> Save the staged version to docs/00-my-read.md as shown. I'll handle the three flagged items myself.

### Prompt 8

<!-- prompt:c1014656-53f0-4b63-b34d-263c5f38d01d -->

> Three stale points remain after the round-2 edits. Apply exactly these to docs/00-my-read.md and show me the diff before saving:
> 1. In the critique table, change the "Why someone ends up late" reason to: "It decides the tone. A grace rule was added in v2, then removed in round 2: days late are shown truthfully."
> 2. Define the attention colour. Add to principle 4: "Attention colour (provisional): the existing amber ramp, only as a soft background with dark text (accent-600 on accent-50). Never a solid fill, never on headlines, no alarm icons. The system audit confirms it." In First impressions, replace the amber bullet with: "The only status colour is success. Amber is labelled 'for expressive moments' and has no defined meaning, so anyone would grab it for a late screen. I'll give it one meaning (attention) with rules, or not use it."
> 3. In "A moment that shouldn't exist", replace the first bullet with: "Assuming verification status is known before anyone applies (see Assumptions), the home card can show verification as a step to complete first, instead of letting the user apply and then declining them: 'Verify your salary to unlock an advance', with the steps."
> Change nothing else.

### Prompt 9

<!-- prompt:3df69a92-3f28-4b9c-8791-caa9a3ef7e80 -->

> Save the staged version to docs/00-my-read.md as shown.

### Prompt 10

<!-- prompt:9a351a68-3d56-4bb0-8a1e-474b3bb728cb -->

> I have committed the changes, however the prompt log doesn't seem to show the prompts after #4 could you update this

### Prompt 11

<!-- prompt:319d33f9-12e3-433e-8ac8-754cdea27b5b -->

> Restore the bracketed "Two corrections" prompt (ac0b8d4c) to the log in its original position and renumber the rest, so the log matches its own "every prompt" claim.

### Prompt 12

<!-- prompt:cfa0faf0-04d6-44fb-87d5-4d518e03a42e -->

> Here are my working rules. Turn them into CLAUDE.md without changing their meaning. Keep FILE SAFETY first. Add pointers: brief at _inputs/brief.md, product rules in PRODUCT_REFERENCE.md, my read in docs/00-my-read.md, handoff in docs/progress.md.
>
> FILE SAFETY
> - Never create, modify or delete files outside D:\Frontend\Side Projects\Finance App. Ask me before deleting any file, inside the project or out.
> - Don't edit docs/00-my-read.md unless I ask. It's my thinking, not yours.
> - Never push to GitHub, or install a package, without asking me first.
>
> AI ROLE
> - I decide the flow, the copy intent, the scope, and every token or component change. You implement and critique.
> - For anything new, propose a short plan first and wait for my OK before writing code.
> - If a product rule is unclear, ask me. Never invent policy. Anything not in PRODUCT_REFERENCE.md or my Assumptions section is a question, not a fact.
>
> ONE SOURCE OF TRUTH (money and dates)
> - All salary-advance logic lives in one module: tiers (5k/10k/15k), the limit, the fee (3% of the amount paid out), a reduced payout, totals, the due date, the collection time (payday at 6pm, once salary has landed), days late, and the default date (30+ days).
> - Screens never calculate money or dates themselves. They only read from the module.
> - Persona A: salary of Rs 68,000 paid into NovaPay on the 28th, limit Rs 10,000, today 7 Jul, due 28 Jul. Persona B: paid into a bank account, needs verification. Every screen uses these.
> - Days late are counted from the due date and shown truthfully. No grace rule.
>
> DESIGN SYSTEM
> - Colours, type, radius and shadow come only from tailwind.config.js. No hex values and no arbitrary [..] values in src/, except the phone frame. npm run check enforces this.
> - Extend an existing component before creating a new one. Ask me before adding any new component or token.
> - Fix problems at the token, not wherever it happens to be used.
> - Log every token or component change in DESIGN_SYSTEM.md: what changed, why (one line), and the file it lives in.
> - No new fonts, icon libraries or images unless I approve them.
>
> TRUST AND COPY
> - Nothing is pre-ticked or pre-selected. Tiers are in ascending order with equal visual weight.
> - The accept button names the amount; its second line names the repayment and date.
> - The cost (amount received, fee in rupees, total, due date) is visible on the accept screen without scrolling.
> - The permission to collect is its own unticked checkbox, and it states when it ends.
> - Never show "Rs 0" or a guessed number when data is missing.
> - Red only on the event that failed, never on a person's status. Late states use the attention colour: amber, soft background, dark text, no solid fills, no alarm icons.
> - No urgency, guilt or blame wording. Every bad-news screen gives a next step that works.
> - Never say "no interest". Never promise "never" about fees.
> - Lock-screen previews never show an amount, "loan" or "overdue".
> - Any copy that states a policy must match my Assumptions. Placeholder policy copy is labelled as a placeholder.
>
> WORKFLOW
> - One screen or state per request.
> - Every visible control works, or isn't shown.
> - Run npm run build and npm run check before calling anything done.
> - Never rewrite a working screen wholesale without showing me the diff first.
> - Commit when a step is done, with the reason in the message, not just the change.
> - When I reject an output: commit it as "AI draft: …", then revert it with "Reject: [what was wrong]".
> - At the end of each chat, update docs/progress.md, including the Write-up inbox.
>
> Then add an "npm run check" script that fails if any file under src/ contains a hex colour or an arbitrary Tailwind value, with an allow-list I control. Prove it works by showing it fail on a deliberate violation, then remove the violation.

### Prompt 13

<!-- prompt:1f80a7b7-7355-4e20-bd41-17b0ec39920b -->

> Commit CLAUDE.md, scripts/, package.json and docs/ai-log/prompts.md with a reason-giving message. Don't push.

### Prompt 14

<!-- prompt:17b78c20-4b52-4170-8934-a9ba4b0eb492 -->

> Update docs/progress.md for this chat: Done, Decisions, Open questions, the Write-up inbox (Assumptions, What I'd want to know, System flags) and Next step. Show me the diff before saving.

### Prompt 15

<!-- prompt:298be19d-7cdc-4655-bfa0-eae8e62f501a -->

> Save the proposal to docs/progress.md as shown, then delete .git/progress.proposed.md. Don't commit yet.

### Prompt 16

<!-- prompt:8d5dc278-16c2-4468-9a5d-76711a58eeae -->

> export the transcript of this chat to docs/ai-log/raw/progress-review&guardrails

## Session 4

<!-- session:a52deaf9-0e9a-46f2-b7d0-d37007cff151 -->

### Prompt 1

<!-- prompt:2b97a649-5cc4-4f46-b653-0c0a040af1b4 -->

> Read CLAUDE.md and docs/progress.md. we are working on the foundations. My intent: System audit against the scope. Do not touch code yet. Do not perform an audit yet. This is just to tell you what we'll be doing in this chat, do not work on anything yet.

### Prompt 2

<!-- prompt:8da4c42f-577d-48fc-9741-8ca441fb8830 -->

> Read the Scope and First impressions sections of docs/00-my-read.md, then tailwind.config.js, src/index.css and every file in src/novakit. Audit NovaKit Lite against my scope. Don't change any code.
>
> 1. For each state in my scope, list the UI it needs.
> 2. For each component and token: which scope states use it, whether it's sufficient as is, and if not, exactly what's missing or wrong (cite file:line). Propose the smallest change that works: keep / evolve / new / flag-don't-fix.
> 3. Prefer extending existing components and reusing or renaming existing tokens over adding new ones. For every proposed addition, say why nothing existing can do the job.
> 4. Calculate contrast for every colour used for text or UI boundaries, against the surfaces it actually sits on. List the failures with numbers.
> 5. List anything inconsistent, duplicated or hardcoded in the system, even where my scope doesn't touch it.
> 6. List shortcomings that would hurt trust or accessibility in my flows specifically, and a mitigation for each.
>
> Write it to docs/01-system-audit.md as tables, with an empty "My decision" column. Mark which findings match my first impressions and which are new to me.

### Prompt 3

<!-- prompt:8811ad17-810d-4005-b0c9-826404b9787b -->

> I'll review the audit and fill in My decision before we commit.

### Prompt 4

<!-- prompt:8d731ed8-d061-422a-8244-efcaa32619c0 -->

> Go through docs/01-system-audit.md and sort every row into two groups. Don't edit the file yet.
>
> Group A, safe defaults: rows where accepting the proposal is low-risk and consistent with CLAUDE.md and docs/00-my-read.md. Just give me the count and the row IDs.
>
> Group B, needs my decision: any row that
> - adds, removes, renames or retunes a token or component,
> - affects consent, cost display, money amounts, or red/attention colour use,
> - has more than one reasonable option,
> - would contradict CLAUDE.md or my read if accepted as written,
> - or is one of the open questions Q1–Q11.
>
> For each Group B item, give me a numbered question with lettered options (A, B, C…), each option in one line. Mark the audit's recommendation. Keep it to the 15 most important; merge related rows into one question where you can.
>
> I'll reply with short answers like "1A, 2B, 3C".

### Prompt 5

<!-- prompt:564b2017-f528-4bc3-8d40-505cba8d9177 -->

> 1A, 2A, 3B, 4A, 5A, 6A but remove accent DEFAULT (keep 100, documented as not for text), 7A, 8A, 9A, 10B, 11B, 12A, 13A, 14A.
>
> Notes:
> 1: the "no" option must be as clear as "yes"
> 3: principle 1 needs the full cost visible without scrolling
> 4: a disabled button doesn't explain itself; nothing has failed, so neutral
> 6: nothing uses DEFAULT; removing it makes a solid amber fill impossible
> 8: fix at the source; one value fixes every caption
> 11: cards need to stand apart on the accept screen; safe after 8A
> 13: tiers keep fees whole, so there's no rounding policy to invent

### Prompt 6

<!-- prompt:b70d40d5-da7a-442a-b05e-8db477307648 -->

> I'll read the filled-in decisions before we commit.

### Prompt 7

<!-- prompt:a6b66d70-8079-4d4a-965d-52a6027c819a -->

> Two decisions, then the next step.
>
> 1. 14A: white, black and transparent are allowed exceptions. The check fails on every other Tailwind default colour name. Record that exception and its reason in the audit row now. It goes into DESIGN_SYSTEM.md when the check is updated.
>
> 2. I'm asking you to edit docs/00-my-read.md, with exactly these two changes and nothing else:
> - In Assumptions, replace the reduced-payout line with: "A reduced payout always drops to a lower tier (e.g. 10,000 → 5,000), so the fee is always a whole number of rupees. It needs fresh consent to the new terms."
> - In principle 4, change the attention-colour wording to: "body text neutral-900 on accent-50; accent-600 only for the short status label".
> Show me the diff before saving.
>
> Then make two commits:
> - "System audit, triaged" (docs/01-system-audit.md)
> - "my-read v2.3: tier-drop assumption, attention wording" (docs/00-my-read.md)

### Prompt 8

<!-- prompt:bd328661-6de1-42d5-91a2-c534d5d65092 -->

> Diff approved. Save the two changes to 00-my-read.md and make both commits.

### Prompt 9

<!-- prompt:7c51ccd3-377c-4023-b44f-5ff41efeff00 -->

> Update docs/progress.md for this chat, including the Write-up inbox, then commit it.

### Prompt 10

<!-- prompt:a770db5a-8639-4d2f-92f0-e8e87e8a9f8b -->

> Copy src/novakit/ as it is now into src/review/novakit-v0/, unchanged, so I can show before/after later. Keep it out of the main barrel export. Commit.

### Prompt 11

<!-- prompt:5261223a-b7d7-4d80-a486-7e3731f988aa -->

> A: add two allow-list entries for the v0 copy, reason "Frozen starter copy for before/after. Never edited, never imported." Then run build and check, and commit.

### Prompt 12

<!-- prompt:ca38b774-0ece-481f-ba8f-8bb2d77e9a93 -->

> Propose a single module for all salary-advance logic, based on PRODUCT_REFERENCE.md and the assumptions in docs/00-my-read.md:
> - personas A and B,
> - tiers and the limit,
> - the fee on the amount paid out, a reduced payout, and totals,
> - the due date, and the collection time (payday at 6pm, once salary has landed),
> - the reasons for "not collected on payday",
> - days late (counted truthfully from the due date) and the default date (30+ days),
> - when the collection permission ends (repaid or the default date, whichever comes first).
> Show the API and the data shape first. No screens should ever compute money or dates themselves.

### Prompt 13

<!-- prompt:159c54f2-4281-4884-8b5a-66fa1e4b566a -->

> 1A, 2A, 3A, 4A, 5A, 6A, 7A with an addition, 8A, 9A, 10A.
>
> Notes:
> 2: only when salary lands. That's what the user agreed to; collecting from any incoming money drifts towards sweeping funds.
> 7: also show "Includes Rs 10,000 from your advance" under the real balance, so borrowed money stays distinguishable without a spend-order policy.
>
> Two additions before you write it:
> - acceptTerms must be idempotent: accepting the same terms twice returns the same advance, never a second one. Add that to the check.
> - Add getReminders(advance, today): the reminder on 25 Jul, the not-collected notice on the day, late reminders, and the pre-default notice on 20 Aug. At most 2 a week, sent at 10:00 (inside my 8am–10pm window), paused when a payroll delay is reported. Add these to the check too.
>
> Then write the module and the check, run build + check, and commit.

### Prompt 14

<!-- prompt:fddb0d7a-482f-4f14-8bd7-27bc3af04468 -->

> 1: confirmed. The not-collected notice goes at 6pm when the attempt fails.
> 2: confirmed as a placeholder cadence. I'll list it in my Assumptions.
> 3: change it. The pre-default notice is never paused, even after a payroll delay is reported, because a material consequence must always be announced. Whether a payroll delay should move the default date is a question for "want to know", not a rule.
> On the "Includes Rs 10,000" limit: show that line only on the home-after-accepting state. Everywhere else, the advance card says "Received Rs 10,000 on 7 Jul · Rs 10,300 to repay on 28 Jul". Modelling spending is "with more time".
> Add a check that the pre-default notice is never paused. Run build + check, commit.

### Prompt 15

<!-- prompt:10158f27-85c9-4559-b4be-433d8ed2e6af -->

> I'm asking you to edit docs/00-my-read.md with exactly these changes and nothing else. Show me the diff before saving.
>
> 1. Principle 5: change "attempted once each time new money lands" to "attempted once each time salary lands".
>
> 2. Assumptions: add these lines (merge with an existing line where it says the same thing, don't duplicate):
> - Wallet balance is Rs 4,250 for both personas (taken from the starter screen).
> - Collection is attempted only when salary lands, never from other incoming money.
> - A reduced payout can't go below Rs 5,000, the lowest tier. That case isn't designed.
> - Reminder before the due date: 25 Jul at 10:00. The not-collected notice: 6pm on the day the attempt fails.
> - Late reminders every 7 days (4, 11, 18 and 25 Aug). This cadence is a placeholder.
> - Notice before default: 20 Aug, never paused, even after a payroll delay is reported. Default happens on day 30 (27 Aug).
>
> 3. What I'd want to know: add
> - What happens if a reduced payout is needed from the lowest tier?
> - Should a reported payroll delay move the default date?
>
> 4. With more time (in Scope): add "Modelling spending, so the balance always shows how much of it is borrowed."
>
> Then commit as "my-read v2.4: 3.2 decisions".

### Prompt 16

<!-- prompt:c64ae404-f862-43fc-8a69-67df724a6891 -->

> Diff approved. Save and commit as "my-read v2.4: 3.2 decisions".

### Prompt 17

<!-- prompt:321735a0-e9e2-4ba6-ab69-6287df0e76f7 -->

> Not yet, keep going.

### Prompt 18

<!-- prompt:719b8dd8-68cc-438e-a80d-f6a6a93a5efb -->

> Apply the token decisions in docs/01-system-audit.md, and only those:
> - neutral-500 → #6B6B6B, success → #15803D (decision 8A)
> - add danger #B42318 and danger-50 #FEF3F2 (7A)
> - rename the accent ramp to attention, remove the DEFAULT value, keep 100 documented as not for text (6A); update the README example
> - move the font stack into fontFamily.sans, and point the root text colour at neutral-900 (14A)
> - extend npm run check: fail on every Tailwind default colour name except white, black and transparent (14A)
> For each colour change, report before and after contrast. Add an entry to DESIGN_SYSTEM.md for each: what changed, why (one line), and which file. Run build + check. Commit.

### Prompt 19

<!-- prompt:d547bff9-c395-4ee2-8b9c-b054f86741f9 -->

> Component: Choice (new). Decisions 2A, 6.7, 6.9 in docs/01-system-audit.md.
> Create src/novakit/Choice.jsx: one component for both checkbox and radio.
> - Props: type ("checkbox" | "radio"), name, value, checked, onChange, label, description, disabled, disabledReason, id, plus forwarded props.
> - A native <input> inside a <label>. Controlled only: it never defaults to checked.
> - 24px control using accent-brand. The whole row is at least 44px tall and the whole row is tappable.
> - Label in text-body neutral-900. Description in text-caption neutral-700, linked with aria-describedby.
> - Disabled: the input is disabled, but the label stays readable (neutral-700, never greyed out), and disabledReason shows as visible text linked with aria-describedby.
> - focus-visible ring in brand.
> - Radio groups: document that the caller wraps them in a fieldset with a legend. Don't build a group component.
> Export it from index.js. Add a DESIGN_SYSTEM.md entry: added, why (one line), file. Run build + check. Commit "Add Choice (checkbox + radio)". Stop.

### Prompt 20

<!-- prompt:f807eb95-0924-4dab-ace9-9d0fccd54d66 -->

> Component: Button. Decisions 1A, 6.3, 6.5, 6.6, 6.17 in docs/01-system-audit.md.
> - Add an optional subLabel on a second line: text-caption, brand-100 on primary (5.10:1), neutral-700 on secondary.
> - Replace the fixed heights (h-11/h-14) with min-h-11/min-h-14, so two lines fit. Existing single-line buttons must look the same as now.
> - Add loading: disabled, aria-busy, and an optional loadingLabel that replaces the label. The button keeps its height while loading.
> - Secondary text becomes neutral-900. The border stays neutral-300.
> - Add a focus-visible ring in brand, with an offset.
> - Forward other props (aria-*, id, form).
> - Don't change the width behaviour.
> Keep the API backwards-compatible: App.jsx's existing Button must render the same. Add a DESIGN_SYSTEM.md entry for each change: what changed, why, file. Run build + check. Commit "Button: second line, min height, loading, readable secondary, focus ring". Stop.

### Prompt 21

<!-- prompt:543e8554-7528-479b-adaa-34b95ea2e62f -->

> Component: AmountText. Decisions 5A, C2, 6.1, 6.4, 6.18 and the 3.2 formatAmount decision.
> - Export formatAmount(amount, { sign }) from AmountText.jsx as the single money formatter. It returns "Rs 10,300" with a non-breaking space between "Rs" and the number, or null for null / undefined / NaN. It never returns "Rs 0" for missing data.
> - AmountText uses formatAmount. When the amount is missing it renders nothing (and warns in development); the screen decides what to say.
> - Remove the forced text-neutral-900 so the colour is inherited.
> - Add a caption size alongside display / title / body.
> - Optional sign: "+" or "−" (a real minus sign, not a hyphen) for money in and out.
> - Add tabular-nums.
> - No rounding here; the module guarantees whole rupees.
> Keep existing usages working. DESIGN_SYSTEM.md entries. Run build + check. Commit "AmountText: no Rs 0, inherit colour, caption, sign, single formatter". Stop.

### Prompt 22

<!-- prompt:6dcded89-3c69-4de0-b741-f0ae5bc43d0c -->

> Component: Card. Decisions 7A, 10B, 6.10, 6.13 in docs/01-system-audit.md.
> - Border: replace the hardcoded #E6E6E6 with neutral-200.
> - Add tone: "default" | "attention" | "danger".
>   - attention: attention-50 background, text inherits neutral-900, no icons.
>   - danger: danger-50 background, text inherits neutral-900, no icons.
>   - Pick a border for each tone from existing tokens only, and tell me which and why.
> - Forward other props (role, aria-live, id), so a screen can add role="alert" to a failure card. Card doesn't add a role by itself; document that.
> - Default tone looks exactly as it does now, apart from the border token.
> DESIGN_SYSTEM.md entries, including the rule: attention is for a person's status, danger only for a failed event. Run build + check. Commit "Card: token border, attention and danger tones, forwarded props". Stop.

### Prompt 23

<!-- prompt:4e3d114e-894a-4e41-ab78-e192a024b720 -->

> Component: ListRow. Decisions 10B, 6.12 in docs/01-system-audit.md.
> - Divider: replace the hardcoded #DADADA with neutral-300.
> - Add wrap (default false): when true, title and subtitle wrap instead of truncating.
> - The icon slot is aria-hidden.
> - Forward other props.
> - No danger tone (Card covers that, decision S11). No change to semantics (flagged, not fixed).
> Existing usages must render the same. DESIGN_SYSTEM.md entries. Run build + check. Commit "ListRow: token divider, wrap, hidden icon". Stop.

### Prompt 24

<!-- prompt:cc13be5f-5847-4014-b763-b926a7bb646a -->

> Component: AppBar. Decision 10B in docs/01-system-audit.md.
> - Back button target 44px (h-11 w-11), with a focus-visible ring in brand.
> - The "‹" glyph is aria-hidden. Keep aria-label="Back". No icon library.
> - No other changes.
> DESIGN_SYSTEM.md entry. Run build + check. Commit "AppBar: 44px back target, focus ring". Stop.

### Prompt 25

<!-- prompt:9fbd56d4-5569-4e95-845f-d8a527762171 -->

> “‹” glyph is very small at the inherited text size, so it’s easy to miss visually even though the target is now big. Making it larger, for example with text-title, would be a one-line change if you want it. Make it larger
>
>
> Component: Panel. Decision 10B (Q11) in docs/01-system-audit.md.
> Make Panel an alias of Card (the same component, same props), so anything importing Panel keeps working and the duplicate goes away. Keep the export in index.js. Add a DESIGN_SYSTEM.md entry: "Panel: deprecated alias of Card, because it duplicated Card apart from its border." Run build + check. Commit "Panel: alias of Card". Stop.

### Prompt 26

<!-- prompt:df44f16a-13bf-402d-92dc-7d6145608d6a -->

> Change the phone frame to a fixed 390×844, with main scrolling inside it and a sticky action area at the bottom. Screen background neutral-50. Keep the frame's arbitrary values in the check's allow-list, and nothing else. Leave room outside the frame for reviewer controls later (src/review/). Run build + check. Commit.

### Prompt 27

<!-- prompt:9db4923f-f60a-4fda-a739-338330de1ac5 -->

> Yes: hide the scrollbar inside the frame's main with a small CSS rule in index.css (no allow-list change). Run build + check, commit.

### Prompt 28

<!-- prompt:0f87c17b-77e7-4c96-aac9-da1bc9a81804 -->

> Update docs/progress.md: what's done, decisions made and why, open questions, next step. Append anything new from this chat to the Write-up inbox (Assumptions / What I'd want to know / System flags). Don't rewrite earlier entries. Then commit with a message that gives the reason, not just the change.
>
> Export the transcript to docs/ai-log/raw/kit-audit&component-updates

### Prompt 29

<!-- prompt:aab4cc57-c773-4c69-b5d5-06f2a5acc40d -->

> Yes: convert the export into a readable Markdown transcript like the other raw logs, with the brief's text removed, and show me before committing.

### Prompt 30

<!-- prompt:9141c9c1-d31d-44d6-9786-f419475008f9 -->

> Commit the Markdown transcript only, with the reason in the message. Leave the unpacked export folder uncommitted.
