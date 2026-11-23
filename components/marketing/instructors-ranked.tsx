"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRightIcon,
  BanknotesIcon,
  ChartBarIcon,
  CheckIcon,
  CommandLineIcon,
  PaintBrushIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon, StarIcon as StarSolid } from "@heroicons/react/24/solid";
import {
  directory,
  instructors,
  type Instructor,
} from "@/components/marketing/instructors-data";
import { face } from "@/components/marketing/quotes";
import { topicTint } from "@/components/course/courses";
import { toggleFollow, useFollowing } from "@/components/course/following";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, slugify } from "@/lib/utils";

type Field = Instructor["field"];
type Choice = Field | "all";

const glyph: Record<Field, typeof ChartBarIcon> = {
  Data: ChartBarIcon,
  Engineering: CommandLineIcon,
  Design: PaintBrushIcon,
  Business: BanknotesIcon,
};

// The select's rows: every field, then each one, with the glyph its card's chip
// carries and the directory's count beside it.
const options: { value: Choice; label: string; Icon: typeof ChartBarIcon; count: number }[] = [
  {
    value: "all",
    label: "Every field",
    Icon: Squares2X2Icon,
    count: Object.values(directory).reduce((a, b) => a + b, 0),
  },
  ...(Object.keys(directory) as Field[]).map((f) => ({
    value: f,
    label: f,
    Icon: glyph[f],
    count: directory[f],
  })),
];

const items = options.map(({ value, label }) => ({ value, label }));

export function InstructorsRanked() {
  const [field, setField] = useState<Choice>("all");
  // The one list Follow writes to across the site, so a teacher followed
  // here shows as followed on their course pages and under the directory's
  // Following filter.
  const following = useFollowing();

  const shown =
    field === "all"
      ? instructors
      : instructors.filter((p) => p.field === field);
  const more = field === "all" ? 0 : directory[field] - shown.length;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* A grid, so a phone reads the heading, the lede, then the control
          that acts on the cards under it — and from sm up the control stands
          on the right at the foot of the whole head, level with the lede's
          last line and just over the cards, where the reference puts its
          own. */}
      <div className="grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-8">
        <div>
          <Eyebrow>Instructors</Eyebrow>
          <SectionHeading className="mt-5">
            Taught by people who still do the job
          </SectionHeading>
        </div>

        <p className="mt-4 max-w-[34rem] text-base text-muted-foreground">
          Every instructor&rsquo;s credentials are checked before their first
          course goes live, and their trade is on the card rather than in a bio
          nobody opens.
        </p>

        <Select
          items={items}
          value={field}
          onValueChange={(v) => setField((v as Choice | null) ?? "all")}
        >
          <div className="mt-8 sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:mt-0 sm:self-end">
            <SelectTrigger aria-label="Filter by field" className="w-full sm:w-52">
              <SelectValue>
                {(value: Choice) => {
                  const o = options.find((x) => x.value === value) ?? options[0];
                  return (
                    <>
                      <o.Icon className="size-4 text-muted-foreground" />
                      {o.label}
                    </>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
          </div>
          <SelectContent label="Filter by field">
            <SelectGroup>
              {/* Two column heads, so the figures down the right edge say
                  what they count. The second is for the eye only: each row
                  already says "instructors" to a screen reader. */}
              <SelectLabel className="flex justify-between gap-4 pr-8">
                <span>Field</span>
                <span aria-hidden="true">Instructors</span>
              </SelectLabel>
              {options.map((o) => (
                <SelectItem
                  key={o.value}
                  value={o.value}
                  trailing={
                    // pl-2 beside the row's own 6px gap: the widest row,
                    // Engineering, needs all but 1px of a 208px popup, and
                    // anything wider pushed its figure out of the column
                    <span className="ml-auto pl-2 tabular-nums text-muted-foreground">
                      {o.count.toLocaleString("en-US")}
                      <span className="sr-only"> instructors</span>
                    </span>
                  }
                >
                  <span className="flex items-center gap-2">
                    <o.Icon className="size-4 text-muted-foreground" />
                    {o.label}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* The ribbon: one stroke crossing the whole row and running off both
          edges of the screen, not of the container, as the design's runs off
          its frame — at the design's own weight of 1% of the frame. It rises out
          of the row into the open ground beside the head and dives back under
          it, because a four-across grid of opaque cards leaves a line nothing
          but the gaps to be seen in. It sits behind the cards, so what a
          reader sees is a line passing between them: `isolate` on the box and
          `-z-10` on the mark, since without the first a negative z-index drops
          the mark behind the page itself. The svg clips the stroke's two ends
          at the screen's edges; `main` clips what the width of a scrollbar
          would otherwise add to the page. */}
      <div className="relative isolate mt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 hidden h-[30rem] w-screen -translate-x-1/2 lg:block"
        >
          <svg viewBox="0 0 1200 480" preserveAspectRatio="none" className="size-full">
            <path
              d="M-60 400 C 200 435, 320 380, 560 300 S 900 118, 1260 66"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.5"
              strokeWidth="11"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => (
            <InstructorCard
              key={p.name}
              person={p}
              // by place in the whole row, so a card keeps its lean when a
              // field is picked and it moves up to first
              tilt={instructors.indexOf(p) % 2 ? "rotate-[4deg]" : "-rotate-[5deg]"}
              following={following.includes(p.name)}
              onFollow={() => toggleFollow(p.name)}
            />
          ))}

          {/* A field leaves one card on a row of four, so the card after it
              is the door to the rest of that field: a card's size, standing
              where the next instructor would, rather than a slab across the
              three empty columns. The ribbon keeps the ground beyond it. */}
          {field !== "all" && more > 0 && (
            <li
              className={cn(
                "flex flex-col justify-between gap-10 rounded-lg bg-accent p-6",
                !shown.length && "sm:col-span-2 lg:col-span-4",
              )}
            >
              <div>
                <p className="font-heading text-5xl tracking-tighter tabular-nums text-primary-ink">
                  {more.toLocaleString("en-US")}
                </p>
                <p className="mt-3 max-w-sm text-base">
                  <span className="font-medium">
                    more {field} instructors in the directory.
                  </span>{" "}
                  {/* Worded against the last-line rule: at 1280 the first
                      version left "as Tomás." alone on a fourth line, and
                      this one ends each of the four fields on a line at
                      least 0.85 of the longest. */}
                  <span className="text-muted-foreground">
                    {shown.length
                      ? `Each passed the credential check ${shown[0].name.split(" ")[0]} did.`
                      : "Each passed a credential check before their first course went live."}
                  </span>
                </p>
              </div>
              <Button
                size="lg"
                className="w-fit"
                render={<Link href={`/instructors?field=${slugify(field)}`} />}
              >
                Browse all {directory[field].toLocaleString("en-US")}
                <ArrowUpRightIcon data-icon="inline-end" />
              </Button>
            </li>
          )}
        </ul>
      </div>

      <p aria-live="polite" className="sr-only">
        {field === "all"
          ? `Showing ${shown.length} instructors from every field.`
          : `Showing ${shown.length} of ${directory[field].toLocaleString("en-US")} ${field} instructors.`}
      </p>
    </section>
  );
}

// One card, one link: the profile arrow carries an overlay the size of the
// card, so the whole card opens the profile, and the two things on it that do
// something else — the follow button and the course links — stand above that
// overlay on their own z-index. The portrait tile sits after the link in the
// DOM and is transformed, so it paints over the overlay too; it takes no
// pointer events, which hands its clicks through to the link beneath it.
function InstructorCard({
  person: p,
  tilt,
  following,
  onFollow,
}: {
  person: Instructor;
  tilt: string;
  following: boolean;
  onFollow: () => void;
}) {
  const Glyph = glyph[p.field];
  const tint = topicTint[p.field];

  // A tutor card is a product object: the trade under the name is its data,
  // set at 14 — which is what `data-object` says.
  return (
    <li
      data-object
      className="group/card relative flex flex-col rounded-lg bg-card p-5 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg"
    >
      {/* The reference's header row: a chip, then two icon buttons. The
          buttons are drawn at 36 where every other square button here is 40,
          because beside a 24px chip two 40px squares outweighed the name. The
          follow button's target is pushed back out to 40 behind it, and the
          arrow's is the whole card.
          From 1024 to 1279 a card is 185px inside, and "Engineering" with
          its glyph and both buttons is 195, which would squeeze the arrow —
          so the chip drops its glyph there and the buttons never shrink. */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-control px-2.5 py-1 text-xs font-medium",
            tint.lid,
            tint.ink,
          )}
        >
          <Glyph className="size-3.5 lg:max-xl:hidden" />
          {p.field}
        </span>
        {/* Following is a selected state, so it fills with the brand and
            shades on hover the way every filled control here does, and the
            plus turns to a tick so the state reads without the fill. The
            fill is read off aria-pressed: a toggle, not a call to action. */}
        <button
          type="button"
          onClick={onFollow}
          aria-pressed={following}
          aria-label={`Follow ${p.name}`}
          className={cn(
            "press relative z-10 ml-auto flex size-9 shrink-0 items-center justify-center rounded-control after:absolute after:-inset-0.5 after:content-['']",
            "ring-1 ring-inset ring-border hover:bg-accent",
            "aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:ring-0 aria-pressed:hover:bg-primary/80",
          )}
        >
          {following ? (
            <CheckIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
        </button>
        <Link
          href={`/instructors/${slugify(p.name)}`}
          data-card-link
          aria-label={`Open ${p.name}'s profile`}
          className="group/link flex size-9 shrink-0 items-center justify-center rounded-control ring-1 ring-inset ring-border transition-colors hover:bg-accent active:bg-muted after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5"
        >
          <ArrowUpRightIcon className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transition-none" />
        </Link>
      </div>

      <span aria-hidden="true" className="mt-4 h-px w-full bg-border" />

      {/* The design's tile: the portrait on a tinted ground inside a white
          tray, tilted, with the ribbon's own stroke looping behind the head.
          The tint is this teacher's field, so a card and their course's lid
          carry the same hue. The tray straightens while the card is under
          the pointer or its link has focus — the one motion on the card that
          says the whole card is what opens — and holds its lean for anyone
          who asked for less motion. */}
      <div
        className={cn(
          "pointer-events-none relative mx-auto mt-6 w-fit rounded-lg bg-card p-1.5 shadow-soft",
          "transition-transform motion-safe:group-hover/card:rotate-0 motion-safe:group-has-[[data-card-link]:focus-visible]/card:rotate-0",
          tilt,
        )}
      >
        <span
          className={cn(
            "relative flex size-32 items-center justify-center overflow-hidden rounded-[calc(var(--radius)-0.25rem)]",
            tint.lid,
          )}
        >
          {/* the ribbon's own stroke, looping inside the tile's ground
              — one line running through the page and the pictures,
              which is the half of the object a tinted tray alone
              would lose. The portrait is a disc rather than a square
              so there is ground left for it to loop in. */}
          <svg
            viewBox="0 0 128 128"
            aria-hidden="true"
            className="absolute inset-0 size-full"
          >
            <path
              d="M-16 96 C 22 48, 58 124, 92 78 S 138 28, 150 58"
              fill="none"
              stroke="var(--primary)"
              strokeOpacity="0.5"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
          {/* The badge rides the portrait's own edge, as the reference's
              does: a 28px disc whose centre sits on the circle at 45°. The
              disc is the icon's own size, so its white rim is about as thin
              as the portrait's 2px ring and runs on from it; at 32 the rim
              was twice that. It is drawn for the eye; the heading below
              says it in words. */}
          <span className="relative size-24">
            <Image
              src={face(p.id, 192)}
              alt=""
              width={96}
              height={96}
              unoptimized
              className="size-24 rounded-full object-cover ring-2 ring-card"
            />
            <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-card">
              <CheckBadgeIcon className="size-7 text-iris-ink" />
            </span>
          </span>
        </span>
      </div>

      <h3 className="mt-4 text-center text-base font-medium">
        {p.name}
        <span className="sr-only">, verified instructor</span>
      </h3>
      {/* One line on every card, so the hairline under it runs at one
          height across the row. Each trade is written to fit the narrowest
          card, 185px inside from 1024 to 1279; a longer one is cut to the
          line rather than pushing its own card's hairline down. */}
      <p className="mt-1 truncate text-center text-sm text-muted-foreground">
        {p.trade}
      </p>

      {/* the count and its noun are one figure, the rating another */}
      <p className="mt-4 flex items-center justify-center gap-5 border-t pt-4 text-sm">
        <span>
          <span className="tabular-nums">{p.learners}</span>{" "}
          <span className="text-muted-foreground">learners</span>
        </span>
        <span className="flex items-center gap-1">
          <StarSolid className="size-3.5 text-sun-ink" />
          <span className="sr-only">, rated </span>
          <span className="tabular-nums">{p.rating}</span>
        </span>
      </p>

      <ul className="mt-4 flex flex-col gap-2 border-t pt-4">
        {p.teaches.map((t) => (
          <li key={t}>
            <Link
              href={`/courses/${slugify(t)}`}
              className={cn(
                "press z-10 flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground",
                reach,
              )}
            >
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/30" />
              {t}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
