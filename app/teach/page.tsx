import type { Metadata } from "next";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { ApplyForm } from "@/components/teach/apply-form";
import { teachClosing, teachFaqCopy, teachFaqs } from "@/components/teach/copy";
import { EarningsBento } from "@/components/teach/earnings-bento";
import { fromQuery, toQuery } from "@/components/teach/earnings";
import { FiguresWithPortraits } from "@/components/teach/figures-with-portraits";
import { HeroPhotoPanel } from "@/components/teach/hero-photo-panel";
import { StepsWithPhoto } from "@/components/teach/steps-with-photo";
import { StoriesCarousel } from "@/components/teach/stories-carousel";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Teach",
  description:
    "Keep 70% of every course sale, get paid on the 15th, and draft a syllabus in the studio. Four checks and about 11 days to your badge.",
  path: "/teach",
});

// Rendered per request: the payout card counts from the day the page is
// sent on, and a page built ahead of time would count from the day it was
// built.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps<"/teach">) {
  // The date the page is sent on, which the payout card counts from.
  const today = new Date().toISOString().slice(0, 10);
  // The calculator's three numbers arrive in the address bar when a link to
  // an estimate is shared.
  const estimate = fromQuery(await searchParams);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <HeroPhotoPanel today={today} />
        <FiguresWithPortraits />
        {/* Keyed on the estimate, so a link that changes it opens the
            calculator on that link's numbers. Moving the calculator rewrites
            the address without a navigation, so a link back to the query
            the page loaded with keeps the key; the calculator reads the
            address itself to catch that link. */}
        <EarningsBento key={toQuery(estimate)} />
        <StepsWithPhoto />
        <StoriesCarousel />
        <ApplyForm today={today} />
        {/* The calculator's arrow lands here, on the row that opens with
            what the 30% pays for. */}
        <FaqStepRows anchor="questions" items={teachFaqs} copy={teachFaqCopy} />
        <ClosingPhotoHalf copy={teachClosing} />
      </main>
      <SiteFooter />
    </>
  );
}
