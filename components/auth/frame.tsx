import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/site/logo";
import { reach } from "@/components/reach";
import { authCopy } from "@/components/auth/copy";
import { cn } from "@/lib/utils";

// Lummi, free licence, hotlinked as the other Lummi photographs are. One
// photograph behind both account screens, so moving between them reads as
// one place: a small studio seen through a fluted-glass door, a peach wall,
// a whiteboard pinned with colour swatches and a high table ringed with
// stools. The glass down the left takes the cards laid over the photograph.
export const AUTH_PHOTO =
  "https://assets.lummi.ai/assets/QmfFK1gSARnHmzmGdcX4yKsDWqTKcQX5HiZ42aUigya1uo?auto=format&w=1600";

/** The page both account screens stand on, drawn from the sign-in's
 *  reference: the form in a narrow column in the middle of the white half,
 *  so the margin either side of it is wider than the form, and a photograph
 *  in a rounded frame filling the other half to the screen's height. No
 *  header and no footer: a screen with one job, and the mark over the form
 *  is the way home. Under lg the photograph goes and the column has the
 *  page. */
export function AuthFrame({
  children,
  panel,
  foot,
  legal = true,
}: {
  children: ReactNode;
  panel: ReactNode;
  foot?: ReactNode;
  /** The line agreeing to the terms under the column; off where the form
   *  asks for the agreement with a box of its own. */
  legal?: boolean;
}) {
  return (
    <main id="content" className="flex min-h-dvh flex-col">
      <section className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 p-3 sm:p-4 lg:grid-cols-[45fr_55fr] lg:gap-4">
        <div className="flex min-w-0 flex-col items-center px-3 pt-6 pb-4 sm:px-8 sm:pt-8">
          <Link
            href="/"
            aria-label="Mentora home"
            className={cn(
              "rounded-sm font-heading text-foreground press hover:opacity-70",
              reach,
            )}
          >
            <Logo className="text-3xl" />
          </Link>
          <div className="flex w-full max-w-sm flex-1 flex-col justify-center py-10">
            {children}
          </div>
          {foot}
          {legal && <Legal />}
        </div>
        <aside className="relative hidden min-h-0 lg:block">
          {/* Held to the screen while a tall step scrolls the column, so the
            picture never ends above the form's foot. */}
          <div className="sticky top-4 h-[calc(100dvh-2rem)] min-h-[40rem] overflow-hidden rounded-lg bg-muted">
            <div className="relative size-full">{panel}</div>
          </div>
        </aside>
      </section>
    </main>
  );
}

/** The line under every account form, pointing at the two pages it agrees
 *  to. */
function Legal() {
  const l = authCopy.legal;
  const link = cn(
    "underline underline-offset-4 transition-colors hover:text-foreground",
    reach,
  );
  return (
    <p className="mt-6 max-w-sm text-center text-sm text-muted-foreground">
      {l.before}{" "}
      <Link href="/about#terms" className={link}>
        {l.terms}
      </Link>{" "}
      {l.and}{" "}
      <Link href="/about#privacy" className={link}>
        {l.privacy}
      </Link>
      .
    </p>
  );
}
