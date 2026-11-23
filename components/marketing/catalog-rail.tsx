"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { CompareTray, compareToggle } from "@/components/catalog/compare";
import { courseData } from "@/components/catalog/state";
import { useCompared } from "@/components/course/compared";
import { CourseCard, glyph } from "@/components/course/course-card";
import { catalogue, courses, type Topic } from "@/components/course/courses";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { usePortalRoot } from "@/components/ui/portal-root";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { whenPressed } from "@/components/ui/selected";
import { cn, slugify } from "@/lib/utils";

// The shelf is the catalogue's first twelve, in the Recommended order the
// catalogue page opens on, so the two agree about which courses lead.
const onShelf = courses.slice(0, 12);

const rail: { label: "All" | Topic; Icon: typeof Squares2X2Icon }[] = [
  { label: "All", Icon: Squares2X2Icon },
  ...(Object.keys(glyph) as Topic[]).map((t) => ({ label: t, Icon: glyph[t] })),
];

// A course card and the shelf's last card share one slot: four abreast from
// sm, and a fixed width on a phone so the next card shows at the edge.
const slot =
  "w-[17rem] shrink-0 snap-start sm:w-[calc((100%-3rem)/4)] sm:min-w-[15rem]";

export function CatalogRail() {
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [ends, setEnds] = useState({ start: true, end: false });
  // The catalogue's compare list, on the shelf's twelve: a course picked here
  // waits in the catalogue's tray too, and the other way round.
  const compare = useCompared();
  const root = usePortalRoot();
  const shelf = useRef<HTMLUListElement>(null);

  const shown = onShelf.filter((c) => topic === "All" || c.topic === topic);
  // the door to the rest of a topic counts from the catalogue's totals
  const more = topic === "All" ? 0 : catalogue[topic] - shown.length;

  // A new filter opens its shelf at the start. This runs after the render
  // rather than in the click, because Chrome re-snaps a changed list to the
  // card it was snapped to, and from All back to a topic that card sits
  // halfway along. Then which way the shelf can still move, so previous and
  // next disable at the ends, read after paint and on every scroll and resize.
  useEffect(() => {
    const el = shelf.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    const measure = () =>
      setEnds({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      });
    const frame = requestAnimationFrame(measure);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [topic]);

  // A page at a time — the width the shelf shows — and the snap lands it on
  // a card's edge.
  const page = (dir: 1 | -1) => {
    const el = shelf.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth, behavior: still ? "auto" : "smooth" });
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading>
          Twelve thousand courses, one <Highlight>filter row</Highlight>
        </SectionHeading>

        <Button
          render={<Link href="/courses" />}
          size="lg"
          className={cn("w-fit px-5", reach)}
        >
          Browse courses
          <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
        </Button>
      </div>

      {/* The topic row, with the shelf's own previous and next at its end:
          the scrollbar is hidden and a mouse wheel moves the page, not the
          shelf, so without them a mouse never reaches the fifth card. The
          pills scroll on a phone and wrap from sm, where they stop clipping;
          on a phone their 4px of padding is room for the focus ring the
          scroller would otherwise cut off top and bottom. */}
      <div className="mt-8 flex items-center gap-4">
        <ul className="no-scrollbar -mx-6 -my-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-6 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {rail.map((r) => (
            <li key={r.label}>
              <button
                type="button"
                aria-pressed={topic === r.label}
                aria-controls="catalog-shelf"
                onClick={() => setTopic(r.label)}
                className={cn(
                  "press flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-control px-4 text-sm",
                  "bg-card ring-1 ring-inset ring-border hover:bg-accent",
                  whenPressed,
                  "aria-pressed:hover:bg-accent",
                  reach,
                )}
              >
                <r.Icon className="size-4 shrink-0" />
                {r.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous courses"
            aria-controls="catalog-shelf"
            disabled={ends.start}
            onClick={() => page(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next courses"
            aria-controls="catalog-shelf"
            disabled={ends.end}
            onClick={() => page(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* the rail: four abreast, the rest running off the right edge. A
          scroller clips on both axes, so its padding is room for a lifted
          card's shadow — 48px under, 10 beside from sm, the widest that room
          goes before the next card's own shadow shows at the clip — and the
          margins take that room back out of the layout. scroll-px holds the
          snap to the column's edge; without it a mandatory snap lines a card
          up with the padding's outer edge, which on a phone is the glass */}
      <ul
        id="catalog-shelf"
        ref={shelf}
        aria-label="Courses"
        className="no-scrollbar -mx-6 -mb-10 mt-3 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-12 pt-3 sm:-mx-2.5 sm:scroll-px-2.5 sm:px-2.5"
      >
        {shown.map((c) => (
          <li key={c.id} className={slot} {...courseData(c)}>
            <CourseCard course={c} compare={compareToggle(compare, c.id)} />
          </li>
        ))}

        {/* A topic leaves three cards on a shelf of four, so the slot after
            them is the door to the rest of that topic, as the instructor
            row's is to the rest of a field: a card's size, where the next
            course would stand. */}
        {more > 0 && topic !== "All" && (
          <li className={slot}>
            <div className="flex h-full flex-col justify-between gap-10 rounded-lg bg-accent p-6">
              <div>
                <p className="font-heading text-5xl tracking-tighter tabular-nums text-primary-ink">
                  {more.toLocaleString("en-US")}
                </p>
                {/* The label holds the topic's name and stays one line for
                    all four; the sentence holds none, so it breaks the same
                    way whichever topic is picked. */}
                <p className="mt-3 text-base font-medium">more {topic} courses</p>
                <p className="mt-1 text-base text-muted-foreground">
                  The catalog sorts, searches and narrows them with seven
                  filters.
                </p>
              </div>
              <Button
                className="w-fit"
                render={<Link href={`/courses?topic=${slugify(topic)}`} />}
              >
                Browse all {catalogue[topic].toLocaleString("en-US")}
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </li>
        )}
      </ul>

      <p aria-live="polite" className="sr-only">
        {topic !== "All"
          ? `Showing ${shown.length} of ${onShelf.length} courses.`
          : `Showing all ${onShelf.length} courses.`}
      </p>

      {/* The tray mounts beside the page rather than inside this row: the
          reveal round the row rises on a transform, and while it does, a
          fixed tray pins to the row instead of the screen. */}
      {root && createPortal(<CompareTray />, root)}
    </section>
  );
}
