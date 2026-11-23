import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, courseSlug, playerHref, teacherOf } from "@/components/course/courses";
import { outlineOf } from "@/components/course/detail";
import { packOf } from "@/components/course/lessons";
import { projects } from "@/components/course/lessons/projects";
import { LessonWorkspace } from "@/components/learn/lesson-workspace";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

// The player renders per request: it reads `?lesson=`
// on the server, as a learner's own screen on a real platform reads their
// session, so a link that names a lesson opens on it however it is followed.
export const dynamic = "force-dynamic";

const find = (slug: string) => courses.find((c) => courseSlug(c) === slug);

export async function generateMetadata({
  params,
}: PageProps<"/learn/[slug]">): Promise<Metadata> {
  const c = find((await params).slug) ?? notFound();
  return pageMeta({
    title: `Lesson player: ${c.title}`,
    description: c.price
      ? `Lesson one of ${c.title} is free: the video, its transcript, a practice set and a tutor that answers from the lesson.`
      : `${c.title} is a free course. Lesson one is open now: the video, its transcript, a practice set and a tutor that answers from the lesson.`,
    path: playerHref(c),
    image: c.image,
    // A learner's own screen, with their progress and their notes on it:
    // nothing here is worth a search result, and the course page is.
    // sitemap.ts leaves the route out, while robots.ts leaves it crawlable so
    // the noindex is read.
    robots: { index: false, follow: true },
  });
}

export default async function Page({ params, searchParams }: PageProps<"/learn/[slug]">) {
  const c = find((await params).slug) ?? notFound();
  const { lesson } = await searchParams;
  const t = teacherOf(c);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <LessonWorkspace
          course={c}
          outline={outlineOf(c)}
          pack={packOf(c.id)}
          brief={projects[c.id]}
          teacher={{ name: t.name, trade: t.trade }}
          linked={typeof lesson === "string" ? lesson : undefined}
        />
      </main>
      <SiteFooter />
    </>
  );
}
