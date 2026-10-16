import { useState } from "react";
import { AppBar, Card } from "../novakit";
import { formatDate, formatTime } from "../advance/salaryAdvance";
import { AdvanceSummary, LateLine, LateSheet } from "./advanceParts";

/**
 * The advance's details, opened from its card on the home screen. Not a confirmation (that's
 * S8): the terms the person agreed to, in the same rows as the accept screen ("You received"
 * instead of "You get"), the permission they gave and when it ends, and what happens if it's
 * late. This is where their record of the agreement lives in the app (my Assumption).
 * Everything comes from `advance` (acceptTerms).
 */
export default function AdvanceDetails({ Frame, advance, onBack }) {
  const [lateOpen, setLateOpen] = useState(false);

  const due = formatDate(advance.due_date);
  const time = formatTime(advance.collection.time);
  const until = formatDate(advance.permission.ends_by);

  return (
    <Frame
      title="Your salary advance: NovaPay"
      appBar={<AppBar title="Your salary advance" onBack={onBack} backLabel="Back to home" />}
      sheet={<LateSheet open={lateOpen} onClose={() => setLateOpen(false)} due={due} until={until} />}
    >
      <AdvanceSummary
        disbursed={advance.disbursed_amount}
        fee={advance.fee}
        total={advance.total}
        due={due}
        time={time}
        received
      >
        <p className="text-caption text-neutral-700 mt-2">Accepted on {formatDate(advance.accepted_on)}</p>
      </AdvanceSummary>

      <Card className="space-y-2">
        <h2 className="text-body font-semibold text-neutral-900">Your permission</h2>
        <p className="text-body text-neutral-900">
          You allowed NovaPay to take the repayment above automatically. It ends when it's repaid, or on {until} at
          the latest.
        </p>
      </Card>

      <Card className="space-y-2">
        <LateLine due={due} time={time} onOpen={() => setLateOpen(true)} />
      </Card>
    </Frame>
  );
}
