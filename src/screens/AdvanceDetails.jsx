import { useState } from "react";
import { AppBar, Card, Button } from "../novakit";
import { formatDate, formatTime } from "../advance/salaryAdvance";
import { AdvanceSummary, LateLine, LateLink, LateSheet, NotCollectedNotice, NotCollectedStatus } from "./advanceParts";

/**
 * The advance's details, opened from its card on the home screen. Not a confirmation (that's
 * S8): the terms the person agreed to, in the same rows as the accept screen ("You received"
 * instead of "You get"), the permission they gave and when it ends, and what happens if it's
 * late. This is where their record of the agreement lives in the app (my Assumption).
 * Everything comes from `advance` (acceptTerms) and `status` (getStatus).
 *
 * From payday on, it's also where the late information lives: a status section first.
 * S11 (not collected): the failed event in a danger card, then what's still owed and when
 * it'll be taken, with "What happens if it's late". The terms below become "What you
 * agreed", and the one action is paying it yourself, a labelled placeholder (my Assumption:
 * pay part manually, stubbed in the prototype).
 */
export default function AdvanceDetails({ Frame, advance, status, onBack, onPayYourself }) {
  const [lateOpen, setLateOpen] = useState(false);

  const due = formatDate(advance.due_date);
  const time = formatTime(advance.collection.time);
  const until = formatDate(advance.permission.ends_by);
  const notCollected = status.phase === "not_collected";

  return (
    <Frame
      title="Your salary advance: NovaPay"
      appBar={<AppBar title="Your salary advance" onBack={onBack} backLabel="Back to home" />}
      sheet={<LateSheet open={lateOpen} onClose={() => setLateOpen(false)} due={due} until={until} />}
      actions={
        notCollected ? (
          <Button variant="secondary" onClick={onPayYourself}>
            Pay some or all yourself
          </Button>
        ) : null
      }
    >
      {notCollected ? (
        <>
          <NotCollectedNotice attempt={status.last_attempt} />
          <Card>
            <NotCollectedStatus status={status} />
            <LateLink onOpen={() => setLateOpen(true)} />
          </Card>
        </>
      ) : null}

      <AdvanceSummary
        disbursed={advance.disbursed_amount}
        fee={advance.fee}
        total={advance.total}
        due={due}
        time={time}
        received
        heading={notCollected ? "What you agreed" : "Your advance"}
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

      {/* Before payday only: from payday, the late link sits in the status section above. */}
      {notCollected ? null : (
        <Card className="space-y-2">
          <LateLine due={due} time={time} onOpen={() => setLateOpen(true)} />
        </Card>
      )}
    </Frame>
  );
}
