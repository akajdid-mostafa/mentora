"use client";

import { useState, type ReactNode } from "react";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { glyph, LevelDots } from "@/components/course/course-card";
import {
  credentials,
  durations,
  languages,
  levels,
  ratings,
  topics,
  topicTint,
} from "@/components/course/courses";
import { PriceControl } from "@/components/catalog/controls";
import { CountBadge } from "@/components/listing/chip";
import {
  chips,
  counts,
  EMPTY,
  results,
  type Filters,
} from "@/components/catalog/state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { whenPressed } from "@/components/ui/selected";
import { TabTrack } from "@/components/ui/tab-track";
import { cn } from "@/lib/utils";

/** Every filter at once, as the reference's modal lays them out: one group
 *  per band, and a foot that stays put and says how many courses the choice
 *  leaves. Nothing changes on the page behind until that button is pressed,
 *  so a visitor can try a set and walk away from it. A band of
 *  chosen chips over the groups is left out on purpose: it grew
 *  and shrank with every pick, and pushed the option just pressed out from
 *  under the pointer. */
export function FiltersDialog({
  filters,
  onApply,
  className,
}: {
  filters: Filters;
  onApply: (next: Filters) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  // The panel sets the filters and the field sets the search. So the pill
  // counts the filters alone, Clear all clears what the panel shows and
  // leaves the search standing, and the counts inside, which the search
  // still narrows, say so under the title.
  const active = chips(filters).filter((c) => c.key !== "q").length;
  const n = counts(draft);
  const found = results(draft, "recommended").length;
  const set = (patch: Partial<Filters>) => setDraft((d) => ({ ...d, ...patch }));
  const flip = <T,>(list: T[], v: T) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(filters);
        setOpen(next);
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={active ? `Filters, ${active} on` : "Filters"}
            className={cn(
              "relative flex h-10 shrink-0 items-center gap-2 rounded-control border border-border bg-card px-4 text-sm transition-colors hover:bg-accent data-[popup-open]:bg-accent",
              className,
            )}
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={16} strokeWidth={1.8} />
            Filters
            {active > 0 && <CountBadge n={active} />}
          </button>
        }
      />
      <DialogContent className="sm:max-w-2xl">
        <div className="relative flex shrink-0 flex-col items-center justify-center border-b px-14 py-4 text-center">
          <DialogTitle>Filters</DialogTitle>
          {draft.q && (
            <DialogDescription className="mt-0.5">
              Counting within your search for “{draft.q}”
            </DialogDescription>
          )}
          <DialogCloseButton className="absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="no-scrollbar min-h-0 flex-1 divide-y overflow-y-auto overscroll-contain px-6 sm:px-8">
          <Band title="Subject">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {topics.map((t) => {
                const Glyph = glyph[t];
                const on = draft.topic === t;
                const count = n.topic.get(t) ?? 0;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    disabled={!on && count === 0}
                    onClick={() => set({ topic: on ? null : t })}
                    className={cn(
                      "flex flex-col items-start gap-6 rounded-sm bg-card p-4 text-left transition-[box-shadow,background-color] active:bg-muted",
                      "aria-pressed:ring-2 aria-pressed:ring-primary aria-pressed:hover:ring-primary/70",
                      "not-aria-pressed:ring-1 not-aria-pressed:ring-inset not-aria-pressed:ring-border not-aria-pressed:hover:bg-accent not-aria-pressed:active:bg-muted",
                      "disabled:cursor-not-allowed disabled:text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full",
                        topicTint[t].lid,
                        topicTint[t].ink,
                      )}
                    >
                      <Glyph className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{t}</span>
                      <span className="block text-sm tabular-nums text-muted-foreground">
                        {count} {count === 1 ? "course" : "courses"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Band>

          <Band title="Level">
            <Options>
              {levels.map((l) => (
                <Option
                  key={l}
                  on={draft.level.includes(l)}
                  count={n.level.get(l) ?? 0}
                  onClick={() => set({ level: flip(draft.level, l) })}
                >
                  <LevelDots level={l} ink={draft.level.includes(l)} />
                  {l}
                </Option>
              ))}
            </Options>
          </Band>

          <Band title="Duration">
            <Options>
              {durations.map((d) => (
                <Option
                  key={d}
                  on={draft.duration.includes(d)}
                  count={n.duration.get(d) ?? 0}
                  onClick={() => set({ duration: flip(draft.duration, d) })}
                >
                  {d}
                </Option>
              ))}
            </Options>
          </Band>

          <Band title="Price" note="Per course, in US dollars">
            <PriceControl
              value={draft.price}
              onChange={(price) => set({ price })}
              histogram={n.histogram}
              found={n.priceIn(draft.price)}
            />
          </Band>

          <Band title="Rating">
            {/* The reference's segmented switcher, one of four, on a white bar
                rather than its grey well (the studio's call, 27/09/2026): the
                chosen pane wears the site's picked ring. */}
            <TabTrack
              kind="radios"
              label="Rating"
              idPrefix="rating"
              on="card"
              options={[null, ...[...ratings].reverse()].map((r) => {
                const count = r === null ? n.ratingAll : (n.rating.get(r) ?? 0);
                return {
                  id: r === null ? "any" : String(r),
                  label:
                    r === null ? (
                      "Any"
                    ) : (
                      <span className="flex items-center gap-1.5">
                        {/* under 360 a cell is 63px, and the band's title
                            already says these are ratings */}
                        <StarSolid className="size-3.5 shrink-0 text-sun-ink max-[359px]:hidden" />
                        {`${r.toFixed(1)}+`}
                      </span>
                    ),
                  count,
                  disabled: draft.rating !== r && count === 0,
                  // four to a row in the dialog's width: the cell is its own room
                  className: "px-0 sm:px-0",
                };
              })}
              value={draft.rating === null ? "any" : String(draft.rating)}
              onChange={(id) => set({ rating: id === "any" ? null : Number(id) })}
              className="grid w-full grid-cols-4"
            />
          </Band>

          <Band title="Language" note="The language the lessons are recorded in">
            <Options>
              {languages.map((l) => (
                <Option
                  key={l}
                  on={draft.language.includes(l)}
                  count={n.language.get(l) ?? 0}
                  onClick={() => set({ language: flip(draft.language, l) })}
                >
                  {l}
                </Option>
              ))}
            </Options>
          </Band>

          <Band title="Credential" note="What you walk away holding">
            <Options>
              {credentials.map((c) => (
                <Option
                  key={c}
                  on={draft.credential.includes(c)}
                  count={n.credential.get(c) ?? 0}
                  onClick={() => set({ credential: flip(draft.credential, c) })}
                >
                  {c}
                </Option>
              ))}
            </Options>
          </Band>
        </div>

        {/* The reference's sticky foot: a plain way out on the left, and the
            count of what the choice leaves on the button that applies it. */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => setDraft({ ...EMPTY, q: draft.q })}
            className="relative text-sm font-medium underline underline-offset-4 press hover:text-muted-foreground after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']"
          >
            Clear all
          </button>
          <Button
            disabled={found === 0}
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            {found === 0 ? "No courses match" : `Show ${found} ${found === 1 ? "course" : "courses"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Band({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="py-7">
      <h3 className="text-lg font-medium">{title}</h3>
      {note && <p className="mt-1 text-sm text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Options({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

/** An option as a chip that stays pressed, with the count it would leave. An
 *  option that would empty the page is locked unless it is already on. */
function Option({
  on,
  count,
  onClick,
  children,
}: {
  on: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={!on && count === 0}
      onClick={onClick}
      className={cn(
        "group/option flex h-10 items-center gap-2 rounded-control px-4 text-sm press",
        "bg-card ring-1 ring-inset ring-border hover:bg-accent",
        whenPressed,
        "aria-pressed:hover:bg-accent",
        "disabled:cursor-not-allowed disabled:text-muted-foreground",
      )}
    >
      {children}
      <span className="tabular-nums not-group-aria-pressed/option:text-muted-foreground">{count}</span>
    </button>
  );
}
