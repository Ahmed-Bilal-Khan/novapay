/**
 * Card — NovaKit Lite
 * A surface container for grouping content.
 * Tones: default | attention | danger
 *
 * - attention is for a person's status (late, notice before default).
 * - danger is only for a failed event ("We couldn't collect on 28 Jul", a network
 *   failure), never for a person's status.
 * - Both are a soft background with inherited dark text (neutral-900). No icons,
 *   no solid fills. Every tone's border is as faint as the default card's edge.
 * - Card adds no role by itself. A screen that shows a failure passes
 *   role="alert" (or aria-live), which goes to the <div> with any other props.
 */
export default function Card({ children, tone = "default", className = "", ...rest }) {
  const tones = {
    default: "bg-white border-neutral-200",
    attention: "bg-attention-50 border-attention-100",
    danger: "bg-danger-50 border-neutral-200",
  };
  return (
    <div
      {...rest}
      className={`rounded-lg border shadow-card p-4 ${tones[tone] || tones.default} ${className}`}
    >
      {children}
    </div>
  );
}
