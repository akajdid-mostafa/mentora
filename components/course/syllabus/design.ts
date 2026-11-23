// What the Design courses teach, module by module.

import type { Draft } from "@/components/course/syllabus/types";

export const design: Record<string, Draft> = {
  c9: {
    about:
      "Built for designers who already ship components and now have to look after the system behind them. Over eleven weeks you run a small system for a fictional bank, including the release that breaks one of its products.",
    project: "Ship version 1.0 of a small design system, with its docs",
    modules: [
      {
        title: "Audit and scope",
        lessons: [
          "Auditing an interface for repeats",
          "Deciding what belongs in the system",
          "Names a team will keep using",
        ],
      },
      {
        title: "Tokens",
        lessons: [
          "Color, type and space as tokens",
          "Aliases and semantic layers",
          "Theming a second brand",
        ],
      },
      {
        title: "Components",
        lessons: [
          "Anatomy and states",
          "Variants or props",
          "Composition over configuration",
          "Accessibility built into the base",
        ],
      },
      {
        title: "Documentation",
        lessons: [
          "Usage guidelines with a do and a don't",
          "Examples people copy",
          "Search and a changelog",
        ],
      },
      {
        title: "Handoff and code",
        lessons: [
          "Keeping design files and code in step",
          "Component APIs engineers like",
          "Visual regression tests",
        ],
      },
      {
        title: "Adoption",
        lessons: [
          "Office hours and a request queue",
          "Measuring adoption across products",
          "Deprecating a component",
        ],
      },
      {
        title: "Releases",
        lessons: [
          "Semantic versions for a design system",
          "Migration guides",
          "When a release breaks a product",
        ],
      },
    ],
  },
  c7: {
    about:
      "Start here if you are new to design, or coming to screens from print or from engineering. Each week you redesign one screen and the instructor's team marks it up line by line, within three days of your upload.",
    project: "Redesign a three-screen booking flow and present it for critique",
    modules: [
      {
        title: "Seeing interfaces",
        lessons: [
          "What a critique looks for",
          "Hierarchy at a glance",
          "The squint test",
        ],
      },
      {
        title: "Layout",
        lessons: [
          "Grids and columns",
          "A spacing scale and its rhythm",
          "Alignment you can defend",
          "Responsive layouts from one grid",
        ],
      },
      {
        title: "Type",
        lessons: [
          "Choosing a typeface for a product",
          "A type scale in five steps",
          "Line length and leading",
        ],
      },
      {
        title: "Color",
        lessons: [
          "A neutral palette first",
          "One accent, and what it means",
          "Contrast for text and controls",
        ],
      },
      {
        title: "Components",
        lessons: [
          "Buttons, fields and their states",
          "Forms that ask for less",
          "Empty, loading and error states",
        ],
      },
      {
        title: "Presenting work",
        lessons: [
          "Writing a design rationale",
          "Presenting to a critique",
          "A case study for your portfolio",
        ],
      },
    ],
  },
  c8: {
    about:
      "Paper first, then throwaway code with real data, then five people using what you made while you watch and take notes. Engineers take it to find out in a week whether an idea is worth a quarter of their team's time.",
    project: "Prototype a feature idea and test it with five people in one week",
    modules: [
      {
        title: "Deciding what to test",
        lessons: [
          "The riskiest assumption",
          "Choosing the fidelity",
          "Tasks in place of questions",
        ],
      },
      {
        title: "Paper and clickable",
        lessons: [
          "A paper prototype in an hour",
          "Clickable prototypes from sketches",
          "Fake data that reads as real",
        ],
      },
      {
        title: "Prototypes in code",
        lessons: [
          "Throwaway code with real data",
          "Feature flags for a live prototype",
          "Recording what people do",
        ],
      },
      {
        title: "Testing with people",
        lessons: [
          "Recruiting five users",
          "Running the session",
          "Turning notes into a decision",
        ],
      },
    ],
  },
  c13: {
    about:
      "One pharmacy delivery app carries the whole course, from the first interview to the last usability test. People moving into design from another field start here, and the app becomes the first case study in their portfolio.",
    project: "Take a pharmacy delivery idea from research to a tested prototype",
    modules: [
      {
        title: "Problems before solutions",
        lessons: [
          "Framing a problem statement",
          "Assumptions to check first",
          "Mapping today's experience",
        ],
      },
      {
        title: "Research",
        lessons: [
          "Interviews with five people",
          "Synthesis with an affinity map",
          "Personas that come from data",
        ],
      },
      {
        title: "Ideas",
        lessons: [
          "Eight ideas in eight minutes",
          "Choosing what to prototype",
          "User flows",
        ],
      },
      {
        title: "Wireframes",
        lessons: [
          "Low-fidelity layouts",
          "Information architecture",
          "Navigation patterns",
        ],
      },
      {
        title: "Visual design",
        lessons: [
          "Type and color basics",
          "Components and states",
          "Accessibility checks",
        ],
      },
      {
        title: "Prototyping and testing",
        lessons: [
          "An interactive prototype",
          "Running a usability test",
          "Iterating on what you found",
        ],
      },
      {
        title: "The case study",
        lessons: [
          "Writing up the process",
          "Presenting the outcome",
          "Your portfolio page",
        ],
      },
    ],
  },
  c18: {
    about:
      "Noor draws typefaces for a living, and a good part of the course is learning to see what a type designer sees in a letter. The rest is setting a news app, from the small print on a byline to the biggest breaking headline.",
    project: "Build a type system for a news app and test it at three screen sizes",
    modules: [
      {
        title: "Seeing type",
        lessons: [
          "Anatomy: x-height, apertures, contrast",
          "Serif, sans and what each signals",
          "Reading type at small sizes",
        ],
      },
      {
        title: "Choosing and pairing",
        lessons: [
          "What a product typeface needs",
          "Pairing by contrast",
          "Variable fonts",
        ],
      },
      {
        title: "Scales and spacing",
        lessons: [
          "Modular scales",
          "Line height by size",
          "Letter spacing for capitals and headlines",
          "Measure and line length",
        ],
      },
      {
        title: "Type in the product",
        lessons: [
          "Figures in tables",
          "Type in forms and buttons",
          "Responsive type",
        ],
      },
    ],
  },
  c24: {
    about:
      "Pick the question your team keeps arguing about and settle it with five conversations. You leave with a findings deck to present and the habit of asking people what they did the last time it happened.",
    project: "Run five interviews on grocery planning and present them",
    modules: [
      {
        title: "Plan",
        lessons: [
          "A research question worth three weeks",
          "Recruiting and screening participants",
          "A discussion guide",
        ],
      },
      {
        title: "Interview",
        lessons: [
          "Opening and building rapport",
          "Asking about the last time",
          "Following up without leading",
          "Notes you can use",
        ],
      },
      {
        title: "Synthesize",
        lessons: [
          "Affinity mapping",
          "Findings, evidence and quotes",
          "Presenting to the team",
        ],
      },
    ],
  },
  c28: {
    about:
      "Pen, paper and a timer turn out ideas faster than any design tool, including the ones you would never have spent an hour on in one. Over two weeks you sketch, critique and test a sign-up screen with real people.",
    project: "Sketch twenty takes on a sign-up screen and test the best three",
    modules: [
      {
        title: "Tools and warm-up",
        lessons: ["Pens, paper and templates", "Boxes, lines and type by hand"],
      },
      {
        title: "Twenty screens",
        lessons: ["Crazy eights", "Variations on one layout"],
      },
      {
        title: "Choosing",
        lessons: ["A critique in ten minutes", "From sketch to wireframe"],
      },
    ],
  },
  // Taught in Spanish, so its syllabus is written in Spanish too.
  c32: {
    about:
      "Para quien diseña servicios públicos digitales, donde cada formulario tiene que servir a toda la ciudadanía. Cada semana revisas y corriges una pantalla real, tomada de un trámite que miles de personas usan a diario.",
    project: "Rediseña un formulario público hasta cumplir WCAG 2.2 AA",
    modules: [
      {
        title: "Fundamentos",
        lessons: [
          "Qué es la accesibilidad y a quién afecta",
          "Las pautas WCAG sin jerga",
          "Tecnologías de apoyo",
        ],
      },
      {
        title: "Color y contraste",
        lessons: [
          "Contraste de texto y controles",
          "Cuando el color no basta",
          "Estados de foco visibles",
        ],
      },
      {
        title: "Estructura",
        lessons: [
          "Encabezados y regiones",
          "Orden de lectura",
          "Textos alternativos",
        ],
      },
      {
        title: "Formularios",
        lessons: [
          "Etiquetas e instrucciones",
          "Errores que se entienden",
          "Tiempo y pasos",
        ],
      },
      {
        title: "Pruebas",
        lessons: [
          "Revisar con teclado",
          "Probar con lector de pantalla",
          "Documentar las decisiones",
        ],
      },
    ],
  },
};
