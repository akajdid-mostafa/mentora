"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CourseCard } from "@/components/course/course-card";
import type { Course } from "@/components/course/courses";
import { Button } from "@/components/ui/button";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { useRail } from "@/components/ui/use-rail";

// The home shelf's slot: four abreast from sm, a fixed width on a phone so
// the next card shows at the edge and says there are more.
const slot = "w-[17rem] shrink-0 snap-start sm:w-[calc((100%-3rem)/4)] sm:min-w-[15rem]";

/** Where to go after this course: eight from the same subject and the skills
 *  it shares, on the home shelf's rail, with the reference's two arrows at
 *  the heading's end. */
export function RelatedRail({ courses }: { courses: Course[] }) {
  const { ref: shelf, ends, page } = useRail<HTMLUListElement>();

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <SectionHeading>
          Where to go <Highlight>after this one</Highlight>
        </SectionHeading>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon"
            focusableWhenDisabled
            aria-label="Previous courses"
            aria-controls="related-shelf"
            disabled={ends.start}
            onClick={() => page(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            focusableWhenDisabled
            aria-label="Next courses"
            aria-controls="related-shelf"
            disabled={ends.end}
            onClick={() => page(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* The home shelf's rail and its reasons: the padding is room for a
          lifted card's shadow, the margins take it back out of the layout,
          and scroll-px holds the snap to the column's edge. */}
      <ul
        id="related-shelf"
        ref={shelf}
        aria-label="Courses to take next"
        className="no-scrollbar -mx-6 -mb-10 mt-7 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-12 pt-3 sm:-mx-2.5 sm:scroll-px-2.5 sm:px-2.5"
      >
        {courses.map((c) => (
          <li key={c.id} className={slot}>
            <CourseCard course={c} star="ink" />
          </li>
        ))}
      </ul>
    </section>
  );
}
