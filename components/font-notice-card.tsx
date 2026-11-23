import { TextFontIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CopyCommand } from "@/components/copy-command";
import { missingFetchedFaces } from "@/lib/fetched-fonts.mjs";

// The one instruction in this template that a buyer has to act on, put where
// they already are rather than in a documentation file they will not open.
//
// It renders in development only, so it is never a nag pointed at their
// visitors — and it disappears on its own the moment the files land, which is
// what makes it safe to be this prominent. Nothing has to be dismissed and
// nothing has to be deleted afterwards.
//
// A server component, so the check is a directory read on the machine that
// already has the answer: no request, no client bundle, no flash of a notice
// that turns out to be wrong. Loaded only through font-notice.tsx, in
// development.
export async function FontNoticeCard() {
  const missing = missingFetchedFaces();
  if (missing.length === 0) return null;

  const names = missing.map((face) => face.family);
  const listed =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

  return (
    // Bottom right, because bottom left is where Next draws its own dev
    // indicator and the two would sit on top of each other.
    <div className="fixed right-6 bottom-6 z-50 w-[min(92vw,24rem)] rounded-lg bg-card p-5 shadow-soft-lg">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={TextFontIcon}
          size={16}
          strokeWidth={2}
          className="text-muted-foreground"
        />
        <p className="text-sm font-medium">
          {names.length} fonts to download
        </p>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {listed} are free to use and not free to pass on, so this template
        links to them instead of shipping them. The page is running on
        fallbacks until you fetch your own copy.
      </p>

      <CopyCommand command="npm run fonts" />

      <p className="mt-3 text-xs text-muted-foreground">
        Development only — this never reaches your visitors. Why, and what each
        face falls back to: public/fonts/README.md
      </p>
    </div>
  );
}
