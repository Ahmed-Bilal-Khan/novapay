import { Card, Choice, Button } from "../novakit";
import { NOT_COLLECTED_REASONS, PAYROLL_DELAY_REPORTED_ON, REVIEW_DATES, formatDate } from "../advance/salaryAdvance";

const PERSONA_OPTIONS = [
  { id: "A", label: "Persona A", description: "Salary paid into NovaPay. Limit Rs 10,000." },
  { id: "B", label: "Persona B", description: "Salary paid into a bank account. Needs verification." },
];

// What each reviewer date shows. The dates themselves come from the module.
const DATE_NAMES = {
  S1: "Offer and accept (S1–S9)",
  S10: "Reminder before the due date (S10)",
  S11: "Payday, not collected (S11)",
  S12: "Late (S12)",
  S13: "Notice before default (S13)",
};

const CAUSE_LABELS = {
  salary_not_arrived: "Salary didn't arrive",
  salary_short: "Salary arrived short",
  balance_dropped: "Balance dropped before 6pm",
  salary_moved_to_bank: "Salary moved to a bank",
};

/**
 * Reviewer scaffolding, shown beside the phone frame, never inside it. It sets data, not
 * screens: the persona, the date, the not-collected cause and whether a payroll delay was
 * reported. App builds everything from the module's scenario(). A choice that doesn't
 * change anything on the chosen date isn't shown (`options`, from scenarioOptions), and
 * keeps its selection for when it applies again. Persona B is 7 Jul only: B has no advance.
 * Not part of the product, so it may start with a selection.
 * "Start again" returns to 7 Jul, persona A, nothing accepted.
 */
export default function ReviewerState({ value, options, onChange, onStartAgain }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const isA = value.persona === "A";

  return (
    <Card className="w-64 shrink-0 space-y-3">
      <h2 className="text-body font-semibold text-neutral-900">Reviewer: who and when</h2>

      <fieldset>
        <legend className="text-caption text-neutral-700">Persona</legend>
        {PERSONA_OPTIONS.map((p) => (
          <Choice
            key={p.id}
            type="radio"
            name="review-persona"
            value={p.id}
            checked={value.persona === p.id}
            onChange={() => set({ persona: p.id })}
            label={p.label}
            description={p.description}
          />
        ))}
      </fieldset>

      {isA ? (
        <fieldset>
          <legend className="text-caption text-neutral-700">Date</legend>
          {REVIEW_DATES.map((d) => (
            <Choice
              key={d.scenario}
              type="radio"
              name="review-date"
              value={d.scenario}
              checked={value.scenario === d.scenario}
              onChange={() => set({ scenario: d.scenario })}
              label={formatDate(d.date)}
              description={DATE_NAMES[d.scenario]}
            />
          ))}
        </fieldset>
      ) : null}

      {isA && options.reason ? (
        <fieldset>
          <legend className="text-caption text-neutral-700">Why it wasn't collected</legend>
          {NOT_COLLECTED_REASONS.map((reason) => (
            <Choice
              key={reason}
              type="radio"
              name="review-reason"
              value={reason}
              checked={value.reason === reason}
              onChange={() => set({ reason })}
              label={CAUSE_LABELS[reason]}
            />
          ))}
        </fieldset>
      ) : null}

      {isA && options.payroll_delay ? (
        <Choice
          type="checkbox"
          checked={value.payroll_delay}
          onChange={(e) => set({ payroll_delay: e.target.checked })}
          label="Payroll delay reported"
          description={`Reported on ${formatDate(PAYROLL_DELAY_REPORTED_ON)}.`}
        />
      ) : null}

      <Button variant="secondary" onClick={onStartAgain}>
        Start again
      </Button>
    </Card>
  );
}
