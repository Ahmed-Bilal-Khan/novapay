# NovaKit Lite

A small slice of **NovaPay's coded design system** — the starter for the AI-First Product Designer case study. It gives you design tokens, a handful of components, and a running mobile-framed app to build on.

> Read this and the components carefully — but treat the system as a **starting point, not gospel**. Real design systems are messier than their docs suggest: some things are missing, some are inconsistent, and some shouldn't be reused as-is. Part of your job is to notice that.

## How to review

**Live link:** [novapay-lake.vercel.app](https://novapay-lake.vercel.app/?state=S1)

To run it locally instead, see [Run it](#run-it). Every link below also works on `http://localhost:5173`, with the same `?state=` part.

The phone is the prototype. **Reviewer controls** sit to its right (below 768px wide, a "Reviewer controls" button above the phone opens them). They're not part of the app. They list every state in order, each with a one-line note on what it shows, and open it directly. "Start again" goes back to the beginning.

Every state has a link: `?state=` plus its code. A reload keeps the state you're on.

### The graded moments

**Terms: S4** · [`?state=S4`](https://novapay-lake.vercel.app/?state=S4)
Opens "Review and accept" for Rs 10,000. Check that the amount received, the fee in rupees, the total and the due date are visible without scrolling. Also check that the collection permission is its own unticked box with an end date, and that "What happens if it's late" opens the late details. Tapping Accept without the box ticked says why nothing happened.

**Accept: S4 → S8**
- **It works:** from [`?state=S4`](https://novapay-lake.vercel.app/?state=S4), tick the box and tap Accept. You see processing (S5), the receipt (S8), then Done and home after accepting ([`?state=S9`](https://novapay-lake.vercel.app/?state=S9)).
- **Network failure:** [`?state=S6`](https://novapay-lake.vercel.app/?state=S6) opens S4 set to fail once. Tick and Accept to see S5, then the failure (S6); "Try again" works.
- **A lower amount:** [`?state=S7`](https://novapay-lake.vercel.app/?state=S7) opens S4 set to offer less. Tick and Accept to see S5, then Rs 5,000 offered instead, with fresh, unticked consent (S7).
- In the reviewer controls, the S5–S7 entry's choices (Works, Fails once, Lower amount) do the same.

**Bad news: S11 → S12** (the late path, for "salary didn't arrive")
- **Not collected on payday, 28 Jul:** [`?state=S11`](https://novapay-lake.vercel.app/?state=S11). Red only on the failed collection; the amount owed hasn't changed and nothing is needed from the person. "See details" shows the status and what was agreed.
- **Late, 2 Aug:** [`?state=S12`](https://novapay-lake.vercel.app/?state=S12). Days late in amber; in "See details", "My salary is late" is the optional report.
- **Late, with the payroll delay reported:** [`?state=S12-delay`](https://novapay-lake.vercel.app/?state=S12-delay).

**The other states:**
- S1 offer: [`?state=S1`](https://novapay-lake.vercel.app/?state=S1)
- S2 needs verification (persona B): [`?state=S2`](https://novapay-lake.vercel.app/?state=S2)
- S3 choose an amount: [`?state=S3`](https://novapay-lake.vercel.app/?state=S3)
- S8 receipt: [`?state=S8`](https://novapay-lake.vercel.app/?state=S8)
- S10 reminder, 25 Jul: [`?state=S10`](https://novapay-lake.vercel.app/?state=S10)

Each note in the reviewer controls ends with the principle it tests, from [my read](docs/00-my-read.md):
- **P1** The number you tap is the number you owe.
- **P2** Know before you ask.
- **P3** Smaller is never harder.
- **P4** Late is a situation, not a character flaw.
- **P5** Their wallet stays theirs.

### What's real, simulated, stubbed or not built

| | What |
|---|---|
| **Real** | Every screen named above, and the steps between them: choosing an amount, the terms, the permission, accepting, the late details sheet, the advance's details, "Hide this message" (S11) and "My salary is late" (S12). Every amount and date comes from one module, [`src/advance/salaryAdvance.js`](src/advance/salaryAdvance.js) (tiers, limit, fee, totals, due date, 6pm collection, days late, default date), and `npm run check` runs 44 checks on it. |
| **Simulated** | There's no backend. The date and persona are set by the reviewer controls. What happens after Accept is chosen there too, and processing takes 1.5s. The balance and activity on later dates are sample rows. Nothing is saved: a reload gives the state as the reviewer controls set it up (an advance you chose by hand comes back as the Rs 10,000 one). |
| **Stubbed** | Two labelled placeholder screens: "Pay some or all yourself" (from the advance's details on S11 and S12) and "Start verification" (S2). |
| **Not built** | The notice before default on 20 Aug (S13). It was built and rejected; its trace is in [`docs/progress.md`](docs/progress.md). The lock-screen previews: their copy is in the write-up. The other causes of a missed collection: they're modelled in the data, but the reviewer can't choose them. The credit-history decline, the default screen, and successful or early repayment. |

### Where things are

- **The write-up:** *Placeholder: link to be added.* It's a separate document, not in this repo.
- **My read** (the problem, principles, scope, Assumptions and open questions): [`docs/00-my-read.md`](docs/00-my-read.md).
- **Design-system notes:**
  - every token and component change, with the reason and before/after contrast: [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
  - the audit of NovaKit Lite against this scope: [`docs/01-system-audit.md`](docs/01-system-audit.md)
  - the tokens: [`tailwind.config.js`](tailwind.config.js)
- **AI log:**
  - every prompt, by session: [`docs/ai-log/prompts.md`](docs/ai-log/prompts.md)
  - the chat transcripts: [`docs/ai-log/raw/`](docs/ai-log/raw/)
  - AI outputs I rejected or changed, and why: [`docs/progress.md`](docs/progress.md) → Write-up inbox → AI process. One rejection is also a commit pair: `f4db1bd` (AI draft) and `0113d65` (Reject).
- **The working rules the AI followed:** [`CLAUDE.md`](CLAUDE.md). The handoff between chats is [`docs/progress.md`](docs/progress.md).

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. The app renders inside a ~390px mobile frame — keep your work mobile-first.

```bash
npm run build   # production build (also a quick way to check nothing is broken)
npm run check   # fails on hex colours, arbitrary values or default Tailwind colours in src/, and checks the salary-advance module
```

## What's in here

```
src/
  novakit/            # the design system — build from these
    Button.jsx        # primary | secondary · md | lg · optional second line · loading
    TextField.jsx     # default · focused · disabled
    Card.jsx          # surface container · tones: default | attention | danger
    Panel.jsx         # deprecated alias of Card
    ListRow.jsx       # icon · title/subtitle · trailing amount · optional wrap
    AppBar.jsx        # title (the screen's h1) + optional back with a label
    BottomSheet.jsx   # modal dialog sheet: title, focus handling, Escape, Close
    Toast.jsx         # transient message · success | neutral
    AmountText.jsx    # formats PKR amounts (and formatAmount for strings)
    Choice.jsx        # checkbox or radio with label, description, blocked reason
    index.js          # barrel export -> import { Button } from "./novakit"
  advance/
    salaryAdvance.js  # the one source of truth for salary-advance money and dates
  screens/            # Home (S1, S9), ChooseAmount (S3), ReviewAccept (S4–S7), Receipt (S8), AdvanceDetails, advanceParts (shared rows and late details)
  review/             # reviewer controls shown beside the phone, never inside it
  App.jsx             # phone frame and routing
  index.css           # Tailwind entry
scripts/              # npm run check: token check and module check, plus the allow-list
tailwind.config.js    # design tokens (colors, radius, type scale, elevation)
DESIGN_SYSTEM.md      # log of every token or component change
```

Tokens live in `tailwind.config.js` (e.g. `bg-brand`, `bg-brand-50`, `text-attention-600`, `text-neutral-700`, `rounded-md`, `shadow-card`, `text-title`). The palette is intentionally generous — a full brand (indigo) ramp, an amber `attention` ramp for states that need attention (soft background, dark text, never a solid fill), a `danger` colour only for a failed event, and a layered neutral scale — so you have room to make real aesthetic choices. Use it with restraint. Build new work from tokens and existing components; extend the system only where you genuinely need to, and keep design and code in sync.

## Your task (summary)

Design and build the **first-time salary-advance experience** — offer → terms/total cost → accept — plus at least one path where the news isn't good or simple (declined/ineligible, over-limit, or a late/missed repayment). See the full brief and `PRODUCT_REFERENCE.md` for the product details (tiers, fees, decline reasons, repayment states).

## How to submit

Share a runnable prototype: a **pull request** against this repo is preferred (work on a branch or fork), but a deployed link or repo is fine too — as long as it runs. Add your short writeup (Google Doc or PDF) and your AI process (prompt log or a 5–10 min screen recording, including one AI output you rejected and why). Don't lose a weekend over this — it's sized for about 6 hours.
