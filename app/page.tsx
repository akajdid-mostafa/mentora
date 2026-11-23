import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/footer";
import { CatalogRail } from "@/components/marketing/catalog-rail";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { HeroPortraitColumns } from "@/components/marketing/hero-portrait-columns";
import { InstructorsRanked } from "@/components/marketing/instructors-ranked";
import { ObjectionBars } from "@/components/marketing/objection-bars";
import { OutcomeFigure } from "@/components/marketing/outcome-figure";
import { PathCanvas } from "@/components/marketing/path-canvas";
import { PricingSelector } from "@/components/marketing/pricing-selector";
import { ProofRowsOnGradient } from "@/components/marketing/proof-rows-on-gradient";
import { StudioStepCards } from "@/components/marketing/studio-step-cards";
import { TestimonialsMetricPanel } from "@/components/marketing/testimonials-metric-panel";
import { TutorTabbedCard } from "@/components/marketing/tutor-tabbed-card";
import { SiteHeader } from "@/components/site/header";
import { Reveal } from "@/components/site/reveal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "A tutor that has the lesson open",
  description:
    "A multi-instructor course platform with AI at both ends: a tutor that answers from the lesson on screen, and a studio that drafts a course from a transcript.",
  path: "/",
});

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <HeroPortraitColumns />
        {/* Every section under the hero rises into place once as it arrives:
            a fade and a 20px rise over 900ms. One already on screen when the
            page loads, a reader who asks for less motion and a printed page
            all get the section as it is drawn. reveal.tsx is the whole
            mechanism, and globals.css holds its two states. */}
        <Reveal>
          <ProofRowsOnGradient />
        </Reveal>
        <Reveal>
          <TutorTabbedCard />
        </Reveal>
        <Reveal>
          <ObjectionBars />
        </Reveal>
        <Reveal>
          <PathCanvas />
        </Reveal>
        <Reveal>
          <CatalogRail />
        </Reveal>
        <Reveal>
          <InstructorsRanked />
        </Reveal>
        <Reveal>
          <StudioStepCards />
        </Reveal>
        <Reveal>
          <OutcomeFigure />
        </Reveal>
        <Reveal>
          <TestimonialsMetricPanel />
        </Reveal>
        <Reveal>
          <PricingSelector />
        </Reveal>
        <Reveal>
          <FaqStepRows />
        </Reveal>
        <Reveal>
          <ClosingPhotoHalf />
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
