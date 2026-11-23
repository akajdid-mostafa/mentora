"use client";

import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import type { Language } from "@/components/course/courses";
import { ratingLabel, ratings, type Counts } from "@/components/instructors/directory";
import { chip, CountBadge } from "@/components/listing/chip";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { whenPressed } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

// These are the catalog's chips with the directory's noun: the same pill, the
// same count riding its corner, and a list whose right-hand column says how
// many teachers each option would leave.

function Tally({ n }: { n: number }) {
  return (
    <span className="ml-auto pl-6 text-sm tabular-nums text-muted-foreground">
      {n}
      <span className="sr-only"> {n === 1 ? "instructor" : "instructors"}</span>
    </span>
  );
}

// The second head is for the eye only: every figure already says
// "instructors" to a screen reader.
const heads = "flex justify-between gap-4 pr-8";

/** The languages a teacher's courses are recorded in, any number chosen. An
 *  option that would empty the page is locked, unless it is already on. */
export function LanguageSelect({
  options,
  value,
  onChange,
  counts,
}: {
  options: readonly Language[];
  value: Language[];
  onChange: (next: Language[]) => void;
  counts: Counts["language"];
}) {
  return (
    <Select multiple value={value} onValueChange={(v) => onChange(v as Language[])}>
      <SelectTrigger
        aria-label={value.length ? `Language, ${value.length} chosen` : "Language"}
        className={chip}
      >
        <SelectValue>{() => "Language"}</SelectValue>
        {value.length > 0 && <CountBadge n={value.length} />}
      </SelectTrigger>
      <SelectContent label="Language" className="min-w-64">
        <SelectGroup>
          <SelectLabel className={heads}>
            <span>Teaches in</span>
            <span aria-hidden="true">Instructors</span>
          </SelectLabel>
          {options.map((o) => (
            <SelectItem
              key={o}
              value={o}
              disabled={!value.includes(o) && (counts.get(o) ?? 0) === 0}
              trailing={<Tally n={counts.get(o) ?? 0} />}
            >
              {o}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const ANY = "any";
const ratingItems: Record<string, string> = {
  [ANY]: "Any rating",
  ...Object.fromEntries(ratings.map((r) => [String(r), ratingLabel(r)])),
};

/** The lowest rating let through. The chip names its value rather than
 *  carrying a count, since only one can be chosen. The star is ink, as every
 *  star on a teacher's card is. */
export function RatingSelect({
  value,
  onChange,
  counts,
  all,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
  counts: Counts["rating"];
  all: number;
}) {
  return (
    <Select
      items={ratingItems}
      value={value === null ? ANY : String(value)}
      onValueChange={(v) => onChange(v === ANY ? null : Number(v))}
    >
      <SelectTrigger aria-label="Rating" className={chip}>
        <SelectValue>
          {(v: string) =>
            v === ANY ? (
              "Rating"
            ) : (
              <span className="flex items-center gap-1">
                <StarSolid className="size-3.5 text-foreground" />
                {Number(v).toFixed(1)}+
              </span>
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent label="Rating" className="min-w-60">
        <SelectGroup>
          <SelectLabel className={heads}>
            <span>Rating</span>
            <span aria-hidden="true">Instructors</span>
          </SelectLabel>
          <SelectItem value={ANY} trailing={<Tally n={all} />}>
            Any rating
          </SelectItem>
          {ratings.map((r) => (
            <SelectItem
              key={r}
              value={String(r)}
              disabled={value !== r && (counts.get(r) ?? 0) === 0}
              trailing={<Tally n={counts.get(r) ?? 0} />}
            >
              <span className="flex items-center gap-1.5">
                <StarSolid className="size-3.5 text-foreground" />
                {ratingLabel(r)}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/** A filter that is either on or off, drawn as the row's other chips are and
 *  picked the way every chip here is picked. A count, where it has one, rides
 *  its corner as the list chips' counts do. */
export function ToggleChip({
  label,
  on,
  onChange,
  badge,
  counted,
  disabled,
}: {
  label: string;
  on: boolean;
  onChange: (next: boolean) => void;
  badge?: number;
  /** What the count counts, one and many, for the name a screen reader
   *  hears: the badge itself is drawn for the eye only. */
  counted?: [string, string];
  disabled?: boolean;
}) {
  const heard =
    badge && counted ? `${label}, ${badge} ${badge === 1 ? counted[0] : counted[1]}` : undefined;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={heard}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={cn(
        "relative flex h-10 shrink-0 items-center whitespace-nowrap rounded-control px-4 text-sm press",
        "bg-card ring-1 ring-inset ring-border hover:bg-accent",
        whenPressed,
        "aria-pressed:hover:bg-accent",
        "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-card",
      )}
    >
      {label}
      {badge !== undefined && badge > 0 && <CountBadge n={badge} />}
    </button>
  );
}
