// What the sign-in and sign-up forms rest at, in one place. The demo has no
// server, so these are the answers it accepts: a buyer wiring real auth
// deletes this file and the forms' `resting()` functions with it.
//
// The learner is the one the dashboard and the checkout are signed in as, so
// the name and the address come from there rather than being typed twice.

import { learner } from "@/components/dashboard/learner";

export const demo = {
  email: learner.email,
  name: learner.name,
  /** Rests in both password fields. Long, with a number, and not the name. */
  password: "lamp-after-nine-42",
  /** The reset code the inbox step says it sent, and rests at. */
  code: "428193",
  /** The new password the reset's last step rests at. */
  fresh: "second-coffee-17",
  /** A work address, for the single sign-on view, and the team it finds. */
  work: "jordan@harborlogistics.example",
  team: "Harbor Logistics",
  /** Seconds before the reset code can be sent again. */
  resend: 30,
  /** How long the demo pretends a sign-in takes, in milliseconds. */
  wait: 1100,
};

/** Where a finished sign-in lands, unless the address asked for elsewhere.
 *  Only a path on this site is honoured, so `?next=` cannot send a visitor
 *  to another host. */
export function landingOf(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";
}
