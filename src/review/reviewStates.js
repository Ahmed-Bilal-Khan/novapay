import { formatDate, scenario } from "../advance/salaryAdvance";

/**
 * The reviewer's index of states: reviewer text and setup only. Every date comes from the
 * module's scenario(); every amount the phone shows comes from the module through App.
 *
 * Each state says how App sets it up:
 * - data: the module scenario the phone's data comes from. "S1" is the live flow on 7 Jul
 *   (persona A), where the advance is whatever the reviewer accepted.
 * - screen: where the phone opens.
 * - source: the module scenario to take the terms (S4) or the accepted advance (S8, S9) from.
 * - outcome: what happens after Accept ("works" unless set).
 * - payroll_delay: whether "My salary is late" has been reported.
 */
const STATES = {
  S1: {
    code: "S1",
    label: "Offer",
    note: "What it is and what it costs, before the first tap · offer",
    data: "S1",
    screen: "home",
  },
  S2: {
    code: "S2",
    label: "Needs verification",
    note: "Verification is a step before applying, never a decline after · P2",
    data: "S2",
    screen: "home",
  },
  S3: {
    code: "S3",
    label: "Choose an amount",
    note: "Tiers in order, none pre-selected; the one over the limit says why · P3",
    data: "S1",
    screen: "chooseAmount",
  },
  S4: {
    code: "S4",
    label: "Review and accept",
    note: "Received, fee, total and due date without scrolling; the permission is its own box · P1",
    data: "S1",
    screen: "terms",
    source: "S4",
  },
  // S6 and S7 open S4 with the outcome set: one tap on Accept shows S5, then the state.
  S6: { code: "S6", data: "S1", screen: "terms", source: "S4", outcome: "network" },
  S7: { code: "S7", data: "S1", screen: "terms", source: "S4", outcome: "reduced" },
  S8: {
    code: "S8",
    label: "Receipt",
    note: "The amount received comes first; the repayment is one line · P1",
    data: "S1",
    screen: "receipt",
    source: "S8",
  },
  S9: {
    code: "S9",
    label: "Home after accepting",
    note: "The balance says what came from the advance; the advance has its own card · P5",
    data: "S1",
    screen: "home",
    source: "S9",
  },
  S10: {
    code: "S10",
    label: "Reminder",
    note: "What's taken, when and from where, and that nothing's needed · P5",
    data: "S10",
    screen: "home",
  },
  S11: {
    code: "S11",
    label: "Not collected",
    note: "Red only on the failed collection; the amount hasn't changed; nothing to do · P4",
    data: "S11",
    screen: "home",
  },
  S12: {
    code: "S12",
    label: "Late",
    note: "Days late in amber, no fee added, and a next step that works · P4",
    data: "S12",
    screen: "home",
  },
  "S12-delay": {
    code: "S12",
    label: "Late, delay reported",
    note: 'After "My salary is late": reminders paused, the notice before default isn\'t · P4',
    data: "S12",
    screen: "home",
    payroll_delay: true,
  },
};

// Each state's date, from the module (the scenario its data comes from).
export const REVIEW_STATES = Object.fromEntries(
  Object.entries(STATES).map(([id, s]) => [id, { ...s, id, date: formatDate(scenario(s.data).today) }])
);

// What happens after "Accept" is tapped. The prototype has no backend, so the reviewer picks.
// Each choice opens S4, ready to accept. "Fails once" fails the first attempt of each run.
export const ACCEPT_OUTCOMES = [
  { id: "works", state: "S4", label: "Works", description: "Processing (S5), then the receipt (S8)." },
  {
    id: "network",
    state: "S6",
    label: "Fails once",
    description: "Processing (S5), then a network failure (S6). Try again works.",
  },
  { id: "reduced", state: "S7", label: "Lower amount", description: "Processing (S5), then a lower amount offered instead (S7)." },
];

// The S5–S7 entry: one row in the index whose After Accept choices are the jumps.
export const AFTER_ACCEPT = {
  id: "S5-S7",
  code: "S5–S7",
  label: "After Accept",
  note: "Processing; a failure that says nothing was charged; a lower amount asked for again · P1",
  date: REVIEW_STATES.S4.date,
  states: ["S4", "S6", "S7"],
};

// The index, in the order a reviewer should see it. Graded moments are marked in the heading.
export const REVIEW_GROUPS = [
  { id: "before", heading: "Before accepting", entries: ["S1", "S2", "S3"] },
  { id: "accept", heading: "Graded: terms and accept", graded: true, entries: ["S4", AFTER_ACCEPT.id, "S8"] },
  { id: "after", heading: "After accepting", entries: ["S9", "S10"] },
  { id: "bad-news", heading: "Graded: bad news", graded: true, entries: ["S11", "S12", "S12-delay"] },
];

export const START_STATE = "S1";

/**
 * Which state the phone is showing, so the index can mark it as the reviewer taps through
 * the flow. Reads the reviewer's data, the screen and the outcome; no money or dates.
 */
export function currentReviewState({ data, payroll_delay, screen, hasAdvance, outcome }) {
  if (data === "S12") return payroll_delay ? "S12-delay" : "S12";
  if (data !== "S1") return data; // S2, S10, S11
  if (screen === "chooseAmount") return "S3";
  if (screen === "terms") return ACCEPT_OUTCOMES.find((o) => o.id === outcome).state;
  if (screen === "reduced") return "S7";
  if (screen === "receipt") return "S8";
  return hasAdvance ? "S9" : "S1"; // home, the advance's details and the pay placeholder
}
