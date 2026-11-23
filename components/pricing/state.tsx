"use client";

import { createContext, useContext, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useAddressState } from "@/components/listing/use-address-state";

// What the pricing page holds for its visitor, in one place: whether prices
// read by the month or by the year, the calculator's two numbers and the
// team's seat count. Four sections read it, so flipping Monthly to Yearly on
// the plans also flips the calculator, the compare table's head and the
// team's quote. It lives in the address once it differs from where the page
// opens, so a copied link reopens the same estimate, and /checkout reads the
// same `billing` word the plans' button hands it.

export type Billing = "monthly" | "yearly";

export type Pricing = {
  billing: Billing;
  /** Courses the visitor expects to finish in the next twelve months. */
  courses: number;
  /** What one course usually costs them, in dollars. */
  spend: number;
  /** Seats on a team. */
  seats: number;
};

export const COURSES_RANGE = { min: 1, max: 20, step: 1 };
// Every paid course in the catalog is priced on a 9, from $19 to $149, so the
// slider's stops are prices a course actually has.
export const SPEND_RANGE = { min: 19, max: 149, step: 10 };
export const SEATS_RANGE = { min: 5, max: 500, step: 1 };

export const pricingDefaults: Pricing = { billing: "monthly", courses: 4, spend: 89, seats: 20 };

function clampTo(raw: string | undefined, r: { min: number; max: number; step: number }, fallback: number) {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  const stepped = Math.round((n - r.min) / r.step) * r.step + r.min;
  return Math.min(r.max, Math.max(r.min, stepped));
}

/** The address's parameters as the page's state. Anything missing, empty or
 *  not a number falls back to where the page opens; a number past either end
 *  of its range is held at that end. */
export function fromQuery(q: Record<string, string | string[] | undefined>): Pricing {
  const one = (k: string) => {
    const v = q[k];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    billing: one("billing") === "yearly" ? "yearly" : "monthly",
    courses: clampTo(one("courses"), COURSES_RANGE, pricingDefaults.courses),
    spend: clampTo(one("spend"), SPEND_RANGE, pricingDefaults.spend),
    seats: clampTo(one("seats"), SEATS_RANGE, pricingDefaults.seats),
  };
}

/** The state as a query, "" or "?…", naming only what differs from where the
 *  page opens: a first visit keeps a clean address. */
export function toQuery(p: Pricing) {
  const q = new URLSearchParams();
  if (p.billing !== pricingDefaults.billing) q.set("billing", p.billing);
  if (p.courses !== pricingDefaults.courses) q.set("courses", String(p.courses));
  if (p.spend !== pricingDefaults.spend) q.set("spend", String(p.spend));
  if (p.seats !== pricingDefaults.seats) q.set("seats", String(p.seats));
  const s = q.toString();
  return s ? `?${s}` : "";
}

const read = (params: Record<string, string>) => fromQuery(params);

type Held = { value: Pricing; set: Dispatch<SetStateAction<Pricing>> };

const PricingContext = createContext<Held | null>(null);

/** Holds the page's state for every section under it. One writer to the
 *  address, since two would each write their own half and wipe the other's. */
export function PricingProvider({ children }: { children: ReactNode }) {
  const [value, set] = useAddressState(read, toQuery);
  return <PricingContext.Provider value={{ value, set }}>{children}</PricingContext.Provider>;
}

export function usePricing() {
  const held = useContext(PricingContext);
  if (!held) throw new Error("usePricing needs a PricingProvider above it");
  const { value, set } = held;
  return {
    ...value,
    yearly: value.billing === "yearly",
    setBilling: (billing: Billing) => set((p) => ({ ...p, billing })),
    setCourses: (courses: number) => set((p) => ({ ...p, courses })),
    setSpend: (spend: number) => set((p) => ({ ...p, spend })),
    setSeats: (seats: number) => set((p) => ({ ...p, seats })),
  };
}
