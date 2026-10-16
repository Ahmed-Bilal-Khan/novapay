# My Problem Understanding
This module waas shipped fast and is rough around the edges. Especially during, telling someone what a loan will cost them, that they've been declined or a repayment is coming due. These are the things that the manager is focused on and are something we must address well in the prototype.

# Failures in the current flow
From the read I have there are a few things that standout.

During entry, there is a sense of pre approval and doesn't answer the borrowers question honestly "Can I get the ammount?". We can address this by having the card be more honest, it should be dynamic according to their situation rather than being static, whether they are verified, eligible, late or already on an advance.

Fee as a percentage only maybe hard to understand for users, we want to add more transparency. Each tier should show its total and the date. If you are over the limit it should be shown as a reason rather than throwing an error at you.

Acceptance need to be transparent and the actions need to be descriptive so the user know what they are clicking e.g, "continue" is too vague for an action that takes out a loan. They know what the terms are take their agreement as well. Agreement cant be prechecked. 

Decline should have proper reasoning that the user can understand and doesn't leave them confused regarding the state. It should tell them why something has happened and whats the next action for them rather than having them re apply constantly. Some cases the verfication should be something the user already knows before applying, which mean if they are not verified the card should not take them to a flow that will tell them the same thing after 3 clicks. 

If something is late reminders should be in a proper scheduled calm format. Failed states, lates state and warning before going into default, explain what happens if something is defaulted so the user is not caught off guard.

If the user has taken a loan out they should know how much they owe, mixing with their balance might caught off guard by this. So seperate the borrowed amount for clarity.

# Predatory behaviors we want to avoid

Entry:
- The starters "You may qualify" and "See your offer" implies a pre-approval. Which is not the case.
- Picking the largest amount by default
- Countdown timers to create urgency.
- "Offer expires" to nudge users
- Asking for personal info or similar things to increase limits

Terms: 
- Showing fee after the commitment
- Hiding when and from where the money is taken
- due date before the payday
- not being upfront about the fee and whether it is one time or over time interest

Accept:
- Prechecked consent check box
- A "Continue" button that actually takes the loan
- Tone of voice that induces some sort of guilt 
- No record of agreement

Decline:
- No with no reason given to the user
- Encourging reapplication 
- Letting the user apply and then declining them.

Late:
- Lock screen notification that may be embarassing for the user and violate their privacy.
- Not letting the user do any transactions
- Tone of voice being threatning or having colors that represent danger to give the message.
- An option to pay a fee to extend the due date.
- Taking an individuals complete salary as soon as it is credited to them by the someone.
- Behaviour that feels like harrassment to the user.
- Getting flooded with constant notification, in-app messages for reminders.

# Scope of what I want to build
- I want to build this in the form of multiple flows rather than being in a straight line interacting with everything to see stuff. 

These will be separate instances that the reviewer can go to on the prototype of what that state would look like.


This means I want to cover a flow where there a happy path, the user is eligible and they apply for a advance. They are provided the necessary information upfront and even more details when they do enter the advance, there should be total transparency of what they are doing and what the amount is for each their, if any tier is blocked a message of why and checking off a checkbox that they agree before clicking on a descriptive CTA. Then to home with the advanced shown seperatly from their own money. Incase of a reduced payout be upfront and descriptive.

An instance where the user isn't verified, showing them upfront and giving them a message to provide more details and what steps to follow to earn verification.

A journey that shows how the declines are shown to the user, in case of a incase of credit score, give user the reason for such thing. 

What a notice would look like before the default.

After the default how the applicaiton, the user can still do transactions, advances are passed until repayment, amount owed be upfront about no late fees, honesty about full collection when money lands.

How does the application look like when a user is late to the repayment.

Reminders before due date and how successful repayment looks like.

Record of the advance what that looks like. 

# First Impression of NovaKit
Looks very basic and needs some basic components like checkboxes and radios to be more useful if we want to create the scope. The is also a missing color "Error" that might be needed in the applicaiton. 

# Assumptions
- The user is a salaried person and has a limit of Rs 10,000
- Today is 7 Jul. Salary of Rs 68,000 lands on the 28th, so the advance is due 28 Jul.
- Unverified is not a decline but a condition the user must meet.
- the limit grows after on-time repayments
- The fee is 3% of the amount paid out, charged once, and added to the repayment rather than taken off the payout.
- There are no charges beyond the 3% fee. 
- There’s no cancellation window.
- Taken automatically from the wallet on payday, after salary lands, with the user’s consent at accept.
- No late fees and no compounding, ever.
- After default, new advances are paused and the wallet is never frozen.
- Sent 3 days before, on the due day, when collection fails, then a fixed schedule while late. Daytime only.
- The user can be re-checked after a fixed period.
- Data uses the glossary’s field names. What the user sees says “declined”

# Research Sources
- https://www.investopedia.com/terms/p/predatory_lending.asp#toc-emerging-trends-in-predatory-lending
- https://corporatefinanceinstitute.com/resources/commercial-lending/predatory-lending/