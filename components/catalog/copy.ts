// The words around the catalogue: the questions people ask while choosing,
// and the band that closes the page. The FAQ rows and the closing band are the
// home page's own components holding this page's words.

import type { ClosingCopy } from "@/components/marketing/closing";
import type { Faq } from "@/components/marketing/faqs";

export const catalogFaqCopy = {
  eyebrow: "Choosing",
  heading: "What people ask before they pick a course",
  foot: "A person answers anything this list does not.",
  footLink: "Ask us",
};

export const catalogFaqs: Faq[] = [
  {
    group: "Credentials",
    q: "Course, Specialization or Professional Certificate: which do I need?",
    a: "A Course covers one subject in two to eight weeks. A Specialization joins several Courses into one skill over eight to twelve weeks and ends on a project. A Professional Certificate is a school's whole sequence toward a job title, with every project reviewed by the instructor's team, and it is the credential hiring managers ask for.",
  },
  {
    group: "Credentials",
    q: "Do Guided Projects end with a certificate?",
    a: "They end with the finished project, reviewed, and a line on your record that links to it. Two or three weeks of work earns you something to show a hiring manager, so no certificate comes with it.",
  },
  {
    group: "Enrolling",
    q: "Can I try a course before I pay for it?",
    a: "Lesson one of every course is free, tutor included, so you can ask it three questions about the material before you decide. Your card goes in when you enroll, and not a lesson before that.",
  },
  {
    group: "Enrolling",
    q: "What does “hours a week” assume?",
    a: "The pace the instructor planned for: the lessons, the quizzes and the project, measured on the learners who finished on time. Take longer and nothing expires, because a course you buy stays yours.",
  },
  {
    group: "Enrolling",
    q: "Is a Spanish course translated, or taught in Spanish?",
    a: "Taught in it. The Language filter finds courses recorded in that language by a teacher who speaks it. Subtitles are a separate list on every course, and they run from 3 languages to 41.",
  },
  {
    group: "Money",
    q: "Is it cheaper to buy courses one by one or on Plus?",
    a: "Plus is $29 a month and opens every course and path in the catalog. Past three paid courses a year it costs less than buying one at a time, and the pricing page works the sum out for you.",
  },
];

// The searches the band offers under its field, and an empty result offers in
// its place: skills rather than subjects, because the subjects are already the
// tabs under the band. Each finds at least one course, and the dot beside it
// takes the hue of the subject most of those courses sit in, so the four land
// in the four subjects. Four, because at 1024 the column holds four on one
// line and a fifth stood alone on the next.
export const popularSearches = ["Python", "SQL", "User research", "Pricing"];

// The hand beside the deck, naming it the way somebody pointing would. The
// deck has no visible heading of its own, so this is the one line that says
// what the three cards are.
export const deckNote = ["the last three", "you opened"] as const;

export const catalogClosing: ClosingCopy = {
  heading: "Pick a job title. The tutor picks the five courses.",
  lede: "It draws them from this catalog in the order each one builds on the last, with a finish date set by the hours you can give a week.",
  learn: { label: "Plan a path", href: "/#paths" },
  teach: { label: "Teach on Mentora", href: "/teach" },
  risk: "Free first lesson on every course. No card.",
};
