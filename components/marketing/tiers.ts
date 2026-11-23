// Row 11's three tiers and the arithmetic the calculator runs. A price is the
// one string on this page nobody should have to find inside a component.

export type Tier = {
  name: string;
  blurb: string;
  monthly: number;
  yearly: number;
  /** What `monthly` is charged per, and `yearly` below it. */
  unit: string;
  yearlyUnit: string;
  cta: string;
  href: string;
  ticks: string[];
  featured?: boolean;
};

export const tiers: Tier[] = [
  {
    name: "Per course",
    blurb: "Buy the one you came for and keep it for good. No subscription anywhere in it.",
    monthly: 89,
    yearly: 89,
    unit: "average course",
    yearlyUnit: "average course",
    cta: "Browse courses",
    href: "/courses",
    ticks: [
      "Lifetime access to what you buy",
      "The certificate, where the course carries one",
      "AI tutor on every lesson",
      "Refund within 30 days",
      "Nothing renews",
    ],
  },
  {
    name: "Mentora Plus",
    blurb: "Everything on the platform, for anyone who finishes more than three courses in a year.",
    monthly: 29,
    yearly: 290,
    unit: "month",
    yearlyUnit: "year",
    cta: "Start 7 days free",
    href: "/checkout",
    featured: true,
    ticks: [
      "All 12,400 courses",
      "Every path, start to finish",
      "Certificates on all of them",
      "Offline downloads",
      "Cancel in one click",
    ],
  },
  {
    name: "Teams",
    blurb: "Five seats and up, with the part your finance team asks about.",
    monthly: 24,
    yearly: 240,
    unit: "seat, per month",
    yearlyUnit: "seat, per year",
    cta: "Talk to us",
    href: "/contact",
    ticks: [
      "Everything in Plus",
      "Seat management and SSO",
      "Progress across the team",
      "Invoiced annually",
      "A named contact, not a queue",
    ],
  },
];

/** What a tier costs with the toggle on month or on year. A seat stays a seat
 *  either way, which is why the year's unit is written out per tier rather
 *  than swapped for the word "year". */
export const priceOf = (t: Tier, yearly: boolean) =>
  yearly
    ? { amount: t.yearly, unit: t.yearlyUnit }
    : { amount: t.monthly, unit: t.unit };

/** The yearly saving on Plus, as the toggle's badge prints it. */
export const yearlySaving = Math.round(
  (1 - tiers[1].yearly / (tiers[1].monthly * 12)) * 100,
);

// What one course costs on average, which is the number the calculator turns
// into a comparison.
export const AVERAGE_COURSE = 89;

/** Buying separately against a year of Plus, for `n` courses. */
export const compare = (n: number, plusYearly: number) => {
  const separately = n * AVERAGE_COURSE;
  return {
    separately,
    plus: plusYearly,
    plusWins: plusYearly < separately,
    saving: Math.abs(separately - plusYearly),
  };
};
