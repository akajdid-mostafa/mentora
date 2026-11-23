import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarAward01Icon, TeachingIcon, WorkHistoryIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { compact, teacherHref, topicTint, type Course } from "@/components/course/courses";
import type { Instructor } from "@/components/course/detail";
import { FollowButton } from "@/components/course-page/follow-button";
import { OtherCourse } from "@/components/course-page/other-course";
import { face } from "@/components/marketing/quotes";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

/** The teacher's face where there is one, and their initials in their
 *  subject's tint where there is not: nobody is given a face that is not
 *  theirs. */
export function Avatar({
  teacher,
  topic,
  size,
}: {
  teacher: Instructor;
  topic: Course["topic"];
  size: "sm" | "lg";
}) {
  const px = size === "sm" ? 44 : 80;
  const tint = topicTint[topic];
  if (teacher.portrait) {
    return (
      <Image
        src={face(teacher.portrait, px * 2)}
        alt=""
        width={px}
        height={px}
        unoptimized
        className={cn("shrink-0 rounded-full object-cover", size === "sm" ? "size-11" : "size-20")}
      />
    );
  }
  const initials = teacher.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading tracking-tight",
        tint.lid,
        tint.ink,
        size === "sm" ? "size-11 text-base" : "size-20 text-xl",
      )}
    >
      {initials}
    </span>
  );
}

/** The teacher, as the reference sets a host's credentials: a card with the
 *  face, the name, the trade and the figures their courses add up to, and
 *  beside it three rows in the teacher's own words (how long and in what,
 *  one thing done, how the course is taught). Under both, Follow and the
 *  full profile as one row of buttons, then two of the teacher's other
 *  courses. */
export function InstructorProfile({ teacher: t, course: c }: { teacher: Instructor; course: Course }) {
  const first = t.name.split(" ")[0];
  // Two of the teacher's other courses, the two the most learners have taken.
  const others = t.courses
    .filter((x) => x.id !== c.id)
    .sort((a, b) => b.learners - a.learners)
    .slice(0, 2);
  const rows = t.credentials
    ? [
        { icon: WorkHistoryIcon, title: t.credentials.years, text: t.credentials.work },
        { icon: StarAward01Icon, title: "Career highlight", text: t.credentials.highlight },
        { icon: TeachingIcon, title: `How ${first} teaches`, text: t.credentials.teaching },
      ]
    : [];
  const stats = [
    { figure: String(t.rating), label: "Rating", star: true },
    { figure: compact.format(t.learners), label: "Learners" },
    { figure: String(t.courses.length), label: t.courses.length === 1 ? "Course" : "Courses" },
  ];

  return (
    <div>
      {/* A 16rem card with the rows beside it from xl, where they keep 396px
          of text, the measure their words are fitted to, and at md while the
          page is one column. Where the rows would be left under 300px, at sm
          and at lg beside the panel, the card stands over them at its own
          size; a phone gives it the full width. The card and its rows are
          one tutor profile, the data of a person the product keeps, so they
          are set at 14px and mark themselves as an object. */}
      <div
        data-object
        className="grid gap-8 md:grid-cols-[16rem_minmax(0,1fr)] md:items-center md:gap-10 lg:grid-cols-1 lg:gap-8 xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-10"
      >
        <div className="flex flex-col items-center rounded-lg bg-card px-5 pt-7 pb-5 text-center shadow-soft sm:max-md:max-w-64 lg:max-xl:max-w-64">
          <span className="relative">
            <Avatar teacher={t} topic={c.topic} size="lg" />
            {/* the badge on the portrait's edge, as the home page's cards
                wear it: a disc the icon's own size, its centre on the
                circle at 45° */}
            <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-card">
              <CheckBadgeIcon aria-hidden="true" className="size-6 text-iris-ink" />
            </span>
          </span>
          <h3 className="mt-3 font-heading text-xl tracking-tight">
            {t.name}
            <span className="sr-only">, verified instructor</span>
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.trade}</p>
          <dl className="mt-5 grid w-full grid-cols-[1fr_1.25fr_1fr] divide-x border-t pt-4 text-left">
            {stats.map((s) => (
              // each figure set to its column's left edge, 12px off the
              // rule before it, the learners' column a quarter wider for a
              // six-character count; the star in ink, as the reviews draw
              // theirs, and held against the figure it belongs to
              <div key={s.label} className="flex flex-col gap-0.5 pl-3 first:pl-0">
                <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
                <dd className="flex items-center gap-0.5 font-heading text-lg tabular-nums">
                  {s.figure}
                  {s.star && <StarSolid aria-hidden="true" className="size-3.5 text-foreground" />}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {rows.length > 0 && (
          <ul className="flex flex-col gap-7">
            {rows.map((r) => (
              <li key={r.title} className="flex gap-4">
                <HugeiconsIcon
                  icon={r.icon}
                  size={28}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{r.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <FollowButton name={t.name} />
        <Link
          href={teacherHref(t.name)}
          className="flex h-10 items-center justify-center gap-2 rounded-control bg-muted px-5 text-sm font-medium press hover:bg-secondary"
        >
          {`Open ${t.name}'s profile`}
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {others.length > 0 && (
        <div className="mt-12">
          <Caps>Also taught by {first}</Caps>
          {/* Side by side only from xl, where a row has 360px and one of the
              twenty-seven titles that can show here runs past one line and
              ends on an ellipsis, as the course cards' titles do; narrower,
              one over the other, so a phone is the only other width that cuts
              one. A teacher with one other course gets the whole row. */}
          <ul className="mt-4 grid gap-4 xl:grid-cols-2">
            {others.map((x) => (
              <li key={x.id} className="xl:only:col-span-2">
                <OtherCourse course={x} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
