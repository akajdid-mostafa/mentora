import type { Metadata } from "next";
import { courses } from "@/components/course/courses";
import { outlineOf } from "@/components/course/detail";
import { packOf } from "@/components/course/lessons";
import { seed } from "@/components/course/progress-seed";
import { Certificates } from "@/components/dashboard/certificates";
import { ContinueLearning } from "@/components/dashboard/continue";
import { dashCopy } from "@/components/dashboard/copy";
import { PathRows } from "@/components/dashboard/path-rows";
import { SavedShelf } from "@/components/dashboard/saved-shelf";
import type { Lines, Shelf } from "@/components/dashboard/shelf";
import { SiteFooter } from "@/components/site/footer";
import { learner } from "@/components/dashboard/learner";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: dashCopy.meta.title,
  description: dashCopy.meta.description,
  path: "/dashboard",
  // A learner's own screen, with one made-up learner's record on it: nothing
  // here is worth a search result. sitemap.ts leaves the route out while
  // robots.ts leaves it crawlable so the noindex is read.
  robots: { index: false, follow: true },
});

// Every course's syllabus cut to what the dashboard reads: a course enrolled
// on in the checkout has to show here with its items, so it is every course
// rather than the demo learner's four.
const shelf: Shelf = Object.fromEntries(
  courses.map((c) => [
    c.id,
    outlineOf(c).modules.map((m) => ({
      title: m.title,
      items: m.lessons.map(({ id, kind, title, minutes, questions }) => ({
        id,
        kind,
        title,
        minutes,
        ...(questions ? { questions } : {}),
      })),
    })),
  ]),
);

// The transcript of each lesson the seed has open, so the first frame quotes
// the second the learner stopped at. The card loads any other lesson's lines
// when the learner has moved on from the seed.
const lines: Lines = Object.fromEntries(
  Object.entries(seed.last).flatMap(([course, lesson]) => {
    const transcript = packOf(course)?.lessons[lesson]?.transcript;
    return transcript ? [[`${course}:${lesson}`, transcript]] : [];
  }),
);

export default function Page() {
  // The server's today, which the page renders and hydrates with; each
  // section then moves to the visitor's own.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader account={{ name: learner.name, href: "/dashboard" }} />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <ContinueLearning shelf={shelf} lines={lines} today={today} />
        <PathRows shelf={shelf} today={today} />
        <Certificates shelf={shelf} today={today} />
        <SavedShelf />
      </main>
      <SiteFooter />
    </>
  );
}
