import type { MetadataRoute } from "next";

import { courseHref, courses, teacherHref } from "@/components/course/courses";
import { roster } from "@/components/instructors/directory";
import { goals, pathHref } from "@/components/marketing/goals";
import { abs } from "@/lib/site";

// Every page a search engine should land somebody on, which is not every route
// in the app. A fork extends this from its own data — a listing's rows produce
// the listing's URLs — so a buyer replacing the mock data gets their own
// sitemap rather than one that still names ours.
//
// **What is left out has to match the page's own `robots` field.** Two files
// naming the same routes, each individually correct while saying something
// different, is the fault `seo-check.py` cross-reads for: a
// sitemap that submits a page the page itself asks not to index is a site
// arguing with itself in the first file a crawler opens.
//
// **`lastModified` goes on rows that have a date and nowhere else.** A build
// stamping `new Date()` across every route tells a crawler the whole site
// changed on deploy, and a sitemap caught in that has all its dates ignored —
// including the true ones.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), priority: 1, changeFrequency: "weekly" },
    { url: abs("/courses"), priority: 0.9, changeFrequency: "weekly" },
    { url: abs("/instructors"), priority: 0.8, changeFrequency: "weekly" },
    { url: abs("/teach"), priority: 0.8, changeFrequency: "monthly" },
    { url: abs("/pricing"), priority: 0.8, changeFrequency: "monthly" },
    { url: abs("/about"), priority: 0.6, changeFrequency: "monthly" },
    { url: abs("/contact"), priority: 0.5, changeFrequency: "yearly" },
    // One row per course, off the same array the catalogue lists, dated by
    // when each was published: the one date the data carries.
    ...courses.map((c) => ({
      url: abs(courseHref(c)),
      lastModified: c.added,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    // One row per teacher, off the directory's roster, with no date: a
    // profile changes when one of the teacher's courses does.
    ...roster.map((e) => ({
      url: abs(teacherHref(e.name)),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    // One row per path, off the goals the home page's planner offers. They
    // carry no date: a path changes when one of its courses does.
    ...goals.map((g) => ({
      url: abs(pathHref(g)),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
  ];
}
