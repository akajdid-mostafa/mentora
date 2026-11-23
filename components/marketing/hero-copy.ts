// Row 1's words, kept apart from its layout so the copy is edited in one place
// rather than hunted for through the JSX.
//
// Every figure is Mentora's own, written for the demo — the same rule the
// proof row follows, and the same numbers where the two overlap.

import type { GlyphName } from "@/components/marketing/glyphs";

export const headline = "A tutor that has the lesson open";

export const lede =
  "Ask a question at 4:12 and the answer cites 4:12. It reads the transcript of the lesson on your screen, never the open web.";

/** The three doors the ruled row of columns opens below the fold line: both
 *  sides of the platform, the AI named on each, and the drawing each opens on.
 *  Each body is kept to 55–65 characters, which runs to two lines at every
 *  width a column gives it, from 239px at 1024 to the 20rem it is held to. */
export const doors: { title: string; body: string; href: string; glyph: GlyphName }[] = [
  {
    title: "Ask the lesson",
    body: "Stuck at 11:38? The tutor reads the minute and asks a question.",
    href: "/learn/sql-for-analysis",
    glyph: "ask",
  },
  {
    title: "Start from a goal",
    body: "Type the job you want and get five stages, each with its hours.",
    href: "/paths/data-analyst",
    glyph: "goal",
  },
  {
    title: "Teach what you know",
    body: "Paste a transcript and get six chapters and a quiz to edit.",
    href: "/teach",
    glyph: "teach",
  },
];
