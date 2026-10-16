# My Problem Understanding
The salary advance was shipped fast and it shows at the hard moments: telling someone what an advance will cost, that they've been declined, or that a repayment is coming due. It converts fine, but the manager doesn't want to scale something that feels predatory. My job is to make those moments honest, even where that costs some conversion.

> v1 of this read was written by me without AI. This version (v2) was rewritten with the help of AI after an AI critique; I edited it, and every call in it is mine. The critique and my responses are in the table at the end.

## What I'm working from
I haven't seen the live flow. The starter has one home card ("You may qualify for a NovaPay salary advance" / "See your offer"), and its button only shows a TODO toast. So this section is evidence plus the risks I'm designing against, not things I observed.

**Evidence**
- **The manager's message:** "converts fine but feels off at the edges: the terms, the decline screen, the repayment reminders." Success is being measured by conversion.
- **The brief:** shipped fast; the hard moments are cost, decline, and a repayment coming due.
- **The product reference:**
  - The payout can be lower than requested.
  - Decline reasons are internal codes, and how honestly to explain them is "a design decision".
  - Total cost and the due date "must be clear at the moment of decision".
- **The starter card:** "See your **offer**" claims an offer already exists. ("You may qualify" is only a hedge.) The card is shown to everyone, right under a low balance (Rs 4,250).

**Risks I'm designing against**
- **Entry:** the card implies an offer exists and nudges people when their balance is low. It should reflect the user's real situation (eligible, needs verification, already has an advance, late).
- **Cost:** a fee shown only as a % is hard to judge. Each tier should show the fee in rupees, the total and the due date. A tier above the limit should explain why, not throw an error.
- **Accept:** a vague action ("Continue") taking out a loan, consent bundled or pre-ticked, nothing to show what was agreed afterwards. Also everything after the tap: processing, a double tap, a network failure, and a reduced payout arriving after the user has already said yes.
- **Repayment:** reminders that pressure, notifications that expose the debt, collection that drains the wallet, and consequences explained too late.

## What's working
- It converts, so people want it. That doesn't prove they understand it.
- A fixed one-time fee is simpler to understand than interest that grows. (from the product reference, not observed)
- Repayment is tied to payday, with a single repayment. (from the product reference, not observed)
- The three tiers are simple choices; no slider, no free-text amount.
- Amounts are formatted consistently through one component.

## My position on conversion
I accept lower conversion in these places, on purpose:
1. Full cost and due date on the same screen as the accept button.
2. A separate, explicit permission to collect from the wallet.
3. Verification shown up front, so unverified users don't start an application.
4. No default amount, and no urgency.

## Why someone ends up late
Repayment is collected on payday once salary has landed, at a fixed time (6pm). The reminder before the due date says exactly when. A borrower is only late if:
- **payroll was delayed** (not their fault),
- **they lost their job** (not their fault),
- **their salary moved to a bank account**, or
- **they spent the money before collection.**

The first two aren't the user's fault, and that's why the late experience should be calm and practical, never accusing.

**Due date vs salary arriving:** Days late are counted from 28 Jul, as the product reference says, and shown truthfully. The tone is calm from day 1. If payroll is delayed, the user can tell us and reminders pause.

# Predatory behaviors we want to avoid

**Entry**
- Claiming an offer exists before eligibility is known.
- Defaulting to the largest amount.
- Countdown timers or "offer expires".
- Asking for access to contacts, photos or SMS in exchange for a bigger limit. (Income documents to check affordability are fine. Personal data harvesting never is.)

**Cost**
- Showing the fee after commitment.
- Hiding when and from where repayment is taken.
- Calling it "no interest". The fee is a fixed 3% of the amount, charged once per advance. It isn't an annual rate.

**Accept**
- Pre-ticked consent.
- A vague button that takes the loan.
- Bundling permission to collect from the wallet into "I agree".
- No record of what was agreed.

**Decline**
- A no with no reason.
- Making people keep re-applying. Instead we re-check on a stated date, and they never need to apply again.

**Late**
- Contacting family, contacts or the employer.
- Public shaming.
- Debt details on the lock screen.
- Constant notifications.
- Freezing the wallet.
- Paying a fee to push the date back (rollovers).
- Taking the whole salary the moment it lands.
- Threatening language.

## Principles (each one can fail a screen)
1. **The number you tap is the number you owe.** On the screen with the accept button, the amount received, the fee in rupees, the total and the due date are all visible without scrolling or tapping. The button names the amount, and its second line the repayment and date, unless the rest of the screen already makes those clear enough that the line would only repeat them.
2. **Know before you ask.** No user reaches a "no" that could have been known before they applied. Only the credit check happens at application.
3. **Smaller is never harder.** Tiers in ascending order, nothing pre-selected, the same visual weight for each, no timers, no expiry.
4. **Late is a situation, not a character flaw.**
   - At most 2 reminders a week.
   - None between 10pm and 8am.
   - No amount, "loan" or "overdue" on the lock screen.
   - Never sent to anyone but the borrower.
   - Red only on the event that failed (e.g. "We couldn't collect on 28 Jul"), never on the person's status card or the late screen. Their status uses the attention colour.
   - Attention colour: the amber ramp, now named `attention`, only as a soft background with dark text (body text neutral-900 on attention-50; attention-600 only for the short status label). Never a solid fill, never on headlines, no alarm icons.
5. **Their wallet stays theirs.** Borrowed money is never mistaken for their own: the balance says how much of it came from the advance, and the advance (what's owed and when) has its own card. Collection only ever takes what's owed, attempted once each time salary lands, never on a daily loop (whether retries are allowed is an open question). The wallet is never frozen. 

## A moment that shouldn't exist
**"Declined: income unverified."**
- Assuming verification status is known before anyone applies (see Assumptions), the home card can show verification as a step to complete first, instead of letting the user apply and then declining them: "Verify your salary to unlock an advance", with the steps.
- No application is made, so no decline is recorded.
- **Counter-argument I accept:** using wallet data to pre-screen needs the user's consent, and the backend's decline reason would need to change. It's a product change, not just copy.

## Scope
Built as separate states the reviewer can jump to, so the depth goes into two places.

**In depth: terms + accept**
- Tiers with the fee in rupees, the total and the date. The over-limit tier is shown blocked, with the reason.
- What happens if it's late, in one line, with the details in a bottom sheet. Default consequences are stated here, at accept, as in my Assumptions.
- A separate collection permission, its own unticked checkbox, that doesn't repeat the amounts above it: "I allow NovaPay to take the repayment above automatically." with "This ends automatically when it's repaid, or on 27 Aug at the latest." On a lower offer it says "the new repayment".
- A descriptive button: "Accept Rs 10,000". No second line on S4, because "Your advance" above it already shows "You repay on 28 Jul" and Rs 10,300 without scrolling.
- After the tap: processing, double-tap protection, network failure, and a reduced payout that needs fresh consent.
- A receipt that confirms it worked, and the advance's details (opened from home) as the record of what was agreed.

**In depth: the late path (my one bad-news path)**
Reminder before the due date → Not collected on payday → late → notice before default.

Causes of "Not collected on payday": salary didn't arrive, salary arrived short of Rs 10,300, balance dropped below Rs 10,300 before 6pm, or salary moved to a bank account.

**Thin**
The home card: eligible vs needs verification (the second persona's home-card state). The rest of the "shouldn't exist" case is argued here in writing.

Home after accepting: the balance first, saying how much of it came from the advance ("Includes Rs 10,000 from your advance"), and the advance in its own card with what's owed and when. This is where the receipt's Done goes, and it makes principle 5 testable. The advance's details open from that card.

**With more time**
Credit-history decline, the default screen itself, successful repayment, early repayment. (Viewing the advance later is now built as its details, from the home card.) Modelling spending, so the balance always shows how much of it is borrowed.

## First impressions of NovaKit
- Card and Panel are the same component; only the border differs, and Card's border is a hardcoded colour.
- The secondary button's grey text makes it look disabled. On an accept screen, the "no" option would look unavailable.
- The only status colour is success. Amber is labelled "for expressive moments" and has no defined meaning, so anyone would grab it for a late screen. I'll give it one meaning (attention) with rules, or not use it.
- Toast is success-only.
- There's no checkbox or radio button.
- There's no error colour, which the failure states will need.
- Button has a fixed height and 20px text at large size. A descriptive label like "Accept Rs 10,000 · repay Rs 10,300 on 28 Jul" probably won't fit. I'd rather change Button (a secondary line and a minimum height) than loosen principle 1. The audit will confirm.

The full audit against my scope comes next (docs/01-system-audit.md).

## Assumptions
- The user is salaried, with a limit of Rs 10,000. Salary of Rs 68,000 lands in NovaPay on the 28th. Today is 7 Jul, so the advance is due 28 Jul (21 days).
- The fee is 3% of the amount paid out, charged once, and added to the repayment.
- A second user is paid into a bank account, so the wallet can't see their income. They see the "Verify your salary" home card.
- Wallet balance is Rs 4,250 for both personas (taken from the starter screen).
- The balance on 25 Jul is Rs 1,800.
- On payday at 6pm the balance is Rs 1,800 / 9,600 / 6,500 / 1,800, depending on why the repayment wasn't collected (salary didn't arrive / arrived short / balance dropped / salary moved to a bank). Nothing moves after payday, so later dates carry it forward. The July spending and the payday rows for each cause are sample data, not policy.
- The payout lands in the NovaPay wallet the moment the advance is accepted, so the receipt can say "It's in your NovaPay wallet."
- One advance at a time: while an advance is open (not yet repaid), no new one is offered.
- The record of the agreement lives in the app: the advance's details, opened from its card on the home screen. Whether a copy is also sent is still a question.
- Verification status is known before applying. The product reference says income may or may not be verified at application, so this is my assumption.
- Collection is automatic, from the NovaPay wallet, on payday once salary has landed, at a fixed time (6pm), with explicit and separate permission given at accept. The reminder before the due date says exactly when. Collection is attempted only when salary lands, never from other incoming money.
- Automatic collection is full amount only. The user can choose to pay part manually (shown on the late screen, stubbed in the prototype).
- Reminder before the due date: 25 Jul at 10:00. The not-collected notice: 6pm on the day the attempt fails.
- Late reminders every 7 days (4, 11, 18 and 25 Aug). This cadence is a placeholder.
- Notice before default: 20 Aug, never paused, even after a payroll delay is reported. Default happens on day 30 (27 Aug).
- In the reviewer scenarios, a payroll delay is reported on 2 Aug, and only when the salary didn't arrive.
- A reduced payout always drops to a lower tier (e.g. 10,000 → 5,000), so the fee is always a whole number of rupees. It needs fresh consent to the new terms. A reduced payout can't go below Rs 5,000, the lowest tier. That case isn't designed.
- After a default, new advances are paused and the wallet is never frozen.
- After default, automatic collection stops. We ask for permission again, or the user pays manually.
- Default consequences shown in the prototype are only the ones above: new advances are paused, automatic collection stops, and the wallet is never frozen. They're shown as stated, without a placeholder label. Anything else (credit reporting, collections, legal steps) isn't shown until compliance confirms it.
- Data uses the glossary field names. The screens say "declined".
- **What I'd push for, pending finance and compliance:** no late fees and no compounding. The screens won't promise "never" until it's confirmed.

## What I'd want to know
- Is there a required cancellation window?
- Is the fee legally interest? Do we need a key facts statement? Is interest (riba) a concern for this market?
- What exactly happens at default: which credit bureau, collections, any legal steps?
- Should a reported payroll delay move the default date?
- Collection: can we retry when funds are short? How often? Is any amount protected for the user?
- What happens if a reduced payout is needed from the lowest tier?
- How is the limit set?
- How long can a collection permission legally last, and what does re-asking after default require?
- Can we use wallet data to check eligibility before an application, and what consent does that need?
- Besides the in-app details, is a copy of the agreement also sent (SMS, email), and in which languages (Urdu and English)?
- Why are people actually late (payroll delays, job loss, spending)? What does the data say?
- Does a re-check after a decline hit the credit bureau?
- The product reference cites "Trust rules" that don't exist, and its decision wording isn't consistent. Which is the source of truth?

## How I'd know it's good (60–90 days)
- **Understanding:** when asked right after accepting, borrowers can state what they'll repay and when.
- **Fewer support contacts** about fees and the due date.
- **The spread of amounts chosen doesn't drift towards the maximum.**
- **Late borrowers contact us or repay** rather than going quiet. Complaints about reminders and opt-outs stay low.
- **Repeat borrowing:** how often someone borrows again within 7 days of repaying. It should stay low.
- **What it should never do,** whatever it does to conversion:
  - contact anyone other than the borrower,
  - freeze the wallet,
  - take more than what's owed,
  - hide the cost until after the user commits.


  ## Response to the AI critique
| Point | My call | Why |
|---|---|---|
| "Failures" describes things I never saw | Accept | Rewritten as evidence and risks |
| The entry card diagnosis was backwards | Accept | "See your offer" is the claim |
| No "what's working" and no position on conversion | Accept | Both added |
| Why someone ends up late | Accept | It decides the tone. A grace rule was added in v2, then removed in round 2: days late are shown truthfully. |
| Contradictions (salary sweep, personal info, red) | Accept | Lines drawn in the principles |
| Separate permission to collect from the wallet | Accept | Becomes the checkbox, so consent is specific rather than a generic "I agree" |
| Default consequences at accept | Accept | One line plus details |
| The limit grows after on-time repayments | Accept, removed | It rewards repeat borrowing |
| No cancellation window | Adapt | Moved to "want to know" |
| "No late fees, ever" | Adapt | "Pushing for, pending confirmation" |
| Cut v1's separate "Record of the advance" screen | Accept | Moved to "With more time". *Later (chat 4): built as the advance's details, opened from home.* |
| Your suggested late path left out the reminder before the due date | **Reject** | It's the one chance to prevent two of the four causes of lateness: salary moved to a bank, and money spent before collection |
| Keep a receipt after accepting (my addition, not a critique point) | Keep | The accept moment isn't finished until the user knows it worked. It says where the record lives: in the app, from the advance on the home screen (decided in chat 4) |
| Round 2: my reasons for the receipt and the reminder were weak | Accept | Reasons replaced, see the two rows above |
| Cut the credit decline, default screen, success screen | Accept | Moved to "with more time" |

### Round 2
| Point | My call | What changed |
|---|---|---|
| "Collection failed" almost can't happen under my own rules | Adapt | Collection is at 6pm on payday once salary has landed, and the reminder before the due date says when. Renamed to "Not collected on payday", with its causes listed. "Spent before collection" kept, since 6pm makes it possible |
| My persona's salary lands in NovaPay, which undercuts the "needs verification" state | Accept | Added a second persona paid into a bank account, who sees "Verify your salary". "Verification is known before applying" is now listed as an assumption |
| The 5-day grace period wasn't in the reference or my assumptions | Accept | Removed. Days late count from 28 Jul and are shown truthfully. The user can report a payroll delay and reminders pause |
| Daily retries contradicted my open question, and no part-payment was possible | Adapt | Collection is attempted once each time new money lands, never on a daily loop; retries stay an open question. Automatic collection is full amount only; the user can pay part manually (stubbed) |
| Default consequences at accept are things I don't know yet | Accept | Marked as placeholder copy until compliance confirms, and listed as an assumption |
| The red rule couldn't decide "collection failed" | Accept | Red only on the event that failed, never on the status card or late screen. Status uses the attention colour |
| Principle 5 had no screen to fail on | Accept | Added home after accepting, where the receipt's Done goes |
| The descriptive button label probably won't fit Button | Adapt | Change Button (secondary line, minimum height) rather than loosen principle 1. Main label "Accept Rs 10,000", secondary line "Repay Rs 10,300 on 28 Jul". The audit will confirm |
| "It converts, so people understand it" doesn't follow | Accept | Rewritten. The fee and payday items are marked as from the product reference, not observed |
| Metrics missed repeat borrowing | Accept | Added repeat borrowing within 7 days of repaying |
| The collection permission had no end date | Adapt | It ends when the advance is repaid or at the default date, whichever comes first. After default, automatic collection stops and we ask again. Question added to "want to know" |