"use client";

import { ErrorScreen } from "@/components/site/error-screen";

// A page that throws, inside the site's layout. A boundary cannot export
// metadata, so the tab's title is set here as an element.
export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <>
      <title>Something went wrong · Mentora</title>
      <ErrorScreen retry={retry} />
    </>
  );
}
