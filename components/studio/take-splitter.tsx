"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { clock } from "@/components/learn/copy";
import { takeCopy as copy } from "@/components/studio/copy";
import { player, takeClock, usePlayer } from "@/components/studio/player";
import { progress } from "@/components/studio/progress";
import type { Take } from "@/components/studio/take";
import { TAKE_PHOTO } from "@/components/studio/window";
import { AiIcon } from "@/components/ui/ai-icon";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { SliderControl, SliderRoot, SliderThumb, SliderTrack } from "@/components/ui/slider";
import { cn } from "@/lib/utils";


type Cut = { at: number; kept: boolean; reason: string; lesson: string };

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function TakeSplitter({ take }: { take: Take }) {
  const first = useMemo<Cut[]>(
    () =>
      take.lessons.slice(1).map((l) => ({ at: l.start, kept: false, reason: l.reason ?? "", lesson: l.id })),
    [take],
  );
  const [cuts, setCuts] = useState<Cut[]>(first);
  // While the split runs again: how many of its cuts have been found.
  const [found, setFound] = useState<number | null>(null);
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { t, playing } = usePlayer();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The take plays in real time from wherever it was left.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const now = player.read().t;
      if (now + 1 >= take.length) {
        player.seek(take.length);
        player.pause();
      } else player.seek(now + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [playing, take.length]);

  const shown = found === null ? cuts : cuts.slice(0, found);
  const lessons = useMemo(() => {
    const starts = [0, ...shown.map((c) => c.at)];
    return starts.map((start, i) => {
      const end = i < shown.length ? shown[i].at : take.length;
      const id = i === 0 ? take.lessons[0].id : shown[i - 1].lesson;
      const lesson = take.lessons.find((l) => l.id === id) ?? take.lessons[0];
      return { ...lesson, start, end, n: i + 1 };
    });
  }, [shown, take]);
  const current = lessons.findLast((l) => l.start <= t) ?? lessons[0];
  const line = take.lines.findLast((l) => l.at <= t);

  // Keep the line being said in view inside the transcript's own box, never
  // by scrolling the page. A line a cut opens is kept in view with its cut,
  // so the cut just reached is read whole.
  useEffect(() => {
    const el = box.current?.querySelector<HTMLElement>('[data-now="true"]')?.closest("li");
    const b = box.current;
    if (!el || !b) return;
    let top = el.offsetTop - b.clientHeight / 3;
    // A cut coming next is brought up whole with its calls, as long as the
    // line being said stays in view above it.
    const cut = el.nextElementSibling?.querySelector<HTMLElement>("[data-cut]");
    if (cut) top = Math.min(el.offsetTop, Math.max(top, cut.offsetTop + cut.offsetHeight - b.clientHeight + 8));
    b.scrollTo({ top, behavior: reduced() ? "auto" : "smooth" });
  }, [line?.at]);

  const waiting = cuts.filter((c) => !c.kept).length;

  // The window's Recordings tab reports on the cuts, so they are told as
  // they change.
  useEffect(() => {
    progress.set("cuts", { waiting, total: cuts.length, published });
  }, [waiting, cuts.length, published]);

  // The cut whose stretch of the take is playing: the last one the playhead
  // has passed, or none while the first lesson plays. The Cuts card follows
  // it as the transcript does.
  const inCut = shown.findLastIndex((c) => c.at <= t);

  const setCut = (i: number, change: (c: Cut) => Cut | null) => {
    setPublished(false);
    setCuts((all) => {
      const next = [...all];
      const changed = change(next[i]);
      if (changed) next[i] = changed;
      else next.splice(i, 1);
      return next;
    });
  };

  const nudge = (i: number, by: number) =>
    setCut(i, (c) => {
      const low = (i === 0 ? 0 : cuts[i - 1].at) + 60;
      const high = (i === cuts.length - 1 ? take.length : cuts[i + 1].at) - 60;
      return { ...c, at: Math.min(high, Math.max(low, c.at + by)) };
    });

  const splitAgain = () => {
    timers.current.forEach(clearTimeout);
    setPublished(false);
    setCuts(first);
    if (reduced()) {
      setStatus(copy.status.split(first.length, takeClock(take.length)));
      return;
    }
    setFound(0);
    setStatus(copy.splitting);
    first.forEach((_, i) => {
      timers.current.push(setTimeout(() => setFound(i + 1), 700 + i * 450));
    });
    timers.current.push(
      setTimeout(() => {
        setFound(null);
        setStatus(copy.status.split(first.length, takeClock(take.length)));
      }, 700 + first.length * 450),
    );
  };

  const toggle = () => (playing ? player.pause() : player.play());

  return (
    <section id="recordings" aria-labelledby="take-title" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <Eyebrow>{copy.eyebrow}</Eyebrow>
      <SectionHeading className="mt-5">
        <span id="take-title">{copy.heading}</span>
      </SectionHeading>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground">{copy.lede}</p>

      <div className="mt-24 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-10 lg:gap-y-16">
        {/* Row one: the take and its rail, over the reference's tinted panel,
            which runs under the still's right edge; the still cuts it with a
            band of the page's own ground. */}
        <div className="relative grid gap-8 lg:col-span-2 lg:grid-cols-subgrid">
          <div aria-hidden="true" className="absolute -inset-y-8 right-0 left-[52%] hidden rounded-lg bg-accent lg:block" />
          <div className="relative min-w-0 lg:self-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-video lg:ring-[10px] lg:ring-background">
              <Image src={TAKE_PHOTO} alt={copy.alt} fill sizes="(min-width: 1280px) 846px, (min-width: 1024px) 64vw, 94vw" className="object-cover" />
              <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 sm:top-4 sm:left-4">
                <span className="inline-flex h-8 items-center gap-2 rounded-control bg-card px-3 text-sm font-medium">
                  {take.label}
                  <span className="font-normal tabular-nums text-muted-foreground">{takeClock(take.length)}</span>
                </span>
              </div>
              {/* The whole still plays the take, as a video's poster does; the
                  haloed disc at its centre is what says so, as the reference
                  sets it. */}
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? copy.pause : copy.play}
                className="group absolute inset-0 flex items-center justify-center rounded-lg outline-none sm:pb-[8%] focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="flex items-center justify-center rounded-full transition-colors sm:size-28 sm:bg-white/30 sm:group-hover:bg-white/45">
                  <span className="flex size-14 items-center justify-center rounded-full bg-card shadow-soft-lg transition-transform group-hover:scale-105 group-active:scale-100 sm:size-16">
                    {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="ml-0.5 size-6" />}
                  </span>
                </span>
              </button>
              {/* What is being said, as a caption, once the take plays. */}
              {line && t > 0 && (
                <p className="absolute inset-x-3 bottom-20 hidden justify-center sm:flex">
                  <span className="max-w-xl rounded-sm bg-card px-3 py-1.5 text-center text-sm">{line.text}</span>
                </p>
              )}
              <div className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-[calc(var(--radius-lg)-0.75rem)] bg-card py-1 pr-3 pl-2 sm:inset-x-4 sm:bottom-4 sm:rounded-[calc(var(--radius-lg)-1rem)] sm:pr-5">
                <button
                  type="button"
                  id="take-play"
                  onClick={toggle}
                  aria-label={playing ? copy.pause : copy.play}
                  className="flex size-10 shrink-0 items-center justify-center rounded-control press hover:bg-muted"
                >
                  {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
                </button>
                <span className="shrink-0 text-sm tabular-nums">
                  {takeClock(t)} <span className="hidden text-muted-foreground sm:inline">/ {takeClock(take.length)}</span>
                </span>
                <SliderRoot
                  aria-label={copy.seek}
                  value={t}
                  min={0}
                  max={take.length}
                  step={1}
                  onValueChange={(v) => player.seek(v as number)}
                  className="min-w-0 flex-1"
                >
                  <SliderControl>
                    <SliderTrack className="relative bg-muted">
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 rounded-full bg-primary"
                        style={{ width: `${(t / take.length) * 100}%` }}
                      />
                      {shown.map((c, i) => (
                        <span
                          key={i}
                          aria-hidden="true"
                          className={cn(
                            "absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                            c.kept ? "bg-foreground" : "bg-iris",
                          )}
                          style={{ left: `${(c.at / take.length) * 100}%` }}
                        />
                      ))}
                      <SliderThumb aria-label={copy.seek} getAriaValueText={(_, v) => takeClock(v)} />
                    </SliderTrack>
                  </SliderControl>
                </SliderRoot>
              </div>
            </div>

          </div>
          {/* The rail: the lessons the cuts make, each a frame of the query on
              screen where it starts. A press plays it from there. */}
          <div className="relative rounded-lg bg-accent p-3 lg:bg-transparent lg:p-0 lg:pt-2 lg:pr-5">
            <div className="flex items-baseline justify-between px-1">
              <h3 className="text-sm font-medium">{copy.found}</h3>
              <span className="text-sm tabular-nums text-muted-foreground">{found === null ? lessons.length : found + 1}</span>
            </div>
            <ol data-object className="mt-3 flex flex-col gap-2">
              {lessons.map((l) => {
                const minutes = Math.round((l.end - l.start) / 60);
                const on = current.start === l.start;
                return (
                  <li key={`${l.id}-${l.start}`}>
                    <button
                      type="button"
                      onClick={() => player.seek(l.start)}
                      aria-current={on ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md p-2 text-left transition-[background-color,box-shadow] sm:gap-3 sm:p-2.5",
                        "aria-[current=true]:bg-card aria-[current=true]:shadow-soft aria-[current=true]:hover:shadow-soft-lg aria-[current=true]:active:shadow-none not-aria-[current=true]:hover:bg-card not-aria-[current=true]:active:bg-background",
                      )}
                    >
                      {/* One height a lesson: the frame sets it, and the
                          title beside it holds to two lines, balanced. The
                          frame is a screen, dark in both halves. */}
                      <span aria-hidden="true" className="relative flex aspect-video w-20 shrink-0 flex-col overflow-hidden rounded-[calc(var(--radius-md)-0.5rem)] bg-fixed-dark pt-2 pl-2 font-mono text-xs text-fixed-light/80 sm:w-32 sm:rounded-[calc(var(--radius-md)-0.625rem)]">
                        {l.frame.slice(0, 2).map((f, i) => (
                          <span key={f} className={cn("overflow-hidden whitespace-pre", i === 1 && "max-sm:hidden")}>
                            {f}
                          </span>
                        ))}
                        <span className="absolute right-1 bottom-1 flex size-4 items-center justify-center rounded-full bg-fixed-light text-fixed-dark sm:right-1.5 sm:bottom-1.5 sm:size-5">
                          <PlayIcon className="ml-px size-2 sm:size-2.5" />
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs tabular-nums text-muted-foreground">
                          {copy.lessonMeta(`4.${l.n}`, minutes)}
                        </span>
                        <span className="mt-1 line-clamp-2 text-sm font-medium text-balance max-sm:max-w-[13rem]">{l.drafted}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {found !== null &&
                Array.from({ length: first.length - found }, (_, i) => (
                  <li key={`wait-${i}`} aria-hidden="true" className="flex items-center gap-2.5 p-2 sm:gap-3 sm:p-2.5">
                    <span className="aspect-video w-20 shrink-0 rounded-[calc(var(--radius-md)-0.5rem)] bg-iris-mark motion-safe:animate-pulse sm:w-32 sm:rounded-[calc(var(--radius-md)-0.625rem)]" />
                    <span className="flex flex-1 flex-col gap-2 pt-1">
                      <span className="h-2 w-10 rounded-full bg-iris-mark motion-safe:animate-pulse" />
                      <span className="h-2 w-5/6 rounded-full bg-iris-mark motion-safe:animate-pulse" />
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* The transcript the cuts are read from: every line at its second,
            the one being said marked, and each cut with its reason and the
            four things it can be made to do. */}
        {/* From lg the transcript stands as tall as the Cuts card beside it,
            top to top and foot to foot. */}
        <div data-object className="flex flex-col rounded-lg bg-card ring-1 ring-border">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-3 sm:px-5">
            <h3 className="text-sm font-medium">{copy.transcript}</h3>
            <p className="text-sm tabular-nums text-muted-foreground">
              {copy.lessonAt(current.id, clock(Math.max(0, t - current.start)))}
            </p>
          </div>
          {/* The lines' box stands inside a frame that takes the row's
              height from lg, laid over it so its thousands of pixels of lines
              ask the row for none. The frame stops short of the card's foot
              by the box's own side inset, so the last line in view is cut
              inside the card rather than at its edge. */}
          <div className="relative mb-2 sm:mb-3 lg:flex-1">
          <div ref={box} className="no-scrollbar relative max-h-80 overflow-y-auto px-2 py-2 sm:px-3 lg:absolute lg:inset-0 lg:max-h-none">
            <ol>
              {take.lines.map((l, i) => {
                const cutIndex = shown.findIndex((c) => {
                  const prev = take.lines[i - 1];
                  return l.at >= c.at && (!prev || prev.at < c.at);
                });
                return (
                  <Row
                    key={l.at}
                    cut={cutIndex >= 0 ? { ...shown[cutIndex], n: cutIndex + 1 } : null}
                    onKeep={() => setCut(cutIndex, (c) => (c ? { ...c, kept: true } : c))}
                    onEarlier={() => nudge(cutIndex, -5)}
                    onLater={() => nudge(cutIndex, 5)}
                    onMerge={() => {
                      setCut(cutIndex, () => null);
                      setStatus(copy.status.merged(cutIndex + 1));
                    }}
                  >
                    <button
                      type="button"
                      data-now={line?.at === l.at ? "true" : undefined}
                      onClick={() => player.seek(l.at)}
                      className={cn(
                        "flex w-full gap-4 rounded-sm px-2 py-2 text-left text-sm transition-colors",
                        "data-now:bg-accent data-now:hover:bg-muted data-now:active:bg-secondary",
                        "not-data-now:hover:bg-accent not-data-now:active:bg-muted",
                      )}
                    >
                      <span className="mt-0.5 w-14 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                        {takeClock(l.at)}
                      </span>
                      <span>{l.text}</span>
                    </button>
                  </Row>
                );
              })}
            </ol>
          </div>
          </div>
        </div>

        {/* The cuts, each with where it falls and whether it is kept, then
            what the take still needs and the three things to do with it. */}
        <div data-object className="flex flex-col rounded-lg bg-card p-4 ring-1 ring-border sm:p-5 lg:self-start">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-medium">{copy.cuts}</h3>
            <span className="text-sm tabular-nums text-muted-foreground">{shown.length}</span>
          </div>
          {/* The take's opening, then every cut: the row whose stretch is
              playing is the current one, and moves as the take plays or the
              transcript is pressed. A press lands on the cut itself. */}
          <ul className="mt-3 flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={() => player.seek(0)}
                aria-current={inCut < 0 ? "true" : undefined}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-sm px-2 text-left text-sm transition-colors",
                  "aria-[current=true]:bg-accent aria-[current=true]:font-medium aria-[current=true]:hover:bg-muted aria-[current=true]:active:bg-secondary not-aria-[current=true]:hover:bg-accent not-aria-[current=true]:active:bg-muted",
                )}
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-foreground/40" />
                <span className="flex-1 tabular-nums">{copy.opens(takeClock(0))}</span>
              </button>
            </li>
            {shown.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-label={copy.goToCut(i + 1)}
                  aria-current={inCut === i ? "true" : undefined}
                  onClick={() => player.seek(c.at)}
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-sm px-2 text-left text-sm transition-colors",
                    "aria-[current=true]:bg-accent aria-[current=true]:font-medium aria-[current=true]:hover:bg-muted aria-[current=true]:active:bg-secondary not-aria-[current=true]:hover:bg-accent not-aria-[current=true]:active:bg-muted",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn("ml-0.5 h-3 w-0.5 shrink-0 rounded-full", c.kept ? "bg-foreground" : "bg-iris")}
                  />
                  <span className="flex-1 tabular-nums">{copy.cut(i + 1, takeClock(c.at))}</span>
                  <span className={cn("flex items-center gap-1 text-xs font-normal", c.kept ? "text-foreground" : "text-iris-ink")}>
                    {c.kept ? <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} /> : <AiIcon size={12} />}
                    {c.kept ? copy.kept : copy.drafted}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p aria-live="polite" className="mt-4 text-sm text-muted-foreground">
            {published
              ? copy.status.published(lessons.length)
              : status ?? (waiting ? copy.status.waiting(waiting) : copy.status.ready)}
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              size="lg"
              className="w-full"
              disabled={waiting > 0 || published || found !== null}
              focusableWhenDisabled
              onClick={() => {
                setPublished(true);
                setStatus(null);
              }}
            >
              {copy.publish(lessons.length)}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={!waiting || found !== null}
              focusableWhenDisabled
              onClick={() => {
                setCuts((all) => all.map((c) => ({ ...c, kept: true })));
                setStatus(null);
              }}
            >
              {copy.keepAll}
            </Button>
            <Button variant="ghost" className="w-full" onClick={splitAgain} disabled={found !== null} focusableWhenDisabled>
              <AiIcon size={16} />
              {copy.splitAgain}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A line of the transcript, with the cut that falls before it, if one
 *  does: a rule across the transcript, the cut's number, time and reason,
 *  and its four actions. A cut the studio drew is dashed in its iris until
 *  it is kept. */
function Row({
  cut,
  onKeep,
  onEarlier,
  onLater,
  onMerge,
  children,
}: {
  cut: (Cut & { n: number }) | null;
  onKeep: () => void;
  onEarlier: () => void;
  onLater: () => void;
  onMerge: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      {cut && (
        <div data-cut className="my-2 rounded-md py-3 sm:px-2">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn("h-0 flex-1 border-t-2", cut.kept ? "border-foreground" : "border-dashed border-iris")}
            />
            <span
              className={cn(
                "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-control px-2.5 text-xs tabular-nums",
                cut.kept ? "bg-foreground text-background" : "bg-[color-mix(in_oklab,var(--iris)_12%,var(--card))] text-iris-ink",
              )}
            >
              {cut.kept ? <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={2} /> : <AiIcon size={13} />}
              {copy.cut(cut.n, takeClock(cut.at))}
            </span>
            <span aria-hidden="true" className={cn("h-0 flex-1 border-t-2", cut.kept ? "border-foreground" : "border-dashed border-iris")} />
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">{cut.reason}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-0.5 sm:gap-1">
            <Button variant={cut.kept ? "ghost" : "outline"} size="sm" onClick={onKeep} disabled={cut.kept} className="max-sm:px-2.5">
              {cut.kept ? copy.kept : copy.keep}
            </Button>
            <Button variant="ghost" size="sm" aria-label={copy.earlierLabel(cut.n)} onClick={onEarlier} className="max-sm:px-2.5">
              <span className="sm:hidden">{copy.earlierShort}</span>
              <span className="max-sm:hidden">{copy.earlier}</span>
            </Button>
            <Button variant="ghost" size="sm" aria-label={copy.laterLabel(cut.n)} onClick={onLater} className="max-sm:px-2.5">
              <span className="sm:hidden">{copy.laterShort}</span>
              <span className="max-sm:hidden">{copy.later}</span>
            </Button>
            <Button variant="ghost" size="sm" aria-label={copy.mergeLabel(cut.n)} onClick={onMerge} className="max-sm:px-2.5">
              {copy.merge}
            </Button>
          </div>
        </div>
      )}
      {children}
    </li>
  );
}
