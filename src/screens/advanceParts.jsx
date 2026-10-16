import { Card, ListRow, AmountText, BottomSheet, formatAmount } from "../novakit";
import { FEE_PERCENT, MAX_REMINDERS_PER_7_DAYS, QUIET_HOURS, formatTime } from "../advance/salaryAdvance";

/**
 * Pieces the accept screen (S4), the lower offer (S7) and the receipt (S8) share, so what a
 * person agreed to reads exactly the same everywhere (principle 1). Screen parts, not NovaKit.
 * Every value comes from the caller, which reads it from the module.
 */

const TIMES = { 1: "once", 2: "twice" };

// S7: a row's subtitle, plus what it was before the lower offer.
function withWas(text, was) {
  return was ? `${text}. ${was}` : text;
}

/**
 * "Your advance": what you get, the fee and what you repay, and when and from where.
 * `before` (S7 only) is the offer it replaces, so each row also says what it was.
 */
export function AdvanceSummary({ disbursed, fee, total, due, time, before = null, children = null }) {
  return (
    <Card>
      <h2 className="text-body font-semibold text-neutral-900">Your advance</h2>
      <div className="mt-1">
        <ListRow
          wrap
          title="You get"
          subtitle={withWas(
            "Paid into your NovaPay wallet",
            before && `You asked for ${formatAmount(before.disbursed_amount)}.`
          )}
          trailing={<AmountText amount={disbursed} size="body" className="font-semibold" />}
        />
        <ListRow
          wrap
          title="Fee"
          subtitle={withWas(`${FEE_PERCENT}%, charged once`, before && `Was ${formatAmount(before.fee)}.`)}
          trailing={<AmountText amount={fee} size="body" className="font-semibold" />}
        />
        <ListRow
          wrap
          title={<span className="font-semibold">You repay on {due}</span>}
          subtitle={withWas(
            `At ${time} from your NovaPay wallet, once your salary arrives`,
            before && `Was ${formatAmount(before.total)}.`
          )}
          trailing={<AmountText amount={total} size="body" className="font-semibold" />}
        />
      </div>
      {children}
    </Card>
  );
}

// The one line on what happens if it isn't collected, and the button that opens the details.
export function LateLine({ due, time, onOpen }) {
  return (
    <>
      <p className="text-body text-neutral-900">
        If we can't take it on {due}, we'll tell you at {time}. If your salary is late, we'll try again when it
        arrives.
      </p>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        className="inline-flex items-center min-h-11 rounded-sm text-body font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        What happens if it's late
      </button>
    </>
  );
}

// The details behind "What happens if it's late". Goes in the phone frame's `sheet` slot.
export function LateSheet({ open, onClose, due, until }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="What happens if it's late">
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
}
