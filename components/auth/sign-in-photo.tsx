"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { TickDouble02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { authCopy, signInCopy } from "@/components/auth/copy";
import { AUTH_PHOTO } from "@/components/auth/frame";
import { float } from "@/components/float";
import { AiIcon } from "@/components/ui/ai-icon";
import { cn } from "@/lib/utils";

const copy = signInCopy.photo;

// The number the row opens at, and how far it wanders: learners start and
// stop lessons all the time, so it moves by a few every few seconds.
const LIVE = 2318;

/** The photograph beside the sign-in, carrying two things the product would
 *  show: the reference's row along its top, here how many people are in a
 *  lesson right now and the way to the catalogue, and at its foot one
 *  exchange with the tutor, which is what a returning learner comes back
 *  to. */
export function SignInPhoto() {
  const live = useLive();
  return (
    <>
      <Image
        src={AUTH_PHOTO}
        alt={authCopy.photoAlt}
        fill
        preload
        sizes="(min-width: 1024px) 55vw, 0px"
        className="object-cover"
      />

      {/* The reference's row: a reading at the left, a link at the right,
          each on a glass pill so neither sets ink on the photograph. */}
      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-4">
        <p className="flex h-10 items-center gap-2.5 rounded-control bg-card/80 px-4 text-sm tabular-nums backdrop-blur-md">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-iris opacity-60 motion-reduce:animate-none" />
            <span className="relative size-2 rounded-full bg-iris ring-2 ring-iris/20" />
          </span>
          {copy.live(live.toLocaleString("en-US"))}
        </p>
        <Link
          href="/courses"
          className="group/browse flex h-10 items-center gap-3 rounded-control bg-card/80 pr-1 pl-4 text-sm font-medium backdrop-blur-md press hover:bg-card"
        >
          {copy.browse}
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-[calc(var(--radius-control)-4px)] bg-primary text-primary-foreground transition-colors group-hover/browse:bg-primary/80"
          >
            <ArrowRightIcon className="size-4 transition-[translate] group-hover/browse:translate-x-0.5" />
          </span>
        </Link>
      </div>

      {/* One question and its answer, drawn as a messenger draws a chat:
          the tutor's name and lesson across the top as the conversation's
          header, then the two bubbles on a tinted ground, the learner's at
          the right in the brand's tint and the tutor's at the left in white,
          each with its tail and its time. The tutor's opens on a quote of
          the second of the lesson it answers from, as a reply quotes the
          message it answers. */}
      <figure
        data-object
        className={cn(
          "absolute bottom-6 left-6 w-[23rem] overflow-hidden rounded-lg bg-card",
          float,
        )}
      >
        <figcaption className="flex items-center gap-3 border-b px-4 py-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--iris),var(--iris-ink))] text-card">
            <AiIcon size={20} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium">{copy.tutor}</span>
            <span className="block text-sm text-muted-foreground">
              {copy.lesson}
            </span>
          </span>
        </figcaption>

        <div className="flex flex-col gap-2 bg-accent px-4 pt-4 pb-5">
          <Bubble side="out">
            {copy.question}
            <Stamp>
              {copy.sent}
              <HugeiconsIcon
                icon={TickDouble02Icon}
                size={16}
                strokeWidth={1.8}
                aria-label={copy.read}
                className="text-primary-ink"
              />
            </Stamp>
          </Bubble>
          <Bubble side="in">
            <span className="mb-1.5 flex flex-col rounded-[10px] bg-iris/10 px-3 py-2">
              <span className="flex items-center gap-1.5 font-medium text-iris-ink">
                <PlayIcon aria-hidden="true" className="size-4" />
                {copy.quoteFrom}
              </span>
              <span className="text-muted-foreground">{copy.quote}</span>
            </span>
            {copy.answer}
            <Stamp>{copy.sent}</Stamp>
          </Bubble>
        </div>
      </figure>
    </>
  );
}

/** One message: the learner's at the right on the brand's tint, the
 *  tutor's at the left on white, each with the messenger's tail at its foot
 *  on the side it was sent from. The bubble's corner on that side is kept
 *  small, so the tail grows out of it rather than sitting on a curve. */
function Bubble({ side, children }: { side: "in" | "out"; children: ReactNode }) {
  const out = side === "out";
  return (
    <p
      className={cn(
        "relative max-w-[85%] px-3.5 pt-2 pb-2 text-sm",
        out
          ? "ml-auto rounded-[18px] rounded-br-[6px] bg-tint"
          : "mr-auto rounded-[18px] rounded-bl-[6px] bg-card",
      )}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 9 17"
        className={cn(
          "absolute bottom-0 h-[17px] w-[9px]",
          out ? "-right-[7px] text-tint" : "-left-[7px] -scale-x-100 text-card",
        )}
      >
        <path d="M0 0v17h9C4.5 16 1 12.5 0 0Z" fill="currentColor" />
      </svg>
    </p>
  );
}

/** The time a message went, at the bubble's foot on its far side, the way a
 *  messenger floats it: it sits beside the last line when that line leaves
 *  room, and drops under it when not. */
function Stamp({ children }: { children: ReactNode }) {
  return (
    <span className="relative top-1.5 float-right ml-3 flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
      {children}
    </span>
  );
}

/** The count of learners in a lesson, starting where the server rendered it
 *  and wandering by a few every four seconds once the page is live. */
function useLive() {
  const [n, setN] = useState(LIVE);
  useEffect(() => {
    const t = window.setInterval(() => {
      setN((was) =>
        Math.min(
          LIVE + 60,
          Math.max(LIVE - 60, was + Math.round((Math.random() - 0.45) * 12)),
        ),
      );
    }, 4000);
    return () => window.clearInterval(t);
  }, []);
  return n;
}
