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
// only while the permission lasts, which ends on the default date. Reassurance first (the
// next step is that nothing is needed), then the end date as a plain fact, in the
// permission card's words.
const RETRY_LINES = {
  salary_not_arrived: (endsOn) =>
    `When your salary arrives in NovaPay, we'll take it automatically, so there's nothing you need to do. The permission you gave us ends on ${endsOn}.`,
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
  return (
    <>
      <p className="text-body text-neutral-900">
        <AmountText amount={status.outstanding} size="body" className="font-semibold" /> still to repay. The amount
        hasn't changed.
      </p>
      <RetryLine status={status} />
    </>
  );
}

// The retry line for the cause (shared by S11 and S12), or nothing rather than a guess.
function RetryLine({ status }) {
  const retry = RETRY_LINES[status.last_attempt.reason]?.(formatDate(status.permission.ends_on));
  return retry ? <p className="text-caption text-neutral-700 mt-1">{retry}</p> : null;
}

// S12, what happened on payday, said once in plain text: red doesn't follow the person.
const PAST_CAUSE_LINES = {
  salary_not_arrived: (date) => `We couldn't take it on ${date} because your salary hadn't arrived.`,
};

/**
 * S12: the short status label, the only attention-600 text (audit S12, 6.14). It's about the
 * repayment, never the person. `days` is getStatus().days_late, counted from the due date.
 */
export function LateLabel({ days }) {
  return (
    <p className="text-caption font-semibold text-attention-600">{days === 1 ? "1 day late" : `${days} days late`}</p>
  );
}

/**
 * S13: the short status label once the notice before default has gone out. A fact (the date),
 * not a forecast: default only happens if it's still unpaid. The only attention-600 text.
 */
export function DefaultDateLabel({ date }) {
  return <p className="text-caption font-semibold text-attention-600">Default date: {formatDate(date)}</p>;
}

/**
 * S13, notice before default: the content of the attention card, on Home and (with `detailed`) at
 * the top of the details view. The date and what it means lead (S4's own words), then what's
 * owed today, what happened on payday and when it'll still be taken. Nothing about after default
 * beyond my Assumptions' consequences, and no promise about the amount after it. The details add
 * what changes then and, once a payroll delay is reported, why this notice still came.
 */
export function DefaultNoticeStatus({ status, defaultDate, detailed = false }) {
  const cause = PAST_CAUSE_LINES[status.last_attempt?.reason]?.(formatDate(status.last_attempt.date));
  const days = status.days_until_default;
  return (
    <>
      <p className="text-body text-neutral-900">
        If it's still unpaid on <span className="font-semibold">{formatDate(defaultDate)}</span>, the advance is in
        default. {days === 1 ? "That's tomorrow." : `That's in ${days} days.`}
      </p>
      {detailed ? (
        <p className="text-caption text-neutral-700 mt-1">
          Then new advances are paused and automatic collection stops. We won't freeze your wallet.
        </p>
      ) : null}
      <p className={`text-body text-neutral-900 ${detailed ? "mt-2" : "mt-1"}`}>
        <AmountText amount={status.outstanding} size="body" className="font-semibold" /> still to repay. The amount
        hasn't changed and no fee was added.
      </p>
      {cause ? <p className="text-caption text-neutral-700 mt-1">{cause}</p> : null}
      <RetryLine status={status} />
      {detailed && status.reminders_paused ? (
        <p className="text-body text-neutral-900 mt-2">
          You told us your salary is late, so the other reminders are paused. This notice is always sent, because
          it's about the date your advance goes into default.
        </p>
      ) : null}
    </>
  );
}

/**
 * S12, late: the content of the attention card, on Home and (with `detailed`) at the top of the
 * details view. What's owed, unchanged; what happened on payday; when it'll be taken. The details
 * add what happens on the default date (my Assumptions' consequences only, in the late sheet's
 * words) and, once a payroll delay is reported, a confirmation from getReminders: reminders are
 * paused, and the notice before default still comes. That confirmation sits in a status region
 * that's always there, so it's announced when it appears; `confirmationRef` lets the screen move
 * focus to it after the tap.
 */
export function LateStatus({ status, defaultDate = null, reminders = [], detailed = false, confirmationRef = null }) {
  const cause = PAST_CAUSE_LINES[status.last_attempt?.reason]?.(formatDate(status.last_attempt.date));
  const notice = reminders.find((r) => r.type === "before_default" && r.status !== "paused");
  const confirmed = status.reminders_paused && notice;
  return (
    <>
      <p className="text-body text-neutral-900">
        <AmountText amount={status.outstanding} size="body" className="font-semibold" /> still to repay. The amount
        hasn't changed and no fee was added.
      </p>
      {cause ? <p className="text-caption text-neutral-700 mt-1">{cause}</p> : null}
      <RetryLine status={status} />
      {detailed ? (
        <>
          <p className="text-caption text-neutral-700 mt-1">
            If it's still unpaid on {formatDate(defaultDate)}, new advances are paused and automatic collection
            stops. We won't freeze your wallet.
          </p>
          <div role="status">
            {confirmed ? (
              <p ref={confirmationRef} tabIndex={-1} className="text-body text-neutral-900 mt-2 focus:outline-none">
                You told us your salary is late. We've paused reminders, but we'll still send you a notice on{" "}
                {formatDate(notice.date)}.
              </p>
            ) : null}
          </div>
        </>
      ) : null}
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
