/**
 * Toast — NovaKit Lite
 * A transient message.
 * Variants: success (default) | neutral
 *
 * - success confirms something that worked, with a ✓.
 * - neutral explains something that didn't happen and isn't a failure (for example,
 *   tapping an option that isn't available). No icon, no colour meaning.
 * - Failures never use a Toast: they're an inline Card with role="alert".
 * - Known gap, flagged not fixed: no aria-live. Put anything a screen-reader user
 *   needs somewhere they'll hear it (a description, a status region).
 */
export default function Toast({ open, message, variant = "success" }) {
  if (!open) return null;
  const variants = {
    success: "bg-success text-white",
    neutral: "bg-neutral-900 text-white",
  };
  return (
    <div className="absolute left-4 right-4 bottom-6 z-30">
      <div
        className={`flex items-center gap-2 rounded-md px-4 py-3 text-body shadow-card ${variants[variant] || variants.success}`}
      >
        {variant === "success" ? <span aria-hidden="true">✓</span> : null}
        <span>{message}</span>
      </div>
    </div>
  );
}
