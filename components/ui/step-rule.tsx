import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

// Written whole, so Tailwind finds each one in the source.
const COLUMNS: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

/** A form's steps as one segmented rule, each named under its segment: the
 *  segments up to the current one in the brand, the rest pale. A step already
 *  passed can be gone back to; one ahead waits for the form's own button, and
 *  only the first kind is a stop for the Tab key. `locked` holds every
 *  segment still, while the form is being sent. */
export function StepRule({
  steps,
  current,
  onPick,
  locked,
  className,
}: {
  steps: readonly string[];
  current: number;
  onPick: (i: number) => void;
  locked?: boolean;
  className?: string;
}) {
  return (
    // a container, so four names step down a size where the form is too
    // narrow for them, as a checkout with a gift step is at 320
    <ol className={cn("@container grid gap-2", COLUMNS[steps.length] ?? "grid-cols-3", className)}>
      {steps.map((label, i) => {
        const back = i < current && !locked;
        return (
          <li key={label}>
            <button
              type="button"
              aria-disabled={!back || undefined}
              tabIndex={back ? undefined : -1}
              onClick={() => back && onPick(i)}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "group/seg block w-full rounded-control text-left",
                back ? "press cursor-pointer" : "cursor-default",
                reach,
              )}
            >
              {/* Contrast: bg-muted is 1.15:1 on the page and bg-primary 1.5:1,
                  under WCAG's 3:1 for a graphic; the step's label beside it
                  and aria-current carry which step is open. */}
              <span
                aria-hidden="true"
                className={cn("block h-1 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-muted")}
              />
              <span
                className={cn(
                  "mt-2.5 block text-sm transition-colors",
                  steps.length > 3 && "@max-[18rem]:text-xs",
                  i === current ? "text-foreground" : "text-muted-foreground",
                  back && "group-hover/seg:text-foreground",
                )}
              >
                <span className="sr-only">Step {i + 1}: </span>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
