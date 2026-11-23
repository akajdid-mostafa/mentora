"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Calendar03Icon, Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  courseSlug,
  figure,
  lessonHref,
  teacherHref,
  type Course,
} from "@/components/course/courses";
import { FollowButton } from "@/components/course-page/follow-button";
import { Stars } from "@/components/course-page/reviews";
import { ShareButton } from "@/components/course-page/share-button";
import { dateLabel } from "@/components/course-page/start";
import { useToday } from "@/components/dashboard/today";
import { float } from "@/components/float";
import { cohortsFor } from "@/components/instructor-page/cohorts";
import type { Entry } from "@/components/instructors/directory";
import type { Profile } from "@/components/instructors/profiles";
import { face, portrait } from "@/components/marketing/quotes";
import { reach } from "@/components/reach";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { JsonLd } from "@/components/site/json-ld";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { Schema } from "@/lib/seo";
import { abs } from "@/lib/site";
import { cn, count } from "@/lib/utils";

// Dates are stored in UTC and printed in it, so the day on the page is the day
// on the record wherever it is read.
const onDay = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const inMonth = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** A list read the way a sentence reads one: "English", "English and
 *  Spanish", "English, Spanish and French". */
const spoken = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/** The profile's opening: who teaches, what learning from them is like, and
 *  Follow; beside it the teacher in the reference's arch, with the four facts
 *  a learner checks first laid over the picture. `today` is the date the page
 *  was sent on; the browser moves it to the visitor's own calendar, as the
 *  course page's start rows do, so the next cohort is the same one there. */
export function ProfileHero({
  entry: e,
  profile: p,
  verified,
  faces,
  today: serverToday,
}: {
  entry: Entry;
  profile: Profile;
  /** The day the badge went on. */
  verified: string;
  /** Three learners' faces from the teacher's reviews. */
  faces: string[];
  today: string;
}) {
  const today = useToday(serverToday);
  const [role, sector] = e.trade.split(" · ");
  const next = cohortsFor(e.courses, today).find((c) => c.left > 0);
  const top = e.courses[0];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
      <JsonLd schema={profileLd(e, p)} />
      <Breadcrumb trail={[{ label: "Instructors", href: "/instructors" }, { label: e.name }]} />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-14 lg:mt-6 lg:grid-cols-[9fr_11fr] lg:items-center lg:gap-10">
        <div>
          <Eyebrow>
            {e.field} · {p.city}
          </Eyebrow>
          <h1 className="mt-5 text-5xl tracking-tighter sm:text-6xl lg:text-7xl">{e.name}</h1>
          {/* the trade as a split-weight line, the role in full ink and where
              it is practised in the muted one */}
          <p className="mt-4 text-base">
            <span className="font-medium">{role}</span>
            {sector && <span className="text-muted-foreground"> · {sector}</span>}
          </p>
          <p className="mt-6 max-w-md text-base text-muted-foreground">{p.lede}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <FollowButton name={e.name} tone="lead" />
            <ShareButton title={`${e.name} on Mentora`} path={teacherHref(e.name)} />
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={Globe02Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
              Teaches in {spoken(e.languages)}
            </li>
            <li className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.6} aria-hidden="true" />
              On Mentora since {inMonth.format(new Date(e.since))}
            </li>
          </ul>
        </div>

        <Art
          entry={e}
          verified={verified}
          faces={faces}
          next={next ? { course: next.course, key: next.key, starts: next.starts, left: next.left } : null}
          top={top}
        />
      </div>
    </section>
  );
}

// A fragment floating on the picture: its own white and the photograph's
// cast rather than one of the page's two shadows.
const overlay = cn(float, "absolute bg-card");

function Art({
  entry: e,
  verified,
  faces,
  next,
  top,
}: {
  entry: Entry;
  verified: string;
  faces: string[];
  next: { course: Course; key: string; starts: string; left: number } | null;
  top: Course;
}) {
  return (
    <div className="relative mx-auto aspect-[2/3] w-full max-w-[37rem] sm:aspect-[20/21]">
      {/* The arch the reference stands its figure in, holding the teacher's
          portrait as it was taken, the face kept in the upper third. A phone
          draws it taller and wider, so the three fragments it keeps have
          room above and below the face, and the cohort and the rating keep
          apart when the course's name takes two lines. */}
      <div className="absolute inset-y-0 left-[10%] right-[12%] overflow-hidden rounded-t-full bg-muted sm:left-[17%] sm:right-[19%]">
        {e.portrait && (
          <Image
            src={portrait(e.portrait, 1200)}
            alt={`Portrait of ${e.name}`}
            fill
            unoptimized
            preload
            sizes="(min-width: 1024px) 420px, 64vw"
            className="object-cover object-[50%_22%]"
          />
        )}
      </div>

      {/* The badge, where the reference's chat pill sits: over the arch's
          left edge, high enough to keep clear of the face. A pill, since its
          disc is round: the box's radius is the disc's plus the 8px round it. */}
      <p
        className={cn(
          overlay,
          "left-0 top-[8%] flex items-center gap-2.5 rounded-lg py-2 pl-2 pr-4 text-sm",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-iris/15">
          <CheckBadgeIcon aria-hidden="true" className="size-5 text-iris-ink" />
        </span>
        <span>
          <span className="font-medium">Verified</span>{" "}
          <span className="text-muted-foreground">{onDay.format(new Date(verified))}</span>
        </span>
      </p>

      {/* The next cohort with a seat left, where the reference's invite sits,
          running off the arch's right edge with its button at the end: a
          secondary button, since Follow is the section's one fill of the
          brand and an ink fill on an action is a second brand. A teacher
          whose courses run at the learner's own pace offers lesson one
          instead, which every course opens free. */}
      <div
        data-object
        className={cn(
          overlay,
          "right-0 top-[60%] flex w-[min(23rem,92%)] items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 sm:top-[62%] sm:pl-2.5",
        )}
      >
        {/* the course's picture from sm; a phone gives its width to the
            course's name */}
        {next ? (
          <Image
            src={next.course.image}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-full object-cover max-sm:hidden"
          />
        ) : (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted max-sm:hidden">
            <PlayIcon aria-hidden="true" className="size-4" />
          </span>
        )}
        {/* The course first, on two lines when it needs them, since it is
            what the cohort is for; the start and the seats left under it. */}
        <p className="min-w-0 flex-1 text-sm">
          <span className="line-clamp-2 font-medium">{next ? next.course.title : top.title}</span>
          {/* under 360px the seats go unnamed, "Oct 12 · 8 left", so the
              line fits the narrowest phone whole */}
          <span className="block truncate text-muted-foreground">
            {next ? (
              <>
                {dateLabel(next.starts)} · {next.left}{" "}
                <span className="max-[359px]:hidden">{next.left === 1 ? "seat" : "seats"} </span>
                left
              </>
            ) : (
              "Lesson one is free"
            )}
          </span>
        </p>
        <Link
          href={
            next ? `/checkout?course=${courseSlug(next.course)}&start=${next.key}` : lessonHref(top)
          }
          // named as the cohort section and the closing band name the same
          // two destinations, so a screen reader hears one action one way
          aria-label={next ? "Reserve a seat" : "Start lesson one"}
          className={cn(
            "flex h-10 shrink-0 items-center rounded-control bg-muted px-4 text-sm font-medium press hover:bg-secondary",
            reach,
          )}
        >
          {next ? "Reserve" : "Start"}
        </Link>
      </div>

      {/* The rating, where the reference's heart-rate card sits, with its
          two sheets under it: the reviews behind the figure. The stars are
          ink, as every rating on a teacher is drawn. */}
      <div className="absolute bottom-[2%] left-[4%] w-44 sm:bottom-[3%] sm:left-[10%]">
        <span aria-hidden="true" className={cn(float, "absolute inset-x-5 -bottom-4 h-full rounded-lg bg-card")} />
        <span aria-hidden="true" className={cn(float, "absolute inset-x-2.5 -bottom-2 h-full rounded-lg bg-card")} />
        {/* On a phone the figure stands beside the stars and the count, so the
            card is one line of type lower and keeps clear of the cohort
            above it; from sm the count runs under the figure and the stars. */}
        <div
          className={cn(
            float,
            "relative grid grid-cols-[auto_1fr] items-center gap-x-2.5 rounded-lg bg-card p-3 sm:p-4",
          )}
        >
          <span className="row-span-2 font-heading text-3xl tabular-nums sm:row-span-1">
            {e.rating.toFixed(1)}
          </span>
          <Stars value={e.rating} size="md" className="self-end sm:self-center" />
          <p className="col-start-2 self-start text-xs text-muted-foreground sm:col-span-2 sm:col-start-1 sm:mt-1">
            {figure(e.reviews)} ratings
          </p>
        </div>
      </div>

      {/* The learners, where the reference's score card sits, with three of
          their faces: raised to the arch's right shoulder, since the
          portrait's face fills the middle of the frame where the reference's
          figure leaves room at its foot, and the cohort under it takes the
          right edge lower down. */}
      <div
        className={cn(
          overlay,
          "right-0 top-[21%] hidden w-44 rounded-lg p-4 sm:block",
        )}
      >
        <p className="font-heading text-3xl tabular-nums">{figure(e.learners)}</p>
        <p className="text-xs text-muted-foreground">
          learners in {count(e.courses.length, "course")}
        </p>
        <span aria-hidden="true" className="mt-3 flex">
          {faces.map((f) => (
            <Image
              key={f}
              src={face(f, 64)}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="-ml-2 size-8 rounded-full object-cover ring-2 ring-card first:ml-0"
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/** The teacher as a search engine reads them, off the rows the page prints:
 *  the name, the job held now, the bio, the face and what their courses
 *  practise. A course page's instructor points at this `@id`. */
function profileLd(e: Entry, p: Profile): Schema {
  const url = abs(teacherHref(e.name));
  return {
    "@type": "ProfilePage",
    "@id": `${url}#page`,
    url,
    mainEntity: {
      "@type": "Person",
      "@id": `${url}#person`,
      name: e.name,
      url,
      jobTitle: p.jobs[2].role,
      description: p.bio,
      ...(e.portrait && { image: portrait(e.portrait, 800) }),
      knowsLanguage: e.languages,
      knowsAbout: [...new Set(e.courses.flatMap((c) => c.skills))].slice(0, 12),
    },
  };
}
