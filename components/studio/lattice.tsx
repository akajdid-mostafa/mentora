import { cn } from "@/lib/utils";

// A draft's lessons as a lattice: one column a chapter, one cell a lesson,
// stacked from the foot, on the ink it is always drawn on. Three states, and
// every place that says how much of a draft is in its author's words draws
// them the same way: the payout hero on /teach, the studio's row of drafts and
// the legend over its board.
//
// In the instructor's words a cell is white, shaded at its foot towards the
// studio's iris; while it still reads as the studio wrote it, a dashed outline
// in that iris over a wash of it; where a chapter has no lesson in that row,
// the ink raised a shade.
export const YOURS =
  "bg-linear-to-b from-background to-[color-mix(in_oklab,var(--background),var(--iris)_14%)]";
export const DRAFTED =
  "border-[1.5px] border-dashed border-[color-mix(in_oklab,var(--iris),white_20%)] bg-[color-mix(in_oklab,var(--iris)_14%,transparent)]";
export const EMPTY = "bg-background/[0.07]";

/** One chapter as the lattice reads it: how many lessons it holds, and how
 *  many of those are in the instructor's words. */
export type LatticeColumn = { lessons: number; yours: number };

/** The lattice itself, drawn for the eye: the caller says in words what it
 *  shows, since a grid of pills reads out as nothing. `rows` holds every
 *  column to one height, so a short chapter shows its empty slots; `cell` is
 *  the height of a pill and `drafted` the outline a small one can carry. */
export function Lattice({
  columns,
  rows,
  cell,
  gap = "gap-1.5",
  drafted = DRAFTED,
  className,
}: {
  columns: LatticeColumn[];
  rows?: number;
  cell: string;
  gap?: string;
  drafted?: string;
  className?: string;
}) {
  const height = rows ?? Math.max(...columns.map((c) => c.lessons));
  return (
    <div
      aria-hidden="true"
      className={cn("grid", gap, className)}
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
    >
      {columns.map((c, i) => (
        <div key={i} className={cn("flex flex-col-reverse", gap)}>
          {Array.from({ length: height }, (_, j) => (
            <span
              key={j}
              className={cn("rounded-full", cell, j < c.yours ? YOURS : j < c.lessons ? drafted : EMPTY)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
