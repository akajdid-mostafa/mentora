// The whole course catalogue: every course the demo holds, the people who
// teach them, and the facet vocabulary the catalogue page filters on. The home
// page's shelf, the header's search and the course pages all read from here,
// so a course is edited once and turns up everywhere it is listed.
//
// Mock data, and nothing fetches it: swap this array for your own source and
// every list, count and filter on the site follows.

import { slugify } from "@/lib/utils";

export type Topic = "Data" | "Engineering" | "Design" | "Business";
export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Credential =
  | "Course"
  | "Specialization"
  | "Professional Certificate"
  | "Guided Project";
export type Language = "English" | "Spanish" | "Portuguese" | "French";

export type Course = {
  id: string;
  school: string;
  title: string;
  credential: Credential;
  topic: Topic;
  level: Level;
  /** How many weeks the course runs at the pace it was planned for. */
  weeks: number;
  /** The hours a week that pace asks of a learner. */
  hours: number;
  /** In US dollars; 0 is a free course. */
  price: number;
  rating: number;
  /** How many learners left the rating above. */
  reviews: number;
  learners: number;
  saves: number;
  badge?: "Bestseller" | "New" | "Free preview";
  /** A photograph of a desk set up for the work the course teaches. */
  image: string;
  /** Which edge the card's 4:3 crop holds to, for a frame whose subject sits
   *  off its centre. Unset, the crop is centred. */
  focus?: "top" | "bottom";
  instructor: string;
  /** The language the lessons are recorded in. */
  language: Language;
  /** How many languages the transcripts and quizzes are translated into. */
  subtitles: number;
  /** The video lessons in its syllabus (`syllabus/`), quizzes and the
   *  project left out. The course page counts the syllabus itself; this copy
   *  is for the cards and the compare table, which never load a syllabus, so
   *  it changes whenever a lesson is added or cut there. */
  lessons: number;
  /** When the course was published, for the Newest sort. */
  added: string;
  /** What the search reads besides the title, and the chips under "Skills you
   *  practice" on the course page, so they are cased the way they are
   *  written: SQL, CTEs, joins. */
  skills: string[];
  /** One line on what a learner can do once it is finished. */
  outcome: string;
};

// Unsplash, free licence, hotlinked until the packaging step decides whether
// the files ship. The id is the licence record. 1600 wide because the course
// page draws the same photograph as its poster, 736px across on a 2x screen.
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

export type Teacher = {
  name: string;
  /** The role and the field it is practised in, short enough for one line. */
  trade: string;
  /** A Lummi asset id, hotlinked and never shipped; `face()` in quotes.ts
   *  crops it. Each face was cast for the name it sits beside, and a teacher
   *  added without one is drawn as their initials rather than as a stranger. */
  portrait?: string;
};

export const teachers: Teacher[] = [
  { name: "Ana Reyes", trade: "Data lead · fintech", portrait: "QmeMZG4MBNSedvw1VKfvSaa4gtvjT5ZrQFj9UWxyFL7ubm" },
  { name: "Priya Raman", trade: "Quant · trading desk", portrait: "QmesJxZ78A5iXStQ9G1KXZNcwLo4SfwTc36uyM6SJbxfVy" },
  { name: "Tomás Oliveira", trade: "Staff engineer · payments", portrait: "QmRBa7eL2PP6veUJvczAYFSeuvU3J4yakpXJDaxppaJUbP" },
  { name: "Mara Lindqvist", trade: "Design director · systems", portrait: "QmSsEjkNCgfH2SxvNAW27fN9gG6LFGVpQMfn3utW1NNbHb" },
  { name: "Ibrahim Salah", trade: "ML engineer · logistics", portrait: "QmPC2k7DgPCgKNK8es6qb8zWMXYEuKjC4BM8cBF2TbGeEf" },
  { name: "Dan Whitfield", trade: "Analytics engineer · retail", portrait: "QmUeWrbnEAh7KhHPaRe3kbryUxudCbikYoEij8nXKyXsJ1" },
  { name: "Lucía Ferrer", trade: "Data scientist · public health", portrait: "QmTXXhoG3QraHWg8vjxjtafnTDtkzE9Hfz4kBiiraBUfqF" },
  { name: "Kofi Mensah", trade: "Platform engineer · streaming", portrait: "QmTLbv7AdpzCbLpo41mbwngpmv6Wve3qdA9C1BXp4XZec9" },
  { name: "Hana Sato", trade: "Front-end lead · e-commerce", portrait: "QmTqrNeH7TE2rr2TiQzWLqRUkeRPpUHsMrnBFxLxZo91B7" },
  { name: "Rafael Costa", trade: "Backend engineer · banking", portrait: "QmUA86WB3zMcCaPyPMWVaW6DeG6wCaa1zV5WHaMVbLXygp" },
  { name: "Noor Aziz", trade: "Type designer · studio", portrait: "QmcHuSqjXovbcuLyb3GMuaayPJ2R7Bp45pdGzdTe5EWuVr" },
  { name: "Inés Soler", trade: "Product designer · public sector", portrait: "QmRmQZYQ3dTWRcRSsm3FmukWakxtBHeK1YvfRSooSYBYi6" },
  { name: "Sam Okafor", trade: "Founder · two exits", portrait: "QmVe2N4Eu823xVBim6sKtvHsaGujfxBzF6G2GHSVoxKFxn" },
  { name: "Eva Brandt", trade: "Product lead · marketplaces", portrait: "QmeH2VuGrNsRdAV4r27EsnAHPiCd56YFxc65QHK8GDBU4f" },
  { name: "Claire Dubois", trade: "CFO · SaaS", portrait: "QmRM11Kb476ZMNdA9cJAW5Enrpn2BymNCguxeTFaUeRhRQ" },
];

export const teacherOf = (c: Course) =>
  teachers.find((t) => t.name === c.instructor) ?? { name: c.instructor, trade: "" };

/** What a teacher's courses add up to: every learner across them, and a
 *  rating weighted by how many learners left one. The home page's instructor
 *  cards and the course page both print these, so they are worked out here
 *  from the courses below rather than typed twice and left to drift. */
export function teacherStats(name: string) {
  const taught = courses.filter((c) => c.instructor === name);
  const reviews = taught.reduce((s, c) => s + c.reviews, 0);
  return {
    courses: taught,
    learners: taught.reduce((s, c) => s + c.learners, 0),
    rating: reviews
      ? Math.round((taught.reduce((s, c) => s + c.rating * c.reviews, 0) / reviews) * 10) / 10
      : 0,
  };
}

// How many courses each subject holds in the whole catalogue, for the places
// that describe the platform rather than list it: the proof strip, the header
// menu. The four add up to the 12,400 the home page states. The catalogue
// page counts the array below instead, because it shows every card it counts.
export const catalogue: Record<Topic, number> = {
  Data: 3480,
  Engineering: 4210,
  Design: 2050,
  Business: 2660,
};

// One hue per subject: the one thing colour on a catalogue can usefully say.
export const topicTint: Record<Topic, { lid: string; ink: string; dot: string }> = {
  Data: { lid: "bg-iris/15", ink: "text-iris-ink", dot: "bg-iris" },
  Engineering: { lid: "bg-sky/15", ink: "text-sky-ink", dot: "bg-sky" },
  Design: { lid: "bg-coral/15", ink: "text-coral-ink", dot: "bg-coral" },
  Business: { lid: "bg-sun/15", ink: "text-sun-ink", dot: "bg-sun" },
};

// The order is the catalogue's Recommended sort, and it mixes the subjects: no
// two of one subject side by side, and every four in a row carrying all four,
// so each row of the grid reads as a catalogue rather than a list sorted by
// subject. The home page's shelf is the first twelve, in the same order.
export const courses: Course[] = [
  {
    id: "c11", school: "Northline Institute", title: "Pricing what you build",
    credential: "Guided Project", topic: "Business", level: "Beginner",
    weeks: 2, hours: 3, price: 0, rating: 4.3, reviews: 412, learners: 6720, saves: 510,
    badge: "Free preview", image: photo("1750337684539-0c58aa348a8b"),
    instructor: "Priya Raman", language: "English", subtitles: 12, lessons: 9, added: "2026-06-02",
    skills: ["pricing", "customer calls", "margins"],
    outcome: "Set a first price from your costs, the alternatives and five customer calls.",
  },
  {
    id: "c9", school: "Meridian Lab", title: "Design systems in practice",
    credential: "Specialization", topic: "Design", level: "Advanced",
    weeks: 11, hours: 5, price: 139, rating: 4.6, reviews: 1020, learners: 11050, saves: 1180,
    image: photo("1681933859581-55594c9a09a0"),
    instructor: "Mara Lindqvist", language: "English", subtitles: 18, lessons: 22, added: "2025-11-18",
    skills: ["design tokens", "components", "documentation"],
    outcome: "Ship tokens, components and the documentation a team opens before it asks you.",
  },
  {
    id: "c4", school: "Rowan Engineering", title: "Python beyond scripts",
    credential: "Specialization", topic: "Engineering", level: "Intermediate",
    weeks: 10, hours: 6, price: 129, rating: 4.9, reviews: 8940, learners: 63700, saves: 5210,
    badge: "Bestseller", image: photo("1763568258289-47ada8efe7ea"),
    instructor: "Tomás Oliveira", language: "English", subtitles: 24, lessons: 23, added: "2025-03-10",
    skills: ["Python", "packaging", "type hints", "testing"],
    outcome: "Turn the script on your desktop into a package with tests, types and a command line.",
  },
  {
    id: "c2", school: "Harbor School of Data", title: "Statistics without the proofs",
    credential: "Course", topic: "Data", level: "Beginner",
    weeks: 5, hours: 4, price: 49, rating: 4.6, reviews: 2310, learners: 18900, saves: 1440,
    image: photo("1517090823101-30a5937ceb3c"),
    instructor: "Ibrahim Salah", language: "English", subtitles: 20, lessons: 13, added: "2025-09-22",
    skills: ["statistics", "regression", "confidence intervals"],
    outcome: "Read a p-value, an interval and a regression table without a derivation in sight.",
  },
  {
    id: "c5", school: "Rowan Engineering", title: "HTTP, and what a framework hides",
    credential: "Course", topic: "Engineering", level: "Advanced",
    weeks: 6, hours: 5, price: 79, rating: 4.5, reviews: 1180, learners: 12300, saves: 990,
    image: photo("1678799192691-69f9b3518d23"),
    instructor: "Kofi Mensah", language: "English", subtitles: 9, lessons: 16, added: "2025-12-04",
    skills: ["HTTP", "caching", "cookies", "web servers"],
    outcome: "Send requests by hand until caching, cookies and redirects hold no surprises.",
  },
  {
    id: "c12", school: "Meridian Lab", title: "Launching to your first hundred",
    credential: "Course", topic: "Business", level: "Beginner",
    weeks: 4, hours: 3, price: 69, rating: 4.7, reviews: 1610, learners: 14900, saves: 1290,
    badge: "New", image: photo("1778088442532-2a3ed3767931"),
    instructor: "Sam Okafor", language: "English", subtitles: 11, lessons: 12, added: "2026-08-26",
    skills: ["launch", "marketing", "early customers"],
    outcome: "Find, reach and keep the first hundred people who pay you.",
  },
  {
    id: "c3", school: "Northline Institute", title: "Dashboards people act on",
    credential: "Guided Project", topic: "Data", level: "Intermediate",
    weeks: 3, hours: 4, price: 0, rating: 4.7, reviews: 960, learners: 9410, saves: 880,
    badge: "Free preview", image: photo("1504608245011-62d9758c1bb9"),
    instructor: "Ana Reyes", language: "English", subtitles: 14, lessons: 9, added: "2026-02-11",
    skills: ["dashboards", "data visualization", "metrics"],
    outcome: "Build one dashboard for one decision, then cut every chart the decision does not need.",
  },
  {
    id: "c7", school: "Fieldhouse Design", title: "Interface fundamentals",
    credential: "Professional Certificate", topic: "Design", level: "Beginner",
    weeks: 9, hours: 6, price: 109, rating: 4.8, reviews: 3870, learners: 27600, saves: 2470,
    image: photo("1696336784186-9c1ce061b879"), focus: "bottom",
    instructor: "Mara Lindqvist", language: "English", subtitles: 26, lessons: 19, added: "2025-05-19",
    skills: ["layout", "typography", "color", "UI design"],
    outcome: "Lay out product screens with type and color, taught through forty critiques of real work.",
  },
  {
    id: "c10", school: "Harbor School of Data", title: "Financial modeling",
    credential: "Course", topic: "Business", level: "Intermediate",
    weeks: 6, hours: 5, price: 89, rating: 4.5, reviews: 2050, learners: 22400, saves: 1760,
    image: photo("1601573089550-7336112b8c62"),
    instructor: "Priya Raman", language: "English", subtitles: 16, lessons: 16, added: "2025-07-08",
    skills: ["spreadsheets", "forecasting", "three-statement model"],
    outcome: "Build a three-statement model from a blank sheet and defend every assumption in it.",
  },
  {
    id: "c6", school: "Meridian Lab", title: "Relational data modeling",
    credential: "Course", topic: "Engineering", level: "Advanced",
    weeks: 7, hours: 5, price: 99, rating: 4.7, reviews: 1490, learners: 15800, saves: 1310,
    image: photo("1643942556894-57626c4a9cd5"),
    instructor: "Tomás Oliveira", language: "English", subtitles: 12, lessons: 17, added: "2025-10-15",
    skills: ["SQL", "schema design", "migrations", "Postgres"],
    outcome: "Design tables from the questions a business asks, then migrate them without downtime.",
  },
  {
    id: "c8", school: "Fieldhouse Design", title: "Prototyping for engineers",
    credential: "Course", topic: "Design", level: "Intermediate",
    weeks: 4, hours: 4, price: 59, rating: 4.4, reviews: 690, learners: 8150, saves: 640,
    badge: "New", image: photo("1600658747056-eb00845297a5"),
    instructor: "Mara Lindqvist", language: "English", subtitles: 8, lessons: 12, added: "2026-09-02",
    skills: ["prototyping", "user testing", "wireframes"],
    outcome: "Test an idea on paper and in code before anyone plans a sprint around it.",
  },
  {
    id: "c1", school: "Northline Institute", title: "SQL for analysis",
    credential: "Professional Certificate", topic: "Data", level: "Beginner",
    weeks: 8, hours: 5, price: 89, rating: 4.8, reviews: 6120, learners: 41200, saves: 3120,
    badge: "Bestseller", image: photo("1601656269222-fda862e6dc7d"),
    instructor: "Ana Reyes", language: "English", subtitles: 41, lessons: 19, added: "2025-01-27",
    skills: ["SQL", "joins", "CTEs", "window functions"],
    outcome: "Write the joins, groupings and CTEs an analyst is asked for in the first week.",
  },
  {
    id: "c13", school: "Fieldhouse Design", title: "Product design foundations",
    credential: "Professional Certificate", topic: "Design", level: "Beginner",
    weeks: 10, hours: 6, price: 119, rating: 4.8, reviews: 4110, learners: 31200, saves: 2860,
    badge: "Bestseller", image: photo("1764737740462-2a310c7b2c39"),
    instructor: "Mara Lindqvist", language: "English", subtitles: 28, lessons: 21, added: "2025-02-17",
    skills: ["product design", "user research", "prototyping"],
    outcome: "Take a problem statement to a tested prototype over ten weeks of critiqued work.",
  },
  {
    id: "c14", school: "Harbor School of Data", title: "Python for data analysis",
    credential: "Professional Certificate", topic: "Data", level: "Beginner",
    weeks: 8, hours: 5, price: 99, rating: 4.8, reviews: 4720, learners: 36800, saves: 2690,
    image: photo("1742198914612-fc531719f1b4"),
    instructor: "Ana Reyes", language: "English", subtitles: 30, lessons: 20, added: "2025-04-14",
    skills: ["Python", "pandas", "data cleaning", "charts"],
    outcome: "Load, clean and chart real datasets in pandas, in a notebook you can hand to a manager.",
  },
  {
    id: "c15", school: "Rowan Engineering", title: "Git beyond commit and push",
    credential: "Guided Project", topic: "Engineering", level: "Beginner",
    weeks: 2, hours: 3, price: 0, rating: 4.7, reviews: 2760, learners: 24500, saves: 1980,
    badge: "Free preview", image: photo("1774853094610-89be6f1a7690"),
    instructor: "Hana Sato", language: "English", subtitles: 22, lessons: 7, added: "2025-09-01",
    skills: ["Git", "rebase", "version control"],
    outcome: "Rebase, bisect and recover lost work in a repository you break on purpose.",
  },
  {
    id: "c16", school: "Northline Institute", title: "Product management essentials",
    credential: "Professional Certificate", topic: "Business", level: "Beginner",
    weeks: 10, hours: 6, price: 119, rating: 4.6, reviews: 3340, learners: 28700, saves: 2330,
    image: photo("1621348016212-535c972093db"),
    instructor: "Eva Brandt", language: "English", subtitles: 24, lessons: 21, added: "2025-06-09",
    skills: ["product management", "roadmaps", "prioritization"],
    outcome: "Write the brief, order the roadmap and run the review a product team expects.",
  },
  {
    id: "c17", school: "Rowan Engineering", title: "Python testing with pytest",
    credential: "Course", topic: "Engineering", level: "Intermediate",
    weeks: 4, hours: 4, price: 59, rating: 4.8, reviews: 2030, learners: 17400, saves: 1390,
    image: photo("1631098985305-d57413e94950"),
    instructor: "Tomás Oliveira", language: "English", subtitles: 14, lessons: 13, added: "2025-06-30",
    skills: ["Python", "pytest", "fixtures", "mocking"],
    outcome: "Write fixtures, parametrized tests and mocks for code that talks to a database.",
  },
  {
    id: "c18", school: "Fieldhouse Design", title: "Typography for interfaces",
    credential: "Course", topic: "Design", level: "Intermediate",
    weeks: 5, hours: 3, price: 69, rating: 4.9, reviews: 1090, learners: 9120, saves: 1070,
    image: photo("1574625370413-a04a06f08d77"),
    instructor: "Noor Aziz", language: "English", subtitles: 9, lessons: 13, added: "2025-11-03",
    skills: ["typography", "type scale", "font pairing"],
    outcome: "Choose, pair and size type for screens, from a 12px label to a 60px headline.",
  },
  {
    id: "c19", school: "Northline Institute", title: "A/B tests you can defend",
    credential: "Course", topic: "Data", level: "Intermediate",
    weeks: 5, hours: 3, price: 69, rating: 4.8, reviews: 540, learners: 8720, saves: 760,
    badge: "New", image: photo("1663979747290-57d502e9b63f"),
    instructor: "Ibrahim Salah", language: "English", subtitles: 6, lessons: 13, added: "2026-09-09",
    skills: ["experiments", "A/B testing", "statistics"],
    outcome: "Size a test, fix the metric before launch and read the result without fooling yourself.",
  },
  {
    id: "c20", school: "Northline Institute", title: "Negotiating your offer",
    credential: "Guided Project", topic: "Business", level: "Beginner",
    weeks: 2, hours: 2, price: 0, rating: 4.8, reviews: 2610, learners: 21300, saves: 2040,
    badge: "Free preview", image: photo("1635185481315-d8261fe0536b"),
    instructor: "Sam Okafor", language: "English", subtitles: 20, lessons: 6, added: "2025-12-01",
    skills: ["negotiation", "salary", "job offers"],
    outcome: "Prepare the numbers, the script and your walk-away point before the call.",
  },
  {
    id: "c21", school: "Rowan Engineering", title: "Machine learning systems",
    credential: "Specialization", topic: "Data", level: "Advanced",
    weeks: 12, hours: 7, price: 149, rating: 4.7, reviews: 2480, learners: 19300, saves: 2210,
    image: photo("1615076754563-9ec1328d47bf"),
    instructor: "Ibrahim Salah", language: "English", subtitles: 18, lessons: 24, added: "2025-08-05",
    skills: ["machine learning", "MLOps", "model monitoring"],
    outcome: "Train, ship and monitor a model, and spend most of the effort on the data around it.",
  },
  {
    id: "c22", school: "Harbor School of Data", title: "Python for finance",
    credential: "Specialization", topic: "Business", level: "Intermediate",
    weeks: 8, hours: 5, price: 119, rating: 4.6, reviews: 1720, learners: 16200, saves: 1330,
    image: photo("1456291927223-1689b7ef0a7b"),
    instructor: "Priya Raman", language: "English", subtitles: 14, lessons: 18, added: "2025-08-25",
    skills: ["Python", "portfolio", "risk", "finance"],
    outcome: "Model returns, risk and a portfolio in Python, from price data to a finished report.",
  },
  {
    id: "c23", school: "Rowan Engineering", title: "Accessible front ends",
    credential: "Course", topic: "Engineering", level: "Intermediate",
    weeks: 5, hours: 4, price: 79, rating: 4.8, reviews: 1310, learners: 11700, saves: 1240,
    image: photo("1777896193454-8b4863264f0b"),
    instructor: "Hana Sato", language: "English", subtitles: 16, lessons: 13, added: "2026-04-07",
    skills: ["accessibility", "ARIA", "keyboard", "screen readers"],
    outcome: "Build forms, menus and dialogs that work with a keyboard and a screen reader.",
  },
  {
    id: "c24", school: "Fieldhouse Design", title: "Design research interviews",
    credential: "Guided Project", topic: "Design", level: "Beginner",
    weeks: 3, hours: 3, price: 0, rating: 4.6, reviews: 730, learners: 8410, saves: 700,
    badge: "Free preview", image: photo("1507925921958-8a62f3d1a50d"),
    instructor: "Mara Lindqvist", language: "English", subtitles: 12, lessons: 10, added: "2026-03-30",
    skills: ["user research", "interviews", "synthesis"],
    outcome: "Plan, run and synthesize five user interviews in three weeks.",
  },
  {
    id: "c25", school: "Meridian Lab", title: "Unit economics for founders",
    credential: "Course", topic: "Business", level: "Intermediate",
    weeks: 4, hours: 3, price: 69, rating: 4.7, reviews: 980, learners: 9640, saves: 870,
    image: photo("1573849655506-e71bd1e825a9"),
    instructor: "Sam Okafor", language: "English", subtitles: 10, lessons: 12, added: "2026-04-21",
    skills: ["unit economics", "CAC", "LTV", "margins"],
    outcome: "Work out what one customer costs and earns you, and what has to change for it to pay.",
  },
  {
    id: "c26", school: "Meridian Lab", title: "TypeScript for backend services",
    credential: "Specialization", topic: "Engineering", level: "Advanced",
    weeks: 9, hours: 6, price: 129, rating: 4.6, reviews: 1420, learners: 13800, saves: 1120,
    image: photo("1639413665566-2f75adf7b7ca"),
    instructor: "Kofi Mensah", language: "English", subtitles: 12, lessons: 19, added: "2026-02-24",
    skills: ["TypeScript", "Node", "API design", "validation"],
    outcome: "Type a Node service end to end, from the request schema to the database row.",
  },
  {
    id: "c27", school: "Harbor School of Data", title: "Automate reporting with Python",
    credential: "Course", topic: "Data", level: "Intermediate",
    weeks: 4, hours: 4, price: 59, rating: 4.7, reviews: 1240, learners: 10900, saves: 930,
    image: photo("1586244346603-b97b4fdb87e4"),
    instructor: "Dan Whitfield", language: "English", subtitles: 12, lessons: 12, added: "2026-03-18",
    skills: ["Python", "automation", "reporting", "spreadsheets"],
    outcome: "Replace the Monday spreadsheet with a script that builds it and sends it for you.",
  },
  {
    id: "c28", school: "Meridian Lab", title: "Sketching interfaces on paper",
    credential: "Guided Project", topic: "Design", level: "Beginner",
    weeks: 2, hours: 2, price: 19, rating: 4.5, reviews: 280, learners: 4870, saves: 360,
    badge: "New", image: photo("1776762249708-31d7e1579748"),
    instructor: "Noor Aziz", language: "English", subtitles: 6, lessons: 6, added: "2026-09-16",
    skills: ["sketching", "wireframes", "ideation"],
    outcome: "Draw twenty screens in an afternoon and keep the one worth building.",
  },
  {
    id: "c29", school: "Northline Institute", title: "Análisis de datos con Python",
    credential: "Course", topic: "Data", level: "Beginner",
    weeks: 6, hours: 4, price: 49, rating: 4.8, reviews: 1380, learners: 12600, saves: 1050,
    image: photo("1632937145991-91620be68319"),
    instructor: "Lucía Ferrer", language: "Spanish", subtitles: 7, lessons: 16, added: "2025-10-27",
    skills: ["Python", "pandas", "análisis de datos"],
    outcome: "Limpia, analiza y grafica datos reales con pandas, de la hoja de cálculo al informe.",
  },
  {
    id: "c30", school: "Meridian Lab", title: "Postgres performance",
    credential: "Course", topic: "Engineering", level: "Advanced",
    weeks: 6, hours: 5, price: 99, rating: 4.9, reviews: 1160, learners: 9860, saves: 1020,
    image: photo("1594636797501-ef436e157819"),
    instructor: "Tomás Oliveira", language: "English", subtitles: 10, lessons: 16, added: "2025-12-15",
    skills: ["Postgres", "SQL", "indexes", "query plans"],
    outcome: "Read a query plan, pick the right index and fix the five slow queries every app ships with.",
  },
  {
    id: "c31", school: "Meridian Lab", title: "Modélisation financière pour startups",
    credential: "Course", topic: "Business", level: "Intermediate",
    weeks: 6, hours: 5, price: 79, rating: 4.5, reviews: 450, learners: 4960, saves: 390,
    image: photo("1487611459768-bd414656ea10"),
    instructor: "Claire Dubois", language: "French", subtitles: 3, lessons: 15, added: "2026-05-25",
    skills: ["modélisation financière", "levée de fonds", "tableur"],
    outcome: "Construisez un modèle financier sur trois ans et défendez chaque hypothèse devant un investisseur.",
  },
  {
    id: "c32", school: "Fieldhouse Design", title: "Diseño de interfaces accesibles",
    credential: "Course", topic: "Design", level: "Intermediate",
    weeks: 6, hours: 4, price: 59, rating: 4.7, reviews: 690, learners: 6540, saves: 530,
    image: photo("1782290547020-ee999526f0f3"),
    instructor: "Inés Soler", language: "Spanish", subtitles: 5, lessons: 15, added: "2026-02-02",
    skills: ["accesibilidad", "contraste", "diseño de interfaces"],
    outcome: "Diseña pantallas que funcionan con lector de pantalla, con teclado y con buen contraste.",
  },
  {
    id: "c33", school: "Northline Institute", title: "Pandas and NumPy in practice",
    credential: "Guided Project", topic: "Data", level: "Intermediate",
    weeks: 2, hours: 4, price: 29, rating: 4.6, reviews: 610, learners: 7340, saves: 520,
    image: photo("1499673610122-01c7122c5dcb"),
    instructor: "Ana Reyes", language: "English", subtitles: 10, lessons: 8, added: "2026-05-06",
    skills: ["pandas", "NumPy", "Python", "data wrangling"],
    outcome: "Two weeks, one messy dataset, and every reshaping move the project needs.",
  },
  {
    id: "c34", school: "Rowan Engineering", title: "Engenharia de APIs na prática",
    credential: "Course", topic: "Engineering", level: "Intermediate",
    weeks: 6, hours: 5, price: 69, rating: 4.6, reviews: 820, learners: 7980, saves: 590,
    image: photo("1688703673361-b83c4c3a4211"),
    instructor: "Rafael Costa", language: "Portuguese", subtitles: 4, lessons: 15, added: "2026-01-12",
    skills: ["APIs", "REST", "versionamento", "documentação"],
    outcome: "Projete, versione e documente APIs que outros times usam sem precisar de reunião.",
  },
  {
    id: "c35", school: "Harbor School of Data", title: "Forecasting with time series",
    credential: "Course", topic: "Data", level: "Advanced",
    weeks: 6, hours: 5, price: 89, rating: 4.5, reviews: 590, learners: 6150, saves: 480,
    image: photo("1543286386-713bdd548da4"),
    instructor: "Dan Whitfield", language: "English", subtitles: 9, lessons: 15, added: "2026-01-20",
    skills: ["forecasting", "time series", "seasonality"],
    outcome: "Forecast demand with seasonality, holidays and an honest interval around every number.",
  },
  {
    id: "c36", school: "Meridian Lab", title: "Cloud costs you can read",
    credential: "Course", topic: "Engineering", level: "Intermediate",
    weeks: 4, hours: 3, price: 69, rating: 4.4, reviews: 350, learners: 5230, saves: 410,
    badge: "New", image: photo("1648481536362-809123c0671b"),
    instructor: "Kofi Mensah", language: "English", subtitles: 5, lessons: 12, added: "2026-08-12",
    skills: ["cloud", "FinOps", "billing", "infrastructure"],
    outcome: "Trace a monthly bill back to the three services behind it, then cut it by a third.",
  },
];

export const courseById = (id: string) => courses.find((c) => c.id === id);
export const courseSlug = (c: Course) => slugify(c.title);
export const courseHref = (c: Course) => `/courses/${courseSlug(c)}`;
/** Lesson one of a course in the lesson player, where every "lesson one"
 *  button on the site lands. The player's own address, `playerHref`, opens
 *  on wherever the learner stopped instead. */
export const playerHref = (c: Course) => `/learn/${courseSlug(c)}`;
export const lessonHref = (c: Course) => `${playerHref(c)}?lesson=1.1`;
export const teacherHref = (name: string) => `/instructors/${slugify(name)}`;

export const priceLabel = (p: number) => (p === 0 ? "Free" : `$${p}`);

// Saves read as a social count does, 3.1K rather than 3,120.
export const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
export const figure = (n: number) => n.toLocaleString("en-US");

/** "4 h 57 min", or "38 min" under an hour. */
export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

// The facet vocabulary. Every group the catalogue page filters on is listed
// here in the order its controls are drawn, so a new option is one entry and
// the filter row, the dialog and their counts all pick it up.
export const topics: Topic[] = ["Data", "Engineering", "Design", "Business"];
export const levels: Level[] = ["Beginner", "Intermediate", "Advanced"];
export const durations = ["Under 5 weeks", "5 to 8 weeks", "Over 8 weeks"] as const;
export type Duration = (typeof durations)[number];
export const languages: Language[] = ["English", "Spanish", "Portuguese", "French"];
export const credentials: Credential[] = [
  "Course",
  "Specialization",
  "Professional Certificate",
  "Guided Project",
];
/** Minimum ratings the Rating filter offers, highest first. */
export const ratings = [4.8, 4.5, 4] as const;
/** The price slider runs from free to this, in the steps below. */
export const PRICE_CEILING = 160;
export const PRICE_STEP = 10;

export const inDuration = (weeks: number, d: Duration) =>
  d === "Under 5 weeks"
    ? weeks < 5
    : d === "5 to 8 weeks"
      ? weeks >= 5 && weeks <= 8
      : weeks > 8;

// What a search reads: the title, who teaches it, where, the subject, the
// credential and the skills. Every word typed has to land somewhere, so
// "python ana" finds Ana Reyes's Python courses and nobody else's.
export const searchText = (c: Course) =>
  [c.title, c.instructor, c.school, c.topic, c.credential, c.language, ...c.skills]
    .join(" ")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

export function matchesQuery(c: Course, q: string) {
  const words = q
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return true;
  const text = searchText(c);
  return words.every((w) => text.includes(w));
}
