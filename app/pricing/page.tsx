import type { Metadata } from "next";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { CompareTable } from "@/components/pricing/compare-table";
import { pricingClosing, pricingFaqCopy, pricingFaqs } from "@/components/pricing/copy";
import { PlanCalculator } from "@/components/pricing/plan-calculator";
import { PlansFrame } from "@/components/pricing/plans-frame";
import { PricingProvider } from "@/components/pricing/state";
import { TeamsSeats } from "@/components/pricing/teams-seats";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "Buy a course for good, open all 12,400 on Plus for $29 a month, or put a team on one invoice. The AI tutor comes with every plan.",
  path: "/pricing",
});

// Rendered per request: the calculator counts its twelve months from the
// month the page is sent in, and a page built ahead of time would count
// from the day it was built.
export const dynamic = "force-dynamic";

export default function Page() {
  // The month the page is sent in, which the calculator counts as the first
  // of the visitor's twelve.
  const today = new Date().toISOString().slice(0, 10);
  const start = today.slice(0, 7);

  return (
    <>
      <SiteHeader />
      {/* One state for the whole page, held in the address: Monthly or
          Yearly, the calculator's two numbers and the team's seats. */}
      <PricingProvider>
        <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
          <PlansFrame />
          <PlanCalculator start={start} />
          <CompareTable />
          <TeamsSeats today={today} />
          {/* The home page's "Refund within 30 days" lands here, on the row
              that opens with the refund. */}
          <FaqStepRows anchor="questions" items={pricingFaqs} copy={pricingFaqCopy} />
          <ClosingPhotoHalf copy={pricingClosing} />
        </main>
      </PricingProvider>
      <SiteFooter />
    </>
  );
}
