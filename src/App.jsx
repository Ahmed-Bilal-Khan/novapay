import { useEffect, useMemo, useRef, useState } from "react";
import ChooseAmount from "./screens/ChooseAmount";
import ReviewAccept from "./screens/ReviewAccept";
import Receipt from "./screens/Receipt";
import Home from "./screens/Home";
import AdvanceDetails from "./screens/AdvanceDetails";
import PayYourselfPlaceholder from "./screens/PayYourselfPlaceholder";
import ReviewerState from "./review/ReviewerState";
import { REVIEW_STATES, START_STATE, currentReviewState } from "./review/reviewStates";
import {
  acceptTerms,
  getActivity,
  getOffer,
  getReminders,
  getStatus,
  getTerms,
  getWallet,
  reducePayout,
  scenario,
} from "./advance/salaryAdvance";

const PROCESSING_MS = 1500; // simulated time to confirm an acceptance

/**
 * NovaPay prototype in a mobile frame. Screens are built from NovaKit Lite
 * (./novakit) and read every amount and date from the salary-advance module.
 */

// Mobile frame: a fixed 390×844 device. The AppBar and action area stay put; main scrolls.
// The action area is the sticky bottom of the frame: a screen puts its main action there
// so it stays visible while the content scrolls. Nothing is shown when it's empty.
// `overlay` is for things that sit above the content, like a Toast. It's placed at the
// bottom of the content area, just above the action area, never over the actions.
// `sheet` is for a modal BottomSheet: it covers the whole frame, actions included.
//
// Every screen gets the same arrival: the page title becomes `title`, and after a screen
// change focus moves to the screen's <h1>, so a screen reader announces where you are.
// The first screen on page load keeps the browser's own focus.
// A reviewer jump arrives quietly: focus stays on the reviewer entry that was chosen.
let hasChangedScreen = false; // set by App's navigation, never during render
let quietArrival = false; // set by a reviewer change; any other navigation clears it

function PhoneFrame({ title, appBar, actions = null, overlay = null, sheet = null, children }) {
  const frameRef = useRef(null);

  useEffect(() => {
    document.title = title;
    if (hasChangedScreen && !quietArrival) frameRef.current?.querySelector("h1")?.focus();
  }, [title]);

  return (
    <div
      ref={frameRef}
      className="relative w-[390px] h-[844px] shrink-0 flex flex-col bg-neutral-50 rounded-[28px] shadow-xl overflow-hidden border border-neutral-300"
    >
      {appBar}

      {/* The overlay sits at the bottom of the content area, so it never covers the actions. */}
      <div className="relative flex-1 min-h-0 flex flex-col">
        <main className="phone-scroll flex-1 min-h-0 overflow-y-auto p-4 space-y-4">{children}</main>
        {overlay}
      </div>

      {actions ? (
        <footer className="shrink-0 bg-white border-t border-neutral-200 p-4 space-y-3">{actions}</footer>
      ) : null}

      {sheet}
    </div>
  );
}

// The reviewer's data: which module scenario the phone reads, and whether a payroll delay
// was reported. Set by the reviewer index (src/review/reviewStates.js) and "My salary is late".
const START_REVIEW = { data: "S1", payroll_delay: false };

export default function App() {
  const [review, setReview] = useState(START_REVIEW);
  const [screen, setScreen] = useState("home");
  const [amount, setAmount] = useState(null);
  const [liveAdvance, setLiveAdvance] = useState(null); // accepted in the live flow on 7 Jul
  const [reducedTerms, setReducedTerms] = useState(null);
  const [outcome, setOutcome] = useState("works");
  const failedOnce = useRef(new Set()); // terms ids whose first attempt has already failed

  // Everything the screens see comes from the module's scenario(): persona B is S2 (7 Jul
  // only); persona A on 7 Jul is the live flow, with whatever the reviewer accepted; later
  // dates use the scenario's Rs 10,000 advance, because each cause's balances are built
  // around Rs 10,300 owed. The not-collected cause is the scenario default (salary didn't arrive).
  const scene = useMemo(
    () => scenario(review.data, { payroll_delay: review.payroll_delay }),
    [review.data, review.payroll_delay]
  );
  const { persona, today } = scene;
  const isLive = review.data === "S1";
  const advance = isLive ? liveAdvance : scene.advance;
  // The offer knows about the open advance: one advance at a time (module rule).
  const offer = getOffer(persona, today, advance);
  const terms = amount != null ? getTerms(persona, amount, today) : null;
  const status = advance ? getStatus(advance, today) : null;
  // S11's "Hide this message" on Home: kept for this failed attempt until the app is opened
  // again (a reload clears this state) or the reviewer starts again. Not saved anywhere.
  const [hiddenNotice, setHiddenNotice] = useState(null);
  const noticeKey = status?.last_attempt ? `${advance.id}:${status.last_attempt.date}` : null;

  // Only an eligible offer reaches the offer screens (S3, S4, S7). Anyone else (persona B,
  // or someone with an open advance) is sent to home. The terms screens need terms; without
  // them they go back to the amounts. Screens after accepting need the advance.
  // Mid-flow, the advance is set only after accepting, so S4 and S7 stay reachable until then.
  const OFFER_SCREENS = ["chooseAmount", "terms", "reduced"];
  let current = screen;
  if (OFFER_SCREENS.includes(screen) && offer.eligibility !== "eligible") current = "home";
  else if (screen === "terms" && terms == null) current = "chooseAmount";
  else if (screen === "reduced" && reducedTerms == null) current = "chooseAmount";
  else if (["receipt", "advanceDetails", "payYourself"].includes(screen) && advance == null) current = "home";

  function go(next) {
    hasChangedScreen = true;
    quietArrival = false;
    setScreen(next);
  }

  function leaveToHome() {
    setAmount(null); // nothing is pre-selected next time
    setReducedTerms(null);
    failedOnce.current.clear(); // the next run's first attempt fails again
    go("home");
  }

  // Reviewer only: open a state from the index, set up from the module's scenario(). Every
  // jump starts clean: the outcome, the payroll delay, a hidden notice and the live advance
  // are all set by the state, and a first attempt fails again. Focus stays in the panel.
  function jump(id) {
    const target = REVIEW_STATES[id] ?? REVIEW_STATES[START_STATE];
    const source = target.source ? scenario(target.source) : null;
    setAmount(target.screen === "terms" ? source.terms.applied_amount : null);
    setReducedTerms(null);
    setLiveAdvance(source?.advance ?? null);
    setOutcome(target.outcome ?? "works");
    setHiddenNotice(null);
    failedOnce.current.clear();
    setReview({ data: target.data, payroll_delay: target.payroll_delay === true });
    hasChangedScreen = true;
    quietArrival = true;
    setScreen(target.screen);
  }

  // Simulates sending the acceptance. Resolves to "failed" (the screen shows the failure and
  // stays), or moves to the receipt or the reduced payout and resolves to "moved".
  // The screen passes what was actually ticked; the module refuses without it.
  // acceptTerms is idempotent: a second tap returns the same advance, never a second one.
  async function accept(forTerms, consent) {
    await new Promise((resolve) => setTimeout(resolve, PROCESSING_MS));
    if (outcome === "network" && !failedOnce.current.has(forTerms.id)) {
      failedOnce.current.add(forTerms.id);
      return "failed";
    }
    if (outcome === "reduced" && forTerms.reduced_from == null) {
      const lower = reducePayout(forTerms);
      if (lower) {
        setReducedTerms(lower);
        go("reduced");
        return "moved";
      }
    }
    const result = acceptTerms(forTerms, consent, today);
    if (result.error) return "failed"; // unreachable: the screen only calls this once the box is ticked
    setLiveAdvance(result);
    go("receipt");
    return "moved";
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start py-6">
      {/* The phone is centred on the page. Reviewer controls (src/review/) hang off its right
          side, never inside it, and come after it in the DOM so Tab reaches the phone first. */}
      <div className="relative">
        {current === "home" ? (
          <Home
            Frame={PhoneFrame}
            today={today}
            persona={persona}
            offer={offer}
            wallet={getWallet(persona, advance, today)}
            activity={getActivity(persona, advance, today)}
            advance={advance}
            status={status}
            noticeHidden={noticeKey != null && hiddenNotice === noticeKey}
            onHideNotice={() => setHiddenNotice(noticeKey)}
            onStartAdvance={() => go("chooseAmount")}
            onStartVerification={() => go("verifySalary")}
            onSeeAdvance={() => go("advanceDetails")}
          />
        ) : null}

        {current === "chooseAmount" ? (
          <ChooseAmount
            Frame={PhoneFrame}
            offer={offer}
            amount={amount}
            onAmountChange={setAmount}
            onContinue={() => go("terms")}
            onLeave={leaveToHome}
          />
        ) : null}

        {current === "terms" ? (
          <ReviewAccept
            key={terms.id}
            Frame={PhoneFrame}
            terms={terms}
            onAccept={(consent) => accept(terms, consent)}
            onChangeAmount={() => go("chooseAmount")}
            onLeave={leaveToHome}
          />
        ) : null}

        {/* S7: the same screen in its reduced-payout form, with fresh, unticked consent. */}
        {current === "reduced" ? (
          <ReviewAccept
            key={reducedTerms.id}
            Frame={PhoneFrame}
            terms={reducedTerms}
            onAccept={(consent) => accept(reducedTerms, consent)}
            onLeave={leaveToHome}
          />
        ) : null}

        {current === "receipt" ? <Receipt Frame={PhoneFrame} advance={advance} onDone={leaveToHome} /> : null}

        {current === "advanceDetails" ? (
          <AdvanceDetails
            Frame={PhoneFrame}
            advance={advance}
            status={status}
            reminders={getReminders(advance, today)}
            onBack={() => go("home")}
            onPayYourself={() => go("payYourself")}
            // "My salary is late": the same review state as the reviewer checkbox, so the
            // scenario reports it on 2 Aug (my Assumption). Stays on this screen.
            onReportPayrollDelay={() => setReview({ ...review, payroll_delay: true })}
          />
        ) : null}

        {/* S2's "Start verification": the same labelled placeholder, with its own words. */}
        {current === "verifySalary" ? (
          <PayYourselfPlaceholder
            Frame={PhoneFrame}
            onBack={() => go("home")}
            title="Verify your salary"
            backLabel="Back to home"
            heading="Placeholder: verify your salary"
            line="This screen isn't built yet. Nothing has been shared."
          />
        ) : null}

        {current === "payYourself" ? (
          <PayYourselfPlaceholder Frame={PhoneFrame} onBack={() => go("advanceDetails")} />
        ) : null}

        {/* top-0 bottom-0: the panel is exactly as tall as the phone, so nothing in it sits
            below the phone; its index scrolls inside. */}
        <aside aria-labelledby="reviewer-controls-title" className="absolute left-full top-0 bottom-0 ml-6">
          <ReviewerState
            current={currentReviewState({
              data: review.data,
              payroll_delay: review.payroll_delay,
              screen: current,
              hasAdvance: advance != null,
              outcome,
            })}
            outcome={outcome}
            onJump={jump}
          />
        </aside>
      </div>
    </div>
  );
}
