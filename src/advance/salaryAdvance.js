/**
 * Salary advance: the one source of truth for money and dates.
 * Screens read from here. They never calculate money or dates themselves.
 *
 * Conventions
 * - Money is whole rupees (integers).
 * - Dates are "YYYY-MM-DD" strings and times are "HH:mm" (local time).
 *   No Date object leaves this module.
 * - `today` is always passed in. There is no hidden clock.
 * - Unknown is null, never 0. An invalid request returns null, never a guess.
 *
 * Sources: PR = PRODUCT_REFERENCE.md, MR = docs/00-my-read.md (Assumptions and principles).
 * "Decided" marks a call made while planning this module.
 */

// ---- Rules -----------------------------------------------------------------

export const TIERS = [5000, 10000, 15000]; // PR: loan tiers
export const FEE_PERCENT = 3; // PR: 3% of the amount paid out, charged once
export const COLLECTION_TIME = "18:00"; // MR: payday at 6pm, once salary has landed
export const DEFAULT_AFTER_DAYS = 30; // PR: default at 30+ days past due; day 30 counts
export const NOT_COLLECTED_REASONS = [
  "salary_not_arrived",
  "salary_short",
  "balance_dropped",
  "salary_moved_to_bank",
];

// Reminders. MR principle 4: at most 2 a week, none between 10pm and 8am.
export const REMINDER_TIME = "10:00";
export const QUIET_HOURS = { from: "22:00", to: "08:00" };
export const MAX_REMINDERS_PER_7_DAYS = 2;
export const REMINDER_DAYS_BEFORE_DUE = 3; // 25 Jul for persona A
export const NOTICE_DAYS_BEFORE_DEFAULT = 7; // 20 Aug for persona A
export const LATE_REMINDER_EVERY_DAYS = 7; // PLACEHOLDER: the cadence isn't decided yet

export const PROTOTYPE_TODAY = "2026-07-07"; // MR: today is 7 Jul. The year is never shown

// MR: persona A is paid into NovaPay, persona B into a bank account.
// The 4,250 balance comes from the starter home screen (decided for both).
export const PERSONAS = {
  A: {
    id: "A",
    income_source: "salaried",
    income_verified: true,
    salary_destination: "novapay",
    salary_amount: 68000,
    payday: 28,
    limit: 10000,
    wallet_balance: 4250,
  },
  B: {
    id: "B",
    income_source: "salaried",
    income_verified: false,
    salary_destination: "bank",
    salary_amount: null,
    payday: null,
    limit: null,
    wallet_balance: 4250,
  },
};

// ---- Date helpers (private) ------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n) => String(n).padStart(2, "0");

function toUtc(date) {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

function addDays(date, days) {
  return new Date(toUtc(date) + days * DAY_MS).toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

// The next payday strictly after today. Payday 28 exists in every month.
function nextPayday(payday, today) {
  const [y, m, d] = today.split("-").map(Number);
  const [year, month] = d < payday ? [y, m] : m === 12 ? [y + 1, 1] : [y, m + 1];
  return `${year}-${pad(month)}-${pad(payday)}`;
}

// ---- Money helpers (private) -----------------------------------------------

function feeFor(amount) {
  const fee = (amount * FEE_PERCENT) / 100;
  if (!Number.isInteger(fee)) throw new Error(`Fee for ${amount} is not whole rupees`);
  return fee;
}

// Only events up to and including today count.
const upTo = (events, today) => events.filter((e) => e.date <= today);

function paidBy(advance, today) {
  return upTo(advance.payments, today).reduce((sum, p) => sum + p.amount, 0);
}

function repaidOn(advance, today) {
  let paid = 0;
  for (const p of upTo(advance.payments, today)) {
    paid += p.amount;
    if (paid >= advance.total) return p.date;
  }
  return null;
}

function failedAttemptOn(advance, date, today) {
  return (
    upTo(advance.collection_attempts, today).find(
      (a) => a.date === date && a.result === "not_collected"
    ) ?? null
  );
}

// ---- Offer, terms, accept --------------------------------------------------

const NO_OFFER = { limit: null, due_date: null, days_until_due: null, collection_time: null, tiers: null };

// `advance` is the person's current advance, if any. MR: one advance at a time, so while
// one is open (not yet repaid) there's no new offer.
export function getOffer(persona, today, advance = null) {
  if (!persona.income_verified || persona.limit == null || persona.payday == null) {
    return { eligibility: "needs_verification", ...NO_OFFER };
  }
  if (advance && repaidOn(advance, today) == null) {
    return { eligibility: "has_advance", ...NO_OFFER };
  }
  const due_date = nextPayday(persona.payday, today);
  return {
    eligibility: "eligible",
    limit: persona.limit,
    due_date,
    days_until_due: daysBetween(today, due_date),
    collection_time: COLLECTION_TIME, // so the offer screen can say "at 6pm" without reaching for a constant
    tiers: TIERS.map((amount) =>
      amount <= persona.limit
        ? { amount, fee: feeFor(amount), total: amount + feeFor(amount), available: true, blocked_reason: null }
        : { amount, fee: null, total: null, available: false, blocked_reason: "over_limit" }
    ),
  };
}

function buildTerms({ persona_id, offered_on, applied_amount, disbursed_amount, due_date, reduced_from }) {
  const fee = feeFor(disbursed_amount);
  const total = disbursed_amount + fee;
  const default_date = addDays(due_date, DEFAULT_AFTER_DAYS);
  return {
    id: `${persona_id}-${offered_on}-${applied_amount}-${disbursed_amount}`,
    persona_id,
    offered_on,
    applied_amount,
    disbursed_amount,
    fee,
    total,
    due_date,
    collection: { date: due_date, time: COLLECTION_TIME, from: "novapay_wallet" },
    default_date,
    // MR: the permission ends when repaid or at the default date, whichever comes first.
    permission: { amount: total, from_date: due_date, ends_by: default_date },
    reduced_from,
  };
}

// Null if the amount isn't a tier, is over the limit, the persona isn't eligible, or an
// advance is already open.
export function getTerms(persona, applied_amount, today, advance = null) {
  const offer = getOffer(persona, today, advance);
  const tier = offer.tiers?.find((t) => t.amount === applied_amount);
  if (!tier || !tier.available) return null;
  return buildTerms({
    persona_id: persona.id,
    offered_on: today,
    applied_amount,
    disbursed_amount: applied_amount,
    due_date: offer.due_date,
    reduced_from: null,
  });
}

// MR: a reduced payout always drops to a lower tier, so the fee stays whole.
// Null when there's no lower tier (from Rs 5,000): not shown in the prototype.
export function reducePayout(terms) {
  const lower = TIERS.filter((t) => t < terms.disbursed_amount).pop();
  if (lower == null) return null;
  return buildTerms({
    persona_id: terms.persona_id,
    offered_on: terms.offered_on,
    applied_amount: terms.applied_amount,
    disbursed_amount: lower,
    due_date: terms.due_date,
    reduced_from: { disbursed_amount: terms.disbursed_amount, fee: terms.fee, total: terms.total },
  });
}

// Accepting the same terms twice returns the same advance, never a second one.
const accepted = new Map();

export function acceptTerms(terms, { permission_granted }, today) {
  if (permission_granted !== true) return { error: "permission_required" };
  if (accepted.has(terms.id)) return accepted.get(terms.id);
  const advance = {
    id: terms.id,
    applied_amount: terms.applied_amount,
    disbursed_amount: terms.disbursed_amount,
    fee: terms.fee,
    total: terms.total,
    accepted_on: today,
    received_on: today, // MR: the payout lands in the wallet when accepted
    due_date: terms.due_date,
    default_date: terms.default_date,
    // What was agreed, kept on the advance so the receipt shows exactly the accepted terms.
    collection: terms.collection,
    permission: terms.permission,
    permission_granted: true,
    payments: [],
    collection_attempts: [],
    payroll_delay_reported_on: null,
  };
  accepted.set(terms.id, advance);
  return advance;
}

// ---- After accept ----------------------------------------------------------

// MR: collection is full amount only, from the NovaPay wallet, once salary has landed.
// After payday, it's attempted again only when salary lands (decided, not any incoming money).
export function collectionOutcome(advance, { date, time, salary_landed, salary_amount = null, balance, salary_destination = "novapay" }) {
  const owed = advance.total - paidBy(advance, date);
  if (owed <= 0) return advance;
  let reason = null;
  if (salary_destination !== "novapay") reason = "salary_moved_to_bank";
  else if (!salary_landed) reason = "salary_not_arrived";
  else if (balance < owed && salary_amount < owed) reason = "salary_short";
  else if (balance < owed) reason = "balance_dropped";
  return {
    ...advance,
    collection_attempts: [
      ...advance.collection_attempts,
      { date, time, result: reason ? "not_collected" : "collected", reason },
    ],
    payments: reason ? advance.payments : [...advance.payments, { date, amount: owed, method: "auto" }],
  };
}

// MR: the user can report a payroll delay, and reminders pause. Days late still count.
export function reportPayrollDelay(advance, date) {
  return { ...advance, payroll_delay_reported_on: advance.payroll_delay_reported_on ?? date };
}

export function getStatus(advance, today) {
  const repaid_on = repaidOn(advance, today);
  const attempts = upTo(advance.collection_attempts, today);
  const reported = advance.payroll_delay_reported_on;
  const common = {
    outstanding: advance.total - paidBy(advance, today),
    repaid_on,
    permission: {
      active: repaid_on == null && today < advance.default_date,
      ends_on: repaid_on != null && repaid_on < advance.default_date ? repaid_on : advance.default_date,
    },
    last_attempt: attempts.length ? attempts[attempts.length - 1] : null,
    reminders_paused: reported != null && reported <= today,
  };

  // Days late are counted from the due date and shown truthfully. No grace rule.
  if (repaid_on) {
    const days_late = Math.max(0, daysBetween(advance.due_date, repaid_on));
    const repayment_status = days_late === 0 ? "on_time" : days_late >= DEFAULT_AFTER_DAYS ? "default" : "late";
    return {
      phase: "repaid",
      repayment_status,
      days_late,
      days_until_due: null,
      days_until_default: null,
      before_due_reminder_sent: false,
      can_report_payroll_delay: false,
      default_notice_sent: false,
      ...common,
    };
  }

  const sinceDue = daysBetween(advance.due_date, today);
  const days_late = Math.max(0, sinceDue);
  let phase;
  if (sinceDue < 0) phase = "before_due";
  else if (sinceDue === 0) phase = failedAttemptOn(advance, advance.due_date, today) ? "not_collected" : "due_today";
  else if (days_late >= DEFAULT_AFTER_DAYS) phase = "default";
  else phase = "late";

  // S13: the notice before default has gone out (never paused) and it's still late, so the
  // screens lead with the default date. Decided here, not in the screen.
  const default_notice_sent =
    phase === "late" && getReminders(advance, today).some((r) => r.type === "before_default" && r.status === "sent");

  return {
    phase,
    repayment_status: phase === "late" || phase === "default" ? phase : null,
    days_late,
    days_until_due: sinceDue <= 0 ? -sinceDue : null,
    days_until_default: phase === "default" ? null : daysBetween(today, advance.default_date),
    // S10: the reminder before the due date has gone out and the advance isn't due yet, so
    // Home's advance card becomes that reminder in the app. Decided here, not in the screen.
    before_due_reminder_sent:
      phase === "before_due" &&
      getReminders(advance, today).some((r) => r.type === "before_due" && r.status === "sent"),
    // S12: "My salary is late" is offered once the repayment is late (not on payday evening,
    // when nobody can know yet), only when the salary didn't arrive (MR), and until reported.
    // Prototype: the report is dated 2 Aug (MR), so it isn't offered once the notice before
    // default has gone out; a later report would be recorded with the wrong date.
    can_report_payroll_delay:
      phase === "late" &&
      common.last_attempt?.reason === "salary_not_arrived" &&
      reported == null &&
      !default_notice_sent,
    default_notice_sent,
    ...common,
  };
}

// ---- Reminders -------------------------------------------------------------

// True if adding `date` keeps every 7-day window at or under the cap.
function fitsCap(kept, date) {
  for (let start = addDays(date, -6); start <= date; start = addDays(start, 1)) {
    const end = addDays(start, 6);
    const inWindow = kept.filter((r) => r.date >= start && r.date <= end).length;
    if (inWindow >= MAX_REMINDERS_PER_7_DAYS) return false;
  }
  return true;
}

// Decided: a material consequence must always be announced, so this is never paused.
const NEVER_PAUSED = ["before_default"];

/**
 * Every reminder for this advance as known today, each with a status:
 * "sent" (on or before today), "scheduled" (later, if nothing changes) or "paused".
 * Notices about events win over routine late reminders when the 2-a-week cap bites.
 * Nothing is sent on or after the default date.
 */
export function getReminders(advance, today) {
  const repaid_on = repaidOn(advance, today);
  const owedOn = (date) => repaid_on == null || repaid_on >= date;
  const due = advance.due_date;
  const failed = failedAttemptOn(advance, due, today);
  const lateKnown = failed != null || (today > due && owedOn(due));
  const candidates = [];

  const beforeDue = addDays(due, -REMINDER_DAYS_BEFORE_DUE);
  if (beforeDue >= advance.accepted_on && owedOn(beforeDue)) {
    candidates.push({ type: "before_due", date: beforeDue, time: REMINDER_TIME, priority: 1 });
  }
  if (failed) {
    // Sent when the collection fails, not at 10:00: the attempt is at 6pm. Inside 8am–10pm.
    candidates.push({ type: "not_collected", date: due, time: failed.time, priority: 0 });
  }
  if (lateKnown) {
    for (let d = addDays(due, LATE_REMINDER_EVERY_DAYS); d < advance.default_date; d = addDays(d, LATE_REMINDER_EVERY_DAYS)) {
      if (owedOn(d)) candidates.push({ type: "late", date: d, time: REMINDER_TIME, priority: 2 });
    }
    const beforeDefault = addDays(advance.default_date, -NOTICE_DAYS_BEFORE_DEFAULT);
    if (owedOn(beforeDefault)) {
      candidates.push({ type: "before_default", date: beforeDefault, time: REMINDER_TIME, priority: 0 });
    }
  }

  const reported = advance.payroll_delay_reported_on;
  const pausedAfter = reported != null && reported <= today ? reported : null;
  const kept = [];
  const out = [];
  candidates.sort((a, b) => a.priority - b.priority || a.date.localeCompare(b.date));
  for (const c of candidates) {
    if (pausedAfter && c.date > pausedAfter && !NEVER_PAUSED.includes(c.type)) {
      out.push({ ...c, status: "paused" });
    } else if (fitsCap(kept, c.date)) {
      kept.push(c);
      out.push({ ...c, status: c.date <= today ? "sent" : "scheduled" });
    }
  }
  return out
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .map(({ priority, ...reminder }) => reminder);
}

// ---- Recent activity and wallet (sample data) ------------------------------

// SAMPLE DATA, decided in chat 5: the money that moves in and out of persona A's wallet,
// so the balance on every reviewer date is explained by rows, never guessed. These are a
// story for the prototype, not policy. Amounts are positive; `direction` says which way.
// `order` sorts rows within a day (higher is later).
// Before the advance: persona.wallet_balance (4,250) is the balance after these rows.
const ROWS_BEFORE = [
  { id: "topup-jun", date: "2026-06-27", order: 1, title: "Paid for mobile top-up", direction: "out", amount: 500 },
  { id: "salary-jun", date: "2026-06-28", order: 1, title: "Salary credited", direction: "in", salary: true },
  { id: "sent-jul-7", date: "2026-07-07", order: 1, title: "Sent to Ahmed K.", direction: "out", amount: 1500 },
];
// After the advance, the same in every cause: 14,250 on 7 Jul → 1,800 on 25 Jul.
const ROWS_AFTER_ADVANCE = [
  { id: "groceries-jul", date: "2026-07-12", order: 1, title: "Paid for groceries", direction: "out", amount: 6200 },
  { id: "electricity-jul", date: "2026-07-15", order: 1, title: "Paid electricity bill", direction: "out", amount: 3750 },
  { id: "sent-jul-21", date: "2026-07-21", order: 1, title: "Sent to Ahmed K.", direction: "out", amount: 2500 },
];
// Leading up to 6pm on payday, by cause. The salary row's amount is the cause's
// salary_amount, so it can't drift from the collection inputs below.
const ROWS_BY_CAUSE = {
  salary_not_arrived: [],
  salary_short: [
    { id: "topup-jul", date: "2026-07-27", order: 1, title: "Paid for mobile top-up", direction: "out", amount: 1200 },
    { id: "salary-jul", date: "2026-07-28", order: 1, title: "Salary credited", direction: "in", salary: true },
  ],
  balance_dropped: [
    { id: "salary-jul", date: "2026-07-28", order: 1, title: "Salary credited", direction: "in", salary: true },
    { id: "rent-jul", date: "2026-07-28", order: 2, title: "Paid rent", direction: "out", amount: 45000 },
    { id: "sent-jul-28", date: "2026-07-28", order: 3, title: "Sent to Ahmed K.", direction: "out", amount: 18300 },
  ],
  salary_moved_to_bank: [],
};
export const ACTIVITY_LIMIT = 4; // recent activity shows the latest rows only

// The cause comes from the advance itself: its failed attempt on the due date, if any.
// Nothing after payday is modelled, so later dates carry 28 Jul's rows and balance forward.
function causeOf(advance) {
  return (
    advance?.collection_attempts.find((a) => a.date === advance.due_date && a.result === "not_collected")?.reason ?? null
  );
}

// Every sample row for this persona and advance, oldest first, with whole amounts.
function allRows(persona, advance, cause) {
  const paidIntoNovaPay = persona.salary_destination === "novapay" && persona.salary_amount != null;
  const salaryFor = (row) => (row.date === "2026-06-28" ? persona.salary_amount : NOT_COLLECTED_INPUTS[cause].salary_amount);
  const list = [...ROWS_BEFORE];
  if (advance) {
    list.push({
      id: "advance",
      date: advance.received_on,
      order: 2,
      title: "Advance received",
      direction: "in",
      amount: advance.disbursed_amount,
    });
    list.push(...ROWS_AFTER_ADVANCE);
    if (cause) list.push(...ROWS_BY_CAUSE[cause]);
  }
  return list
    .filter((row) => !row.salary || paidIntoNovaPay)
    .map(({ salary, ...row }) => (salary ? { ...row, amount: salaryFor(row) } : row))
    .sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order);
}

// The balance at the end of `day`: persona.wallet_balance on the prototype's first day,
// plus every row after it. Unknown before that day: null, never a guess.
function balanceOn(persona, advance, cause, day) {
  if (persona.wallet_balance == null || day < PROTOTYPE_TODAY) return null;
  return allRows(persona, advance, cause)
    .filter((row) => (row.date > PROTOTYPE_TODAY || row.id === "advance") && row.date <= day)
    .reduce((sum, row) => sum + (row.direction === "in" ? row.amount : -row.amount), persona.wallet_balance);
}

/**
 * Recent activity as of today: the latest ACTIVITY_LIMIT rows, newest first.
 * Only money that moved. A failed collection isn't a row (decided: it's shown on the
 * advance card and the late screens, not in the person's history).
 */
export function getActivity(persona, advance, today) {
  return allRows(persona, advance, causeOf(advance))
    .filter((row) => row.date <= today)
    .reverse()
    .slice(0, ACTIVITY_LIMIT)
    .map(({ order, ...row }) => row);
}

// Decided: show the real balance, from the activity rows. "Includes Rs X from your
// advance" is shown on the payout day only: once money is spent, how much of the
// balance is borrowed can't be said.
export function getWallet(persona, advance, today) {
  const balance = balanceOn(persona, advance, causeOf(advance), today);
  const payoutDay = advance != null && today === advance.received_on && balance != null;
  return { balance, includes_advance: payoutDay ? advance.disbursed_amount : null };
}

// ---- Formatting dates and times --------------------------------------------

export function formatDate(date) {
  if (date == null) return null;
  const [, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

// "Today" when the date is today, otherwise the date ("28 Jun").
export function formatDay(date, today) {
  if (date == null) return null;
  return date === today ? "Today" : formatDate(date);
}

export function formatTime(time) {
  if (time == null) return null;
  const [h, min] = time.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const hour = h % 12 || 12;
  return min ? `${hour}:${pad(min)}${suffix}` : `${hour}${suffix}`;
}

// ---- Reviewer scenarios ----------------------------------------------------

// The date each state is viewed on. Everything else is 7 Jul.
const SCENARIO_DATES = {
  S10: "2026-07-25", // reminder before the due date
  S11: "2026-07-28", // not collected on payday
  S12: "2026-08-02", // late, 5 days
  S13: "2026-08-20", // notice before default
};

// Inputs for each "not collected" cause. Scenario data only; screens don't show these.
// The 6pm balance isn't listed: it comes from the activity rows (1,800 / 9,600 / 6,500 / 1,800).
const NOT_COLLECTED_INPUTS = {
  salary_not_arrived: { salary_landed: false, salary_amount: null, salary_destination: "novapay" },
  salary_short: { salary_landed: true, salary_amount: 9000, salary_destination: "novapay" },
  balance_dropped: { salary_landed: true, salary_amount: 68000, salary_destination: "novapay" },
  salary_moved_to_bank: { salary_landed: false, salary_amount: null, salary_destination: "bank" },
};

export const SCENARIO_IDS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10", "S11", "S12", "S13"];

// The dates the reviewer control offers for persona A. 7 Jul runs the live flow (S1–S9).
export const REVIEW_DATES = ["S1", "S10", "S11", "S12", "S13"].map((id) => ({
  scenario: id,
  date: SCENARIO_DATES[id] ?? PROTOTYPE_TODAY,
}));

// Decided (chat 5): in the reviewer scenarios a payroll delay is reported on 2 Aug, the
// day the late state (S12) is viewed, and only when the salary didn't arrive. Whether
// other causes can be reported as a payroll delay is policy that isn't written.
export const PAYROLL_DELAY_REPORTED_ON = "2026-08-02";
const CAUSE_SCENARIOS = ["S11", "S12", "S13"]; // collection has been attempted

// Which reviewer choices apply to a scenario, so the control shows only what changes it.
export function scenarioOptions(id, { reason = "salary_not_arrived" } = {}) {
  const today = SCENARIO_DATES[id] ?? PROTOTYPE_TODAY;
  const hasCause = CAUSE_SCENARIOS.includes(id);
  return {
    reason: hasCause,
    payroll_delay: hasCause && reason === "salary_not_arrived" && today >= PAYROLL_DELAY_REPORTED_ON,
  };
}

export function scenario(id, { reason = "salary_not_arrived", payroll_delay = false } = {}) {
  if (!SCENARIO_IDS.includes(id)) throw new Error(`Unknown scenario ${id}`);
  const today = SCENARIO_DATES[id] ?? PROTOTYPE_TODAY;
  if (id === "S2") {
    const B = PERSONAS.B;
    return { id, persona: B, today, offer: getOffer(B, today), terms: null, advance: null };
  }

  const A = PERSONAS.A;
  const offer = getOffer(A, PROTOTYPE_TODAY);
  const terms = getTerms(A, 10000, PROTOTYPE_TODAY);
  const base = { id, persona: A, today, offer, terms, advance: null };
  if (["S1", "S3", "S4", "S5", "S6"].includes(id)) return base;
  if (id === "S7") return { ...base, terms: reducePayout(terms) };

  let advance = acceptTerms(terms, { permission_granted: true }, PROTOTYPE_TODAY);
  if (CAUSE_SCENARIOS.includes(id)) {
    advance = collectionOutcome(advance, {
      date: advance.due_date,
      time: COLLECTION_TIME,
      balance: balanceOn(A, advance, reason, advance.due_date),
      ...NOT_COLLECTED_INPUTS[reason],
    });
  }
  // A delay asked for where it doesn't apply is ignored, never half-applied.
  if (payroll_delay && scenarioOptions(id, { reason }).payroll_delay) {
    advance = reportPayrollDelay(advance, PAYROLL_DELAY_REPORTED_ON);
  }
  return { ...base, advance };
}
