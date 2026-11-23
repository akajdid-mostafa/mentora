import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The heading that opens a section, one treatment page-wide: 30px, 36 from
// `sm`, 48 from `lg`, tightened for the face it is set in, in one ink. Where it
// sits in its section — the gap under an eyebrow, a centred head — the caller
// passes through `className`.
export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "max-w-xl text-3xl tracking-tighter sm:text-4xl lg:max-w-3xl lg:text-5xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

// The words a heading turns on, swiped through with the brand's marker. Kept
// for the few headings that have such a phrase, so it still reads as a hand
// rather than as a style. Two strokes, not one: they cross at the left and
// open out to the right, which is the difference between a hand and a rule,
// and both overrun the words at either end. The phrase does not break, so the
// strokes always sit under one line. The drawing takes its width outright: an
// SVG keeps its viewBox's width when only `left` and `right` are set, which
// left a long phrase underlined halfway. It takes no pointer events, as every
// drawn mark here does: the strokes overrun the phrase at both ends, and a
// heading can sit in a link.
export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <svg
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1.5 -left-3 h-4 w-[calc(100%+1.5rem)]"
      >
        <g
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        >
          <path d="M2 6 C 60 1, 140 11, 198 5" />
          <path d="M10 5 C 66 10, 140 16, 190 11" />
        </g>
      </svg>
    </span>
  );
}
