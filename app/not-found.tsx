import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { CourseCard } from "@/components/course/course-card";
import { courses } from "@/components/course/courses";
import { reach } from "@/components/reach";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Page not found" };

// The four courses most learners are in, off the same array the catalogue
// lists, so the page a lost reader lands on still opens onto real courses.
const popular = [...courses].sort((a, b) => b.learners - a.learners).slice(0, 4);

/** Every address the site does not serve: the shell, one line in the site's
 *  own voice, the two ways back, and the courses most learners start with. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-24 overflow-x-clip sm:gap-32">
        <section className="mx-auto w-full max-w-7xl px-6 pt-16 text-center sm:px-8 sm:pt-24">
          <Eyebrow className="justify-center">Page not found</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-[14ch] text-4xl tracking-tighter text-balance sm:text-5xl lg:text-6xl">
            There&apos;s no lesson at this address
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-balance text-muted-foreground">
            The link may be out of date, or the page has moved. Every course and every instructor is still a
            click away.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center">
            <Button render={<Link href="/courses" />}>
              Browse courses
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Link
              href="/"
              className={cn(
                "press flex h-10 items-center justify-center rounded-control bg-card px-5 text-sm font-medium shadow-soft hover:shadow-soft-lg active:shadow-none",
                reach,
              )}
            >
              Back to the home page
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <SectionHeading>Where most learners start</SectionHeading>
          <ul className="mt-10 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((c) => (
              <li key={c.id}>
                <CourseCard
                  course={c}
                  sizes="(min-width: 1280px) 276px, (min-width: 1024px) calc(25vw - 44px), (min-width: 640px) calc(50vw - 56px), calc(100vw - 64px)"
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
