import { useEffect, useRef } from "react";
import { Button } from "../novakit";
import SegmentedControl from "./SegmentedControl";
import { ACCEPT_OUTCOMES, AFTER_ACCEPT, REVIEW_GROUPS, REVIEW_STATES, START_STATE } from "./reviewStates";

/**
 * Reviewer controls: one panel beside the phone frame, never inside it, on a neutral-100
 * surface so it never passes for product UI. Not part of the product.
 *
 * The panel is an index of the states a reviewer should see, in order. Each entry opens its
 * state directly (App sets the date, persona and outcome it needs, all from the module's
 * scenario()). The state the phone is showing is marked, and follows taps inside the phone.
 * Graded moments sit on white, with "Graded" in their heading. S5–S7 is one entry whose
 * After Accept choices are the jumps. "Start again" opens S1 with nothing accepted.
 *
 * Entries are links (?state=S4), so a link can be copied from the panel. A plain click
 * opens the state here; a modified click is left to the browser.
 *
 * The panel fills its container's height (App makes it the phone's height): the title and
 * Start again stay put and the index scrolls between them, so a reviewer never scrolls the
 * page away from the phone. When the current state changes (a jump, or a tap in the phone),
 * its entry is scrolled into view inside the index, never the page.
 */
export default function ReviewerState({ current, outcome, onJump }) {
  const indexRef = useRef(null);

  useEffect(() => {
    const index = indexRef.current;
    const entry = index?.querySelector("[data-current]");
    if (!entry) return;
    // The index is `relative`, so offsets are measured from its top. Going up, the entry's
    // group heading comes into view too; either way, 16px (the index's padding) stays clear.
    const margin = 16;
    const top = entry.closest("[data-group]").offsetTop - margin;
    const bottom = entry.offsetTop + entry.offsetHeight + margin;
    if (top < index.scrollTop) index.scrollTop = top;
    else if (bottom > index.scrollTop + index.clientHeight) index.scrollTop = bottom - index.clientHeight;
  }, [current]);

  return (
    <div className="flex h-full w-80 flex-col rounded-lg border border-neutral-300 bg-neutral-100">
      <div className="shrink-0 border-b border-neutral-300 p-4">
        <h2 id="reviewer-controls-title" className="text-body font-semibold text-neutral-900">
          Reviewer controls
        </h2>
        <p className="text-caption text-neutral-700">
          Not part of the app. Choose a state to open it in the phone. Spend most time on the graded ones.
        </p>
      </div>

      {/* The index scrolls inside the panel. Groups are 16px apart; inside a group, 4px. */}
      <nav ref={indexRef} aria-label="States" className="review-scroll relative min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {REVIEW_GROUPS.map((group) => (
          <div
            key={group.id}
            data-group
            className={group.graded ? "rounded-md border border-neutral-300 bg-white p-2" : ""}
          >
            <h3 id={`review-group-${group.id}`} className="px-2 text-caption font-semibold text-neutral-700">
              {group.heading}
            </h3>
            <ul aria-labelledby={`review-group-${group.id}`} className="mt-1 space-y-1">
              {group.entries.map((id) =>
                id === AFTER_ACCEPT.id ? (
                  <AfterAcceptEntry key={id} current={current} outcome={outcome} onJump={onJump} />
                ) : (
                  <StateLink key={id} state={REVIEW_STATES[id]} current={current} graded={group.graded} onJump={onJump} />
                )
              )}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-neutral-300 p-4">
        <Button variant="secondary" onClick={() => onJump(START_STATE)}>
          Start again
        </Button>
      </div>
    </div>
  );
}

// The code, name and date, with the note underneath. Named by the first line and described
// by the note, so a screen reader hears "S4 Review and accept, 7 Jul" first.
function EntryText({ entry, isCurrent, noteId }) {
  return (
    <>
      <span className="flex items-baseline justify-between gap-2">
        <span className={`text-body text-neutral-900 ${isCurrent ? "font-semibold" : ""}`}>
          {entry.code} {entry.label}
        </span>
        <span className="shrink-0 text-caption text-neutral-700">{entry.date}</span>
      </span>
      <span id={noteId} className="block text-caption text-neutral-700">
        {entry.note}
      </span>
    </>
  );
}

function StateLink({ state, current, graded, onJump }) {
  const isCurrent = current === state.id;
  const noteId = `review-note-${state.id}`;

  function handleClick(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // new tab, copy link
    e.preventDefault();
    onJump(state.id);
  }

  return (
    <li data-current={isCurrent || undefined}>
      <a
        href={`?state=${state.id}`}
        onClick={handleClick}
        aria-current={isCurrent ? "true" : undefined}
        aria-label={`${state.code} ${state.label}, ${state.date}`}
        aria-describedby={noteId}
        className={
          "block min-h-11 rounded-sm px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand " +
          (isCurrent ? "bg-brand-50" : graded ? "hover:bg-neutral-100" : "hover:bg-neutral-200")
        }
      >
        <EntryText entry={state} isCurrent={isCurrent} noteId={noteId} />
      </a>
    </li>
  );
}

// S5–S7: the outcomes are the jumps, each opening S4 ready to accept. A choice shows as
// chosen only while the phone is on S4 (or S6, S7), so elsewhere every choice opens it.
function AfterAcceptEntry({ current, outcome, onJump }) {
  const onAccept = AFTER_ACCEPT.states.includes(current);
  const isCurrent = onAccept && current !== "S4";

  return (
    <li data-current={isCurrent || undefined} aria-current={isCurrent ? "true" : undefined} className={`rounded-sm px-2 py-1.5 ${isCurrent ? "bg-brand-50" : ""}`}>
      <EntryText entry={AFTER_ACCEPT} isCurrent={isCurrent} noteId="review-note-after-accept" />
      <div className="mt-2">
        <SegmentedControl
          legend="Choose what happens after Accept"
          name="accept-outcome"
          options={ACCEPT_OUTCOMES}
          value={onAccept ? outcome : null}
          onChange={(id) => onJump(ACCEPT_OUTCOMES.find((o) => o.id === id).state)}
        />
      </div>
    </li>
  );
}
