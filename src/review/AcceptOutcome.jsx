import { Card, Choice } from "../novakit";

// What happens after "Accept" is tapped. The prototype has no backend, so the reviewer picks.
export const ACCEPT_OUTCOMES = [
  { id: "works", label: "Works", description: "Goes to the receipt." },
  { id: "network", label: "Network failure", description: "The first attempt fails; Try again works." },
  {
    id: "reduced",
    label: "Lower amount",
    description: "From Rs 10,000 only: we can offer Rs 5,000 instead (S7). Rs 5,000 has no lower tier, so it works.",
  },
];

/**
 * Reviewer scaffolding, shown beside the phone frame, never inside it. Not part of the
 * product, so it may start with a selection. "Network failure" fails the first attempt of
 * each run (it resets when the flow goes back home).
 */
export default function AcceptOutcome({ value, onChange }) {
  return (
    <Card className="w-64 shrink-0">
      <fieldset>
        <legend className="text-body font-semibold text-neutral-900">Reviewer: after Accept</legend>
        <div className="mt-1">
          {ACCEPT_OUTCOMES.map((o) => (
            <Choice
              key={o.id}
              type="radio"
              name="accept-outcome"
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              label={o.label}
              description={o.description}
            />
          ))}
        </div>
      </fieldset>
    </Card>
  );
}
