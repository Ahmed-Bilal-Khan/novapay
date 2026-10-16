import { useEffect, useId, useRef, useState } from "react";
import { AppBar, Card, ListRow, Choice, Button, AmountText, formatAmount } from "../novakit";
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
 * - The permission to collect is its own unticked checkbox. It starts unticked every
 *   time the screen opens.
 * - "Accept" stays enabled. Without the permission it shows a neutral message at the
 *   checkbox, announced on every tap, and moves focus to the checkbox.
 */
export default function ReviewAccept({ Frame, terms, onAccept, onChangeAmount, onLeave }) {
  const [permission, setPermission] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef(null);
  const permissionId = `${useId()}-permission`;

  useEffect(() => () => clearTimeout(timer.current), []);

  const due = formatDate(terms.due_date);
  const time = formatTime(terms.collection.time);
  const until = formatDate(terms.permission.ends_by);
  const owed = formatAmount(terms.permission.amount);

  function handlePermission(event) {
    setPermission(event.target.checked);
    clearTimeout(timer.current);
    setMessage("");
  }

  function handleAccept() {
    if (permission) {
      onAccept();
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
      appBar={<AppBar title="Review and accept" onBack={onChangeAmount} backLabel="Back to amounts" />}
      actions={
        <>
          <Button
            size="lg"
            subLabel={`Repay ${formatAmount(terms.total)} on ${due}`}
            onClick={handleAccept}
          >
            Accept {formatAmount(terms.disbursed_amount)}
          </Button>
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
          If we can't take it on {due}, we'll tell you that evening and try again when your salary next arrives.
        </p>
        <details>
          <summary className="cursor-pointer rounded-sm text-body font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
            What happens if it's late
          </summary>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-body text-neutral-900">
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
        </details>
      </Card>

      <Card>
        <Choice
          id={permissionId}
          type="checkbox"
          name="collection-permission"
          checked={permission}
          onChange={handlePermission}
          label={`I allow NovaPay to take ${owed} from my NovaPay wallet automatically at ${time} on ${due} once my salary arrives, or when it arrives after that.`}
          description={`This permission ends when the advance is repaid, or on ${until} at the latest. It only applies when your salary arrives, never to other money in your wallet.`}
        />
        <div role="status" className={message ? "text-body text-neutral-900 mt-2" : ""}>
          {message}
        </div>
      </Card>
    </Frame>
  );
}
