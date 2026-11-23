// The cast a fragment floating over a photograph or a colour field throws:
// wider and warmer than the style's two shadow tokens, which were measured
// against a near-white page and read as pasted on over a picture. It reads
// the same three variables they do, so the dark half draws its faint light
// edge and deepens the cast, and its own warmer ink from --float-ink.
export const float =
  "shadow-[0_0_0_1px_var(--shadow-edge),0_2px_6px_hsl(var(--float-ink)/calc(0.10*var(--shadow-depth))),0_24px_48px_-16px_hsl(var(--float-ink)/calc(0.38*var(--shadow-depth)))]";
