// What the Engineering courses teach, module by module.

import type { Draft } from "@/components/course/syllabus/types";

export const engineering: Record<string, Draft> = {
  c4: {
    about:
      "For people whose Python works and lives in one file on one laptop. Ten weeks later that file installs with one command, explains its own errors to whoever runs it and ships a new version whenever you push a tag.",
    project: "Publish your script as a package, with a CLI and tests",
    modules: [
      {
        title: "From script to project",
        lessons: [
          "Reading your own script as a stranger would",
          "Modules, packages and imports that behave",
          "Virtual environments and a lockfile",
        ],
      },
      {
        title: "Packaging",
        lessons: [
          "pyproject.toml, line by line",
          "Entry points and a command line",
          "Building and installing a wheel locally",
        ],
      },
      {
        title: "Types",
        lessons: [
          "Type hints where they pay for themselves",
          "Running mypy on code you already have",
          "Dataclasses and typed dictionaries",
          "Protocols in place of inheritance",
        ],
      },
      {
        title: "Testing",
        lessons: [
          "Your first pytest suite",
          "Fixtures for files and temporary folders",
          "Testing the command line",
          "Reading a coverage report",
        ],
      },
      {
        title: "Errors and configuration",
        lessons: [
          "Exceptions a user can act on",
          "Logging that helps at two in the morning",
          "Settings from files and the environment",
        ],
      },
      {
        title: "Performance",
        lessons: [
          "Profiling before optimizing",
          "Generators for files larger than memory",
          "When multiprocessing earns its complexity",
        ],
      },
      {
        title: "Releasing",
        lessons: [
          "Versions and a changelog",
          "Continuous integration on every push",
          "Publishing to a package index",
        ],
      },
    ],
  },
  c5: {
    about:
      "Every experiment runs from a terminal on your own laptop, with curl and a socket and nothing between you and the server. It suits developers who have shipped web apps for years without reading a raw response.",
    project: "Write an HTTP server from sockets and pass a test suite",
    modules: [
      {
        title: "Requests by hand",
        lessons: [
          "A request line, headers and a body",
          "Talking to a server over a raw socket",
          "Status codes a framework papers over",
        ],
      },
      {
        title: "Caching",
        lessons: [
          "Cache-Control, directive by directive",
          "ETags and conditional requests",
          "What a CDN keeps, and for how long",
          "Purging a cache without a stampede",
        ],
      },
      {
        title: "Cookies and sessions",
        lessons: [
          "The Set-Cookie attributes that matter",
          "SameSite and the forgery it prevents",
          "Sessions and tokens, and where each one lives",
        ],
      },
      {
        title: "Redirects and content",
        lessons: [
          "301, 302, 307 and 308",
          "Content negotiation and compression",
          "Range requests and resumable downloads",
        ],
      },
      {
        title: "Connections",
        lessons: [
          "Keep-alive and connection pools",
          "HTTP/2 and one connection for everything",
          "What a TLS handshake costs",
        ],
      },
    ],
  },
  c6: {
    about:
      "For engineers who own a schema that other teams read from and nobody dares to change. You work in Postgres throughout and rehearse every migration first on a production-sized copy of the data.",
    project: "Take an order system multi-currency with no downtime",
    modules: [
      {
        title: "Questions first",
        lessons: [
          "Listing the questions the data must answer",
          "Entities, relationships and cardinality",
          "Drawing the model before writing DDL",
        ],
      },
      {
        title: "Keys and constraints",
        lessons: [
          "Natural keys and surrogate keys",
          "Foreign keys, and what cascades",
          "Check constraints as documentation",
          "Unique indexes that enforce a rule",
        ],
      },
      {
        title: "Normal forms in practice",
        lessons: [
          "Where duplication turns into bugs",
          "Denormalizing on purpose",
          "History tables and effective dates",
        ],
      },
      {
        title: "Migrations",
        lessons: [
          "Expand, then contract",
          "Backfilling a column on a large table",
          "Renaming without breaking the readers",
          "Rehearsing on a production-sized copy",
        ],
      },
      {
        title: "Living with the model",
        lessons: [
          "Views for the reporting team",
          "Row-level security",
          "A schema people can search",
        ],
      },
    ],
  },
  c15: {
    about:
      "If a fresh clone is what you reach for whenever Git goes wrong, this is two weeks of staged accidents to fix instead. The next accident at work will be one you have fixed before, in a repository built to break on cue.",
    project: "Recover a repository from five staged accidents and write up each fix",
    modules: [
      {
        title: "How Git stores your work",
        lessons: [
          "Commits, trees and the pointers called branches",
          "Reading the log as a graph",
        ],
      },
      {
        title: "Rewriting history",
        lessons: [
          "Interactive rebase, one step at a time",
          "Squash, fixup and reword",
          "Resolving conflicts halfway through a rebase",
        ],
      },
      {
        title: "Recovering",
        lessons: [
          "The reflog and the commits you thought were lost",
          "Bisect to the commit that broke it",
        ],
      },
    ],
  },
  c17: {
    about:
      "For developers whose test suite stays green on the same day production breaks. You finish with a suite that runs in seconds and catches the bugs your team ships most, including the ones a mock was hiding.",
    project: "Take an untested order service to a suite that catches three planted bugs",
    modules: [
      {
        title: "pytest basics",
        lessons: [
          "Test discovery and plain asserts",
          "Reading a failure report",
          "Marking slow and flaky tests",
        ],
      },
      {
        title: "Fixtures",
        lessons: [
          "Fixtures and their scopes",
          "Factories for test data",
          "A fresh test database for every run",
        ],
      },
      {
        title: "Parametrizing",
        lessons: [
          "One test, twenty cases",
          "Property-based tests with Hypothesis",
          "Edge cases worth writing down",
        ],
      },
      {
        title: "Doubles and boundaries",
        lessons: [
          "Mocking HTTP calls",
          "Freezing time",
          "When a mock hides the bug",
          "Running the suite in CI",
        ],
      },
    ],
  },
  c23: {
    about:
      "For front-end developers who have never once heard their own work read aloud by a screen reader. You build each pattern in plain HTML first and React second, then audit it on a product people use every day.",
    project: "Fix a checkout flow until a screen reader can finish it",
    modules: [
      {
        title: "Semantics first",
        lessons: [
          "Landmarks and headings",
          "Buttons and links, and which is which",
          "Accessible names from labels",
        ],
      },
      {
        title: "The keyboard",
        lessons: [
          "Focus order and visible focus",
          "A roving tabindex for toolbars",
          "Skip links, and focus after navigation",
        ],
      },
      {
        title: "Patterns",
        lessons: [
          "Dialogs that hold focus and hand it back",
          "Menus and disclosure buttons",
          "A combobox with suggestions",
          "Error messages a screen reader announces",
        ],
      },
      {
        title: "Testing",
        lessons: [
          "VoiceOver and NVDA basics",
          "Automated checks and their limits",
          "Writing an accessibility statement",
        ],
      },
    ],
  },
  c26: {
    about:
      "The types come from one definition, so a change to the API fails the build on your machine before it fails a customer. The course follows one service through nine weeks, from the tsconfig to the load balancer in front.",
    project: "Build a typed booking API with validation, migrations and contract tests",
    modules: [
      {
        title: "Strict TypeScript",
        lessons: [
          "A tsconfig for a service",
          "Unions, narrowing and exhaustive checks",
          "Branded types for ids",
        ],
      },
      {
        title: "Validation at the edge",
        lessons: [
          "Schemas as the source of your types",
          "Parsing requests you do not trust",
          "Errors a client can handle",
        ],
      },
      {
        title: "API design",
        lessons: [
          "Resources and routes",
          "Pagination and filtering",
          "Versioning an API",
          "An OpenAPI file from the same schema",
        ],
      },
      {
        title: "Data access",
        lessons: [
          "A typed query builder",
          "Migrations checked in CI",
          "Transactions and where they end",
        ],
      },
      {
        title: "Testing",
        lessons: [
          "Unit tests for the pure logic",
          "Integration tests against Postgres in Docker",
          "Contract tests with a client team",
        ],
      },
      {
        title: "Running it",
        lessons: [
          "Structured logging",
          "Health checks and a graceful shutdown",
          "Deploying behind a load balancer",
        ],
      },
    ],
  },
  c30: {
    about:
      "All the practice runs on a ten-million-row copy of an order database, with the traffic of a busy Monday morning. It suits engineers whose database got slow while nobody was watching it grow, and who now have to fix it.",
    project: "Profile a slow reporting endpoint and bring its p95 under 200 milliseconds",
    modules: [
      {
        title: "Reading plans",
        lessons: [
          "EXPLAIN and EXPLAIN ANALYZE",
          "Scans, joins and what they cost",
          "Row estimates that go wrong",
        ],
      },
      {
        title: "Indexes",
        lessons: [
          "B-tree indexes and column order",
          "Partial and expression indexes",
          "Covering indexes",
          "When Postgres ignores your index",
        ],
      },
      {
        title: "Query patterns",
        lessons: [
          "The N+1 queries an ORM writes",
          "Pagination without OFFSET",
          "Rewriting a correlated subquery",
        ],
      },
      {
        title: "Writes and locks",
        lessons: [
          "Bulk inserts and COPY",
          "Reading pg_locks",
          "Vacuum, bloat and autovacuum settings",
        ],
      },
      {
        title: "Operating",
        lessons: [
          "pg_stat_statements for the worst offenders",
          "Connection pooling",
          "Partitioning a table that keeps growing",
        ],
      },
    ],
  },
  // Taught in Portuguese, so its syllabus is written in Portuguese too.
  c34: {
    about:
      "Para quem mantém APIs usadas por outros times e responde às mesmas perguntas toda semana. Os exemplos vêm de um sistema de pagamentos, com contratos, erros e limites de taxa do jeito que acontecem em produção.",
    project: "Projete, versione e documente uma API de reembolsos",
    modules: [
      {
        title: "Recursos e contratos",
        lessons: [
          "Modelando recursos",
          "Métodos HTTP e idempotência",
          "Códigos de status que o cliente entende",
        ],
      },
      {
        title: "Erros e validação",
        lessons: [
          "Um formato único de erro",
          "Validação na entrada",
          "Mensagens para quem integra",
        ],
      },
      {
        title: "Paginação e filtros",
        lessons: [
          "Cursores no lugar de offset",
          "Filtros e ordenação",
          "Limites de taxa",
        ],
      },
      {
        title: "Versionamento",
        lessons: [
          "Mudanças compatíveis e incompatíveis",
          "Versão na URL ou no cabeçalho",
          "Descontinuando uma versão",
        ],
      },
      {
        title: "Documentação",
        lessons: [
          "OpenAPI do começo ao fim",
          "Exemplos que funcionam",
          "Um changelog para quem integra",
        ],
      },
    ],
  },
  c36: {
    about:
      "You work through a streaming platform's sample bill line by line, the way a finance team reads one each month. Take it if you get asked about the cloud bill in meetings and cannot yet say where the money goes.",
    project: "Cut a sample monthly bill by a third, with a plan a finance team can check",
    modules: [
      {
        title: "Reading the bill",
        lessons: [
          "Line items, SKUs and usage types",
          "Tags that answer who spent it",
          "The three services behind most bills",
        ],
      },
      {
        title: "Compute",
        lessons: [
          "Rightsizing from utilization data",
          "Autoscaling that scales down",
          "Reserved and spot capacity",
        ],
      },
      {
        title: "Storage and data transfer",
        lessons: [
          "Storage classes and lifecycle rules",
          "Egress, the charge nobody planned for",
          "Logs you pay to keep",
        ],
      },
      {
        title: "Keeping it down",
        lessons: [
          "Budgets and anomaly alerts",
          "Showing each team its own costs",
          "A monthly cost review in thirty minutes",
        ],
      },
    ],
  },
};
