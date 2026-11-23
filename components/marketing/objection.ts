// The three policy lines under the objection's plot: what the tutor holds to,
// the sentence that says why, and the drawing each column opens on.

import type { GlyphName } from "@/components/marketing/glyphs";

export type Policy = {
  /** The sitemap's policy line, one per column. */
  policy: string;
  /** Kept to 50–60 characters, which runs to two lines at every width the
   *  columns take, from 240px wide to 340. Longer, and one column grows a
   *  third line its neighbours do not have. */
  body: string;
  /** The drawing its column opens on, from the set the hero's doors use. */
  glyph: GlyphName;
};

export const policies: Policy[] = [
  {
    policy: "No answers, only the next question",
    body: "Copy a finished answer and you learn the fix, not the reason.",
    glyph: "question",
  },
  {
    policy: "Cites the lesson, never the web",
    body: "Each reply links the minute it came from, so you can disagree.",
    glyph: "cite",
  },
  {
    policy: "Your instructor sets what it may reveal",
    body: "They decide, per course, how much the tutor may hand over.",
    glyph: "reveal",
  },
];
