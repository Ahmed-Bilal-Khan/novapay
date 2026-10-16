/**
 * DateSteps — reviewer scaffolding, not NovaKit (never exported from ./novakit).
 * A radio group drawn as a vertical timeline, so the dates read as one sequence:
 * a native radio per step (24px, brand), joined by a neutral-300 line. Each step is one
 * 44px row, wholly tappable: the date leads, the state's short name trails, so names
 * line up in a column. The accessible name is the whole row ("2 Aug Late (S12)").
 *
 * steps: [{ id, date, name }], with `date` already formatted by the module.
 */
export default function DateSteps({ legend, name, steps, value, onChange }) {
  return (
    <fieldset>
      <legend className="text-caption font-semibold text-neutral-700">{legend}</legend>
      <ol className="mt-1">
        {steps.map((step, i) => (
          <li key={step.id} className="relative">
            {/* The line runs from under this step's radio to the next one's. */}
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="absolute start-3 top-9 -bottom-2 w-px bg-neutral-300" />
            ) : null}
            <label className="relative flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="radio"
                name={name}
                value={step.id}
                checked={value === step.id}
                onChange={() => onChange(step.id)}
                className="h-6 w-6 shrink-0 rounded-full accent-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              />
              <span className={`text-body text-neutral-900 ${value === step.id ? "font-semibold" : ""}`}>{step.date}</span>
              <span className="ms-auto text-end text-caption text-neutral-700">{step.name}</span>
            </label>
          </li>
        ))}
      </ol>
    </fieldset>
  );
}
