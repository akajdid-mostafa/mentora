import type { Metadata } from "next";
import { AiPanel } from "@/components/about/ai-panel";
import { aboutClosing } from "@/components/about/copy";
import { HeroFan } from "@/components/about/hero-fan";
import { Policies } from "@/components/about/policies";
import { StandardsPanel } from "@/components/about/standards-panel";
import { StoryArc } from "@/components/about/story-arc";
import { TeamArches } from "@/components/about/team-arches";
import { ClosingPhotoHalf } from "@/components/marketing/closing-photo-half";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "Who builds Mentora, where its AI tutor and course studio stop, what a course passes before it goes live, and the privacy terms in plain words.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex flex-col gap-32 overflow-x-clip sm:gap-40">
        <HeroFan />
        <StoryArc />
        <AiPanel />
        <TeamArches />
        <StandardsPanel />
        <Policies />
        <ClosingPhotoHalf copy={aboutClosing} />
      </main>
      <SiteFooter />
    </>
  );
}
