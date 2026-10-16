import { useState } from "react";
import {
  AppBar,
  Card,
  ListRow,
  Button,
  AmountText,
  Toast,
} from "./novakit";

/**
 * Starter app — a minimal NovaPay home screen rendered in a mobile frame.
 *
 * This is your canvas. The salary-advance experience (offer → terms →
 * accept, plus the not-good path) does NOT exist yet — that's what you'll
 * build. Add screens/routing however you like; everything should be built
 * from NovaKit Lite (./novakit). See README.md.
 */
export default function App() {
  const [toast, setToast] = useState(false);

  function handleSeeOffer() {
    // TODO (candidate): this is where the salary-advance flow begins.
    setToast(true);
    setTimeout(() => setToast(false), 2200);
  }

  // The sticky action area at the bottom of the frame. A screen puts its main action
  // here so it stays visible while the content scrolls. Nothing is shown when empty.
  const actions = null;

  return (
    <div className="min-h-screen w-full flex justify-center items-start gap-6 py-6">
      {/* Reviewer controls (src/review/) go beside the frame, never inside it. */}

      {/* Mobile frame: a fixed 390×844 device. The AppBar and action area stay put; main scrolls. */}
      <div className="relative w-[390px] h-[844px] shrink-0 flex flex-col bg-neutral-50 rounded-[28px] shadow-xl overflow-hidden border border-neutral-300">
        <AppBar title="NovaPay" />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
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
            <Button size="lg" onClick={handleSeeOffer}>
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
        </main>

        {actions ? (
          <footer className="shrink-0 bg-white border-t border-neutral-200 p-4 space-y-3">{actions}</footer>
        ) : null}

        <Toast open={toast} message="TODO: build the salary-advance flow" />
      </div>
    </div>
  );
}
