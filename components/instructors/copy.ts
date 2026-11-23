// The words on the instructor directory: the band over it, the badge record
// beside the search, the questions people ask about the people teaching, and
// the band that closes the page. The FAQ rows and the closing band are the
// home page's own components holding this page's words.

import type { ClosingCopy } from "@/components/marketing/closing";
import type { Faq } from "@/components/marketing/faqs";

// The lede, the FAQ answers and the closing lede are fitted to the last-line
// rule at 1280: each ends on a line at least two thirds of its longest. A
// rewrite is measured again, not eyeballed.
export const directoryCopy = {
  eyebrow: "Instructors",
  heading: ["Know who teaches you", "before you pay"] as const,
  lede: "Every instructor passed four checks before their first course opened. We confirmed who they are and the job they hold, two peers reviewed their work, and twenty learners rated a sample lesson.",
  // Short enough to show whole in a 320px field; trades and fields are
  // searched too.
  search: "Name or skill",
  // Skills rather than fields, because the fields are already the tabs under
  // the band. Each finds at least one teacher, and between them they reach
  // all four fields.
  popular: ["Python", "SQL", "Typography", "Pricing"],
  // The hand beside the record, naming it the way somebody pointing would.
  note: ["the four checks", "behind each badge"] as const,
  record: "Latest badges",
};

export const faqCopy = {
  eyebrow: "Vetting",
  heading: "What people ask before they pick a teacher",
  foot: "A person answers anything this list does not.",
  footLink: "Ask us",
};

export const faqs: Faq[] = [
  {
    group: "The badge",
    q: "What does the badge check?",
    a: "Four, in order: we match an identity document on a video call, confirm the job with the employer or with company filings, have two people in the field review one piece of real work, and have twenty learners rate a ten-minute lesson. About one applicant in five passes.",
  },
  {
    group: "The badge",
    q: "How is an instructor's rating worked out?",
    a: "From the rating of each of their courses, weighted by how many learners left one. A course with 4,000 reviews moves it further than one with 400, so a new course cannot lift a teacher on its own.",
  },
  {
    group: "The badge",
    q: "What happens when a rating drops?",
    a: "A course that stays under 4.2 for two terms stops taking new learners until its instructor revises it. Everyone already enrolled keeps access, and the instructor keeps the badge while the revision is open.",
  },
  {
    group: "Learning",
    q: "Who grades my project, the instructor or the tutor?",
    a: "The instructor's team, and every review carries the reviewer's name. The tutor answers your questions from the lesson you have open, and it never grades work that counts toward a certificate.",
  },
  {
    group: "Learning",
    q: "What does following an instructor do?",
    a: "Their next cohort goes to the top of your dashboard with a seat to reserve, and you get one email when a new course opens. Follow from any card, and the Following filter on this page shows only them.",
  },
  {
    group: "Teaching",
    q: "I do the job. Can I teach it here?",
    a: "Apply with your current role and one piece of your work. The four checks take about eleven days, the studio drafts a syllabus while they run, and you keep 70% of each single-course sale.",
  },
];

export const closingCopy: ClosingCopy = {
  heading: "Meet the teacher in lesson one",
  lede: "Watch how they explain a hard idea, ask the tutor what you missed, and enroll if it clicked.",
  learn: { label: "Browse courses", href: "/courses" },
  teach: { label: "Teach on Mentora", href: "/teach" },
  risk: "Free first lesson on every course. No card.",
};

// The last card in the grid, where the next teacher would stand.
export const doorCopy = {
  title: "Your trade, on this card",
  text: "Apply with your role and one piece of your own work.",
  button: "Teach on Mentora",
  href: "/teach",
};
