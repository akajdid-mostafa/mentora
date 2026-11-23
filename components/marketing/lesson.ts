// Row 3's lesson: the three questions a learner four minutes in would ask, the
// minute each one is answered from, and the lesson's own length. The component
// beside this file is a layout — every string a reader sees is here.

import {
  Layers01Icon,
  SidebarRightIcon,
  TranslateIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { instructors } from "@/components/marketing/instructors-data";

export type Answer = { at: string; seconds: number; body: string };
export type Question = { q: string; a: Answer };

// The lesson belongs to a course on row 7, so the player credits the person
// who actually teaches it. Looked up by the course title rather than by index:
// the two rows can be reordered without this one quietly crediting somebody
// else for her lesson.
export const COURSE = "SQL for analysis";
export const TEACHER =
  instructors.find((i) => i.teaches.includes(COURSE)) ?? instructors[0];

export const LESSON = "Joins, nulls and the shape of a result set";
export const TOTAL = 1620;

// Three questions a learner four minutes into a lesson on joins would actually
// ask, each answered from a minute of that lesson's transcript rather than from
// anywhere else.
export const questions: Question[] = [
  {
    q: "Why did the left join keep the null rows?",
    a: {
      at: "04:12",
      seconds: 252,
      body: "A left join keeps every row on the left and fills in nulls where nothing matched. At 04:12 the lesson runs it as an inner join, and three unmatched rows drop out.",
    },
  },
  {
    q: "When would I reach for a CTE instead?",
    a: {
      at: "11:38",
      seconds: 698,
      body: "When the same subquery appears twice. At 11:38 the lesson rewrites the nested version as a WITH clause and the query goes from nineteen lines to eleven.",
    },
  },
  {
    q: "Is GROUP BY running before or after WHERE?",
    a: {
      at: "18:05",
      seconds: 1085,
      body: "After. WHERE filters rows on the way in and HAVING filters groups on the way out. The lesson steps through both at 18:05 with the same dataset.",
    },
  },
];

// Scope, not policy. The three policy lines belong to the next section, which
// demonstrates them with a toggle rather than asserting them in a column —
// saying both is saying it twice, and the weaker one wins the reader's
// attention because it comes first. Each line leads with the glyph for what it
// scopes: the plans, the languages, the panel beside the video.
export const foot: { label: string; body: string; icon: IconSvgElement }[] = [
  {
    label: "On every plan",
    body: "Buy a single course on its own and the tutor comes with it.",
    icon: Layers01Icon,
  },
  {
    label: "In 41 languages",
    body: "It answers in the language the lesson is taught in.",
    icon: TranslateIcon,
  },
  {
    label: "Beside the lesson",
    body: "A panel inside the player, so the video keeps its place on screen while you ask.",
    icon: SidebarRightIcon,
  },
];

// Two digits on both sides, so the player's clock reads the way every cited
// minute above it is written: 04:12, not 4:12.
const pad = (n: number) => String(n).padStart(2, "0");
export const mmss = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
