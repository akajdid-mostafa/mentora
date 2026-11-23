// Lesson one of every Business course, written out: its transcript, the
// three questions the tutor offers on it and the practice set under the
// video. Lesson one is free on every course, so it is the lesson a visitor
// opens from any card, and the one lesson of these courses the demo learner
// can take in full without enrolling.

import type { CoursePack } from "@/components/course/lessons/types";

export const business: Record<string, CoursePack> = {
  c10: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "You have inherited a model with nine tabs, and the analyst who built it left in June." },
          { at: 41, text: "Readable means somebody who never met you can trace any number back to its source." },
          { at: 97, text: "On the trading desk, my reviewer opened every model by pressing F2 on three random cells." },
          { at: 150, text: "If tracing those three took more than a minute, the model came back to me unread." },
          { at: 207, text: "Time runs across the columns: 2026 in E, 2027 in F, 2028 in G, on every sheet." },
          { at: 255, text: "Each row holds one line item: its label in B, its unit in C, and where it came from in D." },
          { at: 311, text: "Blue text is a number somebody typed. Black is a formula, green a link to another sheet." },
          { at: 364, text: "Take our retailer: 24 stores and $2.55 million of sales a store, both typed, both blue." },
          { at: 409, text: "Revenue in row 14 is black: 24 stores times $2.55 million, $61.2 million for 2026." },
          { at: 458, text: "What fails review most is a typed number left in black, in a row of formulas." },
          { at: 502, text: "Last year I found 4.1% typed over 2028's growth formula. Nothing on the sheet flagged it." },
          { at: 537, text: "Below the video are three cells from that sheet. Read each one as my reviewer would." },
        ],
        asks: [
          {
            q: "What does readable mean for a model?",
            at: 41,
            body: "At 00:41 the lesson defines it: somebody who never met you can trace any number back to its source. On Priya's desk, a reviewer tested that on three cells.",
          },
          {
            q: "What do the text colors mean?",
            at: 311,
            body: "At 05:11 the lesson sets the code: blue is a number somebody typed, black is a formula, green is a link to another sheet. The retailer's 24 stores are blue.",
          },
          {
            q: "How can one typed number go unnoticed?",
            at: 458,
            body: "At 07:38 the lesson names what fails review most: a typed number left in black, in a row of formulas. Priya found a 4.1% like that, and nothing on the sheet flagged it.",
          },
        ],
        practice: [
          {
            q: "Cell G14 is black and reads $64.9 million. Pressing F2 shows a plain number, no formula. What is wrong with it?",
            options: ["It is a typed number passing for a formula", "Nothing: black text marks a checked cell", "Its unit is missing from column C"],
            answer: 0,
            why: "Black promises a formula, so a typed number in black hides an input where a reviewer would not look.",
            at: 458,
          },
          {
            q: "On the balance sheet, 2027's inventory sits in column G. What is wrong with that cell?",
            options: ["Nothing: each sheet can set its own columns", "The year should run down the rows instead", "2027 belongs in column F, as on every sheet"],
            answer: 2,
            why: "Time runs across the columns the same way on every sheet, so 2027 sits in column F everywhere.",
            at: 207,
          },
          {
            q: "You type the retailer's store count, 24, into its cell. What color should the text be?",
            options: ["Black, like revenue in row 14", "Blue, because somebody typed it", "Green, since revenue reads from it"],
            answer: 1,
            why: "Blue marks a number somebody typed, and the store count is typed, so it goes in blue.",
            at: 311,
          },
        ],
      },
    },
  },
  c11: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "A founder I advise sells booking software to physical therapy clinics at $29 a month." },
          { at: 47, text: "The founder asked me whether $29 was too high. I asked what one clinic costs to serve." },
          { at: 93, text: "That second number is the cost floor. Below it, every clinic you sign makes you poorer." },
          { at: 146, text: "So we listed a clinic's month of costs, line by line, the way my old desk would." },
          { at: 188, text: "Each clinic sends 600 reminder texts a month, at two cents each. That is $12." },
          { at: 239, text: "Hosting is $160 a month, shared by 40 clinics, so $4 each." },
          { at: 287, text: "Card fees take $1.14 of every $29 payment before the money reaches the bank." },
          { at: 342, text: "Then support. A clinic needs about an hour a month, and that hour costs $25 to staff." },
          { at: 391, text: "The floor comes to $42.14. At $29, every clinic loses $13.14 a month, $525.60 across 40." },
          { at: 444, text: "Most founders price from the hosting bill alone, and at $4 a clinic, $29 looks generous." },
          { at: 489, text: "Wherever the next two lessons take the price, it has to stay above $42.14." },
          { at: 534, text: "Try the floor on a second product first. Its bills are in the practice set below." },
        ],
        asks: [
          {
            q: "What is a cost floor?",
            at: 93,
            body: "At 01:33 the lesson defines it as what one customer costs you to serve in a month. Below it, every customer you sign makes you poorer.",
          },
          {
            q: "Why count support time in the floor?",
            at: 342,
            body: "At 05:42 the lesson counts about an hour of support a clinic each month, at the $25 that hour costs to staff. It is the largest of the four costs in the $42.14 floor.",
          },
          {
            q: "Isn't $29 plenty if hosting is $4?",
            at: 444,
            body: "At 07:24 Priya names the usual mistake, pricing from the hosting bill alone, which makes $29 look generous. Add texts, card fees and support, and the floor is $42.14.",
          },
        ],
        practice: [
          {
            q: "A studio app pays $250 a month for hosting, shared by 50 studios. What does hosting add to one studio's floor?",
            options: ["$250 a month", "$50 a month", "$5 a month"],
            answer: 2,
            why: "A shared bill splits across the customers sharing it: $250 over 50 studios is $5 each.",
            at: 239,
          },
          {
            q: "Per studio: $5 of hosting, $6 of texts, $1.30 of card fees and half an hour of support at $30 an hour. What is the floor?",
            options: ["$27.30 a month", "$12.30 a month", "$42.30 a month"],
            answer: 0,
            why: "Half an hour at $30 is $15, and $5, $6, $1.30 and $15 add up to $27.30.",
            at: 391,
          },
          {
            q: "The studio app's founder charges $20 a month, since hosting is $5 a studio. What did that price leave out?",
            options: ["Nothing: $20 is four times the hosting", "The texts, the card fees and the support", "What rival studio apps charge"],
            answer: 1,
            why: "Hosting is one line of four, and the other three lift the floor to $27.30, above the $20 price.",
            at: 444,
          },
        ],
      },
    },
  },
  c12: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "My first company launched to small businesses, which is to say to nobody in particular." },
          { at: 52, text: "We spent $3,000 on ads aimed at them and got four signups. Not one of them paid a cent." },
          { at: 99, text: "A segment has no inbox. The first hundred start with one person you can name." },
          { at: 158, text: "My second company's plan opened on Dana, who ran dispatch for a plumber with 14 vans." },
          { at: 206, text: "Every morning at 6:30, Dana rebuilt the day's schedule by hand, on a whiteboard." },
          { at: 263, text: "That is what a name gives you: a job, a problem, and the hour the problem shows up." },
          { at: 321, text: "In a week I had ten people like Dana in a spreadsheet, each with a name and a company." },
          { at: 369, text: "Seven of the ten took a call with me, and three became our first paying customers." },
          { at: 427, text: "The test for every name: could you message them tomorrow, and would they know why?" },
          { at: 486, text: "Personas fail that test. Busy Ben, 38, has a stock photo and has never paid anyone." },
          { at: 538, text: "If a name on your list is one you made up, cross it out and go find the real person." },
          { at: 594, text: "The practice set under this video comes first, and your own list of ten comes next." },
        ],
        asks: [
          {
            q: "Why not aim at small businesses?",
            at: 99,
            body: "At 01:39 Sam puts it in five words: a segment has no inbox. The first hundred start with one person you can name.",
          },
          {
            q: "What should I note about each person?",
            at: 263,
            body: "At 04:23 the lesson lists what a name gives you: a job, a problem, and the hour the problem shows up. For Dana, that was a whiteboard schedule at 6:30 a.m.",
          },
          {
            q: "How do I know a name is good enough?",
            at: 427,
            body: "At 07:07 the lesson gives the test: could you message them tomorrow, and would they know why? A name you made up fails it and comes off the list.",
          },
        ],
        practice: [
          {
            q: "Which of these is a first customer you can name?",
            options: ["Owners of plumbing firms with 10 to 20 vans", "Dana, dispatcher at a plumber with 14 vans", "Ben, 38, a dispatcher persona from a survey"],
            answer: 1,
            why: "Dana is one real person with a job and a company, and you can message her tomorrow.",
            at: 158,
          },
          {
            q: "You have ten names in your spreadsheet. What test does each one have to pass?",
            options: ["You could message them tomorrow and they'd know why", "They match the persona in your launch plan", "They would click an ad aimed at their segment"],
            answer: 0,
            why: "The test has two halves: you can reach the person tomorrow, and they can see why you wrote.",
            at: 427,
          },
          {
            q: "Ads aimed at small businesses brought four signups and no payers. What was the launch plan missing?",
            options: ["A bigger budget for the ads", "A lower price for small firms", "One person it could name"],
            answer: 2,
            why: "A segment has no inbox, and the first hundred start with one person you can name.",
            at: 99,
          },
        ],
      },
    },
  },
  c16: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Sales, support and the CEO each want something from you, and all three call it urgent." },
          { at: 84, text: "It is your first week at Haulway, the moving marketplace we follow through one quarter." },
          { at: 171, text: "Sales wants an office-moves tier, support a reschedule button, the CEO home-page reviews." },
          { at: 268, text: "You decide three things: which problem comes next, for whom, and what counts as solved." },
          { at: 352, text: "How it gets built belongs to engineering. How it looks and works belongs to design." },
          { at: 447, text: "Haulway's data shows a problem nobody asked about: movers cancel 11% of Saturday jobs." },
          { at: 541, text: "Most cancel the day before, and two in three of those customers never book again." },
          { at: 628, text: "So the problem is late cancellations, for Saturday customers. Solved is under 5% by June." },
          { at: 724, text: "The three asks wait, and each one gets a line from you, in writing, saying why." },
          { at: 811, text: "Past that point, the fix belongs to the team. I learned that in my first product role." },
          { at: 906, text: "My spec at the used-car marketplace drew a button, color and all. The number stayed flat." },
          { at: 1003, text: "Haulway's week goes on in the practice set below, with three more decisions to make." },
        ],
        asks: [
          {
            q: "What does a product manager decide?",
            at: 268,
            body: "At 04:28 Eva names three decisions: which problem comes next, for whom, and what counts as solved. How it gets built and how it looks belong to engineering and design.",
          },
          {
            q: "Why cancellations over the three asks?",
            at: 541,
            body: "At 09:01 the lesson gives the reason: most cancellations come the day before, and two in three of those customers never book again. None of the three asks touches it.",
          },
          {
            q: "Should my spec say how the button looks?",
            at: 906,
            body: "At 15:06 Eva tells of a spec that drew a button, color and all, and the number stayed flat. Past the problem and the goal, the fix belongs to the team.",
          },
        ],
        practice: [
          {
            q: "Haulway has three asks and room for one. What do you decide first?",
            options: ["How engineering should build the fix", "What the new button should look like", "Which problem the team takes on next"],
            answer: 2,
            why: "Which problem comes next is the product manager's call, and the build and the design follow from it.",
            at: 268,
          },
          {
            q: "Movers cancel 11% of Saturday jobs. Which goal tells the team what counts as solved?",
            options: ["Make cancellations hurt customers less", "Under 5% of Saturday jobs canceled by June", "Ship a cancellation screen this quarter"],
            answer: 1,
            why: "A goal the team can check has a number and a date, and under 5% by June gives it both.",
            at: 628,
          },
          {
            q: "Your spec sets the color and label of the reschedule button. Whose decision have you taken?",
            options: ["Design's", "Engineering's", "The CEO's"],
            answer: 0,
            why: "How the fix looks and works belongs to design, and a button's color and label are part of that.",
            at: 352,
          },
        ],
      },
    },
  },
  c20: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "The email says $104,000, a start date six weeks out, and an answer by Friday." },
          { at: 49, text: "I sent about sixty offers from my two companies, so I know the other side of that email." },
          { at: 108, text: "Every one of them came from a pay band for the role, written down before we met anyone." },
          { at: 163, text: "Your first job is to find that band from the outside, and you need three sources for it." },
          { at: 227, text: "One: job posts for your title in your city. Many of them print a pay range now." },
          { at: 281, text: "Two: people who do this job at other companies. Ask what a new hire there gets." },
          { at: 344, text: "Three: the recruiter, who has the band on screen during your call. Ask for it." },
          { at: 397, text: "For a senior product designer in Chicago, twelve posts put the band's middle at $116,000." },
          { at: 459, text: "Nine of the twelve start above $104,000, so this offer sits near the bottom." },
          { at: 516, text: "A national average misleads the most: it mixes juniors, leads and every city." },
          { at: 574, text: "A friend's salary misleads the same way: another company, another year, another level." },
          { at: 631, text: "Leave that email unanswered until you have done the practice set under this video." },
        ],
        asks: [
          {
            q: "Where do I find the pay band?",
            at: 163,
            body: "At 02:43 the lesson says to find it from the outside, with three sources. They are job posts for your title and city, people who do the job elsewhere, and the recruiter.",
          },
          {
            q: "Should I ask the recruiter for the band?",
            at: 344,
            body: "At 05:44 Sam says yes: the recruiter has the band on screen during your call, so ask for it. It is the third of the three sources.",
          },
          {
            q: "Is a national average good enough?",
            at: 516,
            body: "At 08:36 the lesson calls it the number that misleads the most, because it mixes juniors, leads and every city. A friend's salary misleads the same way.",
          },
        ],
        practice: [
          {
            q: "Ten posts for your role start between $88,000 and $97,000. Your offer is $86,000. Where does it sit?",
            options: ["Near the middle of the bands", "Below every band you found", "Above most of the bands"],
            answer: 1,
            why: "An offer under the lowest start of all ten posted bands sits below every one of them.",
            at: 459,
          },
          {
            q: "How many sources does the lesson ask for before you trust a pay band?",
            options: ["One good salary site", "Two friends in the same role", "Three: posts, people and the recruiter"],
            answer: 2,
            why: "The band comes from three sources: job posts, people doing the job elsewhere, and the recruiter.",
            at: 163,
          },
          {
            q: "A salary site puts product designers at $97,000 across the US. Why is that a weak guide to your band?",
            options: ["It mixes juniors, leads and every city", "Sites like that count only freelancers", "The figure is older than your offer"],
            answer: 0,
            why: "A national average blends every level and city, so it says little about the band for your role.",
            at: 516,
          },
        ],
      },
    },
  },
  c22: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Two files, ten years of daily closes: sp500.csv from New York, ftse100.csv from London." },
          { at: 86, text: "In a spreadsheet you would paste the two columns side by side and start on the returns." },
          { at: 178, text: "Here a price means nothing without its date, so the date becomes the index of each series." },
          { at: 262, text: "We load each file with read_csv, Date as index_col and parse_dates set to True." },
          { at: 355, text: "The New York file comes back with 2,515 rows, and the London file with 2,528." },
          { at: 441, text: "The calendars differ. London trades on Thanksgiving, and New York on Easter Monday." },
          { at: 530, text: "By hand first: turn each index into a set of dates, and the overlap holds 2,470 of them." },
          { at: 622, text: "Then one line: pd.concat with axis=1 and join set to inner gives the same 2,470 rows." },
          { at: 707, text: "Outer gives 2,573 rows and 103 gaps. For returns, we keep the 2,470 days both traded." },
          { at: 798, text: "The side-by-side paste is the trap: after one holiday, every row pairs two different days." },
          { at: 889, text: "On the desk I found a hedge built on a paste like that, a day out of line since Easter." },
          { at: 996, text: "The practice set below puts these two files through three joins. Say what each returns." },
        ],
        asks: [
          {
            q: "Why make the date the index?",
            at: 178,
            body: "At 02:58 the lesson says a price means nothing without its date. That is why each file is loaded with Date as its index.",
          },
          {
            q: "Why do the files have different lengths?",
            at: 441,
            body: "At 07:21 the lesson puts it down to calendars: London trades on Thanksgiving and New York on Easter Monday. That is why the files hold 2,515 and 2,528 rows.",
          },
          {
            q: "Inner or outer join for returns?",
            at: 707,
            body: "At 11:47 the lesson compares the two: outer gives 2,573 rows and 103 gaps. For returns, Priya keeps the 2,470 days both markets traded.",
          },
        ],
        practice: [
          {
            q: "You run pd.concat on the two series with axis=1 and join set to inner. How many rows come back?",
            options: ["2,515", "2,470", "2,573"],
            answer: 1,
            why: "Inner keeps only the dates both files share, and the overlap of the two indexes holds 2,470.",
            at: 622,
          },
          {
            q: "With join left as outer, what fills the cells for days when one market was shut?",
            options: ["Gaps, with no price in them", "The last close, carried forward", "Zeros, since nothing traded"],
            answer: 0,
            why: "An outer join keeps every date from both files and leaves a gap wherever one market has no close.",
            at: 707,
          },
          {
            q: "You paste the two columns of closes side by side in a sheet. What goes wrong after the first holiday?",
            options: ["Every row after it pairs two different days", "The sheet drops the holiday row", "Nothing, both files cover ten years"],
            answer: 0,
            why: "A paste lines rows up by position, so one market's holiday shifts every row after it by a day.",
            at: 798,
          },
        ],
      },
    },
  },
  c25: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "What does one customer pay you in a month? An investor asked me that at our seed pitch." },
          { at: 36, text: "I said $49, the price on our website. The investor divided our revenue by our customers." },
          { at: 77, text: "March brought in $23,160 across 600 customers: $38.60 each, $10.40 short of my answer." },
          { at: 113, text: "Revenue per customer is what customers paid you in a month, divided by how many paid." },
          { at: 153, text: "It goes in B4 on the first tab of my seed-round sheet, and every other tab reads from it." },
          { at: 190, text: "Three things sat between $49 and $38.60: a launch discount, annual plans, and refunds." },
          { at: 231, text: "One customer paid $468 for a year in January. We count $39 a month, for twelve months." },
          { at: 270, text: "Refunds come off the month you pay them back. March had $1,500 of them." },
          { at: 312, text: "Founders quote the price page, as I did. B4 comes from your invoices, month by month." },
          { at: 351, text: "Your own numbers go in B4 once the practice set under this video comes out right." },
        ],
        asks: [
          {
            q: "Where does $38.60 come from?",
            at: 77,
            body: "At 01:17 Sam divides March's revenue, $23,160, by 600 customers. That gives $38.60 each, $10.40 short of the $49 on the website.",
          },
          {
            q: "How do I count an annual plan?",
            at: 231,
            body: "At 03:51 the lesson spreads it over the year. A customer who paid $468 for a year in January counts as $39 a month, for twelve months.",
          },
          {
            q: "Can I use the price on my website?",
            at: 312,
            body: "At 05:12 the lesson says founders quote the price page, which is what went wrong at the seed pitch. B4 comes from your invoices, month by month.",
          },
        ],
        practice: [
          {
            q: "Your list price is $49. In May, 450 customers paid you $18,000, and 50 more were on free trials. Revenue per customer?",
            options: ["$36", "$40", "$49"],
            answer: 1,
            why: "Divide what customers paid by how many paid: $18,000 over 450 is $40, and the trials paid nothing.",
            at: 113,
          },
          {
            q: "A customer pays $600 for a year's plan in January. What does it add to January's revenue?",
            options: ["$600, the whole payment", "Nothing until the year ends", "$50, a twelfth of the payment"],
            answer: 2,
            why: "An annual plan counts a twelfth a month, so $600 adds $50 to January and to each month after.",
            at: 231,
          },
          {
            q: "An investor asks what one customer pays you a month. Where should the answer come from?",
            options: ["The price on your website", "Last month's invoices, divided by who paid", "The average of your plans' prices"],
            answer: 1,
            why: "Revenue per customer is what customers paid in a month, after discounts and refunds, over how many paid.",
            at: 312,
          },
        ],
      },
    },
  },
  // Taught in French, so its lesson is written in French too. The space
  // before ? and : and the spaces inside figures such as 180 k€ are no-break
  // spaces (U+00A0), so a caption never wraps between them.
  c31: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "En pleine série A, un associé du fonds a ouvert notre modèle pour y chercher le burn." },
          { at: 40, text: "Il lui a fallu deux minutes pour tomber sur nos 180 k€ par mois, en silence, face à moi." },
          { at: 88, text: "Un classeur lisible permet à un inconnu d'y trouver un chiffre en trente secondes." },
          { at: 127, text: "Tout part de l'ordre des onglets, qui se lisent de gauche à droite, comme des chapitres." },
          { at: 175, text: "Chez nous, ça donne : Couverture, Hypothèses, Revenus, Coûts, Trésorerie, puis Synthèse." },
          { at: 219, text: "La couverture indique la société, la date, la version et l'unité du modèle : le k€." },
          { at: 262, text: "Cette unité compte : un loyer de 4 200 euros tapé tel quel devient 4,2 millions." },
          { at: 306, text: "Puis le temps : 36 mois, de janvier 2027 en D à décembre 2029 en AM, dans chaque onglet." },
          { at: 349, text: "Le piège, ce sont les lignes masquées. Un analyste de fonds commence par les afficher." },
          { at: 393, text: "Il y trouve vos brouillons, et il se demande ce que vous lui cachez d'autre." },
          { at: 434, text: "Avant d'envoyer, enregistrez sur la couverture : c'est là que le fichier s'ouvrira." },
          { at: 476, text: "Sous la vidéo, trois questions sur ce que je corrige le plus souvent dans un modèle." },
        ],
        asks: [
          {
            q: "C'est quoi, un classeur lisible ?",
            at: 88,
            body: "À 01:28, la leçon le définit : un inconnu doit pouvoir y trouver un chiffre en trente secondes. L'associé de la série A avait mis deux minutes.",
          },
          {
            q: "Pourquoi écrire l'unité sur la couverture ?",
            at: 262,
            body: "À 04:22, Claire montre ce que coûte une unité oubliée : un loyer de 4 200 euros tapé tel quel devient 4,2 millions. D'où le k€ inscrit sur la couverture.",
          },
          {
            q: "Masquer des lignes, c'est grave ?",
            at: 349,
            body: "À 05:49, la leçon en fait le piège : un analyste de fonds commence par afficher les lignes masquées. Il y trouve vos brouillons et se demande ce que vous cachez d'autre.",
          },
        ],
        practice: [
          {
            q: "Votre modèle commence en colonne D avec janvier 2027. Dans l'onglet Coûts, où se trouve mars 2027 ?",
            options: ["En colonne F, comme dans chaque onglet", "Là où l'onglet Coûts le place", "En colonne H, après les totaux"],
            answer: 0,
            why: "Les 36 mois occupent les mêmes colonnes dans chaque onglet : D, E, F pour janvier, février, mars.",
            at: 306,
          },
          {
            q: "Le modèle est en k€, et la ligne Loyer affiche 4 200 chaque mois. Que s'est-il passé ?",
            options: ["Les bureaux coûtent 4,2 millions par mois", "Quelqu'un a tapé le loyer en euros", "La ligne affiche le loyer annuel"],
            answer: 1,
            why: "Dans un modèle en k€, 4 200 se lit 4,2 millions : le loyer a été tapé en euros.",
            at: 262,
          },
          {
            q: "Vous envoyez le classeur à un fonds ce soir. Sur quel onglet l'enregistrer ?",
            options: ["Hypothèses, pour lire dans l'ordre", "Synthèse, pour aller droit au but", "Couverture, là où il s'ouvrira"],
            answer: 2,
            why: "Le fichier s'ouvre sur l'onglet où vous l'avez enregistré, et la couverture annonce l'unité et la version.",
            at: 434,
          },
        ],
      },
    },
  },
};
