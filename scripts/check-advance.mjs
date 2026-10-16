// npm run check (part 2): proves the salary-advance module gives the numbers and dates
// the screens rely on. Plain Node, nothing installed. See src/advance/salaryAdvance.js.
import assert from 'node:assert/strict';
import * as SA from '../src/advance/salaryAdvance.js';

const { PERSONAS } = SA;
const A = PERSONAS.A;
const B = PERSONAS.B;
const TODAY = SA.PROTOTYPE_TODAY;
let passed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failures.push(`  ${name}\n    ${e.message.split('\n').join('\n    ')}`);
  }
}

// Helpers that build the late path for persona A.
const terms10k = () => SA.getTerms(A, 10000, TODAY);
const accept = (t = terms10k()) => SA.acceptTerms(t, { permission_granted: true }, TODAY);
const notCollected = (advance, overrides = {}) =>
  SA.collectionOutcome(advance, {
    date: '2026-07-28', time: SA.COLLECTION_TIME,
    salary_landed: false, salary_amount: null, balance: 1800, salary_destination: 'novapay',
    ...overrides,
  });
const daysApart = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// ---- Offer ----

check('Persona A offer: limit, due date, days until due, 6pm collection', () => {
  const o = SA.getOffer(A, TODAY);
  assert.equal(o.eligibility, 'eligible');
  assert.equal(o.limit, 10000);
  assert.equal(o.due_date, '2026-07-28');
  assert.equal(o.days_until_due, 21);
  assert.equal(o.collection_time, '18:00');
});

check('Persona A tiers: ascending, fee in rupees, total, 15,000 blocked over the limit', () => {
  assert.deepEqual(SA.getOffer(A, TODAY).tiers, [
    { amount: 5000, fee: 150, total: 5150, available: true, blocked_reason: null },
    { amount: 10000, fee: 300, total: 10300, available: true, blocked_reason: null },
    { amount: 15000, fee: null, total: null, available: false, blocked_reason: 'over_limit' },
  ]);
});

check('Persona B needs verification, and nothing unknown shows as 0', () => {
  assert.deepEqual(SA.getOffer(B, TODAY), {
    eligibility: 'needs_verification', limit: null, due_date: null, days_until_due: null,
    collection_time: null, tiers: null,
  });
});

// ---- Terms ----

check('Terms for Rs 10,000: fee, total, due, 6pm collection, default date, permission', () => {
  const t = terms10k();
  assert.equal(t.disbursed_amount, 10000);
  assert.equal(t.fee, 300);
  assert.equal(t.total, 10300);
  assert.equal(t.due_date, '2026-07-28');
  assert.deepEqual(t.collection, { date: '2026-07-28', time: '18:00', from: 'novapay_wallet' });
  assert.equal(t.default_date, '2026-08-27');
  assert.deepEqual(t.permission, { amount: 10300, from_date: '2026-07-28', ends_by: '2026-08-27' });
  assert.equal(t.reduced_from, null);
});

check('No terms for over the limit, a non-tier amount, or persona B', () => {
  assert.equal(SA.getTerms(A, 15000, TODAY), null);
  assert.equal(SA.getTerms(A, 7000, TODAY), null);
  assert.equal(SA.getTerms(B, 5000, TODAY), null);
});

check('Every fee is a whole number of rupees', () => {
  for (const tier of SA.TIERS) assert.ok(Number.isInteger((tier * SA.FEE_PERCENT) / 100), `${tier}`);
});

// ---- Reduced payout ----

check('Reduced payout drops 10,000 to 5,000 and keeps what it replaced', () => {
  const r = SA.reducePayout(terms10k());
  assert.equal(r.applied_amount, 10000);
  assert.equal(r.disbursed_amount, 5000);
  assert.equal(r.fee, 150);
  assert.equal(r.total, 5150);
  assert.equal(r.permission.amount, 5150);
  assert.equal(r.due_date, '2026-07-28');
  assert.deepEqual(r.reduced_from, { disbursed_amount: 10000, fee: 300, total: 10300 });
});

check('No reduced payout below the lowest tier', () => {
  assert.equal(SA.reducePayout(SA.getTerms(A, 5000, TODAY)), null);
});

// ---- Accept ----

check('No advance without the collection permission', () => {
  assert.deepEqual(SA.acceptTerms(terms10k(), { permission_granted: false }, TODAY), { error: 'permission_required' });
  assert.deepEqual(SA.acceptTerms(terms10k(), {}, TODAY), { error: 'permission_required' });
});

check('Accepting the same terms twice returns the same advance, never a second one', () => {
  const t = terms10k();
  const first = SA.acceptTerms(t, { permission_granted: true }, TODAY);
  const again = SA.acceptTerms(t, { permission_granted: true }, TODAY);
  const recomputed = SA.acceptTerms(terms10k(), { permission_granted: true }, TODAY);
  assert.equal(again, first);
  assert.equal(recomputed, first);
  assert.equal(first.total, 10300);
  assert.equal(first.due_date, '2026-07-28');
});

// ---- Collection ----

check('Each "not collected" cause is worked out from the inputs', () => {
  const reasonFor = (o) => notCollected(accept(), o).collection_attempts.at(-1).reason;
  assert.equal(reasonFor({}), 'salary_not_arrived');
  assert.equal(reasonFor({ salary_landed: true, salary_amount: 9000, balance: 9600 }), 'salary_short');
  assert.equal(reasonFor({ salary_landed: true, salary_amount: 68000, balance: 6500 }), 'balance_dropped');
  assert.equal(reasonFor({ salary_destination: 'bank' }), 'salary_moved_to_bank');
});

check('Collected on payday: full amount only, on time, permission ends that day', () => {
  const adv = notCollected(accept(), { salary_landed: true, salary_amount: 68000, balance: 70000 });
  assert.deepEqual(adv.payments, [{ date: '2026-07-28', amount: 10300, method: 'auto' }]);
  const s = SA.getStatus(adv, '2026-07-28');
  assert.equal(s.phase, 'repaid');
  assert.equal(s.repayment_status, 'on_time');
  assert.equal(s.days_late, 0);
  assert.equal(s.outstanding, 0);
  assert.deepEqual(s.permission, { active: false, ends_on: '2026-07-28' });
});

// ---- Status: days late and default ----

check('Before the due date: 3 days to go on 25 Jul, not late', () => {
  const s = SA.getStatus(accept(), '2026-07-25');
  assert.equal(s.phase, 'before_due');
  assert.equal(s.repayment_status, null);
  assert.equal(s.days_until_due, 3);
  assert.equal(s.days_late, 0);
});

check('Not collected on payday: 0 days late on 28 Jul, the event is recorded', () => {
  const s = SA.getStatus(notCollected(accept()), '2026-07-28');
  assert.equal(s.phase, 'not_collected');
  assert.equal(s.repayment_status, null);
  assert.equal(s.days_late, 0);
  assert.equal(s.last_attempt.reason, 'salary_not_arrived');
});

check('Days late count truthfully from the due date', () => {
  const adv = notCollected(accept());
  const at = (d) => SA.getStatus(adv, d);
  assert.equal(at('2026-07-29').days_late, 1);
  assert.equal(at('2026-08-02').days_late, 5);
  assert.equal(at('2026-08-02').phase, 'late');
  assert.equal(at('2026-08-02').repayment_status, 'late');
  assert.equal(at('2026-08-02').days_until_default, 25);
  assert.equal(at('2026-08-02').outstanding, 10300);
  assert.equal(at('2026-08-26').days_late, 29);
  assert.equal(at('2026-08-26').phase, 'late');
});

check('Default on day 30 (27 Aug), and the permission ends then', () => {
  const adv = notCollected(accept());
  const before = SA.getStatus(adv, '2026-08-26');
  const on = SA.getStatus(adv, '2026-08-27');
  assert.deepEqual(before.permission, { active: true, ends_on: '2026-08-27' });
  assert.equal(on.phase, 'default');
  assert.equal(on.repayment_status, 'default');
  assert.equal(on.days_late, 30);
  assert.equal(on.days_until_default, null);
  assert.deepEqual(on.permission, { active: false, ends_on: '2026-08-27' });
});

check('Collected when salary lands late: repaid late, days late stop, permission ends', () => {
  let adv = notCollected(accept());
  adv = SA.collectionOutcome(adv, {
    date: '2026-07-30', time: '11:00', salary_landed: true, salary_amount: 68000, balance: 69800,
  });
  const s = SA.getStatus(adv, '2026-08-10');
  assert.equal(s.phase, 'repaid');
  assert.equal(s.repayment_status, 'late');
  assert.equal(s.days_late, 2);
  assert.deepEqual(s.permission, { active: false, ends_on: '2026-07-30' });
});

check('Events after today are ignored', () => {
  const adv = notCollected(accept());
  assert.equal(SA.getStatus(adv, '2026-07-27').phase, 'before_due');
  assert.equal(SA.getStatus(adv, '2026-07-27').last_attempt, null);
});

// ---- Reminders ----

const reminderList = (adv, today) => SA.getReminders(adv, today).map((r) => `${r.type} ${r.date} ${r.time} ${r.status}`);

check('Before the due date: one reminder, 25 Jul at 10:00', () => {
  assert.deepEqual(reminderList(accept(), '2026-07-20'), ['before_due 2026-07-25 10:00 scheduled']);
  assert.deepEqual(reminderList(accept(), '2026-07-25'), ['before_due 2026-07-25 10:00 sent']);
});

check('Full late path: due reminder, not-collected notice, late reminders, pre-default notice on 20 Aug', () => {
  assert.deepEqual(reminderList(notCollected(accept()), '2026-08-26'), [
    'before_due 2026-07-25 10:00 sent',
    'not_collected 2026-07-28 18:00 sent',
    'late 2026-08-04 10:00 sent',
    'late 2026-08-11 10:00 sent',
    'late 2026-08-18 10:00 sent',
    'before_default 2026-08-20 10:00 sent',
    'late 2026-08-25 10:00 sent',
  ]);
});

check('Reminders: at most 2 in any 7 days, all inside 8am–10pm, none from the default date', () => {
  const all = SA.getReminders(notCollected(accept()), '2026-08-27').filter((r) => r.status !== 'paused');
  for (const r of all) {
    assert.ok(r.time >= SA.QUIET_HOURS.to && r.time < SA.QUIET_HOURS.from, `${r.type} at ${r.time}`);
    assert.ok(r.date < '2026-08-27', `${r.type} on ${r.date}`);
    const inWeek = all.filter((o) => daysApart(r.date, o.date) >= 0 && daysApart(r.date, o.date) < 7);
    assert.ok(inWeek.length <= SA.MAX_REMINDERS_PER_7_DAYS, `${inWeek.length} in the week from ${r.date}`);
  }
  assert.ok(SA.REMINDER_TIME >= SA.QUIET_HOURS.to && SA.REMINDER_TIME < SA.QUIET_HOURS.from);
});

check('Reminders pause after a payroll delay is reported; days late still count', () => {
  const adv = SA.reportPayrollDelay(notCollected(accept()), '2026-07-30');
  assert.deepEqual(reminderList(adv, '2026-08-21'), [
    'before_due 2026-07-25 10:00 sent',
    'not_collected 2026-07-28 18:00 sent',
    'late 2026-08-04 10:00 paused',
    'late 2026-08-11 10:00 paused',
    'late 2026-08-18 10:00 paused',
    'before_default 2026-08-20 10:00 sent',
    'late 2026-08-25 10:00 paused',
  ]);
  const s = SA.getStatus(adv, '2026-08-02');
  assert.equal(s.reminders_paused, true);
  assert.equal(s.days_late, 5);
});

check('The pre-default notice is never paused, whenever the delay is reported', () => {
  const base = notCollected(accept());
  for (const reportedOn of ['2026-07-28', '2026-07-30', '2026-08-10', '2026-08-19']) {
    const adv = SA.reportPayrollDelay(base, reportedOn);
    for (const today of ['2026-08-19', '2026-08-20', '2026-08-26']) {
      if (today < reportedOn) continue;
      const notice = SA.getReminders(adv, today).filter((r) => r.type === 'before_default');
      assert.equal(notice.length, 1, `reported ${reportedOn}, viewed ${today}`);
      assert.notEqual(notice[0].status, 'paused', `reported ${reportedOn}, viewed ${today}`);
      assert.equal(notice[0].date, '2026-08-20');
    }
  }
});

check('No late reminders once repaid', () => {
  let adv = notCollected(accept());
  adv = SA.collectionOutcome(adv, {
    date: '2026-07-30', time: '11:00', salary_landed: true, salary_amount: 68000, balance: 69800,
  });
  assert.deepEqual(reminderList(adv, '2026-08-26'), [
    'before_due 2026-07-25 10:00 sent',
    'not_collected 2026-07-28 18:00 sent',
  ]);
});

// ---- Wallet ----

check('Wallet: real balance, and "includes" the advance only on the payout day', () => {
  assert.deepEqual(SA.getWallet(A, null, TODAY), { balance: 4250, includes_advance: null });
  assert.deepEqual(SA.getWallet(B, null, TODAY), { balance: 4250, includes_advance: null });
  assert.deepEqual(SA.getWallet(A, accept(), TODAY), { balance: 14250, includes_advance: 10000 });
  // Before the prototype's first day nothing is known: null, never a guess.
  assert.deepEqual(SA.getWallet(A, accept(), '2026-07-01'), { balance: null, includes_advance: null });
});

check('Wallet: later balances come from the activity rows (8,050 on 12 Jul, 1,800 on 25 Jul)', () => {
  assert.deepEqual(SA.getWallet(A, accept(), '2026-07-12'), { balance: 8050, includes_advance: null });
  assert.deepEqual(SA.getWallet(A, accept(), '2026-07-25'), { balance: 1800, includes_advance: null });
  const s10 = SA.scenario('S10');
  assert.equal(SA.getWallet(s10.persona, s10.advance, s10.today).balance, 1800);
});

const BALANCE_AT_6PM = { salary_not_arrived: 1800, salary_short: 9600, balance_dropped: 6500, salary_moved_to_bank: 1800 };

check('Wallet: on payday each cause has its 6pm balance, carried to 2 Aug and 20 Aug', () => {
  for (const reason of SA.NOT_COLLECTED_REASONS) {
    const { persona, advance } = SA.scenario('S11', { reason });
    for (const day of ['2026-07-28', '2026-08-02', '2026-08-20']) {
      assert.equal(SA.getWallet(persona, advance, day).balance, BALANCE_AT_6PM[reason], `${reason} on ${day}`);
    }
  }
});

// ---- Recent activity (sample rows) ----

const rows = (persona, advance, today) =>
  SA.getActivity(persona, advance, today).map((r) => `${r.date} ${r.title} ${r.direction} ${r.amount}`);

check('Activity on 7 Jul: newest first, at most 4, the advance first once accepted', () => {
  assert.deepEqual(rows(A, null, TODAY), [
    '2026-07-07 Sent to Ahmed K. out 1500',
    '2026-06-28 Salary credited in 68000',
    '2026-06-27 Paid for mobile top-up out 500',
  ]);
  assert.deepEqual(rows(A, accept(), TODAY), [
    '2026-07-07 Advance received in 10000',
    '2026-07-07 Sent to Ahmed K. out 1500',
    '2026-06-28 Salary credited in 68000',
    '2026-06-27 Paid for mobile top-up out 500',
  ]);
});

check('Activity: persona B never has a salary row (paid into a bank)', () => {
  assert.deepEqual(rows(B, null, TODAY), [
    '2026-07-07 Sent to Ahmed K. out 1500',
    '2026-06-27 Paid for mobile top-up out 500',
  ]);
});

check('Activity on 25 Jul: the July spending that explains 1,800', () => {
  assert.deepEqual(rows(A, accept(), '2026-07-25'), [
    '2026-07-21 Sent to Ahmed K. out 2500',
    '2026-07-15 Paid electricity bill out 3750',
    '2026-07-12 Paid for groceries out 6200',
    '2026-07-07 Advance received in 10000',
  ]);
});

check('Activity on payday: a salary row only for the salary that landed, the same rows on later days', () => {
  const at = (reason, day) => {
    const { persona, advance } = SA.scenario('S11', { reason });
    return rows(persona, advance, day);
  };
  for (const day of ['2026-07-28', '2026-08-02', '2026-08-20']) {
    for (const reason of ['salary_not_arrived', 'salary_moved_to_bank']) {
      assert.deepEqual(at(reason, day), [
        '2026-07-21 Sent to Ahmed K. out 2500',
        '2026-07-15 Paid electricity bill out 3750',
        '2026-07-12 Paid for groceries out 6200',
        '2026-07-07 Advance received in 10000',
      ], `${reason} on ${day}`);
    }
    assert.deepEqual(at('salary_short', day), [
      '2026-07-28 Salary credited in 9000',
      '2026-07-27 Paid for mobile top-up out 1200',
      '2026-07-21 Sent to Ahmed K. out 2500',
      '2026-07-15 Paid electricity bill out 3750',
    ], `salary_short on ${day}`);
    assert.deepEqual(at('balance_dropped', day), [
      '2026-07-28 Sent to Ahmed K. out 18300',
      '2026-07-28 Paid rent out 45000',
      '2026-07-28 Salary credited in 68000',
      '2026-07-21 Sent to Ahmed K. out 2500',
    ], `balance_dropped on ${day}`);
  }
});

check('Activity is money that moved: no row for the failed collection, no zero or missing amount', () => {
  for (const reason of SA.NOT_COLLECTED_REASONS) {
    const { persona, advance } = SA.scenario('S12', { reason });
    for (const r of SA.getActivity(persona, advance, '2026-08-20')) {
      assert.ok(Number.isInteger(r.amount) && r.amount > 0, `${reason}: ${r.title} ${r.amount}`);
      assert.ok(['in', 'out'].includes(r.direction), `${reason}: ${r.title} ${r.direction}`);
      assert.doesNotMatch(r.title, /repay|collect|not taken|late/i, `${reason}: ${r.title}`);
    }
  }
});

check('The advance card has what it needs: received, when, what to repay, by when', () => {
  const adv = accept();
  assert.equal(adv.disbursed_amount, 10000);
  assert.equal(adv.received_on, '2026-07-07');
  assert.equal(adv.total, 10300);
  assert.equal(adv.due_date, '2026-07-28');
  assert.equal(SA.formatDate(adv.received_on), '7 Jul');
});

check('One advance at a time: no new offer while one is open, and the offer comes back once repaid', () => {
  const open = accept();
  const o = SA.getOffer(A, TODAY, open);
  assert.equal(o.eligibility, 'has_advance');
  assert.equal(o.limit, null);
  assert.equal(o.tiers, null);
  assert.equal(SA.getTerms(A, 5000, TODAY, open), null);
  const repaid = notCollected(open, { salary_landed: true, salary_amount: 68000, balance: 70000 });
  assert.equal(SA.getOffer(A, '2026-07-29', repaid).eligibility, 'eligible');
  assert.equal(SA.getOffer(A, TODAY).eligibility, 'eligible'); // no advance given: unchanged
});

check('Day labels: "Today" for today, otherwise the date', () => {
  assert.equal(SA.formatDay('2026-07-07', TODAY), 'Today');
  assert.equal(SA.formatDay('2026-06-28', TODAY), '28 Jun');
  assert.equal(SA.formatDay(null, TODAY), null);
});

check('The receipt has what was agreed: collection time and source, and when the permission ends', () => {
  const adv = accept();
  assert.deepEqual(adv.collection, { date: '2026-07-28', time: '18:00', from: 'novapay_wallet' });
  assert.deepEqual(adv.permission, { amount: 10300, from_date: '2026-07-28', ends_by: '2026-08-27' });
  assert.equal(adv.accepted_on, '2026-07-07');
});

// ---- Formatting ----

check('Dates and times format for screens; missing stays missing', () => {
  assert.equal(SA.formatDate('2026-07-28'), '28 Jul');
  assert.equal(SA.formatDate('2026-08-27'), '27 Aug');
  assert.equal(SA.formatTime('18:00'), '6pm');
  assert.equal(SA.formatTime('10:00'), '10am');
  assert.equal(SA.formatTime('12:30'), '12:30pm');
  assert.equal(SA.formatDate(null), null);
  assert.equal(SA.formatTime(null), null);
});

// ---- Scenarios ----

check('Every reviewer scenario builds, on the right date', () => {
  for (const id of SA.SCENARIO_IDS) SA.scenario(id);
  for (const reason of SA.NOT_COLLECTED_REASONS) {
    const s = SA.scenario('S11', { reason });
    assert.equal(SA.getStatus(s.advance, s.today).last_attempt.reason, reason);
  }
  assert.equal(SA.scenario('S2').persona.id, 'B');
  assert.equal(SA.scenario('S7').terms.disbursed_amount, 5000);
  assert.equal(SA.getStatus(SA.scenario('S12').advance, SA.scenario('S12').today).days_late, 5);
  assert.equal(SA.getStatus(SA.scenario('S13').advance, SA.scenario('S13').today).days_until_default, 7);
  assert.equal(SA.scenario('S8').advance, SA.scenario('S9').advance);
});

check('Reviewer dates: 7 Jul, then S10–S13 on their own dates', () => {
  assert.deepEqual(SA.REVIEW_DATES, [
    { scenario: 'S1', date: '2026-07-07' },
    { scenario: 'S10', date: '2026-07-25' },
    { scenario: 'S11', date: '2026-07-28' },
    { scenario: 'S12', date: '2026-08-02' },
    { scenario: 'S13', date: '2026-08-20' },
  ]);
});

check('Reviewer options: a cause from payday, a payroll delay from 2 Aug when salary didn\'t arrive', () => {
  const opts = (id, reason = 'salary_not_arrived') => SA.scenarioOptions(id, { reason });
  assert.deepEqual(opts('S1'), { reason: false, payroll_delay: false });
  assert.deepEqual(opts('S10'), { reason: false, payroll_delay: false });
  assert.deepEqual(opts('S11'), { reason: true, payroll_delay: false });
  assert.deepEqual(opts('S12'), { reason: true, payroll_delay: true });
  assert.deepEqual(opts('S13'), { reason: true, payroll_delay: true });
  for (const reason of ['salary_short', 'balance_dropped', 'salary_moved_to_bank']) {
    assert.deepEqual(opts('S12', reason), { reason: true, payroll_delay: false }, reason);
  }
  assert.equal(SA.PAYROLL_DELAY_REPORTED_ON, '2026-08-02');
});

check('Scenario with a payroll delay: reported on 2 Aug, reminders paused, the 20 Aug notice still sent', () => {
  const s12 = SA.scenario('S12', { payroll_delay: true });
  assert.equal(s12.advance.payroll_delay_reported_on, '2026-08-02');
  const status = SA.getStatus(s12.advance, s12.today);
  assert.equal(status.reminders_paused, true);
  assert.equal(status.days_late, 5);
  assert.equal(SA.getReminders(s12.advance, s12.today).find((r) => r.date === '2026-08-04').status, 'paused');
  const s13 = SA.scenario('S13', { payroll_delay: true });
  assert.equal(SA.getReminders(s13.advance, s13.today).find((r) => r.type === 'before_default').status, 'sent');
  assert.equal(SA.getStatus(SA.scenario('S12').advance, '2026-08-02').reminders_paused, false);
});

check('Scenario ignores a payroll delay where it doesn\'t apply', () => {
  assert.equal(SA.scenario('S11', { payroll_delay: true }).advance.payroll_delay_reported_on, null);
  assert.equal(SA.scenario('S12', { reason: 'salary_short', payroll_delay: true }).advance.payroll_delay_reported_on, null);
  assert.equal(SA.scenario('S10', { payroll_delay: true }).advance.payroll_delay_reported_on, null);
});

if (failures.length) {
  console.error(`advance check failed: ${failures.length} of ${passed + failures.length}\n`);
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`advance check passed: ${passed} checks on src/advance/salaryAdvance.js`);
