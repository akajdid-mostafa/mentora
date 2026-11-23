import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { teacherHref } from "@/components/course/courses";
import { instructorOf } from "@/components/course/detail";
import { AboutRecord } from "@/components/instructor-page/about-record";
import { CohortRoster } from "@/components/instructor-page/cohort-roster";
import { profileClosing } from "@/components/instructor-page/copy";
import { CoursesTaught } from "@/components/instructor-page/courses-taught";
import { entryBySlug, reviewsFor } from "@/components/instructor-page/model";
import { MoreInstructors } from "@/components/instructor-page/more-instructors";
import { ProfileHero } from "@/components/instructor-page/profile-hero";
import { ReviewsPanel } from "@/components/instructor-page/reviews-panel";
import { roster } from "@/components/instructors/directory";
import { profiles } from "@/components/instructors/profiles";
import { records } from "@/components/instructors/records";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { portrait } from "@/components/marketing/quotes";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";
import { slugify } from "@/lib/utils";

// "Data lead" reads "data lead" after a comma; "CFO" and "ML engineer" keep
// their capitals, so only a word that is not an acronym is lowered.
const roleInSentence = (role: string) =>
  /^[A-Z][a-z]/.test(role) ? role[0].toLowerCase() + role.slice(1) : role;

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

// The bio's opening sentences, as many as fit a search result's 160
// characters, and at least the first: one short opener alone ran to 66.
const lede = (bio: string) => {
  const sentences = bio.split(/(?<=\.)\s+/);
  let out = sentences[0];
  for (const next of sentences.slice(1)) {
    if (out.length >= 110 || out.length + 1 + next.length > 160) break;
    out += " " + next;
  }
  return out;
};

// Every instructor is built ahead; see app/courses/[slug]/page.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return roster.map((e) => ({ slug: slugify(e.name) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/instructors/[slug]">): Promise<Metadata> {
  const e = entryBySlug((await params).slug) ?? notFound();
  const p = profiles[e.name];
  return pageMeta({
    title: `${e.name}, ${roleInSentence(e.trade.split(" · ")[0])}`,
    description: lede(p.bio),
    path: teacherHref(e.name),
    // the portrait the profile opens on, as the card a shared link draws
    image: e.portrait ? portrait(e.portrait, 1200) : undefined,
  });
}

export default async function Page({ params }: PageProps<"/instructors/[slug]">) {
  const e = entryBySlug((await params).slug) ?? notFound();
  const p = profiles[e.name];
  const reviews = reviewsFor(e);
  // The date the cohorts are counted from. The visitor's own calendar takes
  // over in the browser; this is what the page is sent with.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <ProfileHero
          entry={e}
          profile={p}
          verified={records[e.name].on}
          faces={reviews.flatMap((r) => (r.face ? [r.face] : [])).slice(0, 3)}
          today={today}
        />
        <AboutRecord
          entry={e}
          profile={p}
          years={instructorOf(e.courses[0]).credentials?.years ?? ""}
          record={records[e.name]}
        />
        <CoursesTaught first={e.name.split(" ")[0]} courses={e.courses} />
        <CohortRoster name={e.name} courses={e.courses} today={today} />
        <ReviewsPanel
          name={e.name}
          rating={e.rating}
          total={e.reviews}
          courses={e.courses}
          reviews={reviews}
        />
        <MoreInstructors name={e.name} field={e.field} />
        <ClosingPhotoHalf copy={profileClosing(e.name.split(" ")[0], e.courses[0])} />
      </main>
      <SiteFooter />
    </>
  );
}
