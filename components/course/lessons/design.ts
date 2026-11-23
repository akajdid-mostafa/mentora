// Lesson one of every Design course, written out: its transcript, the three
// questions the tutor offers on it and the practice set under the video.
// Lesson one is free on every course, so it is the lesson a visitor opens
// from any card, and the one lesson of these courses the demo learner can
// take in full without enrolling.

import type { CoursePack } from "@/components/course/lessons/types";

export const design: Record<string, CoursePack> = {
  c7: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Three days after you upload a screen, it comes back to you covered in my team's notes." },
          { at: 46, text: "Every note on it answers one of three questions, and today you learn to ask them." },
          { at: 100, text: "What is the screen for, what does a person see first, and what stands in their way?" },
          { at: 164, text: "This is the checkout of a shoe store, a real one, with its name taken off." },
          { at: 228, text: "It has one job: get someone who chose boots to pay, with no surprise in the total." },
          { at: 296, text: "The first thing you see is an orange banner: ten percent off if you give your email." },
          { at: 364, text: "The Pay button comes third, and on a phone the total, $84.20, falls below the fold." },
          { at: 432, text: "Shipping, $7.95, first appears after the card number, and that is where people quit." },
          { at: 500, text: "Each note we send names a place, what it costs the buyer, and one change to try." },
          { at: 562, text: "Like this: the banner pulls the first look away from the total, so put the total above it." },
          { at: 614, text: "We cut notes on taste, like 'I don't love the orange,' because nobody can act on them." },
          { at: 655, text: "Below the video are three notes on this checkout, and one of them should never go out." },
        ],
        asks: [
          {
            q: "What does a critique look for?",
            at: 100,
            body: "At 01:40 the lesson gives the three questions: what the screen is for, what a person sees first, and what stands in their way. Every note answers one of them.",
          },
          {
            q: "Why does the shipping cost matter?",
            at: 432,
            body: "At 07:12 the lesson shows shipping, $7.95, first appearing after the card number. That is the point in the checkout where people quit.",
          },
          {
            q: "Why not just say I don't like the orange?",
            at: 614,
            body: "At 10:14 the lesson says the team cuts notes on taste, like 'I don't love the orange.' Nobody can act on them.",
          },
        ],
        practice: [
          {
            q: "You open a screen to critique it. Which three questions do the notes answer?",
            options: [
              "Does it follow the grid, the colors, the type?",
              "What it's for, what's seen first, what's in the way",
              "Is it modern, is it on brand, is it simple?",
            ],
            answer: 1,
            why: "Every note answers what the screen is for, what a person sees first, or what stands in their way.",
            at: 100,
          },
          {
            q: "Which note on the shoe store's checkout should never go out?",
            options: [
              "I don't love the orange of the banner",
              "The total falls below the fold on a phone",
              "Shipping first appears after the card number",
            ],
            answer: 0,
            why: "It is a note on taste, and nobody can act on it; the other two name a place and a cost.",
            at: 614,
          },
          {
            q: "'The banner pulls the first look away from the total, so put the total above it.' What makes this note useful?",
            options: [
              "It stays polite about the banner",
              "It cites the store's brand guide",
              "It names a place, a cost and a change",
            ],
            answer: 2,
            why: "A note names a place on the screen, what it costs the buyer, and one change to try.",
            at: 500,
          },
        ],
      },
    },
  },

  c8: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Your team is about to spend a quarter on an idea that has never met a user." },
          { at: 45, text: "Every idea stands on a few beliefs, and one of them, if it is wrong, sinks the rest." },
          { at: 92, text: "That one is the riskiest assumption, and your first prototype exists to test it." },
          { at: 140, text: "Score every belief twice: how much breaks if it is wrong, and how little you know." },
          { at: 190, text: "A bike shop planned six weeks of online booking: a calendar, payments, reminder texts." },
          { at: 240, text: "Three beliefs held it up. The unwritten one: riders know which repair their bike needs." },
          { at: 288, text: "If that is wrong, a rider books 30 minutes for a two-hour job, and the whole day slips." },
          { at: 336, text: "It scored worst on both, so the team tested it on paper at the counter that Friday." },
          { at: 384, text: "Three riders of five picked the wrong repair, and the team had not written any code yet." },
          { at: 432, text: "The form now asks for a photo of the bike, and a mechanic sets how long the slot runs." },
          { at: 480, text: "Engineers want to start on the calendar, since it's the part they know. Nobody doubted it." },
          { at: 530, text: "Before anyone plans a sprint, the practice set asks which belief you would test first." },
        ],
        asks: [
          {
            q: "How do I find the riskiest assumption?",
            at: 140,
            body: "At 02:20 the lesson scores every belief twice: how much breaks if it is wrong, and how little you know. The one that scores worst on both is the one to test.",
          },
          {
            q: "How did they test it without code?",
            at: 336,
            body: "At 05:36 the team tested the belief on paper, at the shop's counter. Three riders of five picked the wrong repair before anyone wrote code.",
          },
          {
            q: "Shouldn't we build the calendar first?",
            at: 480,
            body: "At 08:00 the lesson says engineers want to start on the calendar, the part they know. Nobody doubted it, and the first prototype tests the riskiest belief.",
          },
        ],
        practice: [
          {
            q: "The team scores every belief under the plan twice. On which two counts?",
            options: [
              "How much breaks if it's wrong, how little you know",
              "How long it takes to build, what it costs",
              "How many users ask for it, and how often",
            ],
            answer: 0,
            why: "The riskiest belief breaks the most if it is wrong and is the one you know least about.",
            at: 140,
          },
          {
            q: "A gym wants members to book classes in its app and pay a fee when they skip one. Which belief do you test first?",
            options: [
              "The app can load the gym's class schedule",
              "The app can send a reminder the night before",
              "Members will accept a fee for a missed class",
            ],
            answer: 2,
            why: "The schedule and the reminder are parts a team can build; nobody knows yet if members accept the fee.",
            at: 480,
          },
          {
            q: "Three of five riders picked the wrong repair on paper. How much code did the team throw away?",
            options: [
              "Six weeks of calendar work",
              "None: the test came before any code",
              "The payment screens",
            ],
            answer: 1,
            why: "The paper test came before the team had written any code, so the form changed and no work was lost.",
            at: 384,
          },
        ],
      },
    },
  },

  c9: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Open the settings page of the course's bank app and count the grays." },
          { at: 45, text: "Nineteen. Nobody chose them: each came with a feature, a deadline and a new designer." },
          { at: 92, text: "An audit counts what the product already repeats, before the system decides anything." },
          { at: 140, text: "Screenshot the live page, crop every control and label, and lay them out on one board." },
          { at: 188, text: "Then pull the values out of the code: every hex color, font size, radius and margin." },
          { at: 236, text: "Each value gets a row, a count and its screens. Those rows are where tokens come from." },
          { at: 284, text: "On this one page: nineteen grays, five font sizes from 12 to 17 pixels, three radii." },
          { at: 332, text: "And four toggles. Two of them look the same and behave differently." },
          { at: 380, text: "One saves the moment you tap it. The other waits for the Save button at the bottom." },
          { at: 428, text: "Those are two components, whatever the screenshot says, and the sheet gets two rows." },
          { at: 476, text: "Teams audit the design file because it is tidy. Audit the live page, where the mess lives." },
          { at: 524, text: "Make three calls from this audit in the practice set. Lesson two decides what stays." },
        ],
        asks: [
          {
            q: "Where did nineteen grays come from?",
            at: 45,
            body: "At 00:45 the lesson says nobody chose the nineteen grays. Each one came with a feature, a deadline and a new designer.",
          },
          {
            q: "How do I start an audit?",
            at: 140,
            body: "At 02:20 the lesson screenshots the live page, crops every control and label, and lays them out on one board. The values come out of the code next.",
          },
          {
            q: "Two toggles look alike. Why count two?",
            at: 428,
            body: "At 07:08 the lesson counts them as two components, whatever the screenshot says. One saves the moment you tap it, and the other waits for Save.",
          },
        ],
        practice: [
          {
            q: "Where should the audit of the bank app's settings page take its screenshots?",
            options: ["The live page customers use", "The latest design file", "The component library's docs"],
            answer: 0,
            why: "The design file is tidy; the live page holds the mess that shipped, and that is what the audit counts.",
            at: 476,
          },
          {
            q: "Two toggles look the same. One saves on tap, the other waits for the Save button. How many rows do they get?",
            options: [
              "One row, since they look the same",
              "Two rows, one for each component",
              "One row with a note on behavior",
            ],
            answer: 1,
            why: "They behave differently, so they are two components, whatever the screenshot says.",
            at: 428,
          },
          {
            q: "What does an audit do before the system decides anything?",
            options: [
              "Picks the palette for the next release",
              "Traces each mistake to the team that made it",
              "Counts what the product already repeats",
            ],
            answer: 2,
            why: "The audit counts every repeat in what shipped, so lesson two can decide what stays from a count.",
            at: 92,
          },
        ],
      },
    },
  },

  c13: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "A clinic sent us one line: 'We need an app that reminds patients.' That was the brief." },
          { at: 50, text: "It names a solution and skips the problem: who struggles, when it happens, what it costs." },
          { at: 100, text: "A problem statement is the sentence that fills in those three and leaves the app out." },
          { at: 152, text: "We asked for numbers first: six doctors, and 90 missed visits in March alone." },
          { at: 204, text: "Most were follow-ups, booked six weeks ahead at the end of the last visit." },
          { at: 256, text: "And the clinic already sent a text the day before. A reminder app would add a second one." },
          { at: 308, text: "The patients we called remembered. Shifts had moved, and the line to cancel shut at five." },
          { at: 360, text: "Our statement: patients booked weeks ahead can't cancel after five, so slots sit empty." },
          { at: 412, text: "That sentence has a who, a when and a cost, and 90 empty slots in March is the cost." },
          { at: 464, text: "Online rebooking, a waiting list, a shorter booking window: all three answer it." },
          { at: 516, text: "If only one design answers your statement, you wrote a solution and called it a problem." },
          { at: 568, text: "Your pharmacy app will start from a sentence like this. Try the practice set below first." },
        ],
        asks: [
          {
            q: "What goes in a problem statement?",
            at: 100,
            body: "At 01:40 the lesson says a problem statement fills in who struggles, when it happens and what it costs. It leaves the app out.",
          },
          {
            q: "Why wouldn't a reminder app help?",
            at: 256,
            body: "At 04:16 the lesson points out that the clinic already sent a text the day before. A reminder app would add a second one.",
          },
          {
            q: "How can I tell I wrote a solution?",
            at: 516,
            body: "At 08:36 the lesson gives the test: if only one design answers your statement, you wrote a solution and called it a problem. The clinic's statement had three answers.",
          },
        ],
        practice: [
          {
            q: "Which of these is a problem statement for the clinic, with the solution left out?",
            options: [
              "We need an app that reminds patients",
              "Patients want a better booking experience",
              "Patients can't cancel after five, so slots sit empty",
            ],
            answer: 2,
            why: "It names who struggles, when and what it costs, and it leaves every design open.",
            at: 360,
          },
          {
            q: "The clinic already texts every patient the day before a visit. What would a reminder app add?",
            options: ["A second text", "Fewer missed visits", "A shorter wait for follow-ups"],
            answer: 0,
            why: "Patients got a text the day before and remembered, so the app would send a second one.",
            at: 256,
          },
          {
            q: "Online rebooking, a waiting list and a shorter booking window all answer your statement. What does that show?",
            options: [
              "It is too vague to design from",
              "It names a problem and leaves the design open",
              "It needs more research before anyone designs",
            ],
            answer: 1,
            why: "When only one design answers a statement, it is a solution; three answers mean it names a problem.",
            at: 516,
          },
        ],
      },
    },
  },

  c18: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Here is the byline of a news story, set at 12 pixels, on a phone at reading distance." },
          { at: 62, text: "Three parts of a typeface decide whether this line reads: x-height, apertures, contrast." },
          { at: 128, text: "X-height is how tall the lowercase stands against the whole body of the type." },
          { at: 195, text: "I set this byline in two faces. One has an x-height of 540 units in 1,000, the other 460." },
          { at: 262, text: "At 12 pixels, that comes to 6.5 pixels of lowercase against 5.5, and you feel that pixel." },
          { at: 330, text: "Apertures are the openings in c, e and s. On an e, that opening is what I redraw most." },
          { at: 398, text: "Close them and the reporter's name clogs: the e in Rebecca fills in, the c reads as an o." },
          { at: 466, text: "Contrast is the difference between the thick strokes of a letter and the thin ones." },
          { at: 534, text: "A hairline a fifth the width of the stem looks sharp at 60 pixels and breaks up at 12." },
          { at: 602, text: "Specimen pages show a face at 72 points. Your reader meets it at 12 pixels, on a bus." },
          { at: 670, text: "Judge a face at the size of its smallest job. In a news app, that job is the byline." },
          { at: 740, text: "Keep this byline in mind for the practice questions below. Each one comes back to it." },
        ],
        asks: [
          {
            q: "What does x-height mean?",
            at: 128,
            body: "At 02:08 the lesson defines x-height as how tall the lowercase stands against the whole body of the type. The taller it stands, the more pixels small text gets.",
          },
          {
            q: "Why does the c look like an o?",
            at: 398,
            body: "At 06:38 the lesson closes the apertures, the openings in c, e and s. The reporter's name clogs: the e in Rebecca fills in, and the c reads as an o.",
          },
          {
            q: "Can I judge a font from its specimen?",
            at: 602,
            body: "At 10:02 the lesson notes that specimen pages show a face at 72 points, while your reader meets it at 12 pixels on a bus. Judge it at its smallest job.",
          },
        ],
        practice: [
          {
            q: "Two faces at 12 pixels: one has an x-height of 540 units in 1,000, the other 460. Which gives you more lowercase?",
            options: [
              "The 460 face, with its longer ascenders",
              "The 540 face, by about a pixel",
              "Neither, since both are set at 12 pixels",
            ],
            answer: 1,
            why: "At 12 pixels, 540 units comes to 6.5 pixels of lowercase, and 460 comes to 5.5.",
            at: 262,
          },
          {
            q: "In the byline, the e in Rebecca fills in and the c reads as an o. Which part of the face is at fault?",
            options: ["Low contrast", "A tall x-height", "Closed apertures"],
            answer: 2,
            why: "Apertures are the openings in c, e and s, and closed ones clog at 12 pixels.",
            at: 398,
          },
          {
            q: "A serif's hairlines are a fifth the width of its stems, and it looks sharp at 60 pixels. What happens at 12?",
            options: [
              "The hairlines break up",
              "Its serifs guide the eye along the line",
              "It reads the same, only smaller",
            ],
            answer: 0,
            why: "Hairlines that hold at 60 pixels are too fine at 12, so they break apart on the screen.",
            at: 534,
          },
        ],
      },
    },
  },

  c24: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Half the team said nobody plans meals a week ahead. The other half said everyone does." },
          { at: 44, text: "The grocery team argued for two months and never asked a customer about last week's meals." },
          { at: 86, text: "A question is worth three weeks when its answer changes what the team builds next." },
          { at: 128, text: "Write what you'd build if the answer goes one way, and what if it goes the other." },
          { at: 170, text: "If both answers lead to the same plan, skip the research and build it." },
          { at: 212, text: "The team's first draft asked, 'Would you use a meal planner?' Everyone says yes to that." },
          { at: 254, text: "People are poor at predicting what they will do, and good at telling you what they did." },
          { at: 296, text: "The rewrite asks five households where last week's grocery list came from." },
          { at: 338, text: "Recipe-first lists point to a planner. Lists of what ran out point to a restock button." },
          { at: 380, text: "The question, its two outcomes and the five people you need fit on one page: the plan." },
          { at: 422, text: "Week one finds the five people, week two talks to them, week three sorts what they said." },
          { at: 464, text: "The practice set opens on questions teams brought me. Find the one five people can settle." },
        ],
        asks: [
          {
            q: "How do I know a question is worth it?",
            at: 86,
            body: "At 01:26 the lesson says a question is worth three weeks when its answer changes what the team builds next. If both answers lead to the same plan, skip the research and build.",
          },
          {
            q: "Can't I just ask if they want a planner?",
            at: 254,
            body: "At 04:14 the lesson explains that people are poor at predicting what they will do, and good at telling you what they did. Everyone says yes to a planner.",
          },
          {
            q: "What does the research plan look like?",
            at: 380,
            body: "At 06:20 the lesson fits the plan on one page: the question, its two outcomes and the five people you need. The three weeks go to finding, talking and sorting.",
          },
        ],
        practice: [
          {
            q: "Which question could five interviews settle in three weeks?",
            options: [
              "Would you use a meal planner?",
              "How much would you pay for meal plans?",
              "Where did last week's grocery list come from?",
            ],
            answer: 2,
            why: "It asks what people did, which they can tell you; the other two ask them to predict.",
            at: 254,
          },
          {
            q: "Your team would build the planner whichever way the answers go. What should you do with the three weeks?",
            options: [
              "Skip the research and build the planner",
              "Interview ten people in place of five",
              "Ask a sharper question about the planner",
            ],
            answer: 0,
            why: "If both answers lead to the same plan, the research changes nothing, so you skip it and build.",
            at: 170,
          },
          {
            q: "Four of five households say their list starts from what ran out. What does the team build?",
            options: ["A weekly meal planner", "A restock button", "Both, to be safe"],
            answer: 1,
            why: "Lists of what ran out point to a restock button, and recipe-first lists point to a planner.",
            at: 338,
          },
        ],
      },
    },
  },

  c28: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Two pens, a stack of printer paper and one sheet of templates: that is the whole kit." },
          { at: 44, text: "At the foundry my pens are fine enough for a hairline. For screens, I want a fat one." },
          { at: 88, text: "A black felt-tip, around 0.8 millimeters, is too thick for detail, and that is the point." },
          { at: 132, text: "You can't draw a tiny icon with it, so you draw a box where the icon goes and move on." },
          { at: 176, text: "The second pen is a gray marker. Shade what matters less, and the rest comes forward." },
          { at: 220, text: "The paper is cheap and plentiful. Nobody hesitates over a sheet that cost a cent." },
          { at: 264, text: "The template is a page of phone outlines at real size, three to a sheet, turned sideways." },
          { at: 308, text: "At real size, the line you draw for a label takes the room that label takes on a phone." },
          { at: 352, text: "Leave the pencil out. It invites the eraser, and erasing turns twenty ideas into one." },
          { at: 400, text: "Do the practice set below, then print a sheet of phone outlines for the next lesson." },
        ],
        asks: [
          {
            q: "Why use such a thick pen?",
            at: 88,
            body: "At 01:28 the lesson picks a black felt-tip around 0.8 millimeters because it is too thick for detail. You draw a box where an icon goes and move on.",
          },
          {
            q: "Why print the phones at real size?",
            at: 264,
            body: "At 04:24 the lesson prints phone outlines at real size, three to a sheet. The line you draw for a label then takes the room that label takes on a phone.",
          },
          {
            q: "Can I sketch in pencil?",
            at: 352,
            body: "At 05:52 the lesson leaves the pencil out because it invites the eraser. Erasing turns twenty ideas into one.",
          },
        ],
        practice: [
          {
            q: "What is the gray marker in the kit for?",
            options: ["Outlining each phone", "Writing the labels", "Shading what matters less"],
            answer: 2,
            why: "Shade what matters less in gray, and the parts that matter come forward.",
            at: 176,
          },
          {
            q: "Why print the phone outlines at real size?",
            options: [
              "So the sketches look finished",
              "So a label takes the room it takes on a phone",
              "So more screens fit on a sheet",
            ],
            answer: 1,
            why: "At real size, the line you draw for a label takes the room that label takes on a phone.",
            at: 308,
          },
          {
            q: "Why does the kit leave the pencil out?",
            options: ["It invites the eraser", "It smudges on cheap printer paper", "Its line is too faint to photograph"],
            answer: 0,
            why: "A pencil invites the eraser, and erasing turns twenty ideas into one.",
            at: 352,
          },
        ],
      },
    },
  },

  // Taught in Spanish, so its lesson is written in Spanish too.
  c32: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Si una tienda online no te sirve, compras en otra. Con un trámite público no hay otra." },
          { at: 60, text: "Por eso aquí accesibilidad quiere decir que cualquier persona pueda terminar el trámite." },
          { at: 122, text: "Da igual cómo vea, oiga, se mueva o entienda, y da igual desde dónde lo haga." },
          { at: 185, text: "Este es el formulario para pedir la tarjeta sanitaria. Lo empiezan 2.400 personas al día." },
          { at: 248, text: "El botón Continuar es gris claro sobre blanco, con un contraste de 2,3 a 1." },
          { at: 310, text: "Manuel, de 71 años, no lo distingue. Tampoco quien lo rellena al sol, en la parada." },
          { at: 372, text: "Al final hay un captcha de letras torcidas, y un lector de pantalla no puede leerlo." },
          { at: 435, text: "Carmen, que es ciega y usa lector de pantalla, se queda ahí, a un paso del final." },
          { at: 498, text: "Y la sesión caduca a los diez minutos. Jorge, con un brazo escayolado, no llega a tiempo." },
          { at: 560, text: "El error más común es pensar en un grupo pequeño y aparte, que no eres tú." },
          { at: 622, text: "Con los años, con una lesión o con sol en la pantalla, todos acabamos en ese grupo." },
          { at: 685, text: "Bajo el vídeo, tres personas se atascan en este formulario. Encuentra dónde." },
        ],
        asks: [
          {
            q: "¿Qué significa accesible en un trámite?",
            at: 60,
            body: "En el 01:00 la lección lo define así: que cualquier persona pueda terminar el trámite. Da igual cómo vea, oiga, se mueva o entienda.",
          },
          {
            q: "¿Qué tiene de malo el botón gris?",
            at: 310,
            body: "En el 05:10 la lección cuenta que Manuel, de 71 años, no distingue el botón gris claro sobre blanco. Tampoco quien rellena el formulario al sol, en la parada.",
          },
          {
            q: "¿Esto no afecta solo a unas pocas personas?",
            at: 560,
            body: "En el 09:20 la lección llama a eso el error más común: pensar en un grupo pequeño y aparte. Con los años, una lesión o el sol, todos acabamos en él.",
          },
        ],
        practice: [
          {
            q: "Manuel, de 71 años, no distingue el botón Continuar. ¿Qué barrera encuentra?",
            options: [
              "El captcha de letras torcidas",
              "El contraste de 2,3 a 1 del botón",
              "La sesión que caduca a los diez minutos",
            ],
            answer: 1,
            why: "El botón es gris claro sobre blanco, con un contraste de 2,3 a 1, y Manuel no lo distingue.",
            at: 310,
          },
          {
            q: "Carmen es ciega y usa lector de pantalla. ¿En qué punto del trámite se queda?",
            options: ["En el captcha de letras torcidas", "En el botón Continuar", "Cuando caduca la sesión"],
            answer: 0,
            why: "Su lector de pantalla no puede leer el captcha de letras torcidas, así que el trámite acaba ahí.",
            at: 435,
          },
          {
            q: "Jorge lleva un brazo escayolado. ¿Qué le impide terminar el trámite?",
            options: [
              "El contraste del botón Continuar",
              "El captcha del último paso",
              "La sesión que caduca a los diez minutos",
            ],
            answer: 2,
            why: "La sesión caduca a los diez minutos, y con un brazo escayolado Jorge no llega a tiempo.",
            at: 498,
          },
        ],
      },
    },
  },
};
