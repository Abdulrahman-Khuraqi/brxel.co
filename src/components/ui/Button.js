import Link from "next/link";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 motion-reduce:transition-none sm:text-base";

const VARIANTS = {
  primary: "brand-gradient text-[#150C09] shadow-[0_10px_30px_-12px_rgb(242_161_44/0.6)] hover:brightness-110",
  secondary: "border border-hairline-strong bg-surface text-ice hover:border-brand hover:bg-surface-hover hover:text-brand-bright",
  ghost: "text-ice-muted hover:bg-surface hover:text-ice",
};

/**
 * One button surface for the whole site.
 *
 * Renders a next/link for internal routes, a plain anchor for external ones
 * (which need target/rel), and a real <button> when no href is given.
 */
export default function Button({
  href,
  external = false,
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
