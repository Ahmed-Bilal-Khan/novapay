import { AppBar, Card, Button, AmountText, formatAmount } from "../novakit";
import { formatDate, formatTime } from "../advance/salaryAdvance";

/**
 * S8: the receipt, right after a successful accept.
 * Everything shown comes from `advance` (acceptTerms).
 *
 * The person has done what they came to do, so the money they received is centre stage:
 * one centred column, the amount in the largest type token, in brand colour. Space does the
 * grouping, not lines or extra cards. Nothing is repeated from the accept screen except the
 * one thing they still need: what they repay and when. No back: the advance is accepted.
 * No confetti, no success colour.
 */
export default function Receipt({ Frame, advance, onDone }) {
  const due = formatDate(advance.due_date);
  const time = formatTime(advance.collection.time);

  return (
    <Frame
      title="Advance confirmed: NovaPay"
      appBar={<AppBar title="Advance confirmed" />}
      actions={<Button onClick={onDone}>Done</Button>}
    >
      {/* Fills the content area so the amount sits in the middle of the screen. */}
      <div className="min-h-full flex flex-col justify-center gap-6 text-center">
        <Card className="py-8 space-y-2">
          <p className="text-body text-neutral-700">You received</p>
          <p className="text-brand">
            <AmountText amount={advance.disbursed_amount} size="display" />
          </p>
          <p className="text-body text-neutral-900">It's in your NovaPay wallet now.</p>
          <p className="text-caption text-neutral-700">Accepted on {formatDate(advance.accepted_on)}</p>
        </Card>

        <p className="text-body text-neutral-900 px-4">
          You repay <span className="font-semibold">{formatAmount(advance.total)}</span> on{" "}
          <span className="font-semibold">{due}</span> at {time}, once your salary arrives.
        </p>

        <p className="text-caption text-neutral-700 px-4">
          <span className="font-semibold">Placeholder:</span> your copy of this agreement will be kept in [where, to
          be confirmed].
        </p>
      </div>
    </Frame>
  );
}
