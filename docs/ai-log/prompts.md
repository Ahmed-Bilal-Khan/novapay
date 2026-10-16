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
