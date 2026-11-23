// Every string the sign-in and the sign-up print, so a buyer rewording the
// two pages edits one file. Addresses and names are the demo's, from demo.ts.

export const authCopy = {
  photoAlt:
    "A small studio seen through a fluted-glass door: a whiteboard with colour swatches on a peach wall, a high table and stools",
  providers: {
    google: { label: "Google", aria: "Continue with Google" },
    apple: { label: "Apple", aria: "Continue with Apple" },
    busy: (name: string) => `Opening ${name}…`,
  },
  or: "or with email",
  fields: {
    email: "Email",
    password: "Password",
    show: "Show",
    hide: "Hide",
    showAria: "Show password",
    hideAria: "Hide password",
    caps: "Caps Lock is on",
  },
  rules: {
    length: "8+ characters",
    mix: "A digit or symbol",
    own: "Not your name",
  },
  strength: ["", "Weak", "Fair", "Good", "Strong"],
  strengthLabel: "Strength",
  legal: {
    before: "By continuing you agree to the",
    terms: "Terms",
    and: "and the",
    privacy: "Privacy policy",
  },
  errors: {
    email: "Enter an email like name@example.com",
    password: "Enter your password",
    short: "Passwords here are 8 characters or more",
    name: "Enter the name for your certificates",
    rules: "Meet the three rules below",
    code: "Enter all six digits",
    wrongCode: "That code does not match the latest email",
    team: (domain: string) => `No team signs in with ${domain}`,
    idea: "Say what the course teaches, in a line",
    terms: "Tick this to create your account",
  },
};

export const signInCopy = {
  meta: {
    title: "Sign in",
    description:
      "Sign in to Mentora and pick up your courses, your path and the tutor where you left them.",
  },
  signin: {
    caps: "[ Sign in ]",
    title: "Your lesson is where you left it",
    keep: "Keep me signed in",
    forgot: "Forgot password?",
    submit: "Sign in",
    busy: "Signing in…",
    sso: "Use your company’s single sign-on",
    newHere: "New to Mentora?",
    create: "Create an account",
  },
  sso: {
    caps: "[ Single sign-on ]",
    title: "Sign in through your team",
    lede: "Mentora for Teams hands sign-in to your company. Enter your work email and we find it.",
    field: "Work email",
    find: "Find my team",
    finding: "Looking for your team…",
    found: "Found your team",
    via: (count: string) => `Signs in with Okta · ${count} learners`,
    go: (team: string) => `Continue to ${team}`,
    going: "Redirecting…",
    back: "Back to sign in",
  },
  reset: {
    back: "Back to sign in",
    email: {
      caps: "[ Reset · 1 of 3 ]",
      title: "Reset your password",
      lede: "Enter the email on your account. We send a six-digit code that works for 15 minutes.",
      submit: "Send the code",
      busy: "Sending…",
    },
    code: {
      caps: "[ Reset · 2 of 3 ]",
      title: "Check your inbox",
      lede: (email: string) =>
        `We sent a six-digit code to ${email}. It works for 15 minutes.`,
      field: "Six-digit code",
      digit: (i: number) => `Digit ${i} of 6`,
      hint: (code: string) => `This demo sends ${code}.`,
      resend: "Send a new code",
      wait: (s: string) => `New code in ${s}`,
      sent: "A new code is on its way.",
      submit: "Check the code",
      busy: "Checking…",
    },
    fresh: {
      caps: "[ Reset · 3 of 3 ]",
      title: "Choose a new password",
      lede: "Saving it signs you out on every other device, so a lost laptop stops being a problem.",
      field: "New password",
      submit: "Save and sign in",
      busy: "Saving…",
    },
    done: {
      caps: "[ Done ]",
      title: "Password changed",
      lede: "Every other device is signed out. This one stays in, and your place in each course is kept.",
      go: "Go to My learning",
    },
  },
  photo: {
    live: (n: string) => `${n} learners in a lesson right now`,
    browse: "Browse courses",
    tutor: "AI tutor",
    lesson: "SQL for analysis · Lesson 4.2",
    question: "Why does my LEFT JOIN lose rows?",
    quoteFrom: "Lesson 4.2 at 04:12",
    quote: "“A WHERE on the right table runs after the join…”",
    answer: "So it throws out the unmatched rows. Move that condition into ON and they come back.",
    sent: "9:41 PM",
    read: "Read",
  },
};

export const signUpCopy = {
  meta: {
    title: "Create an account",
    description:
      "Make a Mentora account in three steps: your details, what you are here to do, and the hours you have a week.",
  },
  steps: ["Account", "Goal", "Your week"] as const,
  account: {
    title: "Start with an account",
    lede: "Three steps, and you finish with a plan.",
    name: "Full name",
  },
  goal: {
    title: "What are you here to do?",
    lede: "Learners get a path. Instructors get the studio.",
    role: "I want to",
    learn: { title: "Learn", line: "A path to a new job" },
    teach: { title: "Teach", line: "A course of your own" },
    path: "Where are you headed?",
    pathLine: (courses: number, hours: number) =>
      `${courses}\u00a0courses · ${hours}\u00a0h`,
    field: "What you would teach",
    fieldLine: (n: number) => `${n}\u00a0courses live`,
    idea: "Your course, in one line",
    ideaAside: "You can change it",
  },
  week: {
    title: "Plan your week",
    lede: "An honest number beats an ambitious one.",
    hours: "Hours you have a week",
    value: (h: number) => `${h} ${h === 1 ? "hour" : "hours"}`,
    learnCaps: "Your path, at this pace",
    learnTitle: (date: string) => `Done by ${date}`,
    learnLine: (hours: number, weeks: number) =>
      `${hours} hours over ${weeks} weeks`,
    teachCaps: "Your first draft",
    teachTitle: (date: string) => `Ready by ${date}`,
    teachLine: "A six-chapter course takes about 30 hours to record and edit.",
    notes: "Send me a Monday note on how the week went",
    termsBefore: "I agree to the",
  },
  buttons: {
    next: "Continue",
    back: "Back",
    create: "Create account",
    busy: "Creating your account…",
  },
  have: "Already have an account?",
  signIn: "Sign in",
  done: {
    caps: "[ Account ready ]",
    title: (first: string) => `Welcome, ${first}`,
    learn: (path: string, pace: number) =>
      `Your ${path} path is saved at ${pace} hours a week, and lesson one is open.`,
    teach:
      "Your studio is open, with a first outline waiting for the line you wrote.",
    startPath: "Start the path",
    openStudio: "Open the studio",
    dashboard: "Go to My learning",
    payouts: "See how payouts work",
  },
  preview: {
    caption: [
      "Your name signs your notes and your certificates.",
      "The tutor orders five courses so each one pays off.",
      "Weeks count from today. Change them in My learning.",
    ],
    teachCaption: [
      "Your name signs your notes and your certificates.",
      "A course stays a draft until you publish it.",
      "Weeks count from today. Change them in the studio.",
    ],
    labels: ["Your name", "Your path", "Your pace"],
    teachLabels: ["Your name", "Your course", "Your pace"],
    // The pass the account opens with, read as a ticket: from where the
    // learner is to where the path ends, in three-letter codes as a
    // departures board sets them.
    issued: (date: string) => `Issued ${date}`,
    confirmed: "Confirmed",
    notYet: "Not answered yet",
    from: "From",
    to: "To",
    fromCode: "NOW",
    fromName: "Where you are",
    goalCodes: { analyst: "DTA", backend: "BKE", design: "PDS", founder: "FDR" } as Record<string, string>,
    topicCodes: { Data: "DAT", Engineering: "ENG", Design: "DSN", Business: "BIZ" } as Record<string, string>,
    pending: "Pick a goal",
    teachTo: (topic: string) => `${topic} instructor`,
    learner: "Learner",
    instructor: "Instructor",
    pace: "Pace",
    paceValue: (h: number) => `${h} h a week`,
    arrives: "Arrives",
    draftBy: "Draft by",
    legsPending: "Five courses, once you pick a goal",
    legsFirst: (title: string) => `${title} first`,
    chapters: "Six chapters, drafted in the studio",
  },
};
