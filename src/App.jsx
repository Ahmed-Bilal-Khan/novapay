import { useEffect, useRef, useState } from "react";
import { AppBar, Card, ListRow, Button, AmountText } from "./novakit";
import ChooseAmount from "./screens/ChooseAmount";
import ReviewAccept from "./screens/ReviewAccept";
import Receipt from "./screens/Receipt";
import AcceptOutcome from "./review/AcceptOutcome";
import { PERSONAS, PROTOTYPE_TODAY, acceptTerms, getOffer, getTerms, reducePayout } from "./advance/salaryAdvance";

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
let hasChangedScreen = false; // set by App's navigation, never during render

function PhoneFrame({ title, appBar, actions = null, overlay = null, sheet = null, children }) {
  const frameRef = useRef(null);

  useEffect(() => {
    document.title = title;
    if (hasChangedScreen) frameRef.current?.querySelector("h1")?.focus();
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

export default function App() {
  const persona = PERSONAS.A;
  const today = PROTOTYPE_TODAY;
  const offer = getOffer(persona, today);

  const [screen, setScreen] = useState("home");
  const [amount, setAmount] = useState(null);
  const [advance, setAdvance] = useState(null);
  const [reducedTerms, setReducedTerms] = useState(null);
  const [outcome, setOutcome] = useState("works");
  const failedOnce = useRef(new Set()); // terms ids whose first attempt has already failed
  const terms = amount != null ? getTerms(persona, amount, today) : null;

  // Only an eligible offer reaches the salary-advance screens. Anyone else (persona B)
  // is sent to home. The terms screens need terms; without them they go back to the amounts.
  let current = screen;
  if (screen !== "home" && offer.eligibility !== "eligible") current = "home";
  else if (screen === "terms" && terms == null) current = "chooseAmount";
  else if (screen === "reduced" && reducedTerms == null) current = "chooseAmount";
  else if (screen === "receipt" && advance == null) current = "home";

  function go(next) {
    hasChangedScreen = true;
    setScreen(next);
  }

  function leaveToHome() {
    setAmount(null); // nothing is pre-selected next time
    setReducedTerms(null);
    failedOnce.current.clear(); // the next run's first attempt fails again
    go("home");
  }

  function changeOutcome(next) {
    failedOnce.current.clear(); // a new choice starts from a first attempt again
    setOutcome(next);
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
    setAdvance(result);
    go("receipt");
    return "moved";
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start py-6">
      {/* The phone is centred on the page. Reviewer controls (src/review/) hang off its right
          side, never inside it, and come after it in the DOM so Tab reaches the phone first. */}
      <div className="relative">
        {current === "home" ? (
          <Home Frame={PhoneFrame} onStartAdvance={() => go("chooseAmount")} />
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

        <aside aria-label="Reviewer controls" className="absolute left-full top-0 ml-6">
          <AcceptOutcome value={outcome} onChange={changeOutcome} />
        </aside>
      </div>
    </div>
  );
}

// The starter home screen. Only the advance card's button is wired, to start the advance.
function Home({ Frame, onStartAdvance }) {
  return (
    <Frame title="NovaPay" appBar={<AppBar title="NovaPay" />}>
      <Card>
        <div className="text-caption text-neutral-500">Available balance</div>
        <div className="mt-1">
          <AmountText amount={4250} size="display" />
        </div>
      </Card>

      <Card className="space-y-3">
        <div>
          <div className="text-title text-neutral-900">Need cash before payday?</div>
          <div className="text-body text-neutral-700 mt-1">
            You may qualify for a NovaPay salary advance.
          </div>
        </div>
        <Button size="lg" onClick={onStartAdvance}>
          See amounts and costs
        </Button>
      </Card>

      <Card>
        <div className="text-caption text-neutral-500 mb-1">Recent activity</div>
        <ListRow
          icon="↑"
          title="Sent to Ahmed K."
          subtitle="Today, 2:14 PM"
          trailing={<AmountText amount={1500} size="body" />}
        />
        <ListRow
          icon="↓"
          title="Salary credited"
          subtitle="28 Jun"
          trailing={<AmountText amount={68000} size="body" />}
        />
        <ListRow
          icon="↑"
          title="Mobile top-up"
          subtitle="27 Jun"
          trailing={<AmountText amount={500} size="body" />}
        />
      </Card>
    </Frame>
  );
}
