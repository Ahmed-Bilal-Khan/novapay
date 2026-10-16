import { useEffect, useRef, useState } from "react";
import { AppBar, Card, Button } from "../novakit";
import { formatDate, formatTime } from "../advance/salaryAdvance";
import {
  AdvanceSummary,
  DefaultDateLabel,
  DefaultNoticeStatus,
  LateLabel,
  LateLine,
  LateLink,
  LateSheet,
  LateStatus,
  NotCollectedNotice,
  NotCollectedStatus,
} from "./advanceParts";

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
 * S12 (late): no danger card (red stays on payday's event). One attention card: how late,
 * what's owed, what happened, when it'll be taken, what happens on the default date, and,
 * once reported, that reminders are paused and the notice before default still comes.
 * "My salary is late" is offered while getStatus says it can be (`can_report_payroll_delay`);
 * after the tap the button goes and focus moves to the confirmation.
 * S13 (notice before default, getStatus().default_notice_sent): the same attention card,
 * leading with the default date, what changes then (my Assumptions' consequences only) and
 * what doesn't change today; once reported, why this notice still came. The report isn't
 * offered any more (getStatus), so the only action is the pay stub.
 */
export default function AdvanceDetails({
  Frame,
  advance,
  status,
  reminders,
  onBack,
  onPayYourself,
  onReportPayrollDelay,
}) {
  const [lateOpen, setLateOpen] = useState(false);
  const [justReported, setJustReported] = useState(false);
  const confirmationRef = useRef(null);

  const due = formatDate(advance.due_date);
  const time = formatTime(advance.collection.time);
  const until = formatDate(advance.permission.ends_by);
  const notCollected = status.phase === "not_collected";
  const late = status.phase === "late";
  const afterPayday = notCollected || late;

  // Only after the person's own tap, not when the screen opens already reported.
  useEffect(() => {
    if (justReported && status.reminders_paused) confirmationRef.current?.focus();
  }, [justReported, status.reminders_paused]);

  function reportPayrollDelay() {
    setJustReported(true);
    onReportPayrollDelay();
  }

  return (
    <Frame
      title="Your salary advance: NovaPay"
      appBar={<AppBar title="Your salary advance" onBack={onBack} backLabel="Back to home" />}
      sheet={<LateSheet open={lateOpen} onClose={() => setLateOpen(false)} due={due} until={until} />}
      actions={
        afterPayday ? (
          <>
            {late && status.can_report_payroll_delay ? (
              <Button variant="secondary" onClick={reportPayrollDelay}>
                My salary is late
              </Button>
            ) : null}
            <Button variant="secondary" onClick={onPayYourself}>
              Pay some or all yourself
            </Button>
          </>
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

      {late && status.default_notice_sent ? (
        <Card tone="attention">
          <DefaultDateLabel date={advance.default_date} />
          <div className="mt-1">
            <DefaultNoticeStatus status={status} defaultDate={advance.default_date} detailed />
          </div>
          <LateLink onOpen={() => setLateOpen(true)} />
        </Card>
      ) : late ? (
        <Card tone="attention">
          <LateLabel days={status.days_late} />
          <div className="mt-1">
            <LateStatus
              status={status}
              defaultDate={advance.default_date}
              reminders={reminders}
              confirmationRef={confirmationRef}
              detailed
            />
          </div>
          <LateLink onOpen={() => setLateOpen(true)} />
        </Card>
      ) : null}

      <AdvanceSummary
        disbursed={advance.disbursed_amount}
        fee={advance.fee}
        total={advance.total}
        due={due}
        time={time}
        received
        heading={afterPayday ? "What you agreed" : "Your advance"}
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
      {afterPayday ? null : (
        <Card className="space-y-2">
          <LateLine due={due} time={time} onOpen={() => setLateOpen(true)} />
        </Card>
      )}
    </Frame>
  );
}
