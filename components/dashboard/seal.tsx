// The issuer's seal, drawn once and set wherever a certificate is shown: on
// the certificates' sheets, and on a finished leg of the path.
import { cn } from "@/lib/utils";

// The seal's edge: twenty scallops round a disc, drawn once.
const SCALLOPS = (() => {
  const steps = 240;
  const d = Array.from({ length: steps }, (_, i) => {
    const t = (i / steps) * Math.PI * 2;
    const r = 46 + 3 * Math.cos(20 * t);
    return `${i ? "L" : "M"}${(50 + r * Math.cos(t)).toFixed(2)} ${(50 + r * Math.sin(t)).toFixed(2)}`;
  });
  return `${d.join("")}Z`;
})();

/** The issuer's seal: a scalloped disc in deep iris, a hairline ring inside
 *  it, and the tick at its heart. */
export function Seal({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className={cn("shrink-0 text-card", className)}>
      <path d={SCALLOPS} className="fill-[color-mix(in_oklab,var(--iris),var(--iris-ink))]" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75" />
      <path
        d="M38 50.5l7.5 7.5l16-16.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
