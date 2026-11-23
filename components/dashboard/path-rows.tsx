"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Clock01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { courseById, courseHref, playerHref, type Course } from "@/components/course/courses";
import { useProgress } from "@/components/course/progress";
import { dashCopy, dayOf } from "@/components/dashboard/copy";
import { legStanding, pathOf } from "@/components/dashboard/path";
import { Seal } from "@/components/dashboard/seal";
import { type Shelf } from "@/components/dashboard/shelf";
import { useToday } from "@/components/dashboard/today";
import { goals, pathHref, type Goal } from "@/components/marketing/goals";
import { planOf, type LegPlan } from "@/components/paths/plan";
import { usePathChoices } from "@/components/paths/store";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const copy = dashCopy.path;

const pad = (n: number) => String(n).padStart(2, "0");

// Unsplash, free licence, hotlinked at the framing it was chosen at. A
// photograph for a leg's slab in place of its course's own, for the legs that
// have one; every other slab shows the course's photograph, as its card does.
const LEG_PHOTO: Partial<Record<string, string>> = {
  c1: "https://images.unsplash.com/photo-1690228254548-31ef53e40cd1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D",
};

const settled = (lp: LegPlan) => lp.state === "done" || lp.state === "known";

/** The leg the list opens on: the first under way, else the first still
 *  ahead, else the last. */
function firstOpen(legs: LegPlan[]) {
  const at = legs.findIndex((l) => l.state === "active");
  if (at >= 0) return at;
  const ahead = legs.findIndex((l) => l.state === "open");
  return ahead >= 0 ? ahead : legs.length - 1;
}

export function PathRows({ shelf, today: serverToday }: { shelf: Shelf; today: string }) {
  const p = useProgress();
  const choices = usePathChoices();
  const today = useToday(serverToday);
  const g = pathOf(p, choices);
  // undefined until the learner picks, so the default follows the record as
  // it loads. One leg is always open: pressing it again does nothing, and
  // opening another is the only way to fold it.
  const [picked, setPicked] = useState<number | undefined>(undefined);

  if (!g) {
    return (
      <section id="path" aria-labelledby="path-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <SectionHeading className="mt-5">
          <span id="path-title">{copy.empty.title}</span>
        </SectionHeading>
        <p className="mt-6 max-w-lg text-base text-muted-foreground">{copy.empty.body}</p>
        <Link
          href="/#paths"
          className="mt-8 inline-flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
        >
          {copy.empty.action}
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </section>
    );
  }

  const standing = legStanding(g, p, shelf);
  const plan = planOf(g, standing, choices.known[g.id] ?? [], choices.pace, today);
  const finished = plan.legs.filter(settled).length;
  const going = plan.legs.filter((l) => l.state === "active").length;
  const kept = goals.filter((x) => x.id !== g.id && choices.saved.includes(x.id));
  const open = picked === undefined ? firstOpen(plan.legs) : picked;

  return (
    <section id="path" aria-labelledby="path-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* The reference's head: the heading at the left, the lede low at the
          right, level with the heading's last line. */}
      <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">
            <span id="path-title">{copy.title(g.short)}</span>
          </SectionHeading>
        </div>
        <div className="lg:justify-self-end">
          {/* balanced, since the date in it moves with the pace and the day */}
          <p className="max-w-md text-balance text-base text-muted-foreground">
            {copy.lede(finished, g.legs.length, going, plan.left, choices.pace, dayOf(plan.finish, today))}
          </p>
          <Link
            href={pathHref(g)}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-control px-4 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
          >
            {copy.open}
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>

      <ol className="mt-14">
        {g.legs.map((leg, i) => (
          <LegRow
            key={leg.course}
            g={g}
            n={i}
            legs={plan.legs}
            course={courseById(leg.course) as Course}
            finishedOn={p.finished[leg.course]}
            finish={dayOf(plan.finish, today)}
            today={today}
            open={open === i}
            onOpen={() => setPicked(i)}
            onPick={(k) => {
              setPicked(k);
              // the tile pressed goes with the slab it sat on, so focus
              // follows the reader to the head of the leg now open
              window.setTimeout(() => document.getElementById(`leg-${k}-toggle`)?.focus());
            }}
          />
        ))}
      </ol>

      {kept.length > 0 && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
          <p className="text-sm text-muted-foreground">{copy.kept}</p>
          <ul className="flex flex-wrap gap-2">
            {kept.map((x) => (
              <li key={x.id}>
                <KeptPath goal={x} done={legStanding(x, p, shelf).filter((s) => s.done >= 1).length} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** Where the learner stands on a leg, as the chip at the row's right. */
function chipOf(lp: LegPlan, waiting: number[]) {
  if (lp.state === "done") return { label: copy.state.done, tone: "done" as const };
  if (lp.state === "known") return { label: copy.state.known, tone: "quiet" as const };
  if (lp.state === "active") return { label: copy.left(lp.left), tone: "going" as const };
  if (waiting.length) return { label: copy.state.after(waiting.map((k) => k + 1)), tone: "wait" as const };
  return { label: lp.weeks ? copy.weeks(lp.weeks.from, lp.weeks.to) : copy.state.ready, tone: "quiet" as const };
}

/** One leg: a row on the list's hairlines while closed, and the reference's
 *  dark slab once open, its header the same row so the label, the title and
 *  the arrow do not move as it opens. */
function LegRow({
  g,
  n,
  legs,
  course: c,
  finishedOn,
  finish,
  today,
  open,
  onOpen,
  onPick,
}: {
  g: Goal;
  n: number;
  legs: LegPlan[];
  course: Course;
  finishedOn?: string;
  /** The day the whole path ends, already worded. */
  finish: string;
  today: string;
  open: boolean;
  onOpen: () => void;
  onPick: (k: number) => void;
}) {
  const leg = g.legs[n];
  const lp = legs[n];
  const waiting = leg.needs.filter((k) => !settled(legs[k]));
  const chip = chipOf(lp, waiting);
  const panel = `leg-${n}-panel`;
  const title = `leg-${n}-title`;
  // The body is only in the page while the row is open, and for the length
  // of the fold after it closes, so a closed row holds no links a reader
  // (or a crawler walking the page) can land on without seeing.
  const [held, setHeld] = useState(open);
  if (open && !held) setHeld(true);
  useEffect(() => {
    if (open || !held) return;
    const t = window.setTimeout(() => setHeld(false), 470);
    return () => window.clearTimeout(t);
  }, [open, held]);

  return (
    <li
      data-open={open || undefined}
      data-slab={open || undefined}
      className={cn(
        // The hairlines are the rows' own ::before, and the last row's
        // ::after, so no row's corner bends a rule; they fade either side of
        // the slab and of a hovered row, whose radius would meet them.
        "group/leg relative rounded-lg transition-colors duration-sheet ease-sheet motion-reduce:transition-none",
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-border before:transition-opacity",
        "last:after:absolute last:after:inset-x-0 last:after:bottom-0 last:after:h-px last:after:bg-border last:after:transition-opacity",
        "[[data-open]+&]:before:opacity-0 [li:has(>div>button:hover)+&]:before:opacity-0",
        // The open row is the slab: in the dark half the ink panel would be
        // the brightest thing on the page; `data-slab` (what `slab` is, read
        // off the attribute) turns it into a raised dark rung instead.
        "data-open:bg-foreground data-open:text-background data-open:before:opacity-0 data-open:last:after:opacity-0",
        "not-data-open:has-[>div>button:hover]:before:opacity-0 not-data-open:last:has-[>div>button:hover]:after:opacity-0",
      )}
    >
      {/* The row's head. The label stays out of the heading, which is one
          voice, and the button is a clear layer under the whole head, named
          by the heading: a closed row is pressed anywhere, and the button's
          own box is what wears the hover and the focus ring. What sits on it
          lets the pointer through. */}
      <div
        className={cn(
          "group/row relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 px-5 py-6 sm:px-8 sm:py-7 lg:grid-cols-[10rem_minmax(0,1fr)_auto]",
          // open, the title's second line follows close under it
          open && "pb-3 sm:pb-3",
        )}
      >
        <button
          id={`leg-${n}-toggle`}
          type="button"
          aria-expanded={open}
          aria-controls={panel}
          aria-labelledby={title}
          // open, it cannot fold, which is what aria-disabled says of an
          // accordion header; it stays in the tab order so the slab keeps a
          // way in from the keyboard
          aria-disabled={open || undefined}
          onClick={open ? undefined : onOpen}
          className={cn(
            "absolute inset-0 -z-10 rounded-lg transition-colors outline-none",
            // full strength, as the Button's own edge is: at /50 the brand's
            // ring on a near-white row is too faint to read as focus; on the
            // slab it turns to the page's ink
            "aria-expanded:cursor-default aria-expanded:focus-visible:ring-3 aria-expanded:focus-visible:ring-background/60",
            "not-aria-expanded:cursor-pointer not-aria-expanded:hover:bg-accent not-aria-expanded:active:bg-muted not-aria-expanded:focus-visible:ring-3 not-aria-expanded:focus-visible:ring-ring",
          )}
        />
        <Caps as="span" className={cn("pointer-events-none col-span-2 lg:col-span-1", open && "text-background/70")}>
          {copy.leg(pad(n + 1))}
        </Caps>
        <h3 id={title} className="pointer-events-none flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-2xl tracking-tight sm:text-3xl">{leg.short}</span>
          <span className={cn("text-sm tabular-nums", open ? "text-background/70" : "text-muted-foreground")}>
            {copy.hours(leg.hours)}
          </span>
        </h3>
        <span className="pointer-events-none flex items-center gap-4 max-sm:row-span-2">
          <Chip tone={chip.tone} dark={open} className="max-sm:hidden">
            {chip.label}
          </Chip>
          {/* the reference's circled arrow, turned down on the open row */}
          <span
            aria-hidden="true"
            className={cn(
              "flex size-10 items-center justify-center rounded-full transition-colors",
              open ? "bg-background text-foreground" : "ring-1 ring-inset ring-border group-has-[>button:hover]/row:bg-card",
            )}
          >
            <ArrowRightIcon
              className={cn("size-4 transition-[rotate] motion-reduce:transition-none", open && "rotate-90")}
            />
          </span>
        </span>
        {/* a phone has no room at the right, so the chip drops under the title */}
        <span className="pointer-events-none sm:hidden">
          <Chip tone={chip.tone} dark={open}>
            {chip.label}
          </Chip>
        </span>
      </div>

      {/* The slab's body, grown from nothing so the row under it slides
          rather than jumps. */}
      <div
        id={panel}
        role="region"
        aria-label={leg.short}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-sheet ease-sheet motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {(open || held) && (
            <Slab
              g={g}
              n={n}
              legs={legs}
              course={c}
              waiting={waiting}
              finishedOn={finishedOn}
              finish={finish}
              today={today}
              onPick={onPick}
            />
          )}
        </div>
      </div>
    </li>
  );
}

/** The open leg: why it stands where it does, three figures, its calls; then
 *  the course's photograph and the tile of legs it waits on or opens. The
 *  copy starts under the title, as the reference's does. */
function Slab({
  g,
  n,
  legs,
  course: c,
  waiting,
  finishedOn,
  finish,
  today,
  onPick,
}: {
  g: Goal;
  n: number;
  legs: LegPlan[];
  course: Course;
  waiting: number[];
  finishedOn?: string;
  finish: string;
  today: string;
  onPick: (k: number) => void;
}) {
  const leg = g.legs[n];
  const lp = legs[n];

  return (
    <div className="grid gap-10 px-5 pb-5 sm:px-8 sm:pb-8 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-x-6 xl:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1.35fr)]">
      {/* Why the leg stands where it does, as the title's second line. Every
          leg's reason, on every path, runs to one line from 604px, so the
          line is given the width of both columns rather than fitted in a
          narrow one. Under xl the photograph and its tile drop under the
          figures, where a third column would leave a leg's name 79px. */}
      <p className="max-w-2xl text-base text-background/75 lg:col-start-2 xl:col-[2/span_2]">
        {lp.state === "known" ? copy.knownBody : leg.why}
      </p>

      <div className="flex flex-col justify-end lg:col-start-2 xl:pr-10">
        {/* Three figures, a hairline over them, as the leg's readout. Each
            label holds one line at every width: a phone's third of the slab
            is 66px and "weeks of your plan" is 121, so there each figure is a
            row with its label beside it, and from sm a column over it. */}
        <dl className="grid gap-3 border-t border-background/15 pt-5 sm:grid-cols-3 sm:gap-4">
          {factsOf(lp, leg.hours, finishedOn).map((f) => (
            <div key={f.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline sm:flex sm:flex-col sm:gap-1">
              <dt className="order-2 text-sm whitespace-nowrap text-background/70">{f.label}</dt>
              <dd className="order-1 font-heading text-2xl tracking-tight tabular-nums sm:text-3xl">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Actions lp={lp} course={c} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] sm:gap-4 lg:col-start-2 xl:col-start-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-background/10 sm:aspect-square">
          <Image
            src={LEG_PHOTO[c.id] ?? c.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 234px, (min-width: 1024px) calc(44.5vw - 147px), (min-width: 640px) calc(44.4vw - 64px), calc(100vw - 88px)"
            className={cn("object-cover", !LEG_PHOTO[c.id] && c.focus === "bottom" && "object-bottom")}
          />
          <span className="slab-reset absolute bottom-3 left-3 right-3 truncate rounded-control bg-card/85 px-3 py-1.5 text-sm text-foreground backdrop-blur-md">
            {c.school}
          </span>
        </div>
        <Links g={g} n={n} legs={legs} waiting={waiting} finishedOn={finishedOn} finish={finish} today={today} onPick={onPick} />
      </div>
    </div>
  );
}

/** The leg's three figures, which change with where the learner stands. */
function factsOf(lp: LegPlan, hours: number, finishedOn: string | undefined) {
  const f = copy.facts;
  const pct = `${Math.round(lp.done * 100)}%`;
  const weeks = lp.weeks
    ? {
        value: lp.weeks.from === lp.weeks.to ? `${lp.weeks.from}` : `${lp.weeks.from}–${lp.weeks.to}`,
        label: lp.weeks.from === lp.weeks.to ? f.week : f.weeks,
      }
    : null;
  if (lp.state === "done") {
    const when = finishedOn ? new Date(`${finishedOn}T12:00:00Z`) : null;
    return [
      { value: `${hours}`, label: f.studied },
      { value: "100%", label: f.done },
      when
        ? {
            value: when.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
            label: f.finished,
          }
        : { value: "—", label: f.off },
    ];
  }
  if (lp.state === "known") return [{ value: `${hours}`, label: f.skipped }, { value: "0", label: f.left }, { value: "—", label: f.off }];
  if (lp.state === "active") return [{ value: `${lp.left}`, label: f.left }, { value: pct, label: f.done }, weeks ?? { value: "—", label: f.off }];
  return [{ value: `${hours}`, label: f.hours }, { value: pct, label: f.done }, weeks ?? { value: "—", label: f.off }];
}

/** The slab's calls: the one that moves the leg on in the brand, the
 *  course's own page beside it in outline. */
function Actions({ lp, course: c }: { lp: LegPlan; course: Course }) {
  const a = copy.actions;
  const outline =
    "inline-flex h-10 items-center gap-2 rounded-control px-5 text-sm font-medium ring-1 ring-inset ring-background/25 press outline-none hover:bg-background/10 focus-visible:ring-3 focus-visible:ring-background/60";
  const primary =
    "inline-flex h-10 items-center gap-2 rounded-control bg-primary px-5 text-sm font-medium text-primary-foreground press outline-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-background/60";

  if (lp.state === "done" || lp.state === "known") {
    return (
      <>
        <Link href={lp.state === "done" ? playerHref(c) : courseHref(c)} className={outline}>
          {lp.state === "done" ? a.review : a.view}
        </Link>
        {lp.state === "done" && (
          <a href="#certificates" className={outline}>
            {copy.links.cert}
          </a>
        )}
      </>
    );
  }
  return (
    <>
      <Link href={lp.state === "active" ? playerHref(c) : courseHref(c)} className={primary}>
        {lp.state === "active" ? (lp.done > 0 ? a.resume : a.start) : a.view}
        <ArrowRightIcon aria-hidden="true" className="size-4" />
      </Link>
      {lp.state === "active" && (
        <Link href={courseHref(c)} className={outline}>
          {a.page}
        </Link>
      )}
    </>
  );
}

/** The slab's second tile: how the leg ties into the path. The legs it waits
 *  on while any is unfinished, else the legs it opens the way to, each a
 *  button that opens that leg; a finished leg shows its seal, and the last
 *  leg the path's certificate. */
function Links({
  g,
  n,
  legs,
  waiting,
  finishedOn,
  finish,
  today,
  onPick,
}: {
  g: Goal;
  n: number;
  legs: LegPlan[];
  waiting: number[];
  finishedOn?: string;
  finish: string;
  today: string;
  onPick: (k: number) => void;
}) {
  const l = copy.links;
  const lp = legs[n];
  const opens = g.legs.flatMap((x, k) => (x.needs.includes(n) ? [k] : []));
  const tile = "flex min-h-44 flex-col gap-6 rounded-sm bg-background/[0.07] p-4 ring-1 ring-inset ring-background/10 sm:p-5";

  if (lp.state === "done" || lp.state === "known") {
    return (
      <div className={cn(tile, "justify-between")}>
        <Caps className="text-background/70">{lp.state === "done" ? l.cert : l.known}</Caps>
        <div>
          {lp.state === "done" ? (
            <Seal className="size-14 sm:size-16" />
          ) : (
            <span className="flex size-14 items-center justify-center rounded-full bg-background text-foreground sm:size-16">
              <HugeiconsIcon icon={Tick02Icon} size={24} strokeWidth={2.4} />
            </span>
          )}
          {finishedOn && (
            <p className="mt-4 text-sm text-background/75">{copy.finished(dayOf(finishedOn, today))}</p>
          )}
        </div>
      </div>
    );
  }

  const list = waiting.length ? waiting : opens;
  if (!list.length) {
    return (
      <div className={cn(tile, "justify-between")}>
        <Caps className="text-background/70">{l.ends}</Caps>
        <div>
          <Seal className="size-14 sm:size-16" />
          <p className="mt-4 text-sm text-background/75">{copy.pathCert}</p>
          <p className="mt-1 text-sm font-medium tabular-nums">{finish}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={tile}>
      <Caps className="text-background/70">{waiting.length ? l.first : l.opens}</Caps>
      {/* Each leg on a pale row of its own, its edges flush with the label's
          and the tile's, so the label and the rows stand in one column; the
          arrow says the row opens that leg. */}
      <ul className="mt-auto flex flex-col gap-2">
        {list.map((k) => (
          <li key={k}>
            <button
              type="button"
              onClick={() => onPick(k)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-sm bg-background/[0.06] py-2 pr-3 pl-2 text-left text-sm transition-colors outline-none hover:bg-background/[0.12] active:bg-background/[0.16] focus-visible:ring-3 focus-visible:ring-background/60"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background/10 text-xs font-medium tabular-nums">
                {pad(k + 1)}
              </span>
              <span className="min-w-0 flex-1 font-medium">{g.legs[k].short}</span>
              <ArrowRightIcon aria-hidden="true" className="size-4 shrink-0 text-background/70" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The row's standing, as a flipped-contrast chip: a finished leg in green,
 *  the one under way in the brand, the rest grey. On the slab every tone
 *  goes to one pale chip, since a pastel on near-black reads as a hole. */
function Chip({
  tone,
  dark,
  className,
  children,
}: {
  tone: "done" | "going" | "wait" | "quiet";
  dark: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-control px-3 text-sm whitespace-nowrap",
        dark
          ? "bg-background/10 text-background"
          : tone === "done"
            ? "bg-leaf/15 text-leaf-ink"
            : tone === "going"
              ? "bg-chip text-primary-ink"
              : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {tone === "done" && <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2.2} aria-hidden="true" />}
      {tone === "wait" && <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Another path the learner kept, with how many of its legs are behind them. */
function KeptPath({ goal: g, done }: { goal: Goal; done: number }) {
  return (
    <Link
      href={pathHref(g)}
      className="flex h-10 items-center gap-2 rounded-control bg-card px-4 text-sm shadow-soft press hover:shadow-soft-lg active:shadow-none"
    >
      <g.Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      <span className="font-medium">{g.short}</span>
      <span className="text-muted-foreground">{done ? copy.legsDone(done, g.legs.length) : copy.none}</span>
    </Link>
  );
}
