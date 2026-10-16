import { useEffect, useId, useRef, useState } from "react";
import { AppBar, Card, ListRow, Choice, Button, AmountText, BottomSheet, formatAmount } from "../novakit";
import {
  FEE_PERCENT,
  MAX_REMINDERS_PER_7_DAYS,
  QUIET_HOURS,
  formatDate,
  formatTime,
} from "../advance/salaryAdvance";

const MISSING_MESSAGE = "To accept, tick the box to give this permission.";
const PROCESSING_LABEL = "Confirming your advance…";
const TIMES = { 1: "once", 2: "twice" };

/**
 * S4: terms + accept, and S7: the reduced payout (when `terms.reduced_from` is set).
 * Everything shown comes from `terms` (getTerms or reducePayout). The caller only renders
 * this screen when terms exist, and gives each set of terms its own `key`, so consent and
 * state always start fresh.
 *
 * - S4 starts with the cost summary, so it's visible without scrolling (principle 1).
 *   S7 starts with what changed, then the same rows, each saying what it was before.
 * - What happens if it's late is one line, with the details in a BottomSheet.
 * - The permission to collect is its own unticked checkbox and says when it ends.
 * - "Accept" stays enabled. Without the permission it shows a neutral message in the
 *   action area, announced on every tap, and moves focus to the checkbox.
 * - S5, processing: the button shows what's happening; back and the other actions are
 *   hidden; the content can't be changed; a second tap can't happen.
 * - S6, network failure: a danger Card with role="alert" at the top says nothing was
 *   sent or charged, with Try again. Red is only on that card.
 */
export default function ReviewAccept({ Frame, terms, onAccept, onChangeAmount = null, onLeave }) {
  const [permission, setPermission] = useState(false);
  const [message, setMessage] = useState("");
  const [lateOpen, setLateOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef(null);
  const failureRef = useRef(null);
  const baseId = useId();
  const permissionId = `${baseId}-permission`;
  const retryId = `${baseId}-retry`;

  useEffect(() => () => clearTimeout(timer.current), []);

  // S6: bring the failure into view and put focus on its next step.
  useEffect(() => {
    if (!failed) return;
    failureRef.current?.closest("main")?.scrollTo({ top: 0 }); // the card is first in the content
    document.getElementById(retryId)?.focus();
  }, [failed, retryId]);

  const reduced = terms.reduced_from;
  const due = formatDate(terms.due_date);
  const time = formatTime(terms.collection.time);
  const until = formatDate(terms.permission.ends_by);

  function handlePermission(event) {
    setPermission(event.target.checked);
    clearTimeout(timer.current);
    setMessage("");
  }

  async function handleAccept() {
    if (processing) return;
    clearTimeout(timer.current);
    if (!permission) {
      // Clear, then set again, so the status is announced on every tap, after the
      // focus move has been read.
      setMessage("");
      const box = document.getElementById(permissionId);
      box?.focus();
      timer.current = setTimeout(() => {
        setMessage(MISSING_MESSAGE);
        // The message makes the action area taller, so bring the whole row into view after it renders.
        timer.current = setTimeout(() => box?.closest("label")?.scrollIntoView({ block: "nearest" }), 0);
      }, 150);
      return;
    }
    setFailed(false);
    setProcessing(true);
    setMessage("");
    const result = await onAccept({ permission_granted: permission });
    if (result === "failed") {
      setProcessing(false);
      setFailed(true);
    }
    // "moved": the app has gone to the next screen, and this one unmounts.
  }

  const lateSheet = (
    <BottomSheet open={lateOpen} onClose={() => setLateOpen(false)} title="What happens if it's late">
      <ul className="list-disc pl-5 space-y-1 text-body text-neutral-900">
        <li>Days late are counted from {due}.</li>
        <li>You can pay some or all of it yourself.</li>
        <li>
          If your salary is delayed, tell us and we'll pause reminders. We'll still tell you before it goes into
          default.
        </li>
        <li>
          Reminders come at most {TIMES[MAX_REMINDERS_PER_7_DAYS] ?? `${MAX_REMINDERS_PER_7_DAYS} times`} a week,
          never between {formatTime(QUIET_HOURS.from)} and {formatTime(QUIET_HOURS.to)}, and only to you.
        </li>
        <li>We won't freeze your wallet.</li>
        <li>
          If it's still unpaid on {until}, the advance is in default. New advances are paused and automatic
          collection stops.
        </li>
      </ul>
    </BottomSheet>
  );

  const appBar = reduced ? (
    <AppBar title="Check the new amount" />
  ) : (
    <AppBar
      title="Review and accept"
      onBack={processing ? null : onChangeAmount}
      backLabel="Back to amounts"
    />
  );

  const actions = (
    <>
      {/* Next to the button, so it's seen where the tap happened. */}
      <div>
        <div role="status" className={message ? "text-body text-neutral-900 pb-3" : ""}>
          {message}
          {/* The button already shows this; screen readers hear it once here. */}
          {processing ? <span className="sr-only">Confirming your advance.</span> : null}
        </div>
        {/* One line: the repayment and its date are on the screen, above. */}
        <Button onClick={handleAccept} loading={processing} loadingLabel={PROCESSING_LABEL}>
          Accept {formatAmount(terms.disbursed_amount)}
        </Button>
      </div>
      {processing ? null : reduced ? (
        <Button variant="secondary" onClick={onLeave}>
          No thanks
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onChangeAmount}>
            Change amount
          </Button>
          <Button variant="secondary" onClick={onLeave}>
            Back to home
          </Button>
        </div>
      )}
    </>
  );

  return (
    <Frame
      title={reduced ? "Check the new amount: NovaPay" : "Review and accept: NovaPay"}
      sheet={lateSheet}
      appBar={appBar}
      actions={actions}
    >
      {/* While processing, nothing here can be changed or reached. */}
      <div className="space-y-4" inert={processing ? "" : undefined} aria-busy={processing || undefined}>
        {failed ? (
          <Card tone="danger" role="alert" className="space-y-2">
            <div ref={failureRef}>
              <p className="text-body font-semibold text-neutral-900">We couldn't confirm your advance</p>
              <p className="text-body text-neutral-900 mt-1">
                Nothing was sent to your wallet and nothing was charged. Please try again.
              </p>
            </div>
            <Button id={retryId} variant="secondary" onClick={handleAccept}>
              Try again
            </Button>
          </Card>
        ) : null}

        {reduced ? (
          <Card className="space-y-2">
            <h2 className="text-title text-neutral-900">
              We can offer {formatAmount(terms.disbursed_amount)}, not {formatAmount(reduced.disbursed_amount)}
            </h2>
            <p className="text-body text-neutral-900">
              Nothing has been sent or charged. If {formatAmount(terms.disbursed_amount)} works for you, accept it below.
            </p>
          </Card>
        ) : null}

        <Card>
          <h2 className="text-body font-semibold text-neutral-900">Your advance</h2>
          <div className="mt-1">
            <ListRow
              wrap
              title="You get"
              subtitle={withWas("Paid into your NovaPay wallet", reduced && `You asked for ${formatAmount(reduced.disbursed_amount)}.`)}
              trailing={<AmountText amount={terms.disbursed_amount} size="body" className="font-semibold" />}
            />
            <ListRow
              wrap
              title="Fee"
              subtitle={withWas(`${FEE_PERCENT}%, charged once`, reduced && `Was ${formatAmount(reduced.fee)}.`)}
              trailing={<AmountText amount={terms.fee} size="body" className="font-semibold" />}
            />
            <ListRow
              wrap
              title={<span className="font-semibold">You repay on {due}</span>}
              subtitle={withWas(
                `At ${time} from your NovaPay wallet, once your salary arrives`,
                reduced && `Was ${formatAmount(reduced.total)}.`
              )}
              trailing={<AmountText amount={terms.total} size="body" className="font-semibold" />}
            />
          </div>
          {reduced ? null : (
            <p className="text-caption text-neutral-700 mt-2">
              If we can only pay a lower amount, we'll show you the new terms and ask you again before paying
              anything.
            </p>
          )}
        </Card>

        <Card className="space-y-2">
          <p className="text-body text-neutral-900">
            If we can't take it on {due}, we'll tell you at {time}. If your salary is late, we'll try again when it
            arrives.
          </p>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setLateOpen(true)}
            className="inline-flex items-center min-h-11 rounded-sm text-body font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            What happens if it's late
          </button>
        </Card>

        <Card>
          <Choice
            id={permissionId}
            type="checkbox"
            name="collection-permission"
            checked={permission}
            onChange={handlePermission}
            label={
              reduced
                ? "I allow NovaPay to take the new repayment automatically."
                : "I allow NovaPay to take the repayment above automatically."
            }
            description={`This ends automatically when it's repaid, or on ${until} at the latest.`}
          />
        </Card>
      </div>
    </Frame>
  );
}

// S7: a row's subtitle, plus what it was before the lower offer.
function withWas(text, was) {
  return was ? `${text}. ${was}` : text;
}
