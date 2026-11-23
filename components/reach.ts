// The hit area behind a control, as a class string rather than as a copy in
// every section: a pseudo-element carries a 40px target so the control is not
// sized to meet it. Padding would move the drawn edge, which is the thing being
// kept small. This project draws no button under 40px, round ones aside, so on
// a pill it only guards the floor; it does the work on a bare control drawn at
// its text's height — an icon and a count, a text button.
//
// `inset-x-0` because a pill is wider than it is tall, so only the vertical
// axis is short. An icon-only control is short on both and takes
// `after:-inset-0.5` instead.
export const reach =
  "relative after:absolute after:inset-x-0 after:top-1/2 after:h-10 after:-translate-y-1/2 after:content-['']";
