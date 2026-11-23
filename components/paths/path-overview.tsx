import type { Course } from "@/components/course/courses";
import { courseHref } from "@/components/course/courses";
import { pathHref, totalHours, type Goal } from "@/components/marketing/goals";
import { coursesOf } from "@/components/paths/paths";
import { PathBody } from "@/components/paths/path-body";
import { Breadcrumb } from "@/components/site/breadcrumb";
import { JsonLd } from "@/components/site/json-ld";
import { abs } from "@/lib/site";

/** The path page's first section and most of it: down the left the path and
 *  the planner, the planner riding beside the long read; down the right the
 *  five courses, the week they make, what to know before starting and the
 *  certificate at the end. */
export function PathOverview({
  goal: g,
  items,
  projects,
  today,
}: {
  goal: Goal;
  items: number[];
  projects: string[];
  today: string;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 pt-6 sm:px-8 sm:pt-8">
      <JsonLd schema={programLd(g, coursesOf(g))} />
      <Breadcrumb
        trail={[
          { label: "Paths", href: "/#paths" },
          { label: g.short },
        ]}
      />
      <PathBody id={g.id} items={items} projects={projects} today={today} />
    </section>
  );
}

/** The path as a search engine reads it: a programme made of five courses,
 *  the hours it takes and what buying its courses costs. */
function programLd(g: Goal, list: Course[]) {
  const url = abs(pathHref(g));
  return {
    "@type": "EducationalOccupationalProgram",
    "@id": `${url}#program`,
    name: `${g.short} path`,
    description: g.blurb,
    url,
    provider: { "@id": abs("/#organization") },
    educationalProgramMode: "online",
    timeToComplete: `PT${totalHours(g)}H`,
    hasCourse: list.map((c) => ({
      "@type": "Course",
      name: c.title,
      url: abs(courseHref(c)),
      provider: { "@type": "Organization", name: c.school },
    })),
    offers: {
      "@type": "Offer",
      price: list.reduce((n, c) => n + c.price, 0),
      priceCurrency: "USD",
      category: "Paid",
      url,
    },
  };
}
