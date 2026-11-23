"use client";

import { useSyncExternalStore } from "react";
import { chip } from "@/components/listing/chip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SM = "(min-width: 640px)";
const subscribe = (change: () => void) => {
  const mq = matchMedia(SM);
  mq.addEventListener("change", change);
  return () => mq.removeEventListener("change", change);
};

/** The order a list's results come in, as a chip at the end of its filter
 *  row. The chosen order shows beside the word from sm, and there the list
 *  opens as every other list in the row does, with the chosen row laid over
 *  the trigger. On a phone the row has no room for the order, so the trigger
 *  holds the word alone and the list opens under its end: laid over a value
 *  that is not drawn, it opened in the screen's corner. A touch never lays a
 *  list over its trigger. */
export function SortSelect<T extends string>({
  label,
  sorts,
  value,
  onChange,
  className,
}: {
  /** The trigger's name, which says what is sorted: "Sort courses". */
  label: string;
  sorts: readonly { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
}) {
  const wide = useSyncExternalStore(subscribe, () => matchMedia(SM).matches, () => true);
  return (
    <Select
      items={Object.fromEntries(sorts.map((s) => [s.id, s.label]))}
      value={value}
      onValueChange={(v) => onChange(v as T)}
    >
      <SelectTrigger aria-label={label} className={cn(chip, className)}>
        <span className="text-muted-foreground max-sm:text-foreground">Sort</span>
        <span className="max-sm:hidden">
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent label={label} className="min-w-56" alignItemWithTrigger={wide} align="end">
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          {sorts.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
