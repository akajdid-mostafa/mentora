import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { outlineOf } from "@/components/course/detail";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { goals, pathHref, pathSlug, totalHours } from "@/components/marketing/goals";
import { pathClosing, pathFaqCopy, pathFaqs } from "@/components/paths/copy";
import { OtherPaths } from "@/components/paths/other-paths";
import { PathOverview } from "@/components/paths/path-overview";
import { coursesOf, findPath, photoOf } from "@/components/paths/paths";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

// Every path is built ahead; see app/courses/[slug]/page.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return goals.map((g) => ({ slug: pathSlug(g) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/paths/[slug]">): Promise<Metadata> {
  const g = findPath((await params).slug) ?? notFound();
  return pageMeta({
    title: `${g.short} path`,
    description: `${g.label}: five courses in the order each builds on the last, ${totalHours(g)} hours in all, with a finish date set by the hours you have a week.`,
    path: pathHref(g),
    image: photoOf(g),
  });
}

export default async function Page({ params }: PageProps<"/paths/[slug]">) {
  const g = findPath((await params).slug) ?? notFound();
  // How many syllabus items each leg's course has, so a learner's record of
  // finished items reads as a share of the course: for this path and for the
  // three whose cards count their weeks under "More paths". Counted here,
  // where the syllabi are, so they never travel to the browser.
  const items = Object.fromEntries(
    goals.map((x) => [
      x.id,
      coursesOf(x).map((c) => outlineOf(c).modules.reduce((n, m) => n + m.lessons.length, 0)),
    ]),
  );
  // Where each leg's project sits in its syllabus, the last item of the last
  // module: a leg marked as known counts once its project is reviewed, and
  // its card and the planner open it.
  const projects = coursesOf(g).map((c) => {
    const last = outlineOf(c).modules.at(-1)!.lessons;
    return last[last.length - 1].id;
  });
  // The date the plan is worked from. The visitor's own calendar takes over
  // in the browser; this is what the page is sent with.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <PathOverview goal={g} items={items[g.id]} projects={projects} today={today} />
        <OtherPaths id={g.id} items={items} today={today} />
        <FaqStepRows items={pathFaqs(g)} copy={pathFaqCopy} />
        <ClosingPhotoHalf copy={pathClosing(g)} />
      </main>
      <SiteFooter />
    </>
  );
}
