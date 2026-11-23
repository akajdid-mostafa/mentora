"use client";

import { useLayoutEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { topics, type Topic } from "@/components/course/courses";
import { glyph } from "@/components/course/glyph";
import { roster } from "@/components/instructors/directory";
import { InstructorCard, TeachCard } from "@/components/instructors/instructor-card";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTriggerInline,
  SelectValue,
} from "@/components/ui/select";
import { useRail } from "@/components/ui/use-rail";
import { cn } from "@/lib/utils";

type Field = Topic | "every";

// The directory's slot: four abreast from lg, two from sm, and a fixed width
// on a phone so the next card shows at the edge and says there are more.
const slot = "w-[17rem] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]";

/** The next teachers to read about: the ones in this teacher's field, most
 *  learners first, and the field itself a word in the heading that opens a
 *  list, as the reference's heading does, so a visitor can walk into any
 *  other field from here. The directory's door closes the rail. */
export function MoreInstructors({ name, field: own }: { name: string; field: Topic }) {
  const [field, setField] = useState<Field>(own);
  const { ref, ends, none, page } = useRail<HTMLUListElement>();
  // A new field opens its list at the start. The rail snaps, and a snapped
  // rail follows the card it held into the new list, where that card may
  // stand in the middle with the field's first teachers hidden before it.
  useLayoutEffect(() => {
    ref.current?.scrollTo({ left: 0 });
  }, [field, ref]);

  const others = roster.filter((e) => e.name !== name);
  const shown = others
    .filter((e) => field === "every" || e.field === field)
    .sort((a, b) => b.learners - a.learners);
  const options: { value: Field; label: string; count: number }[] = [
    ...topics.map((t) => ({ value: t, label: t, count: others.filter((e) => e.field === t).length })),
    { value: "every", label: "every field", count: others.length },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow>Keep comparing</Eyebrow>
          <SectionHeading className="mt-5">
            More instructors in{" "}
            <Select
              items={options.map((o) => ({ value: o.value, label: o.label }))}
              value={field}
              onValueChange={(v) => setField(v as Field)}
            >
              {/* The field is a word of the heading, in the heading's one ink:
                  select.tsx's inline trigger, and the list
                  opens on it. */}
              <SelectTriggerInline aria-label="Field">
                <SelectValue />
              </SelectTriggerInline>
              <SelectContent label="Field" className="min-w-56">
                <SelectGroup>
                  <SelectLabel className="flex justify-between gap-4 pr-8">
                    <span>Field</span>
                    <span aria-hidden="true">Instructors</span>
                  </SelectLabel>
                  {options.map((o) => {
                    // every row carries a glyph, so the five names share an edge
                    const Icon = o.value === "every" ? Squares2X2Icon : glyph[o.value];
                    return (
                      <SelectItem
                        key={o.value}
                        value={o.value}
                        disabled={o.count === 0 && o.value !== field}
                        trailing={
                          <span className="ml-auto pl-2 tabular-nums text-muted-foreground">
                            {o.count}
                            <span className="sr-only"> instructors</span>
                          </span>
                        }
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="size-4 text-muted-foreground" />
                          {o.value === "every" ? "Every field" : o.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </SectionHeading>
        </div>
        <div className={cn("hidden shrink-0 gap-2", !none && "sm:flex")}>
          {/* focusable while disabled, so the arrow that has just reached
              an end keeps the focus the keyboard put on it */}
          <Button
            variant="outline"
            size="icon"
            focusableWhenDisabled
            aria-label="Previous instructors"
            aria-controls="more-instructors"
            disabled={ends.start}
            onClick={() => page(-1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            focusableWhenDisabled
            aria-label="Next instructors"
            aria-controls="more-instructors"
            disabled={ends.end}
            onClick={() => page(1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* The related rail's reasons: the padding is room for a lifted card's
          shadow, the margins take it back out of the layout, and scroll-px
          holds the snap to the column's edge. */}
      <ul
        id="more-instructors"
        ref={ref}
        aria-label={field === "every" ? "Instructors in every field" : `${field} instructors`}
        className="no-scrollbar -mx-6 -mb-10 mt-7 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-12 pt-3 sm:-mx-2.5 sm:scroll-px-2.5 sm:px-2.5"
      >
        {shown.map((e) => (
          <li key={e.name} className={slot}>
            <InstructorCard
              entry={e}
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 230px, (min-width: 640px) 45vw, 272px"
            />
          </li>
        ))}
        <li className={slot}>
          <TeachCard />
        </li>
      </ul>
    </section>
  );
}
