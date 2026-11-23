"use client";

import "./globals.css";
import { ErrorScreen } from "@/components/site/error-screen";
import { fontVariables } from "@/lib/fonts";

// The root layout itself failing. This replaces it, so it brings its own
// document, the global stylesheet and the faces the layout would have set.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-US" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <title>Something went wrong · Mentora</title>
        <ErrorScreen retry={retry} />
      </body>
    </html>
  );
}
