import type { Metadata } from "next";
import { signUpCopy } from "@/components/auth/copy";
import { SignUp } from "@/components/auth/sign-up";
import { pageMeta } from "@/lib/seo";

// Built ahead, and built again at most once a day: the page is sent with the
// server's date (cohorts, finish dates, the month's figures) and the
// visitor's own calendar takes over once it hydrates. Without this the sent
// date stays the build's, and every day the deploy ages the jump between the
// two grows.
export const revalidate = 86400;

export const metadata: Metadata = pageMeta({
  title: signUpCopy.meta.title,
  description: signUpCopy.meta.description,
  path: "/sign-up",
  // The sign-in's twin, and noindex for the same reason: sitemap.ts leaves
  // the route out, while robots.ts leaves it crawlable so the noindex is
  // read.
  robots: { index: false, follow: true },
});

export default function Page() {
  // The server's today, which the finish dates are counted from on the
  // first frame; the form moves to the visitor's own after it hydrates.
  const today = new Date().toISOString().slice(0, 10);

  return <SignUp today={today} />;
}
