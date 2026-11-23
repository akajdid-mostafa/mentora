// The words around a path: the questions people ask before they start one and
// the band that closes the page. Both are the home page's components holding
// this page's words, and the one answer with figures in it is worked out from
// the path it sits under, at the pace the planner opens at.

import { courses, lessonHref } from "@/components/course/courses";
import type { ClosingCopy } from "@/components/marketing/closing";
import type { Faq } from "@/components/marketing/faqs";
import { pathSlug, totalHours, type Goal } from "@/components/marketing/goals";
import { tiers } from "@/components/marketing/tiers";
import { coursesOf } from "@/components/paths/paths";

export const pathFaqCopy = {
  // as the home page's list is marked; "Paths" under "More paths" said
  // nothing the section before it had not
  eyebrow: "Questions",
  heading: "What people ask before they start a path",
  foot: "A person answers anything this list does not.",
  footLink: "Ask us",
};

/** The pace the planner opens at, which the answer on money quotes. */
const OPENING_PACE = 9;

export function pathFaqs(g: Goal): Faq[] {
  const plus = tiers[1];
  const total = totalHours(g);
  const price = coursesOf(g).reduce((n, c) => n + c.price, 0);
  const weeksAt = (pace: number) => Math.ceil(total / pace);
  const monthsAt = (pace: number) => Math.max(1, Math.ceil((weeksAt(pace) * 7) / 30.44));
  const weeks = weeksAt(OPENING_PACE);
  const months = monthsAt(OPENING_PACE);
  // the slowest pace at which Plus still costs less than the five courses
  let floor = 2;
  while (floor < 20 && monthsAt(floor) * plus.monthly >= price) floor += 1;

  // Six questions the page itself does not answer: what "I know this", the
  // certificate and the hours slider do is printed above them already.
  return [
    {
      group: "Order",
      q: "Do I have to take the courses in this order?",
      a: "No. The order is the tutor's advice: every course opens on its own, and each card says which courses it builds on. Take them in any order you like and the finish date is worked out the same way.",
    },
    {
      group: "Catalog",
      q: "Can I take a course that is not on the path?",
      a: "Yes. Any course in the catalog opens on its own and sits on your dashboard beside the path. The finish date counts only the five on it.",
    },
    {
      group: "Money",
      q: `Is the path cheaper on ${plus.name}?`,
      // Worked from lesson one, which the words say: the planner above
      // works from where this learner stands, and the two would otherwise
      // quote different weeks at the same pace.
      a: `From lesson one at ${OPENING_PACE} hours a week, it runs ${weeks} weeks, or ${months} months of ${plus.name} at $${months * plus.monthly}. Bought one by one, the five courses cost $${price} and stay yours. Below ${floor} hours a week, buying them is cheaper.`,
    },
    {
      group: "Plus",
      q: `What if I cancel ${plus.name} halfway?`,
      a: "The courses you bought stay yours. The ones you took on Plus close until you start it again, and your progress waits where you left it.",
    },
    {
      group: "Courses",
      q: "What if a course changes after I start it?",
      a: "Its teacher can update its lessons, and you keep your place in the ones you finished. If a course leaves the catalog, the tutor puts the closest one in its place and the path keeps its order.",
    },
    {
      group: "AI",
      q: "How does the tutor draft a path?",
      a: "It matches your goal to the courses in the catalog, then orders them by what each builds on. The instructors who teach them check that order, and the note on every card, before a learner sees it.",
    },
  ];
}

export function pathClosing(g: Goal): ClosingCopy {
  const first = courses.find((c) => c.id === g.legs[0].course);
  return {
    heading: "Pick the hours. Keep the date.",
    // No course title in it: the five paths open on titles from 16 characters
    // to 26, and no one sentence ends its last line well around all of them.
    lede: `Lesson one of all five courses is free, with the tutor beside it. Plus opens everything else for $${tiers[1].monthly} a month and stops when you do.`,
    learn: { label: "Start lesson one", href: first ? lessonHref(first) : "/courses" },
    // named as the planner's trial button, which opens the same checkout
    teach: { label: tiers[1].cta, href: `/checkout?plan=plus&path=${pathSlug(g)}` },
    risk: "No card for lesson one. Plus cancels in one click.",
  };
}
