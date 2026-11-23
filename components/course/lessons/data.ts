// Lesson one of every Data course but SQL for analysis, written out: its
// transcript, the three questions the tutor offers on it and the practice set
// under the video. Lesson one is free on every course, so it is the lesson a
// visitor opens from any card, and the one lesson of these courses the demo
// learner can take in full without enrolling.

import type { CoursePack } from "@/components/course/lessons/types";

export const data: Record<string, CoursePack> = {
  c2: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Every Friday our depot opens 200 of the 60,000 parcels it shipped and checks for damage." },
          { at: 86, text: "Last Friday 9 of the 200 were damaged, and Monday's report said 4.5 percent." },
          { at: 172, text: "The regional manager asked what that says about all 60,000. The other 59,800 stay shut." },
          { at: 259, text: "So I built a pretend week where we know the answer: 60,000 parcels, 5 percent damaged." },
          { at: 347, text: "I draw 200 at random: 7 damaged, 3.5 percent. The next draws give 6, then 4." },
          { at: 433, text: "The pretend week never changed. Only the sample did, and the damage rate moved with it." },
          { at: 520, text: "Most draws land within 3 points of the true 5. Read Friday's 4.5 with that give or take." },
          { at: 608, text: "Grow the week to 6 million parcels, and 200 drawn at random still land within 3 points." },
          { at: 697, text: "What matters is the picking: every parcel needs the same chance of being drawn." },
          { at: 785, text: "Our loaders took the 200 from the cage by the door, the parcels thrown around least." },
          { at: 872, text: "That sample said 1 percent, week after week, and every Monday report printed it." },
          { at: 960, text: "Under this video, three depots pick their 200 three ways. Say which one you would report." },
        ],
        asks: [
          {
            q: "Why build a pretend week first?",
            at: 259,
            body: "At 04:19 the lesson builds a week where the answer is known: 60,000 parcels, 5 percent damaged. Any sample drawn from it can be checked against that 5.",
          },
          {
            q: "Does a bigger depot need a bigger sample?",
            at: 608,
            body: "At 10:08 the lesson grows the week to 6 million parcels. Drawn at random, 200 parcels still land within 3 points of the true rate.",
          },
          {
            q: "What was wrong with the cage by the door?",
            at: 785,
            body: "At 13:05 the lesson explains that parcels in the cage by the door are the ones thrown around least. A sample taken from there said 1 percent, week after week.",
          },
        ],
        practice: [
          {
            q: "Five samples of 200 from the same pretend week give 3.5, 6, 4, 5.5 and 4.5 percent. What changed between draws?",
            options: ["Which 200 parcels were drawn", "The share of damaged parcels that week", "The way the damage was counted"],
            answer: 0,
            why: "The pretend week stayed at 5 percent, so the only thing that moved between draws was the sample.",
            at: 433,
          },
          {
            q: "Depot A ships 60,000 parcels a week, depot B 6 million. Each checks 200 at random. Whose estimate lands closer to the truth?",
            options: ["Depot A's, since it checks a bigger share", "Depot B's, since its week is bigger", "About the same, since both drew 200 at random"],
            answer: 2,
            why: "Drawn at random, 200 parcels still land within 3 points, whether the week holds 60,000 or 6 million.",
            at: 608,
          },
          {
            q: "Three depots each choose 200 parcels to open. Which sample can speak for the whole week?",
            options: ["The 200 in the cage by the door", "200 tracking numbers drawn at random", "The first 200 scanned on Monday"],
            answer: 1,
            why: "Only the random draw gives every parcel in the week the same chance of being picked.",
            at: 697,
          },
        ],
      },
    },
  },

  c3: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Thirty-one charts, and three visits in six weeks: that was my team's refunds dashboard." },
          { at: 44, text: "Two of those three visits were ours, checking that it still loaded." },
          { at: 90, text: "Every number was right. Nobody had asked who would read it, or what they would decide." },
          { at: 135, text: "This project starts with one sentence, and you write it before you open a charting tool." },
          { at: 181, text: "It names a reader, a decision and a date: who chooses what, and by when." },
          { at: 226, text: "Ours: the head of growth decides in June whether to cut the free trial from 14 days to 7." },
          { at: 270, text: "That sentence rules out half the page. Revenue by region says nothing about trial length." },
          { at: 316, text: "It also tells you what to build first: when did last year's paying customers convert?" },
          { at: 362, text: "Of 18,400 trials last year, 2,900 became paying customers, 1,100 of them after day 7." },
          { at: 408, text: "Those 1,100 are what a 7-day trial puts at risk, so that number goes at the top." },
          { at: 452, text: "The trap is a brief like “an overview of trial performance.” Nobody decides an overview." },
          { at: 497, text: "Three more of those sentences sit below the video. Find the one a page can be built for." },
        ],
        asks: [
          {
            q: "Why did nobody use the refunds dashboard?",
            at: 90,
            body: "At 01:30 the lesson says every number on the refunds dashboard was right. Nobody had asked who would read it, or what they would decide.",
          },
          {
            q: "What goes in the one sentence?",
            at: 181,
            body: "At 03:01 the lesson lists what the sentence names: a reader, a decision and a date. Together they say who chooses what, and by when.",
          },
          {
            q: "Why does the 1,100 go at the top?",
            at: 408,
            body: "At 06:48 the lesson points out that a 7-day trial puts those 1,100 late conversions at risk. So that number goes at the top of the page.",
          },
        ],
        practice: [
          {
            q: "Which of these could a dashboard be built for?",
            options: ["An overview of trial performance for leadership", "Growth decides in June whether trials go to 7 days", "Every trial metric, refreshed each morning"],
            answer: 1,
            why: "It names a reader, a decision and a date, so every chart on the page can be judged against it.",
            at: 181,
          },
          {
            q: "The decision is how long the free trial should run. Which chart can you cut first?",
            options: ["Revenue by region", "Conversions by day of the trial", "Cancellations in the first paid month"],
            answer: 0,
            why: "Revenue by region says nothing about trial length, so the sentence rules it out before you build it.",
            at: 270,
          },
          {
            q: "Of 2,900 conversions last year, 1,100 came after day 7. Why does that number lead the page?",
            options: ["It proves the trial should stay at 14 days", "It is the conversion rate for the year", "Those are the conversions a 7-day trial risks"],
            answer: 2,
            why: "A 7-day trial ends before those 1,100 customers converted, which puts them at risk.",
            at: 408,
          },
        ],
      },
    },
  },

  c14: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "The notebook on my screen says the average bike-share trip lasts 0.23 minutes." },
          { at: 88, text: "A new analyst on my team sent it on a Friday. Fourteen seconds is not much of a ride." },
          { at: 176, text: "To see how a notebook gets there, you need two ideas: the cell and the kernel." },
          { at: 263, text: "A notebook is a page of cells, and each cell is a box of code you run on its own." },
          { at: 352, text: "Behind the page sits the kernel, the Python that runs each cell and keeps what it made." },
          { at: 440, text: "The page reads top to bottom. The kernel remembers whatever ran, in the order it ran." },
          { at: 528, text: "Here is that notebook. Cell 4 turns the duration column from seconds into minutes." },
          { at: 616, text: "Run cell 4 once and the average trip is 14 minutes. Run it again and it drops to 0.23." },
          { at: 705, text: "The page shows cell 4 once. The kernel divided every duration by 60 twice." },
          { at: 793, text: "The brackets beside each cell give the run order. Cell 4 says [9], after the cells below." },
          { at: 882, text: "Restart the kernel on purpose, run every cell, and the average is back to 14 minutes." },
          { at: 970, text: "Do that before any notebook goes out, then diagnose the broken ones in the practice set." },
        ],
        asks: [
          {
            q: "What does the kernel keep?",
            at: 352,
            body: "At 05:52 the lesson describes the kernel as the Python behind the page. It runs each cell and keeps what that cell made.",
          },
          {
            q: "Why did the trip drop to 0.23 minutes?",
            at: 705,
            body: "At 11:45 the lesson explains that cell 4 appears once on the page, but the kernel divided every duration by 60 twice. The cell had run two times.",
          },
          {
            q: "What do the numbers in brackets mean?",
            at: 793,
            body: "At 13:13 the lesson reads the brackets beside each cell as the run order. Cell 4 says [9], so it ran after the cells below it.",
          },
        ],
        practice: [
          {
            q: "A notebook ran fine all week. After you restart the kernel and run every cell, cell 6 fails. What happened?",
            options: ["The restart broke the notebook", "Cell 6 needs something that ran out of order", "The kernel needs a second restart"],
            answer: 1,
            why: "A clean run goes top to bottom once, so a cell that depended on a different order breaks.",
            at: 440,
          },
          {
            q: "Cell 4 divides the duration column by 60. You run it, then run it again. What is the average trip now?",
            options: ["14 minutes, the same as before", "An error, since the column changed", "0.23 minutes, divided by 60 twice"],
            answer: 2,
            why: "The kernel kept the first run's minutes, so the second run divided them by 60 again.",
            at: 616,
          },
          {
            q: "Cell 4 shows [9], and cells 5 to 8 below it show [5] to [8]. What does that tell you?",
            options: ["Cell 4 ran after the cells below it", "Cell 4 has run nine times", "Cells 5 to 8 failed to run"],
            answer: 0,
            why: "The number in brackets is the run order, so [9] came after [5] to [8].",
            at: 793,
          },
        ],
      },
    },
  },

  c19: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "“Checkout test: clear win,” said the subject line. It won on the 17th metric we checked." },
          { at: 41, text: "Bookings were flat. Clicks on “Save this address” rose 9 percent and made the memo." },
          { at: 82, text: "Check 20 metrics at the usual 5 percent bar and expect one to win by luck alone." },
          { at: 124, text: "Every test in this course starts from two lines you write before launch." },
          { at: 165, text: "The first is one hypothesis: what you change, for whom, and what should happen." },
          { at: 206, text: "We wrote: a delivery price on the first screen will lift completed bookings on mobile." },
          { at: 247, text: "The second is one primary metric, the number that decides the test: bookings per visitor." },
          { at: 289, text: "Today 3.2 percent of mobile visitors complete a booking. We judge the test against that." },
          { at: 330, text: "Everything else you track is secondary. It can explain a result and never decide one." },
          { at: 372, text: "Date both and share them before launch, so the metric stays put once data comes in." },
          { at: 413, text: "One practice question below lays out three test plans. Pick the one you could defend." },
        ],
        asks: [
          {
            q: "Why doesn't a win on metric 17 count?",
            at: 82,
            body: "At 01:22 the lesson explains that if you check 20 metrics at the usual 5 percent bar, you should expect one to win by luck alone. Metric 17 could be that one.",
          },
          {
            q: "What goes into a hypothesis?",
            at: 165,
            body: "At 02:45 the lesson defines the hypothesis in three parts: what you change, for whom, and what should happen. It is written down before launch.",
          },
          {
            q: "Can a secondary metric decide the test?",
            at: 330,
            body: "At 05:30 the lesson calls everything else you track secondary. It can explain a result, and it never decides one.",
          },
        ],
        practice: [
          {
            q: "A test tracked 20 metrics, and one cleared the 5 percent bar. How much weight should that one win get?",
            options: ["Full weight, since it cleared the bar", "Full weight, if it is about revenue", "Little, since one in 20 clears it by luck"],
            answer: 2,
            why: "At the 5 percent bar you should expect one of 20 metrics to clear it by luck alone.",
            at: 82,
          },
          {
            q: "Three plans for the same checkout test. Which one states a hypothesis you could defend?",
            options: ["The new checkout will perform better", "A price on the first screen lifts mobile bookings", "We will see what moves after launch"],
            answer: 1,
            why: "It says what changes, for whom and what should happen, the three parts a hypothesis needs.",
            at: 165,
          },
          {
            q: "Bookings per visitor held at 3.2 percent while time on page rose 12 percent. What did the test find?",
            options: ["No lift on the metric that decides it", "A win on time on page", "A need for a second primary metric"],
            answer: 0,
            why: "Bookings per visitor was fixed as the primary metric before launch, and a secondary number never decides the test.",
            at: 330,
          },
        ],
      },
    },
  },

  c21: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "How many drivers will each depot need next week? That was the whole request." },
          { at: 40, text: "A model cannot answer that as asked. It predicts a number, for a unit, at a point in time." },
          { at: 81, text: "The first job is translating it, in four fields, before anyone writes a line of code." },
          { at: 122, text: "Target: parcels arriving at one depot in one day. We book drivers against that number." },
          { at: 164, text: "Unit: each of our 38 depots, each day. That makes 266 predictions a week." },
          { at: 205, text: "Horizon: we book shifts on Thursday for the week after, so 4 to 10 days ahead." },
          { at: 247, text: "Decision time: 2 p.m. Thursday, when the schedule locks. The forecast must exist by then." },
          { at: 288, text: "Our first model forecast tomorrow's parcels within 4 percent. The notebook looked great." },
          { at: 330, text: "Our planners could not use it. They had booked tomorrow's drivers days before it arrived." },
          { at: 371, text: "A wrong horizon turns the best score in the notebook into an answer to nobody's question." },
          { at: 412, text: "Our depots supplied the cases in the practice set. Translate each one into fields." },
        ],
        asks: [
          {
            q: "Why can't a model answer the request?",
            at: 40,
            body: "At 00:40 the lesson says a model predicts a number, for a unit, at a point in time. The request about drivers has to be translated into those first.",
          },
          {
            q: "How far ahead does the forecast need to be?",
            at: 205,
            body: "At 03:25 the lesson sets the horizon at 4 to 10 days. Shifts are booked on Thursday for the week after, so the forecast has to reach that far.",
          },
          {
            q: "Why was the 4 percent model no use?",
            at: 330,
            body: "At 05:30 the lesson explains that tomorrow's drivers had been booked days before the forecast arrived. So nobody could act on it.",
          },
        ],
        practice: [
          {
            q: "Operations wants parcel counts for each of our 38 depots, every day of next week. How many predictions is that?",
            options: ["38, one for each depot", "266, one for each depot-day", "7, one for each day"],
            answer: 1,
            why: "The unit is a depot-day, and 38 depots over 7 days make 266 predictions a week.",
            at: 164,
          },
          {
            q: "Depots book weekend staff every Tuesday for the Saturday and Sunday that follow. What horizon does that forecast need?",
            options: ["4 to 5 days ahead", "One day ahead, rerun each night", "The whole next month"],
            answer: 0,
            why: "Tuesday to Saturday is 4 days and Tuesday to Sunday is 5, so the forecast has to see that far.",
            at: 205,
          },
          {
            q: "A model forecasts tomorrow's parcels within 4 percent, and we book drivers days ahead. What is wrong with it?",
            options: ["4 percent is too much error for staffing", "It needs weather as a feature", "Its forecast arrives after the drivers are booked"],
            answer: 2,
            why: "The drivers are booked 4 to 10 days out, so a forecast of tomorrow lands after the decision.",
            at: 330,
          },
        ],
      },
    },
  },

  c27: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "In 2019 my Mondays began at 6:40, pasting sales exports from 400 stores into one workbook." },
          { at: 63, text: "I automated it that spring, and each of its three sources broke in its own way by winter." },
          { at: 126, text: "So before you script a report, list its sources. Mine: an export, an API, a shared drive." },
          { at: 189, text: "The export is sales_week.csv, which the point-of-sale system replaces each Monday by 5:30." },
          { at: 252, text: "The API is the online store's orders endpoint, which answers whenever a script asks." },
          { at: 315, text: "The shared drive holds targets.xlsx, a sheet that eleven regional managers edit by hand." },
          { at: 378, text: "For each source, write down where it lives, when it is ready and who can change its shape." },
          { at: 441, text: "One Monday the export landed at 6:20, and my script had run at 6:00." },
          { at: 503, text: "It found last week's file, and 400 stores got last week's sales under this week's date." },
          { at: 566, text: "Nothing crashed, and that is the trap: a source can go wrong without raising an error." },
          { at: 630, text: "Shared sheets do it too. A manager inserts a column, and the script reads the wrong one." },
          { at: 693, text: "Each question under this video is a Monday that went wrong. Work out why." },
        ],
        asks: [
          {
            q: "What sources did the Monday report read?",
            at: 126,
            body: "At 02:06 the lesson lists the sources of the Monday workbook: an export, an API and a shared drive. List every one before you automate the report.",
          },
          {
            q: "Why did the stores get last week's sales?",
            at: 503,
            body: "At 08:23 the lesson explains that the script ran before the new export landed and found last week's file. So 400 stores got old sales under this week's date.",
          },
          {
            q: "How can a shared sheet break my script?",
            at: 630,
            body: "At 10:30 the lesson shows a manager inserting a column in the targets sheet. The script then reads the wrong column, and no error comes up.",
          },
        ],
        practice: [
          {
            q: "The script runs at 6:00 and the sales export lands at 6:20. What do the 400 stores receive?",
            options: ["An error email in place of the report", "Last week's sales under this week's date", "A report with the sales columns blank"],
            answer: 1,
            why: "The script found last week's sales_week.csv still in the folder and read it without an error.",
            at: 503,
          },
          {
            q: "Which of the three notes on a source would have warned you about the 6:20 export?",
            options: ["Where it lives", "Who can change its shape", "When it is ready"],
            answer: 2,
            why: "A late export is a timing problem, and timing is the note on when a source is ready.",
            at: 378,
          },
          {
            q: "A regional manager inserts a column in targets.xlsx. What happens on the next run?",
            options: ["The script reads the wrong column, with no error", "The script stops with an error", "The sheet locks until the manager closes it"],
            answer: 0,
            why: "The inserted column shifts the rest, and the script reads whatever now sits in the old place.",
            at: 630,
          },
        ],
      },
    },
  },

  // Taught in Spanish, so its lesson is written in Spanish too.
  c29: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Donde trabajo, el informe de vacunación de cada lunes sale de un notebook de Python." },
          { at: 62, text: "Un notebook es una página de celdas, y cada celda guarda un trozo de código o de texto." },
          { at: 124, text: "Pulsas Mayús e Intro y la celda se ejecuta. El resultado aparece justo debajo." },
          { at: 187, text: "Quien la ejecuta es el kernel, un Python que sigue vivo mientras el notebook está abierto." },
          { at: 250, text: "El kernel recuerda lo que crea cada celda, aunque luego la borres de la página." },
          { at: 312, text: "En marzo borré la celda 3, la que cargaba la población de cada área de salud." },
          { at: 375, text: "El informe salió bien tres lunes más, porque la variable poblacion seguía en mi kernel." },
          { at: 437, text: "Luego se lo pasé a Marta, de mi equipo, que lo ejecutó entero en su ordenador." },
          { at: 500, text: "En la celda 7 le saltó un NameError: name 'poblacion' is not defined." },
          { at: 562, text: "Su kernel empezaba de cero. El mío guardaba cosas que ya no estaban en la página." },
          { at: 625, text: "Por eso, antes de enviar un notebook, reinicio el kernel y ejecuto todas las celdas." },
          { at: 688, text: "Debajo del vídeo tienes tres preguntas sobre aquel notebook. Resuélvelas antes de seguir." },
        ],
        asks: [
          {
            q: "¿Qué hace el kernel?",
            at: 187,
            body: "En el 03:07 la lección presenta el kernel como el Python que ejecuta cada celda. Sigue vivo mientras el notebook está abierto.",
          },
          {
            q: "¿Por qué el informe seguía funcionando?",
            at: 375,
            body: "En el 06:15 la lección cuenta que el informe salió bien tres lunes más tras borrar la celda 3. La variable poblacion seguía en el kernel.",
          },
          {
            q: "¿Por qué a Marta le salió un NameError?",
            at: 562,
            body: "En el 09:22 la lección lo explica: el kernel de Marta empezaba de cero. El de Lucía guardaba cosas que ya no estaban en la página.",
          },
        ],
        practice: [
          {
            q: "Borras la celda que creaba la variable poblacion. ¿Dónde sigue existiendo esa variable?",
            options: ["En el kernel, hasta que lo reinicies", "En ninguna parte: se fue con la celda", "En el archivo del notebook, al guardarlo"],
            answer: 0,
            why: "El kernel recuerda lo que crea cada celda, aunque la celda ya no esté en la página.",
            at: 250,
          },
          {
            q: "El notebook funciona en tu ordenador, pero a una compañera le da NameError en la celda 7. ¿Qué es lo más probable?",
            options: ["Tiene otra versión de Python", "Le falta instalar pandas", "Tu kernel guarda algo que la página ya no crea"],
            answer: 2,
            why: "Su kernel empieza de cero y solo tiene lo que crean las celdas que siguen en la página.",
            at: 562,
          },
          {
            q: "¿Qué haces antes de enviarle un notebook a otra persona?",
            options: ["Guardarlo dos veces para no perder nada", "Reiniciar el kernel y ejecutar todas las celdas", "Borrar las celdas que ya no uses"],
            answer: 1,
            why: "Así el notebook se ejecuta desde cero, igual que en el ordenador de quien lo recibe.",
            at: 625,
          },
        ],
      },
    },
  },

  c33: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "You have twelve monthly files of flight delays, and by lunch they should be one table." },
          { at: 37, text: "Stack them with pd.concat and it runs clean, with 24 columns where you expected 18." },
          { at: 75, text: "It lines columns up by name, and the twelve files do not agree on the names." },
          { at: 112, text: "Card networks send my team files like this every month, and our first move never changes." },
          { at: 150, text: "Read only the headers first. pd.read_csv with nrows=0 gives you the columns and no rows." },
          { at: 187, text: "Group the twelve files by header and three groups fall out. Those are your three schemas." },
          { at: 224, text: "January to April has 18 columns, with the departure delay in DEP_DELAY." },
          { at: 262, text: "May to September renames four of them, so DEP_DELAY turns into dep_delay_min." },
          { at: 299, text: "October to December keeps those names, adds two columns and writes dates as 14/10/2025." },
          { at: 336, text: "Now the 24 add up. Each renamed column appears twice, and each copy is empty for months." },
          { at: 374, text: "Write the three schemas down before renaming anything. That note opens your decision log." },
          { at: 411, text: "The practice set hands you a header from one of the twelve. Say which months it came from." },
        ],
        asks: [
          {
            q: "Why doesn't concat warn me?",
            at: 75,
            body: "At 01:15 the lesson explains that concat lines columns up by name. The twelve files disagree on the names, and concat keeps every name it finds.",
          },
          {
            q: "How do I read just the headers?",
            at: 150,
            body: "At 02:30 the lesson reads only the headers, with pd.read_csv and nrows=0. That gives you the columns of each file and none of its rows.",
          },
          {
            q: "Why did concat give me 24 columns?",
            at: 336,
            body: "At 05:36 the lesson adds up the 24: each renamed column appears twice, and each copy is empty for months. Four renames and two new columns take 18 to 24.",
          },
        ],
        practice: [
          {
            q: "What does pd.read_csv(path, nrows=0) give you?",
            options: ["The column names and no rows", "The first row of data", "The number of rows in the file"],
            answer: 0,
            why: "With nrows=0, pandas reads the header and no rows, which is all you need to compare files.",
            at: 150,
          },
          {
            q: "A file has 20 columns, and its departure delay sits in dep_delay_min. Which months did it come from?",
            options: ["January to April", "May to September", "October to December"],
            answer: 2,
            why: "October to December keeps the May renames and adds two columns, which takes 18 to 20.",
            at: 299,
          },
          {
            q: "DEP_DELAY is filled for January to April, dep_delay_min for May to December. How many delay columns does concat return?",
            options: ["One, merged by position", "Two, each empty for part of the year", "None, since the names clash"],
            answer: 1,
            why: "Concat lines columns up by name, so each spelling gets its own column, empty in the months that used the other.",
            at: 336,
          },
        ],
      },
    },
  },

  c35: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Plot two years of weekly charcoal sales at one store, and the line jumps every week." },
          { at: 54, text: "Store 212 sold 40 bags in one January week and 900 in one July week." },
          { at: 108, text: "That line is three lines added together, and reading a series means pulling them apart." },
          { at: 162, text: "Trend is the slow drift. Store 212 sells about 6 percent more charcoal each year." },
          { at: 216, text: "Season is the shape that repeats: a climb from April, a peak in July, a drop by September." },
          { at: 270, text: "Noise is what is left: 1,300 bags in a heat-wave week, 90 the week a delivery was missed." },
          { at: 324, text: "Trend and season set the number you plan to. Noise sets how wide the interval must be." },
          { at: 378, text: "Every April, sales double in four weeks, and somebody extends that line into the summer." },
          { at: 432, text: "Read as trend, that climb promises 1,600 bags a week by August. July runs near 900." },
          { at: 486, text: "That climb is season. It came every April and was gone by September, in both years." },
          { at: 540, text: "Trend, season or noise: every question in the practice set comes down to one. Name it." },
        ],
        asks: [
          {
            q: "How do I tell season from trend?",
            at: 216,
            body: "At 03:36 the lesson describes season as the shape that repeats: a climb from April, a peak in July, a drop by September. Trend is the slow drift under it.",
          },
          {
            q: "What decides how wide the interval is?",
            at: 324,
            body: "At 05:24 the lesson splits the work: trend and season set the number you plan to. Noise sets how wide the interval must be.",
          },
          {
            q: "Why not extend April's rise into summer?",
            at: 432,
            body: "At 07:12 the lesson treats April's climb as trend, and the line promises 1,600 bags a week by August. July runs near 900.",
          },
        ],
        practice: [
          {
            q: "Store 212 sold 1,300 bags of charcoal in one heat-wave week. Which part of the series is that?",
            options: ["Trend: the store keeps growing", "Season: July is always high", "Noise: what is left after the other two"],
            answer: 2,
            why: "The heat-wave week sits above what trend and season explain, and what is left over is noise.",
            at: 270,
          },
          {
            q: "Which part of the series decides how wide the interval around a forecast must be?",
            options: ["Trend, since growth compounds", "Noise, the part left after trend and season", "Season, since the peaks move"],
            answer: 1,
            why: "Trend and season set the number you plan to, and noise sets how wide the interval around it must be.",
            at: 324,
          },
          {
            q: "Sales double every April and are back down by September, two years running. What is that climb?",
            options: ["Season, the shape that comes back each year", "Trend, the store growing fast", "Noise, a run of warm weeks"],
            answer: 0,
            why: "A climb that returns every April and leaves by September is the repeating shape called season.",
            at: 486,
          },
        ],
      },
    },
  },
};
