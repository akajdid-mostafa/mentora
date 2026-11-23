"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  compact,
  courseHref,
  figure,
  priceLabel,
  teacherHref,
  teacherOf,
  topicTint,
  type Course,
} from "@/components/course/courses";
import { glyph } from "@/components/course/glyph";
import { face } from "@/components/marketing/quotes";
import { recordView } from "@/components/course/recent";
import { toggleSaved, useSaved } from "@/components/course/saved";
import { reach } from "@/components/reach";
import { cn } from "@/lib/utils";

// The subject glyphs live in glyph.ts, where a server component can read
// them; the card's own callers keep importing them from here.
export { glyph };

// How many of the level meter's three dots a course fills.
export const rank: Record<Course["level"], number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/** The level as three dots in the brand's own hue, solid up to the level and
 *  ringed past it, the way a rating pairs a solid star with an outline one.
 *  On a control already filled with the brand the dots take the control's
 *  ink instead, or they vanish into it. */
export function LevelDots({ level, ink = false }: { level: Course["level"]; ink?: boolean }) {
  return (
    <span aria-hidden="true" className="flex gap-0.5">
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={cn(
            "size-1.75 rounded-full",
            step <= rank[level]
              ? ink ? "bg-current" : "bg-primary"
              : ink ? "ring-1 ring-inset ring-current" : "ring-1 ring-inset ring-primary",
          )}
        />
      ))}
    </span>
  );
}

// A photograph whose subject sits off its centre names the edge the card's
// crop holds to.
export const focus = { top: "object-top", bottom: "object-bottom" } as const;

/** Save, as the card's footer draws it. Saved is a red chip, the subject
 *  chip's own recipe in coral, because red is what a reader already reads as
 *  liked. The count reads as a social count does, so a save past a thousand
 *  changes the colour rather than the figure. */
export function SaveButton({
  course: c,
  className,
  onSave,
}: {
  course: Course;
  className?: string;
  /** After the press, with the state it left the course in. */
  onSave?: (saved: boolean) => void;
}) {
  const saved = useSaved().includes(c.id);
  return (
    // The one exception to the page's 40px control floor, on purpose: Save
    // is drawn at 36px, a secondary toggle kept a step under the price beside
    // it, and `reach` holds its target at 40px.
    <button
      type="button"
      onClick={() => {
        toggleSaved(c.id);
        onSave?.(!saved);
      }}
      aria-pressed={saved}
      aria-label={`Save ${c.title}`}
      className={cn(
        "press relative z-10 flex h-9 shrink-0 items-center gap-1.5 rounded-control px-3 text-sm",
        reach,
        "aria-pressed:bg-coral/15 aria-pressed:text-coral-ink aria-pressed:hover:bg-coral/25",
        "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
        className,
      )}
    >
      {saved ? <HeartSolid className="size-4" /> : <HeartIcon className="size-4" />}
      <span className="tabular-nums">{compact.format(c.saves + (saved ? 1 : 0))}</span>
    </button>
  );
}

/** The catalogue's compare toggle, for a card or a row. Full means three are
 *  already picked, so an unpicked course cannot join until one leaves. */
export type CompareToggle = { on: boolean; full: boolean; toggle: () => void };

export function CompareButton({
  course: c,
  compare,
  className,
}: {
  course: Course;
  compare: CompareToggle;
  className?: string;
}) {
  const blocked = compare.full && !compare.on;
  return (
    <button
      type="button"
      onClick={compare.toggle}
      data-compare={c.id}
      aria-pressed={compare.on}
      aria-disabled={blocked || undefined}
      aria-label={`Compare ${c.title}`}
      title={blocked ? "Compare holds three courses. Remove one first." : undefined}
      // A toggle rather than a call to action, so its brand fill is the
      // pressed state's, read off aria-pressed.
      className={cn(
        "press relative z-10 flex h-9 shrink-0 items-center gap-1.5 rounded-control bg-card pl-2.5 pr-3 text-xs font-medium shadow-soft hover:shadow-soft-lg active:shadow-none",
        reach,
        "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80 aria-pressed:hover:shadow-soft aria-pressed:active:shadow-none",
        blocked && "cursor-not-allowed text-muted-foreground",
        className,
      )}
    >
      {compare.on ? (
        <CheckIcon className="size-3.5" strokeWidth={2.5} />
      ) : (
        <PlusIcon className="size-3.5" strokeWidth={2.5} />
      )}
      Compare
    </button>
  );
}

// One card, one link: the link holds the photograph, the subject chip and the
// title, and carries an overlay the size of the card, so the whole card opens
// the course, and Save and Compare stand above that overlay on their own
// z-index. The link is labelled by the title alone, so a screen reader hears
// the course's name rather than every line it holds.
//
// Everything under the photograph sits 20px in from the card's edge — the 8px
// the photograph is inset plus 12 — which is where an instructor card's p-5
// puts its content, and the rating row between its two hairlines is that
// card's row too, 16px either side of each line, with the count and the stars
// at its two ends, over the price and Save below them.
export function CourseCard({
  course: c,
  compare,
  sizes = "(min-width: 1280px) 276px, (min-width: 1024px) calc(15.6vw + 64px), (min-width: 640px) 224px, 256px",
  star = "sun",
  onSave,
}: {
  course: Course;
  /** Present on the catalogue and the home shelf, where a course can be put
   *  beside two others. */
  compare?: CompareToggle;
  sizes?: string;
  /** The rating star's colour: the sun, or ink on the course page, where
   *  every star is drawn in ink. */
  star?: "sun" | "ink";
  /** After Save is pressed, for a list that the press changes: the
   *  dashboard's saved courses, where unsaving takes the card away. */
  onSave?: (saved: boolean) => void;
}) {
  const Glyph = glyph[c.topic];
  const tint = topicTint[c.topic];
  const title = `course-${c.id}`;
  const teacher = teacherOf(c);

  return (
    <article
      data-object
      className="group/card relative flex h-full flex-col rounded-lg bg-card p-2 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg"
    >
      <Link
        href={courseHref(c)}
        onClick={() => recordView(c.id)}
        data-card-link
        aria-labelledby={title}
        className="group/link block outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
      >
        {/* the photograph, inset in the card at the card's radius less the
            8px between them. It leans in while the link is pointed at, and
            settles back while it is held: written as a transform, the
            property the hover gate reads, where Tailwind's scale utility
            writes `scale` */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted">
          <Image
            src={c.image}
            alt=""
            fill
            sizes={sizes}
            className={cn(
              "object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/link:[transform:scale(1.04)] motion-safe:group-active/link:[transform:scale(1)] group-active/link:duration-answer",
              c.focus && focus[c.focus],
            )}
          />
          {/* The badge is the brand's pale chip, at the chip's own strength
              but mixed into white rather than laid over the photograph, so
              nothing in the frame shows through behind its ink. */}
          {c.badge && (
            <span className="absolute left-3 top-3 rounded-control bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] px-2.5 py-1 text-xs font-medium text-primary-ink shadow-soft">
              {c.badge}
            </span>
          )}
        </div>

        {/* The subject chip is the instructor card's, glyph and all, so a
            course and the people who teach its subject carry one hue. The
            level answers it from the row's far end, because every course
            has one. From 640 to 1279 a card is 200px inside, and
            "Engineering" with its glyph beside "Intermediate" is 214, so the
            glyph gives way there, as it does on the instructor card. */}
        <div className="flex items-center justify-between gap-2 px-3 pt-4">
          <span
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
              tint.lid,
              tint.ink,
            )}
          >
            <Glyph className="size-3.5 sm:max-xl:hidden" />
            {c.topic}
          </span>
          <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <LevelDots level={c.level} />
            {c.level}
          </span>
        </div>
        <h3 id={title} className="mt-3 line-clamp-1 px-3 text-lg font-medium">
          {c.title}
        </h3>
      </Link>

      {/* The teacher, on the photograph's foot: a way to their profile from
          every card, which is how a learner checks who teaches before they
          pay. A sibling of the card's link rather than inside it, since a
          link cannot hold another, laid in a frame the photograph's size so
          it sits on the photograph's corner at every width. */}
      <div className="pointer-events-none absolute inset-x-2 top-2 aspect-[4/3]">
        <Link
          href={teacherHref(teacher.name)}
          aria-label={`Open ${teacher.name}'s profile`}
          className="press pointer-events-auto absolute right-3 bottom-3 left-3 flex w-fit items-center gap-2 rounded-control bg-card py-1 pl-1 pr-3 text-xs font-medium shadow-soft hover:bg-photo-lift active:shadow-none"
        >
          {teacher.portrait && (
            <Image
              src={face(teacher.portrait, 64)}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0 rounded-full object-cover"
            />
          )}
          <span className="truncate">{teacher.name}</span>
        </Link>
      </div>

      {/* Compare rides the photograph's other corner from the badge, on its
          own white ground, and only where a caller asks for it. Where
          there is a pointer it waits for the card to be pointed at or
          reached by the keyboard, so a grid of twelve does not wear twelve
          of them; a picked course keeps it, and a touch screen always shows
          it. */}
      {compare && (
        <CompareButton
          course={c}
          compare={compare}
          className={cn(
            "absolute right-5 top-5",
            !compare.on &&
              "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 [@media(hover:hover)]:group-focus-within/card:opacity-100",
          )}
        />
      )}

      <div className="flex flex-1 flex-col px-3 pb-3">
        {/* The school and the credential on one line, so every card keeps
            the same stack under its title. The credential and its dot are
            one unbroken box, so a line too short for the pair ends on the
            school and an ellipsis rather than on a stray "·…". */}
        <p className="mb-4 mt-1 line-clamp-1 text-sm text-muted-foreground">
          {c.school}
          <span className="inline-block whitespace-nowrap">&nbsp;· {c.credential}</span>
        </p>

        {/* The rating reports, so it is a row of figures; Save acts, so it
            is a button in the footer, and the two never share a row. */}
        <p className="mt-auto flex items-center justify-between gap-5 border-t pt-4 text-sm">
          <span>
            <span className="tabular-nums">{figure(c.learners)}</span>{" "}
            <span className="text-muted-foreground">learners</span>
          </span>
          <span className="flex items-center gap-1">
            <StarSolid className={cn("size-3.5", star === "ink" ? "text-foreground" : "text-sun-ink")} />
            <span className="sr-only">, rated </span>
            <span className="tabular-nums">{c.rating}</span>
          </span>
        </p>

        <div className="mt-4 flex items-center justify-between gap-2 border-t pt-4">
          {/* The price is the footer's figure, so it is set in the heading
              face from text-xl, as the page's other prices are. */}
          <span className="font-heading text-xl tracking-tight tabular-nums">
            {priceLabel(c.price)}
          </span>
          <SaveButton course={c} onSave={onSave} />
        </div>
      </div>
    </article>
  );
}
