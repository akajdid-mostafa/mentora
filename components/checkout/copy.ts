// Every string the checkout prints, kept apart from the components so a buyer
// finds the page's words in one file. A string that carries a figure, a date or
// a name is a function of it.

import { tiers, yearlySaving } from "@/components/marketing/tiers";

const plus = tiers[1];

export const checkoutCopy = {
  meta: {
    title: "Checkout",
    description:
      "Pay for a course or start Mentora Plus in three steps, with 30 days to ask for your money back on every course.",
  },
  crumbs: { courses: "Courses", pricing: "Pricing", checkout: "Checkout" },

  heading: {
    course: (title: string) => `Enroll in ${title}`,
    plus: `Start ${plus.name}`,
    path: (path: string) => `The ${path.toLowerCase()} path on Plus`,
  },
  // One line each at the form's width, 448px: about 55 characters.
  lede: {
    self: "Lesson 1.1 opens the moment you pay.",
    cohort: (day: string) => `We hold your seat in the ${day} cohort while you pay.`,
    free: "Two steps, no card. Lesson 1.1 opens when you finish.",
    plus: (price: string, unit: string) => `Seven days free, then ${price} a ${unit}.`,
    path: (courses: number, price: string, unit: string) => `All ${courses} courses, seven days free, then ${price} a ${unit}.`,
  },

  order: {
    caps: "Your order",
    start: "Start",
    startGroup: "When to start",
    self: "Today, at your own pace",
    cohort: (from: string, to: string) => `Cohort, ${from} to ${to}`,
    full: "Full",
    left: (n: number) => `${n} left`,
    plus: plus.name,
    plusLine: "Every course and path. Cancel in one click.",
    perMonth: "a month",
    perYear: "a year",
    includes: (title: string) => `${title} is one of them`,
    path: (courses: number, hours: number) => `${courses} courses, ${hours} hours`,
    pathName: (path: string) => `The ${path.toLowerCase()} path`,
    code: "Promo code",
    codePlaceholder: "Code",
    apply: "Apply",
    remove: (code: string) => `Remove ${code}`,
    // on the field's label line while it holds the code the learner was sent
    offered: (note: string) => note,
    subtotal: "Subtotal",
    freePrice: "Free",
    plusRow: (billing: string) => `${plus.name}, ${billing}`,
    tax: (name: string, rate: number) => `${name} (${rate}%)`,
    noTax: "Tax",
    total: "Total",
    today: "Due today",
    charge: (day: string) => `First charge, ${day}`,
    then: (amount: string, a: string, b: string) => `Then ${amount} on ${a} and ${b}`,
    once: "Nothing more to pay after today",
    how: "How to pay",
    inFull: "In full",
    inThree: "In three",
    refund: "Your money back within 30 days",
    cancel: "Cancel in one click, before or after the first charge",
    free: "No card, now or later",
    toPlus: {
      line: `Or all 12,400 courses on Plus for $${plus.monthly} a month.`,
      button: "Switch to Plus",
    },
    alone: {
      line: (title: string, price: string) => `Or buy ${title} on its own for ${price}.`,
      button: "Buy it alone",
    },
  },

  codes: {
    empty: "Type a code first.",
    unknown: (code: string) => `${code} is not one of our codes.`,
    ended: (code: string) => `${code} has ended.`,
    courseOnly: (code: string) => `${code} is for single courses.`,
    plusOnly: (code: string) => `${code} is for Plus.`,
    yearlyOnly: (code: string) => `${code} is for the yearly plan.`,
    toYearly: "Switch to yearly",
  },

  steps: { you: "You", gift: "Gift", payment: "Payment", review: "Review" },

  you: {
    email: "Email",
    emailHint: "The receipt goes here.",
    name: "Full name",
    country: "Country",
    countryHint: "It sets the tax on the order.",
    plan: "Billing",
    monthly: "Monthly",
    monthlyLine: `$${plus.monthly} a month`,
    yearly: `Yearly, \u2212${yearlySaving}%`,
    yearlyLine: `$${plus.yearly} a year, two months free`,
    for: "Who it's for",
    me: "Me",
    meLine: "On your dashboard",
    gift: "A gift",
    giftLine: "By email, with a note",
    giftName: "Their name",
    giftEmail: "Their email",
    note: "A note with it",
    optional: "Optional",
    noteLeft: (n: number) => `${n} left`,
    sendOn: "Send it on",
    today: "Today",
    tomorrow: "Tomorrow",
  },

  payment: {
    with: "Pay with",
    card: "Card",
    cardLine: "Credit or debit",
    paypal: "PayPal",
    paypalLine: "Approve on PayPal",
    number: "Card number",
    expiry: "Expiry",
    expiryPlaceholder: "MM / YY",
    cvc: "Security code",
    cvcHint: (n: number) => (n === 4 ? "Front of the card" : "Back of the card"),
    holder: "Name on the card",
    save: "Save the card for next time",
    paypalNote: (amount: string) =>
      `After Review, a PayPal window asks you to approve ${amount}. Nothing leaves your account before you do.`,
    paypalTrial: (amount: string, day: string) =>
      `After Review, a PayPal window asks you to approve Plus. Nothing leaves your account before ${day}, and then ${amount}.`,
    trialNote: (day: string) => `We keep the card on file and charge nothing before ${day}.`,
  },

  review: {
    you: "You",
    payment: "Payment",
    gift: "Gift",
    edit: "Edit",
    editLabel: (what: string) => `Edit ${what.toLowerCase()}`,
    card: (brand: string, last: string) => `${brand} ending ${last}`,
    anyCard: (last: string) => `Card ending ${last}`,
    paypal: "PayPal",
    giftTo: (name: string) => `To ${name}`,
    giftWhen: (email: string, day: string) => `${email} · ${day}`,
    inFull: "In full today",
    inThreeLine: (amount: string) => `${amount} today, then twice more`,
    next: "What happens next",
    terms: "I accept the",
    termsLink: "terms of sale",
    termsTail: "and the refund policy.",
    termsError: "Tick the box to accept the terms of sale.",
  },

  // What the last step says will happen, in the order it happens.
  timeline: {
    lesson: "Lesson 1.1 opens on the next screen, with the tutor beside it.",
    cohort: (day: string) => `Your cohort meets on ${day}, with a live review every Thursday after.`,
    // in the words the course page's Details rows use for each credential
    certificate: (credential: string) =>
      ({
        "Professional Certificate": "Finish the project to earn the Professional Certificate.",
        Specialization: "Finish the project to earn the Specialization certificate.",
        Course: "Finish the project to earn the course certificate.",
      })[credential] ?? "Finish the project and its review goes on your record.",
    split: (b: string, c: string, each: string) => `${each} comes off the same card on ${b} and on ${c}.`,
    refund: (amount: string) => `Ask within 30 days and we refund all ${amount}.`,
    gift: (name: string, when: string) => `${name} gets the course and your note ${when}.`,
    trialToday: "Today: nothing to pay, and every course opens.",
    trialReminder: (day: string) => `${day}: a reminder email, two days ahead.`,
    trialCharge: (day: string, amount: string) => `${day}: the first ${amount}, unless you cancel.`,
    free: "Lesson 1.1 opens on the next screen. Nothing to pay, now or later.",
  },

  buttons: {
    next: "Continue",
    back: "Back",
    pay: (amount: string) => `Pay ${amount}`,
    payToday: (amount: string) => `Pay ${amount} today`,
    paypal: "Continue to PayPal",
    trial: "Start the free week",
    free: "Enroll for free",
    paying: "Paying",
    approving: "Waiting for PayPal",
    enrolling: "Enrolling",
    starting: "Starting your week",
  },

  errors: {
    email: "Enter an email like name@site.com.",
    name: "Enter your full name.",
    giftName: "Enter their name.",
    giftEmail: "Enter their email.",
    giftSame: "Use their address, not yours.",
    number: "Enter the 16 digits on the card.",
    numberAmex: "Enter the 15 digits on the card.",
    luhn: "One digit is off. Check the number.",
    expiry: "Enter the month and year, as MM / YY.",
    month: "Use a month from 01 to 12.",
    past: "This card has expired.",
    cvc: (n: number) => `Enter the ${n} digits.`,
    holder: "Enter the name printed on the card.",
    postal: (label: string, example: string) => `Enter a ${label.toLowerCase()} like ${example}.`,
  },

  done: {
    caps: { course: "Paid", free: "Enrolled", gift: "Gift booked", plus: "Trial started" },
    heading: {
      course: (first: string) => `You're in, ${first}.`,
      gift: (name: string, when: string) => (when === "today" ? `${name} has it now.` : `${name} gets it ${when}.`),
      plus: (first: string) => `Plus is on, ${first}.`,
    },
    // Two sentences each, the shorter first: from sm each takes a line of
    // its own, so an address of any length never leaves a word on a third.
    lede: {
      course: (email: string) => ["Lesson 1.1 is open now.", `We sent the receipt to ${email}.`],
      cohort: (email: string, day: string) => [`Your cohort starts on ${day}.`, `We sent the receipt to ${email}.`],
      gift: (name: string, to: string, email: string, now: boolean) => [
        now ? `The course and your note went to ${to}.` : `Nothing reaches ${name} before then.`,
        `We sent your receipt to ${email}.`,
      ],
      plus: (day: string) => ["Every course is open.", `Cancel before ${day} and we charge nothing.`],
      free: () => ["Lesson 1.1 is open now.", "You'll find the course on your dashboard as well."],
    },
    order: "Order",
    date: "Date",
    paid: "Paid",
    nextPayments: "Next payments",
    firstCharge: "First charge",
    start: "Start lesson 1.1",
    calendar: "Add the cohort to my calendar",
    download: "Download the receipt",
    dashboard: "Go to my learning",
    browse: "Browse courses",
    openPath: (path: string) => `Open the ${path.toLowerCase()} path`,
    course: "Back to the course",
  },

  missing: {
    title: "That course is not in the catalog",
    text: (slug: string) => `No course lives at /courses/${slug}. Pick it again from the catalog and the checkout opens on it.`,
    browse: "Browse courses",
    plus: `See ${plus.name}`,
  },

  summary: {
    show: "Show the order",
    hide: "Hide the order",
  },
};
