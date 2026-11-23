import type { Metadata } from "next";
import { Checkout } from "@/components/checkout/checkout";
import { checkoutCopy } from "@/components/checkout/copy";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: checkoutCopy.meta.title,
  description: checkoutCopy.meta.description,
  path: "/checkout",
  // A form with one made-up buyer's details in it: nothing here is worth a
  // search result, and the course pages and the pricing row are. sitemap.ts
  // leaves the route out, while robots.ts leaves it crawlable so the noindex
  // is read.
  robots: { index: false, follow: true },
});

// The checkout renders per request: the order is read from the address by
// the client (`useSearchParams`), and the cohorts and the test card's expiry
// are counted from the day the page is sent.
export const dynamic = "force-dynamic";

export default function Page() {
  // The server's today, which the cohorts on offer and the test card's expiry
  // are counted from on the first frame; the section moves to the visitor's
  // own calendar after it hydrates.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <Checkout today={today} />
      </main>
      <SiteFooter />
    </>
  );
}
