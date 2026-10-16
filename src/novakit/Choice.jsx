import { useId } from "react";

/**
 * Choice — NovaKit Lite
 * One component for a checkbox or a radio: a native <input> inside a <label>.
 * Types: checkbox | radio
 * States: unchecked, checked, focus-visible, disabled (with a visible reason)
 *
 * - Controlled only. It never defaults to checked: pass `checked` and `onChange`.
 * - The whole row is the tap target, at least 44px tall.
 * - The accessible name is the label only. The description and the disabled reason
 *   are read as descriptions (aria-describedby), so they're heard but not repeated.
 * - Disabled uses aria-disabled, not the native attribute, so the option stays
 *   focusable and its reason is heard. It can't be checked: a tap is cancelled and
 *   onChange is never called. A caller's onClick still runs, so a screen can say why.
 *   The control is dimmed; the label and reason stay readable in neutral-700.
 * - Any other props (aria-*, required, form, onClick…) go to the <input>.
 *
 * Radio groups: the caller wraps the options in a <fieldset> with a <legend>
 * that names the choice, and gives every option the same `name`. For example:
 *
 *   <fieldset>
 *     <legend>How much do you need?</legend>
 *     <Choice type="radio" name="amount" value="5000" checked={…} onChange={…} label="Rs 5,000" />
 *     <Choice type="radio" name="amount" value="10000" checked={…} onChange={…} label="Rs 10,000" />
 *   </fieldset>
 */
export default function Choice({
  type = "checkbox",
  name,
  value,
  checked = false,
  onChange,
  label,
  description = null,
  disabled = false,
  disabledReason = null,
  id,
  onClick,
  ...rest
}) {
  const autoId = useId();
  const inputId = id ?? `choice-${autoId}`;
  const labelId = `${inputId}-label`;
  const descriptionId = description ? `${inputId}-description` : null;
  const reasonId = disabled && disabledReason ? `${inputId}-reason` : null;
  const describedBy =
    [rest["aria-describedby"], descriptionId, reasonId].filter(Boolean).join(" ") || undefined;

  function handleClick(event) {
    if (disabled) event.preventDefault(); // cancels the check, by tap, click or Space
    onClick?.(event);
  }

  return (
    <label
      htmlFor={inputId}
      className={
        "flex items-start gap-3 min-h-11 py-2.5 " +
        (disabled ? "cursor-not-allowed" : "cursor-pointer")
      }
    >
      <input
        {...rest}
        id={inputId}
        type={type}
        name={name}
        value={value}
        checked={disabled ? false : checked === true}
        // Disabled: a no-op, so a change by arrow key is undone by React's controlled value.
        onChange={disabled ? () => {} : onChange}
        onClick={handleClick}
        aria-disabled={disabled || undefined}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        className={
          // Dimmed when disabled, but full strength while focused, so the ring isn't dimmed too.
          "h-6 w-6 shrink-0 accent-brand aria-disabled:opacity-50 aria-disabled:focus-visible:opacity-100 aria-disabled:cursor-not-allowed " +
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 " +
          (type === "radio" ? "rounded-full" : "")
        }
      />
      <span className="min-w-0 flex-1 pt-px">
        <span id={labelId} className={`block text-body ${disabled ? "text-neutral-700" : "text-neutral-900"}`}>
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className="block text-caption text-neutral-700 mt-0.5">
            {description}
          </span>
        ) : null}
        {reasonId ? (
          <span id={reasonId} className="block text-caption text-neutral-700 mt-0.5">
            {disabledReason}
          </span>
        ) : null}
      </span>
    </label>
  );
}
