"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { BookOpen01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useProgress } from "@/components/course/progress";
import {
  goals,
  matchGoal,
  pathHref,
  totalHours,
} from "@/components/marketing/goals";
import { detailOf, focusOf, photoOf } from "@/components/paths/paths";
import { planOf, standingOf } from "@/components/paths/plan";
import { usePathChoices } from "@/components/paths/store";
import { AiIcon } from "@/components/ui/ai-icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { cn, count } from "@/lib/utils";

// Every line under the field holds to one line at 320, so a press never
// moves the row it stands in or the cards under it.
const HINT = "The tutor opens a path when one fits.";

/** The way on from a path: the three it is not, each a door with the weeks
 *  what is left of it takes at the reader's pace and what the job pays, and
 *  a field for a goal that is none of the four, which opens the path it
 *  lands on as the home page's planner does. */
export function OtherPaths({
  id,
  items,
  today,
}: {
  id: string;
  /** Each path's legs' syllabus items, counted on the server. */
  items: Record<string, number[]>;
  today: string;
}) {
  const router = useRouter();
  const { pace, known } = usePathChoices();
  const progress = useProgress();
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const others = goals.filter((g) => g.id !== id);
  // The example is one of the three below, so following it opens a path
  // rather than naming the one already open.
  const example = others[0].short;

  const find = () => {
    if (!typed.trim()) {
      setNote(`Type a job, like “${example.toLowerCase()}”.`);
      return;
    }
    const g = matchGoal(typed);
    if (!g) {
      setNote(`No path fits that. Try “${example.toLowerCase()}”.`);
    } else if (g.id === id) {
      setNote("That is the path above.");
    } else {
      setNote(`Opening the ${g.short.toLowerCase()} path.`);
      router.push(pathHref(g));
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <Eyebrow>More paths</Eyebrow>
          <SectionHeading className="mt-5">
            Or aim for a <Highlight>different job</Highlight>
          </SectionHeading>
        </div>

        {/* The reference's line and button, turned into the field that
            drafts a path from a goal: the label level with the eyebrow and
            the field with the heading, as the reference sets its line and
            its button. So from lg the line under the field hangs below the
            row rather than lifting the field off the heading. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            find();
          }}
          className="w-full shrink-0 lg:relative lg:max-w-sm"
        >
          <label htmlFor="other-goal" className="text-sm text-muted-foreground">
            The job you want
          </label>
          <div className="mt-2 flex h-12 items-center rounded-control bg-accent pl-4 pr-1.5 ring-1 ring-inset ring-border transition-shadow hover:not-focus-within:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring">
            <input
              id="other-goal"
              name="goal"
              size={1}
              value={typed}
              placeholder={example}
              onChange={(e) => {
                setTyped(e.target.value);
                setNote(null);
              }}
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Find the path"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-background press hover:bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))]/80"
            >
              <AiIcon size={18} />
            </button>
          </div>
          <p
            aria-live="polite"
            className="mt-2 min-h-5 text-sm text-muted-foreground lg:absolute lg:inset-x-0 lg:top-full"
          >
            {note ?? HINT}
          </p>
        </form>
      </div>

      {/* Three abreast from lg, and 64px under the row there, which keeps
          the line hanging under the field clear of the cards. Below lg
          three in a row are 224px at 768, where the chips and every label
          broke in two, so from sm to lg each card lies on its side, the
          photograph at the left, as the legs above it do. */}
      <ul className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
        {others.map((g) => {
          const hours = totalHours(g);
          const figures = detailOf(g).figures;
          // what is left of the path at the reader's pace, worked out as
          // its own page works it out and said as its planner heads with
          // it, so the card and the page agree
          const plan = planOf(g, standingOf(g, progress, items[g.id]), known[g.id] ?? [], pace, today);
          const handIn = plan.legs.filter((l) => l.state === "known").length;
          const left = plan.weeks
            ? `Done in ${count(plan.weeks, "week")}`
            : handIn
              ? `${count(handIn, "project")} left`
              : "Every leg is done";
          return (
            <li key={g.id}>
              <article
                data-object
                className="group/card relative flex h-full flex-col rounded-lg bg-card p-2 shadow-soft transition-shadow hover:shadow-soft-lg has-[[data-card-link]:focus-visible]:shadow-soft-lg sm:max-lg:grid sm:max-lg:grid-cols-[15rem_minmax(0,1fr)] sm:max-lg:gap-x-5"
              >
                {/* The photograph is the link, named by the heading under it,
                    and its overlay opens the path from anywhere on the card,
                    as the course card's does. */}
                <Link
                  href={pathHref(g)}
                  data-card-link
                  aria-labelledby={`path-${g.id}-title`}
                  className="block outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] active:after:bg-foreground/5 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-ring"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-muted">
                    <Image
                      src={photoOf(g)}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 240px, 100vw"
                      className={cn(
                        "object-cover transition-transform duration-lean ease-lean motion-safe:group-has-[[data-card-link]:hover]/card:[transform:scale(1.04)] motion-safe:group-has-[[data-card-link]:active]/card:[transform:scale(1)]! group-has-[[data-card-link]:active]/card:duration-answer",
                        focusOf(g),
                      )}
                    />
                    {/* the weeks, as a pale brand chip over the photograph,
                        where the shelf's cards wear their badges; four words
                        at most, a caption's length */}
                    <span className="absolute left-3 top-3 rounded-control bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] px-2.5 py-1 text-xs font-medium text-primary-ink shadow-soft tabular-nums">
                      {left}
                    </span>
                    {/* the reference's round arrow in the photograph's corner */}
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-card shadow-soft"
                    >
                      <ArrowUpRightIcon className="size-4 transition-transform group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col px-3 pb-3 pt-4 sm:max-lg:px-0 sm:max-lg:pb-1 sm:max-lg:pr-3 sm:max-lg:pt-3">
                  <h3 id={`path-${g.id}-title`} className="text-lg font-medium">
                    {g.short}
                  </h3>
                  {/* the two counts on one line under the name, each with
                      the glyph the catalogue's rows give the same count,
                      and a slash between them */}
                  <p className="mb-5 mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground tabular-nums">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={BookOpen01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
                      {count(g.legs.length, "course")}
                    </span>
                    <span aria-hidden="true">/</span>
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Clock01Icon} size={16} strokeWidth={1.8} aria-hidden="true" />
                      {hours} hours
                    </span>
                  </p>
                  {/* What the job pays and how many who finish get there:
                      the first and last of the figures the path's own
                      certificate is weighed by, in the heading face a step
                      under the course card's price, as the course page's
                      smaller cards set theirs, and held to the card's foot
                      so the three rules line up. */}
                  <dl className="mt-auto grid grid-cols-2 gap-4 border-t pt-4">
                    {[figures[0], figures[2]].map((f) => (
                      <div key={f.label} className="flex min-w-0 flex-col">
                        {/* one line down to 360; at 320 a column is 108px and
                            "Hired within a year" goes to two, balanced rather
                            than leaving "year" alone */}
                        <dt className="order-2 mt-0.5 text-balance text-sm text-muted-foreground">{f.label}</dt>
                        <dd className="order-1 font-heading text-lg tracking-tight tabular-nums">{f.figure}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
