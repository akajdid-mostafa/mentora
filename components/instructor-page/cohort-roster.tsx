"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { CalendarAdd01Icon, Link01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { focus } from "@/components/course/course-card";
import {
  courseHref,
  courseSlug,
  lessonHref,
  priceLabel,
  teacherHref,
  type Course,
} from "@/components/course/courses";
import { FollowButton } from "@/components/course-page/follow-button";
import { dateLabel, dayLabel, finishAt } from "@/components/course-page/start";
import { useToday } from "@/components/dashboard/today";
import { float } from "@/components/float";
import { cohortsFor } from "@/components/instructor-page/cohorts";
import { toggleWaitlist, useWaitlist } from "@/components/instructor-page/waitlist";
import { download } from "@/components/learn/transcript";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { whenSelected } from "@/components/ui/selected";
import { cn, icsText } from "@/lib/utils";

/** A way to start one of the teacher's courses: a cohort on its Monday, or,
 *  for a teacher whose courses are all too short for one, the course at the
 *  learner's own pace from today. */
type Start =
  | { kind: "cohort"; id: string; course: Course; key: string; starts: string; ends: string; left: number }
  | { kind: "self"; id: string; course: Course };

const SEATS = 30;

// A finish date in another year than its start prints its year; the two in
// one year read forward from the start without it.
const withYear = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const untilLabel = (starts: string, ends: string) =>
  starts.slice(0, 4) === ends.slice(0, 4) ? dayLabel(ends) : withYear.format(new Date(`${ends}T12:00:00Z`));
// The same for a self-paced finish, counted from today: "Nov 20", or
// "Jan 15, 2027" once it falls in the next year.
const dayYear = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const aroundLabel = (key: string, today: string) =>
  key.slice(0, 4) === today.slice(0, 4) ? dateLabel(key) : dayYear.format(new Date(`${key}T12:00:00Z`));

const never = () => () => {};
const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** The cohorts the teacher runs in the weeks ahead, picked one at a time from
 *  the rows at the right: the picked one's course photograph at the left, and
 *  over its corner what a learner needs to take a seat. `today` is the date
 *  the page was sent on; the browser moves it to the visitor's calendar, as
 *  the course page's start rows do, so the two pages list the same days. */
export function CohortRoster({
  name,
  courses,
  today: serverToday,
}: {
  name: string;
  courses: Course[];
  today: string;
}) {
  const today = useToday(serverToday);
  const waitlist = useWaitlist();
  const first = name.split(" ")[0];
  const cohorts = cohortsFor(courses, today);
  const starts: Start[] = cohorts.length
    ? cohorts.map((c) => ({
        kind: "cohort",
        id: `${c.course.id}:${c.key}`,
        course: c.course,
        key: c.key,
        starts: c.starts,
        ends: c.ends,
        left: c.left,
      }))
    : courses.map((course) => ({ kind: "self", id: course.id, course }));

  // The first cohort with a seat left opens picked, since the full one before
  // it is the one a visitor can do least with. A shared link names its cohort
  // in the address, and the section opens on that one instead; the server has
  // no address to read, so it renders the default and the browser moves on.
  const firstOpen = starts.find((s) => s.kind === "self" || s.left > 0) ?? starts[0];
  const asked = useSyncExternalStore(
    never,
    () => new URLSearchParams(window.location.search).get("cohort"),
    () => null,
  );
  const [pickedId, setPickedId] = useState<string | null>(null);
  const picked = starts.find((s) => s.id === (pickedId ?? asked)) ?? firstOpen;

  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const detail = useRef<HTMLDivElement>(null);
  const pick = (i: number, moveFocus = false) => {
    setPickedId(starts[i].id);
    if (moveFocus) tabs.current[i]?.focus();
    // Under lg the detail stands over the rows; a pick whose card is off the
    // screen, or under the sticky header, brings the card back into view.
    // No behaviour is passed, so the page's own scroll-behavior decides, and
    // a visitor who asks for less motion gets a jump.
    const card = detail.current?.querySelector<HTMLElement>("[data-cohort-card]");
    const box = card?.getBoundingClientRect();
    const under = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
    if (card && box && window.innerWidth < 1024 && (box.top < under || box.bottom > window.innerHeight)) {
      card.scrollIntoView({ block: "nearest" });
    }
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % starts.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i - 1 + starts.length) % starts.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? starts.length - 1
              : -1;
    if (to < 0) return;
    e.preventDefault();
    pick(to, true);
  };

  // Both ledes are fitted to the last-line rule at 1280 with every teacher's
  // name in them, in a column that holds 45–75 characters a line.
  const longest = Math.max(...courses.map((c) => c.weeks));
  const head = cohorts.length
    ? {
        heading: `Learn with ${first} in a live cohort`,
        lede: `Thirty learners start on the same Monday, bring the week's work to a live review with ${first} each Thursday, and finish together on a Friday you can see before you book your seat.`,
      }
    : {
        heading: `${first}'s courses run at your own pace`,
        lede: `Each course runs ${words[longest] ?? longest} weeks or less, too short for a cohort to find its rhythm. You can start any of them today, and follow ${first} to hear when a longer one opens with a cohort.`,
      };

  if (!picked) return null;

  return (
    <section id="cohorts" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>{cohorts.length ? "Cohorts" : "Start today"}</Eyebrow>
      <SectionHeading className="mt-5">{head.heading}</SectionHeading>
      <p className="mt-6 max-w-[30rem] text-base text-muted-foreground">{head.lede}</p>

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-2 lg:gap-10">
        <Detail start={picked} name={name} today={today} ref={detail} />

        {/* The rows, as the reference's roster: a date where a name stands
            and the course where the role stands, one line each on a
            hairline. They are tabs, since each one changes the panel beside
            them; the arrow keys walk them. */}
        <div className="self-start">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label={cohorts.length ? `${first}'s cohorts` : `${first}'s courses`}
            className="flex flex-col"
          >
            {starts.map((s, i) => {
              const on = s.id === picked.id;
              const full = s.kind === "cohort" && s.left === 0;
              const few = s.kind === "cohort" && s.left > 0 && s.left <= 10;
              // a full cohort the visitor is waiting on says so on its row
              const waiting = full && waitlist.includes(s.id);
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`cohort-tab-${s.id}`}
                  aria-selected={on}
                  aria-controls="cohort-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "relative flex w-full items-center gap-4 rounded-sm px-4 py-4 text-left transition-[background-color,box-shadow] sm:px-6 sm:py-5",
                    // At 320 the three cells left the title under 60px and
                    // cut it mid-word; there the date and the seats share the
                    // first line and the title takes the second whole.
                    "max-[359px]:flex-wrap max-[359px]:gap-y-1",
                    // The hairlines are drawn apart from the row, over each
                    // one and under the last, so the row's corners never
                    // bend them. A row that is picked or under the pointer
                    // stands on its own, and the lines at its two edges
                    // step aside for it.
                    "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border before:transition-opacity",
                    "last:after:absolute last:after:inset-x-0 last:after:bottom-0 last:after:h-px last:after:bg-border last:after:transition-opacity",
                    // (the line under is the last row's alone: on any other
                    // row an ::after would join the flex row and take a gap)
                    "hover:before:opacity-0 aria-selected:before:opacity-0 last:hover:after:opacity-0 last:aria-selected:after:opacity-0",
                    "[button:hover+&]:before:opacity-0 [[aria-selected=true]+&]:before:opacity-0",
                    "hover:bg-accent active:bg-muted",
                    whenSelected,
                    "aria-selected:hover:bg-accent aria-selected:active:bg-muted",
                  )}
                >
                  <span className="w-32 shrink-0 text-sm max-[359px]:w-auto max-[359px]:flex-1 sm:w-40 sm:text-base">
                    {s.kind === "cohort" ? (
                      <>
                        <span className={cn("tabular-nums", full ? "text-muted-foreground" : "font-medium")}>
                          {dateLabel(s.starts)}
                        </span>
                        <span className="tabular-nums text-muted-foreground"> – {dateLabel(s.ends)}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">Any day</span>
                        <span className="text-muted-foreground"> · {s.course.weeks} weeks</span>
                      </>
                    )}
                  </span>
                  {/* two lines on a phone, where one cut most titles short */}
                  <span className="line-clamp-2 min-w-0 flex-1 text-sm text-muted-foreground max-[359px]:order-last max-[359px]:basis-full sm:truncate">
                    {s.course.title}
                  </span>
                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1 text-sm tabular-nums",
                      few ? "text-coral-ink" : waiting ? "text-primary-ink" : "text-muted-foreground",
                    )}
                  >
                    {waiting && <CheckIcon aria-hidden="true" className="size-4" />}
                    {s.kind === "self"
                      ? priceLabel(s.course.price)
                      : waiting
                        ? "Waitlisted"
                        : full
                          ? "Full"
                          : `${s.left} left`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* What Follow does for a learner waiting on a date, in the words
              the directory's FAQ uses for it, and Follow itself. */}
          <div className="mt-6 flex flex-col items-start gap-4 rounded-lg bg-accent p-5 sm:p-6">
            <p className="text-base text-muted-foreground">
              {cohorts.length
                ? `Follow ${first}, and the next cohort lands at the top of your dashboard.`
                : `Follow ${first}, and you get one email when a new course opens.`}
            </p>
            <FollowButton name={name} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** The picked start: its course's photograph, and over the photograph's
 *  corner a card with the dates, the seats and the way in. */
function Detail({
  start: s,
  name,
  today,
  ref,
}: {
  start: Start;
  name: string;
  today: string;
  ref: Ref<HTMLDivElement>;
}) {
  const c = s.course;
  const waitlist = useWaitlist();
  // The start whose link was copied, so picking another in the two seconds
  // after does not show the tick on a link that was never copied.
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copied = copiedId === s.id;
  useEffect(() => {
    if (!copiedId) return;
    const t = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(t);
  }, [copiedId]);

  const full = s.kind === "cohort" && s.left === 0;
  const waiting = waitlist.includes(s.id);
  const finish = s.kind === "self" ? finishAt(c, today, c.hours) : null;

  const copy = async () => {
    const url = new URL(`${teacherHref(name)}?cohort=${encodeURIComponent(s.id)}#cohorts`, window.location.origin);
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopiedId(s.id);
    } catch {
      // a blocked clipboard leaves the button as it was rather than claiming a copy
    }
  };

  const calendar = () => {
    if (s.kind !== "cohort") return;
    const day = (key: string) => key.replaceAll("-", "");
    const next = new Date(`${s.starts}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const url = new URL(courseHref(c), window.location.origin).toString();
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mentora//Cohorts//EN",
      "BEGIN:VEVENT",
      `UID:${c.id}-${s.key}@mentora`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day(s.starts)}`,
      `DTEND;VALUE=DATE:${day(next.toISOString().slice(0, 10))}`,
      `SUMMARY:${icsText(`${c.title}: the cohort starts`)}`,
      `DESCRIPTION:${icsText(`Live reviews with ${name} each Thursday until ${untilLabel(s.starts, s.ends)}.`)}`,
      `URL:${url}`,
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    download(`${courseSlug(c)}-cohort-${s.key}.ics`, ics, "text/calendar");
  };

  return (
    <div
      ref={ref}
      role="tabpanel"
      id="cohort-panel"
      aria-labelledby={`cohort-tab-${s.id}`}
      className="relative pb-6 sm:pb-0 lg:min-h-[28rem]"
    >
      {/* the photograph, standing in the column's lower right as the
          reference's portrait does, so the card can lap its corner; from lg
          it starts a short step under the card's top and runs to the foot
          of the rows beside it */}
      <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-lg bg-muted sm:mt-24 sm:w-[72%] lg:absolute lg:bottom-0 lg:right-0 lg:top-8 lg:mt-0 lg:aspect-auto">
        <Image
          key={c.id}
          src={c.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 423px, (min-width: 1024px) calc(36vw - 38px), (min-width: 640px) calc(72vw - 46px), calc(87vw - 37px)"
          className={cn("object-cover", c.focus && focus[c.focus])}
        />
      </div>

      <div
        className={cn(
          float,
          "relative -mt-28 w-[min(24rem,94%)] rounded-lg bg-card p-5 sm:absolute sm:left-0 sm:top-0 sm:mt-0 sm:p-6",
        )}
        data-cohort-card
      >
        <Caps>{s.kind === "cohort" ? "Live cohort" : "At your own pace"}</Caps>
        {/* a phone holds two lines for the title whatever it runs to, so
            the card keeps its height from one row to the next */}
        <h3 className="mt-3 text-2xl tracking-tight max-sm:line-clamp-2 max-sm:min-h-[2lh]">
          <Link
            href={courseHref(c)}
            className={cn("underline-offset-4 transition-colors hover:text-muted-foreground hover:underline", reach)}
          >
            {c.title}
          </Link>
        </h3>
        {s.kind === "cohort" ? (
          <p className="mt-2 text-base">
            <span className="font-medium">{dayLabel(s.starts)}</span>
            <span className="text-muted-foreground"> to {untilLabel(s.starts, s.ends)}</span>
          </p>
        ) : (
          <p className="mt-2 text-base">
            <span className="font-medium">Start today</span>
            <span className="text-muted-foreground"> and finish around {finish && aroundLabel(finish.key, today)}</span>
          </p>
        )}
        {/* the length and the price, then the rhythm: two short lines that
            fit the narrowest phone whole */}
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="block">
            {c.weeks} weeks · {priceLabel(c.price)}
          </span>
          <span className="block">
            {s.kind === "cohort" ? "A live review each Thursday" : `${c.hours} hours a week`}
          </span>
        </p>

        {s.kind === "cohort" && (
          <div className="mt-5">
            {/* thirty seats, one mark each: the ones still open in the brand,
                the taken ones pale, so the row reads as how full it is */}
            <span aria-hidden="true" className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
              {Array.from({ length: SEATS }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "aspect-square rounded-[3px]",
                    i >= SEATS - s.left ? "bg-primary" : "bg-foreground/10",
                  )}
                />
              ))}
            </span>
            <p className="mt-2 text-sm">
              {full ? (
                <span className="text-muted-foreground">All {SEATS} seats taken</span>
              ) : (
                <>
                  <span className="font-medium tabular-nums">{s.left}</span>
                  <span className="text-muted-foreground"> of {SEATS} seats left</span>
                </>
              )}
            </p>
          </div>
        )}

        {/* The action takes the row and the two round buttons ride its end;
            a card too narrow for the three drops the round ones under it
            rather than breaking the action's words. */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {s.kind === "self" ? (
            <Button render={<Link href={lessonHref(c)} />} className="min-w-36 flex-1">
              Start lesson one
            </Button>
          ) : full ? (
            // A full cohort offers its waitlist, a toggle that keeps its
            // state; it takes the brand's fill only while it is the offer.
            <button
              type="button"
              aria-pressed={waiting}
              onClick={() => toggleWaitlist(s.id)}
              className={cn(
                "flex h-10 min-w-36 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-control px-5 text-sm font-medium press",
                "aria-pressed:bg-muted aria-pressed:hover:bg-secondary not-aria-pressed:bg-primary not-aria-pressed:text-primary-foreground not-aria-pressed:hover:bg-primary/80",
              )}
            >
              {waiting && <CheckIcon aria-hidden="true" className="size-4" />}
              {waiting ? "On the waitlist" : "Join the waitlist"}
            </button>
          ) : (
            <Button render={<Link href={`/checkout?course=${courseSlug(c)}&start=${s.key}`} />} className="min-w-36 flex-1">
              Reserve a seat
            </Button>
          )}
          {s.kind === "cohort" && (
            <IconButton label={`Add the ${c.title} cohort to your calendar`} onClick={calendar}>
              <HugeiconsIcon icon={CalendarAdd01Icon} size={18} strokeWidth={1.6} />
            </IconButton>
          )}
          <IconButton
            label={copied ? "Link copied" : `Copy a link to this ${s.kind === "self" ? "course" : "cohort"}`}
            onClick={copy}
          >
            {copied ? (
              <CheckIcon className="size-4 text-iris-ink" />
            ) : (
              <HugeiconsIcon icon={Link01Icon} size={18} strokeWidth={1.6} />
            )}
          </IconButton>
        </div>
        {/* What the buttons did: the waitlist's promise while it holds, in
            view, and the copy, said to a screen reader. The live region is
            there from the start, so what arrives in it is announced. */}
        {full && waiting && (
          <p className="mt-3 text-sm text-muted-foreground">We&apos;ll email you if a seat opens.</p>
        )}
        <p aria-live="polite" className="sr-only">
          {copied ? "Link copied" : full && waiting ? "On the waitlist" : ""}
        </p>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
