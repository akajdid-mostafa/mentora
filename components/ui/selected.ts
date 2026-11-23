// The picked state, one look for every control that picks from a set: a tab,
// a segmented option, a topic pill, a filter chip. The picked one is white
// inside a 2px line in `--frame-ink`, which is the brand.
//
// The line is a ring, inset, never a border. A ring takes no room, so the
// picked control and its neighbours keep one box and nothing on the row moves
// when the pick does; and a control that rests on a hairline draws that
// hairline as a ring too (`ring-1 ring-inset ring-border`), so picking it
// changes one property instead of setting a border against a ring.
//
// Each control writes its own resting look and both hovers beside this, since
// those depend on what the row stands on: a picked pill on the page hovers
// down to `bg-accent`, a picked cell in a grey track lifts with `shadow-soft`,
// because going down there would sink it into the track.
export const selected = "bg-card text-foreground ring-2 ring-inset ring-(--frame-ink)";

// The same look read off the attribute a control already carries, so the
// picked state is the attribute's and a script that flips it moves the look
// with no class to rewrite. Written out because Tailwind cannot build a
// variant name from a string. A control keeps its resting look as plain
// classes and adds one of these; a hover that differs once picked is written
// `aria-pressed:hover:…`, since the attribute variant outranks a plain `hover:`.
export const whenPressed =
  "aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:ring-2 aria-pressed:ring-inset aria-pressed:ring-(--frame-ink)";
export const whenSelected =
  "aria-selected:bg-card aria-selected:text-foreground aria-selected:ring-2 aria-selected:ring-inset aria-selected:ring-(--frame-ink)";
