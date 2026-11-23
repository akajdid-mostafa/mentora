"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import {
  ChartHistogramIcon,
  Copy01Icon,
  DashboardSquare02Icon,
  Delete02Icon,
  LeftToRightListBulletIcon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Quiz01Icon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useToday } from "@/components/dashboard/today";
import { face } from "@/components/marketing/quotes";
import { reach } from "@/components/reach";
import { overviewCopy as copy } from "@/components/studio/copy";
import {
  columnsOf,
  countsOf,
  deleteDraft,
  duplicateDraft,
  openDraft,
  useStudio,
  type Draft,
} from "@/components/studio/drafts";
import { instructor } from "@/components/studio/instructor";
import { Lattice } from "@/components/studio/lattice";
import { useProgress } from "@/components/studio/progress";
import { monthsOf, payoutMonth, totalOf } from "@/components/studio/revenue";
import type { StudioCourse } from "@/components/studio/window";
import {
  Figure,
  Figures,
  OutlinePanel,
  Panels,
  QuizzesPanel,
  RecordingsPanel,
  RevenuePanel,
} from "@/components/studio/window-panels";
import { figure, nextPayday, usd } from "@/components/teach/earnings";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

type Tab = keyof typeof copy.window.tabs;
const TABS = Object.keys(copy.window.tabs) as Tab[];
const ICONS: Record<Tab, IconSvgElement> = {
  overview: DashboardSquare02Icon,
  outline: LeftToRightListBulletIcon,
  recordings: Video01Icon,
  quizzes: Quiz01Icon,
  revenue: ChartHistogramIcon,
};

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Bring a section of the page up and hand its first control the caret:
 *  the board's heading when a draft opens, the brief's field for a new one.
 *  `focus` is an element's id, or a selector for one whose id moves, such as
 *  the picked radio of a group. */
export function goTo(section: string, focus: string, select = false) {
  document.getElementById(section)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  const el = (document.getElementById(focus) ?? document.querySelector(focus)) as HTMLElement | HTMLTextAreaElement | null;
  el?.focus({ preventScroll: true });
  if (select && el && "select" in el) el.select();
}

export function StudioWindow({
  today: serverToday,
  course,
  review,
}: {
  today: string;
  course: StudioCourse;
  /** The take the splitter below holds. */
  review: { label: string; length: number };
}) {
  const today = useToday(serverToday);
  const { drafts, open } = useStudio();
  const [tab, setTab] = useState<Tab>("overview");
  const months = monthsOf(today);
  const now = months[11];
  const last = months[10];

  // The draft with the most still as drafted leads the lede.
  const behind = [...drafts].sort((a, b) => countsOf(b).drafted - countsOf(a).drafted)[0];
  const pay = payoutMonth(months, today);
  const paid = totalOf(pay);
  const due = nextPayday(today);

  const learners = totalOf(now).learners;
  const sales = totalOf(now).units;
  const change = (to: number, from: number) => Math.round(((to / now.run) / from - 1) * 100);

  // A view opened from inside another one, a draft's row or the payout's
  // month, takes its tab and hands the caret to it, since the control that
  // was pressed has left with the view it stood in.
  const show = (next: Tab) => {
    setTab(next);
    requestAnimationFrame(() => {
      const wide = document.getElementById(`studio-tab-${next}`);
      (wide?.offsetParent ? wide : document.getElementById(`studio-tab-m-${next}`))?.focus();
    });
  };

  return (
    <section id="studio" aria-labelledby="studio-title" className="mx-auto w-full max-w-7xl px-6 pt-8 sm:px-8 sm:pt-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Eyebrow className="justify-center">{copy.eyebrow}</Eyebrow>
        <h1 id="studio-title" className="mt-5 text-4xl tracking-tighter sm:text-5xl lg:text-6xl">
          {copy.title(instructor.first)}
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground">
          {behind && <span className="sm:block">{copy.drafted(behind.title, countsOf(behind).drafted)} </span>}
          <span className="sm:block">
            {copy.payout(pay.long.split(" ")[0], usd(paid.total), due.label, pay.run < 1)}
          </span>
        </p>
        {/* Two doors at one height: the new course, filled, and the public
            profile raised in white. At 44px, a step above the site's other
            pairs, so the page's first door is not lighter than the calls in
            the steps below it. Stacked at one width on a phone. */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Button
            size="lg"
            render={
              <a
                href={copy.draft.href}
                onClick={(e) => {
                  e.preventDefault();
                  goTo("outline", "brief", true);
                }}
              />
            }
          >
            {copy.draft.label}
          </Button>
          <a
            href={instructor.href}
            className={cn(
              "flex h-11 items-center justify-center gap-1.5 rounded-control bg-card px-6 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none",
              reach,
            )}
          >
            {copy.profile}
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>
      </div>

      {/* The frame: the studio's iris at its deepest on either edge, paling
          to near white behind the window, with light streaking through it.
          It stops on its own rounded edge. */}
      <div
        className={cn(
          "relative isolate mt-14 overflow-clip rounded-[calc(var(--radius-lg)+0.75rem)] p-3 sm:mt-16 sm:rounded-[calc(var(--radius-lg)+2rem)] sm:p-8 lg:rounded-[calc(var(--radius-lg)+3rem)] lg:p-12",
          "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--iris)_72%,var(--iris-ink))_0%,color-mix(in_oklab,var(--iris)_62%,var(--card))_20%,color-mix(in_oklab,var(--iris)_16%,var(--card))_44%,color-mix(in_oklab,var(--iris)_16%,var(--card))_56%,color-mix(in_oklab,var(--iris)_62%,var(--card))_80%,color-mix(in_oklab,var(--iris)_72%,var(--iris-ink))_100%)]",
        )}
      >
        <Streaks />
        <Window
          tab={tab}
          onTab={setTab}
          meta={{
            overview: range(today),
            outline: open ? copy.outlineTab.meta(open.chapters.length, countsOf(open).lessons) : "",
            recordings: copy.recordingsTab.meta,
            quizzes: copy.quizzesTab.meta(course.title),
            revenue: copy.revenueTab.meta(months[6].short, months[11].short),
          }}
          views={{
            overview: (
              <>
                <Figures>
                  <Figure label={copy.figures.learners} value={figure(learners)} note={copy.figures.change(change(learners, totalOf(last).learners), last.long.split(" ")[0])} />
                  <Figure label={copy.figures.sales} value={figure(sales)} note={copy.figures.change(change(sales, totalOf(last).units), last.long.split(" ")[0])} />
                  <Figure label={copy.figures.rating} value={instructor.rating.toFixed(1)} note={copy.figures.ratings(figure(instructor.ratings))} />
                </Figures>
                <Panels>
                  <DraftsPanel
                    drafts={drafts}
                    onOpen={(id) => {
                      openDraft(id);
                      show("outline");
                    }}
                  />
                  <PayoutPanel
                    month={pay.long.split(" ")[0]}
                    amount={usd(paid.total, true)}
                    due={due}
                    sales={paid.units}
                    minutes={paid.minutes}
                    onMonth={() => show("revenue")}
                  />
                </Panels>
              </>
            ),
            outline: (
              <OutlinePanel
                draft={open}
                drafts={drafts}
                onBoard={() => goTo("outline", "board-title")}
                onNew={() => goTo("outline", "brief", true)}
              />
            ),
            recordings: <RecordingsPanel review={review} onReview={() => goTo("recordings", "take-play")} />,
            quizzes: <QuizzesPanel course={course} onReview={() => goTo("quiz", '#quiz [role="radio"][aria-checked="true"]')} />,
            revenue: (
              <RevenuePanel
                months={months}
                due={due.label}
                onMonth={() => goTo("revenue", '#revenue [aria-checked="true"], #revenue [aria-selected="true"]')}
              />
            ),
          }}
        />
      </div>
    </section>
  );
}

/** Light pulled through the frame: bands wide at the edges and pinched
 *  behind the window, some white, some the iris's own ink, softened. Drawn
 *  for the eye alone. */
function Streaks() {
  const ref = useRef<SVGSVGElement>(null);
  // The light drifts a few percent one way and back, on the compositor, and
  // not at all for a reader who asked for less motion. Linear, as every loop
  // here runs: at a few pixels a second the turn back is not seen.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = el.animate(
      [{ transform: "translateX(-3%) scaleY(1)" }, { transform: "translateX(3%) scaleY(1.06)" }],
      { duration: 20000, iterations: Infinity, direction: "alternate", easing: "linear" },
    );
    return () => run.cancel();
  }, []);
  // Each band: where it meets the left edge, where it pinches at the middle,
  // where it meets the right edge, top and bottom of each, in a 1200 × 600 box.
  const bands: [number, number, number, number, number, number, string, number][] = [
    [40, 150, 262, 276, 70, 190, "white", 0.34],
    [170, 250, 280, 290, 200, 270, "var(--iris-ink)", 0.16],
    [260, 330, 292, 300, 280, 350, "white", 0.42],
    [340, 420, 302, 312, 360, 430, "var(--iris-ink)", 0.14],
    [430, 560, 316, 330, 450, 570, "white", 0.3],
    [0, 60, 250, 258, 20, 80, "var(--iris-ink)", 0.12],
  ];
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-x-[4%] inset-y-0 -z-10 h-full w-[108%] blur-md"
    >
      {bands.map(([l0, l1, m0, m1, r0, r1, fill, opacity], i) => (
        <path
          key={i}
          d={`M0 ${l0} C 260 ${l0}, 380 ${m0}, 600 ${m0} C 820 ${m0}, 940 ${r0}, 1200 ${r0} L 1200 ${r1} C 940 ${r1}, 820 ${m1}, 600 ${m1} C 380 ${m1}, 260 ${l1}, 0 ${l1} Z`}
          fill={fill}
          opacity={opacity}
        />
      ))}
    </svg>
  );
}

/** The month so far, as the overview's head reads it: "Sep 1–30", and on the
 *  first of the month the one day, "Oct 1", rather than "Oct 1–1". */
function range(today: string) {
  const first = new Date(`${today.slice(0, 8)}01T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const day = Number(today.slice(8, 10));
  return day === 1 ? first : `${first}–${day}`;
}

/** The studio's window: a sidebar of five tabs with the instructor at its
 *  foot, and beside it the view the picked tab shows. Under lg the sidebar
 *  gives way to the instructor's line and a track of the same five tabs. */
function Window({
  tab,
  onTab,
  meta,
  views,
}: {
  tab: Tab;
  onTab: (t: Tab) => void;
  meta: Record<Tab, string>;
  views: Record<Tab, React.ReactNode>;
}) {
  const { cuts, quiz } = useProgress();
  // What waits on a tab, in a count beside its name: the cuts still to be
  // kept, and the questions still to be decided.
  const waiting: Partial<Record<Tab, number>> = {
    recordings: cuts.published ? 0 : cuts.waiting,
    quizzes: quiz.pending,
  };

  // The sidebar's keys, as a vertical tab list's are: the arrows move along
  // it and pick as they go, Home and End reach its ends.
  const keys = (e: KeyboardEvent) => {
    const i = TABS.indexOf(tab);
    const to =
      e.key === "ArrowDown" ? TABS[(i + 1) % TABS.length]
      : e.key === "ArrowUp" ? TABS[(i - 1 + TABS.length) % TABS.length]
      : e.key === "Home" ? TABS[0]
      : e.key === "End" ? TABS[TABS.length - 1]
      : null;
    if (!to) return;
    e.preventDefault();
    onTab(to);
    document.getElementById(`studio-tab-${to}`)?.focus();
  };

  return (
    <div data-object className="relative overflow-clip rounded-lg bg-card shadow-[0_2px_6px_hsl(265_30%_20%/0.10),0_32px_64px_-24px_hsl(265_40%_20%/0.45)] lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="hidden flex-col bg-accent p-3 lg:flex">
        <p className="flex items-center gap-2.5 px-2 py-2 text-sm font-medium">
          <span className="flex size-7 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-white">
            <AiIcon size={15} />
          </span>
          {copy.window.label}
        </p>
        <div role="tablist" aria-label={copy.window.label} aria-orientation="vertical" onKeyDown={keys} className="mt-4 flex flex-col gap-1">
          {TABS.map((id) => {
            const on = id === tab;
            const n = waiting[id];
            return (
              <button
                key={id}
                id={`studio-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={`studio-view-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => onTab(id)}
                className={cn(
                  "flex h-10 items-center gap-2.5 rounded-sm px-2.5 text-left text-sm press",
                  // edge-role: released template — the picked tab is a 1px hairline beside a card fill, and the house frame's 2px in the brand ink would thicken and recolour it
                  "aria-selected:bg-card aria-selected:font-medium aria-selected:ring-1 aria-selected:ring-inset aria-selected:ring-border aria-selected:hover:shadow-soft",
                  "not-aria-selected:text-muted-foreground not-aria-selected:hover:bg-muted not-aria-selected:hover:text-foreground",
                )}
              >
                <HugeiconsIcon icon={ICONS[id]} size={18} strokeWidth={1.6} aria-hidden="true" />
                <span className="flex-1">{copy.window.tabs[id]}</span>
                {!!n && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-control bg-[color-mix(in_oklab,var(--iris)_14%,var(--card))] px-1.5 text-xs font-normal tabular-nums text-iris-ink">
                    <span aria-hidden="true">{n}</span>
                    <span className="sr-only">{copy.window.waiting(n)}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <Account className="mt-auto pt-6" />
      </aside>

      <div className="min-w-0 p-3 sm:p-5">
        <Account className="mb-3 border-b pb-3 lg:hidden" />
        <div className="no-scrollbar -mx-3 mb-4 overflow-x-auto px-3 sm:-mx-5 sm:px-5 lg:hidden">
          <TabTrack<Tab>
            on="card"
            label={copy.window.label}
            idPrefix="studio-tab-m"
            value={tab}
            onChange={onTab}
            options={TABS.map((id) => ({
              id,
              label: copy.window.tabs[id],
              icon: <HugeiconsIcon icon={ICONS[id]} size={16} strokeWidth={1.6} className="md:hidden" />,
              count: waiting[id] || undefined,
            }))}
          />
        </div>
        {/* Every view stands in one cell, the ones not picked unseen, so the
            window keeps the height of the tallest at every width and nothing
            under it moves as the tabs change. */}
        <div className="grid">
          {TABS.map((id) => {
            const on = id === tab;
            return (
              <div
                key={id}
                id={`studio-view-${id}`}
                role="tabpanel"
                aria-labelledby={`studio-tab-${id}`}
                inert={!on}
                className={cn(
                  "col-start-1 row-start-1 flex min-w-0 flex-col transition-[opacity,visibility] duration-sheet ease-sheet motion-reduce:transition-none",
                  on ? "opacity-100" : "invisible opacity-0",
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-1 pb-4">
                  <h2 className="text-base font-medium">{copy.window.tabs[id]}</h2>
                  <p className="truncate text-sm tabular-nums text-muted-foreground">{meta[id]}</p>
                </div>
                {views[id]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Account({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {instructor.portrait && (
        <Image
          src={face(instructor.portrait, 96)}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full bg-muted object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{instructor.name}</p>
        <a
          href={instructor.href}
          className="relative inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 press after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 hover:text-foreground hover:underline"
        >
          {copy.window.profile}
          <ArrowUpRightIcon className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function agoOf(d: Draft): number | "now" {
  if ("ago" in d.edited) return d.edited.ago;
  const days = Math.floor((Date.now() - d.edited.at) / 86_400_000);
  return days <= 0 && Date.now() - d.edited.at < 60_000 ? "now" : Math.max(0, days);
}

/** The row of drafts: each one's lattice on its ink tile, its name, how far
 *  it has come, and the way onto the board. A delete leaves a line with its
 *  undo for six seconds. */
function DraftsPanel({ drafts, onOpen }: { drafts: Draft[]; onOpen: (id: string) => void }) {
  const [gone, setGone] = useState<{ title: string; undo: () => void } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoButton = useRef<HTMLButtonElement>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const remove = (d: Draft) => {
    const undo = deleteDraft(d.id);
    if (!undo) return;
    if (timer.current) clearTimeout(timer.current);
    setGone({ title: d.title, undo });
    timer.current = setTimeout(() => setGone(null), 6000);
    // the row is gone, so its undo takes the caret
    requestAnimationFrame(() => undoButton.current?.focus());
  };

  const rows = Math.max(4, ...drafts.flatMap((d) => d.chapters.map((c) => c.lessons.length)));

  return (
    <div className="flex min-w-0 flex-col rounded-md bg-accent p-1">
      <div className="flex flex-wrap items-center justify-between gap-x-3 py-1 pr-1 pl-4">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-sm font-medium">{copy.drafts.heading}</h3>
          <span className="text-sm tabular-nums text-muted-foreground">{drafts.length}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          render={
            <a
              href={copy.draft.href}
              onClick={(e) => {
                e.preventDefault();
                goTo("outline", "brief", true);
              }}
            />
          }
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} strokeWidth={1.8} data-icon="inline-start" />
          <span className="sm:hidden">{copy.drafts.addShort}</span>
          <span className="max-sm:hidden">{copy.drafts.add}</span>
        </Button>
      </div>
      <div className="mt-1 flex flex-1 flex-col rounded-sm bg-card ring-1 ring-border">
        {drafts.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{copy.drafts.empty}</p>
        ) : (
          <ul className="flex grow flex-col divide-y">
            {drafts.map((d) => (
              <DraftRow key={d.id} draft={d} rows={rows} onOpen={() => onOpen(d.id)} onRemove={() => remove(d)} />
            ))}
          </ul>
        )}
        {gone && (
          <p role="status" className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t px-4 py-2 text-sm">
            <span className="text-muted-foreground">{copy.drafts.removed(gone.title)}</span>
            <Button
              ref={undoButton}
              variant="ghost"
              size="sm"
              onClick={() => {
                gone.undo();
                setGone(null);
              }}
            >
              {copy.drafts.undo}
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}

function DraftRow({
  draft: d,
  rows,
  onOpen,
  onRemove,
}: {
  draft: Draft;
  rows: number;
  onOpen: () => void;
  onRemove: () => void;
}) {
  const c = countsOf(d);
  const progress =
    d.stage === "outline"
      ? copy.drafts.progress.outline(c.yours, c.lessons)
      : d.progress
        ? copy.drafts.progress[d.stage](d.progress.done, d.progress.total)
        : "";
  // The row opens the draft in the window's Outline, so the whole row is the button,
  // and its hover takes the row's corner inside the hairlines, which stay
  // straight. The menu of what else can be done to it stands beside it, and on
  // a phone in the row's top corner, so the chips and counts run the full width.
  return (
    <li className="relative flex grow items-center gap-1 px-2 py-1.5">
      <button
        type="button"
        aria-label={copy.drafts.openLabel(d.title)}
        onClick={onOpen}
        className="group/row flex min-w-0 flex-1 items-center gap-3 rounded-sm p-2 text-left transition-colors hover:bg-accent active:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4"
      >
        {/* a slab, so the ink tile and its light cells hold in the dark half */}
        <span className="slab w-14 shrink-0 self-start rounded-[calc(var(--radius-sm)-4px)] bg-foreground p-1.5 max-[359px]:hidden sm:w-20 sm:self-center sm:p-2">
          <Lattice
            columns={columnsOf(d)}
            rows={rows}
            cell="h-1.5"
            gap="gap-[3px]"
            drafted="border border-dashed border-[color-mix(in_oklab,var(--iris),white_20%)] bg-[color-mix(in_oklab,var(--iris)_14%,transparent)]"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 text-sm font-medium text-balance max-sm:pr-9">{d.title}</span>
          <span className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground">
            <span className="flex flex-wrap gap-1.5 text-xs">
              <span className="inline-flex h-6 items-center rounded-control bg-[color-mix(in_oklab,var(--iris)_12%,var(--card))] px-2.5 text-iris-ink">
                {copy.drafts.stage[d.stage]}
              </span>
              <span className="inline-flex h-6 items-center rounded-control bg-muted px-2.5 tabular-nums text-foreground">
                {copy.drafts.edited(agoOf(d))}
              </span>
            </span>
            <span className="tabular-nums max-md:basis-full sm:truncate">{progress}</span>
          </span>
          <span className="sr-only">{copy.drafts.read(d.title, c.yours, c.lessons)}</span>
        </span>
        <ArrowRightIcon className="hidden size-4 shrink-0 text-muted-foreground transition-transform group-hover/row:translate-x-0.5 group-hover/row:text-foreground sm:block" />
      </button>
      <Menu>
        <MenuTrigger
          aria-label={copy.drafts.more(d.title)}
          className="relative flex size-10 shrink-0 items-center justify-center rounded-control text-muted-foreground max-sm:absolute max-sm:top-1.5 max-sm:right-2 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-[popup-open]:bg-muted data-[popup-open]:text-foreground"
        >
          <HugeiconsIcon icon={MoreHorizontalIcon} size={18} strokeWidth={1.8} />
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => duplicateDraft(d.id, copy.drafts.copyOf(d.title))}>
            <HugeiconsIcon icon={Copy01Icon} size={16} strokeWidth={1.6} />
            {copy.drafts.duplicate}
          </MenuItem>
          <MenuItem onClick={onRemove}>
            <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.6} />
            {copy.drafts.remove}
          </MenuItem>
        </MenuContent>
      </Menu>
    </li>
  );
}

/** The payout card of the /teach hero, with the real month in it: what the
 *  month came to, the day it lands and how far the month has run towards
 *  it, and the way down to the month in full. */
function PayoutPanel({
  month,
  amount,
  due,
  sales,
  minutes,
  onMonth,
}: {
  month: string;
  amount: string;
  due: ReturnType<typeof nextPayday>;
  sales: number;
  minutes: number;
  onMonth: () => void;
}) {
  const p = copy.payoutCard;
  return (
    <div className="flex flex-col rounded-md bg-accent p-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2.5 pr-2 pl-4">
        <h3 className="text-sm font-medium">
          {month} {p.label}
        </h3>
        <span className="text-sm whitespace-nowrap text-muted-foreground">
          {due.left === 0 ? (
            p.today
          ) : (
            <>
              {p.lands} <span className="text-foreground">{due.label}</span>
            </>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col rounded-sm bg-card p-4 ring-1 ring-border">
        <p className="font-heading text-3xl tracking-tighter tabular-nums">{amount}</p>
        <div className="mt-4">
          <span aria-hidden="true" className="block h-2 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.round(due.run * 100)}%` }} />
          </span>
          <p className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{due.since}</span>
            <span>{due.left === 0 ? due.label : p.left(due.left)}</span>
          </p>
        </div>
        <p className="mt-4 mb-4 text-sm text-muted-foreground">{p.made(sales, figure(minutes))}</p>
        <Button variant="outline" size="sm" className="mt-auto w-fit" onClick={onMonth}>
          {copy.more}
        </Button>
      </div>
    </div>
  );
}

