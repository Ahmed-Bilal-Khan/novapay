# AI log

How the AI was driven on this project: an index of the sessions, the prompts that shaped the work, and what happened to each output. It's built only from three sources:

- [`prompts.md`](prompts.md): every prompt I sent, grouped by Claude Code session. A Stop hook writes it, so interrupted prompts aren't logged.
- [`raw/`](raw/): the session transcripts.
- The git history, including the one "AI draft / Reject" pair.

Prompt references read **S*n* P*m***: session *n*, prompt *m* in `prompts.md`. Quotes are copied as written, typos included.

## Sessions

"Chat" is the numbering in `docs/progress.md`. "Session" is the numbering in `prompts.md`, one per Claude Code session.

| Chat | Session | Phase, in the opening prompt's words | Transcript in `raw/` |
|---|---|---|---|
| 1 | S1 (5 prompts) | Project setup: the prompt-log hook, `progress.md` | [`project-setup.md`](raw/project-setup.md), Markdown, brief redacted |
| — | S2 (3 prompts) | "Prompt logging test" (testing the hook) | None |
| 2 | S3 (16 prompts) | "Critique of my read and setting up rails" | [`progress-review&guardrails.md`](raw/progress-review&guardrails.md), Markdown, brief redacted |
| 3 | S4 (30 prompts) | "System audit against the scope", then the module, tokens and components | [`kit-audit&component-updates.md`](raw/kit-audit&component-updates.md), Markdown, brief redacted; the unpacked export is in [`kit-audit&component-updates/`](raw/kit-audit&component-updates/) |
| 4 | S5 (5) + S6 (32) | "Terms + Accept graded moments a and B": S3 to S9 | [`Screens-Relevant-(a)-(b)/`](raw/Screens-Relevant-(a)-(b)/), unpacked export. It starts at S5 P1, so it covers both sessions. Its commit (`348f7ea`) says the brief is referenced by path, never read. |
| 5 | S7 (35 prompts) | "Screens for different scenarios on how to handle bad news": Home on later dates, the reviewer panel, S10 to S13, S2 | [`bad-news/`](raw/bad-news/), unpacked export. Exported at S7 P32, so P33 to P35 aren't in it. |
| 6 | S8 (19 prompts) | "Chat 6: reviewer controls, README, deploy" | [`reviewer-controls-and-deployment/`](raw/reviewer-controls-and-deployment/), unpacked export, with brief passages replaced by "[brief text removed]" (`8b935ff`). Exported at S8 P15, so P16 to P19 aren't in it. |
| 7 | S9 (7 prompts) | "We'll be creating a figma component sheet" | None. The sheet lives in Figma; `progress.md` (`51c1f0a`) is the record. |

The transcripts hold more user messages than `prompts.md` (for example 39 in `bad-news/` against 35 logged), because they also contain interrupted prompts and skill invocations.

## How the prompts were shaped

These patterns recur across sessions. Each has an example from the log.

- **Say the phase, then stop.** Each chat opens with "Read CLAUDE.md and docs/progress.md", the phase, and an instruction not to start (S4 P1: "do not work on anything yet"; S9 P1: "Do not do anything yet").
- **A moment brief before each screen:** Moment, Who, What they must understand, what can honestly be said, the next step, principles, data, then "Propose the layout and exact copy… No code" (S5 P2, S6 P4, S6 P16, S6 P22, S6 P26, S7 P10, S7 P15, S7 P22, S7 P24, S7 P30).
- **Lettered options, answered in codes:** "I'll reply with short answers like '1A, 2B, 3C'" (S4 P4), then "1A, 2A, 3B, 4A, 5A, 6A but remove accent DEFAULT…" (S4 P5).
- **Critique, then triage:** "Critique this screen three ways… Only list problems; don't fix them" (S5 P4), then Fix / Reject / Defer (S5 P5).
- **Re-verify against every doc:** S6 P9 ("Run an agent to check re-verify the work we did on s4"), S6 P18, S6 P28, S7 P12, S7 P16.
- **Alignment pass before a brief is built** (from S7 P17): "drop what does not align with our assumptions and other details". S7 P22 and S7 P24 ask for a "What I dropped, and why / What remains" table first.
- **My read stays mine:** "Don't edit 00-my-read.md. I'll make any changes myself" (S3 P3). Later edits to it are requested explicitly, with the diff shown first: "Change only what's listed… Show me the diff before saving" (S3 P6), "exactly these changes and nothing else" (S4 P15).

## Prompt → output → outcome

**Kept**: used as the AI produced it. **Changed**: used after I changed it. **Rejected**: not used. Each "why" is my reason as written in the log; where the log gives none, the row says so.

### Chat 1 (S1)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S1 P1: a Stop hook that logs each prompt, "so prompts I cancel aren't logged" | The hook, writing `prompts.md` | Kept | The Stop hook is my own spec in the prompt | `c4f51c9` |

### Chat 2 (S3)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S3 P2: "Where is my reasoning weak or unsupported?… Be blunt and specific." | A critique of my read. Among its points: "Cut… the advance record", and a late path of "failed collection, then the late state, then the pre-default notice" (no reminder before the due date) | Changed: I rewrote my read as v2 with a table of what I accepted, adapted and rejected | — | `14cf4bc`; transcript, "## Prompt 2" |
| S3 P3: I rejected two points ("Cutting the record", "Cutting the reminder before the due date") and asked: "Argue against both rejections as strongly as you can" | Arguments against both. The verdict: keep the receipt but drop "no record" as its reason; keep the reminder, but because it's "your one chance to prevent" two causes of lateness | Kept: its reasons replaced mine (S3 P4/P5: "I accept your round-2 argument on both reasons"). In S3 P6 I corrected my table: the AI had suggested cutting the separate record screen, which I **accepted** ("Moved to 'With more time'"); the receipt is "my addition, not a critique point"; its late path without the reminder is **rejected** | Reminder: "It's the one chance to prevent two of the four causes of lateness: salary moved to a bank, and money spent before collection" (S3 P6). Receipt: "the accept moment isn't finished until the user knows it worked" (S3 P5) | Transcript, "## 1. Arguing against your two rejections"; `502ff05` |
| S3 P6: apply my decisions on the 11 round-2 points, "don't add anything of your own" | The edits, shown as a diff before saving | Kept | The decisions in the prompt are mine | `502ff05` |
| S3 P10, P11: the prompt log was missing prompts | Restored the bracketed prompt and renumbered the rest | Kept | "so the log matches its own 'every prompt' claim" | `eb55cbc` (the body says an editor save had overwritten them) |
| S3 P12: my rules into `CLAUDE.md`, "without changing their meaning", and `npm run check` | `CLAUDE.md`, plus a check shown failing on a deliberate violation | Kept | No reason given in the log | `eb55cbc` |

### Chat 3 (S4)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S4 P4: sort the audit into safe defaults and numbered questions | 14 lettered questions, each with a recommendation (★) | Kept, answered in codes | — | Transcript, around line 1894 |
| S4 P5: "6A but remove accent DEFAULT" | Option 6A, marked ★, kept accent DEFAULT "documented as not for text" | Changed | "nothing uses DEFAULT; removing it makes a solid amber fill impossible" | Transcript, line 1894; `eca45f1` |
| S4 P13: "7: also show 'Includes Rs 10,000 from your advance' under the real balance" | The module, with a note that the line "is only true right after the payout" | Changed: limited to home after accepting | S4 P14: "Modelling spending is 'with more time'" | Transcript, line ~3448; `4532811` |
| S4 P13: add `getReminders`, "paused when a payroll delay is reported" | The pause covered the notice before default. The AI flagged it as "a trust risk you may not want" and offered "never pause the notice before default" | Changed: I took that option | S4 P14: "a material consequence must always be announced" | Transcript, lines ~3441–3447; `4532811`. `c0e6168` and `progress.md` call this "rejected" output; the transcript shows the AI raised the risk first. |
| S4 P13 (same reply): the not-collected notice at 6pm, not 10:00 | A call the AI made, flagged for confirmation | Kept | S4 P14: "1: confirmed" | Transcript, line ~3445 |
| S4 P25: the back glyph is small, "Make it larger" | Larger glyph. `text-title` was tried and measured, then `text-display` used | Kept, with the AI's choice of size | The commit records the measurement (5px → 7px with `text-title`) | `c421ee3` |

### Chat 4 (S5, S6)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S5 P2: S3 layout and copy | Included "**[PLACEHOLDER]** 'Your limit is based on your salary and how you use NovaPay.'" | Rejected | S5 P3: *"How you use NovaPay" is invented policy, and it hints that activity earns a bigger limit* | Transcript (search "how you use NovaPay") |
| S5 P4: "Critique this screen three ways" | Regulator, low-literacy and screen-reader critiques (R, B and SR points) | Triaged: most fixed. **Rejected R6, R7, R8, SR6.** Deferred R9, B3, B10, SR9. | S5 P5 gives a reason for each rejection, for example R7: "Showing the limit honestly is the over-limit moment the brief asks for" | `de6bfe0`, `c4f284e` |
| S6 P4: S4 layout and copy, including whether to show "the annualised rate (~52%)" | The S4 proposal, with placeholder lines on late fees and other default consequences | Changed: no annual rate, placeholders removed | S6 P5: "There is no annual rate it is a fixed 3% on the amount a user borrows", and "Get rid of" both placeholder lines | `8b1107e` (built without them), `401aa10` (my read) |
| S6 P7: the checkbox should read "I have read the terms stated above and accept" | The AI pushed back: "This is the bundled 'I agree' from your predatory list, so CLAUDE.md and your read would need changing first" | My request changed. S6 P8 gives new wording: "I allow NoyaPay to take the repayment above automatically." | The AI's objection, in the transcript's AskUserQuestion | Transcript (search "bundled"); `376bef5` |
| S6 P7: "This looks very busy… The consequences should show up in the bottom drawer" | S4 with the consequences in a BottomSheet, and BottomSheet rebuilt as a dialog | Changed | "This looks very busy right now" | `376bef5` |
| S6 P13: "Accept Rs 10,000" with no second line | Button without the second line, and a rule exception | Changed: my own rule was amended | "the primary text is more than enough to translate the complete message" (S6 P13, P15) | `6f1381c` (removes the `subLabel`), `45d4f11` (docs) |
| S6 P18: "Reverify your work" | A numbered list of problems and decisions, including "S7 uses a plain HTML table, which the plan didn't include" | **Rejected the table** ("7. rebuild with list rows"). Kept S7's one-line accept ("6. no keep as is") | No reason given in the log | Transcript (search "rebuild with list rows") |
| S6 P22 → P24: the receipt | A receipt that repeated "Your advance" and "Your permission" | Changed | S6 P24: the amount "should be center stage… your advance tells the user again what they have gotten which is repeating something they know not necessary" | `d5f5f6a` |
| S6 P28: signs on activity rows | The AI argued for + and − on every row | Kept | "I get your point regarding the +/- in the recent activity, add those to all rows" | `0dcf3f3` |

### Chat 5 (S7)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S7 P2: options for Home on later dates | Lettered options with recommendations, and a flag that the balances didn't add up without activity rows | Kept: 1B, 2A with 2i, 3B with 3i | S7 P3: "Take the recommendations" | `e429d43`, `d6c9c5a` |
| S7 P4, P5: a reviewer control, C1a–C7a | The control (`70d22f3`) | **Rejected**, rebuilt | S7 P6: "very hectic and confusing for the reviewer" | `70d22f3` → `1eeec89`, as a forward commit, not an "AI draft / Reject" pair |
| S7 P8 | The rebuilt panel's "Why it wasn't collected" group | **Rejected** | "it does not add that much value and has a lot of impact on the screen" | `84ba2eb` |
| S7 P10: S10, with "Rs 600 in their wallet" | The AI flagged that my Assumption says Rs 1,800 on 25 Jul | Kept the Assumption | S7 P11: "balance stays Rs 1,800" | `a4d6220` |
| S7 P12: "Reverify your work against context" | 13 inconsistencies, including a display rule living in a screen | Changed: I fixed some (S7 P13) and decided the rest myself (S7 P14) | S7 P14: "2. leave as is / 3. update the scope / 4. reword / 6. use the same wording / 10. update the stale statement" | `d7402d4`, `0073302`, `b21c40f` |
| S7 P15: S11 for 4 causes | A layout, then on S7 P16 its own check, which found unsupported claims (including that "moved to a bank" can't be known) | Changed: one cause, aligned to my Scope | S7 P17: "drop what does not align with our assumptions"; S7 P18: "nothing required, it's automatic can count as a next step" | `4de418d` |
| S7 P20: "can we come up with something nicer?" | A tone check and three options for the retry line | Kept option A | S7 P21 | `15b7710` |
| S7 P24, P25: S13 | The notice before default (`f4db1bd`) | **Rejected** | S7 P26: "this message feels a lot like a pile on the user will face" | **`f4db1bd` → `0113d65`, the only "Reject:" commit** |
| S7 P28: skip the lock-screen previews; draft a reminder table | The table, shown before saving | Kept | S7 P28: "not asked for in the brief; the schedule is checked in the module; S10/S12 show reminders in-app" | `80168e1` |
| S7 P34: "this action is not necessary and is contradicting" | The AI assessed it ("mostly right") and proposed cutting the pay stub | Its proposal was not taken | S7 P35: "leave it as is, I think this is a defendable option" | Not in the transcript (exported at P32) |

### Chat 6 (S8)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S8 P2: one panel, an index of states, `?state=`, a drawer, "Plan first" | A plan with choices A–E | Kept, with my answers to A–E (S8 P3) | — | `7f8a6c3`, `96955b1`, `9e728b4` |
| S8 P4, P5 | The panel | Changed: fixed height with an inner scroll, and a thin scrollbar shown only on hover | "so that the reviewer doesn't have to scroll away from the mobile screen" | `7f8a6c3` |
| S8 P2 (outcome) | — | Chat 5's panel parts (DateSteps, AcceptOutcome, the persona segments, the payroll checkbox, "Now showing") were removed | "Remove anything left over from Chat 5 that the index makes redundant" | `7f8a6c3` |
| S8 P10: the deploy blocked by the commit email | Commits made as `abk9232@gmail.com` (local config only) | Kept | The Vercel error quoted in the prompt | `b3586fd` |

### Chat 7 (S9)

| Prompt | AI output | Outcome | Why | Evidence |
|---|---|---|---|---|
| S9 P2: plan the Figma sheet, "no Figma writes until I approve" | A plan with recommendations | Kept: "Approved with your recommendations: Roboto, a frozen v0 collection…" (S9 P3), then each page approved in turn (P4–P6) | — | `51c1f0a`. No transcript. |

## The "AI draft / Reject" pairs

`CLAUDE.md` says: "When I reject an output: commit it as 'AI draft: …', then revert it with 'Reject: [what was wrong]'."

- **The history has one "Reject:" commit:** `0113d65` "Reject: S13, the notice before default, reads as a pile-on", which reverts `f4db1bd`.
- **No commit is titled "AI draft:".** `f4db1bd` played that role under the title "S13: the notice before default…".
- **Earlier rejections weren't committed as pairs.**
  - The chat 5 reviewer control (`70d22f3`) and its cause group were replaced by forward commits (`1eeec89`, `84ba2eb`).
  - The chat 4 rejections (the S3 limit placeholder, the S4 annual rate and placeholders, the S7 table, the first receipt) aren't recorded in any commit title. S5 P2, S6 P4 and S6 P22 asked for proposals with "No code", and S6 P7 held commits until I was satisfied ("Do not commit anything until I am satisfied with the design and say 'Commit now'").

## What the logs don't cover

- **Chat 7 (S9) has no transcript** in `raw/`.
- **Chats 5 and 6 were exported before their last prompts**, so the later prompts are in `prompts.md` but not in the transcripts.
- **S2 is only a test of the hook.**
- **Why the S7 table was rebuilt as list rows** isn't stated in the log, only the decision.
- **The pause rule is described differently in different places.** `c0e6168` and `progress.md` call it rejected AI output; this index follows the transcript.
