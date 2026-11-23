// The words the profile page writes itself rather than reads off the data:
// the closing band's. Every other string on the page comes from the teacher's
// row in profiles.ts, records.ts or the course data.

import { lessonHref, type Course } from "@/components/course/courses";
import type { ClosingCopy } from "@/components/marketing/closing";

/** The band that closes a profile: lesson one of the teacher's most taken
 *  course, and the door to teaching. The lede keeps to fixed words and the
 *  first name, fitted to the last-line rule at 1280 with all fifteen; the
 *  risk line under the buttons names the course the first one opens, and
 *  says "free" once for the band. */
export function profileClosing(first: string, top: Course): ClosingCopy {
  return {
    heading: `Watch ${first} teach one lesson tonight`,
    lede: `Hear how ${first} explains a hard idea, then decide whether the course is worth paying for.`,
    learn: { label: "Start lesson one", href: lessonHref(top) },
    teach: { label: "Teach on Mentora", href: "/teach" },
    risk: `Lesson one of ${top.title} is free. No card.`,
  };
}
