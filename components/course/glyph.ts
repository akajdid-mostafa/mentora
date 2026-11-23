// One glyph per subject: the same mark on a filter pill, in the chip on every
// card of that subject and at the head of a course's own page, so the pill a
// reader pressed shows again on what it let through. A plain module rather
// than part of the card, so a server component can read the map as well as
// render the card.

import {
  BanknotesIcon,
  ChartBarIcon,
  CommandLineIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";
import type { Topic } from "@/components/course/courses";

export const glyph: Record<Topic, typeof ChartBarIcon> = {
  Data: ChartBarIcon,
  Engineering: CommandLineIcon,
  Design: PaintBrushIcon,
  Business: BanknotesIcon,
};
