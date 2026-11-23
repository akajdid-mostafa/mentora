"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { courseHref, figure, type Course } from "@/components/course/courses";
import { ago, ReviewItem, Stars } from "@/components/course-page/reviews";
import type { TeacherReview } from "@/components/instructor-page/model";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, count } from "@/lib/utils";

// How many reviews a page holds, two full rows at each width: six from lg,
// the reference's row of three twice over; four from md, where three to a
// row would leave each cell too narrow for a name; on a phone, where the
// cells stack, three. The server draws the six, and the cells past a
// width's count are hidden there until the browser has measured.
const MD = "(min-width: 768px)";
const LG = "(min-width: 1024px)";
const subscribeWidth = (on: () => void) => {
  const queries = [matchMedia(MD), matchMedia(LG)];
  queries.forEach((q) => q.addEventListener("change", on));
  return () => queries.forEach((q) => q.removeEventListener("change", on));
};
const perPage = () => (matchMedia(LG).matches ? 6 : matchMedia(MD).matches ? 4 : 3);

/** The hairlines each cell draws on its own top and left edge, for the
 *  columns at each width, and the cells a width's page has no room for. */
const lines = (i: number) =>
  cn(
    i > 0 && "max-md:border-t",
    i >= 3 && "max-md:hidden",
    i >= 2 && "md:max-lg:border-t",
    i % 2 > 0 && "md:max-lg:border-l",
    i >= 4 && "md:max-lg:hidden",
    i >= 3 && "lg:border-t",
    i % 3 > 0 && "lg:border-l",
  );

type Order = "helpful" | "newest";
const orders: { value: Order; label: string }[] = [
  { value: "helpful", label: "Most helpful" },
  { value: "newest", label: "Newest" },
];

/** What learners say about the teacher, across every course: the rating and
 *  its count as the panel's heading, each course's rating beside it, and the
 *  written reviews two rows at a time on a white card along the panel's foot.
 *  Every review opens whole in the dialog. */
export function ReviewsPanel({
  name,
  rating,
  total,
  courses,
  reviews,
}: {
  name: string;
  rating: number;
  /** Every rating the teacher's courses have had, written or not. */
  total: number;
  courses: Course[];
  reviews: TeacherReview[];
}) {
  const first = name.split(" ")[0];
  const per = useSyncExternalStore(subscribeWidth, perPage, () => 6);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(reviews.length / per);
  const at = Math.min(page, pages - 1);
  // The last page ends on the last review rather than a row short, so the
  // card holds its height from page to page and the page under it stays
  // put; it takes back as many of the page before as it needs.
  const start = Math.max(0, Math.min(at * per, reviews.length - per));
  const shown = reviews.slice(start, start + per);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  // The button that opened the dialog, which takes the focus back when it
  // closes: there is no trigger for the dialog to find, since two kinds of
  // button open it.
  const opener = useRef<HTMLElement | null>(null);
  // Each course's share of the written and unwritten reviews together, so
  // the bars add up to the whole rather than all measuring the busiest.
  const all = courses.reduce((n, c) => n + c.reviews, 0) || 1;

  const openAt = (id: string | null) => {
    opener.current = document.activeElement as HTMLElement | null;
    setTarget(id);
    setOpen(true);
  };

  // the rails' two arrows, so turning a page of reviews is the same control
  // as moving along a shelf
  const pager = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        focusableWhenDisabled
        aria-label="Previous reviews"
        disabled={at === 0}
        onClick={() => setPage(at - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        focusableWhenDisabled
        aria-label="Next reviews"
        disabled={at === pages - 1}
        onClick={() => setPage(at + 1)}
      >
        <ChevronRightIcon />
      </Button>
      <p aria-live="polite" className="ml-1 text-sm tabular-nums text-muted-foreground">
        {start + 1}–{start + shown.length} of {reviews.length}
      </p>
    </div>
  );

  return (
    <section id="reviews" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* The panel's padding holds the head and the card alike, so the card
          stands on the heading's left edge with the tint round three sides of
          it, as the reference sets its white card. */}
      <div className="rounded-lg bg-accent px-4 pb-4 pt-8 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10 lg:pt-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:pb-12">
          <div>
            <p className="flex items-center gap-2.5 text-sm">
              <Stars value={rating} size="md" />
              <span className="font-medium tabular-nums">{rating.toFixed(1)}</span>
              <span className="tabular-nums text-muted-foreground">({figure(total)} ratings)</span>
            </p>
            <SectionHeading className="mt-5">What learners say about {first}</SectionHeading>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {reviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => openAt(null)}
                  className="h-10 rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
                >
                  Read all {count(reviews.length, "review")}
                </button>
              )}
              {/* From lg the arrows ride the head; under it they would sit a
                  screen above the card they turn, so they move under it. */}
              {pages > 1 && <div className="hidden lg:contents">{pager}</div>}
            </div>
          </div>

          {/* Where the reference sets its photograph: how each course the
              teacher runs is rated, each bar as long as its share of the
              reviews, so the reader sees whether one course carries the
              rating or all of them do. Ink, as every rating on a teacher. */}
          <div>
            <Caps>By course</Caps>
            <ul className="mt-5 flex flex-col gap-5">
              {courses.map((c) => (
                <li key={c.id}>
                  <p className="flex items-start justify-between gap-4 text-sm">
                    <Link
                      href={`${courseHref(c)}#reviews`}
                      className={cn("min-w-0 font-medium underline-offset-4 press hover:underline", reach)}
                    >
                      {c.title}
                    </Link>
                    <span className="flex shrink-0 items-center gap-1 tabular-nums">
                      <StarSolid aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">rated </span>
                      {c.rating}
                      <span className="text-muted-foreground"> ({figure(c.reviews)})</span>
                    </span>
                  </p>
                  <span aria-hidden="true" className="mt-2 block h-1 rounded-full bg-foreground/10">
                    <span
                      className="block h-full rounded-full bg-foreground"
                      style={{ width: `${Math.max(4, (c.reviews / all) * 100)}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The reference's white card along the panel's foot, split into
            cells by hairlines: stars, the words held to four lines, and who
            wrote it on which course. It holds two rows, three to a row from
            lg and two from md, with an upright between the columns and a
            rule between the rows; each cell draws its own lines, so a short
            last row leaves the card white where a cell is missing. */}
        {shown.length > 0 && (
          <ul
            data-object
            className="grid grid-cols-[minmax(0,1fr)] rounded-lg bg-card shadow-soft md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((r, i) => (
              <Cell key={r.id} review={r} onRead={() => openAt(r.id)} className={lines(i)} />
            ))}
          </ul>
        )}
        {/* held to the left, where the arrows stand still while the count
            beside them widens from "1–3" to "10–12" */}
        {pages > 1 && <div className="mt-4 flex lg:hidden">{pager}</div>}
      </div>

      <AllReviews
        open={open}
        onOpenChange={setOpen}
        opener={opener}
        first={first}
        total={total}
        courses={courses}
        reviews={reviews}
        target={target}
      />
    </section>
  );
}


/** One review on the card: its stars and age, four lines of it, and at the
 *  foot who wrote it on which course, with "Read all" where the four lines
 *  cut it short. */
function Cell({
  review: r,
  onRead,
  className,
}: {
  review: TeacherReview;
  onRead: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [cut, setCut] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setCut(el.scrollHeight > el.clientHeight + 1);
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [r.id]);

  return (
    <li className={cn("flex min-w-0 flex-col p-6 sm:p-7", className)}>
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Stars value={r.stars} />
        <span aria-hidden="true">·</span>
        <span>{ago(r.weeks)}</span>
      </p>
      {/* four lines held open whether the review fills them or not, so
          every row stands as tall as the next page's */}
      <p ref={ref} className="mt-3 line-clamp-4 min-h-[4lh] text-base">
        “{r.text}”
      </p>
      {/* "Read all" rides the name's line, so the course under it has the
          cell's whole width and a page turn never finds it a line longer */}
      <div className="mt-auto pt-6 text-sm">
        <p className="flex items-baseline justify-between gap-4">
          <span className="min-w-0 truncate font-medium">{r.name}</span>
          {cut && (
            <button
              type="button"
              onClick={onRead}
              aria-label={`Read all of ${r.name}'s review`}
              className={cn(
                "shrink-0 font-medium underline underline-offset-4 press hover:text-muted-foreground",
                reach,
              )}
            >
              Read all
            </button>
          )}
        </p>
        <p className="line-clamp-2 text-muted-foreground">{r.course.title}</p>
      </div>
    </li>
  );
}

/** Every review, in a dialog: a course to narrow them to and an order, and
 *  the list the course page draws, each review naming its course. Opened on
 *  one review, it scrolls to that one and puts the focus on it. */
function AllReviews({
  open,
  onOpenChange,
  first,
  total,
  courses,
  reviews,
  target,
  opener,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opener: RefObject<HTMLElement | null>;
  first: string;
  total: number;
  courses: Course[];
  reviews: TeacherReview[];
  target: string | null;
}) {
  const [course, setCourse] = useState("all");
  const [order, setOrder] = useState<Order>("helpful");
  const items = useRef(new Map<string, HTMLLIElement>());

  const list = reviews
    .filter((r) => course === "all" || r.course.id === course)
    .sort((a, b) => (order === "helpful" ? b.helpful - a.helpful : a.weeks - b.weeks));
  const courseItems = [
    { value: "all", label: "All courses" },
    ...courses.map((c) => ({ value: c.id, label: c.title })),
  ];
  // The line under the title counts what the list shows: every review, or
  // the one course's once the list is narrowed to it, whose name the select
  // under it already shows. The unit is held to its figure.
  const narrowed = courses.find((c) => c.id === course);
  const counted = narrowed
    ? `${count(list.length, "written review")}, from ${figure(narrowed.reviews)}\u00a0${narrowed.reviews === 1 ? "rating" : "ratings"}`
    : `${count(reviews.length, "written review")}, from ${figure(total)}\u00a0ratings in all`;
  // A teacher with one course has nothing to narrow to.
  const single = courses.length === 1;

  // Opened on one review: every course and the default order, so the review
  // is in the list, then scrolled to once the dialog has drawn it.
  useEffect(() => {
    if (!open || !target) return;
    const id = requestAnimationFrame(() => {
      const el = items.current.get(target);
      el?.scrollIntoView({ block: "center" });
      el?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open, target]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setCourse("all");
          setOrder("helpful");
        }
        onOpenChange(next);
      }}
    >
      {/* one height whatever the list holds, so narrowing it never moves
          the select the visitor has just used */}
      <DialogContent
        className="h-[calc(100dvh-1.5rem)] sm:h-[min(54rem,calc(100dvh-3rem))] sm:max-w-3xl"
        finalFocus={opener}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5 sm:px-8">
          <div>
            <DialogTitle className="text-lg">
              Reviews of {first}&apos;s {single ? "course" : "courses"}
            </DialogTitle>
            {/* two lines held on a phone, where the count can take a second,
                so the selects under it stay put */}
            <DialogDescription className="mt-1 max-sm:min-h-[2lh]">{counted}</DialogDescription>
          </div>
          <DialogCloseButton />
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:px-8">
          {!single && (
            <Select items={courseItems} value={course} onValueChange={(v) => setCourse(v as string)}>
              <SelectTrigger aria-label="Show the reviews of one course" className="w-full sm:w-72">
                <SelectValue />
              </SelectTrigger>
              <SelectContent label="Show the reviews of one course">
                <SelectGroup>
                  <SelectLabel>Course</SelectLabel>
                  {courseItems.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Select items={orders} value={order} onValueChange={(v) => setOrder(v as Order)}>
            <SelectTrigger aria-label="Sort the reviews" className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent label="Sort the reviews">
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                {orders.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <ul className="flex-1 overflow-y-auto px-6 sm:px-8">
          {list.length === 0 && (
            <li className="flex flex-col items-center gap-4 py-10 text-center text-sm text-muted-foreground">
              No written reviews of this course yet.
              <Button variant="outline" onClick={() => setCourse("all")}>
                Show every course
              </Button>
            </li>
          )}
          {list.map((r, i) => (
            <ReviewItem
              key={r.id}
              ref={(el) => {
                if (el) items.current.set(r.id, el);
                else items.current.delete(r.id);
              }}
              review={r}
              query=""
              course={course === "all" && !single ? r.course.title : undefined}
              courseId={r.course.id}
              whole
              className={cn("py-7 outline-none", i < list.length - 1 && "border-b")}
            />
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
