"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowDownTrayIcon, CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Line } from "@/components/course/lessons/types";
import { clock, learnCopy } from "@/components/learn/copy";
import { cn } from "@/lib/utils";

/** The lesson's transcript, the same lines the captions read. The line being
 *  spoken is lit in the tutor's iris, since that is the colour a cited line
 *  wears everywhere on the site; a press on any line plays from it; the
 *  lines the tutor has answered from carry its dot. */
export function Transcript({
  lines,
  at,
  cites,
  lang,
  file,
  onJump,
}: {
  lines: Line[];
  at: number;
  cites: number[];
  lang?: string;
  /** The name and the text of the .txt the download writes. */
  file: { name: string; text: string };
  onJump: (at: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [follow, setFollow] = useState(true);
  const [more, setMore] = useState(false);
  const [below, setBelow] = useState(false);
  const list = useRef<HTMLOListElement>(null);
  const q = query.trim().toLowerCase();

  const now = lines.findLastIndex((l) => l.at <= at);
  const shown = useMemo(
    () => (q ? lines.filter((l) => l.text.toLowerCase().includes(q)) : lines),
    [lines, q],
  );

  // Following the video moves the list inside its own box, never the page,
  // and lands on a row's own edge: the box opens two lines before the one
  // being spoken, so what was just said stays in view and no row is cut in
  // half at the top.
  useEffect(() => {
    const box = list.current;
    if (!box || !follow || q) return;
    const row = box.querySelector<HTMLElement>(`[data-line="${Math.max(0, now - 2)}"]`);
    if (!row) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: row.offsetTop, behavior: still ? "auto" : "smooth" });
  }, [now, follow, q]);

  // The list fades at an edge while lines run on past it, so a line cut in
  // half by the box reads as more to come rather than as a clipped row.
  useEffect(() => {
    const box = list.current;
    if (!box) return;
    const measure = () => {
      setMore(box.scrollHeight - box.scrollTop - box.clientHeight > 8);
      setBelow(box.scrollTop > 8);
    };
    measure();
    const size = new ResizeObserver(measure);
    size.observe(box);
    box.addEventListener("scroll", measure, { passive: true });
    return () => {
      size.disconnect();
      box.removeEventListener("scroll", measure);
    };
  }, [shown.length]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-0 flex-1 basis-56">
          <span className="sr-only">{learnCopy.transcript.search}</span>
          {/* Inside the label, so a press on the glyph lands in the field. */}
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={learnCopy.transcript.search}
            className="h-10 w-full rounded-control bg-accent pl-10 pr-4 text-sm outline-none ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:bg-card focus:ring-2 focus:ring-ring"
          />
        </label>
        {q && (
          <span aria-live="polite" className="text-sm tabular-nums text-muted-foreground">
            {learnCopy.transcript.matches(shown.length)}
          </span>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            aria-pressed={follow}
            onClick={() => setFollow((f) => !f)}
            className={cn(
              "group/follow flex h-10 items-center gap-2 rounded-control px-3.5 text-sm press",
              "aria-pressed:bg-muted aria-pressed:hover:bg-secondary",
              "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent",
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-4 items-center justify-center rounded-[5px] ring-1 ring-inset ring-border group-aria-pressed/follow:bg-primary group-aria-pressed/follow:text-primary-foreground group-aria-pressed/follow:ring-primary"
            >
              {follow && <CheckIcon className="size-3" strokeWidth={2.5} />}
            </span>
            {learnCopy.transcript.follow}
          </button>
          <button
            type="button"
            onClick={() => download(file.name, file.text, "text/plain")}
            className="flex h-10 items-center gap-2 rounded-control px-3.5 text-sm ring-1 ring-inset ring-border press hover:bg-accent"
          >
            <ArrowDownTrayIcon aria-hidden="true" className="size-4" />
            {learnCopy.transcript.download}
          </button>
        </div>
      </div>

      {q && !shown.length && (
        <p className="mt-6 max-w-prose text-base text-muted-foreground">{learnCopy.transcript.noMatch(query.trim())}</p>
      )}
      <ol
        ref={list}
        className={cn(
          "no-scrollbar relative mt-4 flex max-h-[30rem] flex-col gap-1 overflow-y-auto overscroll-contain",
          more && !below && "[mask-image:linear-gradient(to_bottom,black_calc(100%-4rem),transparent)]",
          more && below && "[mask-image:linear-gradient(to_bottom,transparent,black_3rem,black_calc(100%-4rem),transparent)]",
          !more && below && "[mask-image:linear-gradient(to_bottom,transparent,black_3rem)]",
        )}
      >
        {shown.map((l) => {
          const i = lines.indexOf(l);
          const live = i === now && at > 0;
          const cited = cites.includes(l.at);
          return (
            <li key={l.at} data-line={i} data-text={l.text.toLowerCase()}>
              <button
                type="button"
                onClick={() => onJump(l.at)}
                aria-current={live || undefined}
                // The ring is drawn inside the row: the list scrolls, and a
                // ring outside its rows is cut off by the list's own edge.
                className={cn(
                  "group/line grid w-full grid-cols-[3.25rem_minmax(0,1fr)] gap-3 rounded-sm px-3 py-2.5 text-left transition-colors focus-visible:-outline-offset-2",
                  "aria-[current=true]:bg-iris/15 aria-[current=true]:hover:bg-iris/25 aria-[current=true]:active:bg-iris/30 not-aria-[current=true]:hover:bg-accent not-aria-[current=true]:active:bg-muted",
                )}
              >
                <span className="flex items-center gap-1.5 pt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {clock(l.at)}
                  {cited && <span aria-hidden="true" className="size-1.5 rounded-full bg-iris" />}
                </span>
                <span lang={lang} className={cn("text-balance text-base", at > l.at && "text-muted-foreground group-aria-[current=true]/line:text-inherit")}>
                  {q ? mark(l.text, q) : l.text}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** A line with every match of the search picked out in the brand's tint. */
function mark(text: string, q: string): ReactNode[] {
  const out: ReactNode[] = [];
  const low = text.toLowerCase();
  let from = 0;
  for (let i = low.indexOf(q); i !== -1; i = low.indexOf(q, from)) {
    out.push(text.slice(from, i));
    out.push(
      <mark key={i} className="rounded-[3px] bg-primary/35 text-foreground">
        {text.slice(i, i + q.length)}
      </mark>,
    );
    from = i + q.length;
  }
  out.push(text.slice(from));
  return out;
}

/** Hands the browser a file built on the spot, since there is no server to
 *  fetch one from. */
export function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** The status the tab shows in place of lines: captions not yet checked, or a
 *  lesson whose transcript opens on enrolling. */
export function TranscriptNote({ text }: { text: string }) {
  return <p className="max-w-prose text-base text-muted-foreground">{text}</p>;
}
