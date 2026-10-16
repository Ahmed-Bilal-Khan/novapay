import { useState } from "react";
import { AppBar, Card, ListRow, Button, AmountText } from "./novakit";
import ChooseAmount from "./screens/ChooseAmount";
import { PERSONAS, PROTOTYPE_TODAY, getOffer } from "./advance/salaryAdvance";

/**
 * NovaPay prototype in a mobile frame. Screens are built from NovaKit Lite
 * (./novakit) and read every amount and date from the salary-advance module.
 */

// Mobile frame: a fixed 390×844 device. The AppBar and action area stay put; main scrolls.
// The action area is the sticky bottom of the frame: a screen puts its main action there
// so it stays visible while the content scrolls. Nothing is shown when it's empty.
function PhoneFrame({ appBar, actions = null, children }) {
  return (
    <div className="relative w-[390px] h-[844px] shrink-0 flex flex-col bg-neutral-50 rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
      {appBar}

      <main className="phone-scroll flex-1 min-h-0 overflow-y-auto p-4 space-y-4">{children}</main>

      {actions ? (
        <footer className="shrink-0 bg-white border-t border-neutral-200 p-4 space-y-3">{actions}</footer>
      ) : null}
    </div>
  );
}

export default function App() {
  const persona = PERSONAS.A;
  const today = PROTOTYPE_TODAY;
  const offer = getOffer(persona, today);

  const [screen, setScreen] = useState("home");
  const [amount, setAmount] = useState(null);

  // Only an eligible offer reaches the salary-advance screens. Anyone else (persona B)
  // is sent to home.
  const current = screen !== "home" && offer.eligibility !== "eligible" ? "home" : screen;

  function leaveToHome() {
    setAmount(null); // nothing is pre-selected next time
    setScreen("home");
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-start gap-6 py-6">
      {/* Reviewer controls (src/review/) go beside the frame, never inside it. */}

      {current === "home" ? (
        <Home Frame={PhoneFrame} onStartAdvance={() => setScreen("chooseAmount")} />
      ) : null}

      {current === "chooseAmount" ? (
        <ChooseAmount
          Frame={PhoneFrame}
          offer={offer}
          amount={amount}
          onAmountChange={setAmount}
          onContinue={() => setScreen("terms")}
          onLeave={leaveToHome}
        />
      ) : null}

      {current === "terms" ? <TermsPlaceholder Frame={PhoneFrame} onBack={() => setScreen("chooseAmount")} /> : null}
    </div>
  );
}

// The starter home screen. Only "See your offer" is wired, to start the advance.
function Home({ Frame, onStartAdvance }) {
  return (
    <Frame appBar={<AppBar title="NovaPay" />}>
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
          See your offer
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

// PLACEHOLDER until S4 (terms + accept) is built. It exists so "Review terms" leads
// somewhere honest, and Back returns to the chosen amount.
function TermsPlaceholder({ Frame, onBack }) {
  return (
    <Frame appBar={<AppBar title="Salary advance" onBack={onBack} />}>
      <Card className="space-y-1">
        <p className="text-body font-semibold text-neutral-900">Placeholder: terms and accept</p>
        <p className="text-body text-neutral-700">This screen isn't built yet. Nothing has been borrowed.</p>
      </Card>
    </Frame>
  );
}
