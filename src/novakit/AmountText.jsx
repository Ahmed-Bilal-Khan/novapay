/**
 * AmountText — NovaKit Lite
 * Formats a PKR amount, e.g. 10300 -> "Rs 10,300".
 * Sizes: display | title | body | caption
 *
 * - formatAmount is the single money formatter. Use it wherever money goes into a
 *   string (a button's second line, an aria-label). It returns null when the amount
 *   is missing, never "Rs 0".
 * - A missing amount renders nothing. The screen decides what to say instead.
 * - The colour is inherited from the parent.
 * - No rounding here: the salary-advance module guarantees whole rupees.
 */

const NBSP = " "; // keeps "Rs" and the number on one line
const MINUS = "−"; // a real minus sign, not a hyphen

const isDev = () => Boolean(import.meta.env?.DEV);

/**
 * formatAmount(10300)                 -> "Rs 10,300"
 * formatAmount(10000, { sign: "+" })  -> "+Rs 10,000"  (money in)
 * formatAmount(10300, { sign: "-" })  -> "−Rs 10,300"  (money out, real minus)
 * formatAmount(null)                  -> null
 */
export function formatAmount(amount, { sign = null } = {}) {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  if (isDev() && !Number.isInteger(amount)) {
    console.warn(`formatAmount: ${amount} is not whole rupees. Amounts should come from the salary-advance module.`);
  }
  const out = amount < 0 || sign === "-" || sign === MINUS;
  if (isDev() && amount < 0 && sign === "+") {
    console.warn(`formatAmount: ${amount} is negative but was given sign "+". Showing it as money out.`);
  }
  const prefix = out ? MINUS : sign === "+" ? "+" : "";
  const digits = new Intl.NumberFormat("en-PK").format(Math.abs(amount));
  return `${prefix}Rs${NBSP}${digits}`;
}

export default function AmountText({ amount, size = "title", sign = null, className = "" }) {
  const sizes = {
    display: "text-display",
    title: "text-title",
    body: "text-body",
    caption: "text-caption",
  };
  const formatted = formatAmount(amount, { sign });
  if (formatted == null) {
    if (isDev()) console.warn("AmountText: the amount is missing, so nothing is shown. The screen should say why.");
    return null;
  }
  return (
    <span className={`${sizes[size] || sizes.title} tabular-nums ${className}`}>
      {formatted}
    </span>
  );
}
