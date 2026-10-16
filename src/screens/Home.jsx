import { useRef } from "react";
import { AppBar, Card, ListRow, Button, AmountText } from "../novakit";
import { FEE_PERCENT, formatDate, formatDay, formatTime } from "../advance/salaryAdvance";
import {
  DefaultDateLabel,
  DefaultNoticeStatus,
  LateLabel,
  LateStatus,
  NotCollectedNotice,
  NotCollectedStatus,
} from "./advanceParts";

/**
 * Home. Before an advance (S1): the balance and the card that starts one.
 * After accepting (S9): the balance says how much of it is the advance, and a separate
 * advance card says what's owed and when, so borrowed money is never mistaken for the
 * person's own (principle 5).
 *
 * Reminder before the due date (S10): the same advance card, plus how soon ("in 3 days")
 * and that nothing is needed. The card is the in-app reminder; no other surface.
 * Not collected on payday (S11): a danger card for the event, then the advance card with
 * what's still owed and when it'll be taken. Nothing is required: it's automatic.
 * Late (S12): the advance card in the attention tone with "5 days late", what's owed, what
 * happened on payday in plain text, and when it'll be taken. No danger card, no action here.
 * Notice before default (S13): the same card, leading with "Default date: 27 Aug" and what it
 * means, in 7 days. Firm and clear, never alarming.
 *
 * Money and dates come from the module: `offer` (getOffer: no new offer while an advance
 * is open), `wallet` (getWallet), `activity` (getActivity: sample rows, the balance adds
 * up from them), `status` (getStatus) and `advance`. A missing balance says so, never
 * "Rs 0". Every activity row says its direction in words and with a sign: + in, − out.
 */
export default function Home({
  Frame,
  today,
  persona,
  offer,
  wallet,
  activity,
  advance,
  status,
  noticeHidden,
  onHideNotice,
  onStartAdvance,
  onSeeAdvance,
}) {
  // S10: once the module says the reminder before the due date has gone out (and the advance
  // isn't due yet), the card is that reminder in the app: it adds how soon, and that nothing
  // is needed. Calm on purpose (principle 4).
  const reminded = status?.before_due_reminder_sent === true;
  const dueIn = status?.days_until_due === 1 ? "tomorrow" : `in ${status?.days_until_due} days`;
  const salaryIntoNovaPay = persona.salary_destination === "novapay";
  // S11: payday's collection didn't go through (getStatus). The event gets its own danger
  // card above the advance card, which stays calm and in its usual place (principle 4).
  const notCollected = status?.phase === "not_collected";
  // S12: late. The advance card takes the attention tone; no danger card, because the failed
  // attempt was an event on payday and red doesn't follow the person for days.
  const late = status?.phase === "late";
  // S13: the notice before default has gone out (getStatus). The same attention card, now
  // leading with the default date and what it means. No countdown styling, no red.
  const defaultNotice = status?.default_notice_sent === true;
  // "Hide this message": App keeps it hidden until the app is opened again (a reload) or
  // the reviewer starts again. Focus moves to the advance card, so nobody loses their place.
  // A timeout, not rAF: background tabs pause rAF (progress.md, system flags).
  const advanceHeadingRef = useRef(null);
  function hideNotice() {
    onHideNotice();
    setTimeout(() => advanceHeadingRef.current?.focus(), 0);
  }

  return (
    <Frame title="NovaPay" appBar={<AppBar title="NovaPay" />}>
      <Card>
        <h2 className="text-caption text-neutral-700">Available balance</h2>
        <div className="mt-1">
          {wallet.balance != null ? (
            <AmountText amount={wallet.balance} size="display" />
          ) : (
            <p className="text-body text-neutral-900">Not available yet</p>
          )}
        </div>
        {wallet.includes_advance != null ? (
          <p className="text-caption text-neutral-700 mt-1">
            Includes <AmountText amount={wallet.includes_advance} size="caption" /> from your advance
          </p>
        ) : null}
      </Card>

      {advance && offer.eligibility === "has_advance" && notCollected ? (
        <>
          {noticeHidden ? null : <NotCollectedNotice attempt={status.last_attempt} onHide={hideNotice} />}
          <Card className="space-y-3">
            <div>
              <h2 ref={advanceHeadingRef} tabIndex={-1} className="text-body font-semibold text-neutral-900 focus:outline-none">
                Your salary advance
              </h2>
              <div className="mt-1">
                <NotCollectedStatus status={status} />
              </div>
            </div>
            <Button variant="secondary" onClick={onSeeAdvance}>
              See details
            </Button>
          </Card>
        </>
      ) : advance && offer.eligibility === "has_advance" && defaultNotice ? (
        <Card tone="attention" className="space-y-3">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h2 className="text-body font-semibold text-neutral-900">Your salary advance</h2>
              <DefaultDateLabel date={advance.default_date} />
            </div>
            <div className="mt-1">
              <DefaultNoticeStatus status={status} defaultDate={advance.default_date} />
            </div>
          </div>
          <Button variant="secondary" onClick={onSeeAdvance}>
            See details
          </Button>
        </Card>
      ) : advance && offer.eligibility === "has_advance" && late ? (
        <Card tone="attention" className="space-y-3">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h2 className="text-body font-semibold text-neutral-900">Your salary advance</h2>
              <LateLabel days={status.days_late} />
            </div>
            <div className="mt-1">
              <LateStatus status={status} />
            </div>
          </div>
          <Button variant="secondary" onClick={onSeeAdvance}>
            See details
          </Button>
        </Card>
      ) : advance && offer.eligibility === "has_advance" ? (
        <Card className="space-y-3">
          <div>
            <h2 className="text-body font-semibold text-neutral-900">Your salary advance</h2>
            <p className="text-body text-neutral-900 mt-1">
              <AmountText amount={status.outstanding} size="body" className="font-semibold" /> to repay on{" "}
              <span className="font-semibold">{formatDate(advance.due_date)}</span>
              {reminded ? `, ${dueIn}` : null}
            </p>
            <p className="text-caption text-neutral-700 mt-1">
              We take it from your NovaPay wallet at {formatTime(advance.collection.time)}, once your salary arrives.
            </p>
            {reminded && salaryIntoNovaPay ? (
              <p className="text-caption text-neutral-700 mt-1">
                Your salary is paid into NovaPay, so there's nothing you need to do.
              </p>
            ) : null}
          </div>
          <Button variant="secondary" onClick={onSeeAdvance}>
            See details
          </Button>
        </Card>
      ) : offer.eligibility === "eligible" ? (
        <Card className="space-y-3">
          <div>
            <h2 className="text-title text-neutral-900">Salary advance</h2>
            {/* The same wording as S3's card (principle 1). */}
            <p className="text-body text-neutral-700 mt-1">
              A short-term loan with a {FEE_PERCENT}% fee, charged once. If you accept, we take the full amount from
              your NovaPay wallet automatically at {formatTime(offer.collection_time)} on {formatDate(offer.due_date)},
              once your salary arrives.
            </p>
          </div>
          <Button onClick={onStartAdvance}>See amounts and costs</Button>
        </Card>
      ) : null}

      {activity.length ? (
        <Card>
          <h2 className="text-caption text-neutral-700 mb-1">Recent activity</h2>
          {activity.map((row) => (
            <ListRow
              key={row.id}
              icon={row.direction === "in" ? "↓" : "↑"}
              title={row.title}
              subtitle={formatDay(row.date, today)}
              trailing={<AmountText amount={row.amount} size="body" sign={row.direction === "in" ? "+" : "-"} />}
            />
          ))}
        </Card>
      ) : null}
    </Frame>
  );
}
