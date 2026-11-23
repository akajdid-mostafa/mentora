import type { Metadata } from "next";
import { signInCopy } from "@/components/auth/copy";
import { AuthFrame } from "@/components/auth/frame";
import { SignIn, SignInFoot } from "@/components/auth/sign-in";
import { SignInPhoto } from "@/components/auth/sign-in-photo";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: signInCopy.meta.title,
  description: signInCopy.meta.description,
  path: "/sign-in",
  // A form, and the same one on every site that has accounts: nothing here
  // is worth a search result. sitemap.ts leaves the route out, while
  // robots.ts leaves it crawlable so the noindex is read.
  robots: { index: false, follow: true },
});

export default function Page() {
  return (
    <AuthFrame panel={<SignInPhoto />} foot={<SignInFoot />}>
      <SignIn />
    </AuthFrame>
  );
}
