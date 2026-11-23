import { cn } from "@/lib/utils";

/** The hand pointing at the figure beside a list page's search, as the design's
 *  label points at its mascot: two lines in the heading face turned a couple
 *  of degrees, and an arrow that leaves them, loops once and lands in the gap
 *  between the band's columns, short of the figure's edge. The gap is the one
 *  width that never changes from lg, so the arrow is drawn at one size and
 *  hangs into it by a fixed margin. It draws itself again every few seconds,
 *  on the planner's clock from the home page; a reader who asked for
 *  stillness sees it drawn. From lg only: below it the figure stands under
 *  the search, with no gap for the arrow to cross. */
export function HandNote({ lines, className }: { lines: readonly [string, string]; className?: string }) {
  return (
    <p className={cn("hidden items-end justify-end gap-1 lg:flex", className)}>
      <span className="inline-block -rotate-2 font-heading text-xl tracking-tight text-foreground">
        {lines[0]}
        <br />
        {lines[1]}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 96 80"
        fill="none"
        className="pointer-events-none -mr-12 mb-4 h-20 w-24 shrink-0 overflow-visible text-foreground motion-safe:animate-scribble"
      >
        <path
          d="M4 62C18 68 34 64 44 52C52 42 48 32 40 35C32 38 36 52 50 54C62 54 76 36 90 24"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="motion-safe:animate-scribble-shaft"
        />
        <path
          d="M81 24.1Q85.6 24.4 90 24Q88.2 28.2 87 32.5"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:animate-scribble-head"
        />
      </svg>
    </p>
  );
}
