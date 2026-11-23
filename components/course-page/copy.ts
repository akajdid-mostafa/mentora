// The words around a course: the questions people ask before they enrol and
// the band that closes the page. Both are the home page's components holding
// this page's words, and the answers are worked out from the course they sit
// under, so each one is true of the course a reader is looking at.

import {
  courseSlug,
  lessonHref,
  priceLabel,
  type Course,
} from "@/components/course/courses";
import type { Outline } from "@/components/course/detail";
import type { ClosingCopy } from "@/components/marketing/closing";
import type { Faq } from "@/components/marketing/faqs";
import { tiers } from "@/components/marketing/tiers";
import { cohorts, SEATS } from "@/components/course-page/start";

export const courseFaqCopy = {
  eyebrow: "Enrolling",
  heading: "What people ask before they enroll",
  foot: "A person answers anything this list does not.",
  footLink: "Ask us",
};

export function courseFaqs(c: Course): Faq[] {
  const first = c.instructor.split(" ")[0];
  // Two hours under the planned pace, or one hour a week where the plan is
  // three or fewer, so the slower pace is always slower.
  const slower = c.hours > 3 ? c.hours - 2 : 1;
  const slowWeeks = Math.ceil((c.weeks * c.hours) / slower);
  const plus = tiers[1];
  // What the course costs in months of Plus, said the way a person would.
  const months = c.price / plus.monthly;
  const worth =
    months < 0.95
      ? "less than a month of it"
      : months < 1.5
        ? "about a month of it"
        : `about ${Math.round(months)} months of it`;

  // The answers hold no school, skill or credential name: those run from
  // three letters to twenty-four, and each answer is fitted so its last line
  // carries two thirds of the column, which a name that long would undo on
  // half the courses. What varies is a digit or a first name.
  const before: Faq = {
    group: "Before",
    q: "Do I need to know anything before I start?",
    a:
      c.level === "Beginner"
        ? `No. The first module starts from nothing, and the tutor in each lesson answers the questions a first-timer asks, however basic they feel. What you need is ${c.hours} hours a week and a browser.`
        : c.level === "Intermediate"
          ? "Enough of the basics to follow along without stopping to look things up. Lesson one is free, so open that first: if its practice set feels routine to you, you are ready for the rest of the course."
          : "That you already do this work day to day. The course spends no time on the basics, and its first module starts where most introductions to the subject leave off, at the part that is hard to learn alone.",
  };

  const pace: Faq = {
    group: "Time",
    q: `What if I cannot give it ${c.hours} hours a week?`,
    a: `Nothing expires. ${c.weeks} weeks at ${c.hours} hours a week is the pace the course was planned at, and at ${slower === 1 ? "an hour a week" : `${slower} hours`} it takes ${slowWeeks} weeks. The panel above works out a finish date for whatever pace you give it.`,
  };

  const company: Faq = cohorts(c)
    ? {
        group: "Time",
        q: "What does a cohort add?",
        a: `A start date, a finish date and a live review of the week's work every Thursday, with the same ${SEATS} people from the first week to the last. The lessons and the tutor are the ones the self-paced track gets.`,
      }
    : {
        group: "Time",
        q: "Can I take it with other people?",
        a: `This one is self-paced only: at ${c.weeks} weeks it would be over before a cohort found its rhythm. The discussion under each lesson is where the other learners are, and the instructor reads it.`,
      };

  const after: Faq = {
    group: "After",
    q: "What do I get when I finish?",
    a:
      c.credential === "Guided Project"
        ? "The project itself, reviewed, and a line on your record that links to it. A guided project carries no certificate, because the finished work, with the review attached, is the thing you show an employer."
        : c.credential === "Professional Certificate"
          ? "A Professional Certificate, with a link an employer can open to check it and your reviewed project attached. It is the one credential on the site that hiring managers ask for by name, in the job ad itself."
          : "A certificate from the school that made the course, and the project the instructor's team reviewed. Each comes with a link that anyone, an employer included, can open and check in a few seconds.",
  };

  const money: Faq = c.price
    ? {
        group: "Money",
        q: "Can I get my money back?",
        a: "Yes, within 30 days of enrolling, from your account page and with no form to fill in or reason to give. Lesson one is free with the tutor, so most people know the course suits them before they pay.",
      }
    : {
        group: "Money",
        q: "Is it free for good?",
        a: "Yes. The course, the tutor and the project review cost nothing now and nothing later, and nobody asks you for a card at any point.",
      };

  const last: Faq =
    c.language !== "English"
      ? {
          group: "Language",
          q: `Is it taught in ${c.language}?`,
          a: `Yes. ${first} recorded every lesson in ${c.language}, and the tutor answers in it too. There are transcripts in ${c.subtitles} languages as well.`,
        }
      : c.price
        ? {
            group: "Money",
            q: `Is it cheaper on ${plus.name}?`,
            a: `${plus.name} is $${plus.monthly} a month and opens this course along with every other. At ${priceLabel(c.price)} this one costs ${worth}, so buy it on its own if it is the only course you mean to take this year.`,
          }
        : {
            group: "Money",
            q: `Do I need ${plus.name} for it?`,
            a: `No. A free course is free on every plan, tutor and project review included, and ${plus.name} adds nothing to it.`,
          };

  return [before, pace, company, after, money, last];
}

export function courseClosing(c: Course, outline: Outline): ClosingCopy {
  const rest = outline.lessons - 1;
  return {
    heading: "Watch lesson one tonight. Decide in the morning.",
    lede: c.price
      ? `It opens with the tutor beside it and the practice set under it, and asks for no card. The other ${rest} lessons are ${priceLabel(c.price)} once, or part of Plus.`
      : `It opens with the tutor beside it and the practice set under it. The other ${rest} lessons cost nothing either, and nobody asks for a card.`,
    learn: { label: c.price ? "Start lesson one free" : "Start lesson one", href: lessonHref(c) },
    teach: {
      label: c.price ? `Enroll for ${priceLabel(c.price)}` : "Enroll for free",
      href: `/checkout?course=${courseSlug(c)}`,
    },
    risk: c.price ? "Your money back within 30 days." : "No card, now or later.",
  };
}
