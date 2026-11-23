// The written reviews a course page lists under its rating. One pool per
// subject, written to hold for any course in it, and a few in the language of
// the four courses taught in something other than English, which list first
// on those courses as they would on a real one.
//
// `{teacher}` becomes the instructor's first name and `{hours}` / `{more}`
// the course's hours a week and two more, so a review reads as written about
// the course it sits on. Each is fitted at 16px so its last line runs two
// thirds of the column at 1280, 559px while the list stands two abreast, with
// every teacher's name in its subject and every hours figure; a placeholder
// whose length swings further than a name would undo that fit on half the
// courses, which is why no review names a skill. One review a subject runs to
// five lines, so the list shows what a long one does: four lines and "Show
// more".
//
// Mock data: a real product has a table of these per course, and the list and
// its filters work the same over it.

import { hash } from "@/lib/utils";
import type { Course, Language, Topic } from "@/components/course/courses";

export type Review = {
  id: string;
  name: string;
  /** A Lummi portrait id, hotlinked and never bundled, as every face on the
   *  site is. Most reviewers have none and show their initials, as most
   *  people on a real course site do. */
  face?: string;
  role: string;
  stars: 1 | 2 | 3 | 4 | 5;
  /** How long ago it was written, in weeks. */
  weeks: number;
  /** How many readers have marked it helpful: what "Most helpful" sorts by. */
  helpful: number;
  text: string;
  finished: boolean;
};

type Raw = Omit<Review, "id">;

const pools: Record<Topic, Raw[]> = {
  Data: [
    { name: "Maya T.", face: "QmVSVgUQycRafA8BtpBaMqEF9KLUfB4jEyv5gCFWsetdJt", role: "Analyst, logistics", stars: 5, weeks: 3, helpful: 48, finished: true, text: "Two courses in, I still froze at a blank screen. Here every lesson ends with something you write, and the tutor asks what you expect." },
    { name: "Jonas W.", role: "Operations lead", stars: 5, weeks: 6, helpful: 36, finished: true, text: "{teacher} pointed at one step in my project and asked how many rows it should return. In five years of spreadsheets, I had never asked myself that." },
    { name: "Priyanka S.", face: "QmQHWNkyDCNz2xH49Db2j8PhCYBpGNBhYDHNBpdcxJLdQo", role: "Product analyst", stars: 4, weeks: 2, helpful: 21, finished: true, text: "Strong on the fundamentals, and the practice sets are the best part. The second module moves fast, so I watched two lessons twice." },
    { name: "Carlos M.", face: "QmapisvjQVKzKNN8aKVeQSsnphF6YPSMNMf6JRdLYw8H1Q", role: "Finance associate", stars: 5, weeks: 9, helpful: 67, finished: true, text: "The tutor would not hand me the answer, which annoyed me for a week. It is also why I could do it alone in my interview last month." },
    { name: "Ruth A.", role: "Marketing manager", stars: 3, weeks: 5, helpful: 34, finished: false, text: "Good material, but the pace assumes more free time than I had. Its {hours} hours a week were closer to {more} for me once the project started." },
    { name: "Wei L.", face: "QmcUirACzY1MXe3xPuhmvJzoiMENVWsYbWjTujhjmCQyG5", role: "Data engineer", stars: 5, weeks: 4, helpful: 29, finished: true, text: "I came for the syllabus and stayed for the project. The dataset is messy in the ways real data is, and nobody tidied it up for us first." },
    { name: "Hannah K.", role: "Researcher", stars: 4, weeks: 7, helpful: 12, finished: true, text: "Clear lessons and honest quizzes. I wanted one more worked example before the project, and the forum had one within a day." },
    { name: "Tunde O.", role: "Supply chain planner", stars: 5, weeks: 1, helpful: 18, finished: false, text: "I watched the hard lessons twice, the second time with the transcript open. Clicking a line to send the video to that minute saved me hours." },
    { name: "Greg P.", role: "IT support", stars: 2, weeks: 11, helpful: 41, finished: true, text: "Too slow at the start for anyone who already writes code. It picks up in the second half, but I nearly gave up on it in the first week." },
    { name: "Sofia R.", face: "QmZ8sPiQ4jDbPcu5Yf1FuoyaJuhDYyJh583syKwRyAp4fT", role: "Analyst, insurance", stars: 5, weeks: 14, helpful: 56, finished: true, text: "The reviewed project got me the interview, and talking it through got me the job. I shared my screen on the call and took them through it." },
    { name: "Leo D.", role: "Student", stars: 4, weeks: 8, helpful: 9, finished: true, text: "Worth it for the quizzes alone. Each one explains why the wrong answer tempted you, and that is where I learned the most." },
    { name: "Amara N.", face: "QmR3fwR7FQR2XuSxLxtfS4nDf96h4HAhFFRp5rLLPLy2Xk", role: "Nurse, moving into data", stars: 5, weeks: 16, helpful: 38, finished: true, text: "I started without knowing what a CSV was. {teacher} never assumed I knew anything, never made me feel slow for asking, and answered every question I posted, even the ones I was embarrassed to ask. By week six I was using what I learned at work, and my manager has since moved me onto the reporting team, where I build the weekly figures for every ward." },
  ],
  Engineering: [
    { name: "Diego F.", face: "QmUup9WeALyWXvtEVVCNeqwGAbgXtMhnEdr8jKFf678MoH", role: "Backend developer", stars: 5, weeks: 2, helpful: 44, finished: true, text: "The exercises break things on purpose. Fixing the failing run in module three taught me more than any of the lectures I have sat through." },
    { name: "Mei C.", face: "QmQ3vdrnhegEzEpadijkq2unBVMy7P4ezTABK1Mzy1j4ea", role: "Software engineer", stars: 5, weeks: 5, helpful: 31, finished: true, text: "{teacher} reviews the project the way a senior colleague would: short comments, each pointing at one line of your code and asking why it is there." },
    { name: "Arjun P.", face: "QmbGobPcsZQYf9aQr7Mfcsgm8qKvRWWVezpVfhcesSh1oV", role: "Full-stack developer", stars: 4, weeks: 3, helpful: 19, finished: true, text: "Dense, in a good way. Budget more than {hours} hours a week for the labs." },
    { name: "Nadia B.", role: "DevOps engineer", stars: 5, weeks: 8, helpful: 27, finished: true, text: "I use something from this course every week. The notes on failure paid for it." },
    { name: "Tom H.", role: "Engineering manager", stars: 3, weeks: 6, helpful: 22, finished: false, text: "Solid content, but the videos run long. I watched most of them at double speed, with the transcript open in a window beside them." },
    { name: "Yusuf K.", face: "QmbMN7PQyDvZk44JfsGrgAVUmVgSpBxMQXVZSuN1sDFAqd", role: "Junior developer", stars: 5, weeks: 4, helpful: 53, finished: true, text: "The tutor asked what I thought the error meant before saying anything. Annoying on day one; by week three I was doing it unasked." },
    { name: "Elif S.", role: "Platform engineer", stars: 4, weeks: 10, helpful: 11, finished: true, text: "Good on the basics. I wanted a module on running it in production across several teams, since that is where most of my week goes." },
    { name: "Marco V.", role: "Freelance developer", stars: 5, weeks: 12, helpful: 16, finished: true, text: "I rebuilt a client project with the second half, and I sleep better now." },
    { name: "Pete L.", role: "Senior engineer", stars: 2, weeks: 9, helpful: 37, finished: true, text: "Too basic for me. The last module is what I came for, and it is short." },
    { name: "Ama O.", role: "QA engineer", stars: 5, weeks: 7, helpful: 24, finished: true, text: "Everything runs on your own machine, with no account on anybody's cloud. That set it apart from the three other courses I had tried." },
    { name: "Ivan R.", role: "Data engineer", stars: 4, weeks: 15, helpful: 8, finished: true, text: "The quizzes are harder than they look, and I mean that as praise. Two of them sent me back to a lesson I thought I had understood." },
    { name: "Grace W.", face: "QmQwUF21WApNykPHkpCvoB8b1K9LfUWCioYq22Z6LC55DZ", role: "Career changer", stars: 5, weeks: 18, helpful: 45, finished: true, text: "I finished with a repository I could show in interviews. Two interviewers asked about the project before they asked about anything else on my résumé, and one of them had read the tests. I had spent eight years in retail management, and this was the first thing I had ever built that a stranger could download, install and run on their own machine." },
  ],
  Design: [
    { name: "Lena M.", face: "QmdH5mYCXhTRGYTWQYGoE5VCNPb7kaSZstvdu1xM234qJV", role: "Product designer", stars: 5, weeks: 3, helpful: 52, finished: true, text: "The weekly critique is the course. {teacher}'s notes on my layouts were blunt and specific, and I could not argue with a single one of them." },
    { name: "Kwame A.", role: "Graphic designer", stars: 5, weeks: 6, helpful: 28, finished: true, text: "I came from print, and this course was the bridge. The exercises use real product screens, which was what I needed to see." },
    { name: "Julia R.", role: "Marketing designer", stars: 4, weeks: 2, helpful: 17, finished: true, text: "Lovely lessons. The workload spikes mid-course, and I fell behind twice." },
    { name: "Hiro T.", role: "Front-end developer", stars: 5, weeks: 9, helpful: 33, finished: true, text: "I am an engineer, and by week two I could see why my layouts looked off to other people. I will never see spacing the same way again." },
    { name: "Beth C.", role: "UX researcher", stars: 3, weeks: 5, helpful: 14, finished: false, text: "Useful, but I wanted a module on the words in an interface, the labels and the error messages. The project brief is the best part." },
    { name: "Omar S.", face: "QmXe6Qe3YXQTwwE1Xm64EGF2x6JsxpWgWST13LBVAU7e3X", role: "Junior designer", stars: 5, weeks: 4, helpful: 41, finished: true, text: "The tutor never says which layout is better. It asks what the reader looks at first, and now I ask that of every screen I make at work." },
    { name: "Clara V.", role: "Illustrator", stars: 4, weeks: 11, helpful: 12, finished: true, text: "I would take it again for the weekly critiques alone." },
    { name: "Sipho N.", face: "QmNTWUik8TNGHF6XaJpBW8R7mxzbFrd4fkZhBMgHdYfHmF", role: "Design student", stars: 5, weeks: 13, helpful: 39, finished: true, text: "My portfolio reviews changed after this course. People asked about my process and research, where they used to ask about fonts." },
    { name: "Mark D.", role: "Art director", stars: 2, weeks: 7, helpful: 26, finished: true, text: "Too introductory for my level, and the examples lean on apps when most of my work is print. It is well made, though, and I finished it." },
    { name: "Anya P.", role: "Product manager", stars: 5, weeks: 10, helpful: 20, finished: true, text: "I took it to talk to designers better and ended up sketching my own flows. Now I can tell a designer why a screen looks wrong." },
    { name: "Rui C.", role: "Freelancer", stars: 4, weeks: 15, helpful: 10, finished: true, text: "Clear and practical. The Portuguese subtitles are well translated, which matters to me, since English is my second language." },
    { name: "Esther K.", face: "QmUCxwzTX6jo3LMbBJnXbDgCT655mPt95gHpB5FXTHfh3b", role: "Service designer", stars: 5, weeks: 17, helpful: 47, finished: true, text: "Every assignment came back with notes within three days of handing it in, and the notes were about my screen, with arrows on it. I have paid more for courses whose instructors never looked at my work once. I run service design for a city council now, and I still reread those notes before I lead a critique of my own team's screens on a Monday morning." },
  ],
  Business: [
    { name: "Nate G.", face: "Qma4cw7xwaCpFFkcziJEaWLNWYaLhRRTk1eZ2wCHHFCgiB", role: "Founder", stars: 5, weeks: 3, helpful: 58, finished: true, text: "I raised my prices in week two, and the course paid for itself within a month. {teacher} does not let a neat spreadsheet hide a guess from you." },
    { name: "Aisha B.", role: "Operations manager", stars: 5, weeks: 6, helpful: 26, finished: true, text: "Practical from the first lesson. The exercises use numbers that look like a real business's books, with the missing months included." },
    { name: "Ben T.", role: "Consultant", stars: 4, weeks: 2, helpful: 15, finished: true, text: "Good, though the middle weeks move at a sprint. I caught up by reading the transcripts on the train, a lesson there and one back." },
    { name: "Chloe M.", face: "QmfFVPzwLtkxum7Y19jc4qYVuNJWjEcEKb3cTydSbCHYNF", role: "Account executive", stars: 5, weeks: 9, helpful: 44, finished: true, text: "It changed how I prepare for any conversation about money. I walked into my salary review with a number, and I walked out with it." },
    { name: "Raj K.", face: "Qmdo8MTDok5ShErai2zKAq9MmjL5e9aM4YYdvVmsSbiDbs", role: "Bakery owner", stars: 3, weeks: 5, helpful: 31, finished: true, text: "Useful, but it assumes a software business. I run a bakery, so I translated half of the examples into flour, rent and staff hours." },
    { name: "Inês F.", role: "Product manager", stars: 5, weeks: 4, helpful: 22, finished: true, text: "The templates alone are worth the price. The project review made me defend each number in my model, and two of them did not survive it." },
    { name: "Paul O.", role: "Analyst", stars: 4, weeks: 8, helpful: 9, finished: true, text: "Clear teaching, fair quizzes. The last module could be twice as long." },
    { name: "Zara H.", face: "QmRueMdjpk9uBoHfcr5F5XCxUW6BB2jZYm35skzEwKTuFE", role: "Founder", stars: 5, weeks: 12, helpful: 35, finished: true, text: "I used what I built in module three in a real investor meeting last spring. Nobody found a hole in it, and I knew where the holes would have been, because the course had made me dig every one of them myself first. We closed the round in June, and two of the investors asked which consultancy had built our model. I had built it myself, at my kitchen table." },
    { name: "Steve W.", role: "Sales lead", stars: 2, weeks: 7, helpful: 28, finished: true, text: "A lot of theory for a course sold as practical. The second half is better than the first, and it is where the exercises and the project start." },
    { name: "Mina J.", role: "Career changer", stars: 5, weeks: 10, helpful: 19, finished: true, text: "{teacher} answered my forum question with a worked example built from my own numbers. That was the day I decided to finish the course." },
    { name: "Luis A.", role: "Freelancer", stars: 4, weeks: 14, helpful: 11, finished: true, text: "Good for anyone who sells a service. I would pay for a follow-up with more cases like mine, where every client pays by the hour." },
    { name: "Hannah O.", role: "Marketing lead", stars: 5, weeks: 16, helpful: 40, finished: true, text: "Short lessons, real homework and a project that somebody reads and answers. I have not found that on any other course I have paid for." },
  ],
};

const local: Partial<Record<Language, Raw[]>> = {
  Spanish: [
    { name: "Marta G.", face: "QmauUqvUGgCqDDUiQwWt1hVtKLuydF21pGXXfpT3gNTHBs", role: "Analista, sanidad", stars: 5, weeks: 2, helpful: 24, finished: true, text: "Por fin un curso en español que no suena a traducción. {teacher} explica con ejemplos de aquí, y los ejercicios usan casos que reconozco." },
    { name: "Javier L.", role: "Técnico de datos", stars: 5, weeks: 5, helpful: 17, finished: true, text: "El tutor contesta con preguntas. Cuesta al principio, y en la tercera semana ya me hacía yo las mismas preguntas antes de escribirle." },
    { name: "Carmen P.", role: "Estudiante", stars: 4, weeks: 6, helpful: 15, finished: true, text: "Completo y claro. El proyecto lleva más horas de las que indica el temario, pero merece la pena, y ahora lo enseño en entrevistas." },
  ],
  French: [
    { name: "Julien M.", face: "QmYJdJ8X7ymVKCnDJxCHfabpqpQShsR55bTgCT9KAnWXZs", role: "Fondateur", stars: 5, weeks: 3, helpful: 21, finished: true, text: "Enfin un cours de finance en français qui part d'un vrai tableur. {teacher} corrige chaque modèle ligne par ligne, comme en comité d'investissement." },
    { name: "Sophie L.", role: "Contrôleuse de gestion", stars: 4, weeks: 8, helpful: 9, finished: true, text: "Très concret et bien construit. J'aurais aimé un module de plus sur la levée de fonds en seed, avec un vrai pacte d'associés à relire." },
  ],
  Portuguese: [
    { name: "Beatriz S.", face: "QmZcvJNf84WJ6eWx4A5hLXBVYk2UGxypvT5CbUK3YZAq8X", role: "Desenvolvedora backend", stars: 5, weeks: 2, helpful: 18, finished: true, text: "Curso direto ao ponto, com exemplos de pagamentos de verdade. Mudei o jeito de versionar todas as APIs do nosso time depois dele." },
    { name: "Thiago R.", role: "Engenheiro de software", stars: 4, weeks: 7, helpful: 7, finished: true, text: "Muito bom e direto. Os exercícios de paginação e de limites de taxa poderiam ser mais longos, com casos que quebram de verdade." },
  ],
};

/** This course's reviews, in the order the list opens on: any in the
 *  course's own language first, then its subject's pool in an order of its
 *  own, so two courses in one subject do not open on the same three faces. */
export function reviewsOf(c: Course): Review[] {
  const fill = (text: string) =>
    text
      .replaceAll("{teacher}", c.instructor.split(" ")[0])
      .replaceAll("{hours}", String(c.hours))
      .replaceAll("{more}", String(c.hours + 2));
  const pool = pools[c.topic]
    .map((r) => ({ r, k: hash(c.id + r.name) }))
    .sort((a, b) => a.k - b.k)
    .map(({ r }) => r);
  return [...(local[c.language] ?? []), ...pool].map((r, i) => ({
    ...r,
    id: `${c.id}-r${i}`,
    text: fill(r.text),
  }));
}
