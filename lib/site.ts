// Who the site is, and where it lives. Two values every crawler-facing field
// resolves against.
//
// The fallback is this repository's GitHub Pages address: an address the
// project actually owns, so the sitemap, canonicals and JSON-LD never point at
// a reserved example domain. A real deploy names its own host with
// NEXT_PUBLIC_SITE_URL in the environment and leaves this file alone. Set it
// before launch: search engines read these fields long before a visitor sees
// the page.
export const siteName = "Mentora";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://akajdid-mostafa.github.io/mentora";

/** An absolute URL from a site path.
 *
 *  `metadataBase` does this for the metadata fields on its own, so `pageMeta`
 *  hands them a path. JSON-LD gets no such help — it is a string in a script
 *  tag, and `"/about"` in an `@id` is a claim about whatever host happens to
 *  be serving it. */
export const abs = (path: string) => new URL(path, siteUrl).toString();
