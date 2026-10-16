import { useEffect, useRef, useState } from "react";
import { AppBar, Card, Choice, Button, AmountText, Toast, formatAmount } from "../novakit";
import { FEE_PERCENT, formatDate, formatTime } from "../advance/salaryAdvance";

const MISSING_MESSAGE = "Choose an amount to continue.";
const TOAST_MS = 4000;

// "Rs 5,000 or Rs 10,000", "Rs 5,000, Rs 10,000 or Rs 15,000"
function listAmounts(amounts) {
  const words = amounts.map((a) => formatAmount(a));
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;
}

// Why a tier can't be chosen: the reason under the option, and the toast when it's tapped.
// Only reasons the module returns are listed.
const BLOCKED = {
  over_limit: {
    reason: (offer) => `Above your limit of ${formatAmount(offer.limit)}.`,
    toast: (offer, tier, available) =>
      `${formatAmount(tier.amount)} is above your ${formatAmount(offer.limit)} limit. Choose ${listAmounts(available)}.`,
  },
};

/**
 * S3: choose an amount.
 * Everything shown comes from `offer` (getOffer). The caller only renders this
 * screen for an eligible offer.
 *
 * - Nothing is pre-selected. `amount` is controlled by the caller so it survives
 *   going to the terms and back.
 * - "Review terms" stays enabled. With nothing chosen it shows a neutral message
 *   next to the button, announced every time, and moves focus to the question.
 * - The tier above the limit stays focusable with its reason. Tapping it shows a
 *   neutral toast that says why and what to choose instead.
 */
export default function ChooseAmount({ Frame, offer, amount, onAmountChange, onContinue, onLeave }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);
  const fieldsetRef = useRef(null);
  const timers = useRef({});

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const due = formatDate(offer.due_date);
  const available = offer.tiers.filter((t) => t.available).map((t) => t.amount);

  function handleChange(value) {
    clearTimeout(timers.current.message);
    setMessage("");
    onAmountChange(value);
  }

  function handleContinue() {
    if (amount != null) {
      onContinue(amount);
      return;
    }
    // Clear, then set again, so the status is announced on every tap, after the
    // focus move has been read.
    setMessage("");
    fieldsetRef.current?.focus();
    clearTimeout(timers.current.message);
    timers.current.message = setTimeout(() => setMessage(MISSING_MESSAGE), 150);
  }

  function showBlocked(tier) {
    const text = BLOCKED[tier.blocked_reason]?.toast(offer, tier, available);
    if (!text) return;
    setToast(text);
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToast(null), TOAST_MS);
  }

  return (
    <Frame
      title="Choose an amount: NovaPay"
      appBar={<AppBar title="Choose an amount" onBack={onLeave} backLabel="Back to home" />}
      actions={
        <>
          <div>
            <div role="status" className={message ? "text-body text-neutral-900 pb-3" : ""}>
              {message}
            </div>
            <Button size="lg" subLabel="Nothing is borrowed yet" onClick={handleContinue}>
              Review terms
            </Button>
          </div>
          <Button size="lg" variant="secondary" onClick={onLeave}>
            Back to home
          </Button>
        </>
      }
      overlay={<Toast open={toast != null} message={toast} variant="neutral" />}
    >
      {/* Four lines at 360px, so the first two amounts sit above the fold on a 360×640 phone. */}
      <Card>
        <p className="text-body text-neutral-900">
          A short-term loan with a <span className="font-semibold">{FEE_PERCENT}%</span> fee, charged once. If you
          accept, we take the full amount from your NovaPay wallet automatically at{" "}
          <span className="font-semibold">{formatTime(offer.collection_time)}</span> on{" "}
          <span className="font-semibold">{due}</span>, once your salary arrives.
        </p>
      </Card>

      <Card>
        <fieldset
          ref={fieldsetRef}
          tabIndex={-1}
          className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
        >
          <legend>
            <h2 className="text-title text-neutral-900">How much do you want to borrow?</h2>
            <span className="block text-caption text-neutral-700 mt-1">
              You can borrow up to {formatAmount(offer.limit)}.
            </span>
          </legend>
          <div className="mt-2 divide-y divide-neutral-200">
            {offer.tiers.map((tier) => (
              <Choice
                key={tier.amount}
                type="radio"
                name="advance-amount"
                value={String(tier.amount)}
                checked={amount === tier.amount}
                onChange={() => handleChange(tier.amount)}
                onClick={tier.available ? undefined : () => showBlocked(tier)}
                label={<AmountText amount={tier.amount} size="body" className="font-semibold" />}
                description={
                  tier.available ? (
                    <>
                      <span className="block text-body font-semibold text-neutral-900">
                        You repay {formatAmount(tier.total)} on {due}
                        <span className="sr-only">.</span>
                      </span>
                      <span className="block">Fee {formatAmount(tier.fee)}</span>
                    </>
                  ) : null
                }
                disabled={!tier.available}
                disabledReason={BLOCKED[tier.blocked_reason]?.reason(offer) ?? null}
              />
            ))}
          </div>
          <p className="text-body text-neutral-700 mt-3">
            We'll confirm the final amount before you accept. It may be lower than you choose.
          </p>
        </fieldset>
      </Card>
    </Frame>
  );
}
