// What the Business courses teach, module by module.

import type { Draft } from "@/components/course/syllabus/types";

export const business: Record<string, Draft> = {
  c11: {
    about:
      "If you are about to charge for the first time, or to raise a price you once guessed at, spend these two weeks on it first. The course is free, because a wrong price costs a business more than any course does.",
    project: "Set a first price and test it on five customer calls",
    modules: [
      {
        title: "Floors and ceilings",
        lessons: [
          "Your cost floor",
          "What the alternatives cost",
          "Value in the customer's own numbers",
        ],
      },
      {
        title: "Talking to customers",
        lessons: [
          "Booking five calls",
          "Asking about budget without the awkward pause",
          "Reading the answers",
        ],
      },
      {
        title: "Setting the price",
        lessons: [
          "Tiers and anchors",
          "Discounts you can live with",
          "Announcing a price",
        ],
      },
    ],
  },
  c12: {
    about:
      "For founders with a product that works and no customers to show for it yet. The four weeks follow the plan Sam would run again on a third company, from the first customer you can name to that customer's first referral.",
    project: "Run a four-week launch plan and report on your first paying customers",
    modules: [
      {
        title: "Who the first hundred are",
        lessons: [
          "A customer you can name",
          "Where they already gather",
          "A one-line pitch they repeat",
        ],
      },
      {
        title: "Reaching them",
        lessons: [
          "Cold emails that get replies",
          "Communities, without spamming them",
          "A waitlist page that converts",
        ],
      },
      {
        title: "Launch week",
        lessons: [
          "The launch checklist",
          "Pricing for early customers",
          "The first support requests",
        ],
      },
      {
        title: "Keeping them",
        lessons: [
          "Onboarding calls",
          "Asking for referrals",
          "Retention from week one",
        ],
      },
    ],
  },
  c10: {
    about:
      "For analysts who keep inheriting spreadsheets that nobody else can check. You build a model of your own over six weeks, and in the final review Priya's team picks three assumptions and asks where each came from.",
    project: "Model a retailer's three years and defend it in a review",
    modules: [
      {
        title: "The blank sheet",
        lessons: [
          "Layout conventions that keep a model readable",
          "Inputs, calculations and outputs",
          "Formulas you can audit",
        ],
      },
      {
        title: "The three statements",
        lessons: [
          "The income statement",
          "The balance sheet",
          "Cash flow, and the link that balances it",
          "Checks that catch your errors",
        ],
      },
      {
        title: "Forecasting",
        lessons: [
          "Revenue drivers",
          "Fixed and variable costs",
          "Working capital",
        ],
      },
      {
        title: "Valuation",
        lessons: [
          "Discounted cash flow",
          "Comparable companies",
          "Sensitivity tables",
        ],
      },
      {
        title: "Defending it",
        lessons: [
          "Scenarios for a board",
          "Stress-testing the assumptions",
          "Presenting a model in ten minutes",
        ],
      },
    ],
  },
  c16: {
    about:
      "Eva ran product at two marketplaces, and the course follows a fictional one through a quarter of decisions, from the first interview to launch. It is written for people in their first product role, or doing the job without the title.",
    project: "Write the brief, roadmap and launch review for one feature",
    modules: [
      {
        title: "The job",
        lessons: [
          "What a product manager decides",
          "Working with engineering and design",
          "Your first thirty days",
        ],
      },
      {
        title: "Discovery",
        lessons: [
          "Customer interviews for product managers",
          "Opportunity trees",
          "Sizing a problem",
        ],
      },
      {
        title: "Writing the brief",
        lessons: [
          "Problem, goals and non-goals",
          "Success metrics",
          "Reviewing a brief with the team",
        ],
      },
      {
        title: "Prioritizing",
        lessons: [
          "Frameworks and their limits",
          "Saying no to a stakeholder",
          "Trade-offs in writing",
        ],
      },
      {
        title: "Roadmaps",
        lessons: [
          "Roadmaps built on outcomes",
          "Sequencing around dependencies",
          "Presenting the roadmap",
        ],
      },
      {
        title: "Delivery",
        lessons: [
          "Working in sprints",
          "Scope cuts that keep the goal",
          "A launch checklist",
        ],
      },
      {
        title: "After launch",
        lessons: [
          "Measuring the result",
          "The launch review",
          "Deciding what comes next",
        ],
      },
    ],
  },
  c20: {
    about:
      "This two-week guided project is for anyone holding an offer they have not answered yet. It ends on a rehearsal of the whole call, recorded on video and reviewed line by line by Sam's team within two working days.",
    project: "Rehearse your offer call on video and have it reviewed",
    modules: [
      {
        title: "Your numbers",
        lessons: ["Market data for your role", "Your walk-away point"],
      },
      {
        title: "The script",
        lessons: ["Opening and anchoring", "Answering the salary question"],
      },
      {
        title: "The call",
        lessons: ["Rehearsing with a partner", "Following up in writing"],
      },
    ],
  },
  c22: {
    about:
      "You write each calculation yourself first, then reach for the library that does it in one line. It suits finance analysts who rebuild the same risk tables in a spreadsheet every quarter and would rather write them once.",
    project: "Build a portfolio report from ten years of daily price data",
    modules: [
      {
        title: "Price data",
        lessons: [
          "Loading and aligning price series",
          "Simple returns and log returns",
          "Resampling to weeks and months",
        ],
      },
      {
        title: "Risk",
        lessons: [
          "Volatility and drawdowns",
          "Value at risk",
          "Correlation between assets",
        ],
      },
      {
        title: "Portfolios",
        lessons: [
          "Weights and rebalancing",
          "The efficient frontier",
          "Constraints a real fund works under",
        ],
      },
      {
        title: "Backtesting",
        lessons: [
          "A backtest without look-ahead bias",
          "Transaction costs",
          "Reading a backtest with suspicion",
        ],
      },
      {
        title: "Factors",
        lessons: [
          "Regression on market factors",
          "Style exposures",
          "Performance attribution",
        ],
      },
      {
        title: "Reporting",
        lessons: [
          "Charts for a committee",
          "A report that rebuilds itself",
          "Explaining risk in plain words",
        ],
      },
    ],
  },
  c25: {
    about:
      "The course is built around the spreadsheet Sam used to raise a second company's seed round from nine investors. You fill it with your own numbers, one tab a week, until it shows you which lever to pull first.",
    project: "Model your own unit economics and find the break-even",
    modules: [
      {
        title: "One customer",
        lessons: [
          "Revenue per customer",
          "Gross margin",
          "Contribution margin",
        ],
      },
      {
        title: "Acquisition",
        lessons: [
          "Acquisition cost by channel",
          "Payback period",
          "Blended cost and paid cost",
        ],
      },
      {
        title: "Lifetime value",
        lessons: [
          "Retention curves",
          "A lifetime value you can defend",
          "Cohorts",
        ],
      },
      {
        title: "Decisions",
        lessons: [
          "Break-even",
          "Which lever to pull first",
          "Unit economics for an investor",
        ],
      },
    ],
  },
  // Taught in French, so its syllabus is written in French too.
  c31: {
    about:
      "Pour les fondateurs et les analystes qui préparent une première levée de fonds sans directeur financier à leurs côtés. Claire occupe ce poste dans une startup SaaS et corrige votre modèle comme ceux de son équipe.",
    project: "Construisez le modèle d'une startup SaaS et présentez-le à un investisseur",
    modules: [
      {
        title: "Les bases",
        lessons: [
          "Un classeur lisible",
          "Hypothèses, calculs, résultats",
          "Des formules vérifiables",
        ],
      },
      {
        title: "Le chiffre d'affaires",
        lessons: [
          "Abonnements et churn",
          "Cohortes de clients",
          "Prix et expansion",
        ],
      },
      {
        title: "Les coûts",
        lessons: [
          "Recrutements et masse salariale",
          "Coûts d'acquisition",
          "Infrastructure",
        ],
      },
      {
        title: "La trésorerie",
        lessons: [
          "Le plan de trésorerie",
          "Le besoin en fonds de roulement",
          "Combien lever, et quand",
        ],
      },
      {
        title: "Devant l'investisseur",
        lessons: [
          "Les scénarios",
          "Les métriques SaaS",
          "Présenter le modèle",
        ],
      },
    ],
  },
};
