import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { catalogClosing, catalogFaqCopy, catalogFaqs } from "@/components/catalog/copy";
import { fromQuery, toQuery } from "@/components/catalog/state";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Courses",
  description:
    "Browse courses by subject, level, length, price, rating, language and credential, then compare up to three side by side.",
  path: "/courses",
});

export default async function Page({ searchParams }: PageProps<"/courses">) {
  // The filters arrive in the address bar: the header's subject menu writes
  // `?topic=`, the hero's search `?q=`, and a shared link any of them.
  const initial = fromQuery(await searchParams);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        {/* Keyed on the query, so following a link that changes it opens the
            catalog on that link's filters rather than on the ones already
            set. Filtering rewrites the address without a navigation, so the
            key still holds the query the page loaded with, and a link back
            to that query keeps the section as it stands. The section reads
            the address itself to catch that link. */}
        <CatalogBrowser key={toQuery(initial)} />
        <FaqStepRows items={catalogFaqs} copy={catalogFaqCopy} />
        <ClosingPhotoHalf copy={catalogClosing} />
      </main>
      <SiteFooter />
    </>
  );
}
