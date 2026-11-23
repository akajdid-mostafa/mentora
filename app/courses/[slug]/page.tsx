import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courseHref, courses, courseSlug } from "@/components/course/courses";
import { outlineOf, relatedTo } from "@/components/course/detail";
import { courseClosing, courseFaqCopy, courseFaqs } from "@/components/course-page/copy";
import { CourseOverview } from "@/components/course-page/course-overview";
import { RelatedRail } from "@/components/course-page/related-rail";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

// Every course is built ahead, so an address that names none is a 404 from the
// same prerendered page as any other unknown address, not one rendered on
// request with nothing in its body until the script arrives, and written to
// the server's disk as a cache entry for every made-up slug a bot tries.
//
// Next 16.3 logs "Error: Internal: NoFallbackError" for each such request.
// The response is still the 404; the line is the framework's, not a fault.
export const dynamicParams = false;

export function generateStaticParams() {
  return courses.map((c) => ({ slug: courseSlug(c) }));
}

const find = (slug: string) => courses.find((c) => courseSlug(c) === slug);

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const c = find((await params).slug) ?? notFound();
  return pageMeta({
    title: c.title,
    description: `${c.outcome} ${c.weeks} weeks at ${c.hours} hours a week, taught by ${c.instructor}.`,
    path: courseHref(c),
    image: c.image,
  });
}

export default async function Page({ params }: PageProps<"/courses/[slug]">) {
  const c = find((await params).slug) ?? notFound();
  const outline = outlineOf(c);
  // The date the start rows open on. The visitor's own calendar takes over
  // in the browser; this is what the page is sent with.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <CourseOverview course={c} outline={outline} today={today} />
        <RelatedRail courses={relatedTo(c)} />
        <FaqStepRows items={courseFaqs(c)} copy={courseFaqCopy} />
        <ClosingPhotoHalf copy={courseClosing(c, outline)} />
      </main>
      <SiteFooter />
    </>
  );
}
