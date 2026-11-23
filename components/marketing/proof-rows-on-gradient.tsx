import Image from "next/image";
import { figures, hirers, proofCopy } from "@/components/marketing/proof";
import { Logo } from "@/components/site/logo";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

// The card fades from the brand's ink at the top to the page's own white at
// the foot, one hue the whole way down — the reference's brown, peach and
// cream, read as depths of a single colour rather than three.
const rows = [
  "bg-primary-ink text-background",
  "bg-[color-mix(in_oklab,var(--primary)_34%,var(--card))]",
  "bg-[color-mix(in_oklab,var(--primary)_22%,var(--card))]",
  "bg-[color-mix(in_oklab,var(--primary)_13%,var(--card))]",
  "bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))]",
];

// Each row sets its figure a step further right than the one above, so the
// five read as a diagonal down the card rather than as a table.
const inset = ["lg:pl-10", "lg:pl-18", "lg:pl-26", "lg:pl-34", "lg:pl-42"];

export function ProofRowsOnGradient() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      {/* centred over the art, as the reference sets the line above its band */}
      <Eyebrow className="justify-center">{proofCopy.eyebrow}</Eyebrow>
      <SectionHeading className="mx-auto mt-5 text-center">
        {proofCopy.heading}
      </SectionHeading>

      {/* The band of gradient art, and the card riding on it. The art is the
          brand hue at three depths with light pulled through it, so it
          follows whatever hue the page is set in. */}
      <div className="relative isolate mt-12 overflow-hidden rounded-lg px-4 py-16 sm:px-10 sm:py-24 lg:py-28">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 -z-10",
            "bg-[radial-gradient(60%_80%_at_12%_30%,var(--primary)_0%,transparent_70%),radial-gradient(50%_70%_at_88%_70%,color-mix(in_oklab,var(--primary)_70%,black)_0%,transparent_72%),radial-gradient(40%_60%_at_60%_20%,color-mix(in_oklab,var(--primary)_40%,white)_0%,transparent_70%),linear-gradient(120deg,color-mix(in_oklab,var(--primary)_55%,var(--background)),color-mix(in_oklab,var(--primary)_85%,black))]",
          )}
        />
        {/* light pulled across the art in two long streaks */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,transparent_30%,color-mix(in_oklab,white_45%,transparent)_42%,transparent_52%,transparent_62%,color-mix(in_oklab,white_28%,transparent)_70%,transparent_78%)] mix-blend-soft-light"
        />
        {/* The reference's bowed edges: the band is cut by two wide ellipses
            of page ground, so it runs thinner through the middle than at
            either side. */}
        <span
          aria-hidden="true"
          className="absolute -top-9 left-1/2 -z-10 h-14 w-[112%] -translate-x-1/2 rounded-[100%] bg-background sm:-top-15 sm:h-24"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-9 left-1/2 -z-10 h-14 w-[112%] -translate-x-1/2 rounded-[100%] bg-background sm:-bottom-15 sm:h-24"
        />

        <ul className="mx-auto max-w-4xl overflow-hidden rounded-lg shadow-soft-lg">
          {figures.map((f, i) => (
            <li
              key={f.figure}
              className={cn(
                "flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:gap-16 sm:px-8",
                rows[i],
                inset[i],
              )}
            >
              {/* The figure's column is as wide as the widest figure, and the
                  figure sits at its right edge, so every row keeps the same gap
                  from figure to words. Left-aligned in a column that wide, "41"
                  stood three times as far from its words as "12,400" did. */}
              <p className="w-44 shrink-0 font-heading text-5xl tracking-tighter tabular-nums sm:text-right sm:text-6xl">
                {f.figure}
              </p>
              {/* the label on its own line in the medium weight, the caption
                  under it; balanced, so a caption that wraps breaks into two
                  even lines rather than a full one and a stray two words */}
              <div className="max-w-md">
                <p className="text-base font-medium">{f.label}</p>
                {/* Contrast: the first row's caption is text-background/70 on
                    the darkest band, #3d6321: 4.3:1, under AA's 4.5:1 for 16px.
                    Kept for the band's tone; text-background/80 reads 5.1:1. */}
                <p
                  className={cn(
                    "mt-1 text-balance text-base",
                    i === 0 ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  {f.caption}
                </p>
              </div>
              {/* the reference's name in the dark row's corner, from lg only:
                  narrower, it takes the caption's room or drops under it */}
              {i === 0 && (
                <span className="hidden font-heading text-lg tracking-tighter lg:ml-auto lg:block lg:self-start">
                  <Logo />
                </span>
              )}
            </li>
          ))}

          {/* The sixth row, lightest of all: who hired the people counted
              above, centred across the card as the foot the staircase stands
              on. The line naming it is read out rather than shown — a logo
              over "340 hired" says it to the eye — and each logo is read by
              its employer's name. */}
          <li className="bg-card px-6 py-6 sm:px-8">
            <p className="sr-only">{proofCopy.hirers}</p>
            <ul className="grid grid-cols-2 justify-items-center gap-x-6 gap-y-6 md:grid-cols-4">
              {hirers.map((h) => (
                <li key={h.logo} className="flex flex-col items-center gap-3">
                  {/* one height of box for every logo, so the four counts
                      under them share a line whatever each logo's size */}
                  <span className="flex h-5 items-center lg:h-6">
                    {/* the files are drawn in the light half's ink, so the
                        dark half turns them over rather than losing them */}
                    <Image
                      src={`/logos/${h.logo}.svg`}
                      alt={h.name}
                      width={h.w}
                      height={h.h}
                      className={cn("w-auto opacity-60 dark:invert", h.size)}
                    />
                  </span>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground tabular-nums">{h.hired}</span>{" "}
                    hired
                  </p>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
}
