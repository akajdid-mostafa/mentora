import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { instructor } from "@/components/studio/instructor";
import { studioMeta } from "@/components/studio/copy";
import { OutlineBoard } from "@/components/studio/outline-board";
import { QuizDeck } from "@/components/studio/quiz-deck";
import { RevenueBento } from "@/components/studio/revenue-bento";
import { StudioWindow } from "@/components/studio/studio-window";
import { studioCourseOf, takeOf } from "@/components/studio/take";
import { TakeSplitter } from "@/components/studio/take-splitter";
import { pageMeta } from "@/lib/seo";

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: studioMeta.title,
  description: studioMeta.description,
  path: "/studio",
  // An instructor's own screen, with one made-up instructor's drafts and
  // payouts on it: nothing here is worth a search result. sitemap.ts leaves
  // the route out, while robots.ts leaves it crawlable so the noindex is
  // read.
  robots: { index: false, follow: true },
});

export default function Page() {
  // The server's today, which the page renders and hydrates with; each
  // section then moves to the visitor's own.
  const today = new Date().toISOString().slice(0, 10);
  // Module 4 of SQL for analysis as one take: only its transcript and its
  // quiz leave the server, never the course's whole lesson pack.
  const take = takeOf();
  // What the window reports on the course: its module quizzes as learners
  // take them, and the question most of them miss.
  const course = studioCourseOf();

  return (
    <>
      <SiteHeader account={{ name: instructor.name, href: instructor.href, portrait: instructor.portrait }} />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <StudioWindow today={today} course={course} review={{ label: take.label, length: take.length }} />
        <OutlineBoard />
        <TakeSplitter take={take} />
        <QuizDeck pool={take.quiz} />
        <RevenueBento today={today} />
      </main>
      <SiteFooter />
    </>
  );
}
