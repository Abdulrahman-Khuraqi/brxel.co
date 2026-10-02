import BrxelLogo from "@/components/brand/BrxelLogo";

/** The site-wide wordmark: currently the BRXEL mark (ARTXEL paths live in brand-logo/artxel). */
export default function Logo(props) {
  return <BrxelLogo {...props} />;
}

/**
 * The brand's graphic accent: the rising stroke of the ARTXEL X, a 66° slash.
 * Inherits `color`. (`variant` is kept for older call sites; both render the slash.)
 */
export function Spark({ className = "h-4 w-4", variant = "full" }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true" focusable="false">
      <path d="M36 256 L150 0 L220 0 L106 256 Z" fill="currentColor" />
    </svg>
  );
}
