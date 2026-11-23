import { cn } from "@/lib/utils";

// The brand's mark: the name cut to its first letter, followed by the dot the
// mark has always worn. It signs the header, its drawer, the footer, and the
// two sections that carry the name, and takes its face from where it sits,
// since every call site sets the heading face. The size is its own, three steps
// up from the text-lg its call sites set, because a short monogram can carry
// the height, and at that display size the weight comes off, as it does on
// every heading: the size is the emphasis. A call site that wants it smaller
// passes a size.
//
// The row aligns on the baseline, so the dot sits on it as a full point does
// whatever line height the size brings. The ink is currentColor and the dot is
// the brand with the chip's halo, so the mark holds on any hue the brand is
// turned to and on the dark row that signs with it. The full name stays in the
// accessibility tree; the visible half is hidden from it.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex w-fit items-baseline text-3xl tracking-tight",
        className,
      )}
    >
      <span className="sr-only">Mentora</span>
      <span aria-hidden="true" className="flex items-baseline">
        M
        <span className="ml-[0.06em] size-[0.3em] shrink-0 rounded-full bg-primary ring-[0.12em] ring-chip" />
      </span>
    </span>
  );
}
