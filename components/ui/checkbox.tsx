import type { ReactNode } from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

/** The one box on the site that is ticked rather than picked: square where a
 *  radio is round, in the radio's colours, so a reader can tell "one of
 *  these" from "agree to this" at a glance. Ticked, it pales under the
 *  pointer as a filled control does. Left unticked where it is required, the
 *  box and its sentence turn red where they stand, and the reason is read
 *  out rather than printed on a line of its own. */
export function Checkbox({
  id,
  name,
  checked,
  onChange,
  children,
  error,
  className,
}: {
  id: string;
  /** The key the box is sent under, as "on", when the form is submitted
   *  ticked. */
  name?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  /** The sentence beside the box. A link inside it opens without ticking. */
  children: ReactNode;
  error?: string;
  /** On the label that holds the box and its sentence, to set the box into
   *  a column it shares with other marks. */
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={cn("group/tick flex cursor-pointer items-start gap-3 text-sm", className)}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-px flex size-5 shrink-0 items-center justify-center rounded-[6px] ring-inset transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
            checked
              ? "bg-primary text-primary-foreground ring-1 ring-primary group-hover/tick:bg-primary/80"
              : error
                ? "ring-2 ring-destructive"
                : "ring-1 ring-foreground/20 group-hover/tick:ring-foreground/40",
          )}
        >
          {checked && <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.4} />}
        </span>
        <span className={cn(error && "text-destructive")}>{children}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="sr-only">
          {error}
        </p>
      )}
    </div>
  );
}
