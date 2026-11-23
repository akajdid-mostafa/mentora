// Who each teacher is past the card: the city they work from, what learning
// from them is like, the job they hold and the two before it. The profile page
// reads this beside records.ts (what Mentora checked) and detail.ts (the three
// lines the course page prints in the teacher's own voice), and the three are
// written to agree: a year, a job or a number in one is the same in the others.
//
// Mock data, written per person. A buyer swapping in their own people swaps
// these sentences and nothing else.

export type Job = {
  /** The year the job began. */
  from: number;
  /** The year it ended. The last job has none: it is the one held now. */
  to?: number;
  role: string;
  /** Where, said the way the badge record says it: "a payments company". */
  place: string;
};

export type Profile = {
  city: string;
  /** The line under the name: what learning from them is like. Fitted, as
   *  the bio is, to the last-line rule at 1280. */
  lede: string;
  /** The about section's lede: the job held now, one thing done in it, and
   *  the road there. Fitted to the last-line rule at 1280. */
  bio: string;
  /** Oldest first. */
  jobs: [Job, Job, Job];
};

export const profiles: Record<string, Profile> = {
  "Ana Reyes": {
    city: "Mexico City",
    lede: "Every lesson starts from a question a manager asked Ana's team, and ends with a query or a chart you write yourself.",
    bio: "Ana leads analytics at a payments company, where her fraud dashboard opens every morning meeting. She spent three years at a retail bank and four at an insurer before that.",
    jobs: [
      { from: 2015, to: 2018, role: "Analyst", place: "a retail bank" },
      { from: 2018, to: 2022, role: "Senior analyst", place: "an insurer" },
      { from: 2022, role: "Data lead", place: "a payments company" },
    ],
  },
  "Priya Raman": {
    city: "London",
    lede: "Priya reviews every model the way a trading desk does, cell by cell, and the courses teach you to build ones that pass.",
    bio: "Priya has built risk models on a trading desk for eight years, and three start\u2011ups she advises raised money on them. She began at an asset manager and spent two years on a bank's risk team.",
    jobs: [
      { from: 2014, to: 2016, role: "Analyst", place: "an asset manager" },
      { from: 2016, to: 2018, role: "Risk analyst", place: "a bank" },
      { from: 2018, role: "Quant", place: "a trading desk" },
    ],
  },
  "Tomás Oliveira": {
    city: "Lisbon",
    lede: "The courses grew out of the code reviews Tomás runs each week at work, and every exercise breaks on purpose.",
    bio: "Tomás builds payments software for four million merchants, and moved its ledger to Postgres with zero downtime. He came to payments from a travel booking site and a logistics start\u2011up.",
    jobs: [
      { from: 2013, to: 2016, role: "Developer", place: "a travel booking site" },
      { from: 2016, to: 2020, role: "Backend engineer", place: "a logistics start\u2011up" },
      { from: 2020, role: "Staff engineer", place: "a payments company" },
    ],
  },
  "Mara Lindqvist": {
    city: "Stockholm",
    lede: "Mara teaches design the way a design system runs: small parts, written rules, and notes on your own work every week.",
    bio: "Mara runs the design system eleven product teams use, and it halved their time from sketch to screen. She spent four years at a digital agency and five on a banking app before that.",
    jobs: [
      { from: 2011, to: 2015, role: "Designer", place: "a digital agency" },
      { from: 2015, to: 2020, role: "Product designer", place: "a banking app" },
      { from: 2020, role: "Design director", place: "a software company" },
    ],
  },
  "Ibrahim Salah": {
    city: "Hamburg",
    lede: "Ibrahim teaches the statistics that tell noise from news, on data from trucks, depots and delivery routes.",
    bio: "Ibrahim builds demand and routing models for a logistics firm, and one of them cut its empty truck miles by a fifth. Five years at a freight forwarder and five at a delivery start\u2011up came first.",
    jobs: [
      { from: 2011, to: 2016, role: "Operations analyst", place: "a freight forwarder" },
      { from: 2016, to: 2021, role: "Data scientist", place: "a delivery start\u2011up" },
      { from: 2021, role: "ML engineer", place: "a logistics firm" },
    ],
  },
  "Dan Whitfield": {
    city: "Leeds",
    lede: "Dan has automated forty reports at work, and each course has you automate one a week the same way.",
    bio: "Dan runs the reporting for a retailer with four hundred UK stores. He started out at a supermarket chain, pasting sales figures into a spreadsheet every Monday, the job his first course retires.",
    jobs: [
      { from: 2017, to: 2019, role: "Reporting analyst", place: "a supermarket chain" },
      { from: 2019, to: 2023, role: "Analyst", place: "a fashion retailer" },
      { from: 2023, role: "Analytics engineer", place: "a retailer with 400 stores" },
    ],
  },
  "Lucía Ferrer": {
    city: "Valencia",
    lede: "Lucía teaches data analysis in Spanish, with the hospital and vaccination data a health service runs on.",
    bio: "Lucía analyzes hospital and vaccination data for a regional health service, where her dashboards planned the vaccine rollout. She joined from a university hospital's research team in 2020.",
    jobs: [
      { from: 2018, to: 2020, role: "Research assistant", place: "a university hospital" },
      { from: 2020, to: 2023, role: "Analyst", place: "a regional health service" },
      { from: 2023, role: "Data scientist", place: "a regional health service" },
    ],
  },
  "Kofi Mensah": {
    city: "Paris",
    lede: "Kofi teaches the layers under the frameworks: HTTP, types, and the cloud bill that lands at the end of each month.",
    bio: "Kofi runs the platform team at a video streaming service, and cut its cloud bill by a third in one year. He learned those layers on call, at a hosting company and then at a travel site.",
    jobs: [
      { from: 2014, to: 2017, role: "Systems administrator", place: "a hosting company" },
      { from: 2017, to: 2021, role: "Site reliability engineer", place: "a travel site" },
      { from: 2021, role: "Platform engineer", place: "a video streaming service" },
    ],
  },
  "Hana Sato": {
    city: "Tokyo",
    lede: "Every lesson fixes a real bug from the forty checkout flows Hana has audited, from keyboard traps to missing labels.",
    bio: "Hana leads front\u2011end development at an online grocer and has audited more than forty checkout flows. Six years of front ends at a web agency and a travel booking site came before.",
    jobs: [
      { from: 2016, to: 2019, role: "Front\u2011end developer", place: "a web agency" },
      { from: 2019, to: 2022, role: "Senior developer", place: "a travel booking site" },
      { from: 2022, role: "Front\u2011end lead", place: "an online grocer" },
    ],
  },
  "Rafael Costa": {
    city: "São Paulo",
    lede: "Rafael teaches API design in Portuguese, with the versioning rules forty teams follow at a bank in São Paulo.",
    bio: "Rafael designs the internal APIs of a bank, and forty teams follow the versioning rules he wrote. He built his first payment APIs at a telecom company and then at a fintech start\u2011up.",
    jobs: [
      { from: 2015, to: 2018, role: "Developer", place: "a telecom company" },
      { from: 2018, to: 2021, role: "Backend engineer", place: "a fintech start\u2011up" },
      { from: 2021, role: "Backend engineer", place: "a bank" },
    ],
  },
  "Noor Aziz": {
    city: "Lahore",
    lede: "Noor draws typefaces for a living, and every lesson starts with a screen of text set at the size people read it.",
    bio: "Noor draws typefaces at an independent foundry, and three national papers set their headlines in them. Before type came four years at a print studio and four years on a news app.",
    jobs: [
      { from: 2012, to: 2016, role: "Designer", place: "a print studio" },
      { from: 2016, to: 2020, role: "Interface designer", place: "a news app" },
      { from: 2020, role: "Type designer", place: "an independent foundry" },
    ],
  },
  "Inés Soler": {
    city: "Santiago",
    lede: "Inés teaches accessible interface design in Spanish, on screens from the public services she has redesigned.",
    bio: "Inés designs public services for a regional government and has redesigned sixty procedures since 2019. She started at a design consultancy, then spent three years at a city council.",
    jobs: [
      { from: 2017, to: 2019, role: "UX designer", place: "a design consultancy" },
      { from: 2019, to: 2022, role: "Service designer", place: "a city council" },
      { from: 2022, role: "Product designer", place: "a regional government" },
    ],
  },
  "Sam Okafor": {
    city: "Lagos",
    lede: "Sam teaches from the spreadsheets behind two companies he built and sold, with the mistakes left in.",
    bio: "Sam founded two software companies and sold both, the second at ten thousand customers. He now advises first\u2011year founders, and the questions they bring him became his courses.",
    jobs: [
      { from: 2014, to: 2019, role: "Founder", place: "a payroll software company" },
      { from: 2019, to: 2024, role: "Founder", place: "a booking software company" },
      { from: 2024, role: "Adviser", place: "founders in their first year" },
    ],
  },
  "Eva Brandt": {
    city: "Warsaw",
    lede: "Eva teaches the documents a product manager is judged on, from two marketplaces she ran product for.",
    bio: "Eva leads product at a vacation rental marketplace, after growing a used\u2011car marketplace from one city to eleven. She learned the job over four years of writing specs at a job board.",
    jobs: [
      { from: 2013, to: 2017, role: "Product manager", place: "a job board" },
      { from: 2017, to: 2022, role: "Head of product", place: "a used\u2011car marketplace" },
      { from: 2022, role: "Product lead", place: "a vacation rental marketplace" },
    ],
  },
  "Claire Dubois": {
    city: "Lyon",
    lede: "Claire teaches financial modeling in French, with the questions investors asked across four funding rounds.",
    bio: "Claire runs finance at a software company in Lyon and has raised four rounds, the last in six weeks. She audited start\u2011ups for five years before she crossed to the other side of the table.",
    jobs: [
      { from: 2010, to: 2015, role: "Auditor", place: "an accounting firm" },
      { from: 2015, to: 2020, role: "Finance manager", place: "an online retailer" },
      { from: 2020, role: "CFO", place: "a software company" },
    ],
  },
};
