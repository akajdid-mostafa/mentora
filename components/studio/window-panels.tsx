"use client";

// The studio window's views past its overview, one a tab: the open draft's
// outline, the takes, the module quizzes and the revenue. Each is built as the
// overview is, three figures over two panels, each panel a label on the tint
// with a white inset under it, so switching tabs changes what the window says
// and never how it is built. Each view ends in its one way down the page, to
// the step that does the work.

import Image from "next/image";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { clock } from "@/components/learn/copy";
import { span } from "@/components/dashboard/copy";
import { overviewCopy as copy } from "@/components/studio/copy";
import { countsOf, openDraft, type Draft } from "@/components/studio/drafts";
import { takeClock } from "@/components/studio/player";
import { useProgress } from "@/components/studio/progress";
import { COURSES, courseOf, courseTitle, totalOf, type Month } from "@/components/studio/revenue";
import { TAKE_PHOTO, takes, type StudioCourse } from "@/components/studio/window";
import { figure, usd } from "@/components/teach/earnings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The two series the revenue section below draws, in the same colours.
const SALES = "bg-chart-2";
const PLUS = "bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))]";
const IRIS_CHIP = "bg-[color-mix(in_oklab,var(--iris)_12%,var(--card))] text-iris-ink";

/** A figure in the window: its label on the panel's tint, the figure on a
 *  white card inset in it, as the reference's tiles are built. */
export function Figure({ label, value, note }: { label: string; value: string; note: string }) {
  // Under sm the three tiles would stack a screen tall, so each lies on its
  // side: the label on the tint, the figure on its white inset beside it,
  // the three insets one width through the rows they share.
  return (
    <div className="col-span-2 grid grid-cols-subgrid items-center rounded-md bg-accent p-1 sm:col-span-1 sm:flex sm:flex-col sm:items-stretch">
      <p className="min-w-0 px-2 text-sm text-muted-foreground sm:px-3 sm:pt-2 sm:pb-2.5">{label}</p>
      <div className="min-w-32 rounded-sm bg-card px-3 py-2 text-right ring-1 ring-border sm:flex-1 sm:py-3 sm:text-left">
        <p className="font-heading text-2xl tracking-tighter whitespace-nowrap tabular-nums md:text-3xl">{value}</p>
        <p className="mt-0.5 text-sm tabular-nums text-muted-foreground sm:mt-1">{note}</p>
      </div>
    </div>
  );
}

export function Figures({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_fit-content(8rem)] gap-x-2 gap-y-3 min-[390px]:grid-cols-[minmax(0,1fr)_fit-content(10rem)] sm:grid-cols-3 sm:gap-x-3">
      {children}
    </div>
  );
}

/** Two panels under the figures: the wide one, and a narrow one beside it
 *  from xl. */
export function Panels({ children }: { children: React.ReactNode }) {
  // It takes whatever height the window has left, so a view shorter than
  // the tallest ends in its panels' white rather than in a gap.
  return <div className="mt-3 grid flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_19rem]">{children}</div>;
}

/** A panel: its label, and what stands beside the label, on the tint; its
 *  rows on the white inset under them. */
export function Pane({
  title,
  aside,
  children,
  className,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col rounded-md bg-accent p-1", className)}>
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-1 pr-1 pl-4">
        <h3 className="text-sm font-medium">{title}</h3>
        {aside}
      </div>
      <div className="flex flex-1 flex-col rounded-sm bg-card ring-1 ring-border">{children}</div>
    </div>
  );
}

/** The way down to the step that does the work, at the foot of a view's
 *  narrow panel or in its wide one's label. */
function Down({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className={className}>
      {label}
      <ArrowDownIcon data-icon="inline-end" className="size-3.5" />
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Outline

export function OutlinePanel({
  draft,
  drafts,
  onBoard,
  onNew,
}: {
  draft: Draft | undefined;
  drafts: Draft[];
  onBoard: () => void;
  onNew: () => void;
}) {
  const t = copy.outlineTab;
  if (!draft) return <p className="rounded-md bg-accent px-4 py-10 text-center text-sm text-muted-foreground">{copy.drafts.empty}</p>;
  const c = countsOf(draft);
  return (
    <>
      <Figures>
        <Figure label={t.yours} value={t.yoursValue(c.yours, c.lessons)} note={t.yoursNote} />
        <Figure label={t.drafted} value={figure(c.drafted)} note={t.draftedNote(c.drafted)} />
        <Figure label={t.length} value={span(c.minutes)} note={t.lengthNote(draft.level)} />
      </Figures>
      <Panels>
        <Pane title={t.chapters} aside={<Down label={t.board} onClick={onBoard} />}>
          {/* A row a chapter: its number, its title, and a pill a lesson,
              solid where the lesson is in the instructor's words and dashed
              in the studio's iris where it is still as drafted. */}
          <ol className="divide-y">
            {draft.chapters.map((ch, i) => {
              const yours = ch.lessons.filter((l) => l.yours).length;
              return (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="w-6 shrink-0 font-heading text-sm tabular-nums text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{ch.title}</span>
                  <span aria-hidden="true" className="hidden shrink-0 gap-1 sm:flex">
                    {ch.lessons.map((l) => (
                      <span
                        key={l.id}
                        className={cn(
                          "h-2.5 w-4 rounded-full",
                          l.yours
                            ? "bg-foreground"
                            : "border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--iris),white_10%)] bg-[color-mix(in_oklab,var(--iris)_10%,var(--card))]",
                        )}
                      />
                    ))}
                  </span>
                  <span className="w-9 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                    <span aria-hidden="true">
                      {yours}/{ch.lessons.length}
                    </span>
                    <span className="sr-only">{t.chapter(i + 1, ch.title, yours, ch.lessons.length)}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </Pane>
        <Pane title={t.drafts}>
          {/* Which draft the outline, the board below and this view show:
              one of several, so each row leads with the ring the revenue
              section's courses wear, ticked in the brand's disc once picked. */}
          <div role="radiogroup" aria-label={t.pick} className="flex flex-col p-1.5">
            {drafts.map((d) => {
              const on = d.id === draft.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => openDraft(d.id)}
                  className="group/row flex items-center gap-3 rounded-sm px-2.5 py-2.5 text-left transition-colors hover:bg-accent active:bg-muted"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-5 shrink-0 items-center justify-center rounded-full transition-colors group-aria-checked/row:bg-primary group-aria-checked/row:text-primary-foreground not-group-aria-checked/row:ring-1 not-group-aria-checked/row:ring-inset not-group-aria-checked/row:ring-foreground/20 not-group-aria-checked/row:group-hover/row:ring-foreground/40"
                  >
                    {on && <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.6} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{d.title}</span>
                    <span className="block text-sm text-muted-foreground">{copy.drafts.stage[d.stage]}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-auto border-t p-1.5">
            <Button variant="ghost" size="sm" className="w-full" onClick={onNew}>
              <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} data-icon="inline-start" />
              {copy.drafts.add}
            </Button>
          </div>
        </Pane>
      </Panels>
    </>
  );
}

// ---------------------------------------------------------------------------
// Recordings

export function RecordingsPanel({
  review,
  onReview,
}: {
  review: { label: string; length: number };
  onReview: () => void;
}) {
  const t = copy.recordingsTab;
  const { cuts } = useProgress();
  const rows = takes({ length: review.length, lessons: cuts.total + 1 });
  const seconds = rows.reduce((n, r) => n + r.length, 0);
  const lessons = rows.reduce((n, r) => n + r.lessons, 0);
  const kept = cuts.total - cuts.waiting;
  return (
    <>
      <Figures>
        <Figure label={t.recorded} value={span(Math.round(seconds / 60))} note={t.recordedNote(rows.length)} />
        <Figure label={t.cut} value={figure(lessons)} note={t.cutNote} />
        <Figure label={t.waiting} value={figure(cuts.published ? 0 : cuts.waiting)} note={t.waitingNote(cuts.waiting, cuts.published)} />
      </Figures>
      <Panels>
        <Pane title={t.takes}>
          <ul className="divide-y">
            {rows.map((r) => {
              const state =
                r.state === "review"
                  ? { text: t.state.review(cuts.waiting, cuts.published), look: cuts.published ? "bg-leaf/15 text-leaf-ink" : IRIS_CHIP }
                  : r.state === "split"
                    ? { text: t.state.split(r.lessons), look: "bg-muted" }
                    : { text: t.state.published(r.lessons), look: "bg-leaf/15 text-leaf-ink" };
              return (
                <li key={r.id} className="flex items-center gap-3 px-3 py-2.5 sm:gap-4">
                  {/* a take's still: dark in both halves, as a screen is */}
                  <span aria-hidden="true" className="relative hidden aspect-video w-16 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-fixed-dark sm:flex">
                    <span className="flex size-5 items-center justify-center rounded-full bg-fixed-light/20 text-fixed-light">
                      <PlayIcon className="ml-px size-2.5" />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{r.title}</span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {r.course} · <span className="tabular-nums">{takeClock(r.length)}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className={cn("inline-flex h-6 items-center rounded-control px-2.5 text-xs whitespace-nowrap", state.look)}>
                      {state.text}
                    </span>
                    <span className="text-xs text-muted-foreground">{t.ago(r.ago)}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Pane>
        <Pane title={t.next}>
          {/* The still beside what it waits on while the panel runs the
              window's width, over it once the panel is the narrow one. */}
          <div className="flex flex-1 flex-col gap-4 p-3 sm:flex-row sm:items-center xl:flex-col xl:items-stretch">
            <button
              type="button"
              onClick={onReview}
              aria-label={t.review}
              className="group relative block aspect-video shrink-0 overflow-hidden rounded-sm bg-muted sm:w-64 xl:w-full"
            >
              <Image src={TAKE_PHOTO} alt="" fill sizes="(min-width: 1280px) 290px, 90vw" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-card shadow-soft-lg transition-transform group-hover:scale-105 group-active:scale-100">
                  <PlayIcon className="ml-0.5 size-4" />
                </span>
              </span>
              <span className="absolute bottom-2 left-2 inline-flex h-6 items-center gap-1.5 rounded-control bg-card px-2.5 text-xs font-medium">
                {review.label}
                <span className="font-normal tabular-nums text-muted-foreground">{takeClock(review.length)}</span>
              </span>
            </button>
            <div className="min-w-0 flex-1">
              {/* A bar a cut: the kept ones in the brand. */}
              <div aria-hidden="true" className="flex gap-1">
                {Array.from({ length: cuts.total }, (_, i) => (
                  <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < kept ? "bg-primary" : "bg-foreground/10")} />
                ))}
              </div>
              <p className="mt-2 text-sm tabular-nums text-muted-foreground">{t.kept(kept, cuts.total)}</p>
              <Down label={t.review} onClick={onReview} className="mt-4 w-full" />
            </div>
          </div>
        </Pane>
      </Panels>
    </>
  );
}

// ---------------------------------------------------------------------------
// Quizzes

export function QuizzesPanel({ course, onReview }: { course: StudioCourse; onReview: () => void }) {
  const t = copy.quizzesTab;
  const { quiz } = useProgress();
  const live = course.quizzes.reduce((n, q) => n + q.questions, 0);
  const tries = course.quizzes.reduce((n, q) => n + q.attempts, 0);
  const right = course.quizzes.reduce((n, q) => n + q.right * q.attempts, 0) / tries;
  const h = course.hardest;
  return (
    <>
      <Figures>
        <Figure label={t.live} value={figure(live)} note={t.liveNote(course.quizzes.length)} />
        <Figure label={t.right} value={`${Math.round(right * 100)}%`} note={t.rightNote} />
        <Figure label={t.waiting} value={figure(quiz.pending)} note={t.waitingNote(quiz.pending, quiz.added)} />
      </Figures>
      <Panels>
        <Pane title={t.list} aside={<Down label={t.go} onClick={onReview} />}>
          {/* A row a module quiz: its name, and the share of first tries
              answered right as a meter, in words beside it. Module 4's row
              says where its new set stands. */}
          <ol className="divide-y">
            {course.quizzes.map((q) => (
              <li key={q.module} className="flex min-h-12 items-center gap-3 px-4 py-2 sm:gap-4">
                <span className="hidden w-16 shrink-0 text-sm text-muted-foreground sm:block">{t.module(q.module)}</span>
                {/* On a phone the module's name takes the row, and module 4's
                    chip goes under it. */}
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                  <span className="w-full min-w-0 truncate text-sm sm:w-auto sm:flex-1">{q.title}</span>
                  {q.module === 4 && (
                    <span className={cn("inline-flex h-6 shrink-0 items-center rounded-control px-2.5 text-xs tabular-nums", quiz.added ? "bg-leaf/15 text-leaf-ink" : IRIS_CHIP)}>
                      {quiz.added ? t.added : t.review(quiz.approved, quiz.live)}
                    </span>
                  )}
                </span>
                <span aria-hidden="true" className="hidden h-1.5 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/10 sm:block">
                  <span className={cn("block h-full rounded-full", SALES)} style={{ width: `${q.right * 100}%` }} />
                </span>
                <span className="w-16 shrink-0 text-right text-sm tabular-nums">{t.rightShare(Math.round(q.right * 100))}</span>
              </li>
            ))}
          </ol>
        </Pane>
        <Pane title={t.hardest} aside={<span className="pr-2 text-sm text-muted-foreground">{t.module(h.module)}</span>}>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-sm font-medium">{h.q}</p>
            {/* What first tries chose: the answer in the good state's leaf,
                the rest in ink, each share in words. */}
            <ol className="mt-4 flex flex-col gap-3">
              {h.options.map((o, i) => (
                <li key={o}>
                  <span className="flex items-baseline justify-between gap-3 text-sm">
                    <span className={cn("min-w-0", i === h.answer && "font-medium")}>
                      {o}
                      {i === h.answer && <span className="sr-only"> ({t.answer})</span>}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{t.chose(Math.round(h.chose[i] * 100))}</span>
                  </span>
                  <span aria-hidden="true" className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <span
                      className={cn("block h-full rounded-full", i === h.answer ? "bg-leaf" : "bg-foreground/30")}
                      style={{ width: `${h.chose[i] * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-auto pt-4 text-sm tabular-nums text-muted-foreground">{t.source(h.lesson, clock(h.at))}</p>
          </div>
        </Pane>
      </Panels>
    </>
  );
}

// ---------------------------------------------------------------------------
// Revenue

export function RevenuePanel({
  months,
  due,
  onMonth,
}: {
  months: Month[];
  due: string;
  onMonth: () => void;
}) {
  const t = copy.revenueTab;
  const now = months[11];
  const all = totalOf(now);
  const open = now.run < 1;
  const byCourse = COURSES.map((id) => ({ id, ...totalOf(now, id) }));
  const top = Math.max(...byCourse.map((c) => c.total), 1);
  const six = months.slice(6);
  const peak = Math.max(...six.map((m) => totalOf(m).total));
  return (
    <>
      <Figures>
        <Figure label={t.earned(now.long.split(" ")[0], open)} value={usd(all.total)} note={t.earnedNote(due)} />
        <Figure label={t.sales} value={usd(all.sales)} note={t.salesNote(figure(all.units))} />
        <Figure label={t.plus} value={usd(all.plus)} note={t.plusNote(figure(all.minutes))} />
      </Figures>
      <Panels>
        <Pane title={t.courses}>
          <ul className="divide-y">
            {byCourse.map((c) => {
              const free = courseOf(c.id).price === 0;
              return (
                <li key={c.id} className="flex items-center gap-3 px-4 py-2.5 sm:gap-4">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{courseTitle(c.id)}</span>
                    <span className="mt-0.5 block text-sm tabular-nums text-muted-foreground">
                      {free ? t.free(figure(c.learners)) : t.units(figure(c.units))}
                    </span>
                  </span>
                  <span aria-hidden="true" className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-foreground/10 sm:block">
                    <span className="flex h-full gap-0.5">
                      <span className={cn("h-full rounded-full", SALES)} style={{ width: `${(c.sales / top) * 100}%` }} />
                      {c.plus > 0 && <span className={cn("h-full rounded-full", PLUS)} style={{ width: `${(c.plus / top) * 100}%` }} />}
                    </span>
                  </span>
                  <span className="w-24 shrink-0 text-right text-sm tabular-nums">{usd(c.total)}</span>
                </li>
              );
            })}
          </ul>
        </Pane>
        <Pane
          title={t.months}
          aside={
            <span className="flex items-center gap-3 pr-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className={cn("size-2 rounded-full", SALES)} />
                {t.legend.sales}
              </span>
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className={cn("size-2 rounded-full", PLUS)} />
                {t.legend.plus}
              </span>
            </span>
          }
        >
          {/* A month a row, sales and Plus laid end to end on one scale, the
              total in words at the end; the month under way says so. */}
          <ol className="flex flex-col gap-2.5 p-4">
            {six.map((m, i) => {
              const tt = totalOf(m);
              const last = i === six.length - 1;
              return (
                <li key={m.key} className="flex items-center gap-3 text-sm">
                  <span className="w-8 shrink-0 text-muted-foreground">{m.short}</span>
                  <span aria-hidden="true" className="flex h-1.5 min-w-0 flex-1 gap-0.5">
                    <span className={cn("h-full rounded-full", SALES)} style={{ width: `${(tt.sales / peak) * 100}%` }} />
                    <span className={cn("h-full rounded-full", PLUS)} style={{ width: `${(tt.plus / peak) * 100}%` }} />
                  </span>
                  <span className={cn("w-20 shrink-0 text-right tabular-nums", last && open && "text-muted-foreground")}>
                    {usd(tt.total)}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto p-3 pt-0">
            <Down label={t.see} onClick={onMonth} className="w-full" />
          </div>
        </Pane>
      </Panels>
    </>
  );
}
