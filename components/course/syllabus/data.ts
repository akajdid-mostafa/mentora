// What the Data courses teach, module by module. Written rather than
// generated: a syllabus is the part of the page a careful buyer reads line by
// line, and one that reads as filler undoes every claim above it.

import { chapters } from "@/components/marketing/draft";
import type { Draft } from "@/components/course/syllabus/types";

export const data: Record<string, Draft> = {
  // The syllabus the home page's studio drafts from Ana's one-line brief, so
  // the outline on the studio and the course a learner buys are one outline.
  c1: {
    about:
      "Written for people who live in spreadsheets and wait on an engineer each time they need data pulled. Every lesson runs on one retail dataset, so by the last module you know its quirks as well as you know the SQL.",
    project: "Answer six finance questions in SQL a team can rerun",
    modules: chapters.map((c) => ({ title: c.title, lessons: c.lessons, minutes: c.minutes })),
  },
  c2: {
    about:
      "Each idea starts as a simulation you run in the browser, and the formula arrives last, if it arrives at all. It suits analysts who report test results every week and would struggle to defend one in front of a skeptical manager.",
    project: "Audit a published survey and write the three corrections its charts need",
    modules: [
      {
        title: "Samples, and why the average moves",
        lessons: [
          "What a sample can tell you about everyone else",
          "Spread: variance and standard deviation by picture",
          "Simulating a thousand samples in the browser",
        ],
      },
      {
        title: "Intervals you can say out loud",
        lessons: [
          "The margin of error, from the simulation up",
          "Confidence intervals and the sentence they allow",
          "When a wider interval is the honest one",
        ],
      },
      {
        title: "Tests and p-values",
        lessons: [
          "A null hypothesis is a claim to knock over",
          "Reading a p-value without the folklore",
          "Significance and size: two numbers, two questions",
          "The comparisons that inflate false alarms",
        ],
      },
      {
        title: "Regression tables",
        lessons: [
          "A line through a cloud of points",
          "Coefficients, holding everything else fixed",
          "Residual plots and what they warn you about",
        ],
      },
    ],
  },
  c3: {
    about:
      "The decision is whether a subscription business should shorten its free trial, and the data is a year of its trials and cancellations. Ana's team reviews your page the way the person making the decision would read it.",
    project: "Ship a one-page dashboard that settles the free-trial decision",
    modules: [
      {
        title: "Start from the decision",
        lessons: [
          "Who reads this, and what they decide",
          "One metric per decision, defined in writing",
          "Sketching the page before opening the tool",
        ],
      },
      {
        title: "Build it",
        lessons: [
          "Loading the trial data and checking it twice",
          "Charts for comparison, trend and share",
          "Filters that answer the follow-up questions",
        ],
      },
      {
        title: "Cut it down",
        lessons: [
          "The chart nobody opened in the first week",
          "Annotations that say what changed",
          "Handing it over with a one-paragraph readme",
        ],
      },
    ],
  },
  c14: {
    about:
      "For analysts whose work lives in spreadsheets and keeps outgrowing them. Every lesson uses public data that is messy in the ordinary ways, so the cleaning you practice is the cleaning you will do at work.",
    project: "Clean and chart a year of bike-share trips in one notebook",
    modules: [
      {
        title: "Notebooks and the Python you need",
        lessons: [
          "Cells, kernels and restarting on purpose",
          "Lists, dictionaries and the loop you will write most",
          "Functions for the steps you repeat",
        ],
      },
      {
        title: "Loading data with pandas",
        lessons: [
          "DataFrames, rows and the index",
          "Reading CSV and Excel without losing the dates",
          "Selecting columns and filtering rows",
          "Sorting, ranking and a first summary",
        ],
      },
      {
        title: "Cleaning",
        lessons: [
          "Missing values: drop, fill or flag",
          "Text columns with stray spaces and capitals",
          "Dates and times across time zones",
          "Duplicates, and how they got there",
        ],
      },
      {
        title: "Grouping and joining",
        lessons: [
          "groupby as split, apply, combine",
          "Pivot tables in code",
          "Merging two tables on a key",
        ],
      },
      {
        title: "Charts",
        lessons: [
          "Matplotlib for the chart you control",
          "A bar, a line or a scatter: choosing",
          "Small multiples for twelve months at once",
        ],
      },
      {
        title: "Handing it over",
        lessons: [
          "A notebook that reruns from a clean kernel",
          "Three findings above the code",
          "Exporting a report for readers without Python",
        ],
      },
    ],
  },
  c19: {
    about:
      "You finish with a one-page results memo for the most skeptical reader in the room, the one who asks how long the test ran. The examples come from the checkout, pricing and onboarding tests a product team runs most.",
    project: "Plan, size and read out a checkout test, then defend it",
    modules: [
      {
        title: "Before launch",
        lessons: [
          "One hypothesis, one primary metric",
          "Sample size and the effect you can detect",
          "Guardrail metrics that stop a bad launch",
        ],
      },
      {
        title: "Running the test",
        lessons: [
          "Randomization, and checking it worked",
          "Why peeking on day three misleads you",
          "Sample ratio mismatch and other broken tests",
        ],
      },
      {
        title: "Reading the result",
        lessons: [
          "Confidence intervals on a lift",
          "Segments: finding effects without inventing them",
          "Novelty effects and tests that need longer",
          "When the answer is no difference",
        ],
      },
      {
        title: "Writing it up",
        lessons: [
          "A results memo on one page",
          "Deciding what a flat result means for the roadmap",
          "Keeping a log of every test you ran",
        ],
      },
    ],
  },
  c21: {
    about:
      "For data scientists whose models work in a notebook and nowhere else yet. Over twelve weeks you take one demand model from that notebook to a service that tells you, and whoever is on call, when it has gone wrong.",
    project: "Deploy a demand model behind an API, with drift alerts and a rollback plan",
    modules: [
      {
        title: "Framing the problem",
        lessons: [
          "Turning a business question into a prediction",
          "Baselines a model has to beat",
          "A metric the business recognizes",
        ],
      },
      {
        title: "Data pipelines",
        lessons: [
          "Feature tables, and where leakage hides",
          "Point-in-time joins",
          "Validating data before it reaches training",
          "Versioning datasets",
        ],
      },
      {
        title: "Training and evaluation",
        lessons: [
          "Splits for time-ordered data",
          "Error analysis by segment",
          "Calibration and thresholds",
          "Tracking experiments without a spreadsheet",
        ],
      },
      {
        title: "Packaging a model",
        lessons: [
          "Serializing a model with its preprocessing",
          "A prediction API with typed inputs",
          "Latency budgets and batch scoring",
        ],
      },
      {
        title: "Deployment",
        lessons: [
          "Shadow mode before the switch",
          "Canary releases for models",
          "Rolling a model back in minutes",
        ],
      },
      {
        title: "Monitoring",
        lessons: [
          "Data drift and concept drift",
          "Alerts that page the right person",
          "A dashboard for model health",
          "Retraining on a schedule or a trigger",
        ],
      },
      {
        title: "Owning it",
        lessons: [
          "Model cards and documentation",
          "What training and serving cost",
          "The post-mortem after a bad week",
        ],
      },
    ],
  },
  c27: {
    about:
      "For the analyst who rebuilds the same workbook every Monday morning. By week four the data pull, the formatting and the charts run on a schedule, and when a run fails you hear about it before your manager does.",
    project: "Replace a weekly sales workbook with a script that builds and emails it",
    modules: [
      {
        title: "Pulling the data",
        lessons: [
          "Exports, APIs and shared drives",
          "Keeping credentials out of your code",
          "Checking the numbers against last week",
        ],
      },
      {
        title: "Shaping the report",
        lessons: [
          "pandas for the recurring summaries",
          "Week-on-week and year-on-year columns",
          "Flagging the rows someone should look at",
        ],
      },
      {
        title: "Formatting the workbook",
        lessons: [
          "Writing Excel with openpyxl",
          "Number formats, widths and frozen headers",
          "Charts inside the file",
        ],
      },
      {
        title: "Sending it",
        lessons: [
          "Scheduling with cron and Task Scheduler",
          "An email with the file attached",
          "Logs, and an alert when a run fails",
        ],
      },
    ],
  },
  // Taught in Spanish, so its syllabus is written in Spanish too.
  c29: {
    about:
      "Python y pandas para quien hoy analiza datos en hojas de cálculo, con datos abiertos de salud pública. Al terminar entregas un informe que cualquier colega de tu equipo puede volver a ejecutar sin pedirte nada.",
    project: "Analiza datos de vacunación en un informe reproducible",
    modules: [
      {
        title: "Primeros pasos con Python",
        lessons: [
          "Notebooks, celdas y kernels",
          "Variables, listas y diccionarios",
          "Funciones para lo que repites",
        ],
      },
      {
        title: "Pandas desde cero",
        lessons: [
          "DataFrames, filas y columnas",
          "Leer CSV y Excel sin perder las fechas",
          "Filtrar y ordenar filas",
        ],
      },
      {
        title: "Limpieza de datos",
        lessons: [
          "Valores faltantes",
          "Texto con espacios y mayúsculas",
          "Fechas en formatos distintos",
          "Duplicados y de dónde vienen",
        ],
      },
      {
        title: "Agrupar y combinar",
        lessons: [
          "groupby paso a paso",
          "Tablas dinámicas en código",
          "Unir dos tablas por una clave",
        ],
      },
      {
        title: "Gráficos e informe",
        lessons: [
          "Barras, líneas y dispersión",
          "Una conclusión contada con tres gráficos",
          "Exportar el informe",
        ],
      },
    ],
  },
  c33: {
    about:
      "For analysts who write pandas and still reach for a loop when the data gets awkward. You finish with one tidy table, a vectorized pipeline and a written record of each decision you made about the data on the way.",
    project: "Turn a year of raw flight-delay files into one tidy, documented table",
    modules: [
      {
        title: "Meet the mess",
        lessons: [
          "Twelve files, three schemas",
          "Profiling columns before you trust them",
          "Deciding what clean means here",
        ],
      },
      {
        title: "Reshape",
        lessons: [
          "Melt, pivot and stack",
          "Vectorized arithmetic with NumPy",
          "Replacing the loops you wrote in week one",
        ],
      },
      {
        title: "Finish",
        lessons: [
          "Validating the final table",
          "A data dictionary a colleague can read",
        ],
      },
    ],
  },
  c35: {
    about:
      "For analysts whose forecast today is last year's number plus a guess about this one. By the end you run a thousand products through one model and can tell a planning team why each interval is as wide as it is.",
    project: "Forecast twelve weeks of store demand, interval and all",
    modules: [
      {
        title: "Reading a time series",
        lessons: [
          "Trend, season and noise",
          "Decomposition by picture",
          "Autocorrelation and what it hints at",
        ],
      },
      {
        title: "Baselines",
        lessons: [
          "Naive and seasonal naive forecasts",
          "Backtesting on rolling windows",
          "Error metrics a planner trusts",
        ],
      },
      {
        title: "Classical models",
        lessons: [
          "Exponential smoothing",
          "ARIMA without the algebra",
          "Holidays and promotions as regressors",
        ],
      },
      {
        title: "Models at scale",
        lessons: [
          "Forecasting a thousand products at once",
          "Gradient boosting with lag features",
          "Hierarchies that add up",
        ],
      },
      {
        title: "Uncertainty",
        lessons: [
          "Prediction intervals that hold",
          "Scenarios for the planning meeting",
          "Watching a forecast after launch",
        ],
      },
    ],
  },
};
