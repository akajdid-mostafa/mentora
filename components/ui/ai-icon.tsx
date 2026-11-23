import { AiMagicIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// The site's AI glyph, in one place. Every mark of the AI draws it from here —
// the chips that say AI, the tutor's disc, the hint buttons, the planner's
// build button, the tutor's row in a course's facts and reviews — so changing
// the glyph below changes it everywhere at once.
//
// `aiGlyph` is for the places that hand an icon round as data, beside the
// other icons of a list; `AiIcon` draws it.
export const aiGlyph = AiMagicIcon;

/** The AI glyph, decorative: the word beside it, or the label of the control
 *  it sits in, says what it means. The stroke is the one the glyph wears at
 *  chip sizes; a large glyph set among lighter ones passes its own. */
export function AiIcon({
  size = 14,
  strokeWidth = 1.8,
  className,
}: {
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <HugeiconsIcon
      icon={aiGlyph}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={className}
    />
  );
}
