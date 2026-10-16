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
const TIMES = { 1: "once", 2: "twice" };

/**
 * S4: terms + accept.
 * Everything shown comes from `terms` (getTerms). The caller only renders this
 * screen when terms exist.
 *
 * - The cost summary is first, so it's visible without scrolling (principle 1).
 * - What happens if it's late is one line, with the details in a BottomSheet.
 * - The permission to collect is its own unticked checkbox. It points at the
 *   repayment above instead of repeating it, and says when it ends. It starts
 *   unticked every time the screen opens.
 * - "Accept" stays enabled. Without the permission it shows a neutral message in the
 *   action area, above the button, announced on every tap, and moves focus to the checkbox.
 */
export default function ReviewAccept({ Frame, terms, onAccept, onChangeAmount, onLeave }) {
  const [permission, setPermission] = useState(false);
  const [message, setMessage] = useState("");
  const [lateOpen, setLateOpen] = useState(false);
  const timer = useRef(null);
  const permissionId = `${useId()}-permission`;

  useEffect(() => () => clearTimeout(timer.current), []);

  const due = formatDate(terms.due_date);
  const time = formatTime(terms.collection.time);
  const until = formatDate(terms.permission.ends_by);

  function handlePermission(event) {
    setPermission(event.target.checked);
    clearTimeout(timer.current);
    setMessage("");
  }

  function handleAccept() {
    if (permission) {
      onAccept({ permission_granted: permission });
      return;
    }
    // Clear, then set again, so the status is announced on every tap, after the
    // focus move has been read.
    setMessage("");
    document.getElementById(permissionId)?.focus();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(MISSING_MESSAGE), 150);
  }

  return (
    <Frame
      title="Review and accept: NovaPay"
      sheet={
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
      }
      appBar={<AppBar title="Review and accept" onBack={onChangeAmount} backLabel="Back to amounts" />}
      actions={
        <>
          {/* Next to the button, so it's seen where the tap happened. */}
          <div>
            <div role="status" className={message ? "text-body text-neutral-900 pb-3" : ""}>
              {message}
            </div>
            <Button
              subLabel={`Repay ${formatAmount(terms.total)} on ${due}`}
              onClick={handleAccept}
            >
              Accept {formatAmount(terms.disbursed_amount)}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onChangeAmount}>
              Change amount
            </Button>
            <Button variant="secondary" onClick={onLeave}>
              Back to home
            </Button>
          </div>
        </>
      }
    >
      <Card>
        <h2 className="text-body font-semibold text-neutral-900">Your advance</h2>
        <div className="mt-1">
          <ListRow
            wrap
            title="You get"
            subtitle="Paid into your NovaPay wallet"
            trailing={<AmountText amount={terms.disbursed_amount} size="body" className="font-semibold" />}
          />
          <ListRow
            wrap
            title="Fee"
            subtitle={`${FEE_PERCENT}%, charged once`}
            trailing={<AmountText amount={terms.fee} size="body" className="font-semibold" />}
          />
          <ListRow
            wrap
            title={<span className="font-semibold">You repay on {due}</span>}
            subtitle={`At ${time} from your NovaPay wallet, once your salary arrives`}
            trailing={<AmountText amount={terms.total} size="body" className="font-semibold" />}
          />
        </div>
        <p className="text-caption text-neutral-700 mt-2">
          If we can only pay a lower amount, we'll show you the new terms and ask you again before paying anything.
        </p>
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
          label="I allow NovaPay to take the repayment above automatically."
          description={`This ends automatically when it's repaid, or on ${until} at the latest.`}
        />
      </Card>
    </Frame>
  );
}
