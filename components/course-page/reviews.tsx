"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import Image from "next/image";
import { Popover } from "@base-ui/react/popover";
import {
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ClockIcon,
  HandThumbUpIcon,
  MagnifyingGlassIcon,
  StarIcon as StarLine,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  Comment01Icon,
  Dumbbell01Icon,
  GaugeIcon,
  GlassesIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { figure, type Course } from "@/components/course/courses";
import type { Aspect } from "@/components/course/detail";
import type { Review } from "@/components/course/reviews";
import { reach } from "@/components/reach";
import { AiIcon } from "@/components/ui/ai-icon";
import { usePortalRoot } from "@/components/ui/portal-root";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fold, Marked } from "@/components/course-page/marked";
import { face } from "@/components/marketing/quotes";
import { cn, count } from "@/lib/utils";

type Order = "helpful" | "newest" | "highest" | "lowest";
const orders: { id: Order; label: string; Icon: typeof ClockIcon }[] = [
  { id: "helpful", label: "Most helpful", Icon: HandThumbUpIcon },
  { id: "newest", label: "Newest", Icon: ClockIcon },
  { id: "highest", label: "Highest rated", Icon: BarsArrowDownIcon },
  { id: "lowest", label: "Lowest rated", Icon: BarsArrowUpIcon },
];
const orderItems = orders.map(({ id, label }) => ({ value: id, label }));

// One glyph per thing learners rate, drawn large at the foot of its cell as
// the reference draws its own. Tutor keeps the AI glyph in the AI accent, the
// mark the tutor wears everywhere else on the site.
const aspectIcon: Record<string, IconSvgElement | "tutor"> = {
  Clarity: GlassesIcon,
  Pace: GaugeIcon,
  Practice: Dumbbell01Icon,
  Tutor: "tutor",
  Feedback: Comment01Icon,
  Value: Tag01Icon,
};

const FIRST = 6;

/** "This week", "3 weeks ago", "2 months ago". */
export function ago(weeks: number) {
  if (weeks < 2) return "This week";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.round(weeks / 4.3);
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

/** The reviews, laid out as the reference lays out a listing's, across the
 *  container's full width: the rating is the block's heading
 *  (course-overview.tsx sets it), then one row of cells split by rules — the
 *  spread across the five stars, and the six things learners score — then a
 *  rule, and the reviews two abreast with a rule between each and the next.
 *  A search, a rating filter and a sort sit over the list; it holds a sample
 *  of the course's reviews and says so. */
export function Reviews({
  course: c,
  reviews,
  spread,
  aspects,
}: {
  course: Course;
  reviews: Review[];
  spread: { stars: number; pct: number; count: number }[];
  aspects: Aspect[];
}) {
  const [stars, setStars] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order>("helpful");
  const [more, setMore] = useState(false);
  // The first of the reviews "Show more" brings in, which takes the focus
  // from the button as the button goes.
  const firstMore = useRef<HTMLLIElement>(null);

  const q = fold(query.trim());
  const found = reviews.filter((r) => !q || searchText(r).includes(q));
  const list = found
    .filter((r) => (stars ? r.stars === stars : true))
    .sort((a, b) =>
      order === "helpful"
        ? b.helpful - a.helpful
        : order === "newest"
          ? a.weeks - b.weeks
          : order === "highest"
            ? b.stars - a.stars || b.helpful - a.helpful
            : a.stars - b.stars || b.helpful - a.helpful,
    );
  const narrowed = stars !== null || !!q;
  const shown = more || narrowed ? list : list.slice(0, FIRST);
  const clear = () => {
    setStars(null);
    setQuery("");
  };

  // How many reviews each rating would leave, counted after the search, as
  // the catalogue's filters count what an option would leave.
  const leaves = (s: number) => found.filter((r) => r.stars === s).length;
  const starItems = [
    { value: "all", label: "All ratings" },
    ...spread.map((s) => ({ value: String(s.stars), label: count(s.stars, "star") })),
  ];

  return (
    <div>
      <HowReviewsWork />

      {/* The reference's row: the spread first, then one cell a score, with
          a rule between each and the next. It stands as one row from lg,
          where every cell is as tall as the spread and each score's glyph
          sits on the row's foot; narrower, the spread goes over the six, and
          on a phone the six scroll sideways. The spread and the stars are in
          ink, as the reference draws them, since in this block the rating
          is the heading and needs no colour to find. */}
      <div className="mt-8 lg:flex">
        <div className="max-w-sm lg:w-72 lg:max-w-none lg:shrink-0 lg:pr-10 xl:w-80">
          <p className="text-sm font-medium">Overall rating</p>
          <ul className="mt-2 flex flex-col">
            {spread.map((s) => (
              <li key={s.stars} className="flex items-center gap-3 text-xs text-muted-foreground">
                <span aria-hidden="true" className="w-2 tabular-nums">
                  {s.stars}
                </span>
                <span className="sr-only">
                  {count(s.stars, "star")}, {s.pct}% of reviews
                </span>
                <span aria-hidden="true" className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-foreground"
                    style={{ width: `${Math.max(s.pct, s.pct ? 2 : 0)}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul
          data-object
          className="-mx-6 mt-8 flex overflow-x-auto px-6 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0 lg:mt-0 lg:flex-1 lg:border-l"
        >
          {aspects.map((a) => {
            const icon = aspectIcon[a.label];
            return (
              <li
                key={a.label}
                className="flex w-28 shrink-0 flex-col border-l pl-4 pr-2 first:border-l-0 first:pl-0 sm:w-auto lg:pl-6 lg:first:pl-6"
              >
                <p className="text-sm font-medium">{a.label}</p>
                <p className="text-sm tabular-nums">{a.score.toFixed(1)}</p>
                <span className="mt-auto pt-6">
                  {icon === "tutor" ? (
                    <AiIcon size={30} strokeWidth={1.4} className="text-iris-ink" />
                  ) : (
                    <HugeiconsIcon icon={icon} size={30} strokeWidth={1.3} aria-hidden="true" />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* the rule under the row, and the three ways into the list */}
      <div className="mt-8 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center">
        {/* flex-1 only once the row is a row: in the stacked column a phone
            gets, a zero basis would take the field's height down to its text */}
        <label className="flex h-10 items-center gap-2.5 rounded-control bg-card pl-3.5 pr-1 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring sm:flex-1 lg:max-w-sm">
          <MagnifyingGlassIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="sr-only">Search the reviews</span>
          <input
            size={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the reviews"
            className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear the search"
              className="relative flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground press hover:bg-accent hover:text-foreground after:absolute after:-inset-1 after:content-['']"
            >
              <XMarkIcon className="size-4" />
            </button>
          )}
        </label>

        {/* Both lists are built as the home page's Field select is
            (instructors-ranked.tsx): a glyph beside the value in the trigger,
            the popup opening with the chosen row laid over it, and a group
            label that heads the figures down the right edge. On a phone each
            takes the full width, as that one does: two abreast under 390px
            cut "Most helpful" short. */}
        <div className="flex flex-col gap-3 sm:flex-row lg:ml-auto">
          <Select
            items={starItems}
            value={stars === null ? "all" : String(stars)}
            onValueChange={(v) => setStars(v === "all" ? null : Number(v))}
          >
            <SelectTrigger aria-label="Filter the reviews by rating" className="w-full sm:w-48">
              <SelectValue>
                {(v: string) => (
                  <>
                    <RatingGlyph all={v === "all"} />
                    {starItems.find((s) => s.value === v)?.label}
                  </>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent label="Filter the reviews by rating">
              <SelectGroup>
                <SelectLabel className="flex justify-between gap-4 pr-8">
                  <span>Rating</span>
                  <span aria-hidden="true">Reviews</span>
                </SelectLabel>
                <SelectItem value="all" trailing={<Tally n={found.length} />}>
                  <span className="flex items-center gap-2">
                    <RatingGlyph all />
                    All ratings
                  </span>
                </SelectItem>
                {spread.map((s) => {
                  const n = leaves(s.stars);
                  return (
                    <SelectItem
                      key={s.stars}
                      value={String(s.stars)}
                      // a rating that would empty the list is locked, unless
                      // it is the one already on
                      disabled={stars !== s.stars && n === 0}
                      trailing={<Tally n={n} />}
                    >
                      <span className="flex items-center gap-2">
                        <RatingGlyph />
                        {count(s.stars, "star")}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select items={orderItems} value={order} onValueChange={(v) => setOrder(v as Order)}>
            <SelectTrigger aria-label="Sort the reviews" className="w-full sm:w-48">
              <SelectValue>
                {(v: Order) => {
                  const o = orders.find((x) => x.id === v) ?? orders[0];
                  return (
                    <>
                      <o.Icon className="size-4 text-muted-foreground" />
                      {o.label}
                    </>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent label="Sort the reviews">
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                {orders.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    <span className="flex items-center gap-2">
                      <o.Icon className="size-4 text-muted-foreground" />
                      {o.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mounted before anything is narrowed, so the count that appears in
          it is announced: a live region that arrives with its words says
          nothing. */}
      <p aria-live="polite" className="sr-only">
        {narrowed ? `${list.length} of ${reviews.length} reviews shown` : ""}
      </p>
      {narrowed && list.length > 0 && (
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span aria-hidden="true" className="text-muted-foreground">
            {list.length} of the {reviews.length} here
          </span>
          <button
            type="button"
            onClick={clear}
            className={cn("underline underline-offset-4 press hover:text-muted-foreground", reach)}
          >
            Clear the filters
          </button>
        </p>
      )}

      {list.length === 0 ? (
        <div className="mt-8 rounded-lg bg-accent p-6">
          <p className="text-base font-medium">
            {!q
              ? `No ${stars}-star review in this sample`
              : stars !== null
                ? `No ${stars}-star review here mentions “${query.trim()}”`
                : `No review here mentions “${query.trim()}”`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The sample is {reviews.length} of {figure(c.reviews)}. Clear the filters to read them all.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-4 h-10 rounded-control bg-card px-4 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
          >
            Clear the filters
          </button>
        </div>
      ) : (
        // One column to md, then two, each review padded off the rules
        // rather than spaced by a gap, so every rule sits midway between the
        // reviews it parts. From 1280 a column holds 559px of text, the width
        // every review's last line is fitted to (reviews.ts).
        <ul data-object className="mt-10 grid md:grid-cols-2">
          {shown.map((r, i) => (
            <ReviewItem
              key={r.id}
              ref={i === FIRST ? firstMore : undefined}
              review={r}
              query={q}
              className={edges(i, shown.length)}
            />
          ))}
        </ul>
      )}

      {!narrowed && list.length > FIRST && (
        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
          {!more && (
            <button
              type="button"
              onClick={() => {
                setMore(true);
                requestAnimationFrame(() => firstMore.current?.focus());
              }}
              className="h-10 rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
            >
              Show {list.length - FIRST} more reviews
            </button>
          )}
          <p className="text-sm text-muted-foreground">
            {more ? list.length : FIRST} of {figure(c.reviews)} reviews
          </p>
        </div>
      )}
    </div>
  );
}

/** The rules round review `i` of `n`, and nothing round the list: in one
 *  column a rule under every review but the last; in two, a rule down the
 *  middle and one under every row but the last, crossing where they meet.
 *  A review alone on the last row takes no upright, since nothing stands
 *  beside it. */
function edges(i: number, n: number) {
  const row = Math.floor(i / 2);
  const rows = Math.ceil(n / 2);
  const left = i % 2 === 0;
  return cn(
    i < n - 1 && "border-b pb-8",
    i > 0 && "pt-8",
    left ? "md:pr-10 xl:pr-12" : "md:pl-10 xl:pl-12",
    left && i < n - 1 && "md:border-r",
    row < rows - 1 ? "md:border-b md:pb-10" : "md:border-b-0 md:pb-0",
    row > 0 ? "md:pt-10" : "md:pt-0",
  );
}

/** The figure at a rating's end: how many reviews it would leave. */
function Tally({ n }: { n: number }) {
  return (
    <span className="ml-auto pl-4 tabular-nums text-muted-foreground">
      {n}
      <span className="sr-only"> {n === 1 ? "review" : "reviews"}</span>
    </span>
  );
}

/** A rating's glyph in the list and on the trigger: a solid star for a
 *  number of stars, an outline one for every rating at once. */
function RatingGlyph({ all = false }: { all?: boolean }) {
  return all ? (
    <StarLine aria-hidden="true" className="size-4 text-muted-foreground" />
  ) : (
    <StarSolid aria-hidden="true" className="size-4 text-foreground" />
  );
}

/** The reference's line under its heading: how reviews get onto the page,
 *  opened in place rather than sent to a page of its own. */
function HowReviewsWork() {
  const root = usePortalRoot();
  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "-mt-3 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground data-[popup-open]:text-foreground",
          reach,
        )}
      >
        How reviews work
      </Popover.Trigger>
      <Popover.Portal container={root}>
        <Popover.Positioner side="bottom" align="start" sideOffset={10} collisionPadding={16} className="z-50">
          <Popover.Popup
            className={cn(
              "w-80 origin-(--transform-origin) rounded-lg bg-popover p-5 text-popover-foreground shadow-soft-lg outline-none",
              "transition-[opacity,scale] duration-spring ease-spring data-ending-style:duration-answer data-ending-style:ease-answer data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-ending-style:scale-[0.98] data-ending-style:opacity-0 motion-reduce:transition-none",
            )}
          >
            <Popover.Title className="text-base font-medium">How reviews work</Popover.Title>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>A learner can review a course after finishing its first two modules, and can review it once.</li>
              <li>The rating is the mean of every review the course has had. The six scores come from the same form, one question each.</li>
              <li>Nobody at Mentora edits a review, and a low one stays up like any other.</li>
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Five stars, in ink up to the rating's whole number, the next one inked to
 *  the rating's fraction, and pale past it, the way a disabled control reads.
 *  `size` steps them up a notch where they stand beside a large figure rather
 *  than inside a line of text. */
export function Stars({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  // Whole stars up to the figure, and the next one filled to its fraction
  // over the pale one, so a 4.5 reads as four and a half rather than five.
  const whole = Math.floor(value);
  const dim = size === "sm" ? "size-3" : "size-3.5";
  return (
    <span role="img" className={cn("flex items-center gap-px", className)} aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = n <= whole ? 1 : n === whole + 1 ? value - whole : 0;
        return (
          <span key={n} aria-hidden="true" className={cn("relative shrink-0", dim)}>
            {/* Contrast: an unfilled star is text-foreground/20, 1.5:1
                against the page, so filled and unfilled are told apart by
                lightness alone; the row's label reads the rating out. */}
            <StarSolid className={cn(dim, "text-foreground/20")} />
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <StarSolid className={cn(dim, "max-w-none text-foreground")} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

/** What the search reads in a review, folded; the words and the reviewer's
 *  role are kept apart by a line break a typed query cannot contain. */
const searchText = (r: Review) => `${fold(r.text)}\n${fold(r.role)}`;

/** What the rating filter and the search read from a review, as `data-*` for
 *  the item that shows it. Keep it in step with the filter in `Reviews`. */
const reviewData = (r: Review) => ({ "data-stars": r.stars, "data-search": searchText(r) });

/** One review in a list: the face or initials, the name and role, the
 *  stars, when, whether they finished, and the words. `course` names the
 *  course it was left on, for a list that gathers several: the profile
 *  page's. */
export function ReviewItem({
  ref,
  review: r,
  query,
  course,
  courseId,
  whole = false,
  className,
}: {
  ref?: Ref<HTMLLIElement>;
  review: Review;
  query: string;
  course?: string;
  /** The course's id, for a list its dialog filters by course. */
  courseId?: string;
  /** Every line of the review, with no four-line hold and no Show more: a
   *  list opened to read reviews in full, as the profile's dialog is. */
  whole?: boolean;
  className?: string;
}) {
  const initials = r.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <li ref={ref} tabIndex={-1} className={cn("min-w-0", className)} data-course={courseId} {...reviewData(r)}>
      <div className="flex items-center gap-4">
        {/* the reviewer's photograph where they gave one, their initials
            where they did not, as a real list mixes the two */}
        {r.face ? (
          <Image
            src={face(r.face, 96)}
            alt=""
            width={48}
            height={48}
            unoptimized
            className="size-12 shrink-0 rounded-full bg-muted object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium"
          >
            {initials}
          </span>
        )}
        <p className="min-w-0">
          <span className="block truncate text-base font-medium">{r.name}</span>
          <span className="block truncate text-sm text-muted-foreground">{r.role}</span>
        </p>
      </div>

      <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Stars value={r.stars} />
        <span aria-hidden="true">·</span>
        <span>{ago(r.weeks)}</span>
        {r.finished && (
          <>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <CheckIcon aria-hidden="true" className="size-3.5 text-iris-ink" />
              Finished
            </span>
          </>
        )}
      </p>
      {/* the course on a line of its own, so on a phone it never stands
          alone after a dot at the end of the line above */}
      {course && <p className="mt-1 text-sm text-muted-foreground">{course}</p>}

      <Body text={r.text} query={query} whole={whole} />
    </li>
  );
}

/** A review's words, held to four lines as the reference holds a long one,
 *  with "Show more" under it only where the four lines cut something off.
 *  A search opens every review it matched, so a marked word is never the
 *  part that is cut. */
function Body({ text, query, whole }: { text: string; query: string; whole: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);
  const clamped = !open && !query && !whole;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setCut(el.scrollHeight > el.clientHeight + 1);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [clamped]);

  return (
    <>
      <p ref={ref} className={cn("mt-2.5 text-base", clamped && "line-clamp-4")}>
        <Marked text={text} query={query} />
      </p>
      {!query && !whole && (cut || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "mt-2 w-fit text-sm font-medium underline underline-offset-4 press hover:text-muted-foreground",
            reach,
          )}
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}
