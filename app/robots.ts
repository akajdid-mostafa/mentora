import type { MetadataRoute } from "next";

import { abs } from "@/lib/site";

// Every path open to crawling, the six that ask not to be indexed included.
//
// The lesson player, the dashboard, the studio, the checkout and the two
// account forms each carry `robots: { index: false }` in their own metadata,
// and sitemap.ts leaves them out. A `Disallow` here would undo both: a crawler
// that may not fetch a page never reads the noindex on it, and a page linked
// from elsewhere can still be listed by its address alone, which is the result
// the noindex is there to prevent.
//
// A crawlable path is not a private one either way. Everything is served to
// anybody who asks; real access control is a thing a template does not have
// and should not pretend to.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: abs("/sitemap.xml"),
  };
}
