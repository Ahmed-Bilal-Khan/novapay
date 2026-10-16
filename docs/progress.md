# Progress

## Done

- Unzipped the NovaKit Lite starter into the repo root. All 22 files are byte-for-byte the same as in the zip (checked with checksums).
- Added `.gitattributes` (`* text=auto eol=lf`) and added `_inputs/` to `.gitignore`.
- Ran `git init` on `main`, committed the starter as "NovaKit Lite starter, as received" (`b9a1427`), tagged it `starter`, and pushed `main` and the tag to `Ahmed-Bilal-Khan/novapay`.
- Created and pushed `feature/salary-advance`.
- `npm install` and `npm run build` both pass, and the dev server runs at `http://localhost:5173` with no console errors.
- Converted the case brief PDF to `_inputs/brief.md`. A word-level diff against the PDF text found no differences.
- Compared the product reference PDF with `PRODUCT_REFERENCE.md`: the wording and formatting are the same, and only the quote style differs (the PDF uses curly quotes, the repo file straight ones).
- Added a Stop hook (`.claude/settings.json` → `.claude/hooks/log-prompt.mjs`) that logs each prompt to `docs/ai-log/prompts.md`, numbered and grouped by session. It's tested and live, and interrupted prompts are not logged.

## Decisions

- **Flattened the zip's `novakit-lite/` folder into the repo root** so the repo is the project itself, with no extra folder level.
- **Kept the zip out of the repo with `.git/info/exclude`, not `.gitignore`,** so the only change to the starter's `.gitignore` is the `_inputs/` line that was asked for.
- **Kept `brief.md` inside `_inputs/`** so it's covered by the same ignore rule and the brief is never published.
- **Did not run `npm audit fix`,** even though the install reported 14 vulnerabilities (4 moderate, 10 high). Fixing them would change the starter's lockfile.
- **Wrote `brief.md` as Markdown that follows the PDF's layout.** The boxed sections became blockquotes, the page footers were dropped, and the sentence split across pages 1 and 2 was joined.
- **Used a Stop hook rather than UserPromptSubmit for the prompt log.** Stop doesn't fire on an interrupt, so cancelled prompts stay out of the log.
- **Gave each logged prompt and session a hidden ID marker.** This means a prompt is never logged twice, and sessions stay grouped even when they alternate.
- **Wrote the hook in Node** because Python isn't installed on this machine.

## Open questions

- The cost section says "See 'Trust rules'", but there's no section with that name. The closest is "Trust matters most here".
- The decision is called "Declined" in the text but `decision (approved/denied)` with `denial_reason` in the glossary.
- The decline reason is `income_unverified`, but the glossary field is `income_verified`.
- The glossary lists `income_source (salaried/freelance)`, but the product is described as only for salaried users.

## Write-up inbox

### Assumptions

### What I'd want to know

### System flags

## Next step

Phase 0: my own read of the brief and the system, without AI.
