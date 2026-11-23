import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

type CapsProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

// The page's one line of small capitals: the eyebrow over a heading, the label
// over a field or a figure, a column head, a tag on a card. Mono at 12px with
// the eyebrow's letterspacing, so every one of them is the same line wherever
// it sits. The ink defaults to the muted one; a caller on another ground passes
// its own through `className`, and `cn()` lets it win, as it does the layout.
export function Caps<T extends ElementType = "p">({
  as,
  className,
  ...props
}: CapsProps<T>) {
  const Tag: ElementType = as ?? "p";
  return (
    <Tag
      className={cn(
        "font-mono text-xs uppercase tracking-eyebrow text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
