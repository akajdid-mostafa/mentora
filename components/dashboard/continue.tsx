"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { FireIcon, MinusSignIcon, PlusSignIcon, Quiz01Icon, Task01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { focus } from "@/components/course/course-card";
import { courseById, courseHref, lessonHref, playerHref, type Course, type Topic } from "@/components/course/courses";
import type { CoursePack, Line } from "@/components/course/lessons/types";
import { useProgress } from "@/components/course/progress";
import { lastWeek, streakOf, useStudyLog, type Day, type Streak } from "@/components/course/study";
import { dashCopy, dayOf, span } from "@/components/dashboard/copy";
import { learner } from "@/components/dashboard/learner";
import { legStanding, pathOf } from "@/components/dashboard/path";
import { inProgress, type Lines, type Shelf, type Standing } from "@/components/dashboard/shelf";
import { useToday } from "@/components/dashboard/today";
import { float } from "@/components/float";
import { clock } from "@/components/learn/copy";
import { Glyph } from "@/components/learn/lesson-toc";
import type { Goal } from "@/components/marketing/goals";
import { planOf, type Plan } from "@/components/paths/plan";
import { PACE, setPace, usePathChoices } from "@/components/paths/store";
import { reach } from "@/components/reach";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { FollowedCohorts } from "@/components/dashboard/followed-cohorts";
import { Eyebrow } from "@/components/ui/eyebrow";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const copy = dashCopy.continue;
const weekCopy = dashCopy.week;

/** Where the learner stopped, as the lede says it. */
function whereOf(s: Standing) {
  const i = s.current;
  if (i.kind === "quiz") return copy.where.quiz(s.module + 1);
  if (i.kind === "project") return copy.where.project;
  return s.at > 0 ? copy.where.video(clock(s.at), i.id) : copy.where.start(i.id);
}

export function ContinueLearning({ shelf, lines, today: serverToday }: { shelf: Shelf; lines: Lines; today: string }) {
  const p = useProgress();
  const today = useToday(serverToday);
  const log = useStudyLog();
  const choices = usePathChoices();
  const going = inProgress(p, shelf);
  const [picked, setPicked] = useState<string | null>(null);
  const open = going.find((g) => g.id === picked) ?? going[0];

  const goal = choices.pace * 60;
  const week = lastWeek(log, today);
  const studied = week.reduce((n, d) => n + d.minutes, 0);
  const streak = streakOf(log, today, goal);
  const g = pathOf(p, choices);
  const plan = g && planOf(g, legStanding(g, p, shelf), choices.known[g.id] ?? [], choices.pace, today);
  const latest = going[0];

  const panel = (
    <WeekPanel
      week={week}
      studied={studied}
      goal={goal}
      pace={choices.pace}
      streak={streak}
      today={today}
      path={g && plan ? { goal: g, plan } : null}
    />
  );

  return (
    <section aria-labelledby="dash-title" className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <h1 id="dash-title" className="mt-5 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
        {copy.title(learner.first)}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground">
        {latest && (
          <span className="sm:block">
            {copy.stopped(whereOf(latest.standing), (courseById(latest.id) as Course).title)}{" "}
          </span>
        )}
        <span className="sm:block">
          {studied >= goal ? copy.met(choices.pace, streak.weeks) : copy.toGo(goal - studied, choices.pace)}
        </span>
      </p>

      {/* What a followed teacher has coming, when there is something. */}
      <FollowedCohorts today={today} className="mt-8 max-w-3xl" />

      {open ? (
        <>
          {/* The reference's pill row with its rule at the far end: the
              courses under way, opened most recently first, and how far the
              open one has come. Stacked until lg, where both fit one row;
              below it the track scrolls to the screen's edge, as the lesson
              page's strip does. One course has nothing to switch between,
              so the row is its rule alone, under the lede that names it. */}
          {going.length > 1 ? (
            <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="no-scrollbar -mx-6 scroll-px-6 overflow-x-auto px-6 py-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0">
                <TabTrack
                  label={copy.tabs}
                  idPrefix="continue-tab"
                  controls="continue-panel"
                  options={going.map((x) => ({
                    id: x.id,
                    label: (
                      <>
                        {courseById(x.id)?.title}
                        <span className="tabular-nums text-muted-foreground">{x.standing.pct}%</span>
                      </>
                    ),
                  }))}
                  value={open.id}
                  onChange={setPicked}
                  className="w-max"
                />
              </div>
              <CourseRule done={open.standing.finished} total={open.standing.total} />
            </div>
          ) : (
            <div className="mt-8">
              <CourseRule done={open.standing.finished} total={open.standing.total} />
            </div>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Every course under way lies in the one cell, the open one
                shown, so the frame keeps the tallest card's height and a
                press on a tab moves nothing under it. */}
            <div className="grid">
              {going.map((x) => (
                <LessonCard
                  key={x.id}
                  course={courseById(x.id) as Course}
                  standing={x.standing}
                  lines={lines}
                  single={going.length === 1}
                  shown={x.id === open.id}
                />
              ))}
            </div>
            {panel}
          </div>
        </>
      ) : (
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <EmptyCard next={g && plan ? nextLeg(g, plan) : null} />
          {panel}
        </div>
      )}
    </section>
  );
}

/** The first course of the path that can be started now: not finished, not
 *  known, and every leg it builds on behind the learner. */
function nextLeg(g: Goal, plan: Plan): Course | null {
  const behind = (i: number) => ["done", "known"].includes(plan.legs[i].state);
  const i = g.legs.findIndex((l, k) => plan.legs[k].state === "open" && l.needs.every(behind));
  return i < 0 ? null : (courseById(g.legs[i].course) ?? null);
}

/** Nothing under way: the path's next course, with its photograph, where
 *  there is one, and the catalogue where there is not. */
function EmptyCard({ next }: { next: Course | null }) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-lg bg-card p-2 shadow-soft md:grid-cols-2">
      <div className="flex flex-col items-start justify-center gap-3 px-4 py-8 sm:px-6">
        {next && (
          <span className="inline-flex h-7 items-center gap-2 rounded-control bg-iris/15 px-2.5 text-xs font-medium text-iris-ink">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
            {copy.empty.chip}
          </span>
        )}
        <p className="mt-2 text-balance font-heading text-3xl tracking-tighter">{next ? next.title : copy.empty.title}</p>
        {next && <p className="text-sm text-muted-foreground">{copy.empty.meta(next.instructor, next.weeks)}</p>}
        <p className="max-w-md text-base text-muted-foreground">{copy.empty.body}</p>
        <Button
          render={
            <Link href={next ? lessonHref(next) : "/courses"}>
              {next ? copy.empty.start : copy.empty.action}
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" className="size-4" />
            </Link>
          }
          className="mt-3"
        />
      </div>
      {next && (
        <div className="relative order-first min-h-64 overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted md:order-none">
          <Image
            src={next.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
            className={cn("object-cover", next.focus && focus[next.focus])}
          />
        </div>
      )}
    </div>
  );
}

/** The open course's progress, as the lesson page's bar draws it. The share
 *  is on the open tab already, so the rule carries the count. */
function CourseRule({ done, total }: { done: number; total: number }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div className="flex shrink-0 items-center gap-3">
      <span className="text-sm font-medium tabular-nums">{copy.progress(done, total)}</span>
      {/* Contrast: the meter's fill is 1.3:1 against its bg-muted track,
          under WCAG's 3:1 for a graphic; the count beside it says it. */}
      <span
        role="meter"
        aria-label={copy.progress(done, total)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="block h-1.5 w-32 overflow-hidden rounded-full bg-muted sm:w-40"
      >
        <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}

/** The reference's step card: what the lesson is and the way back into it on
 *  the left, the module's items under them, and the course's photograph on
 *  the right carrying the tutor's line and the lesson's rule. */
function LessonCard({
  course: c,
  standing: s,
  lines,
  single,
  shown,
}: {
  course: Course;
  standing: Standing;
  lines: Lines;
  /** The one course under way, with no tab over it to name the card. */
  single: boolean;
  /** The open tab's card; the others hold their place in the cell, unseen. */
  shown: boolean;
}) {
  const item = s.current;
  const mod = s.modules[s.module];
  const href = `${playerHref(c)}?lesson=${item.id}`;
  const total = item.minutes * 60;
  const chip =
    item.kind === "video"
      ? copy.chip.video(item.id)
      : item.kind === "quiz"
        ? copy.chip.quiz(s.module + 1)
        : copy.chip.project;
  const action =
    item.kind === "video"
      ? s.at > 0
        ? copy.resume(clock(s.at))
        : copy.start.video(item.id)
      : item.kind === "quiz"
        ? copy.start.quiz
        : copy.start.project;
  const played = total ? Math.min(100, (s.at / total) * 100) : 0;

  return (
    <article
      id={single || !shown ? undefined : "continue-panel"}
      role={single || !shown ? undefined : "tabpanel"}
      aria-labelledby={single || !shown ? undefined : `continue-tab-${c.id}`}
      aria-hidden={shown ? undefined : true}
      inert={!shown}
      data-object
      className={cn(
        "col-start-1 row-start-1 grid grid-cols-1 gap-2 rounded-lg bg-card p-2 shadow-soft md:grid-cols-2",
        !shown && "invisible",
      )}
    >
      <div className="flex flex-col px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
        <span className="inline-flex h-7 w-fit items-center gap-2 rounded-control bg-iris/15 px-2.5 text-xs font-medium text-iris-ink">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          {chip}
        </span>
        <h2 className="mt-5 text-balance font-heading text-3xl tracking-tighter">
          {item.kind === "quiz" ? copy.quiz(item.questions ?? 0) : item.title}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {c.title} · {c.instructor}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button
            render={
              <Link href={href}>
                {item.kind === "video" ? (
                  <PlayIcon data-icon="inline-start" aria-hidden="true" className="size-4" />
                ) : (
                  <HugeiconsIcon
                    icon={item.kind === "quiz" ? Quiz01Icon : Task01Icon}
                    size={16}
                    strokeWidth={1.8}
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                )}
                {action}
              </Link>
            }
            size="lg"
          />
          <Link
            href={courseHref(c)}
            className={cn(
              "inline-flex items-center gap-1.5 text-sm font-medium press hover:text-muted-foreground",
              reach,
            )}
          >
            {copy.coursePage}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {/* The reference's ticked lines, at the card's foot: every item of
            the module with the mark the contents give it, each one a way
            into the player at that item. */}
        <div className="mt-10 md:mt-auto md:pt-10">
          <Caps>{copy.module(s.module + 1, s.modules.length)}</Caps>
          <p className="mt-2 text-sm font-medium">{mod.title}</p>
          <ol className="-mx-2 mt-2">
            {mod.items.map((i) => {
              const here = i.id === item.id;
              const stood = here ? s.at : (s.seconds[i.id] ?? 0);
              const length = i.minutes * 60;
              return (
                <li key={i.id}>
                  <Link
                    href={`${playerHref(c)}?lesson=${i.id}`}
                    aria-current={here ? "step" : undefined}
                    className="flex min-h-10 items-center gap-3 rounded-sm px-2 py-2 text-sm transition-colors hover:bg-accent active:bg-muted aria-[current=step]:font-medium"
                  >
                    <Glyph
                      state={s.done.has(i.id) ? "done" : i.kind === "video" && stood > 0 ? "progress" : "todo"}
                      fraction={length ? stood / length : 0}
                    />
                    <span className="line-clamp-2 min-w-0 flex-1">
                      {i.kind === "quiz" ? copy.quiz(i.questions ?? 0) : i.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* The photograph is the way back in, as a video's poster is: one link
          the size of the frame, named by what it does, holding the picture
          and the disc, so both lean in when the link is pointed at. The
          fragments stand over it and let a press through. */}
      <div className="relative order-first min-h-[22rem] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted md:order-none">
        <Link
          href={href}
          aria-label={item.kind === "video" ? copy.play(item.id, clock(s.at)) : action}
          // The ring is drawn inside the frame, which clips anything outside
          // it; outline-none leaves the style at none, so focus names solid.
          className="group/photo absolute inset-0 outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src={c.image}
            alt=""
            fill
            loading={shown ? "eager" : "lazy"}
            fetchPriority={shown ? "high" : "low"}
            sizes="(min-width: 1280px) 388px, (min-width: 1024px) calc(33.3vw - 38px), (min-width: 768px) calc(50vw - 44px), calc(100vw - 64px)"
            className={cn(
              "object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/photo:[transform:scale(1.03)] motion-safe:group-active/photo:[transform:scale(1)] group-active/photo:duration-answer",
              c.focus && focus[c.focus],
            )}
          />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-40 top-0 flex items-center justify-center">
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full bg-card text-foreground transition-transform motion-safe:group-hover/photo:[transform:scale(1.06)] motion-safe:group-active/photo:[transform:scale(1)]",
                float,
              )}
            >
              {item.kind === "video" ? (
                <PlayIcon className="size-6 translate-x-0.5" />
              ) : (
                <HugeiconsIcon icon={item.kind === "quiz" ? Quiz01Icon : Task01Icon} size={24} strokeWidth={1.7} />
              )}
            </span>
          </span>
        </Link>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-col gap-2 sm:inset-x-4 sm:bottom-4">
          <Recap course={c} standing={s} lines={lines} />
          {item.kind === "video" && (
            <div className={cn("rounded-sm bg-card px-4 py-3", float)}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{copy.chip.video(item.id)}</span>
                <span className="tabular-nums text-muted-foreground">{copy.of(clock(s.at), clock(total))}</span>
              </div>
              {/* the reference's rule with its marker over the filled part:
                  the lesson so far, and the second it stopped at */}
              <div aria-hidden="true" className="relative mt-3 h-1.5 rounded-full bg-muted">
                <span className="absolute inset-y-0 left-0 rounded-full bg-iris" style={{ width: `${played}%` }} />
                <span
                  className="absolute -top-2.5 size-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-foreground"
                  style={{ left: `${played}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Each subject's lesson file, loaded on its own the first time a lesson in it
// is quoted, so a learner who has moved on from the seed downloads one
// subject's transcripts rather than all four. SQL for analysis keeps its own
// file, so a data course looks there first.
const packFiles: Record<Topic, (() => Promise<Record<string, CoursePack>>)[]> = {
  Data: [
    () => import("@/components/course/lessons/sql-for-analysis").then((m) => m.sqlForAnalysis),
    () => import("@/components/course/lessons/data").then((m) => m.data),
  ],
  Engineering: [() => import("@/components/course/lessons/engineering").then((m) => m.engineering)],
  Design: [() => import("@/components/course/lessons/design").then((m) => m.design)],
  Business: [() => import("@/components/course/lessons/business").then((m) => m.business)],
};

async function linesOf(c: Course, lesson: string) {
  for (const load of packFiles[c.topic]) {
    const pack = (await load())[c.id];
    if (pack) return pack.lessons[lesson]?.transcript ?? null;
  }
  return null;
}

/** The transcript line the video stopped on, as the tutor would quote it, or
 *  what comes next where the next item is a quiz or the project. The seed's
 *  lessons arrive with the page; any other lesson's lines load the first time
 *  they are asked for, while the fragment says it is reading. */
function Recap({ course: c, standing: s, lines }: { course: Course; standing: Standing; lines: Lines }) {
  const item = s.current;
  const key = `${c.id}:${item.id}`;
  const [loaded, setLoaded] = useState<Record<string, Line[] | null>>({});
  const known = item.kind !== "video" ? null : key in lines ? lines[key] : loaded[key];

  useEffect(() => {
    if (known !== undefined) return;
    let live = true;
    linesOf(c, item.id).then((got) => {
      if (live) setLoaded((m) => ({ ...m, [key]: got }));
    });
    return () => {
      live = false;
    };
  }, [known, key, c, item.id]);

  const line = known ? (known.filter((l) => l.at <= s.at).at(-1) ?? known[0]) : null;
  const glyph = "flex size-10 shrink-0 items-center justify-center rounded-sm";

  if (item.kind !== "video") {
    return (
      <div className={cn("flex gap-3 rounded-sm bg-card p-3", float)}>
        <span aria-hidden="true" className={cn(glyph, "bg-iris/15 text-iris-ink")}>
          <HugeiconsIcon icon={item.kind === "quiz" ? Quiz01Icon : Task01Icon} size={18} strokeWidth={1.7} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {item.kind === "quiz" ? copy.next.quiz(s.module + 1) : copy.next.project}
          </p>
          <p className="mt-0.5 line-clamp-3 text-sm text-muted-foreground">
            {item.kind === "quiz" ? copy.next.quizBody(item.questions ?? 0, item.minutes) : item.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-3 rounded-sm bg-card p-3", float)}>
      <span aria-hidden="true" className={cn(glyph, "bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card")}>
        <AiIcon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {copy.stoppedAt}
          {s.at > 0 && (
            <>
              <span className="font-normal text-muted-foreground"> · </span>
              <span className="font-mono text-xs font-normal tabular-nums text-muted-foreground">{clock(s.at)}</span>
            </>
          )}
        </p>
        <p className="mt-0.5 line-clamp-3 text-sm text-muted-foreground" aria-live="polite">
          {known === undefined ? `${copy.reading}…` : line ? line.text : copy.noLines}
        </p>
      </div>
    </div>
  );
}

type PathLine = { goal: Goal; plan: Plan } | null;

/** The reference's tinted panel: the score card becomes the last seven days
 *  against the weekly goal, and its two rows the streak and the path the
 *  goal keeps on pace, joined by the reference's check. */
function WeekPanel({
  week,
  studied,
  goal,
  pace,
  streak,
  today,
  path,
}: {
  week: Day[];
  studied: number;
  goal: number;
  pace: number;
  streak: Streak;
  today: string;
  path: PathLine;
}) {
  const perDay = Math.round(goal / 7);
  const top = Math.max(150, perDay * 1.6, ...week.map((d) => d.minutes));
  const days = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const letter = new Intl.DateTimeFormat("en-US", {
    weekday: "narrow",
    timeZone: "UTC",
  });
  const at = (key: string) => new Date(`${key}T12:00:00Z`);
  const tick =
    "flex items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card";

  return (
    <aside aria-label={weekCopy.label} className="grid grid-cols-1 gap-2 rounded-lg bg-accent p-2 lg:flex lg:flex-col">
      <div className="flex flex-col rounded-[calc(var(--radius)-0.5rem)] bg-card p-5 lg:flex-1">
        <p className="flex items-center gap-2 text-sm font-medium">
          <span aria-hidden="true" className={cn(tick, "size-5")}>
            <HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.5} />
          </span>
          {weekCopy.label}
        </p>
        {/* where the panel runs taller than its rows, the spare height
            falls either side of the figure and the chart */}
        <div className="lg:my-auto lg:py-4">
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-heading text-4xl tracking-tight tabular-nums">{span(studied)}</span>
            <span className="text-sm font-medium text-iris-ink">
              {studied >= goal ? weekCopy.met : weekCopy.toGo(goal - studied)}
            </span>
          </p>

          {/* A column a day, today last, under a dashed line at the day's
            share of the goal. One scale whatever the card's height, so a
            day reads the same on every tab. */}
          <ul className="relative mt-5 grid h-28 grid-cols-7 items-end gap-1.5 lg:h-36">
            <li
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-foreground/30"
              style={{ bottom: `${(perDay / top) * 100}%` }}
            />
            {week.map((d) => (
              <li key={d.key} className="flex h-full flex-col items-center justify-end">
                <span className="sr-only">
                  {weekCopy.day(d.ago === 0 ? weekCopy.today : days.format(at(d.key)), d.minutes)}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "block w-full max-w-6 rounded-[5px]",
                    d.minutes ? "bg-iris" : "h-1 bg-muted",
                    d.ago === 0 && !d.minutes && "bg-foreground/15",
                  )}
                  style={d.minutes ? { height: `${Math.max(6, (d.minutes / top) * 100)}%` } : undefined}
                />
              </li>
            ))}
          </ul>
          <div aria-hidden="true" className="mt-2 grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground">
            {week.map((d) => (
              <span key={d.key} className={cn(d.ago === 0 && "font-medium text-foreground")}>
                {letter.format(at(d.key))}
              </span>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span aria-hidden="true" className="w-4 border-t border-dashed border-foreground/40" />
            {weekCopy.pace(perDay)}
          </p>
        </div>

        {/* The goal is the path's pace: one number of hours a week, so the
            path's finish date moves with it. */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4 lg:mt-0">
          <span className="text-sm text-muted-foreground">{weekCopy.goal}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPace(pace - 1)}
              disabled={pace <= PACE.min}
              aria-label={weekCopy.lower}
              className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
            >
              <HugeiconsIcon icon={MinusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <output aria-live="polite" className="w-14 text-center text-sm font-medium tabular-nums">
              {weekCopy.goalValue(pace)}
            </output>
            <button
              type="button"
              onClick={() => setPace(pace + 1)}
              disabled={pace >= PACE.max}
              aria-label={weekCopy.raise}
              className="flex size-10 items-center justify-center rounded-control ring-1 ring-inset ring-border press hover:bg-accent disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative grid gap-2 md:grid-cols-2 lg:grid-cols-1">
        <div className="flex items-center gap-3 rounded-[calc(var(--radius)-0.5rem)] bg-card p-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-chip text-primary-ink"
          >
            <HugeiconsIcon icon={FireIcon} size={20} strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{weekCopy.streak(streak.weeks)}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {streak.weeks ? weekCopy.streakSince(dayOf(streak.since, today)) : weekCopy.streakNone}
            </p>
          </div>
          {/* the weeks behind the count, oldest first, the one under way last */}
          <span
            role="img"
            aria-label={weekCopy.weeks(streak.history.filter(Boolean).length, streak.met)}
            className="flex shrink-0 gap-1"
          >
            {[...streak.history, streak.met].map((met, i) => (
              <span
                key={i}
                className={cn(
                  "size-1.5 rounded-full",
                  met ? "bg-iris" : i === streak.history.length ? "ring-1 ring-inset ring-iris" : "bg-foreground/15",
                )}
              />
            ))}
          </span>
        </div>

        {path && (
          <>
            {/* the reference's check between its two rows: keeping the
                streak is what keeps the path's date */}
            <span
              aria-hidden="true"
              className={cn(
                tick,
                "absolute left-1/2 top-1/2 z-10 size-7 -translate-x-1/2 -translate-y-1/2 ring-4 ring-accent",
              )}
            >
              <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2.5} />
            </span>
            <a
              href="#path"
              className="flex items-center gap-3 rounded-[calc(var(--radius)-0.5rem)] bg-card p-4 transition-[box-shadow,background-color] hover:shadow-soft active:bg-accent active:shadow-none"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-iris/15 text-iris-ink"
              >
                <path.goal.Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{weekCopy.path(path.goal.short)}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {weekCopy.finishes(dayOf(path.plan.finish, today))}
                </span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {weekCopy.left(path.plan.left)}
              </span>
            </a>
          </>
        )}
      </div>
    </aside>
  );
}
