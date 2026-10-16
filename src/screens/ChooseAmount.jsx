import { useId, useState } from "react";
import { AppBar, Card, Choice, Button, AmountText, formatAmount } from "../novakit";
import { FEE_PERCENT, formatDate, formatTime } from "../advance/salaryAdvance";

// Why a tier can't be chosen. Only reasons the module returns are listed.
const BLOCKED_REASONS = {
  over_limit: (offer) => `Above your limit of ${formatAmount(offer.limit)}.`,
};

/**
 * S3: choose an amount.
 * Everything shown comes from `offer` (getOffer). The caller only renders this
 * screen for an eligible offer.
 *
 * - Nothing is pre-selected. `amount` is controlled by the caller so it survives
 *   going to the terms and back.
 * - "Review terms" stays enabled. With nothing chosen it shows a neutral inline
 *   message and moves focus to the first amount.
 */
export default function ChooseAmount({ Frame, offer, amount, onAmountChange, onContinue, onLeave }) {
  const [showMissing, setShowMissing] = useState(false);
  const baseId = useId();
  const hintId = `${baseId}-hint`;
  const firstOptionId = `${baseId}-first`;

  const due = formatDate(offer.due_date);
  const days = offer.days_until_due;

  function handleChange(value) {
    setShowMissing(false);
    onAmountChange(value);
  }

  function handleContinue() {
    if (amount == null) {
      setShowMissing(true);
      document.getElementById(firstOptionId)?.focus();
      return;
    }
    onContinue(amount);
  }

  const firstAvailable = offer.tiers.find((t) => t.available);

  return (
    <Frame
      appBar={<AppBar title="Salary advance" onBack={onLeave} />}
      actions={
        <>
          <Button size="lg" subLabel="Nothing is borrowed yet" onClick={handleContinue}>
            Review terms
          </Button>
          <Button size="lg" variant="secondary" onClick={onLeave}>
            Back to home
          </Button>
        </>
      }
    >
      <Card className="space-y-2">
        <h2 className="text-body font-semibold text-neutral-900">How repayment works</h2>
        <p className="text-body text-neutral-900">
          You repay it all on <span className="font-semibold">{due}</span>, your next payday (in {days}{" "}
          {days === 1 ? "day" : "days"}).
        </p>
        <p className="text-body text-neutral-900">
          At <span className="font-semibold">{formatTime(offer.collection_time)}</span>, once your salary has
          landed, we collect the full amount from your NovaPay wallet.
        </p>
        <p className="text-body text-neutral-900">
          The fee is <span className="font-semibold">{FEE_PERCENT}%</span> of the amount you receive. It's charged once and
          added to what you repay.
        </p>
      </Card>

      <Card>
        <fieldset aria-describedby={hintId}>
          <legend className="text-title text-neutral-900">How much do you want to borrow?</legend>
          <p id={hintId} className="text-caption text-neutral-700 mt-1">
            You can borrow up to {formatAmount(offer.limit)}.
          </p>
          <div role="status" className={showMissing ? "text-body text-neutral-900 mt-3" : ""}>
            {showMissing ? "Choose an amount to continue." : null}
          </div>
          <div className="mt-2 divide-y divide-neutral-200">
            {offer.tiers.map((tier) => (
              <Choice
                key={tier.amount}
                id={tier === firstAvailable ? firstOptionId : undefined}
                type="radio"
                name="advance-amount"
                value={String(tier.amount)}
                checked={amount === tier.amount}
                onChange={() => handleChange(tier.amount)}
                label={<AmountText amount={tier.amount} size="body" className="font-semibold" />}
                description={
                  tier.available
                    ? `Fee ${formatAmount(tier.fee)} · Repay ${formatAmount(tier.total)} on ${due}`
                    : null
                }
                disabled={!tier.available}
                disabledReason={BLOCKED_REASONS[tier.blocked_reason]?.(offer) ?? null}
              />
            ))}
          </div>
        </fieldset>
      </Card>
    </Frame>
  );
}
