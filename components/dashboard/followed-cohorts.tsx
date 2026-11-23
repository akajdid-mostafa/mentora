"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { courseSlug, courses, teacherHref, teacherOf } from "@/components/course/courses";
import { useFollowing } from "@/components/course/following";
import { dayLabel } from "@/components/course-page/start";
import { dashCopy } from "@/components/dashboard/copy";
import { cohortsFor } from "@/components/instructor-page/cohorts";
import { face } from "@/components/marketing/quotes";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

const copy = dashCopy.followed;

/** The soonest open cohort among the teachers the learner follows, at the top
 *  of the dashboard, with a way to reserve it: what Follow promises on the
 *  instructors pages. Nothing followed, or nothing coming, and it is not there
 *  at all. Follow lives in the browser, so the line arrives with it. */
export function FollowedCohorts({ today, className }: { today: string; className?: string }) {
  const following = useFollowing();
  const coming = cohortsFor(
    courses.filter((c) => following.includes(c.instructor)),
    today,
  ).filter((x) => x.left > 0);
  if (!coming.length) return null;

  const next = coming[0];
  const teacher = teacherOf(next.course);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg bg-accent p-3 sm:flex-row sm:items-center sm:gap-5 sm:pr-3",
        className,
      )}
    >
      <Link href={teacherHref(teacher.name)} className="flex min-w-0 flex-1 items-center gap-3.5 rounded-sm">
        {teacher.portrait && (
          <Image
            src={face(teacher.portrait, 96)}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover"
          />
        )}
        <span className="min-w-0">
          <Caps as="span" className="block">
            {copy.label}
            {coming.length > 1 && <span className="text-foreground"> · {copy.more(coming.length - 1)}</span>}
          </Caps>
          <span className="mt-1 block text-sm">
            {copy.line(teacher.name, next.course.title, dayLabel(next.starts))}{" "}
            <span className="whitespace-nowrap tabular-nums text-muted-foreground">
              {copy.seats(next.left, next.seats)}
            </span>
          </span>
        </span>
      </Link>
      <Link
        href={`/checkout?course=${courseSlug(next.course)}&start=${next.key}`}
        className="group/go inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-control bg-card px-4 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none"
      >
        {copy.reserve}
        <ArrowRightIcon className="size-4 transition-transform group-hover/go:translate-x-0.5" />
      </Link>
    </div>
  );
}
