"use client";

import Image from "next/image";
import {
  Calendar03Icon,
  Certificate01Icon,
  Pen01Icon,
  Route01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { authCopy, signUpCopy } from "@/components/auth/copy";
import { AUTH_PHOTO } from "@/components/auth/frame";
import {
  goalOf,
  initialsOf,
  type SignUpValues,
} from "@/components/auth/sign-up-model";
import { Logo } from "@/components/site/logo";
import { Caps } from "@/components/ui/caps";
import { cn } from "@/lib/utils";

const copy = signUpCopy.preview;

// The glyph for what each step's answer becomes: the name on a certificate,
// the path, the calendar the pace fills; the course being written, for
// somebody who came to teach.
const glyphs = [Certificate01Icon, Route01Icon, Calendar03Icon];
const teachGlyphs = [Certificate01Icon, Pen01Icon, Calendar03Icon];

/** The reference's other half: a preview of what the form is filling in,
 *  here the pass the account opens with, set on a photograph, with a card
 *  at the frame's foot saying what the answer becomes and why it is asked.
 *  `at` is the step, and 3 once the account is made. */
export function SignUpPreview({
  v,
  at,
  plan,
  draft,
  today,
}: {
  v: SignUpValues;
  at: number;
  plan: Plan;
  draft: string;
  today: string;
}) {
  const teach = v.role === "teach";
  const step = Math.min(at, 2);
  const captions = teach ? copy.teachCaption : copy.caption;

  return (
    <>
      <Image
        src={AUTH_PHOTO}
        alt={authCopy.photoAlt}
        fill
        preload
        sizes="(min-width: 1024px) 55vw, 0px"
        className="object-cover"
      />

      {/* The pass and the card under it stand together at the frame's foot,
          a gap apart, so the photograph above them is left whole. */}
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-4 p-10">
        <div className="relative w-full max-w-[24rem]">
          {/* The cast rides on a wrapper as a drop shadow, since the pass
              below is masked for its notches and a mask clips a box
              shadow along with everything else. */}
          <div className="[filter:drop-shadow(0_2px_6px_hsl(30_20%_20%/0.12))_drop-shadow(0_20px_24px_hsl(30_20%_20%/0.28))]">
            <Pass v={v} at={at} plan={plan} draft={draft} today={today} />
          </div>
        </div>

        {/* Why the step in hand is asked, on glass under the pass: the
          step's glyph on a brand tile, what the answer becomes, and the
          sentence saying where it goes. Keyed by the step, so each new one
          rises in rather than swapping its words in place. */}
        <div
          key={`${teach}-${step}`}
          className="flex w-max max-w-full items-center gap-4 rounded-lg bg-card/85 py-2.5 pr-6 pl-2.5 backdrop-blur-md motion-safe:animate-rise-in"
        >
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-chip text-primary-ink"
          >
            <HugeiconsIcon
              icon={(teach ? teachGlyphs : glyphs)[step]}
              size={22}
              strokeWidth={1.7}
            />
          </span>
          <span className="min-w-0">
            <Caps as="span" className="block text-foreground">
              {(teach ? copy.teachLabels : copy.labels)[step]}
            </Caps>
            <span className="mt-1 block text-sm text-muted-foreground">
              {captions[step]}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

type Plan = { hours: number; weeks: number; finish: string };

// The line the pass is torn along, measured from its top: the route half
// above is held to this height so the notches cut exactly where it runs.
const TEAR = 200;
const notches = {
  maskImage: `radial-gradient(circle at 0 ${TEAR}px, transparent 11px, #000 11.5px), radial-gradient(circle at 100% ${TEAR}px, transparent 11px, #000 11.5px)`,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

const issuedOn = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** The account as the pass it opens with, since a path is a trip: from
 *  where the learner is now to the job the path ends in, each end as a
 *  departures board's three-letter code over its name, joined by the
 *  route. Torn along a perforation with a notch at each edge, and under it
 *  who is travelling, at what pace and when they arrive, then the five
 *  courses as one bar cut by their hours with the first lit. Every answer
 *  lands on it as it is given; what the form has not asked yet stands as a
 *  blank slot, and a code arriving rises in. */
function Pass({
  v,
  at,
  plan,
  draft,
  today,
}: {
  v: SignUpValues;
  at: number;
  plan: Plan;
  draft: string;
  today: string;
}) {
  const teach = v.role === "teach";
  const g = goalOf(v.goal);
  const name = v.name.trim();
  const picked = at >= 1;
  const timed = at >= 2;
  const code = teach ? copy.topicCodes[v.topic] : copy.goalCodes[g.id];
  const dest = !picked ? copy.pending : teach ? copy.teachTo(v.topic) : g.short;

  return (
    <div data-object style={notches} className="rounded-lg bg-card">
      <div style={{ height: TEAR }} className="flex flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-foreground">
            <Logo className="text-2xl" />
          </span>
          {/* stamped once the account is made */}
          {at === 3 ? (
            <span className="flex h-7 items-center gap-1.5 rounded-control bg-iris/15 pr-3 pl-2 text-sm text-iris-ink motion-safe:animate-rise-in">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={14}
                strokeWidth={2.2}
                aria-hidden="true"
              />
              {copy.confirmed}
            </span>
          ) : (
            <Caps as="span">
              {copy.issued(issuedOn.format(new Date(`${today}T12:00:00Z`)))}
            </Caps>
          )}
        </div>

        <div className="mt-auto grid grid-cols-[auto_minmax(0,1fr)_auto] items-end gap-x-3">
          <Caps as="span">{copy.from}</Caps>
          <span />
          <Caps as="span" className="text-right">
            {copy.to}
          </Caps>
          <span
            aria-hidden="true"
            className="font-heading text-5xl tracking-tighter"
          >
            {copy.fromCode}
          </span>
          {/* the route between the two ends, the path's glyph at its middle */}
          <span aria-hidden="true" className="mb-4 flex items-center gap-1.5">
            <span className="h-px flex-1 border-t-2 border-dashed border-foreground/20" />
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-iris/15 text-iris-ink">
              <HugeiconsIcon icon={Route01Icon} size={16} strokeWidth={1.8} />
            </span>
            <span className="h-px flex-1 border-t-2 border-dashed border-foreground/20" />
          </span>
          {/* Before a goal is picked, the code's three letters stand as a
              departures board's blank flaps. */}
          {picked ? (
            <span
              key={code}
              aria-hidden="true"
              className="text-right font-heading text-5xl tracking-tighter motion-safe:animate-rise-in"
            >
              {code}
            </span>
          ) : (
            <span aria-hidden="true" className="flex h-12 items-center gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-10 w-7 rounded-[6px] bg-muted" />
              ))}
            </span>
          )}
          <span className="text-sm text-muted-foreground">{copy.fromName}</span>
          <span />
          <span
            className={cn(
              "truncate text-right text-sm",
              picked ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {dest}
          </span>
        </div>
      </div>

      {/* the perforation the notches sit at the ends of */}
      <div
        aria-hidden="true"
        className="mx-5 border-t-2 border-dashed border-border"
      />

      <div className="p-6 pt-5">
        <dl className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-4">
          <div className="min-w-0">
            <Caps as="dt">{teach ? copy.instructor : copy.learner}</Caps>
            <dd className="mt-1.5 flex items-center gap-2 text-sm font-medium">
              {name ? (
                <>
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-chip text-xs text-primary-ink"
                  >
                    {initialsOf(name)}
                  </span>
                  <span className="truncate">{name}</span>
                </>
              ) : (
                <Dash />
              )}
            </dd>
          </div>
          <div className="min-w-0">
            <Caps as="dt">{copy.pace}</Caps>
            <dd className="mt-1.5 truncate text-sm font-medium tabular-nums">
              {timed ? copy.paceValue(v.pace) : <Dash />}
            </dd>
          </div>
          <div className="min-w-0">
            <Caps as="dt">{teach ? copy.draftBy : copy.arrives}</Caps>
            <dd className="mt-1.5 truncate text-sm font-medium tabular-nums">
              {timed ? teach ? draft : plan.finish : <Dash />}
            </dd>
          </div>
        </dl>

        {/* The trip in its legs: the five courses cut by their hours with
            the first lit, or the six chapters of a first draft. */}
        <div aria-hidden="true" className="mt-5 flex gap-1">
          {(teach || !picked
            ? Array.from({ length: teach ? 6 : 5 }, () => 1)
            : g.legs.map((l) => l.hours)
          ).map((w, i) => (
            <span
              key={i}
              style={{ flexGrow: w }}
              className={cn(
                "h-1.5 rounded-full",
                picked && i === 0 ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p className="mt-2.5 truncate text-sm text-muted-foreground">
          {!picked
            ? copy.legsPending
            : teach
              ? copy.chapters
              : copy.legsFirst(g.legs[0].title)}
        </p>
      </div>
    </div>
  );
}

/** An answer the form has not asked for yet: a blank slot of the same grey
 *  as the code's flaps, said as words to a screen reader. */
function Dash() {
  return (
    <>
      <span
        aria-hidden="true"
        className="my-1.5 block h-2 w-12 rounded-full bg-muted"
      />
      <span className="sr-only">{copy.notYet}</span>
    </>
  );
}
