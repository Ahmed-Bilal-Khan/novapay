import { AppBar, Card, ListRow, Button, AmountText } from "../novakit";
import { formatDate, formatDay, formatTime } from "../advance/salaryAdvance";

/**
 * Home. Before an advance (S1): the balance and the card that starts one.
 * After accepting (S9): the balance says how much of it is the advance, and a separate
 * advance card says what's owed and when, so borrowed money is never mistaken for the
 * person's own (principle 5).
 *
 * Money and dates come from the module: `offer` (getOffer: no new offer while an advance
 * is open), `wallet` (getWallet), `status` (getStatus) and `advance`. A missing balance
 * says so, never "Rs 0". The salary row reads the persona; the other activity rows are
 * sample data. Every row says its direction in words and with a sign: + in, − out.
 */
export default function Home({ Frame, today, persona, offer, wallet, advance, status, onStartAdvance, onSeeAdvance }) {
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
            </p>
            <p className="text-caption text-neutral-700 mt-1">
              We take it from your NovaPay wallet at {formatTime(advance.collection.time)}, once your salary arrives.
            </p>
          </div>
          <Button variant="secondary" onClick={onSeeAdvance}>
            See details
          </Button>
        </Card>
      ) : offer.eligibility === "eligible" ? (
        <Card className="space-y-3">
          <div>
            <h2 className="text-title text-neutral-900">Need cash before payday?</h2>
            <p className="text-body text-neutral-700 mt-1">You may qualify for a NovaPay salary advance.</p>
          </div>
          <Button onClick={onStartAdvance}>See amounts and costs</Button>
        </Card>
      ) : null}

      <Card>
        <h2 className="text-caption text-neutral-700 mb-1">Recent activity</h2>
        {advance ? (
          <ListRow
            icon="↓"
            title="Advance received"
            subtitle={formatDay(advance.received_on, today)}
            trailing={<AmountText amount={advance.disbursed_amount} size="body" sign="+" />}
          />
        ) : null}
        <ListRow
          icon="↑"
          title="Sent to Ahmed K."
          subtitle="Today, 2:14pm"
          trailing={<AmountText amount={1500} size="body" sign="-" />}
        />
        {/* Only when the salary is paid into NovaPay (persona B's goes to a bank). */}
        {persona.salary_amount != null && persona.salary_destination === "novapay" ? (
          <ListRow
            icon="↓"
            title="Salary credited"
            subtitle="28 Jun"
            trailing={<AmountText amount={persona.salary_amount} size="body" sign="+" />}
          />
        ) : null}
        <ListRow
          icon="↑"
          title="Paid for mobile top-up"
          subtitle="27 Jun"
          trailing={<AmountText amount={500} size="body" sign="-" />}
        />
      </Card>
    </Frame>
  );
}
