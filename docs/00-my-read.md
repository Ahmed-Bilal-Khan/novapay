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
- It converts, so people understand roughly what it is and want it.
- A fixed one-time fee is simpler to understand than interest that grows.
- Repayment is tied to payday, with a single repayment.
- The three tiers are simple choices; no slider, no free-text amount.
- Amounts are formatted consistently through one component.

## My position on conversion
I accept lower conversion in these places, on purpose:
1. Full cost and due date on the same screen as the accept button.
2. A separate, explicit permission to collect from the wallet.
3. Verification shown up front, so unverified users don't start an application.
4. No default amount, and no urgency.

## Why someone ends up late
Repayment is collected after salary lands in the wallet. A borrower is only late if:
- **payroll was delayed** (not their fault),
- **they lost their job** (not their fault),
- **their salary moved to a bank account**, or
- **they spent the money before collection.**

The first two aren't the user's fault, and that's why the late experience should be calm and practical, never accusing.

**Due date vs salary arriving:** the advance is due on 28 Jul. If salary hasn't landed by then, we wait for it, and the user isn't treated as late until 5 days after the due date. 

# Predatory behaviors we want to avoid

**Entry**
- Claiming an offer exists before eligibility is known.
- Defaulting to the largest amount.
- Countdown timers or "offer expires".
- Asking for access to contacts, photos or SMS in exchange for a bigger limit. (Income documents to check affordability are fine. Personal data harvesting never is.)

**Cost**
- Showing the fee after commitment.
- Hiding when and from where repayment is taken.
- Calling it "no interest". 3% over 21 days is about 52% a year.

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
1. **The number you tap is the number you owe.** On the screen with the accept button, the amount received, the fee in rupees, the total and the due date are all visible without scrolling or tapping. The button names the amount and the date.
2. **Know before you ask.** No user reaches a "no" that could have been known before they applied. Only the credit check happens at application.
3. **Smaller is never harder.** Tiers in ascending order, nothing pre-selected, the same visual weight for each, no timers, no expiry.
4. **Late is a situation, not a character flaw.**
   - At most 2 reminders a week.
   - None between 10pm and 8am.
   - No amount, "loan" or "overdue" on the lock screen.
   - Never sent to anyone but the borrower.
   - Red only on a failed action, never on a person's status.
5. **Their wallet stays theirs.** The advance is shown separately from their own money. Collection only ever takes what's owed, at most once a day. The wallet is never frozen. 

## A moment that shouldn't exist
**"Declined: income unverified."**
- Verification status is known before anyone applies. So instead of letting the user apply and then declining them, the home card shows verification as a step to complete first: "Verify your salary to unlock an advance", with the steps.
- No application is made, so no decline is recorded.
- **Counter-argument I accept:** using wallet data to pre-screen needs the user's consent, and the backend's decline reason would need to change. It's a product change, not just copy.

## Scope
Built as separate states the reviewer can jump to, so the depth goes into two places.

**In depth: terms + accept**
- Tiers with the fee in rupees, the total and the date. The over-limit tier is shown blocked, with the reason.
- What happens if it's late, in one line, with details behind an expandable section. Default consequences are stated here, at accept.
- A separate collection permission: "I allow NovaPay to collect Rs 10,300 from my wallet on 28 Jul, or when my salary lands after that." It starts unticked.
- A descriptive button: "Accept Rs 10,000 · repay Rs 10,300 on 28 Jul".
- After the tap: processing, double-tap protection, network failure, and a reduced payout that needs fresh consent.
- A receipt of what was agreed.

**In depth: the late path (my one bad-news path)**
Reminder before the due date → collection failed → late → notice before default.

**Thin**
The home card: eligible vs needs verification. The rest of the "shouldn't exist" case is argued here in writing.

**With more time**
Credit-history decline, the default screen itself, successful repayment, viewing the advance later, early repayment.

## First impressions of NovaKit
- Card and Panel are the same component; only the border differs, and Card's border is a hardcoded colour.
- The secondary button's grey text makes it look disabled. On an accept screen, the "no" option would look unavailable.
- The only status colour is success. Amber is the obvious colour to grab for a late screen, which is exactly what I want to avoid.
- Toast is success-only.
- There's no checkbox or radio button.
- There's no error colour, which the failure states will need.

The full audit against my scope comes next (docs/01-system-audit.md).

## Assumptions
- The user is salaried, with a limit of Rs 10,000. Salary of Rs 68,000 lands in NovaPay on the 28th. Today is 7 Jul, so the advance is due 28 Jul (21 days).
- The fee is 3% of the amount paid out, charged once, and added to the repayment.
- Collection is automatic, from the NovaPay wallet, after salary lands, with explicit and separate permission given at accept. It's the full amount only and never partial.
- A reduced payout needs fresh consent to the new terms.
- After a default, new advances are paused and the wallet is never frozen.
- Data uses the glossary field names. The screens say "declined".
- **What I'd push for, pending finance and compliance:** no late fees and no compounding. The screens won't promise "never" until it's confirmed.

## What I'd want to know
- Is there a required cancellation window?
- Is the fee legally interest? Do we need an annualised rate or a key facts statement? Is interest (riba) a concern for this market?
- What exactly happens at default: which credit bureau, collections, any legal steps?
- Collection: can we retry when funds are short? How often? Is any amount protected for the user?
- Can we use wallet data to check eligibility before an application, and what consent does that need?
- How is the record of agreement delivered and stored, and in which languages (Urdu and English)?
- Why are people actually late (payroll delays, job loss, spending)? What does the data say?
- Does a re-check after a decline hit the credit bureau?
- The product reference cites "Trust rules" that don't exist, and its decision wording isn't consistent. Which is the source of truth?

## How I'd know it's good (60–90 days)
- **Understanding:** when asked right after accepting, borrowers can state what they'll repay and when.
- **Fewer support contacts** about fees and the due date.
- **The spread of amounts chosen doesn't drift towards the maximum.**
- **Late borrowers contact us or repay** rather than going quiet. Complaints about reminders and opt-outs stay low.
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
| Why someone ends up late | Accept | It decides the tone. Grace rule added. |
| Contradictions (salary sweep, personal info, red) | Accept | Lines drawn in the principles |
| Separate permission to collect from the wallet | Accept | Becomes the checkbox, which answers the "legal theatre" worry |
| Default consequences at accept | Accept | One line plus details |
| The limit grows after on-time repayments | Accept, removed | It rewards repeat borrowing |
| No cancellation window | Adapt | Moved to "want to know" |
| "No late fees, ever" | Adapt | "Pushing for, pending confirmation" |
| Cut the record | **Reject (partly)** | The receipt right after accepting *is* the accept moment, and "no record" is on my own predatory list. Only the later "view your advance" screens are cut. |
| Cut the pre-due reminder | **Reject** | The brief names "a repayment is coming due". The late path starts there. |
| Cut the credit decline, default screen, success screen | Accept | Moved to "with more time" |