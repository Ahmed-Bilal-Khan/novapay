/**
 * Button — NovaKit Lite
 * Variants: primary | secondary
 * Sizes: md | lg (minimum heights, so a second line fits)
 * States: default, pressed (active), focus-visible, disabled, loading
 *
 * - subLabel: an optional second line, e.g. "Repay Rs 10,300 on 28 Jul".
 * - loading: the button is disabled and aria-busy. loadingLabel, if given, replaces
 *   the label; the original label stays in place invisibly, so the size never changes.
 * - Any other props (aria-*, id, form…) go to the <button>.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  loadingLabel = null,
  subLabel = null,
  onClick,
  type = "button",
  className = "",
  ...rest
}) {
  const base =
    "inline-flex flex-col items-center justify-center text-center rounded-md font-semibold transition-colors select-none w-full py-2 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

  const sizes = {
    md: "min-h-11 px-4 text-body",
    lg: "min-h-14 px-5 text-title",
  };

  // While loading, the button keeps its own colours: it's working, not unavailable.
  const variants = {
    primary: {
      enabled: "bg-brand text-white active:bg-brand-pressed",
      disabled: "bg-neutral-300 text-neutral-500",
      loading: "bg-brand text-white cursor-progress",
      subLabel: "text-brand-100",
    },
    secondary: {
      enabled: "bg-white text-neutral-900 border border-neutral-300 active:bg-neutral-100",
      disabled: "bg-white text-neutral-300 border border-neutral-300",
      loading: "bg-white text-neutral-900 border border-neutral-300 cursor-progress",
      subLabel: "text-neutral-700",
    },
  };
  const v = variants[variant];
  const state = loading ? "loading" : disabled ? "disabled" : "enabled";
  const showLoadingLabel = loading && loadingLabel != null;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${v[state]} ${className}`}
    >
      <span className="grid">
        <span className={`col-start-1 row-start-1 ${showLoadingLabel ? "invisible" : ""}`}>{children}</span>
        {showLoadingLabel ? <span className="col-start-1 row-start-1">{loadingLabel}</span> : null}
      </span>
      {subLabel ? (
        <span className={`text-caption ${state === "disabled" ? "" : v.subLabel}`}>{subLabel}</span>
      ) : null}
    </button>
  );
}
