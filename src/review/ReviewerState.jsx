import { Choice, Button } from "../novakit";
import { NOT_COLLECTED_REASONS, PAYROLL_DELAY_REPORTED_ON, REVIEW_DATES, formatDate } from "../advance/salaryAdvance";
import SegmentedControl from "./SegmentedControl";
import DateSteps from "./DateSteps";
import AcceptOutcome, { ACCEPT_OUTCOMES } from "./AcceptOutcome";

const PERSONA_OPTIONS = [
  { id: "A", label: "Persona A", description: "Salary into NovaPay, limit Rs 10,000." },
  { id: "B", label: "Persona B", description: "Salary into a bank. 7 Jul only." },
];

// What each reviewer date shows. The dates themselves come from the module.
const DATE_NAMES = {
  S1: "Accept flow (S1–S9)",
  S10: "Reminder (S10)",
  S11: "Payday (S11)",
  S12: "Late (S12)",
  S13: "Default notice (S13)",
};

const CAUSE_LABELS = {
  salary_not_arrived: "Salary didn't arrive",
  salary_short: "Salary arrived short",
  balance_dropped: "Balance dropped",
  salary_moved_to_bank: "Salary moved to a bank",
};

const CAUSE_OPTIONS = NOT_COLLECTED_REASONS.map((id) => ({ id, label: CAUSE_LABELS[id] }));

const DATE_STEPS =REVIEW_DATES.map((d) => ({ id: d.scenario, date: formatDate(d.date), name: DATE_NAMES[d.scenario] }));

/**
 * Reviewer tools: one panel beside the phone frame, never inside it, on a neutral-100
 * surface so it never passes for product UI. It sets data, not screens. App builds
 * everything from the module's scenario().
 *
 * Order: what the phone shows now, then who, when, why it wasn't collected, and what
 * happens after Accept. Groups that only apply on some dates (`options`, from
 * scenarioOptions; After Accept only on 7 Jul with persona A) sit below the ones that
 * always show, so their arrival never moves anything above them. A hidden choice keeps
 * its selection. Persona B is 7 Jul only: B has no advance. Not part of the product, so
 * it may start with a selection. "Start again" returns to 7 Jul, persona A, nothing
 * accepted.
 */
export default function ReviewerState({ value, options, outcome, onOutcomeChange, showOutcome, onChange, onStartAgain }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const isA = value.persona === "A";
  const step = DATE_STEPS.find((s) => s.id === value.scenario);

  // Two lines: when and what (the state), then who and anything else that shapes it.
  const summary = isA ? `${step.date} · ${step.name}` : `${formatDate(REVIEW_DATES[0].date)} · Needs verification (S2)`;
  const detail = [
    `Persona ${value.persona}`,
    isA && options.reason ? CAUSE_LABELS[value.reason] : null,
    isA && options.payroll_delay && value.payroll_delay ? `Payroll delay reported on ${formatDate(PAYROLL_DELAY_REPORTED_ON)}` : null,
    showOutcome ? `After Accept: ${ACCEPT_OUTCOMES.find((o) => o.id === outcome).label}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section aria-labelledby="reviewer-tools-title" className="w-64 rounded-lg border border-neutral-300 bg-neutral-100 p-4">
      <h2 id="reviewer-tools-title" className="text-body font-semibold text-neutral-900">
        Reviewer tools
      </h2>
      <p className="text-caption text-neutral-700">Not part of the app.</p>

      {/* Groups are 16px apart; inside a group, 8px or less. */}
      <div className="mt-4 space-y-4">
        <div className="rounded-md bg-white p-3" aria-live="polite">
          <p className="text-caption text-neutral-700">Now showing</p>
          <p className="text-body font-semibold text-neutral-900">{summary}</p>
          <p className="text-caption text-neutral-700">{detail}</p>
        </div>

        <SegmentedControl
          legend="Who"
          name="review-persona"
          options={PERSONA_OPTIONS}
          value={value.persona}
          onChange={(persona) => set({ persona })}
        />

        {isA ? (
          <DateSteps
            legend="When"
            name="review-date"
            steps={DATE_STEPS}
            value={value.scenario}
            onChange={(scenario) => set({ scenario })}
          />
        ) : null}

        {isA && options.reason ? (
          <div className="space-y-1">
            <SegmentedControl
              legend="Why it wasn't collected"
              name="review-reason"
              columns={2}
              options={CAUSE_OPTIONS}
              value={value.reason}
              onChange={(reason) => set({ reason })}
            />
            {options.payroll_delay ? (
              <Choice
                type="checkbox"
                checked={value.payroll_delay}
                onChange={(e) => set({ payroll_delay: e.target.checked })}
                label="Payroll delay reported"
              />
            ) : null}
          </div>
        ) : null}

        {showOutcome ? <AcceptOutcome value={outcome} onChange={onOutcomeChange} /> : null}
      </div>

      <div className="mt-4 border-t border-neutral-300 pt-4">
        <Button variant="secondary" onClick={onStartAgain}>
          Start again
        </Button>
      </div>
    </section>
  );
}
