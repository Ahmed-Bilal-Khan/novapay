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
