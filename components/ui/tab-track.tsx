import type { KeyboardEvent, ReactNode } from "react";
import { selected } from "@/components/ui/selected";
import { cn } from "@/lib/utils";

// The site's track of tabs: every option in one well, the picked one white
// inside the brand's line, the rest in the muted ink until the pointer lifts
// them. One look, and one set of keys, for every row that switches what stands
// under or beside it: the home page's example goals and its month / year
// toggle, the lesson page's two strips, the notes filter, the Rating bar in
// the catalog's filters. A row of pills on the page's own ground, the topic
// filters or the tutor card's questions, is a chip row rather than a track,
// and does not use this.
//
// The well is a rung below whatever the track stands on. On the page that is
// the page's tint. On a surface already at that tint, the lesson page's rail,
// the next rung down, or the well would not show. On a white card it is a
// white bar on a hairline, the call the studio made for the Filters dialog,
// and there the hovers go down a rung instead of lifting.

type Ground = "page" | "tint" | "card";

const WELL: Record<Ground, string> = {
  page: "bg-accent",
  tint: "bg-muted",
  card: "bg-card ring-1 ring-inset ring-border",
};

// The picked option lifts under the pointer in a grey well, since going down
// would sink it into the well; on a white bar it goes down, since white has
// nowhere to lift to.
const PICKED: Record<Ground, string> = {
  page: cn(selected, "hover:shadow-soft"),
  tint: cn(selected, "hover:shadow-soft"),
  card: cn(selected, "hover:bg-accent"),
};

const REST: Record<Ground, string> = {
  page: "text-muted-foreground hover:bg-card hover:text-foreground",
  tint: "text-muted-foreground hover:bg-card hover:text-foreground",
  card: "hover:bg-accent",
};

// The same two looks read off the attribute the option carries, aria-selected
// on a tab and aria-checked on a radio, so a script that flips it moves the
// look with the pick. The hover that differs once picked outranks the base
// hover, so it is written under the attribute too.
const READ_SELECTED: Record<Ground, string> = {
  page: "aria-selected:bg-card aria-selected:text-foreground aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-(--frame-ink) aria-selected:hover:shadow-soft",
  tint: "aria-selected:bg-card aria-selected:text-foreground aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-(--frame-ink) aria-selected:hover:shadow-soft",
  card: "aria-selected:bg-card aria-selected:text-foreground aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-(--frame-ink) aria-selected:hover:bg-accent",
};
const READ_CHECKED: Record<Ground, string> = {
  page: "aria-checked:bg-card aria-checked:text-foreground aria-checked:ring-2 aria-checked:ring-inset aria-checked:ring-(--frame-ink) aria-checked:hover:shadow-soft",
  tint: "aria-checked:bg-card aria-checked:text-foreground aria-checked:ring-2 aria-checked:ring-inset aria-checked:ring-(--frame-ink) aria-checked:hover:shadow-soft",
  card: "aria-checked:bg-card aria-checked:text-foreground aria-checked:ring-2 aria-checked:ring-inset aria-checked:ring-(--frame-ink) aria-checked:hover:bg-accent",
};

// The picked look from lg up and the resting one under it, written out: a
// breakpoint cannot be put in front of the constants above.
const PICKED_FROM_LG =
  "max-lg:text-muted-foreground max-lg:hover:bg-card max-lg:hover:text-foreground lg:bg-card lg:text-foreground lg:ring-2 lg:ring-inset lg:ring-(--frame-ink) lg:hover:shadow-soft";

export type TrackOption<T extends string = string> = {
  id: T;
  label: ReactNode;
  /** A glyph before the words, from sm up: on a phone the words alone fill
   *  a tab. A glyph that is part of the label, a rating's star, goes in the
   *  label instead. */
  icon?: ReactNode;
  /** A figure after the words, in the muted ink. */
  count?: number;
  disabled?: boolean;
  className?: string;
};

/** A row of options in one well. `kind` says what picking one does: tabs
 *  switch a panel (`controls` names it), radios set something the row
 *  applies itself. Either way the arrow keys move along the options drawn at
 *  the width and pick as they go, and only the picked one is in the tab
 *  order. */
export function TabTrack<T extends string>({
  options,
  value,
  onChange,
  idPrefix,
  kind = "tabs",
  label,
  labelledBy,
  controls,
  on = "page",
  auto,
  className,
}: {
  options: TrackOption<T>[];
  /** The picked option, as a screen reader hears it. */
  value: T;
  onChange: (id: T) => void;
  /** Each option's element id is `${idPrefix}-${id}`. */
  idPrefix: string;
  kind?: "tabs" | "radios";
  label?: string;
  labelledBy?: string;
  controls?: string;
  /** What the track stands on. */
  on?: Ground;
  /** Nothing picked yet, on a row whose first pick depends on the width:
   *  the option drawn picked under lg, and the one from lg. The breakpoint
   *  draws it, so the server's markup is right at both widths, and `value`
   *  keeps what a screen reader hears in step once the width is known. */
  auto?: { narrow: T; wide?: T };
  className?: string;
}) {
  const tabs = kind === "tabs";

  const move = (e: KeyboardEvent, by: number) => {
    e.preventDefault();
    const drawn = options.filter(
      (o) => !o.disabled && document.getElementById(`${idPrefix}-${o.id}`)?.offsetParent,
    );
    const i = drawn.findIndex((o) => o.id === value);
    const to = drawn[(i + by + drawn.length) % drawn.length];
    if (!to) return;
    onChange(to.id);
    document.getElementById(`${idPrefix}-${to.id}`)?.focus();
  };

  return (
    <div
      role={tabs ? "tablist" : "radiogroup"}
      aria-label={label}
      aria-labelledby={labelledBy}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || (!tabs && e.key === "ArrowDown")) move(e, 1);
        if (e.key === "ArrowLeft" || (!tabs && e.key === "ArrowUp")) move(e, -1);
      }}
      className={cn("flex w-fit gap-1 rounded-control p-1", WELL[on], className)}
    >
      {options.map((o) => {
        const picked = o.id === value;
        // Before a pick the width decides which option is drawn picked, so
        // that look is chosen by the prop; once picked, the attribute does.
        const look = auto
          ? o.id === auto.narrow
            ? PICKED[on]
            : o.id === auto.wide
              ? PICKED_FROM_LG
              : REST[on]
          : cn(REST[on], tabs ? READ_SELECTED[on] : READ_CHECKED[on]);
        return (
          <button
            key={o.id}
            id={`${idPrefix}-${o.id}`}
            type="button"
            role={tabs ? "tab" : "radio"}
            aria-selected={tabs ? picked : undefined}
            aria-checked={tabs ? undefined : picked}
            aria-controls={tabs ? controls : undefined}
            tabIndex={picked ? 0 : -1}
            disabled={o.disabled}
            onClick={(e) => {
              onChange(o.id);
              // a track that scrolls brings the picked option fully into view,
              // as the arrow keys do by focusing it
              e.currentTarget.scrollIntoView({
                block: "nearest",
                inline: "nearest",
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
              });
            }}
            className={cn(
              "flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius-control)-4px)] px-3 text-sm press sm:px-4",
              look,
              // a locked option holds still under the pointer: a lift would
              // promise the click the lock refuses
              "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
              o.className,
            )}
          >
            {o.icon && (
              <span aria-hidden="true" className="hidden shrink-0 sm:block">
                {o.icon}
              </span>
            )}
            {o.label}
            {o.count !== undefined && (
              <span className="tabular-nums text-muted-foreground">{o.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
