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

## Session 5

<!-- session:4f5dd7c0-5bff-45da-9d31-8bca7513c091 -->

### Prompt 1

<!-- prompt:b63ffcc4-8460-4138-8208-f15acd18d022 -->

> Read CLAUDE.md and docs/progress.md. Terms + Accept  graded moments a and B. My intent: Want to work on the actual screens. Do not update anything I am just talking about what we'll do in this chat. Do not update or audit or research anything

### Prompt 2

<!-- prompt:72d40380-cd44-4065-ab24-6c5da739c1e5 -->

> Moment: choose an amount. Persona A, today 7 Jul.
> Who: a salaried person, Rs 4,250 in their wallet, three weeks from payday, deciding whether and how much to borrow.
> What they must understand before choosing: each amount's fee in rupees, what they'll repay in total, and that it's due on 28 Jul at 6pm. Also, that Rs 15,000 is above their limit, and why.
> What they can do next: choose an amount and continue, or leave without borrowing.
> Principles: 1 (the number you tap is the number you owe), 3 (smaller is never harder).
> Rules: data from getOffer(persona, today). Tiers as Choice radios inside a fieldset with a legend, in ascending order, nothing pre-selected, equal visual weight. The blocked tier stays visible with its reason in neutral-700, never greyed out. Amounts via AmountText/formatAmount, dates via formatDate. The continue button stays enabled; if nothing is chosen, a neutral inline message, not red. A clear way out (secondary button or back).
> Propose the layout and exact copy from top to bottom, including the AppBar title, button labels and the over-limit reason. Mark any copy that states a policy (e.g. how the limit is set) as a placeholder. No code.

### Prompt 3

<!-- prompt:3ee8306c-2c18-4e6a-9b52-26cd42dad1cf -->

> Edits:
> 1. Cut the placeholder about how the limit is set. "How you use NovaPay" is invented policy, and it hints that activity earns a bigger limit, which is close to a pattern on my predatory list. The reason is just "Above your limit of Rs 10,000." I'll add "How is the limit set?" to What I'd want to know.
> 2. "we collect it" → "we collect the full amount".
> 3. [optional: "You repay it all on 28 Jul, your next payday (in 21 days)."]
>
> Decisions: 1 leave the balance off. 2 add collection_time to getOffer's output and update the check. 3 keep the native disabled radio; the label and reason stay neutral-700 and are linked with aria-describedby. 4 keep "Nothing is borrowed yet". 5 redirect B to home.
>
> Implement this version. Wire every visible control, no dead buttons. Run build + check.

### Prompt 4

<!-- prompt:4dd608c7-17ae-4c1b-9234-a9f49f464ad7 -->

> Critique this screen three ways: (1) as a regulator looking for misleading disclosure, (2) as a first-time borrower with low financial literacy reading it on a small Android phone, (3) as a screen-reader user. Only list problems; don't fix them.
>
> this is for the choose an amount

### Prompt 5

<!-- prompt:e4441bd5-6586-40b2-b5ed-a4b8215653a6 -->

> R2	Say what it is: add “A salary advance is a short-term loan.” to the card.
> R3, R4	Say the amount can change: “We’ll confirm the final amount before you accept. It may be lower than you choose.”
> R5	Don’t state collection as already agreed: “If you accept, we take the full amount from your NovaPay wallet automatically…”
> R10	Home card: “See your offer” → “See amounts and costs” (S1 is in scope as a thin state, and it’s a one-line fix).
> B1 ★	Turn the hierarchy right way up: “You repay Rs 10,300 on 28 Jul” in body text, semibold, neutral-900. The fee becomes the secondary line. This is principle 1.
> B2	Shorten the card to two short lines (repay date and time, fee once). The full detail moves to S4. Test at 360×640.
> B5, B6	Plainer words: “salary has landed” → “salary arrives”; “collect” → “take from your NovaPay wallet automatically”.
> B7	No middle dot: “Fee Rs 150. You repay Rs 5,150 on 28 Jul.”
> B9	Move the inline message next to the primary button (as well as, or instead of, under the legend), so it’s always visible when the button is tapped.
> SR1	When the screen changes, move focus to its heading and set the page title (“Choose an amount: NovaPay”). Do this once at shell level so every screen gets it.
> SR2	Make the blocked tier reachable: aria-disabled instead of disabled in Choice, so it’s focusable, announces its reason, and can’t be selected. It’s a Choice change, so log it.
> SR3	Re-announce the message every time: clear it, then set it again. Focus moves to the fieldset, not the first radio.
> SR4, SR5	Put the question in a heading inside the legend, and put the “up to Rs 10,000” hint inside the legend too.
> SR7, SR8 ★	Check the accessible names first. The radios must read “Rs 5,000…”, and the button must read “Review terms. Nothing is borrowed yet.” Fix them if they don’t.
> SR10	AppBar back: aria-label="Back to home".
>
> R6 (what if salary doesn’t land)	S4 is the commitment point and covers it. Putting it here makes S3 longer, which the critique’s own B2 says is already a problem.
> R7 (blocked Rs 15,000 as an anchor)	Showing the limit honestly is the over-limit moment the brief asks for. There’s no “unlock” language, and it sits last, in ascending order. Hiding it would be less transparent.
> R8 (“Nothing is borrowed yet”)	It’s true, and it sits on “Review terms”, not on the commit button. Saying what hasn’t happened yet lowers pressure; it doesn’t lower scrutiny.
> SR6 (terms outside the form)	Reading order reaches the card before the choices. Moving the card into the form wouldn’t help anyone.
>
> Triage of the S3 critique.
> Fix: R2, R3/R4, R5, R10, B1, B2, B5/B6, B7, B9, SR1 (at shell level, for every screen), SR2 (Choice: aria-disabled, logged in DESIGN_SYSTEM.md), SR3, SR4/SR5, SR10. [R1: add the module's annual_rate_equivalent and one comparison line, or leave it out: my call.]
> Check first, before anything else: SR7 and SR8. Show me the accessible names of the radios and both buttons as the accessibility tree reports them.
> Reject: R6, R7, R8, SR6. Reasons: [paste from my notes]. Add them to the Pushback list in progress.md.
> Defer: R9 (want to know; a placeholder lender line on S4), B3 (200% test later), B10, SR9.
> Propose the revised copy and layout first. No code until I approve.

## Session 6

<!-- session:22245457-e601-4c7c-b6e1-a45772035ca9 -->

### Prompt 1

<!-- prompt:5fb84744-a40f-4972-844c-9782ffeaf88f -->

> Leave urdu for now make this english only.
>
> 1. Choose an amount here.
> 2. style it inside the description.
> 3. B4, Keep the 3% in S3. B8, when you click on RS 15,000 it should give you a toast message in inherent sytle something like "Can not choose due to being above you limit" use better sentence than that

### Prompt 2

<!-- prompt:374b6113-3a77-4076-94f8-2b70e36dd1bc -->

> Propose a shorter How it works card so the tiers start above the fold at 360x640. Copy only, no code yet.

### Prompt 3

<!-- prompt:df49de23-7649-4904-a851-3cc6611b9a74 -->

> Build option A: no heading, "A short-term loan with a 3% fee, charged once. If you accept, we take the full amount from your NovaPay wallet automatically at 6pm on 28 Jul, once your salary arrives."

### Prompt 4

<!-- prompt:fa0803c5-c276-48e8-ac49-6147a69744d0 -->

> Moment: terms + accept for the chosen amount (Rs 10,000). Persona A, today 7 Jul.
> Who: the same person, about to commit to borrowing.
> What they must understand before accepting:
> - what they get (Rs 10,000), the fee (Rs 300), the total (Rs 10,300), and when (28 Jul at 6pm, from their NovaPay wallet, once salary lands),
> - what happens if it isn't collected, in one line,
> - that they're giving a separate permission to collect, and when that permission ends (when repaid, or 27 Aug at the latest).
> What they can do next: accept, change the amount, or leave.
> Principles: 1 (cost visible without scrolling inside the 390×844 frame), 5 (their wallet stays theirs).
> Rules:
> - Data from getTerms(persona, 10000, today).
> - The cost summary is at the top, using ListRow with wrap.
> - "What if it isn't collected": one line, then a native <details> with the rest. Default consequences are labelled as placeholder copy.
> - The collection permission is a Choice checkbox, unticked, with its wording and end date.
> - Accept button: label "Accept Rs 10,000", second line "Repay Rs 10,300 on 28 Jul". It stays enabled; if tapped without the permission ticked, a neutral inline message at the checkbox and focus moves to it.
> - The way out is the secondary button, which must look clearly available.
> - Never say "no interest". Show the fee in rupees, and decide with me whether to show the annualised rate (~52%) as a comparison.
> Propose the layout and exact copy from top to bottom, including the permission wording, the <details> content, the inline message, and what sits in the sticky action area. No code.

### Prompt 5

<!-- prompt:a33d9800-aaa0-461f-bf2d-91b371011de5 -->

> 1. There is no annual rate it is a fixed 3% on the amount a user borrows. 
> 2. Get rid of this "Placeholder: “Whether a late fee applies is being confirmed.”" and "Placeholder: “Other consequences of default are being confirmed.”"
> 3. Use paid into you novapay wallet
> 4. Yes change it in s3 to make more sense 
> 5. yes
> 6. Yes

### Prompt 6

<!-- prompt:6f9f8687-d042-483c-b682-2ff248a76918 -->

> Remove the (Placeholder) label from the default line, then update progress.md for this chat.

### Prompt 7

<!-- prompt:c4b5938f-bf14-4dd2-a2c7-2645e68cbc3c -->

> I think there is a statement in my read that needs to be updated, the 3% of the fixed fee per advance is fixed and only charged once and is not something charged annually.  Update that in my read. 
>
> Regarding the screen, This looks very busy right now. The checkbox should have only this text or similar text "I have read the terms stated above and accept" 
>
> The consequences should show up in the bottom drawer. Do not commit anything until I am satisfied with the design and say "Commit now"

### Prompt 8

<!-- prompt:fb8f626a-57ef-495d-9b6b-2f32b09810c1 -->

> When check box isnt selected and button is pressed the message should show in the bottom sticky part because it isn't readable otherwise. The checkbox reads, "I allow NoyaPay to take the repayment above automatically." "This ends automatically when it's repaid, or on Aug 27 at the latest"

### Prompt 9

<!-- prompt:94c23dae-fff0-410e-a00b-2d390dc03d8c -->

> Run an agent to check re-verify the work we did on s4 and see if there are any inconsistencies according to all the context we have

### Prompt 10

<!-- prompt:06ba530b-4898-493f-bc5a-b38cd8fa71db -->

> Fix items 1 to 6, using your suggested retry wording. Don't commit.

### Prompt 11

<!-- prompt:ec9f832d-5217-426b-89ef-ed255a9025ff -->

> Update the progress.md with the latest context, update the audit as well. 
>
> 7. leave as is
> 8. LEave it as is
> 9. Leave the placeholders out and update the assumptions and audit S4 and S13 rows
> 10. Make them large buttons and leave the destination names as is

### Prompt 12

<!-- prompt:65b56495-f900-49fc-9e25-0696101716de -->

> Commit now

### Prompt 13

<!-- prompt:a496b9c8-0305-479e-8cda-6d578e536cdd -->

> S4 the button should say "Accept Rs 10,000" no secondary line
>
> This is a case where I think secondary line is not necessary and the primary text is more than enough to translate the complete message

### Prompt 14

<!-- prompt:2af00644-0d1c-4b3c-bb00-997e94ecba2d -->

> Leave the docs for now. Don't commit yet.

### Prompt 15

<!-- prompt:cbd3c4cf-57c1-467c-b437-22cff957e7da -->

> Update the docs with this. Exceptional cases are allowed if the rest of the screen is giving more than enoguh context so that the secondary text in the button becomes obselete

### Prompt 16

<!-- prompt:150e11e0-c6eb-450c-be6a-dc57cbd7413a -->

> Moment: what happens after "Accept" is tapped. Three states.
> 1. Processing: the button shows loading with a label saying what's happening; back is hidden; a second tap does nothing (acceptTerms is idempotent).
> 2. Network failure: a Card with tone="danger" and role="alert", saying nothing was sent or charged, with a retry. Never a Toast. Red only on this failure message, not on the person.
> 3. Reduced payout: a full screen (not a sheet). They asked for Rs 10,000; we can offer Rs 5,000. Show old and new side by side (amount, fee, total, date) from reducePayout(terms), say plainly that nothing has been sent or charged, then a fresh unticked permission and a fresh accept, or "No thanks".
> Who: someone who just committed and is now unsure whether it worked.
> What they must understand: whether anything happened to their money, and what to do next.
> Principles: 1, 5.
> Propose the layout and exact copy for all three, top to bottom, including the loading label, the failure wording and the reduced-payout comparison. No code.

### Prompt 17

<!-- prompt:c3a1b8a2-85fe-40f7-914a-fb241337d05d -->

> 1. add it now
> 2. network failure always returns an error
> 3. Take the new repayment
> 4. include it

### Prompt 18

<!-- prompt:c6db3c27-38c4-4f8d-9cac-6f15f40c359b -->

> Reverify your work against the our documents and context, find any inconsistencies and report

### Prompt 19

<!-- prompt:028e20eb-3306-4496-80f3-8705dd84bf69 -->

> 6. no keep as is
> 7. rebuild with list rows
> 8. Leave as is
> 9. Add it
>
>
> The mobile needs to be at the center of the screen the reviewer controls can live on the side

### Prompt 20

<!-- prompt:5eb8b0ba-12f0-4c0b-a35d-16562b22b11e -->

> Update the outdated documents

### Prompt 21

<!-- prompt:be04938e-a4d4-4236-bbdd-4ddc483806f2 -->

> Commit now

### Prompt 22

<!-- prompt:cacdc967-0072-4176-841e-85d1242a9711 -->

> Moment: the receipt right after a successful accept.
> Who: someone who has just borrowed and needs to know it worked and what they agreed to.
> What they must understand: Rs 10,000 is in their wallet; they repay Rs 10,300 on 28 Jul at 6pm from their NovaPay wallet once salary lands; the collection permission they gave and when it ends; and where their record of this is kept (placeholder copy, since that's an open question).
> What they can do next: Done, which goes home.
> Principles: 1 (the receipt matches the accept screen exactly), 5.
> Rules: data from the advance returned by acceptTerms. Show something the accept screen didn't: the permission's end date and where the record lives. No confetti or celebration. Success colour only if it's genuinely needed; prefer neutral and brand.
> Propose the layout and exact copy, top to bottom. No code.

### Prompt 23

<!-- prompt:986723d1-048e-4bcb-b5f4-fb89aacf7948 -->

> 1. yes add that in 
> 2. Those are assumptions
> 3. Yes add that in 
> 4. Wait for the next S9 where we tackle this
> 5. We'll deal with this in the S9

### Prompt 24

<!-- prompt:132ffb04-30df-42c1-bd44-43e257ea862f -->

> Let's work on this screen a bit more, I want this to have a feeling of success that the user has completed what they were trying to do. So for this reason, the 10,000 the user has gotten should be center stage. 
>
> your advance tells the user again what they have gotten which is repeating something they know not necessary. Your permission is something we can get rid of 
>
> /better-layout use for this page only, use the components in the kit.

### Prompt 25

<!-- prompt:9bc464d1-a986-415a-bf01-332de1b9cc82 -->

> Commit now

### Prompt 26

<!-- prompt:e7ee9222-737b-40c9-9151-5c674595e2f1 -->

> Moment: home right after accepting. A thin state, just enough to make principle 5 testable.
> Who: the same person, back on the home screen.
> What they must understand: their wallet balance (Rs 14,250) includes Rs 10,000 from the advance, and they owe Rs 10,300 on 28 Jul.
> What they can do next: see the advance's details (the receipt), or carry on using the wallet.
> Principle: 5 (borrowed money is never mistaken for their own).
> Rules: data from getWallet and getStatus. The balance with the line "Includes Rs 10,000 from your advance" (only in this state). A separate advance card: "Rs 10,300 to repay on 28 Jul". Recent activity shows "Advance received +Rs 10,000" with direction in words and a sign. The starter's home card no longer says "See your offer".
> Propose the layout and exact copy. No code.

### Prompt 27

<!-- prompt:0adf11b8-44fc-4b57-a25f-c3646aff0d7d -->

> 1. update it accordingly the receipt is not a confirmation screen it should give user detail regarding what their advance terms were unlike s8.
> 2. Yes use that line
> 3. No follow the current design.
> 4. keep today
> 5. Yes

### Prompt 28

<!-- prompt:510a87e5-633c-4cae-a9a4-55446c75767c -->

> I get your point regarding the +/- in the recent activity, add those to all rows. 
>
> Reverify your work and see if there are any inconsistencies in the design according to the context

### Prompt 29

<!-- prompt:1235c35f-4e1e-4453-892e-da627279e75f -->

> 1. Add this as an assumption
> 2. Go with the suggested line
> 3. reword the read and the audit
>
>
> make the rest of the fixes and update the docs

### Prompt 30

<!-- prompt:c2928225-77d9-40ee-8ef2-5d90968dc797 -->

> Commit now

### Prompt 31

<!-- prompt:f510c59f-6475-4119-b980-f0f94cd20f3a -->

> Update docs/progress.md: what's done, decisions made and why, open questions, next step. Append anything new from this chat to the Write-up inbox (Assumptions / What I'd want to know / System flags). Don't rewrite earlier entries. Then commit with a message that gives the reason, not just the change.
>
> Export the transcript of this chat to docs/ai-log/raw/Screens-Relevant-(a)-(b)

### Prompt 32

<!-- prompt:b8278686-d7de-427d-b016-5228c6c36e57 -->

> Commit the transcript export and the prompt log, with a message that gives the reason.

## Session 7

<!-- session:17b7475c-897d-4f6e-8852-79b9a075a9c6 -->

### Prompt 1

<!-- prompt:c6f5e511-01cf-4e62-80af-6d0a6c652044 -->

> Read CLAUDE.md and docs/progress.md. In this session we'll focus on Screens for different scenarios on how to handle bad news. Do not update anything this is just to give you a idea of what this session is for and perp this session accordingly. Do not do any reseach or thinking or work yet

### Prompt 2

<!-- prompt:885c0ff3-9f7d-48eb-8a26-ba12c20d29af -->

> Before any late-path screen, I need to decide how Home behaves on later dates. Give me options with a recommendation for each, as lettered choices. No code.
> 1. The wallet balance on 25 Jul, 28 Jul, 2 Aug and 20 Aug. Today it says "Not available yet". Should the module expose a scenario balance (the scenario inputs already have 1,800 / 9,600 / 6,500), or stay unknown?
> 2. Recent activity on later dates. Today it's hard-coded ("Today, 2:14pm", "28 Jun"). How should rows follow the date, including whether salary arrived on 28 Jul?
> 3. Home's entry copy for persona A, which still says "You may qualify for a NovaPay salary advance." Persona A does qualify and the limit is known.

### Prompt 3

<!-- prompt:753d7955-5fba-4553-b1f2-7773982f6025 -->

> Take the recommendations: 1B, 2A with 2i, 3B with 3i. Ask me for the 25 Jul balance and the spending rows for balance dropped before planning.

### Prompt 4

<!-- prompt:9df76791-5f96-4ce7-b9c1-293c729a4edb -->

> Go ahead with the plan as written, dates only on activity rows.
>
> Build a basic reviewer control beside the frame, in src/review/, next to "after Accept". It sets data, not screens, all from the module's scenario():
> - the date: 7 Jul (S1/S9), 25 Jul (S10), 28 Jul (S11), 2 Aug (S12), 20 Aug (S13),
> - the not-collected cause (the 4 reasons, only relevant from 28 Jul),
> - payroll delay reported (on/off, from 2 Aug),
> - persona A or B.
> App passes persona and today through; no screen computes dates. URLs, notes and the narrow-screen drawer come in Chat 6. Plan first.

### Prompt 5

<!-- prompt:992aa2ad-f476-44d8-aae9-4eb080f8c623 -->

> Build it with C1a, C2a, C3a, C4a, C5a, C6a, C7a.

### Prompt 6

<!-- prompt:ea2fa39f-f79c-4b73-9546-6c11a3ecb330 -->

> I think the reviewer control right now is very hectic and confusing for the reviewer, since this is not part of the application we can use some newer components to make this more better structured and understandable /better-layout use for this reviewer section only

### Prompt 7

<!-- prompt:810fb5f5-6033-4e17-8ab0-721c921b9bc1 -->

> Build it with L1, L2 and L3 as recommended.

### Prompt 8

<!-- prompt:f9d0b3f0-9076-43db-a90e-1bf1b8d2f902 -->

> Get rid of the why it wasn't collected option, it does not add that much value and has a lot of impact on the screen. Increase it's width by 20% as well.
>
> Your Assumptions are missing three lines about the 25 Jul balance, the sample rows and the 2 Aug delay. I didn’t edit 00-my-read.md; the lines are in progress.md → Write-up inbox for you to add. add these to my read

### Prompt 9

<!-- prompt:b0fc35e6-ecc8-47a6-ab4e-2efad9dfe80b -->

> Keep it at w-80. The narrow-screen drawer in chat 6 will handle small windows.

### Prompt 10

<!-- prompt:a650ba9f-8dce-4259-a972-58d51223f2c2 -->

> Moment: S10, 25 Jul, 3 days before payday. Persona A, viewed through the scenario control.
> Who: someone on track, with Rs 600 in their wallet, whose advance is due in 3 days.
> What they must understand: exactly when and from where Rs 10,300 is taken (28 Jul at 6pm, from their NovaPay wallet, once their salary arrives), and what helps it go smoothly (their salary still being paid into NovaPay).
> What we can honestly say and what we can't: we can state the date, time, amount and source. We can't promise the salary will arrive, and we can't hint at consequences in a reminder that's about being on track.
> Next step that actually works: nothing is required. No "pay early" button, because early repayment is "with more time" and every visible control must work.
> Principles: 1 (the amount and date match what they agreed), 4 (calm; this is a reminder, not a warning).
> Build: Home's advance card in its "due in 3 days" form (from getStatus), and the details view if anything changes there. The in-app reminder can show the amount; the lock-screen preview comes later in 5.4.
> Plan question: does the late information live in the existing advance details view, or on a new screen? Recommend one.
> Data from getStatus, getReminders, getWallet and getActivity. No screen computes money or dates.
> Propose layout + exact copy, top to bottom. No code.
>
>  use /better-layout but keep the kit in mind and don't stray from it. the skill should work with the kit and not invent anything new

### Prompt 11

<!-- prompt:3ff498b2-b912-4c09-b462-2158f66c2ba9 -->

> Build S10 as proposed, balance stays Rs 1,800, and the late information goes at the top of the existing details view.

### Prompt 12

<!-- prompt:e1f22f73-3272-44e7-bae2-3ffe47a4be7e -->

> Reverify your work against context and flag any inconsistencies

### Prompt 13

<!-- prompt:d3446f79-1d89-4d12-87f8-caebf7d785e7 -->

> Fix 5 (move the reminder rule into the module with a check), the stale docs 7 to 9, and record 11 to 13 in progress.md. I'll decide 2, 3, 4, 6 and 10 myself.

### Prompt 14

<!-- prompt:32596546-b781-431f-b49f-a0bbfdb3324b -->

> 2. leave as is
> 3. update the scope
> 4. reword
> 5. -
> 6. use the same wording 
>
> 10. update the stale statement

### Prompt 15

<!-- prompt:38b3054c-92bb-45d8-a8ef-73c2188b1bd6 -->

> Moment: S11, 28 Jul after 6pm. The collection attempt didn't go through. Persona A, viewed through the scenario control, for each of the 4 causes.
> Who: someone whose payday didn't go as planned, possibly through no fault of their own.
> What they must understand:
> - what happened, in plain words for the cause (salary hasn't arrived / arrived short of Rs 10,300 / the balance was below Rs 10,300 at 6pm / salary now goes to a bank account),
> - that nothing partial was taken and no fee was added,
> - when we'll try again (only when salary arrives in NovaPay; for "moved to a bank", say plainly that automatic collection can't happen),
> - that the amount owed is unchanged: Rs 10,300.
> What we can honestly say and what we can't: we know the cause and the date. We don't know why their salary is late, so never guess or blame.
> Next steps that actually work: "My payroll is delayed" (reportPayrollDelay: pauses the weekly reminders, never the pre-default notice); pay now / pay part (clearly labelled stubs, like S3's placeholder pattern).
> Principles: 4 (red only on the failed-event message, Card tone="danger"; the person's status is calm), 5 (no partial sweep).
> Build: Home's advance card in its "not collected" form, and the details view's status section. No failed-collection row in recent activity (decision 2i).
> Data from collectionOutcome (the cause comes from the module), getStatus, getReminders, getWallet and getActivity.
> Propose layout + exact copy, top to bottom, with the 4 cause lines side by side. No code.
>
>  Use 
> /better-layout
>  but keep the kit in mind and don't stray from it. the skill should work with the kit and not invent anything new

### Prompt 16

<!-- prompt:e9f91a6b-766e-4bd9-8283-0ea376e1e880 -->

> Verify this against our context and see if this works before building

### Prompt 17

<!-- prompt:45366265-3ae3-4522-9430-066ccf9ffdd3 -->

> My call is drop what does not align with our assumptions and other details and show me structure before we build and are there still any inconsistencies left and does S11 still have its meaning

### Prompt 18

<!-- prompt:c8a4b03b-ef80-41b0-a1dc-49ce476ff089 -->

> Inconsistencies 
>
> 1. nothing required, it's automatic can count as a next step.
>
>
> Build it

### Prompt 19

<!-- prompt:cdcb1b89-94db-4c24-88fc-0c26b16138f9 -->

> make the alert message dismissable it should only show up when the user opens the app again

### Prompt 20

<!-- prompt:189a25df-e598-4f48-bc94-90a9d4454087 -->

> Build as planned and also check this tone against our context: "We'll take it automatically when your salary arrives in NovaPay, as long as that's before 27 Aug." can we come up with something nicer?

### Prompt 21

<!-- prompt:7ad0f44a-7f0b-46b0-bc3e-8f93225cd3b3 -->

> Use option A: "When your salary arrives in NovaPay, we'll take it automatically, so there's nothing you need to do. The permission you gave us ends on 27 Aug."

### Prompt 22

<!-- prompt:8ede6b25-e55e-4eba-98fc-dc470f635fd8 -->

> Moment: S12, 2 Aug, 5 days after the due date. Persona A, cause carried forward from 28 Jul (salary didn't arrive), viewed through the scenario control. Two variants: payroll delay not reported, and reported (the reviewer checkbox; my Assumption says it's reported on 2 Aug).
>
> First, an alignment pass. Before proposing anything, check this brief against my Assumptions, Scope, the audit and CLAUDE.md. Drop anything that doesn't line up, and give me a "What I dropped, and why / What remains" table, like you did for S11.
>
> Keep S11's settled structure, and change only what 2 Aug changes:
> - Home: balance first (getWallet) → the advance card in the ATTENTION tone (Card tone="attention": body text neutral-900 on attention-50, attention-600 only for a short status label such as "5 days late", no icons) → recent activity (getActivity, no failed row). No danger card on 2 Aug: the failed attempt was an event on 28 Jul, so red doesn't follow the person for days. The status card can mention it in plain text ("We couldn't take it on 28 Jul because your salary hadn't arrived."). See details, as before. No action area on Home.
> - Details view: the attention status card with: Rs 10,300 still to repay, unchanged and no fee added; days late counted from 28 Jul (from getStatus); what happens on 27 Aug, using only my Assumptions' default consequences as stated (new advances paused, automatic collection stops) plus "your wallet keeps working"; that we'll still take it automatically if salary arrives by 27 Aug; when the next reminder comes (from getReminders); the late-sheet link. Then "What you agreed" and "Your permission", unchanged.
> - Action area on the details view: "My salary is late" (reportPayrollDelay) only in the not-reported variant, and the same stub, "Pay some or all yourself", going to the existing placeholder screen.
> - After reporting: no Toast. A short confirmation inside the status card (role="status"): reminders are paused, and the notice on 20 Aug will still be sent. The button disappears. Both facts come from getReminders.
>
> Words to avoid: "overdue", "missed", "failed to pay", and anything about the person rather than the payment.
> Data only from getWallet, getStatus, getReminders and getActivity. No screen computes money or dates.
>
> Give me the structure for Home and the details view, both variants, in the same layout as S11 (the element, the copy, and where each value comes from). Then a "Still inconsistent" table with a severity for each item, and a short "Does S12 still mean what it should?". No code. Measure both screens at 390×844 and 360×640 before building.
>
>  use /better-layout but keep the kit in mind and don't stray from it. the skill should work with the kit and not invent anything new

### Prompt 23

<!-- prompt:44528af9-f228-430a-ab60-540b7f6916aa -->

> Build S12 as structured. Keep 27 Aug after a report (item 1 stays an open question), and leave item 2 for S13.

### Prompt 24

<!-- prompt:150cba2d-89f7-44a7-ba2c-9eb403eec698 -->

> Moment: S13, 20 Aug, 7 days before the default on 27 Aug. Persona A, cause carried forward (salary didn't arrive), viewed through the scenario control. Two variants: payroll delay not reported, and reported. This notice is never paused, so in the reported variant it still appears, and the screen says why.
>
> First, an alignment pass. Before proposing anything, check this brief against my Assumptions, Scope, the audit and CLAUDE.md. Drop anything that doesn't line up (for example, a "talk to someone" route, unless my Assumptions name one), and give me the "What I dropped, and why / What remains" table.
>
> Keep S12's structure, and change only what 20 Aug changes:
> - Home: balance first → the advance card in the attention tone, now leading with the date: on 27 Aug the advance goes into default, in 7 days (days_until_default from getStatus). Short status label, e.g. "Default on 27 Aug". No countdown styling, no red, no icons. Recent activity as before. See details.
> - Details view: the attention status card with: the exact default date and exactly what changes then, only my Assumptions' consequences as stated (new advances paused, automatic collection stops); what doesn't change (your wallet keeps working, the amount owed stays Rs 10,300, no fee added); that we'll still take it automatically if salary arrives before 27 Aug, and that after 27 Aug automatic collection stops and the permission ends (permission.ends_on). Then "What you agreed" and "Your permission", unchanged. Nothing about credit bureaus, collections or legal steps (those are "What I'd want to know").
> - In the reported variant: one plain line that the other reminders are paused, but this notice is always sent because it's about a date that matters.
> - Action area on the details view: "Pay some or all yourself" (the same stub), and "My salary is late" only if it hasn't been reported.
>
> Tone: firm and clear, never alarming. It's here so they aren't caught off guard.
> Words to avoid: "overdue", "missed", "final warning", "act now", "last chance", and anything about the person.
> Data only from getWallet, getStatus, getReminders and getActivity.
>
> Give me the structure for Home and the details view, both variants, in the S11 layout (the element, the copy, and where each value comes from). Then a "Still inconsistent" table with severities, and "Does S13 still mean what it should?". No code. Measure at 390×844 and 360×640 before building.
>
> use 
> /better-layout
>  but keep the kit in mind and don't stray from it. the skill should work with the kit and not invent anything new

### Prompt 25

<!-- prompt:0c937463-5bd0-4442-a86a-9da538c36ddd -->

> Build S13 as structured, with the default_notice_sent module field and its check. Items 1 to 6 stay noted.

### Prompt 26

<!-- prompt:56654ffd-b068-4264-a2eb-777b45c7b938 -->

> Let's drop S13 and keep traces of it in the document, the reason I am rejecting this is because this message feels a lot like a pile on the user will face. Log this as something rejected

### Prompt 27

<!-- prompt:29279ed5-e0ec-46c6-b99e-797c5a0dc699 -->

> Drop 20 Aug from the reviewer dates, so the reviewer ends at 2 Aug (S12).

### Prompt 28

<!-- prompt:6a0096b7-1589-4fc6-9722-60b3f84852f3 -->

> I'm skipping the lock-screen preview build. Record it and draft the write-up table. No code.
> 1. Audit: add a dated note to Q6 / 12A (and 6.21): "Deferred in Chat 5: reminder copy and lock-screen text are documented in the write-up; previews are 'with more time'."
> 2. progress.md: add it to Decisions, with the reason (not asked for in the brief; the schedule is checked in the module; S10/S12 show reminders in-app).
> 3. Write-up inbox: draft a reminder table from getReminders for persona A, one row per reminder: date and time, type, channel (push + SMS), lock-screen text, in-app text, and whether it pauses after a payroll delay. Lock-screen text follows my rules: no amount, "loan" or "overdue"; calm; only to the borrower. In-app text must match what S10 and S12 actually show. The 20 Aug notice has no screen (S13 dropped), so write its in-app text as the copy it would use, marked "not built". Mark it "never paused". Show me the table for approval before saving.
> Then add "lock-screen previews" to With more time in my read.

### Prompt 29

<!-- prompt:e677b25a-4f3e-42b7-a45f-1bbaddcc1c86 -->

> Save the table to the Write-up inbox as drafted, add "Reminders go by push and SMS, to the borrower only" to my Assumptions, and commit.

### Prompt 30

<!-- prompt:a792ded2-a8e5-4a13-a406-3620c1cf67cf -->

> Moment: S2, persona B's home. They're paid into a bank account, so the wallet can't see their income.
> What they must understand: they need to verify their salary before an advance is possible, and the steps.
> Next step: start verification (a clearly labelled stub). No amounts, no offer, nothing that looks like a decline.
> Principle 2 (know before you ask). This is the "a moment that shouldn't exist" case, so keep it to one card.
> Propose layout + exact copy. No code.
>
>  /better-layout /better-writing 
>
> use the skills in bounds of the kit and not invent new stuff

### Prompt 31

<!-- prompt:36253a02-7175-4d0c-8256-0cb6e000cd45 -->

> Build S2 as proposed with step 3 option A ("When it's verified, this card shows what you can do next."), and reuse the placeholder screen.

### Prompt 32

<!-- prompt:69c45090-39cc-4a1d-a283-d030fc3ace5f -->

> Update docs/progress.md: what's done, decisions made and why, open questions, next step. Append anything new from this chat to the Write-up inbox (Assumptions / What I'd want to know / System flags). Don't rewrite earlier entries. Then commit with a message that gives the reason, not just the change.
>
> export the transcript to docs/ai-log/raw/bad-news

### Prompt 33

<!-- prompt:76332ee0-a6a2-458e-9fe8-6f1bf184cba1 -->

> Commit docs/ai-log/raw/bad-news and docs/ai-log/prompts.md as "AI log: chat 5 transcript (bad-news screens) and prompt log".

### Prompt 34

<!-- prompt:87afdeb0-e249-4c30-8845-28acd8bd7d42 -->

> There is a contradiction in S12 in the details it says " ...so there's nothing you need to do" but it gives the option a the bottom to pay some or all yourself. I think this action is not necessary and is contradicting, assess if I am right on this and then we can cut it from here

### Prompt 35

<!-- prompt:11ff89a9-c43f-40ac-b8e8-be664748bb83 -->

> leave it as is, I think this is a defendable option

## Session 8

<!-- session:6fc70d0c-ba75-4f0e-b538-febff5a6686d -->

### Prompt 1

<!-- prompt:73f8d829-0460-478c-b5d9-ad7519de47b2 -->

> Read CLAUDE.md and docs/progress.md. Today's phase is Chat 6: reviewer controls, README, deploy. My intent: turn the existing reviewer controls into one panel a reviewer can use without me, then the README's "How to review", then deploy. The NovaKit changes page is dropped; the Figma sheet in Chat 7 carries the before/after. No code yet.

### Prompt 2

<!-- prompt:4cc8e3d3-3e96-4454-86bb-14d507fde434 -->

> Consolidate the reviewer controls in src/review/ into one panel beside the phone frame, labelled "Reviewer controls". Don't add new state controls. Plan first.
>
> What already exists: the "after Accept" control (works / network failure / lower amount) and Start again from Chat 4, and the basic scenario control from Chat 5 (date presets, payroll delay, persona A/B). There's one not-collected cause only (S11), no days-late slider, and S13 is dropped.
>
> 1. One panel, not two: the "after Accept" control, the date presets, payroll delay, persona A/B and Start again, grouped under clear headings.
> 2. A short index of the states a reviewer should see, in order, each with a one-line note, "what this shows / which principle": S1, S2, S3, S4, S5–S7 (via "after Accept"), S8, S9, S10, S11, S12 and S12 with payroll delay reported. Each entry jumps straight to that state, setting the date, persona and outcome it needs.
> 3. Each state gets a URL (?state=S11) that opens it directly, so the README and write-up can link to it. Reloading keeps the state.
> 4. Graded moments are marked, so a reviewer knows where to spend time: terms (S4), accept (S4–S8), bad news (S11–S12).
> 5. On narrow screens the panel becomes a drawer that never covers the phone's actions. Keyboard order: the phone first, then the panel.
> 6. Only data from scenario() and the module; the panel never computes money or dates. Remove anything left over from Chat 5 that the index makes redundant.
>
> Also add to progress.md → Decisions: "NovaKit changes page dropped; the Figma sheet shows v0 next to v1; DESIGN_SYSTEM.md is the written record."
>
> Show me the plan: the panel's sections, the index notes for every state, and the URL scheme. No code until I approve.

### Prompt 3

<!-- prompt:ecf8eb84-552c-4fbe-bba5-17f5fbf5dee8 -->

> A: index replaces them. B: segments inside S5–S7. C: keep Start again. D: top push-down drawer. E: yes, delete both. Start with commit 1.

### Prompt 4

<!-- prompt:e59a75f9-1c3a-4245-a2db-65597d794c2e -->

> The reviewers control should have a fixed height and an internal scroll so that the reviewer doesn't have to scroll away from the mobile screen to reach something

### Prompt 5

<!-- prompt:e5e189a3-df82-42b3-a1d6-a6cc2844806d -->

> make the scroll smaller and only visible on hover. then commit it

### Prompt 6

<!-- prompt:d9bf30ab-2705-491f-95bf-dedda92c95e5 -->

> Start commit 2: the ?state= URL, as planned.

### Prompt 7

<!-- prompt:6d19f331-7426-4989-9ac2-ab15c31db634 -->

> Start commit 3: the push-down drawer below 768px, as planned.

### Prompt 8

<!-- prompt:7ff0ed6a-cb13-4e91-9564-cf76cb874742 -->

> Add a "How to review" section to README.md: the live link, how to reach each graded moment (with scenario URLs), what's real vs stubbed, and where the write-up, design-system notes and AI log live.

### Prompt 9

<!-- prompt:65cf15fd-79fb-43e3-b4b8-323b7672d54a -->

> Can you push this feature so I can deploy on vercel

### Prompt 10

<!-- prompt:b0f3cefc-a4fd-49a7-9127-fb0c21257695 -->

> The deployment was blocked because the commit email ahmed.bilal@devsatmelior.com could not be matched to a GitHub account. Ensure your git email matches your GitHub account. this is the error it shows me when i go to deploy on the salary advance one. make sure the email is abk9232@gmail.com

### Prompt 11

<!-- prompt:7c3e2bbe-8c6a-4072-8541-9cd2fe9f46ef -->

> now it is live. Can I add a password to this?

### Prompt 12

<!-- prompt:046cdbd9-686d-48b5-b499-8fe7664853ba -->

> Leave it public for now; just update the README with the live URL:

### Prompt 13

<!-- prompt:0e6a1e6d-a964-4ba3-895f-1819c6293747 -->

> https://novapay-lake.vercel.app/?state=S1

### Prompt 14

<!-- prompt:882db0f7-32f3-4be8-9f15-77a2b164e560 -->

> Push it.

### Prompt 15

<!-- prompt:391e520e-9da6-4f17-bd03-7ae5deedfd23 -->

> Update docs/progress.md: what's done, decisions made and why, open questions, next step. Append anything new from this chat to the Write-up inbox (Assumptions / What I'd want to know / System flags). Don't rewrite earlier entries. Then commit with a message that gives the reason, not just the change.
>
> export the transcript to docs/ai-log/raw/reviewer-controls-and-deployment

### Prompt 16

<!-- prompt:a8967641-7442-48e6-8bda-ed3f3c7ceaee -->

> Replace the brief fragments in the transcript files with [brief text removed], then commit the transcript and the prompt log.

### Prompt 17

<!-- prompt:f684dc88-ce81-41cb-8c0a-9e9d7526099e -->

> Push them.

### Prompt 18

<!-- prompt:c3733e2b-eb74-4432-8e06-3f4fcb1a3239 -->

> https://www.figma.com/design/nhGhfzroYtPCBZ4Y5WLCob/Component-Set?node-id=0-1&t=mFzxED19hDj9TTbS-1 add the figma link to the read me file

### Prompt 19

<!-- prompt:e5184c8d-2f63-4f1a-a210-abae2da58263 -->

> Push both.

## Session 9

<!-- session:20b721ac-db68-469e-947e-c01a3a1b5f25 -->

### Prompt 1

<!-- prompt:8864f9d0-b866-4fb0-b1d6-c5694d28704f -->

> Read CLAUDE.md and docs/progress.md. Figma Sheet. My intent: We'll be creating a figma component sheet. Do not do anything yet

### Prompt 2

<!-- prompt:f06b8926-59e8-400f-b96f-c380f99918d0 -->

> Create a small Figma component sheet for the components I changed. Plan the pages, variables and variant properties first; no Figma writes until I approve.
> 1. Tokens as Figma variables, matching tailwind.config.js exactly: brand, neutral (with neutral-500 retuned to #6B6B6B), success (#15803D), attention (renamed from accent; DEFAULT removed, noted on the sheet), danger and danger-50. Show contrast for each text pair.
> 2. Components with proper variants and auto-layout, variant names matching the code props:
>    - Choice (new): type checkbox/radio, checked, disabled (aria-disabled, with reason)
>    - Button: variant primary/secondary, size md/lg, subLabel, loading
>    - AmountText: size incl. caption, sign, missing (renders nothing)
>    - Card: tone default/attention/danger
>    - ListRow: wrap
>    - AppBar: back (44px target), if time allows
> 3. Before/after: for each changed component, the v0 version (from src/review/novakit-v0) next to v1, with a one-line "why" taken from DESIGN_SYSTEM.md.
> 4. A "flagged, not fixed" frame: BottomSheet's original issues (fixed later), Toast, TextField, ListRow semantics.
> Each component frame names its code file (src/novakit/...). That's the design-to-code mapping.
>
> Do it here: https://www.figma.com/design/nhGhfzroYtPCBZ4Y5WLCob/Component-Set?node-id=0-1&t=mFzxED19hDj9TTbS-1

### Prompt 3

<!-- prompt:da603b7f-5f41-4cea-b3e5-ee7c11bae7d2 -->

> Approved with your recommendations: Roboto, a frozen v0 collection, absolute/white and absolute/black, interaction states as an example row, and one page per round with a screenshot. The hand-drawn tick is OK. Start with the Tokens page.

### Prompt 4

<!-- prompt:f6ac56f0-1111-4fff-bcef-03392610747b -->

> Tokens page looks good. Go on to the Components page.

### Prompt 5

<!-- prompt:309e64d3-437d-47a5-8c5f-ee4a95265436 -->

> Components page looks good. Go on to the Before / after page.

### Prompt 6

<!-- prompt:42974cf9-d76b-4323-a38a-c47c5c15e486 -->

> Before / after looks good. Go on to the Flagged, not fixed page.

### Prompt 7

<!-- prompt:d8a4fe96-a19e-495e-bf21-773f8b0484e1 -->

> Yes. Update docs/progress.md with the Figma sheet (including the Write-up inbox and the calls you made), then commit it.

### Prompt 8

<!-- prompt:20e474a4-37ec-44ec-a383-e8ee559379cd -->

> Do a release check: fresh clone into a temp folder, npm install, npm run build, npm run check, npm run verify. Click through every scenario URL and report any dead control, console error, or a number or date that differs between screens.

### Prompt 9

<!-- prompt:46f6df4c-e77f-4125-85ce-6997b626f674 -->

> Yes, delete the .release-check/ folder and remove its line from .git/info/exclude.

## Session 10

<!-- session:8eca7ee7-c35c-4d26-a3cd-e77d10cc023b -->

### Prompt 1

<!-- prompt:4e9144d2-a76b-4f7f-895e-6c944e67967b -->

> From docs/ai-log/prompts.md, docs/ai-log/raw/ and the "AI draft / Reject" commit pairs, draft docs/ai-log/README.md: an index of sessions, the prompts that mattered, and a table of prompt → output → kept/changed/rejected → why. Use only what's actually in the logs and commits. Don't invent or smooth anything.

### Prompt 2

<!-- prompt:f8b97563-a699-4619-9a0d-6f06f6f04dd6 -->

> Commit docs/ai-log/README.md with a message that gives the reason.
