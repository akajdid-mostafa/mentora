"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { PlusSignIcon, UserAdd01Icon, UserCheck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { figure, teacherHref, topicTint } from "@/components/course/courses";
import { focus } from "@/components/course/course-card";
import { toggleFollow, useFollowing } from "@/components/course/following";
import type { Entry } from "@/components/instructors/directory";
import { doorCopy } from "@/components/instructors/copy";
import { face } from "@/components/marketing/quotes";
import { Button } from "@/components/ui/button";
import { cn, count, slugify } from "@/lib/utils";

// The notch the portrait sits in: the card's own white rising out of the
// photograph's foot and round the portrait, with a fillet at each side where
// it leaves the edge, so the card reads as one sheet with a bay cut into the
// picture rather than as a disc laid on top of it. Worked out for a 64px
// portrait with 5px of white round it (R = 37) and 12px fillets: each fillet
// meets the line 47.5px either side of the centre and the circle 9px above
// the edge. The path runs 1px past the edge so no seam of photograph shows
// under it at any zoom; the frame clips that pixel.
const NOTCH =
  "M0 38 L0 37 A12 12 0 0 0 11.634 27.939 A37 37 0 0 1 83.382 27.939 A12 12 0 0 0 95.016 37 L95.016 38 Z";

function Notch() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 95.016 38"
      className="pointer-events-none absolute -bottom-px left-1/2 h-[38px] w-[95.016px] -translate-x-1/2 fill-card"
    >
      <path d={NOTCH} />
    </svg>
  );
}

/** The teacher's face in the notch, with the badge on its edge as the home
 *  page's cards wear it. A teacher a buyer adds without a portrait is drawn
 *  as their initials in their field's tint rather than as somebody else. */
function Portrait({ entry: e }: { entry: Entry }) {
  const tint = topicTint[e.field];
  return (
    <span className="absolute left-1/2 top-full size-16 -translate-x-1/2 -translate-y-1/2">
      {e.portrait ? (
        <Image
          src={face(e.portrait, 128)}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="size-16 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-16 items-center justify-center rounded-full font-heading text-lg tracking-tight",
            tint.lid,
            tint.ink,
          )}
        >
          {e.name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
      )}
      <span className="absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full bg-card">
        <CheckBadgeIcon aria-hidden="true" className="size-6 text-iris-ink" />
      </span>
    </span>
  );
}

/** Follow as a disc on the photograph's corner, where a card elsewhere keeps
 *  its heart: white at rest with a person and a plus, the brand's fill with a
 *  tick once followed. Round, so it keeps its own 36px and takes its 40px
 *  target from behind. One list with the course page's Follow and the
 *  directory's Following filter. */
function FollowDisc({ name, onToggle }: { name: string; onToggle?: (following: boolean) => void }) {
  const on = useFollowing().includes(name);
  return (
    <button
      type="button"
      onClick={() => {
        toggleFollow(name);
        onToggle?.(!on);
      }}
      aria-pressed={on}
      aria-label={`Follow ${name}`}
      title={on ? "Following" : "Follow"}
      className={cn(
        "absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full shadow-soft press active:shadow-none after:absolute after:-inset-0.5 after:content-['']",
        "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/80",
        "not-aria-pressed:bg-card not-aria-pressed:hover:shadow-soft-lg not-aria-pressed:active:shadow-none",
      )}
    >
      <HugeiconsIcon icon={on ? UserCheck01Icon : UserAdd01Icon} size={18} strokeWidth={1.8} />
    </button>
  );
}

// One card, one link: the link holds the photograph, the portrait and the
// name, and carries an overlay the size of the card, so the whole card opens
// the profile. The course count and Follow stand above that overlay on their
// own z-index. The link is named by the name alone, so a screen reader hears
// who, rather than every line the card holds.
//
// The photograph is the course of theirs the most learners have taken, so a
// row of cards reads as a row of people and what they teach at once.
export function InstructorCard({
  entry: e,
  sizes = "(min-width: 1280px) 290px, (min-width: 1024px) 230px, (min-width: 640px) 45vw, 100vw",
  onFollow,
}: {
  entry: Entry;
  sizes?: string;
  /** Told when Follow is pressed, with where it now stands. */
  onFollow?: (following: boolean) => void;
}) {
  const id = `teacher-${slugify(e.name)}`;
  const cover = e.courses[0];
  const stats = [
    { label: "Rating", figure: e.rating.toFixed(1), star: true },
    { label: "Learners", figure: figure(e.learners) },
  ];

  return (
    <article
      data-object
      className="group/card relative flex h-full flex-col rounded-lg bg-card p-1.5 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg"
    >
      <Link
        href={teacherHref(e.name)}
        data-card-link
        aria-labelledby={id}
        className="group/link block outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
      >
        <div className="relative">
          {/* the photograph, inset in the card at the card's radius less the
              6px between them, leaning in while the card is pointed at */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)-0.375rem)] bg-muted">
            <Image
              src={cover.image}
              alt=""
              fill
              sizes={sizes}
              className={cn(
                "object-cover transition-transform duration-lean ease-lean motion-safe:group-hover/link:[transform:scale(1.04)] motion-safe:group-active/link:[transform:scale(1)] group-active/link:duration-answer",
                cover.focus && focus[cover.focus],
              )}
            />
            <Notch />
          </div>
          <Portrait entry={e} />
        </div>

        <div className="px-4 pb-5 pt-11 text-center">
          <h3 id={id} className="text-base font-medium">
            {e.name}
            <span className="sr-only">, verified instructor</span>
          </h3>
          {/* The dot keeps to the role before it, so a trade too long for
              a four-across card breaks after the dot rather than opening
              its second line on one. */}
          <p className="mt-0.5 text-sm text-balance text-muted-foreground">
            {e.trade.replace(" · ", "\u00a0· ")}
          </p>
        </div>
      </Link>

      {/* The reference's count on the photograph's corner, with its arrow:
          how many courses this teacher has, opening the catalog on them. */}
      <Link
        href={`/courses?q=${encodeURIComponent(e.name)}`}
        aria-label={`${count(e.courses.length, "course")} by ${e.name}`}
        // 36px beside the photograph's corner, as the catalog card's Compare
        // is, with its 40px target drawn behind it: `reach` would set it
        // `relative` and pull it out of the corner.
        className="absolute left-4 top-4 z-10 flex h-9 items-center gap-1 rounded-control bg-card pl-3 pr-2.5 text-xs font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']"
      >
        {count(e.courses.length, "course")}
        <ArrowUpRightIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </Link>
      <FollowDisc name={e.name} onToggle={onFollow} />

      {/* The two figures in one tinted pill split by a hairline, each over
          its label, as the second reference sets a host's; at the card's
          foot, so the pills of a row line up whatever the trade above
          them runs to. The star is ink, as the course page's instructor
          card draws it. */}
      <dl className="mx-2.5 mb-2.5 mt-auto grid grid-cols-2 divide-x rounded-sm bg-accent py-3 text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <dt className="order-2 text-xs text-muted-foreground">{s.label}</dt>
            <dd className="flex items-center justify-center gap-0.5 font-heading text-base tabular-nums">
              {s.figure}
              {s.star && <StarSolid aria-hidden="true" className="size-3 text-foreground" />}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

/** The card after the last teacher, standing where the next one would: the
 *  same sheet and notch, with a dotted ground where the photograph goes and
 *  an empty ring where the face goes, so the grid itself asks the question
 *  the reference asks with its second button. */
export function TeachCard() {
  return (
    <article data-object className="relative flex h-full flex-col rounded-lg bg-card p-1.5 shadow-soft">
      <div className="relative">
        <div
          aria-hidden="true"
          className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius)-0.375rem)] bg-accent bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_16%,transparent)_1.2px,transparent_1.4px)] bg-[length:14px_14px]"
        >
          <Notch />
        </div>
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-foreground/20 text-muted-foreground"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={20} strokeWidth={1.8} />
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center px-5 pt-11 pb-4 text-center">
        <h3 className="text-base font-medium">{doorCopy.title}</h3>
        <p className="mb-5 mt-1 text-sm text-balance text-muted-foreground">{doorCopy.text}</p>
        <Button className="mt-auto" render={<Link href={doorCopy.href} />}>
          {doorCopy.button}
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </article>
  );
}
