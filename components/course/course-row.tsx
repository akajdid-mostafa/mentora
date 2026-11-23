"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckBadgeIcon,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";
import {
  BookOpen01Icon,
  Clock01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CompareButton,
  focus,
  glyph,
  LevelDots,
  SaveButton,
  type CompareToggle,
} from "@/components/course/course-card";
import {
  courseHref,
  figure,
  priceLabel,
  teacherHref,
  topicTint,
  type Course,
} from "@/components/course/courses";
import { recordView } from "@/components/course/recent";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

/** One course as a wide row: the card's photograph at the left, and at the
 *  right what a grid card has no room for — who teaches it, what a learner
 *  leaves able to do, and the weeks, lessons and language, the three things
 *  two courses on one subject differ on most. The title is the link, and its
 *  overlay makes the whole row open the course; the teacher's name, Save and
 *  Compare stand above it. */
export function CourseRow({
  course: c,
  compare,
}: {
  course: Course;
  compare?: CompareToggle;
}) {
  const Glyph = glyph[c.topic];
  const tint = topicTint[c.topic];
  const specs = [
    { icon: Clock01Icon, text: `${c.weeks} weeks, ${c.hours} hours a week` },
    { icon: BookOpen01Icon, text: `${c.lessons} lessons` },
    { icon: Globe02Icon, text: `${c.language}, subtitles in ${c.subtitles}` },
  ];

  return (
    <article
      data-object
      className="group/card relative flex flex-col rounded-lg bg-card p-2 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg sm:flex-row"
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted sm:aspect-auto sm:min-h-56 sm:w-64 lg:w-80">
        <Image
          src={c.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 100vw"
          className={cn(
            "object-cover transition-transform duration-lean ease-lean motion-safe:group-has-[[data-card-link]:hover]/card:[transform:scale(1.04)] motion-safe:group-has-[[data-card-link]:active]/card:[transform:scale(1)] group-has-[[data-card-link]:active]/card:duration-answer",
            c.focus && focus[c.focus],
          )}
        />
        {c.badge && (
          <span className="absolute left-3 top-3 rounded-control bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] px-2.5 py-1 text-xs font-medium text-primary-ink shadow-soft">
            {c.badge}
          </span>
        )}
        {compare && (
          <CompareButton
            course={c}
            compare={compare}
            className="absolute right-3 top-3"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-3 pb-3 pt-4 sm:px-6 sm:pt-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
              tint.lid,
              tint.ink,
            )}
          >
            <Glyph className="size-3.5" />
            {c.topic}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <LevelDots level={c.level} />
            {c.level}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-medium">
          <Link
            href={courseHref(c)}
            onClick={() => recordView(c.id)}
            data-card-link
            className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
          >
            {c.title}
          </Link>
        </h3>

        {/* The school and credential, then the teacher: a name a reader can
            follow to the person before they pay, which is the reason a row
            has more lines than a card. */}
        <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
          <span>
            {c.school} · {c.credential} · with
          </span>
          <Link
            href={teacherHref(c.instructor)}
            className={cn(
              "press relative z-10 inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline",
              reach,
            )}
          >
            {c.instructor}
            <CheckBadgeIcon
              aria-hidden="true"
              className="size-4 text-iris-ink"
            />
            <span className="sr-only">, verified instructor</span>
          </Link>
        </p>

        <p className="mt-3 max-w-xl text-sm">{c.outcome}</p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {specs.map((s) => (
            <li key={s.text} className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={s.icon}
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              {s.text}
            </li>
          ))}
        </ul>

        {/* The foot stands at the row's bottom edge when the photograph
            makes the row taller than its copy, and 20px under the specs
            when it does not. */}
        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t pt-4">
            <p className="flex items-center gap-4 text-sm">
              <span>
                <span className="tabular-nums">{figure(c.learners)}</span>{" "}
                <span className="text-muted-foreground">learners</span>
              </span>
              <span className="flex items-center gap-1">
                <StarSolid className="size-3.5 text-sun-ink" />
                <span className="sr-only">Rated </span>
                <span className="tabular-nums">{c.rating}</span>
                <span className="tabular-nums text-muted-foreground">
                  ({figure(c.reviews)})
                </span>
              </span>
            </p>
            <div className="flex items-center gap-3">
              <span className="font-heading text-xl tracking-tight tabular-nums">
                {priceLabel(c.price)}
              </span>
              <SaveButton course={c} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
