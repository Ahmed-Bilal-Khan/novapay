import { useEffect, useId, useRef } from "react";
import Button from "./Button.jsx";

/**
 * BottomSheet — NovaKit Lite
 * A modal sheet anchored to the bottom of its container (the phone frame).
 *
 * - A dialog: role="dialog", aria-modal, named by its `title`.
 * - On open, focus moves to the title, so a screen reader reads where it is. Everything
 *   else in its container is `inert` while it's open, and Tab stays inside the sheet.
 *   Escape, the Close button or a tap on the backdrop closes it, and focus returns to
 *   whatever opened it.
 * - Render it as a direct child of the container it should cover (the phone frame's
 *   `sheet` slot), so the inert siblings are exactly what sits behind it.
 * - Always has a visible Close button. No grab handle: swiping isn't supported.
 * - Long content scrolls inside the sheet.
 */
export default function BottomSheet({ open, onClose, title, closeLabel = "Close", children }) {
  const titleId = useId();
  const sheetRef = useRef(null);
  const titleRef = useRef(null);
  // Held in a ref so a parent re-render doesn't re-run the open effect and move focus.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    // Everything else in the container (the frame's AppBar, content and actions) is
    // inert while the sheet is open: it can't be focused, tapped or read.
    const layer = sheetRef.current.parentElement;
    const behind = [...layer.parentElement.children].filter((el) => el !== layer && !el.hasAttribute("inert"));
    behind.forEach((el) => el.setAttribute("inert", ""));
    titleRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      // Keep Tab inside the sheet.
      const focusable = [...sheetRef.current.querySelectorAll("button, a[href], input, select, textarea, summary, [tabindex]")]
        .filter((el) => !el.disabled && el.tabIndex >= 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!sheetRef.current.contains(document.activeElement)) {
        // Focus fell off the sheet (for example, onto the page body): bring it back.
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      behind.forEach((el) => el.removeAttribute("inert")); // before focusing: inert can't take focus
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-full overflow-y-auto bg-white rounded-t-lg p-4 pb-6 space-y-4"
      >
        <h2 id={titleId} ref={titleRef} tabIndex={-1} className="text-title text-neutral-900 focus:outline-none">
          {title}
        </h2>
        {children}
        <Button variant="secondary" onClick={onClose}>
          {closeLabel}
        </Button>
      </div>
    </div>
  );
}
