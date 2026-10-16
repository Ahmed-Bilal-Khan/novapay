import SegmentedControl from "./SegmentedControl";

// What happens after "Accept" is tapped. The prototype has no backend, so the reviewer picks.
export const ACCEPT_OUTCOMES = [
  { id: "works", label: "Works", description: "Goes to the receipt." },
  { id: "network", label: "Fails once", description: "Network failure: the first attempt fails; Try again works." },
  {
    id: "reduced",
    label: "Lower amount",
    description: "From Rs 10,000 only: we can offer Rs 5,000 instead (S7). Rs 5,000 has no lower tier, so it works.",
  },
];

/**
 * Reviewer scaffolding: the "After Accept" section of the reviewer panel (ReviewerState).
 * Not part of the product, so it may start with a selection. "Fails once" fails the first
 * attempt of each run (it resets when the flow goes back home). Shown only where Accept
 * can be reached: 7 Jul, persona A.
 */
export default function AcceptOutcome({ value, onChange }) {
  return (
    <SegmentedControl
      legend="After Accept"
      name="accept-outcome"
      options={ACCEPT_OUTCOMES}
      value={value}
      onChange={onChange}
    />
  );
}
