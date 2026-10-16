import { useId } from "react";

/**
 * SegmentedControl — reviewer scaffolding, not NovaKit (never exported from ./novakit).
 * A radio group drawn as segments: native radios (visually hidden, still focusable), so
 * the legend, arrow keys and focus behave like any radio group. Every option is a 44px
 * target. Only the chosen option's description is shown, under the segments, and each
 * radio is described by it.
 *
 * options: [{ id, label, description? }]. `value` is the chosen id, or null for none
 * (the reviewer index uses none when the phone isn't on the state the choices open).
 * Labels may wrap onto two lines inside their segment.
 */
export default function SegmentedControl({ legend, name, options, value, onChange }) {
  const descriptionId = useId();
  const chosen = options.find((o) => o.id === value);

  return (
    <fieldset>
      <legend className="text-caption font-semibold text-neutral-700">{legend}</legend>
      <div className="mt-2 flex gap-1 rounded-md bg-neutral-200 p-1">
        {options.map((o) => (
          <label key={o.id} className="flex-1 min-w-0 cursor-pointer">
            <input
              type="radio"
              className="peer sr-only"
              name={name}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              aria-describedby={chosen?.description ? descriptionId : undefined}
            />
            <span
              className={
                "flex min-h-11 items-center justify-center rounded-sm px-2 text-center text-caption text-neutral-700 " +
                "peer-checked:bg-white peer-checked:font-semibold peer-checked:text-neutral-900 peer-checked:shadow-card " +
                "peer-focus-visible:ring-2 peer-focus-visible:ring-brand"
              }
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {chosen?.description ? (
        <p id={descriptionId} className="mt-2 text-caption text-neutral-700">
          {chosen.description}
        </p>
      ) : null}
    </fieldset>
  );
}
