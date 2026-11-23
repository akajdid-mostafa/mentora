// Lesson one of every Engineering course, written out: its transcript, the
// three questions the tutor offers on it and the practice set under the
// video. Lesson one is free on every course, so it is the lesson a visitor
// opens from any card, and the one lesson of these courses the demo learner
// can take in full without enrolling.

import type { CoursePack } from "@/components/course/lessons/types";

export const engineering: Record<string, CoursePack> = {
  // Python beyond scripts: Reading your own script as a stranger would (16m)
  c4: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Every week at work I review a script like yours, and I start by trying to run it." },
          { at: 62, text: "I have none of the author's context: no shell history, no folder layout, no memory of why." },
          { at: 139, text: "A stranger gets the file and nothing else. What lives in your head has to move into it." },
          { at: 214, text: "So read your own script top to bottom as that stranger, with a blank list beside it." },
          { at: 301, text: "Here is payouts.py, 212 lines, which Leo on my team ran every Friday for two years." },
          { at: 371, text: "Line 3 opens a CSV in /Users/leo/Downloads. On any other laptop, it stops at that line." },
          { at: 452, text: "Line 41 skips rows where column 9 is under 50. I know why, and the file never says." },
          { at: 530, text: "Line 88 catches every exception and prints done, so a failed Friday looks like a good one." },
          { at: 618, text: "Each finding goes on the list as a question: where does the file come from, what is 50?" },
          { at: 690, text: "Leave line 3 alone for now. Fix it on sight and the list stops at one question." },
          { at: 774, text: "My list for payouts.py ran to nineteen questions, and this course answers every one." },
          { at: 851, text: "The practice set under the video walks through payouts.py. Read it as the stranger would." },
        ],
        asks: [
          {
            q: "Why read my script as a stranger?",
            at: 139,
            body: "At 02:19 the lesson says a stranger gets the file and nothing else. Anything you know that the file does not say has to move into it.",
          },
          {
            q: "What's wrong with catching every error?",
            at: 530,
            body: "At 08:50 the lesson shows line 88 of payouts.py catching every exception and printing done. A Friday run that failed then looks like a good one.",
          },
          {
            q: "Should I fix things as I find them?",
            at: 690,
            body: "At 11:30 the lesson says to leave line 3 alone for now: fix it on sight and the list stops at one question. Write every question down first.",
          },
        ],
        practice: [
          {
            q: "Line 3 of payouts.py opens a CSV in /Users/leo/Downloads. What happens when a stranger runs it?",
            options: ["It stops at line 3: the folder is not there", "It reads an empty file and carries on", "It asks the stranger where the file is"],
            answer: 0,
            why: "That folder exists only on Leo's laptop, so on any other machine the script stops at line 3.",
            at: 371,
          },
          {
            q: "You reach line 41, which skips rows where column 9 is under 50. What goes on your list?",
            options: ["A faster way to skip those rows", "A note to delete line 41", "The question: what is 50, and why skip below it?"],
            answer: 2,
            why: "Each finding goes on the list as a question, and only the author knows what 50 stands for.",
            at: 618,
          },
          {
            q: "You spot the hard-coded path on line 3 during your first read. What do you do?",
            options: ["Fix it at once, then read on", "Write it on the list and keep reading", "Stop and rewrite the whole script"],
            answer: 1,
            why: "Fixing it on sight stops the reading, and the list stops at one question.",
            at: 690,
          },
        ],
      },
    },
  },

  // HTTP, and what a framework hides: A request line, headers and a body (14m)
  c5: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "The longest outage my team had last year came down to one header nobody had read." },
          { at: 57, text: "A framework writes that header for you. For six weeks we go without one, in a terminal." },
          { at: 118, text: "A request is plain text in three parts: a request line, the headers, then the body." },
          { at: 181, text: "Start the course server and run curl -v localhost:8080/videos/42. Read the lines marked >." },
          { at: 247, text: "The first is GET /videos/42 HTTP/1.1: a method, a path and a version, split by spaces." },
          { at: 309, text: "Then the headers, one per line: Host, User-Agent, Accept. Each is a name, colon and value." },
          { at: 381, text: "An empty line ends the headers. Whatever the server reads after it belongs to the body." },
          { at: 452, text: "Now POST the body {\"title\":\"Café\"}, and curl adds Content-Length: 17 for you." },
          { at: 513, text: "Sixteen characters, seventeen bytes. In UTF-8 the é takes two bytes." },
          { at: 584, text: "Count characters and you send 16. The server stops a byte early and never sees the brace." },
          { at: 648, text: "That was our outage: one client counted characters, and every title with an accent broke." },
          { at: 719, text: "Read each request in the practice set the way the server does: line, headers, then body." },
        ],
        asks: [
          {
            q: "What are the three parts of a request?",
            at: 118,
            body: "At 01:58 the lesson splits a request into three parts of plain text: a request line, the headers and the body. It then reads each part in turn.",
          },
          {
            q: "How does a server know the headers ended?",
            at: 381,
            body: "At 06:21 the lesson points to the empty line after the last header. Whatever the server reads after that line belongs to the body.",
          },
          {
            q: "Why does curl send Content-Length 17?",
            at: 513,
            body: "At 08:33 the lesson counts the body in bytes. It has sixteen characters, but the é takes two bytes in UTF-8, so the body is seventeen bytes long.",
          },
        ],
        practice: [
          {
            q: "In the request line GET /videos/42 HTTP/1.1, what is /videos/42?",
            options: ["The Host header, shortened", "The path the request asks for", "The body of a GET request"],
            answer: 1,
            why: "A request line holds a method, a path and a version, split by spaces, and /videos/42 is the path.",
            at: 247,
          },
          {
            q: "A server has read Host, User-Agent and Accept, then an empty line. What does it read next?",
            options: ["One more header", "A second request line", "The body, if the request has one"],
            answer: 2,
            why: "An empty line ends the headers, and whatever the server reads after it belongs to the body.",
            at: 381,
          },
          {
            q: "The body {\"title\":\"Café\"} is sixteen characters long. What Content-Length does it need?",
            options: ["17, because é takes two bytes", "16, one for each character", "32, two bytes for each character"],
            answer: 0,
            why: "Content-Length counts bytes, and in UTF-8 the é takes two, so sixteen characters make seventeen bytes.",
            at: 513,
          },
        ],
      },
    },
  },

  // Relational data modelling: Listing the questions the data must answer (8m)
  c6: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "The orders schema in this course was drawn in one afternoon, from the checkout form." },
          { at: 36, text: "It answers every question the form asks. Finance asks others and waits a week for each." },
          { at: 74, text: "A model starts from the questions it must answer, written as sentences before any table." },
          { at: 113, text: "Here are three I got in one week at work, two from finance and one from support." },
          { at: 148, text: "How much did each merchant sell in March, in the currency the buyer paid in?" },
          { at: 186, text: "Which orders were refunded twice? What rate did we use on the day each order was paid?" },
          { at: 221, text: "Underline the nouns: merchant, order, currency, refund, rate. Those become entities." },
          { at: 259, text: "Refunded twice means a refund is a row of its own, with its own date and amount." },
          { at: 298, text: "The rate question means we keep the rate used that day. Today's rate is another number." },
          { at: 334, text: "Skip the questions today's reports already answer. They describe the schema you have." },
          { at: 372, text: "Ask whoever waits a week for a number. Those questions show what the model is missing." },
          { at: 410, text: "Your nouns come back in lesson 1.2. First, the practice set under this video." },
        ],
        asks: [
          {
            q: "Why write the questions before tables?",
            at: 74,
            body: "At 01:14 the lesson starts the model from the questions it must answer, written as sentences. The first schema came from a checkout form and missed what finance asks.",
          },
          {
            q: "Why does a refund need its own row?",
            at: 259,
            body: "At 04:19 the lesson reads it from the question about orders refunded twice. A refund then needs a row of its own, with its own date and amount.",
          },
          {
            q: "Can't I just use my current reports?",
            at: 334,
            body: "At 05:34 the lesson says to skip them, because today's reports describe the schema you already have. Ask whoever waits a week for a number.",
          },
        ],
        practice: [
          {
            q: "Support asks which orders were refunded twice. What does that tell you about refunds?",
            options: ["The order needs a refunded flag", "A refund is a row with its own date and amount", "Refunds need a table for each merchant"],
            answer: 1,
            why: "An order refunded twice has two refunds, so each refund needs a row, a date and an amount of its own.",
            at: 259,
          },
          {
            q: "Finance asks what rate each order was converted at on the day it was paid. What must the model keep?",
            options: ["The rate used, stored with the payment", "Today's rate, looked up when asked", "Only the merchant's home currency"],
            answer: 0,
            why: "Today's rate is another number, so the model keeps the rate used on the day of payment.",
            at: 298,
          },
          {
            q: "Which questions show you what the current schema is missing?",
            options: ["The ones today's reports already answer", "The fields on the checkout form", "The ones people wait a week to get answered"],
            answer: 2,
            why: "Today's reports describe the schema you have, and the week-long waits point at what it lacks.",
            at: 372,
          },
        ],
      },
    },
  },

  // Git beyond commit and push: Commits, trees and the pointers called branches (8m)
  c15: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "When Git goes wrong, most people I work with delete the folder and clone the repo again." },
          { at: 40, text: "That throws away every commit you never pushed, and Git was holding all of them." },
          { at: 77, text: "A commit is a snapshot of your files, called a tree, plus the id of the commit before it." },
          { at: 113, text: "A branch is smaller than you think: a file holding one commit id, forty characters long." },
          { at: 152, text: "In the course repo, a copy of our grocery storefront, run cat .git/refs/heads/basket-fix." },
          { at: 186, text: "You get one line, an id starting 9f3c. That line is the whole of the branch." },
          { at: 222, text: "Now run git cat-file -p 9f3c. It prints a tree, a parent, an author and the message." },
          { at: 261, text: "The tree lists every file in that snapshot. The parent is the commit that came before." },
          { at: 296, text: "Commit on basket-fix and Git writes a new commit, then moves the branch to point at it." },
          { at: 333, text: "Deleting a branch feels like losing work. Delete basket-fix and its commits stay on disk." },
          { at: 371, text: "Module three gets those commits back with the reflog. For now, know that they are there." },
          { at: 410, text: "Before lesson 1.2 reads the log as a graph, take the three questions under this video." },
        ],
        asks: [
          {
            q: "Is a branch a copy of my files?",
            at: 113,
            body: "At 01:53 the lesson shows a branch is smaller than you think: a file holding one commit id, forty characters long. The files live in the commit's tree.",
          },
          {
            q: "What does git cat-file -p show me?",
            at: 222,
            body: "At 03:42 the lesson runs it on commit 9f3c and gets a tree, a parent, an author and the message. The tree lists every file in that snapshot.",
          },
          {
            q: "Did deleting the branch lose my commits?",
            at: 333,
            body: "At 05:33 the lesson says the commits stay on disk when you delete basket-fix. Module three shows how to get them back with the reflog.",
          },
        ],
        practice: [
          {
            q: "What is inside the file .git/refs/heads/basket-fix?",
            options: ["A copy of every file on the branch", "A list of every commit on the branch", "One commit id, forty characters long"],
            answer: 2,
            why: "A branch is a file holding one commit id, and that one line is the whole of the branch.",
            at: 186,
          },
          {
            q: "You make a commit on basket-fix. What does Git do to the branch?",
            options: ["Moves it to point at the new commit", "Copies it into a new folder", "Adds the commit to a list inside it"],
            answer: 0,
            why: "Git writes the new commit, then moves the branch, one commit id, to point at it.",
            at: 296,
          },
          {
            q: "You delete the basket-fix branch by mistake. What happens to its commits?",
            options: ["Git deletes them along with it", "They stay on disk", "They move onto main"],
            answer: 1,
            why: "The branch only pointed at the commits, so deleting it leaves every one of them on disk.",
            at: 333,
          },
        ],
      },
    },
  },

  // Python testing with pytest: Test discovery and plain asserts (14m)
  c17: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "How many of your tests ran the last time the suite went green? Most people have to guess." },
          { at: 58, text: "On the order service for this course, the answer was 212 of 240, and nobody had noticed." },
          { at: 121, text: "pytest runs only what it finds, and it finds tests by their names." },
          { at: 186, text: "Files must be named test_*.py or *_test.py. Inside them, functions must start with test." },
          { at: 255, text: "Here is fees.py. card_fee takes an amount in cents and charges 2.9 percent plus 30." },
          { at: 318, text: "Beside it sits test_fees.py, with one test: assert card_fee(1000) == 59." },
          { at: 385, text: "Run pytest -v and the test shows up by name, with PASSED beside it." },
          { at: 452, text: "Break card_fee to return 58, and pytest prints both sides: assert 58 == 59." },
          { at: 519, text: "A plain assert is all you need. pytest rewrites it to show the values that failed." },
          { at: 586, text: "The 28 missing tests lived in refunds_tests.py, a name neither pattern matches." },
          { at: 655, text: "pytest never opened the file, and a test it cannot find will never fail." },
          { at: 721, text: "Try the practice set under this video, then run pytest --collect-only on your own suite." },
        ],
        asks: [
          {
            q: "How does pytest find my tests?",
            at: 186,
            body: "At 03:06 the lesson gives the names pytest looks for: files named test_*.py or *_test.py. Inside them, functions have to start with test.",
          },
          {
            q: "Do I need assertEqual in pytest?",
            at: 519,
            body: "At 08:39 the lesson says a plain assert is all you need. pytest rewrites it to show the values that made it fail.",
          },
          {
            q: "Why did those 28 tests never run?",
            at: 586,
            body: "At 09:46 the lesson finds them in refunds_tests.py, a name neither pattern matches. pytest never opened the file, so those tests could not fail.",
          },
        ],
        practice: [
          {
            q: "Which of these files will pytest collect?",
            options: ["refunds_tests.py", "tests_refunds.py", "test_refunds.py"],
            answer: 2,
            why: "pytest collects files named test_*.py or *_test.py, and only test_refunds.py fits either pattern.",
            at: 186,
          },
          {
            q: "card_fee(1000) returns 58, and the test asserts it equals 59. What does pytest print?",
            options: ["AssertionError and the line number", "assert 58 == 59, with both values shown", "FAILED and nothing else"],
            answer: 1,
            why: "pytest rewrites a plain assert, so a failure shows both sides of the comparison.",
            at: 452,
          },
          {
            q: "A suite goes green while 28 of its tests sit in refunds_tests.py. How many of the 28 ran?",
            options: ["None of them", "All 28 of them", "The ones whose names start with test"],
            answer: 0,
            why: "The file name matches neither pattern, so pytest never opened it and none of its tests ran.",
            at: 655,
          },
        ],
      },
    },
  },

  // Accessible front ends: Landmarks and headings (15m)
  c23: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Turn on a screen reader, open a checkout page, and ask it for the list of headings." },
          { at: 64, text: "On the first checkout I audited, that list was empty. The page showed eleven headings." },
          { at: 131, text: "Every one was a div with a class that made the text big and bold." },
          { at: 196, text: "Screen reader users skim too, jumping from landmark to landmark and heading to heading." },
          { at: 264, text: "Landmarks are the regions: header, nav, main, footer. Headings, h1 to h6, form an outline." },
          { at: 333, text: "Jump to main and a shopper skips the forty category links in our grocery menu." },
          { at: 407, text: "Here is our checkout rebuilt in plain HTML: one header, one nav, one main, one footer." },
          { at: 476, text: "Inside main, an h1 says Checkout, then one h2 per step: Delivery slot, Payment, Review." },
          { at: 547, text: "The heading list now shows every step, and a shopper can jump to Payment from it." },
          { at: 622, text: "The trap is picking a level by size. Someone wants Payment smaller and makes it an h4." },
          { at: 691, text: "So the outline jumps from h1 to h4. The level belongs to the outline, the size to the CSS." },
          { at: 766, text: "My first audit is waiting in the practice set under this video. Start with its headings." },
        ],
        asks: [
          {
            q: "Why is my heading list empty?",
            at: 131,
            body: "At 02:11 the lesson traces an empty list to divs with a class that made the text big and bold. They looked like headings and gave the list nothing to show.",
          },
          {
            q: "What counts as a landmark?",
            at: 264,
            body: "At 04:24 the lesson names the regions: header, nav, main and footer. A screen reader user jumps between them to skim the page.",
          },
          {
            q: "Can I use an h4 to make it smaller?",
            at: 691,
            body: "At 11:31 the lesson says the level belongs to the outline and the size to the CSS. Keep Payment an h2 and make it smaller in the stylesheet.",
          },
        ],
        practice: [
          {
            q: "A checkout shows eleven bold step titles, each a styled div. What does the screen reader's heading list show?",
            options: ["Nothing at all", "Every title, ordered by font size", "Only the biggest title"],
            answer: 0,
            why: "A div with a big, bold class is still a div, so the screen reader finds no headings to list.",
            at: 131,
          },
          {
            q: "Which landmark lets a shopper skip the forty category links and land on the checkout?",
            options: ["footer", "nav", "main"],
            answer: 2,
            why: "Jumping to main skips everything before it, including the forty links in the grocery menu.",
            at: 333,
          },
          {
            q: "A designer wants the Payment heading smaller. What do you change?",
            options: ["The level, from h2 to h4", "The CSS, keeping Payment an h2", "The element, to a bold div"],
            answer: 1,
            why: "The level belongs to the outline and the size to the CSS, so only the stylesheet changes.",
            at: 691,
          },
        ],
      },
    },
  },

  // TypeScript for backend services: A tsconfig for a service (15m)
  c26: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Cannot read properties of undefined: I have been paged for that error more than any other." },
          { at: 58, text: "Most of those pages came from services with strict mode switched off in their tsconfig." },
          { at: 121, text: "A tsconfig decides which of your mistakes stop the build and which ones reach a customer." },
          { at: 189, text: "Our booking service, the one we build for nine weeks, starts with one setting: strict." },
          { at: 250, text: "Strict turns on a family of checks. The first to pay for itself is strictNullChecks." },
          { at: 318, text: "In our handler, bookings.find returns a Booking or undefined, since no booking may match." },
          { at: 384, text: "Write booking.guestId on the next line and the build stops: booking is possibly undefined." },
          { at: 455, text: "Handle it. If nothing matches, return a 404, and below that check booking is a Booking." },
          { at: 521, text: "Add noUncheckedIndexedAccess, and rows[0] becomes a Row or undefined, as at runtime." },
          { at: 590, text: "Then set module to nodenext, so an import that compiles is an import Node can load." },
          { at: 662, text: "The shortcut is writing booking! to quiet the error. Every ! is a check you switched off." },
          { at: 738, text: "What does strict make of three more booking lines? The practice set under the video asks." },
        ],
        asks: [
          {
            q: "Which tsconfig setting comes first?",
            at: 189,
            body: "At 03:09 the lesson starts the booking service with one setting: strict. It turns on a family of checks, and strictNullChecks pays for itself first.",
          },
          {
            q: "Why is booking possibly undefined?",
            at: 318,
            body: "At 05:18 the lesson shows bookings.find returning a Booking or undefined, since no booking may match. Strict makes you handle that case.",
          },
          {
            q: "Can I just add a ! to fix the error?",
            at: 662,
            body: "At 11:02 the lesson warns against it: every ! is a check you switched off. Return a 404 when no booking matches, and the check stays.",
          },
        ],
        practice: [
          {
            q: "With strict on, what type does bookings.find(b => b.id === id) return?",
            options: ["Booking", "any", "Booking or undefined"],
            answer: 2,
            why: "find may match nothing, so strictNullChecks types its result as a Booking or undefined.",
            at: 318,
          },
          {
            q: "With noUncheckedIndexedAccess on and rows typed as Row[], what type is rows[0]?",
            options: ["Row or undefined", "Row", "never"],
            answer: 0,
            why: "The flag types rows[0] as it behaves at runtime, where an empty array gives undefined.",
            at: 521,
          },
          {
            q: "The build fails: booking is possibly undefined. Which fix keeps the compiler checking?",
            options: ["Write booking!.guestId", "Return a 404 when no booking matches", "Turn strict off for this one file"],
            answer: 1,
            why: "The 404 handles the missing booking, and below that check the compiler knows booking is a Booking.",
            at: 455,
          },
        ],
      },
    },
  },

  // Postgres performance: EXPLAIN and EXPLAIN ANALYZE (13m)
  c30: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "You have a query that ran in 40 milliseconds last January and takes four seconds today." },
          { at: 49, text: "Nobody touched the query. The orders table grew from one million rows to ten million." },
          { at: 108, text: "Before you add an index, ask Postgres how it runs the query. EXPLAIN prints its plan." },
          { at: 171, text: "Here is the merchant dashboard query: orders for merchant 4812 from the last seven days." },
          { at: 233, text: "EXPLAIN shows a Seq Scan on orders, estimating 1,200 rows at a cost of 289,431." },
          { at: 298, text: "Cost is a unit Postgres uses to rank plans against each other. It is never milliseconds." },
          { at: 361, text: "EXPLAIN ANALYZE runs the query for real and adds what happened: actual time, actual rows." },
          { at: 430, text: "Actual rows: 86. Rows Removed by Filter: 9,999,914. It read the whole table for 86 orders." },
          { at: 489, text: "The estimate said 1,200 and the truth was 86. Lesson 1.3 is about that gap." },
          { at: 556, text: "Careful with writes: EXPLAIN ANALYZE on an UPDATE runs the UPDATE, and the rows change." },
          { at: 618, text: "Wrap anything that writes in BEGIN and ROLLBACK. You keep the plan and lose the changes." },
          { at: 687, text: "That plan opens the practice set under this video. Read it before you reach for an index." },
        ],
        asks: [
          {
            q: "Is cost measured in milliseconds?",
            at: 298,
            body: "At 04:58 the lesson says cost is a unit Postgres uses to rank plans against each other. It is never milliseconds.",
          },
          {
            q: "What does ANALYZE add to EXPLAIN?",
            at: 361,
            body: "At 06:01 the lesson says EXPLAIN ANALYZE runs the query for real. It adds what happened to the plan: the actual time and the actual rows.",
          },
          {
            q: "Can EXPLAIN ANALYZE change my data?",
            at: 556,
            body: "At 09:16 the lesson says it can: on an UPDATE, EXPLAIN ANALYZE runs the UPDATE. Wrap anything that writes in BEGIN and ROLLBACK.",
          },
        ],
        practice: [
          {
            q: "EXPLAIN estimates 1,200 rows, and EXPLAIN ANALYZE reports actual rows: 86. How many orders came back?",
            options: ["1,200", "86", "Somewhere between the two"],
            answer: 1,
            why: "EXPLAIN ANALYZE ran the query, so its actual rows are what came back, and 1,200 was an estimate.",
            at: 430,
          },
          {
            q: "A plan shows cost=0.00..289431.00. What does 289431 tell you?",
            options: ["The query takes 289 seconds", "It reads 289,431 rows", "Its cost, to compare with other plans"],
            answer: 2,
            why: "Cost is a unit Postgres uses to rank plans against each other, and it is never milliseconds.",
            at: 298,
          },
          {
            q: "You want the real plan of an UPDATE on orders without keeping its changes. What do you run?",
            options: ["EXPLAIN ANALYZE inside BEGIN and ROLLBACK", "EXPLAIN ANALYZE on its own", "The UPDATE first, then EXPLAIN"],
            answer: 0,
            why: "EXPLAIN ANALYZE runs the UPDATE for real, and the ROLLBACK undoes its changes once the plan prints.",
            at: 618,
          },
        ],
      },
    },
  },

  // Engenharia de APIs na prática: Modelando recursos (9m). Taught in
  // Portuguese, so every line, question and answer is in Portuguese.
  c34: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "Quarenta times usam as APIs que eu projeto no banco, e nenhum deles lê o nosso código." },
          { at: 44, text: "Para quem integra, a API é o que aparece na URL e no JSON. O modelo começa por aí." },
          { at: 92, text: "Um recurso é algo que o negócio chama pelo nome: um pagamento, um reembolso, uma conta." },
          { at: 137, text: "O recurso fica com o substantivo, e os métodos HTTP fazem o papel dos verbos." },
          { at: 185, text: "A API de reembolsos que herdei em 2022 tinha dezoito endpoints, todos com verbo no nome." },
          { at: 232, text: "POST /criarReembolso, POST /consultarReembolso, POST /cancelarReembolso e por aí vai." },
          { at: 276, text: "Redesenhada, ela virou um recurso só: /pagamentos/{id}/reembolsos, com GET e POST." },
          { at: 322, text: "Cancelar passou a ser um PATCH que muda o estado do reembolso para cancelado." },
          { at: 368, text: "A armadilha é criar um recurso por tabela. Aí quem integra passa a depender do seu schema." },
          { at: 414, text: "No dia em que você dividir uma tabela em duas, quarenta times quebram junto." },
          { at: 461, text: "Faça os exercícios embaixo deste vídeo antes da aula 1.2, sobre métodos e idempotência." },
        ],
        asks: [
          {
            q: "O que conta como um recurso?",
            at: 92,
            body: "Em 01:32 a aula define recurso como algo que o negócio chama pelo nome: um pagamento, um reembolso, uma conta. Os verbos ficam com os métodos HTTP.",
          },
          {
            q: "Como fica o cancelamento na API nova?",
            at: 322,
            body: "Em 05:22 a aula mostra que cancelar passou a ser um PATCH. Esse PATCH muda o estado do reembolso para cancelado.",
          },
          {
            q: "Posso criar um recurso por tabela?",
            at: 368,
            body: "Em 06:08 a aula chama isso de armadilha, porque quem integra passa a depender do seu schema. Dividir uma tabela em duas quebra quarenta times.",
          },
        ],
        practice: [
          {
            q: "Qual destas rotas segue o modelo de recursos da aula?",
            options: ["POST /cancelarReembolso", "GET /pagamentos/{id}/reembolsos", "POST /consultarReembolso"],
            answer: 1,
            why: "A rota leva o substantivo, reembolsos, e o GET faz o papel do verbo.",
            at: 276,
          },
          {
            q: "Na API redesenhada, como um cliente cancela um reembolso?",
            options: ["Com um PATCH que muda o estado para cancelado", "Com um POST em /cancelarReembolso", "Com um DELETE no pagamento"],
            answer: 0,
            why: "Cancelado é um estado do reembolso, e um PATCH muda esse estado.",
            at: 322,
          },
          {
            q: "Por que criar um recurso para cada tabela do banco de dados é uma armadilha?",
            options: ["O HTTP não aceita tantas rotas", "Cada resposta fica lenta demais", "Quem integra passa a depender do seu schema"],
            answer: 2,
            why: "Com um recurso por tabela, dividir uma tabela em duas quebra todos os times que integram.",
            at: 368,
          },
        ],
      },
    },
  },

  // Cloud costs you can read: Line items, SKUs and usage types (9m)
  c36: {
    lessons: {
      "1.1": {
        transcript: [
          { at: 0, text: "In a budget review, finance put one line of our cloud bill on screen: 12,240 dollars." },
          { at: 43, text: "The question was what it paid for. I had no answer, and the bill had 38,000 more lines." },
          { at: 88, text: "Every line item has the same fields: service, SKU, usage type, quantity and rate." },
          { at: 131, text: "The SKU is the thing with a price on it. The usage type is the unit it is counted in." },
          { at: 175, text: "The sample bill in this course is modeled on ours, so that same line is in it." },
          { at: 214, text: "Service: content delivery. SKU: data transfer out, North America. Usage type: GB." },
          { at: 255, text: "Quantity: 612,000. Rate: two cents. Multiply and you get the 12,240 dollars." },
          { at: 297, text: "So the answer for finance: we sent 612 terabytes of video to viewers in March." },
          { at: 339, text: "The usual mistake is summing the quantity column. Gigabytes and instance hours do not add." },
          { at: 383, text: "The next line counts 9,400 instance hours. Added to 612,000 gigabytes, it means nothing." },
          { at: 422, text: "Add costs across any lines, and add quantities only where the usage type matches." },
          { at: 465, text: "Keep the sample bill open for the practice set under this video: it uses the same lines." },
        ],
        asks: [
          {
            q: "SKU or usage type, which is which?",
            at: 131,
            body: "At 02:11 the lesson says the SKU is the thing with a price on it. The usage type is the unit it is counted in, such as GB.",
          },
          {
            q: "Where did the 12,240 dollars come from?",
            at: 255,
            body: "At 04:15 the lesson multiplies the quantity by the rate: 612,000 GB at two cents each. That makes the 12,240 dollars finance asked about.",
          },
          {
            q: "Can I add up the quantity column?",
            at: 339,
            body: "At 05:39 the lesson calls that the usual mistake: gigabytes and instance hours do not add. Add quantities only where the usage type matches.",
          },
        ],
        practice: [
          {
            q: "A line reads: usage type GB, quantity 612,000, rate two cents. What does the line cost?",
            options: ["12,240 dollars", "612 dollars", "30,600 dollars"],
            answer: 0,
            why: "Multiply the quantity by the rate: 612,000 gigabytes at two cents each comes to 12,240 dollars.",
            at: 255,
          },
          {
            q: "Which field tells you the unit a line is counted in?",
            options: ["The SKU", "The usage type", "The service"],
            answer: 1,
            why: "The SKU is the thing with a price on it, and the usage type is the unit it is counted in.",
            at: 131,
          },
          {
            q: "One line counts 612,000 GB and the next 9,400 instance hours. What can you add across the two?",
            options: ["Their quantities", "Their usage types", "Their costs"],
            answer: 2,
            why: "Costs add across any lines, and quantities add only where the usage type matches.",
            at: 422,
          },
        ],
      },
    },
  },
};
