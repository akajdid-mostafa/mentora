import Image from "next/image";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { float } from "@/components/float";
import { reach } from "@/components/reach";
import { DRAFTED, EMPTY, Lattice, YOURS } from "@/components/studio/lattice";
import { heroCopy } from "@/components/teach/copy";
import { estimateDefaults, figure, monthOf, nextPayday, usd } from "@/components/teach/earnings";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Caps } from "@/components/ui/caps";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// Hotlinked from Unsplash, as the course photographs are; the id is the
// licence record, and public/photos/CREDITS.md lists it. Asked for by width
// alone, so the file comes whole and the frame's cover does the only cut.
const PHOTO = "https://images.unsplash.com/photo-1780174604948-a314f7c98746?auto=format&w=2000&q=80";

// A card floating on the photograph: its own white, the photograph's cast
// rather than one of the page's two shadows, and a corner 6px tighter than
// the panel's, the step the reference takes between its frame and the cards
// laid on it.
const overlay = cn(float, "rounded-[calc(var(--radius-lg)-6px)] bg-card");

/** The page's opening: the promise on one side, the lede and the two doors on
 *  the other, and under them a staircase climbing into a pink cloud, with
 *  two things the product would put on its screen laid over it. `today` is the date the page
 *  was sent on, so the payout card counts the days to the next payday. */
export function HeroPhotoPanel({ today }: { today: string }) {
  const { payout } = heroCopy;
  // The same month the calculator opens on, so the figure a visitor meets
  // first is the one they meet again three sections down.
  const month = monthOf(estimateDefaults);
  const due = nextPayday(today);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-10 sm:px-8 sm:pt-14">
      {/* Two columns from lg, the heading a size down until xl so its two
          lines fit the half: in one column the right half of the first 440px
          stood empty from 1024 to 1279. */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-12 xl:gap-16">
        <div>
          <Eyebrow>{heroCopy.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl tracking-tighter sm:text-5xl xl:text-6xl">
            <span className="block">{heroCopy.heading.lead}</span>
            <span className="block">
              {heroCopy.heading.keep} <Highlight>{heroCopy.heading.marked}</Highlight>
              {heroCopy.heading.stop}
            </span>
          </h1>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-[34rem] text-base text-muted-foreground">{heroCopy.lede}</p>
          {/* Two doors at one height, the primary told apart by its fill and
              the other raised in white, as the closing band sets its pair:
              stacked at one width on a phone, side by side from sm. Both
              lead down this page, so they are plain anchors: the router's
              link does nothing when the address already ends in its hash,
              and a reader who scrolled back up would press it for nothing. */}
          <div className="mt-7 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
            <Button render={<a href={heroCopy.apply.href} />}>
              {heroCopy.apply.label}
              <ArrowDownIcon data-icon="inline-end" />
            </Button>
            <a
              href={heroCopy.earnings.href}
              className={cn(
                "flex h-10 items-center justify-center rounded-control bg-card px-5 text-sm font-medium shadow-soft press hover:shadow-soft-lg active:shadow-none",
                reach,
              )}
            >
              {heroCopy.earnings.label}
            </a>
          </div>
        </div>
      </div>

      {/* The panel. From lg the two cards float on the photograph at the
          corners the reference gives them: the draft down the left edge from
          the top, the payout at the foot of the right, the draft's foot lower
          than the payout's head so the two read on one diagonal. Under lg the
          frame is too small to carry both without covering the screen, so the
          photograph stands alone and the cards follow it, lapping its lower
          edge. The photograph covers the frame from its centre, and the frame
          holds a ground of its own while it is on its way. */}
      <div className="relative mt-12 sm:mt-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-[16/9] lg:aspect-[2/1]">
          <Image
            src={PHOTO}
            alt={heroCopy.alt}
            fill
            preload
            sizes="(min-width: 1280px) 1216px, 94vw"
            className="object-cover"
          />
        </div>

        <div className="relative -mt-14 grid gap-3 px-3 sm:grid-cols-2 sm:px-5 lg:contents">
          <DraftCard className="lg:absolute lg:top-5 lg:left-5 lg:w-[20rem]" />

          {/* The payout: what the month came to, the day it lands and how far
              the month has run towards it. On payday itself it has landed. */}
          <div data-object className={cn(overlay, "p-5 sm:self-start lg:absolute lg:right-5 lg:bottom-5 lg:w-[23rem]")}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <Caps as="span">
                {due.covers} {payout.label}
              </Caps>
              <span className="text-sm whitespace-nowrap text-muted-foreground">
                {due.left === 0 ? (
                  payout.today
                ) : (
                  <>
                    {payout.lands} <span className="text-foreground">{due.label}</span>
                  </>
                )}
              </span>
            </div>
            <p className="mt-3 font-heading text-4xl tracking-tighter tabular-nums">
              {usd(month.total, true)}
            </p>
            <div className="mt-5">
              <span aria-hidden="true" className="block h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.round(due.run * 100)}%` }}
                />
              </span>
              <p className="mt-2 flex justify-between text-xs tabular-nums text-muted-foreground">
                <span>{due.since}</span>
                <span>{due.left === 0 ? due.label : payout.left(due.left)}</span>
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t pt-4">
              <p className="grow basis-44 text-sm text-muted-foreground">
                {payout.made(estimateDefaults.sales, figure(estimateDefaults.minutes))}
              </p>
              <a
                href={payout.more.href}
                className={cn(
                  "flex h-10 shrink-0 items-center rounded-control bg-muted px-4 text-sm font-medium press hover:bg-secondary",
                  reach,
                )}
              >
                {payout.more.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The studio's draft: the course one line became, and how much of it the
 *  instructor has made their own. Where the reference frames a
 *  picture in ink, the card holds the draft's lessons as a lattice, one
 *  column a chapter and one cell a lesson, stacked from the foot, and the
 *  slots a shorter chapter leaves are drawn dim, as the reference draws a
 *  day with nothing in it; the legend names all three. From xl the cells
 *  stand taller: the frame there is at its widest and shortest for the cards
 *  on it, and the taller card keeps its foot well below the payout's head,
 *  so the two still read on one diagonal. The lattice and its legend are
 *  drawn for the eye and read out as one sentence. */
function DraftCard({ className }: { className?: string }) {
  const { draft } = heroCopy;
  const lessons = draft.chapters.reduce((n, c) => n + c.lessons, 0);
  const yours = draft.chapters.reduce((n, c) => n + c.yours, 0);
  const rows = Math.max(...draft.chapters.map((c) => c.lessons));

  return (
    <div data-object className={cn(overlay, "p-2", className)}>
      <div className="px-4 pt-3.5 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <span className="flex items-center gap-2 whitespace-nowrap text-iris-ink">
            <AiIcon size={16} />
            <Caps as="span" className="text-iris-ink">
              {draft.label}
            </Caps>
          </span>
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            {draft.took[0]} <span className="text-foreground tabular-nums">{draft.took[1]}</span>
          </span>
        </div>
        <p className="mt-3 text-lg font-medium tracking-tight">{draft.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{draft.meta(draft.chapters.length, lessons)}</p>
      </div>

      {/* A slab, so in the dark half the ink stays a raised dark panel and
          the cells, drawn in the page's colour, stay light on it. */}
      <div className="slab rounded-[calc(var(--radius-lg)-14px)] bg-foreground p-4 text-background">
        <p className="sr-only">{draft.read(yours, lessons)}</p>
        <div aria-hidden="true">
          <Lattice columns={draft.chapters} rows={rows} cell="h-5 xl:h-7" />
          <div className="mt-2 grid grid-cols-6 gap-1.5 text-center text-xs tabular-nums text-background/70">
            {draft.chapters.map((c, i) => (
              <span key={c.title}>{String(i + 1).padStart(2, "0")}</span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <span className="flex items-center gap-2">
              <span className={cn("h-2.5 w-5 rounded-full", YOURS)} />
              <span className="text-background/70">{draft.yours}</span>
              <span className="font-medium tabular-nums">{yours}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className={cn("h-2.5 w-5 rounded-full", DRAFTED)} />
              <span className="text-background/70">{draft.drafted}</span>
              <span className="font-medium tabular-nums">{lessons - yours}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className={cn("h-2.5 w-5 rounded-full", EMPTY)} />
              <span className="text-background/70">{draft.empty}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
