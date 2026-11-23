"use client";

import Image from "next/image";
import { useSyncExternalStore, type ReactNode } from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import {
  Backpack03Icon,
  CalendarRemove01Icon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { glyph } from "@/components/course/glyph";
import { teachers as staff, topicTint } from "@/components/course/courses";
import { useProgress } from "@/components/course/progress";
import { localToday } from "@/components/course-page/start";
import { ShareButton } from "@/components/course-page/share-button";
import { face } from "@/components/marketing/quotes";
import { goals, pathHref } from "@/components/marketing/goals";
import { Certificate } from "@/components/paths/certificate";
import { LegCard, type Need } from "@/components/paths/leg-card";
import {
  coursesOf,
  detailOf,
  focusOf,
  levelSpan,
  photoOf,
  teachersOf,
  topicOf,
} from "@/components/paths/paths";
import { planOf, standingOf } from "@/components/paths/plan";
import { Planner } from "@/components/paths/planner";
import {
  toggleKnown,
  toggleSavedPath,
  usePathChoices,
} from "@/components/paths/store";
import { Week } from "@/components/paths/week";
import { reach } from "@/components/reach";
import { AiIcon } from "@/components/ui/ai-icon";
import { cn, count } from "@/lib/utils";

const never = () => () => {};

/** Today as the visitor's calendar has it, after the server's date has been
 *  rendered once, as the course page's panel reads it. */
function useToday(server: string) {
  return useSyncExternalStore(never, localToday, () => server);
}

/** The page's working half: down the left, the path and the panel that plans
 *  it, the panel riding beside the long read; down the right, the five legs,
 *  the week they make, what to know before starting and what the path ends
 *  in. One pace, one set of known legs and one learner's record feed all of
 *  it, so the slider moves the date, the weeks on every leg and the week
 *  grid at once. */
export function PathBody({
  id,
  items,
  projects,
  today: serverToday,
}: {
  id: string;
  /** Each leg's syllabus items, counted on the server. */
  items: number[];
  /** Each leg's project, by its item in the syllabus. */
  projects: string[];
  today: string;
}) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  const list = coursesOf(g);
  const today = useToday(serverToday);
  const choices = usePathChoices();
  const progress = useProgress();
  const known = choices.known[g.id] ?? [];

  const standing = standingOf(g, progress, items);
  const plan = planOf(g, standing, known, choices.pace, today);

  // A leg's prerequisites are cleared once they are finished or known.
  const cleared = (i: number) => plan.legs[i].state === "done" || plan.legs[i].state === "known";

  return (
    <div className="mt-6 grid grid-cols-1 gap-10 lg:mt-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[25rem_minmax(0,1fr)] xl:gap-x-16">
      {/* One column on a phone, in reading order: the path, its planner,
          then the legs and the rest. From lg the rail and the long read
          stand side by side, and the planner sticks inside the rail, which
          is as tall as the read beside it. */}
      <div className="contents lg:flex lg:flex-col">
        <Profile id={g.id} className="max-lg:order-1" />
        <div className="max-lg:order-2 lg:sticky lg:top-20 lg:mt-6">
          <Planner id={g.id} plan={plan} standing={standing} projects={projects} />
        </div>
      </div>

      <div className="contents lg:block">
        <div className="max-lg:order-3">
          <h2 className="sr-only">The five courses</h2>
          <ol className="flex flex-col gap-4">
            {g.legs.map((leg, i) => (
              <li key={leg.course}>
                <LegCard
                  n={i + 1}
                  leg={leg}
                  course={list[i]}
                  plan={plan.legs[i]}
                  needs={leg.needs.map(
                    (j): Need => ({ n: j + 1, title: g.legs[j].title, met: cleared(j) }),
                  )}
                  items={items[i]}
                  project={projects[i]}
                  finished={progress.done[leg.course]?.length ?? 0}
                  last={progress.last[leg.course]}
                  onKnown={() => toggleKnown(g.id, leg.course)}
                />
              </li>
            ))}
          </ol>
          {/* the reference's note under its services, which says the list
              bends to the reader, while a card still carries the button it
              names */}
          {plan.legs.some((l) => l.state === "open" || l.state === "known") && (
            <p className="mt-5 text-sm text-muted-foreground">
              Already know one? Press “I know this” on its card and it comes off the schedule.
            </p>
          )}
        </div>

        <div className="max-lg:order-4">
          <Block id="week" title="Your week">
            <Week label={g.short} pace={choices.pace} plan={plan} today={today} />
          </Block>
          <Block id="before" title="Before you start">
            <Before id={g.id} />
          </Block>
          <Certificate id={g.id} total={plan.total} />
        </div>
      </div>
    </div>
  );
}

/** A part of the long read, under a hairline, as the reference divides its
 *  own and as the course page does. */
function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      id={id}
      className="mt-14 border-t pt-14 lg:mt-16 lg:pt-16"
    >
      <h2 id={`${id}-title`} className="mb-6 text-2xl tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** The reference's profile: a picture across the top, the host's face
 *  lapping its foot, and the name, the pitch and two small buttons centred
 *  under it. The face is the path's subject glyph in its hue, as a course
 *  wears its own on the shelf; the name is the goal the path was drawn up
 *  from. */
function Profile({ id, className }: { id: string; className?: string }) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  const topic = topicOf(g);
  const Glyph = glyph[topic];
  const tint = topicTint[topic];
  const hours = g.legs.reduce((n, l) => n + l.hours, 0);
  const teachers = teachersOf(g);
  const saved = usePathChoices().saved.includes(g.id);

  return (
    <div data-object className={cn("rounded-lg bg-card p-2 pb-5 text-center shadow-soft", className)}>
      <div className="relative aspect-[2/1] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted">
        <Image
          src={photoOf(g)}
          alt=""
          fill
          preload
          sizes="(min-width: 1280px) 384px, (min-width: 1024px) 336px, 100vw"
          className={cn("object-cover", focusOf(g))}
        />
      </div>
      {/* the face, lapping the picture's foot by half, in a ring of the
          card's own white so it reads as set on the card */}
      <span
        aria-hidden="true"
        className={cn(
          "relative mx-auto -mt-10 flex size-20 items-center justify-center rounded-full ring-4 ring-card",
          "bg-[color-mix(in_oklab,currentColor_14%,var(--card))]",
          tint.ink,
        )}
      >
        <Glyph className="size-9" />
      </span>

      <div className="px-4 sm:px-6">
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-iris-ink">
          <AiIcon />
          Drafted by the tutor
        </p>
        <h1 className="mt-2 text-balance text-4xl tracking-tighter">{g.label}</h1>
        <p className="mx-auto mt-3 max-w-72 text-base text-muted-foreground">{g.blurb}</p>

        <p className="mt-4 text-sm tabular-nums">
          {count(g.legs.length, "course")} · {hours} hours
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{levelSpan(g)}</p>

        <Teachers names={teachers} topic={topic} />

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => toggleSavedPath(g.id)}
            aria-pressed={saved}
            aria-label={`Save the ${g.short.toLowerCase()} path`}
            // one width for Save and Saved, so the Share beside it holds
            // still while the two trade places
            className={cn(
              "flex h-10 min-w-24 items-center justify-center gap-2 rounded-control px-4 text-sm press",
              reach,
              "aria-pressed:bg-coral/15 aria-pressed:text-coral-ink aria-pressed:hover:bg-coral/25",
              "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
            )}
          >
            {saved ? <HeartSolid aria-hidden="true" className="size-4" /> : <HeartIcon aria-hidden="true" className="size-4" />}
            {saved ? "Saved" : "Save"}
          </button>
          <ShareButton title={`${g.short} path`} path={pathHref(g)} />
        </div>
      </div>
    </div>
  );
}

/** Who teaches the path's courses, faces lapping one another, then their
 *  names: a portrait where the teacher has one, their initials in the
 *  subject's tint where they do not, as everywhere on the site. */
function Teachers({ names, topic }: { names: string[]; topic: keyof typeof topicTint }) {
  const tint = topicTint[topic];
  const people = names.map((name) => staff.find((t) => t.name === name) ?? { name, trade: "" });
  const said =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <span aria-hidden="true" className="flex -space-x-2">
        {people.map((t) =>
          t.portrait ? (
            <Image
              key={t.name}
              src={face(t.portrait, 64)}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="size-8 rounded-full object-cover ring-2 ring-card"
            />
          ) : (
            // The tint is a wash, so it is laid on a disc of the card's
            // white: straight over the face it laps, the face showed
            // through it and seemed to sit on top.
            <span key={t.name} className="rounded-full bg-card ring-2 ring-card">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full font-heading text-xs tracking-tight",
                  tint.lid,
                  tint.ink,
                )}
              >
                {t.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </span>
          ),
        )}
      </span>
      <p className="text-balance text-sm text-muted-foreground">Taught by {said}</p>
    </div>
  );
}

/** The reference's things to know: three short notes in a row, held by
 *  their columns rather than by cards. */
function Before({ id }: { id: string }) {
  const g = goals.find((x) => x.id === id) ?? goals[0];
  const notes = [
    { icon: Backpack03Icon, title: "What to bring", text: detailOf(g).needs },
    {
      icon: CalendarRemove01Icon,
      title: "When a week goes badly",
      text: "Nothing expires. Lower the hours and the date moves, and the courses you own stay yours.",
    },
    {
      icon: Certificate01Icon,
      title: "What the certificate asks",
      text: "All five courses and their projects. A course you know counts once its project is reviewed.",
    },
  ];
  return (
    // Three abreast where each column keeps a reading width, from sm while
    // the page is one column and from xl; beside the rail at lg, one list.
    // Set at 14px, the size the product's own data takes: the three are the
    // path's terms, so the list marks itself as an object. The glyph stands
    // 20px clear of its title, so it reads as the column's mark rather than
    // as the title's first letter.
    <ul
      data-object
      className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-8 xl:grid-cols-3 xl:gap-10"
    >
      {notes.map((n) => (
        <li key={n.title}>
          <HugeiconsIcon icon={n.icon} size={26} strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-5 text-sm font-medium">{n.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
