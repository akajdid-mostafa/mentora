import { cn } from "@/lib/utils";

const tint = "fill-[color-mix(in_oklab,var(--primary)_62%,var(--background))]";

const drawings = {
  // a question and the reply coming back: two bubbles, the tutor's typing
  ask: (
    <>
      <circle cx="37" cy="35" r="14" className={tint} />
      <path d="M20 6a16 16 0 1 1-12.4 26.1L4 40l1.2-10.2A16 16 0 0 1 20 6Z" className="fill-iris" />
      <circle cx="13.5" cy="22" r="2.5" className="fill-foreground" />
      <circle cx="20.5" cy="22" r="2.5" className="fill-foreground" />
      <circle cx="27.5" cy="22" r="2.5" className="fill-foreground" />
    </>
  ),
  // a goal at the top of the climb: the ground, the peak, and the point
  goal: (
    <>
      <path d="M4 52V26a26 26 0 0 1 26 26Z" className={tint} />
      <path d="M14 52 32 16l18 36Z" className="fill-foreground" />
      <circle cx="32" cy="8" r="5" className="fill-iris" />
    </>
  ),
  // a course drafted: the page, its outline, and the studio's mark on it
  teach: (
    <>
      <rect x="6" y="4" width="30" height="40" rx="6" className={tint} />
      <rect x="12" y="13" width="18" height="4" rx="2" className="fill-foreground" />
      <rect x="12" y="22" width="12" height="4" rx="2" className="fill-foreground" />
      <rect x="12" y="31" width="15" height="4" rx="2" className="fill-foreground" />
      <circle cx="41" cy="41" r="11" className="fill-iris" />
    </>
  ),
  // a reply that is itself a question: the bubble, the hook, and the tutor's
  // dot under it
  question: (
    <>
      <path d="M31 4a21 21 0 1 1-15.6 35L6 44l3.4-11.4A21 21 0 0 1 31 4Z" className={tint} />
      <path
        d="M24.5 19.5a6.5 6.5 0 1 1 9.3 5.9c-1.8.9-2.8 2.2-2.8 4.1v1.2"
        className="fill-none stroke-foreground"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="31" cy="39.5" r="3.4" className="fill-iris" />
    </>
  ),
  // the minute it answers from: the lesson's frame, its play mark, and the
  // playhead stopped on the minute along the bar under it
  cite: (
    <>
      <rect x="4" y="4" width="48" height="32" rx="8" className={tint} />
      <path d="M23 12.5 35 20l-12 7.5Z" className="fill-foreground" />
      <rect x="4" y="44" width="48" height="5" rx="2.5" className="fill-foreground" />
      <circle cx="35" cy="46.5" r="7" className="fill-iris" />
    </>
  ),
  // what it may show: the eye, and a lid the instructor lowers over it
  reveal: (
    <>
      <path d="M3 30c7-11 15.5-17 25-17s18 6 25 17c-7 11-15.5 17-25 17S10 41 3 30Z" className={tint} />
      <circle cx="28" cy="31" r="10" className="fill-foreground" />
      <path d="M3 30c7-11 15.5-17 25-17s18 6 25 17c-7-4-15.5-6-25-6S10 26 3 30Z" className="fill-iris" />
    </>
  ),
};

export type GlyphName = keyof typeof drawings;

export function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 56 56" className={cn("size-14", className)}>
      {drawings[name]}
    </svg>
  );
}
