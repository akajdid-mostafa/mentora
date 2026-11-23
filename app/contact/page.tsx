import type { Metadata } from "next";
import { contactFaqCopy, contactFaqs, contactMeta } from "@/components/contact/copy";
import { DeskPanels } from "@/components/contact/desk-panels";
import { MessageForm } from "@/components/contact/message-form";
import { OfficeMap } from "@/components/contact/office-map";
import { FaqStepRows } from "@/components/marketing/faq-step-rows";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: contactMeta.title,
  description: contactMeta.description,
  path: "/contact",
});

// The page renders per request: which office is on
// shift is read from the moment it is asked for.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps<"/contact">) {
  // The moment the page is sent, which every open-or-closed line reads on
  // the first frame; the sections move to the visitor's own clock and zone
  // once they hydrate.
  const now = new Date().toISOString();

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        {/* A link from the about or pricing page says who the message is
            for in the address; the form opens already addressed. */}
        <MessageForm now={now} asked={await searchParams} />
        <DeskPanels now={now} />
        <OfficeMap now={now} />
        <FaqStepRows anchor="questions" items={contactFaqs} copy={contactFaqCopy} />
      </main>
      <SiteFooter />
    </>
  );
}
