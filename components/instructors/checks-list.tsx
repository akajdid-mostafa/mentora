import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Check } from "@/components/instructors/records";
import { cn } from "@/lib/utils";

// Dates are written in UTC, the zone they are stored in, so the day printed
// is the day recorded wherever the page is read.
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const long = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** The four checks as a run of dated steps on one rule, drawn the way the
 *  course page's syllabus joins its modules: each step but the last carries
 *  the rule from its tick down to the next, so it starts and stops at a tick
 *  however many lines the evidence takes. `on` names the surface the list
 *  stands on, which the tick's disc is mixed into and ringed with.
 *
 *  `years` prints the year on the first date and wherever the year turns,
 *  for a card with no year of its own in view; the directory's record
 *  prints it at its foot instead. */
export function ChecksList({
  checks,
  on = "card",
  years = false,
  className,
}: {
  checks: Check[];
  on?: "card" | "accent" | "popover";
  years?: boolean;
  className?: string;
}) {
  const year = (iso: string) => iso.slice(0, 4);
  return (
    <ol data-object className={cn("relative", className)}>
      {checks.map((c, i) => (
        <li key={c.title} className="relative flex items-start gap-4 py-2.5">
          {/* from under this tick's ring to the next tick's: 10px of padding,
              the 28px disc and its 4px ring, then 6px into the next step */}
          {i < checks.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-3.5 top-[2.625rem] w-px -translate-x-1/2 bg-foreground/10"
            />
          )}
          {/* iris is the colour of a check done across the site, as a chip
              carries it: the pale tint with its dark ink */}
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full text-iris-ink ring-4",
              {
                card: "bg-[color-mix(in_oklab,var(--iris)_15%,var(--card))] ring-card",
                accent: "bg-[color-mix(in_oklab,var(--iris)_15%,var(--accent))] ring-accent",
                popover: "bg-[color-mix(in_oklab,var(--iris)_15%,var(--popover))] ring-popover",
              }[on],
            )}
          >
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.2} aria-hidden="true" />
          </span>
          {/* the date rides the title's line, so the evidence under it has
              the column's whole width: on a phone a date column of its own
              left each sentence three lines deep */}
          <div className="min-w-0 flex-1">
            <p className="flex items-baseline justify-between gap-4 text-sm">
              <span className="font-medium">{c.title}</span>
              <time dateTime={c.date} className="shrink-0 tabular-nums text-muted-foreground">
                {(years && (i === 0 || year(c.date) !== year(checks[i - 1].date)) ? long : short).format(
                  new Date(c.date),
                )}
              </time>
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{c.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
