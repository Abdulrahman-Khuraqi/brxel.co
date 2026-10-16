/**
 * The tag every option on the brand pages carries, so any one of them can be named in a request
 * ("remove 34"). Numbers are fixed and unique across the page: removing an option leaves a gap,
 * the others keep theirs.
 */
export default function OptionNumber({ no, className = "" }) {
  return (
    <span
      dir="ltr"
      className={`latin inline-flex min-w-7 items-center justify-center rounded-md bg-[#E85A24] px-1.5 text-xs font-bold leading-6 text-[#150C09] ring-2 ring-[#150C09] ${className}`}
    >
      {no}
    </span>
  );
}
