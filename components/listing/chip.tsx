import { cn } from "@/lib/utils";

/** A count riding a control's top-right corner: 20px, ringed in the ground
 *  the control stands on so the two read as a count on a chip rather than one
 *  notched shape. Hidden from screen readers; the control's label says it. */
export function CountBadge({ n, ring = "ring-background" }: { n: number; ring?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium tabular-nums text-primary-foreground ring-2",
        ring,
      )}
    >
      {n}
    </span>
  );
}

// The chip a filter opens from: the page's own pill in white on a hairline,
// with room left for the count on its corner. A facet with nothing chosen is
// the Select's placeholder state, which greys the trigger's words; here the
// words are the facet's name rather than a prompt, so they keep the ink the
// Price chip and the chosen Rating already had, and the row reads as one.
export const chip =
  "relative h-10 gap-1.5 rounded-control bg-card pl-4 pr-3 text-sm hover:bg-accent data-[popup-open]:bg-accent data-placeholder:text-foreground";
