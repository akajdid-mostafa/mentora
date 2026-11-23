import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { directory } from "@/components/marketing/instructors-data";
import { face } from "@/components/marketing/quotes";
import { reach } from "@/components/reach";
import { teacherHref, teachers } from "@/components/course/courses";
import { numbersCopy } from "@/components/teach/copy";
import { CountUp } from "@/components/teach/count-up";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// The six faces round the figure, found by name so each one is the portrait
// every other page prints beside that name, and none of the five whose stories
// close the page. Each is placed by its centre and sized by its diameter, both
// as shares of the cluster's width and height and measured off the reference,
// so the gaps between them hold at every width: two above the figure, one
// lapping the top of the "3," clear of the face above it, one on the last
// "0"'s shoulder, one beside the words under it and one below them. Half of
// them in grey.
const ring = [
  { name: "Ana Reyes", x: 20, y: 12, d: 21, grey: true },
  { name: "Kofi Mensah", x: 69, y: 15, d: 20, grey: true },
  { name: "Hana Sato", x: 40, y: 36, d: 18, grey: false },
  { name: "Rafael Costa", x: 91, y: 40, d: 17, grey: true },
  { name: "Priya Raman", x: 16, y: 72, d: 19, grey: false },
  { name: "Eva Brandt", x: 71, y: 83, d: 16, grey: false },
]
  .map((p) => {
    const t = teachers.find((x) => x.name === p.name);
    return t?.portrait ? { ...p, trade: t.trade, portrait: t.portrait } : null;
  })
  .filter((p) => p !== null);

// The fifth number: every verified instructor in the directory, summed as the
// header's Explore menu sums it, so the two never disagree.
const total = Object.values(directory).reduce((n, k) => n + k, 0);
const verified = total.toLocaleString("en-US");

export function FiguresWithPortraits() {
  const c = numbersCopy;
  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="grid gap-14 lg:grid-cols-[2fr_3fr] lg:items-center lg:gap-16">
        {/* The statement first, in the markup as on a phone: the section's
            head is what a screen reader and a keyboard meet before the
            faces, whatever the eye meets first from lg. */}
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <SectionHeading className="mt-5">{c.heading}</SectionHeading>
          <p className="mt-6 max-w-[34rem] text-base text-muted-foreground">{c.lede}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button render={<Link href={c.meet.href} />}>
              {c.meet.label}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            {/* A plain anchor rather than the router's link, so the browser
                jumps on every press, a second one too; the steps hear the
                press and open on the first. */}
            <a
              href={c.how.href}
              className={cn(
                "group/how flex items-center gap-2 text-sm font-medium press hover:text-muted-foreground",
                reach,
              )}
            >
              {c.how.label}
              <ArrowRightIcon className="size-4 transition-transform group-hover/how:translate-x-0.5 motion-reduce:transition-none" />
            </a>
          </div>
        </div>

        {/* The ghost figure with the faces round it. The figure is drawn
            for the eye and read out once, as the words under it. Beside the
            statement from lg, where it stands on the left as the reference
            sets it; under it on a phone. */}
        <div className="relative mx-auto aspect-[10/9] w-full max-w-[28rem] lg:order-first lg:mx-0 lg:max-w-none">
          {/* The words hang from the figure's baseline, a percentage of
              its own line box, so they sit under the digits at every size. */}
          <div className="absolute left-[54%] top-[52%] -translate-x-1/2 -translate-y-1/2 font-heading text-[100px]/[var(--heading-leading-display)] tracking-tighter tabular-nums sm:text-[136px]/[var(--heading-leading-display)] lg:text-[108px]/[var(--heading-leading-display)] xl:text-[144px]/[var(--heading-leading-display)]">
            {/* Contrast: the figure is text-foreground/10, 1.2:1 on the page,
                and the only place the count is drawn; the caption under it
                and its screen-reader text carry the words. foreground/50
                would read 3.3:1, past AA for display type. */}
            <p aria-hidden="true" className="text-foreground/10">
              <CountUp to={total} />
            </p>
            <p className="absolute left-1/2 top-[84%] -translate-x-1/2 whitespace-nowrap font-sans text-sm font-normal tracking-normal text-muted-foreground">
              <span className="sr-only">{verified} </span>
              {c.ghost}
            </p>
          </div>
          {/* A face grows under the pointer, so held it settles back to its
              own size: `press` would fight the hover's scale. */}
          {ring.map((p) => (
            <Link
              key={p.name}
              href={teacherHref(p.name)}
              aria-label={`${p.name}, ${p.trade}`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.d}%` }}
              className="group/face absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-background transition-[scale,box-shadow] hover:z-10 hover:scale-105 hover:shadow-soft-lg active:scale-100 active:shadow-none motion-reduce:transition-none"
            >
              <Image
                src={face(p.portrait, 184)}
                alt=""
                fill
                unoptimized
                className={cn(
                  "rounded-full object-cover transition-[filter]",
                  p.grey && "grayscale group-hover/face:grayscale-0",
                )}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* The four other numbers, each a figure the pills above it add to.
          The pills lean at the reference's tilts with clear ground under
          them, so the figure keeps its whole top edge; the second rides over
          the end of the first, so it is opaque: the brand's chip mixed into
          the card rather than laid over it. Two across until xl, where four
          have the room. */}
      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4">
        {c.cards.map((card, i) => (
          <li key={card.label} className="rounded-lg bg-card p-6 ring-1 ring-inset ring-border sm:p-7">
            <div aria-hidden="true" className="flex min-h-9 flex-wrap items-end">
              {card.pills.map((pill, j) => (
                <span
                  key={pill}
                  className={cn(
                    "inline-flex h-7 items-center rounded-control px-3 text-xs font-medium whitespace-nowrap",
                    j === 0
                      ? "bg-muted"
                      : "-ml-2 bg-[color-mix(in_oklab,var(--primary)_var(--chip-alpha),var(--card))] text-primary-ink shadow-soft",
                    tilts[i][j],
                  )}
                >
                  {pill}
                </span>
              ))}
            </div>
            <p className="mt-5 font-heading text-5xl tracking-tighter tabular-nums">{card.figure}</p>
            <p className="mt-6 text-base font-medium">{card.label}</p>
            <p className="mt-1.5 max-w-60 text-base text-muted-foreground">{card.body}</p>
            <p className="sr-only">{card.pills.join(", ")}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Each card leans its pills its own way, as the reference's three do, so the
// row reads as four hands rather than one stamp.
const tilts = [
  ["-rotate-3", "rotate-2 -translate-y-2.5"],
  ["rotate-2", "-rotate-3 -translate-y-2"],
  ["-rotate-2", "rotate-3 -translate-y-3"],
  ["rotate-3", "-rotate-2 -translate-y-2.5"],
];
