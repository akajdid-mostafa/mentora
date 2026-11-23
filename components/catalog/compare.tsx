"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { CheckIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  COMPARE_MAX,
  clearCompared,
  removeCompared,
  toggleCompared,
  useCompared,
} from "@/components/course/compared";
import {
  courseById,
  courseHref,
  figure,
  priceLabel,
  teacherHref,
  type Course,
} from "@/components/course/courses";
import { LevelDots } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** The tray the picked courses wait in: a dark bar at the foot of the screen,
 *  a slot per course with an empty one saying how many more fit, and the
 *  button that lays them side by side. It sits in the corner from sm up, clear
 *  of the page's own content and of anything centred at the foot. It reads the
 *  visitor's compare list itself, so the home shelf and the catalogue show one
 *  tray holding the same courses. */
export function CompareTray() {
  const ids = useCompared();
  const picked = ids.map(courseById).filter((c): c is Course => Boolean(c));
  if (!picked.length) return null;

  // A control that takes itself away hands focus on: a removed course to the
  // next one's ×, or with none left to the Compare button on its own card;
  // Clear, which takes the whole tray, to the first card it emptied.
  const handOn = (next: string | null, card: string) =>
    requestAnimationFrame(() => {
      const to =
        (next && document.querySelector<HTMLElement>(`[data-compare-out="${next}"]`)) ||
        document.querySelector<HTMLElement>(`[data-compare="${card}"]`);
      to?.focus();
    });
  const remove = (id: string) => {
    const rest = picked.filter((c) => c.id !== id);
    removeCompared(id);
    handOn(rest[0]?.id ?? null, id);
  };
  const clear = () => {
    clearCompared();
    handOn(null, picked[0].id);
  };

  return (
    <div
      role="region"
      aria-label="Courses to compare"
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[28rem]"
    >
      {/* `slab` keeps the ink bar a raised dark bar in the dark half; the ×
          on each photo reads the card's ink, which the slab leaves alone. */}
      <div className="slab flex items-center gap-3 rounded-lg bg-foreground p-2 pl-3 text-background shadow-soft-lg">
        <ul className="flex gap-2">
          {Array.from({ length: COMPARE_MAX }, (_, i) => {
            const c = picked[i];
            return (
              <li key={c?.id ?? `empty-${i}`}>
                {c ? (
                  <span className="relative block size-12">
                    <Image
                      src={c.image}
                      alt=""
                      width={48}
                      height={48}
                      sizes="48px"
                      className="size-12 rounded-sm object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => remove(c.id)}
                      data-compare-out={c.id}
                      aria-label={`Take ${c.title} out of the comparison`}
                      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-card text-card-foreground ring-2 ring-foreground press hover:bg-muted after:absolute after:-inset-2.5 after:content-['']"
                    >
                      <XMarkIcon className="size-3" strokeWidth={2.5} />
                    </button>
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-sm border border-dashed border-background/40"
                  >
                    <PlusIcon className="size-4" />
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <p className="min-w-0 flex-1 text-sm">
          <span className="block tabular-nums">
            {picked.length} of {COMPARE_MAX} picked
          </span>
          <button
            type="button"
            onClick={clear}
            className="relative underline underline-offset-4 press hover:opacity-70 after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']"
          >
            Clear
          </button>
        </p>

        <CompareDialog courses={picked} onRemove={removeCompared} />
      </div>
    </div>
  );
}

type Row = {
  label: string;
  cell: (c: Course) => ReactNode;
  /** The course this row favours, when one plainly does. */
  best?: { pick: (cs: Course[]) => Course | undefined; word: string };
};

// The course a row favours, and only when it is alone in that: a tie at the
// top names nobody, and one course has nothing to be favoured over.
const lowest = (key: (c: Course) => number) => (cs: Course[]) => {
  if (cs.length < 2) return undefined;
  const sorted = [...cs].sort((a, b) => key(a) - key(b));
  return key(sorted[0]) < key(sorted[1]) ? sorted[0] : undefined;
};
const highest = (key: (c: Course) => number) => lowest((c) => -key(c));

const rows: Row[] = [
  {
    label: "Price",
    cell: (c) => <span className="font-heading text-xl tracking-tight">{priceLabel(c.price)}</span>,
    best: { pick: lowest((c) => c.price), word: "Lowest" },
  },
  { label: "Credential", cell: (c) => c.credential },
  {
    label: "Level",
    cell: (c) => (
      <span className="flex items-center gap-1.5">
        <LevelDots level={c.level} />
        {c.level}
      </span>
    ),
  },
  {
    label: "Time",
    cell: (c) => `${c.weeks} weeks at ${c.hours} hours a week`,
    best: { pick: lowest((c) => c.weeks * c.hours), word: "Shortest" },
  },
  {
    label: "Rating",
    cell: (c) => (
      <span className="flex items-center gap-1">
        <StarSolid className="size-3.5 text-sun-ink" />
        {c.rating}
        <span className="text-muted-foreground">({figure(c.reviews)})</span>
      </span>
    ),
    best: { pick: highest((c) => c.rating), word: "Highest" },
  },
  {
    label: "Learners",
    cell: (c) => figure(c.learners),
    best: { pick: highest((c) => c.learners), word: "Most" },
  },
  { label: "Lessons", cell: (c) => c.lessons },
  { label: "Language", cell: (c) => `${c.language}, subtitles in ${c.subtitles}` },
  {
    label: "Taught by",
    cell: (c) => (
      <Link
        href={teacherHref(c.instructor)}
        className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
      >
        {c.instructor}
        <CheckBadgeIcon aria-hidden="true" className="size-4 text-iris-ink" />
      </Link>
    ),
  },
  { label: "First lesson free", cell: () => <Tick /> },
  { label: "AI tutor in every lesson", cell: () => <Tick /> },
];

function Tick() {
  return (
    <span className="flex items-center gap-1.5">
      <CheckIcon aria-hidden="true" className="size-4 text-iris-ink" strokeWidth={2} />
      Included
    </span>
  );
}

// The title row, which stays at the top of the table as it scrolls.
const stuck = "sticky top-0 z-10 bg-popover pb-5 pt-4 align-top font-normal";

/** The picked courses side by side, one column each, with a small chip on
 *  the value a row plainly favours. A row where every course is equal names
 *  nobody. */
function CompareDialog({
  courses: picked,
  onRemove,
}: {
  courses: Course[];
  onRemove: (id: string) => void;
}) {
  const ready = picked.length >= 2;
  return (
    <Dialog>
      <DialogTrigger
        disabled={!ready}
        render={
          <Button className="shrink-0">
            {ready ? `Compare ${picked.length}` : "Pick one more"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-5xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5 sm:px-8">
          <div>
            <DialogTitle className="text-lg">Compare courses</DialogTitle>
            <DialogDescription className="mt-1">
              {picked.length >= 2
                ? `${picked.length === 2 ? "Two" : "Three"} side by side. A chip marks the value a row favors.`
                : "One left. Pick another from the catalog to set beside it."}
            </DialogDescription>
          </div>
          <DialogCloseButton />
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-auto overscroll-contain px-6 pb-8 sm:px-8">
          {/* Fixed columns, so two courses get two equal halves whatever
              their titles run to, and the photographs come out one size.

              The photographs scroll away and the titles do not: twelve rows
              run past the panel's height, and below the fold the columns had
              lost their names. On a phone the label column gives way to a
              line of its own over each row's values, so the courses keep the
              width between them and the table never scrolls sideways, which
              it did with the labels scrolling off along with it. */}
          <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm sm:min-w-[40rem]">
            <caption className="sr-only">The courses you picked, compared</caption>
            <thead>
              <tr>
                <td className="w-40 max-sm:hidden" />
                {picked.map((c) => (
                  <td key={c.id} className="pr-3 pt-6 align-top sm:pr-6">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
                      <Image src={c.image} alt="" fill sizes="280px" className="object-cover" />
                      <button
                        type="button"
                        onClick={() => onRemove(c.id)}
                        aria-label={`Take ${c.title} out of the comparison`}
                        className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-control bg-card shadow-soft press hover:shadow-soft-lg active:shadow-none after:absolute after:-inset-0.5 after:content-['']"
                      >
                        <XMarkIcon className="size-4" />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="col" className={cn(stuck, "max-sm:hidden")}>
                  <span className="sr-only">Course</span>
                </th>
                {picked.map((c) => (
                  <th key={c.id} scope="col" className={cn(stuck, "pr-3 sm:pr-6")}>
                    <Link
                      href={courseHref(c)}
                      className="block text-base font-medium underline-offset-4 hover:underline"
                    >
                      {c.title}
                    </Link>
                    <span className="mt-1 block text-sm text-muted-foreground">{c.school}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const winner = r.best?.pick(picked);
                return (
                  <Fragment key={r.label}>
                    <tr className="sm:hidden">
                      <th
                        scope="colgroup"
                        colSpan={picked.length}
                        className="border-t pb-1 pt-4 font-normal text-muted-foreground"
                      >
                        {r.label}
                      </th>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="border-t py-4 pr-6 align-top font-normal text-muted-foreground max-sm:hidden"
                      >
                        {r.label}
                      </th>
                      {picked.map((c) => (
                        <td key={c.id} className="pb-4 pr-3 align-top sm:border-t sm:pr-6 sm:pt-4">
                          <span className="flex flex-wrap items-center gap-2">
                            {r.cell(c)}
                            {winner?.id === c.id && (
                              <span className="rounded-control bg-chip px-2 py-0.5 text-xs font-medium text-primary-ink">
                                {r.best!.word}
                              </span>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                );
              })}
              <tr>
                <td className="border-t pt-6 max-sm:hidden" />
                {picked.map((c) => (
                  <td key={c.id} className="border-t pr-3 pt-6 sm:pr-6">
                    <Button variant="outline" render={<Link href={courseHref(c)} />}>
                      View course
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// The toggle's state, read by the cards and rows: whether a course is picked,
// and whether the tray is already full.
export function compareToggle(ids: string[], id: string) {
  return {
    on: ids.includes(id),
    full: ids.length >= COMPARE_MAX,
    toggle: () => toggleCompared(id),
  };
}
