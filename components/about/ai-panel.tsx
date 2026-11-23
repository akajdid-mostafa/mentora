"use client";

import { useState } from "react";
import { Chat01Icon, Edit02Icon, Route01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { aiCopy, type AiPanel, type AiTool } from "@/components/about/copy";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Highlight, SectionHeading } from "@/components/ui/section-heading";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

const ICON: Record<AiTool, IconSvgElement> = {
  tutor: Chat01Icon,
  studio: Edit02Icon,
  planner: Route01Icon,
};

// The model's bar in the page's second colour, which is the colour AI wears
// everywhere on the site; the person's in ink. A data fill,
// so it is the hue at full strength rather than a whisper of it.
const MODEL = "bg-iris";
const PERSON = "bg-foreground";

export function AiPanel() {
  const c = aiCopy;
  const [tool, setTool] = useState<AiTool>("tutor");

  return (
    <section id="ai" className="mx-auto w-full max-w-7xl px-6 sm:px-8">
      <div className="flex flex-col items-center text-center">
        <Eyebrow className="justify-center">{c.eyebrow}</Eyebrow>
        <SectionHeading className="mx-auto mt-5 text-center">
          {c.heading[0]}
          <Highlight>{c.heading[1]}</Highlight>
          {c.heading[2]}
        </SectionHeading>
        <p className="mt-6 max-w-xl text-base text-muted-foreground">{c.lede}</p>

        <div className="mt-10 flex max-w-full overflow-x-auto no-scrollbar">
          <TabTrack
            idPrefix="ai-tab"
            label={c.label}
            controls="ai-panel"
            value={tool}
            onChange={setTool}
            options={(Object.keys(c.panels) as AiTool[]).map((id) => ({
              id,
              label: c.panels[id].tab,
              icon: <HugeiconsIcon icon={ICON[id]} size={16} strokeWidth={1.8} />,
            }))}
          />
        </div>
      </div>

      {/* The panel: the tool's line on the left, what it did last week on
          the right. The page's AI hue as a showcase surface, so the one
          section that is about the model wears the model's colour, and ink
          on it is the foreground alone. */}
      <div
        id="ai-panel"
        role="tabpanel"
        aria-labelledby={`ai-tab-${tool}`}
        className="mt-8 grid gap-10 rounded-lg bg-iris-surface p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-14 lg:p-14"
      >
        {/* All three tools' words are laid in one cell and only the picked
            one is shown, so the cell is always the tallest of the three and
            nothing under the panel moves when a tab is pressed. */}
        <div className="grid min-w-0">
          {(Object.keys(c.panels) as AiTool[]).map((id) => {
            const q = c.panels[id];
            const on = id === tool;
            return (
              <div
                key={id}
                aria-hidden={!on}
                className={cn(
                  "min-w-0 [grid-area:1/1]",
                  on ? "animate-in fade-in duration-sheet ease-sheet motion-reduce:animate-none" : "invisible",
                )}
              >
                <h3 className="max-w-md text-2xl tracking-tight sm:text-3xl sm:tracking-tighter">{q.title}</h3>
                <p className="mt-5 max-w-md text-base">{q.body}</p>
                <div aria-hidden="true" className="mt-8 h-px max-w-md bg-foreground/10" />
                {/* one column on a phone, where a half is 100px and every label
                    breaks; two from sm, where each label holds one line */}
                <dl className="mt-8 grid max-w-md gap-6 sm:grid-cols-2">
                  {q.figures.map((f) => (
                    // the label first for a screen reader, drawn under its figure
                    <div key={f.label} className="flex min-w-0 flex-col">
                      <dt className="order-last mt-2 text-sm">{f.label}</dt>
                      <dd className="font-heading text-4xl tracking-tighter tabular-nums sm:text-5xl">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>

        {/* the three charts in one cell as well, for the same reason */}
        <div className="grid min-w-0">
          {(Object.keys(c.panels) as AiTool[]).map((id) => (
            <div key={id} aria-hidden={id !== tool} inert={id !== tool} className={cn("min-w-0 [grid-area:1/1]", id !== tool && "invisible")}>
              <Chart chart={c.panels[id].chart} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Seven pairs of bars, the person's and the model's, each pair a button
 *  that reads its two figures out in the dark pill over it. The pill rests
 *  on the pair the panel is about before anybody points at one. */
function Chart({ chart }: { chart: AiPanel["chart"] }) {
  const [reading, setReading] = useState(chart.rests);
  const max = Math.max(...chart.rows.map((r) => Math.max(r.person, r.model)));
  // Headroom over the tallest bar for the pill, so it never meets the header.
  const top = max * 1.45;
  const h = (n: number) => `${(n / top) * 100}%`;
  const read = chart.rows[reading];
  const fmt = (n: number) => n.toLocaleString("en-US");

  const series = [
    { key: "person" as const, label: chart.person, fill: PERSON },
    { key: "model" as const, label: chart.model, fill: MODEL },
  ];
  const ordered = chart.modelFirst ? [series[1], series[0]] : series;

  return (
    <figure data-picture className="min-w-0 rounded-lg bg-card p-5 text-left shadow-soft sm:p-7">
      <figcaption className="flex flex-col gap-2.5">
        <span className="text-base font-medium">{chart.title}</span>
        <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {ordered.map((s) => (
            <span key={s.key} className="flex items-center gap-2">
              <span aria-hidden="true" className={cn("size-2 rounded-full", s.fill)} />
              {s.label}
            </span>
          ))}
        </span>
      </figcaption>

      {/* the reading on a phone, where the plot is too narrow to float it */}
      <dl aria-hidden="true" className="mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-sm bg-accent px-4 py-3 text-sm sm:hidden">
        <dt className="font-medium">{read.long}</dt>
        <dd className="flex gap-3 tabular-nums">
          {ordered.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", s.fill)} />
              {fmt(read[s.key])}
            </span>
          ))}
        </dd>
      </dl>

      <div className="relative mt-6 h-56 sm:mt-8 sm:h-64">
        {/* four dashed rules and a solid floor, the reference's grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <span
            key={t}
            aria-hidden="true"
            style={{ bottom: `${t * 100}%` }}
            className={cn("absolute inset-x-0 h-px", t === 0 ? "bg-border" : "border-t border-dashed border-border")}
          />
        ))}

        <ol className="absolute inset-0 grid grid-cols-7">
          {chart.rows.map((r, i) => {
            const on = i === reading;
            return (
              <li key={r.label} className="relative">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setReading(i)}
                  onPointerEnter={() => setReading(i)}
                  onFocus={() => setReading(i)}
                  aria-label={`${r.long}: ${fmt(r.person)} ${chart.person.toLowerCase()}, ${fmt(r.model)} ${chart.model.toLowerCase()}`}
                  className={cn(
                    "absolute inset-x-0.5 inset-y-0 flex items-end justify-center gap-1 rounded-sm transition-colors sm:inset-x-1.5 sm:gap-1.5",
                    "aria-pressed:bg-accent aria-pressed:hover:bg-muted aria-pressed:active:bg-secondary not-aria-pressed:hover:bg-accent not-aria-pressed:active:bg-muted",
                  )}
                >
                  {ordered.map((s) => (
                    <span
                      key={s.key}
                      aria-hidden="true"
                      style={{ height: h(r[s.key]) }}
                      className={cn(
                        "w-2.5 rounded-t-full transition-[height] motion-reduce:transition-none sm:w-3.5",
                        s.fill,
                      )}
                    />
                  ))}
                </button>
              </li>
            );
          })}
        </ol>

        <div
          aria-hidden="true"
          style={{
            left: `${((reading + 0.5) / 7) * 100}%`,
            bottom: `calc(${h(Math.max(read.person, read.model))} + 12px)`,
          }}
          className={cn(
            "pointer-events-none absolute z-10 hidden w-max -translate-x-1/2 rounded-sm bg-foreground px-3 py-2 text-xs text-background shadow-soft-lg transition-[left,bottom] motion-reduce:transition-none sm:block",
            "after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[5px] after:border-t-[5px] after:border-x-transparent after:border-t-foreground after:content-['']",
            reading === 0 && "translate-x-[-22%] after:left-[22%]",
            reading === 6 && "translate-x-[-78%] after:left-[78%]",
          )}
        >
          <p className="font-medium">{read.long}</p>
          <dl className="mt-1.5 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5">
            {ordered.map((s) => (
              <div key={s.key} className="contents">
                <dt>{s.label}</dt>
                <dd className="text-right tabular-nums">{fmt(read[s.key])}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <ol aria-hidden="true" className="mt-3 grid grid-cols-7 text-center text-xs text-muted-foreground">
        {chart.rows.map((r, i) => (
          <li key={r.label} className={cn(i === reading && "text-foreground")}>
            {r.label}
          </li>
        ))}
      </ol>
    </figure>
  );
}
