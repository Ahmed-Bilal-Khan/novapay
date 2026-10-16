/**
 * AppBar — NovaKit Lite
 * title + optional back affordance
 *
 * - backLabel names where back goes ("Back to home"). It defaults to "Back".
 * - The title is the screen's <h1>. It takes programmatic focus (tabIndex -1), so a
 *   screen change can move focus to it, but it isn't in the Tab order.
 */
export default function AppBar({ title, onBack = null, backLabel = "Back" }) {
  return (
    <header className="h-14 flex items-center gap-2 px-3 border-b border-neutral-100 bg-white">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label={backLabel}
          className="h-11 w-11 -ml-1 flex items-center justify-center rounded-full text-neutral-700 active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-display">‹</span>
        </button>
      ) : null}
      <h1 tabIndex={-1} className="text-title text-neutral-900 focus:outline-none">
        {title}
      </h1>
    </header>
  );
}
