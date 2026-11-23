import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { closingCopy, type ClosingCopy } from "@/components/marketing/closing";
import { reach } from "@/components/reach";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// Hotlinked from Unsplash, as the catalogue's photographs are. Whether the file
// ships inside the template is the packaging step's call, and its source is
// recorded in public/photos/CREDITS.md.
const PHOTO =
  "https://images.unsplash.com/photo-1587136527278-47b852bb3ef4?auto=format&fit=crop&w=1600&q=80";

// The home page's words by default; another page hands in its own two doors
// and the band, the photograph and the hand stay as they are.
export function ClosingPhotoHalf({ copy = closingCopy }: { copy?: ClosingCopy } = {}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="isolate grid overflow-hidden rounded-lg bg-accent p-2 lg:min-h-[34rem] lg:grid-cols-2">
        {/* the copy half, centred both ways as the reference sets it, and
            the frame the hand is drawn in */}
        <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center sm:px-12 lg:py-16">
          <Marks />
          <SectionHeading>{copy.heading}</SectionHeading>
          <p className="mt-5 max-w-[22rem] text-base text-muted-foreground">
            {copy.lede}
          </p>

          {/* Two doors at one height, the primary told apart by its fill and
              the other raised in white: 44px beside 40 read as a pair out of
              line, and stacked on a phone the two also came out at two
              widths. So they stack at one width until they fit side by side,
              and at 40px both stay under the one large control a section. */}
          <div className="mt-9 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button render={<Door href={copy.learn.href} />} className={reach}>
              {copy.learn.label}
            </Button>
            <Door
              href={copy.teach.href}
              className={cn(
                "press flex h-10 items-center justify-center rounded-control bg-card px-5 text-sm font-medium shadow-soft",
                "hover:shadow-soft-lg active:shadow-none",
                reach,
              )}
            >
              {copy.teach.label}
            </Door>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">{copy.risk}</p>
        </div>

        {/* The photograph, inset from the band's edge by the band's own
            padding so it reads as a picture held in it. Beside the copy and
            on a phone the frame is narrower than the photograph, so its sides
            are cropped, holding the desk and laptop in from the left edge and
            keeping a corner of the armchair on the right. Stacked on a
            tablet the frame is the wider of the two, so the top is cropped
            instead, and the chair and armchair keep the floor they stand on. */}
        <div className="relative min-h-72 overflow-hidden rounded-[calc(var(--radius-lg)-0.5rem)] sm:min-h-[28rem] lg:min-h-0">
          <Image
            src={PHOTO}
            alt="A laptop on a white desk by a sunlit window, with shelves of books and plants and an orange armchair beside it"
            fill
            sizes="(min-width: 1280px) 600px, (min-width: 1024px) calc(50vw - 40px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 64px)"
            className="object-cover object-[15%_50%] sm:object-[50%_100%] lg:object-[15%_50%]"
          />
        </div>
      </div>
    </section>
  );
}

/** A door down the same page is a plain anchor, since the router's link does
 *  nothing when the address already ends in its hash; a door to another page
 *  is the router's. Everything else it is handed passes through, so a Button
 *  can render as one. */
function Door({ href, ...props }: { href: string } & Omit<ComponentProps<"a">, "href">) {
  return href.startsWith("#") ? <a href={href} {...props} /> : <Link href={href} {...props} />;
}

// The design's spark at its four points: tapered rays, each a little longer or
// shorter than a compass would leave it.
const sparkle =
  "M26.3 23.9Q24.3 14.7 23.2 2Q23 14.8 21.7 24.1ZM24.1 26.1Q31.6 24.2 42 23.1Q31.5 23 23.9 21.9ZM21.7 24Q23.5 32.8 24.4 45Q24.8 32.8 26.3 24ZM23.9 21.9Q16.8 23.7 7 24.6Q16.9 24.8 24.1 26.1Z";

/** The design's hand, placed on the copy half so it keeps clear of every line
 *  of copy at every width. Stacked, the two sparks take opposite corners: the
 *  large one over the heading's top-left, the small one in the strip between
 *  the risk line and the photograph, where no line of copy can reach it
 *  however the heading wraps. Beside it, the squiggle and the sprout take the
 *  gap along the photograph's edge, the squiggle only from `xl`, where that
 *  gap is wide enough to hold it clear of the lede. */
function Marks() {
  return (
    <>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="pointer-events-none absolute left-[4%] top-3 -z-10 w-8 fill-foreground sm:left-[5%] sm:top-5 sm:w-11 lg:left-[4%] lg:top-[6%]"
      >
        <path d={sparkle} />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="pointer-events-none absolute bottom-4 right-[8%] -z-10 w-6 rotate-[16deg] fill-foreground sm:w-7 lg:right-auto lg:bottom-[8%] lg:left-[17%]"
      >
        <path d={sparkle} />
      </svg>

      {/* The squiggle is drawn over the photograph's edge, not behind it:
          its dot lands on the picture, the one place the hand touches it, as
          the design's squiggle crosses onto its slab. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 110 210"
        fill="none"
        className="pointer-events-none absolute z-10 hidden w-32 text-foreground xl:left-[calc(100%-6.875rem)] xl:top-[42%] xl:block"
      >
        <path
          d="M40 6C58 20 70 40 62 60c-6 16-26 16-24 2 2-14 26-10 28 10 2 24-26 40-32 60-4 16 10 28 22 20 10-8 4-24-8-16-10 8 0 32 22 42 12 6 22 12 28 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="98" cy="196" r="9" className="fill-primary" />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 70 70"
        fill="none"
        strokeLinecap="round"
        className="pointer-events-none absolute right-1 top-2 -z-10 hidden w-16 stroke-[color-mix(in_oklab,var(--primary),var(--primary-ink))] lg:block"
      >
        <g strokeWidth="2.2">
          <path d="M58 60C52 48 44 38 34 30" vectorEffect="non-scaling-stroke" />
          <path d="M62 50C62 38 60 26 56 12" vectorEffect="non-scaling-stroke" />
          <path d="M50 64C40 62 28 62 14 66" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
    </>
  );
}
