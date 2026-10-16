/**
 * ListRow / TransactionRow — NovaKit Lite
 * leading icon · title + subtitle · trailing amount
 *
 * - wrap (default false): title and subtitle wrap instead of truncating. Use it
 *   wherever cutting the text would hide a term, a date or an amount.
 * - The icon is decorative and hidden from screen readers. Put any meaning it
 *   carries ("Received", "Collected") in the title or subtitle.
 * - Any other props go to the row's <div>.
 * - Known gap, flagged not fixed: rows are <div>s, not list or description-list items.
 */
export default function ListRow({
  icon = null,
  title,
  subtitle,
  trailing = null,
  wrap = false,
  className = "",
  ...rest
}) {
  const text = wrap ? "" : "truncate";
  return (
    <div
      {...rest}
      className={
        "flex items-center gap-3 py-3 border-b border-neutral-300 last:border-b-0 " +
        className
      }
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0"
        >
          {icon}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className={`text-body text-neutral-900 ${text}`}>{title}</div>
        {subtitle ? (
          <div className={`text-caption text-neutral-500 ${text}`}>{subtitle}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
