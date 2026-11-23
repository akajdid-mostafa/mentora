import type { Metadata } from "next";
import { closingCopy, faqCopy, faqs } from "@/components/instructors/copy";
import { fromQuery, toQuery } from "@/components/instructors/directory";
import { DirectoryBrowser } from "@/components/instructors/directory-browser";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Instructors",
  description:
    "Every instructor on Mentora, filtered by field, language and rating, with the four checks each one passed before their first course opened.",
  path: "/instructors",
});

export default async function Page({ searchParams }: PageProps<"/instructors">) {
  // The filters arrive in the address bar: the home page's instructor row
  // writes `?field=`, and a shared link any of them.
  const initial = fromQuery(await searchParams);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        {/* Keyed on the query, so a link that changes it opens the
            directory on that link's filters. A link back to the page as it
            first loaded can come out of the router's cache without a
            render here, so the section also reads the address itself. */}
        <DirectoryBrowser key={toQuery(initial)} />
        <FaqStepRows items={faqs} copy={faqCopy} />
        <ClosingPhotoHalf copy={closingCopy} />
      </main>
      <SiteFooter />
    </>
  );
}
