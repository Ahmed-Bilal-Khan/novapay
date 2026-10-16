import { AppBar, Card, ListRow, Button, AmountText } from "../novakit";
import { FEE_PERCENT, formatDate, formatDay, formatTime } from "../advance/salaryAdvance";

/**
 * Home. Before an advance (S1): the balance and the card that starts one.
 * After accepting (S9): the balance says how much of it is the advance, and a separate
 * advance card says what's owed and when, so borrowed money is never mistaken for the
 * person's own (principle 5).
 *
 * Reminder before the due date (S10): the same advance card, plus how soon ("in 3 days")
 * and that nothing is needed. The card is the in-app reminder; no other surface.
 *
 * Money and dates come from the module: `offer` (getOffer: no new offer while an advance
 * is open), `wallet` (getWallet), `activity` (getActivity: sample rows, the balance adds
 * up from them), `status` (getStatus), `reminders` (getReminders) and `advance`. A missing balance says so, never
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
  reminders,
  onStartAdvance,
  onSeeAdvance,
}) {
  // S10: once the reminder before the due date has gone out (getReminders), and while the
  // advance is still before its due date (getStatus), the card is that reminder in the app:
  // it adds how soon, and that nothing is needed. Calm on purpose (principle 4).
  const reminded =
    status?.phase === "before_due" && reminders.some((r) => r.type === "before_due" && r.status === "sent");
  const dueIn = status?.days_until_due === 1 ? "tomorrow" : `in ${status?.days_until_due} days`;
  const salaryIntoNovaPay = persona.salary_destination === "novapay";

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

      {advance && offer.eligibility === "has_advance" ? (
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
            <p className="text-body text-neutral-700 mt-1">
              A short-term loan with a {FEE_PERCENT}% fee, charged once. We take it from your NovaPay wallet on{" "}
              {formatDate(offer.due_date)}, once your salary arrives.
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
