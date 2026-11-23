import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { lessonHref, type Course, type Topic } from "@/components/course/courses";
import { ChecksList } from "@/components/instructors/checks-list";
import type { Entry } from "@/components/instructors/directory";
import type { Job, Profile } from "@/components/instructors/profiles";
import { checksOf, type BadgeRecord } from "@/components/instructors/records";
import { face } from "@/components/marketing/quotes";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";

// The teacher's field in its pastel, the one showcase surface on the page
// that wears a colour: the subject set's hue, as the field's chip wears it.
// Written whole, since Tailwind finds a class by reading it.
const surface: Record<Topic, string> = {
  Data: "bg-iris-surface",
  Engineering: "bg-sky-surface",
  Design: "bg-coral-surface",
  Business: "bg-sun-surface",
};

const span = (j: Job) => `${j.from}–${j.to ?? "now"}`;
const sentence = (s: string) => s[0].toUpperCase() + s.slice(1);

/** Who the teacher is at work and what Mentora checked before their first
 *  course went live: the years in a heading, the road in the lede, and three
 *  cards of proof under them, one each for the job, the badge and the lesson
 *  twenty learners rated. */
export function AboutRecord({
  entry: e,
  profile: p,
  years,
  record: r,
}: {
  entry: Entry;
  profile: Profile;
  /** "11 years in analytics", the course page's own first line. */
  years: string;
  record: BadgeRecord;
}) {
  const first = e.name.split(" ")[0];
  const [before1, before2, now] = p.jobs;
  const top: Course = e.courses[0];

  return (
    <section id="about" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>About {first}</Eyebrow>
      <SectionHeading className="mt-5">
        {first}{" "}
        {/* the reference's tile in the line, holding the face the hero
            opened on at the size of a capital */}
        {e.portrait && (
          <span className="relative inline-block size-[1.05em] translate-y-[0.14em] overflow-hidden rounded-[0.3em] bg-muted align-baseline">
            <Image src={face(e.portrait, 112)} alt="" fill unoptimized sizes="56px" className="object-cover" />
          </span>
        )}{" "}
        has spent {years}
      </SectionHeading>
      {/* held to 45–75 characters a line; each bio is fitted to the
          last-line rule at 1280 in its own words */}
      <p className="mt-6 max-w-[30rem] text-base text-muted-foreground">{p.bio}</p>

      {/* three abreast from xl; under it two, with the lesson across the
          row under them, since a third of 1024 leaves the checks a column
          too narrow for a line of evidence */}
      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* The job, on the field's pastel: the one held now in large type on
            the colour, and the two before it in the white panel set into its
            foot. Ink on a pastel is the full one only; the hierarchy comes
            from size and weight. */}
        <article className={`flex flex-col rounded-lg p-2 ${surface[e.field]}`}>
          <div className="px-5 pb-10 pt-5">
            <Caps className="text-foreground">Now</Caps>
            <h3 className="mt-5 font-heading text-3xl tracking-tight">{now.role}</h3>
            <p className="mt-1.5 text-base">
              {sentence(now.place)}, since {now.from}
            </p>
          </div>
          <div className="mt-auto rounded-[calc(var(--radius-lg)-0.5rem)] bg-card px-5 py-4">
            <Caps>Before</Caps>
            <ol className="mt-2 divide-y">
              {[before2, before1].map((j) => (
                <li key={j.from} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium">{j.role}</span>
                    <span className="block text-muted-foreground">{sentence(j.place)}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">{span(j)}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        {/* The badge: how long the four checks took, as the reference's
            second card sets its figure, and the checks themselves under it,
            each with its evidence and the day it passed. White, lifted off
            the page, between the pastel and the grey: the record Mentora
            keeps is the card that stands forward. */}
        <article className="flex flex-col rounded-lg bg-card px-7 pb-5 pt-7 shadow-soft">
          <Caps>Checked by Mentora</Caps>
          <p className="mt-5 flex items-baseline gap-2.5">
            <span className="font-heading text-5xl tracking-tighter tabular-nums">{r.took}</span>
            <span className="text-base text-muted-foreground">days, four checks</span>
          </p>
          <ChecksList checks={checksOf(r, { named: false })} on="card" years className="mt-auto pt-6" />
        </article>

        {/* The lesson twenty learners rated before the first course opened:
            its title set as the job's is, the rating where the reference
            sets a figure, and a gauge drawn whole in the card's corner,
            filled as far round as the rating goes, with a dot where it
            stops. Under it, a box of its own as the reference sets its dark
            band, the one lesson any visitor can open today. */}
        <div className="flex flex-col gap-5 md:col-span-2 xl:col-span-1">
          {/* Across the row from md to xl the card is two columns, the title
              in one and the rating with its gauge in the other: one column
              that wide left the title at one edge, the gauge at the other
              and nothing between them. It keeps 240px of height there, so
              the 160px gauge stays clear of the length chip over it. */}
          <article className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-accent p-7 md:max-xl:grid md:max-xl:min-h-60 md:max-xl:grid-cols-2 md:max-xl:gap-x-10">
            <div className="flex items-center justify-between gap-4 md:max-xl:col-span-2">
              <Caps>Sample lesson</Caps>
              {/* a fact where a play glyph would promise a video */}
              <span className="-my-1 rounded-control bg-card px-2.5 py-1 text-xs font-medium">10 min</span>
            </div>
            <h3 className="mt-5 font-heading text-3xl tracking-tight">“{r.sample}”</h3>
            <div className="relative z-10 mt-auto pt-10 md:max-xl:mt-5 md:max-xl:self-end md:max-xl:pt-0">
              <p className="text-sm text-muted-foreground max-sm:max-w-[9rem]">Rating from twenty learners</p>
              <p className="mt-1 font-heading text-5xl tracking-tighter tabular-nums">
                {r.lesson.toFixed(1)}
                <span className="sr-only"> out of 5</span>
              </p>
            </div>
            <Gauge value={r.lesson / 5} />
          </article>
          {/* the band's 12px of padding round the 12px button makes its 24px
              corner, so the two corners share a centre; `slab` keeps it a
              raised dark band in the dark half rather than the lightest
              thing on the page */}
          <div className="slab flex items-center justify-between gap-4 rounded-lg bg-foreground py-3 pl-6 pr-3 text-background">
            {/* the course Start opens, since the card above is another lesson */}
            <p className="min-w-0 text-sm">
              <span className="block">Lesson one is free</span>
              <span className="line-clamp-2 text-background/70">{top.title}</span>
            </p>
            <Button
              render={<Link href={lessonHref(top)} aria-label="Start lesson one" />}
              className="shrink-0 px-4"
            >
              Start
              <ArrowUpRightIcon aria-hidden="true" data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A quarter of a thick ring in the card's lower right corner, drawn whole
 *  inside the card and concentric with its 24px corner, 16px clear of both
 *  edges: filled from its left end to `value` of the way round, with a dot
 *  where the fill stops over the track that runs on to the top. The figure
 *  beside it says the number; the ring shows how near the top it sits. A
 *  phone draws it a size down, so the figure's label keeps clear of it. */
function Gauge({ value }: { value: number }) {
  // centre (136, 136), 24px in from the corner as the card's own corner
  // centre is; radius 120, so the 16px stroke's round ends stop 16px short
  // of the card's right and bottom edges
  const r = 120;
  const c = 136;
  const quarter = (Math.PI * r) / 2;
  const arc = `M ${c - r} ${c} A ${r} ${r} 0 0 1 ${c} ${c - r}`;
  const turn = (value * Math.PI) / 2;
  const dot = { x: c - r * Math.cos(turn), y: c - r * Math.sin(turn) };
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" className="absolute bottom-0 right-0 size-32 sm:size-40">
      <path d={arc} fill="none" strokeWidth="16" strokeLinecap="round" className="stroke-foreground/10" />
      <path
        d={arc}
        fill="none"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${quarter * value} ${quarter}`}
        className="stroke-primary"
      />
      <circle cx={dot.x} cy={dot.y} r="9" strokeWidth="4" className="fill-primary stroke-accent" />
    </svg>
  );
}
