import { Card, ListRow, AmountText, BottomSheet, formatAmount } from "../novakit";
import { FEE_PERCENT, MAX_REMINDERS_PER_7_DAYS, QUIET_HOURS, formatDate, formatTime } from "../advance/salaryAdvance";

/**
 * Pieces the accept screen (S4), the lower offer (S7) and the advance's details share, so what
 * a person agreed to reads exactly the same everywhere (principle 1). Screen parts, not NovaKit.
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
 * `received` (the details, after accepting) says "You received" instead of "You get".
 * `heading`: from payday on, the details call it "What you agreed", so the terms read as
 * the agreement, not as a promise that still stands.
 */
export function AdvanceSummary({
  disbursed,
  fee,
  total,
  due,
  time,
  before = null,
  received = false,
  heading = "Your advance",
  children = null,
}) {
  return (
    <Card>
      <h2 className="text-body font-semibold text-neutral-900">{heading}</h2>
      <div className="mt-1">
        <ListRow
          wrap
          title={received ? "You received" : "You get"}
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

// A text button inside a card: brand text, a 44px target and the brand focus ring.
const TEXT_BUTTON =
  "inline-flex items-center min-h-11 rounded-sm text-body font-semibold text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

// The button that opens "What happens if it's late" (the sheet below).
export function LateLink({ onOpen }) {
  return (
    <button type="button" aria-haspopup="dialog" onClick={onOpen} className={TEXT_BUTTON}>
      What happens if it's late
    </button>
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
      <LateLink onOpen={onOpen} />
    </>
  );
}

// S11, why it wasn't collected, in plain words. The prototype shows one cause (my Scope);
// any other cause gets no cause line rather than a guess.
const CAUSE_LINES = {
  salary_not_arrived: (time) => `Your salary hadn't arrived in your NovaPay wallet by ${time}.`,
};
// S11, when we'll try again, per cause. Collection is attempted only when salary lands, and
// only while the permission lasts, which ends on the default date.
const RETRY_LINES = {
  salary_not_arrived: (endsOn) =>
    `We'll take it automatically when your salary arrives in NovaPay, as long as that's before ${endsOn}.`,
};

/**
 * S11: the failed collection, the event, so the only red. role="alert" (audit 6.10).
 * `attempt` is getStatus().last_attempt: its date, time and cause come from the module.
 * `onHide` (Home only): "Hide this message". The details view keeps it as the record.
 */
export function NotCollectedNotice({ attempt, onHide = null }) {
  const cause = CAUSE_LINES[attempt.reason]?.(formatTime(attempt.time));
  const title = `We couldn't take your repayment on ${formatDate(attempt.date)}`;
  return (
    <Card tone="danger" role="alert" className="space-y-1">
      <h2 className="text-body font-semibold text-neutral-900">{title}</h2>
      {cause ? <p className="text-body text-neutral-900">{cause}</p> : null}
      <p className="text-body text-neutral-900">Nothing was taken and no fee was added.</p>
      {onHide ? (
        <button type="button" onClick={onHide} aria-label={`Hide this message: ${title}`} className={TEXT_BUTTON}>
          Hide this message
        </button>
      ) : null}
    </Card>
  );
}

/** S11: the person's status after it, calm (a default card's content): what's owed, and what happens next. */
export function NotCollectedStatus({ status }) {
  const retry = RETRY_LINES[status.last_attempt.reason]?.(formatDate(status.permission.ends_on));
  return (
    <>
      <p className="text-body text-neutral-900">
        <AmountText amount={status.outstanding} size="body" className="font-semibold" /> still to repay. The amount
        hasn't changed.
      </p>
      {retry ? <p className="text-caption text-neutral-700 mt-1">{retry}</p> : null}
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
