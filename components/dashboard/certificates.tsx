"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  Certificate01Icon,
  Copy01Icon,
  Download04Icon,
  Linkedin01Icon,
  Tick02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { courseById, type Course } from "@/components/course/courses";
import { useProgress } from "@/components/course/progress";
import {
  certificateOf,
  certificateSvg,
  issuedOn,
  linkedInHref,
  viewsOf,
  type Certificate,
} from "@/components/dashboard/certificate";
import { dashCopy } from "@/components/dashboard/copy";
import { learner } from "@/components/dashboard/learner";
import { legStanding, pathOf } from "@/components/dashboard/path";
import { finishedCourses, type Shelf } from "@/components/dashboard/shelf";
import { useToday } from "@/components/dashboard/today";
import { download } from "@/components/learn/transcript";
import { pathHref, type Goal } from "@/components/marketing/goals";
import { usePathChoices } from "@/components/paths/store";
import { Seal } from "@/components/dashboard/seal";
import { Logo } from "@/components/site/logo";
import { Caps } from "@/components/ui/caps";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn, slugify } from "@/lib/utils";

const copy = dashCopy.certificates;

// The solid disc a light glyph sits on: iris taken a step deeper, where the
// glyph clears 4.3:1.
const deep = "bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card";
// the same disc read off the open row's aria-expanded
const deepWhenOpen =
  "group-aria-expanded/row:bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] group-aria-expanded/row:text-card group-aria-expanded/row:group-hover/row:bg-iris-ink";

// The frame's art: the brand alone, paler at the top and deeper at the foot,
// as the design's one green runs, with a soft light across it. Mixed from
// --primary, so the art turns with the brand.
const art =
  "bg-[radial-gradient(75%_65%_at_8%_0%,color-mix(in_oklab,var(--primary)_28%,white)_0%,transparent_70%),radial-gradient(60%_55%_at_100%_8%,color-mix(in_oklab,var(--primary)_50%,white)_0%,transparent_72%),radial-gradient(80%_70%_at_85%_100%,color-mix(in_oklab,var(--primary)_80%,var(--primary-ink))_0%,transparent_72%),linear-gradient(165deg,color-mix(in_oklab,var(--primary)_45%,white),color-mix(in_oklab,var(--primary)_92%,var(--primary-ink)))]";
const sheen =
  "bg-[linear-gradient(100deg,transparent_22%,color-mix(in_oklab,white_55%,transparent)_38%,transparent_54%)] mix-blend-soft-light";

type Item =
  | { kind: "cert"; id: string; cert: Certificate }
  | { kind: "path"; id: "path"; goal: Goal; legs: boolean[] };

export function Certificates({ shelf, today: serverToday }: { shelf: Shelf; today: string }) {
  const p = useProgress();
  const choices = usePathChoices();
  const today = useToday(serverToday);
  const certs = finishedCourses(p, shelf).map((id) => {
    const c = courseById(id) as Course;
    const project = shelf[id].flatMap((m) => m.items).find((i) => i.kind === "project")?.title ?? "";
    return certificateOf(c, p.finished[id] ?? today, project);
  });
  const g = pathOf(p, choices);
  const legs = g
    ? legStanding(g, p, shelf).map((s, i) => s.done >= 1 || (choices.known[g.id] ?? []).includes(g.legs[i].course))
    : [];
  const items: Item[] = [
    ...certs.map((cert) => ({ kind: "cert" as const, id: cert.id, cert })),
    ...(g ? [{ kind: "path" as const, id: "path" as const, goal: g, legs }] : []),
  ];
  // Which row is open, the first until one is pressed, and which
  // certificate the frame shows: the row opened last, so closing a row leaves
  // its certificate in the frame rather than emptying it.
  const [expanded, setExpanded] = useState<string | null | undefined>(undefined);
  const [shown, setShown] = useState<string | null>(null);
  const openId = expanded === undefined ? (items[0]?.id ?? null) : expanded;
  const open = items.find((x) => x.id === (shown ?? openId)) ?? items[0] ?? null;
  const toggle = (id: string) => {
    if (openId === id) return setExpanded(null);
    setExpanded(id);
    setShown(id);
  };

  return (
    <section id="certificates" aria-labelledby="certificates-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,10fr)_minmax(0,11fr)] lg:gap-12">
        <div>
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">
            <span id="certificates-title">
              {copy.title[0]} <Highlight>{copy.title[1]}</Highlight>
            </span>
          </SectionHeading>
          {open ? (
            <>
              <Rail at={items.indexOf(open)} of={items.length} />
              <ul className="divide-y divide-border border-b border-border">
                {items.map((item) => (
                  <Row key={item.id} item={item} open={item.id === openId} onToggle={() => toggle(item.id)} />
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-8 max-w-md text-base text-muted-foreground">{copy.empty}</p>
          )}
        </div>
        <Showcase item={open} />
      </div>
    </section>
  );
}

/** The reference's rail over the first row: lit from the left as far as the
 *  open row's place in the list, with the dot at its end. */
function Rail({ at, of }: { at: number; of: number }) {
  return (
    <div aria-hidden="true" className="relative mt-10 h-px bg-border">
      <span
        style={{ width: `${((at + 1) / of) * 100}%` }}
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary transition-[width] motion-reduce:transition-none"
      >
        <span className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary" />
      </span>
    </div>
  );
}

/** One row of the accordion: a certificate, or the path's. Opening one
 *  closes the one before and puts its certificate in the frame. */
function Row({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  const head = `cert-row-${item.id}`;
  const body = `cert-body-${item.id}`;
  const done = item.kind === "path" ? item.legs.filter(Boolean).length : 0;

  return (
    <li>
      <h3>
        <button
          id={head}
          type="button"
          aria-expanded={open}
          aria-controls={body}
          onClick={onToggle}
          className="group/row flex w-full items-center gap-4 py-5 text-left"
        >
          <span
            aria-hidden="true"
            className={cn(
              // The row has no fill to move, so the press lands on its tile.
              "flex size-11 shrink-0 items-center justify-center rounded-control transition-[color,background-color,scale] group-active/row:scale-[0.97]",
              deepWhenOpen,
              "not-group-aria-expanded/row:bg-muted not-group-aria-expanded/row:text-muted-foreground not-group-aria-expanded/row:group-hover/row:bg-secondary not-group-aria-expanded/row:group-hover/row:text-foreground",
            )}
          >
            {item.kind === "cert" ? (
              <HugeiconsIcon icon={Certificate01Icon} size={20} strokeWidth={1.7} />
            ) : (
              <item.goal.Icon className="size-5" />
            )}
          </span>
          <span className="min-w-0 flex-1 text-balance text-xl tracking-tight">
            {item.kind === "cert" ? item.cert.course.title : copy.path.title(item.goal.short)}
          </span>
          {/* in the heading's own weight, since it is read as part of it */}
          {item.kind === "path" && (
            <span className="shrink-0 rounded-control bg-muted px-2.5 py-1 text-xs tabular-nums">
              {copy.path.chip(done, item.legs.length)}
            </span>
          )}
        </button>
      </h3>
      <div id={body} role="region" aria-labelledby={head} hidden={!open} className="pb-6 sm:pl-15">
        {item.kind === "cert" ? (
          <>
            <p className="text-base text-muted-foreground">
              {copy.issued(item.cert.kind, issuedOn(item.cert.issued))}
              <br />
              {copy.detail(item.cert.hours)}
            </p>
            <Actions cert={item.cert} className="mt-5" />
          </>
        ) : (
          <>
            <p className="max-w-md text-pretty text-base text-muted-foreground">{copy.path.body}</p>
            <Link
              href={pathHref(item.goal)}
              className="mt-5 flex h-10 w-fit items-center gap-2 rounded-control bg-card px-3.5 text-sm font-medium ring-1 ring-inset ring-border press hover:bg-accent"
            >
              {copy.path.open}
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </>
        )}
      </div>
    </li>
  );
}

/** The reference's framed card: the open certificate inset on the brand's
 *  gradient, the hand over it pointing at its code, and its views lapping the
 *  frame's lower left. */
function Showcase({ item }: { item: Item | null }) {
  return (
    // The sheets share one height, so opening a row never moves the page
    // below it. The views card sits on the frame's top left corner, turned a
    // few degrees, and the room it rises into is kept over the frame: the
    // hand's room from lg, and room of its own below that.
    <div className="relative pt-20 sm:pt-12 lg:pt-28">
      {item?.kind === "cert" && <Note />}
      <div className="relative">
        <div data-picture aria-hidden="true" className={cn("relative overflow-hidden rounded-lg p-5 sm:p-9", art)}>
          <span className={cn("pointer-events-none absolute inset-0", sheen)} />
          <div
            key={item?.id ?? "none"}
            className="relative motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.98] motion-safe:duration-sheet motion-safe:ease-sheet"
          >
            {!item ? (
              <GhostSheet />
            ) : item.kind === "cert" ? (
              <CertSheet cert={item.cert} />
            ) : (
              <PathSheet goal={item.goal} legs={item.legs} />
            )}
          </div>
        </div>
        {item?.kind === "cert" && <Views key={item.id} cert={item.cert} />}
      </div>
    </div>
  );
}

/** The hand: two lines in the heading face, turned a little, and an arrow
 *  that leaves them and bends down onto the certificate's code. From lg,
 *  where the frame has the room above it; below it the code still stands on
 *  the sheet, and Copy link hands its address over. */
function Note() {
  return (
    <p className="pointer-events-none absolute right-20 top-0 z-10 hidden items-start gap-1 lg:flex">
      <span className="mt-2 inline-block -rotate-2 font-heading text-xl tracking-tight">
        {copy.note[0]}
        <br />
        {copy.note[1]}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 80 172"
        fill="none"
        className="h-43 w-20 shrink-0 overflow-visible text-foreground motion-safe:animate-scribble"
      >
        <path
          d="M4 22C34 10 66 20 68 58C70 96 50 128 42 166"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="motion-safe:animate-scribble-shaft"
        />
        <path
          d="M34.5 157Q38.5 161.5 42 166Q46.5 161 51 157.5"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="motion-safe:animate-scribble-head"
        />
      </svg>
    </p>
  );
}

/** The certificate as a sheet: the mark and its code, what it is and for
 *  which course, the holder at the size a certificate sets a name, when and
 *  from whom, and the seal. The file Download saves carries the same lines. */
function CertSheet({ cert, large = false }: { cert: Certificate; large?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-sm bg-card text-left shadow-soft",
        large ? "p-8 sm:p-12" : "p-6 sm:min-h-[26.5rem] lg:max-xl:min-h-[28rem] sm:p-8",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <Logo className={cn("font-heading", large ? "text-3xl" : "text-2xl")} />
        <span className="rounded-control bg-muted px-2.5 py-1 font-mono text-xs tabular-nums">{cert.id}</span>
      </div>
      <Caps className={large ? "mt-12" : "mt-8"}>{cert.kind}</Caps>
      <p className="mt-3 text-balance font-heading text-3xl tracking-tighter">{cert.course.title}</p>
      <p className={cn("mt-2 text-muted-foreground", large ? "text-base" : "text-sm")}>
        {cert.course.school} · {copy.detail(cert.hours)}
        {large && ` ${copy.project(cert.project)}`}
      </p>
      <div className={cn("mt-auto", large ? "pt-12" : "pt-8")}>
        <Caps>{copy.to}</Caps>
        <p className="mt-2 font-heading text-3xl tracking-tighter">{learner.name}</p>
      </div>
      <div className={cn("flex items-end justify-between gap-6 border-t", large ? "mt-8 pt-6" : "mt-6 pt-5")}>
        <dl className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-8">
          {[
            [copy.issuedLabel, issuedOn(cert.issued)],
            [copy.instructor, cert.course.instructor],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <Caps as="dt">{k}</Caps>
              <dd className={cn("mt-1 truncate", large ? "text-base" : "text-sm")}>{v}</dd>
            </div>
          ))}
        </dl>
        <Seal className={large ? "size-20" : "size-16"} />
      </div>
      {large && <p className="mt-6 font-mono text-xs text-muted-foreground">{cert.url}</p>}
    </div>
  );
}

/** The path's certificate as far as it has come: its five courses, ticked as
 *  they are finished, and how many of the five are behind the learner. */
function PathSheet({ goal: g, legs }: { goal: Goal; legs: boolean[] }) {
  const done = legs.filter(Boolean).length;
  return (
    <div className="rounded-sm bg-card p-6 text-left shadow-soft sm:min-h-[26.5rem] lg:max-xl:min-h-[28rem] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <Logo className="font-heading text-2xl" />
        <span className="rounded-control bg-muted px-2.5 py-1 text-xs font-medium tabular-nums">
          {copy.path.chip(done, g.legs.length)}
        </span>
      </div>
      <Caps className="mt-8">{copy.path.kind}</Caps>
      <p className="mt-3 font-heading text-3xl tracking-tighter">{g.short}</p>
      <ol className="mt-5 border-t">
        {g.legs.map((l, i) => (
          <li key={l.course} className="flex items-center gap-3 border-b py-2.5 text-sm last:border-b-0">
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full",
                legs[i] ? deep : "ring-1 ring-inset ring-foreground/20",
              )}
            >
              {legs[i] && <HugeiconsIcon icon={Tick02Icon} size={11} strokeWidth={2.5} />}
            </span>
            <span className={cn("min-w-0 flex-1 truncate", !legs[i] && "text-muted-foreground")}>{l.title}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{l.hours} h</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Before a first certificate: the sheet with nothing on it yet. */
function GhostSheet() {
  return (
    <div className="flex min-h-80 flex-col justify-between rounded-sm bg-card p-6 text-left shadow-soft sm:min-h-[26.5rem] lg:max-xl:min-h-[28rem] sm:p-8">
      <Logo className="font-heading text-2xl" />
      <div>
        <Caps>{copy.ghost}</Caps>
        <span className="mt-4 block h-3 w-3/4 rounded-full bg-muted" />
        <span className="mt-3 block h-3 w-1/2 rounded-full bg-muted" />
      </div>
    </div>
  );
}

/** The reference's small card lapping the frame, laid on its side and turned
 *  a few degrees on the frame's top left corner: the weeks as a line, this
 *  month's views, and how far past last month. */
function Views({ cert }: { cert: Certificate }) {
  const v = viewsOf(cert);
  const max = Math.max(...v.weeks);
  const w = 64;
  const pts = v.weeks.map((x, i) => [(i / (v.weeks.length - 1)) * (w - 6) + 3, 25 - (x / max) * 20] as const);
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = pts[pts.length - 1];

  return (
    // Over the corner from sm, 24px above the frame and out past its left
    // edge, 24px from lg where the columns' gap takes it. A phone's frame and
    // sheet are thinner at the top and there is no margin to lean out into,
    // so there it rides higher, clear of the mark on the sheet.
    <div
      data-object
      className="absolute -top-16 left-3 flex -rotate-6 items-center gap-4 rounded-lg bg-card py-3 pl-3 pr-5 shadow-soft-lg sm:-top-6 sm:-left-4 lg:-left-6"
    >
      <span aria-hidden="true" className="flex h-12 w-20 shrink-0 items-center justify-center rounded-sm bg-accent">
        <svg viewBox={`0 0 ${w} 28`} className="h-7 w-16 overflow-visible">
          <polyline
            points={line}
            fill="none"
            stroke="var(--primary-ink)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={lx} cy={ly} r="3.5" fill="var(--primary-ink)" stroke="var(--accent)" strokeWidth="2" />
        </svg>
      </span>
      <div className="min-w-0">
        <p className="flex items-baseline gap-2">
          <span className="font-heading text-2xl tracking-tight tabular-nums">{v.month}</span>
          <span className="text-sm">{copy.views.label}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium tabular-nums text-primary-ink">{copy.views.more(v.more)}</span>
          {copy.views.after}
        </p>
      </div>
    </div>
  );
}

/** View opens the certificate at full size; the other three leave with it. */
function Actions({ cert, className, inDialog = false }: { cert: Certificate; className?: string; inDialog?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${cert.url}`);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard refused (an insecure origin, a denied permission): the
      // address is printed on the certificate for copying by hand.
    }
  };

  const button =
    "flex h-10 items-center justify-center gap-2 rounded-control bg-card px-3 text-sm font-medium whitespace-nowrap ring-1 ring-inset ring-border press hover:bg-accent";

  // One row where the four fit it, and two by two where they do not, so
  // Add to LinkedIn never wraps onto a line of its own.
  return (
    <div
      className={cn(
        "gap-1.5",
        inDialog ? "flex flex-wrap" : "grid grid-cols-2 sm:flex sm:flex-wrap lg:grid xl:flex",
        className,
      )}
    >
      {!inDialog && <ViewButton cert={cert} className={button} />}
      <button
        type="button"
        onClick={() => download(`${slugify(cert.course.title)}-certificate.svg`, certificateSvg(cert), "image/svg+xml")}
        className={button}
      >
        <Glyph icon={Download04Icon} />
        {copy.download}
        <span className="sr-only">{copy.of(cert.course.title)}</span>
      </button>
      <button type="button" onClick={copyLink} className={button}>
        <Glyph icon={copied ? Tick02Icon : Copy01Icon} />
        <span aria-live="polite">{copied ? copy.copied : copy.copy}</span>
        <span className="sr-only">{copy.of(cert.course.title)}</span>
      </button>
      <a href={linkedInHref(cert)} target="_blank" rel="noopener noreferrer" className={button}>
        <Glyph icon={Linkedin01Icon} />
        {/* a 320px screen gives the button 133px, and the whole label wants
            152, so there the verb is read out rather than shown */}
        <span>
          <span className="max-[24rem]:sr-only">{copy.linkedin[0]} </span>
          {copy.linkedin[1]}
        </span>
        <span className="sr-only">{copy.of(cert.course.title)}</span>
      </a>
    </div>
  );
}

function Glyph({ icon }: { icon: IconSvgElement }) {
  return <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} aria-hidden="true" />;
}

/** The certificate at full size, in a dialog with the same three ways out. */
function ViewButton({ cert, className }: { cert: Certificate; className: string }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button type="button" className={className}>
            <Glyph icon={ViewIcon} />
            {copy.view}
            <span className="sr-only">{copy.of(cert.course.title)}</span>
          </button>
        }
      />
      <DialogContent className="sm:max-w-3xl">
        <div className="relative flex shrink-0 flex-col items-center justify-center border-b px-14 py-4 text-center">
          <DialogTitle>{cert.course.title}</DialogTitle>
          <DialogDescription className="mt-0.5">
            {copy.issuedTo(learner.name, issuedOn(cert.issued))}
          </DialogDescription>
          <DialogCloseButton label={copy.close} className="absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain bg-accent p-4 sm:p-8">
          <CertSheet cert={cert} large />
        </div>
        <Actions cert={cert} inDialog className="shrink-0 justify-center border-t px-6 py-4" />
      </DialogContent>
    </Dialog>
  );
}
