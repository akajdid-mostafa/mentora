// Every string the lesson player prints that is not a lesson's own content.
// The components beside this file are layouts; a buyer rewording the player
// edits this file and nothing else. The tutor's words are here too, in the
// four languages the catalogue teaches in, because it answers in the language
// the lesson is taught in.

import type { Credential, Language } from "@/components/course/courses";

/** Two digits on both sides, the way every cited minute is written: 04:12. */
export const clock = (s: number) => {
  const whole = Math.max(0, Math.floor(s));
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
};

export const learnCopy = {
  home: "My learning",
  lesson: (id: string) => `Lesson ${id}`,
  progress: (done: number, total: number) => `${done} of ${total} done`,
  // Why lesson one plays while the rest are shut. On a free course there is
  // nothing to explain, and the Enroll button already says it costs nothing.
  free: (price: number) => (price ? "Lesson one is free" : "Free course"),
  enroll: (price: number) => (price ? `Enroll for $${price}` : "Enroll for free"),

  place: {
    module: (n: number) => `Module ${n}`,
    position: (k: number, n: number) => `lesson ${k} of ${n}`,
    project: (module: number) => `Module ${module} · Project`,
  },
  meta: {
    video: (minutes: number) => `${minutes} min`,
    quiz: (questions: number) => `${questions} questions · pass at 80%`,
    project: (hours: number) => `About ${hours} hours`,
  },
  complete: "Mark complete",
  completed: "Completed",
  next: {
    video: "Next lesson",
    quiz: "Next: the quiz",
    project: "Next: the project",
    end: "Back to My learning",
  },

  rail: { label: "Beside the lesson", tutor: "Tutor", contents: "Contents" },
  tabs: {
    label: "About this lesson",
    transcript: "Transcript",
    notes: "Notes",
    practice: "Practice",
    resources: "Resources",
  },

  player: {
    play: (title: string) => `Play ${title}`,
    pause: (title: string) => `Pause ${title}`,
    back: "Back 10 seconds",
    forward: "Forward 10 seconds",
    speed: (x: number) => (x === 1 ? "Playback speed, normal" : `Playback speed, ${x} times`),
    captions: "Captions",
    position: "Position in the lesson",
    paused: (t: string) => `Paused at ${t}`,
    upNext: "Up next",
    autoplay: "It plays by itself in five seconds.",
    playNow: "Play now",
    stay: "Stay here",
    finished: (id: string) => `Lesson ${id} is done`,
    finishedBody: "The other lessons open when you enroll, the tutor with them.",
  },

  contents: {
    module: (n: number, of: number) => ({ lead: `Module ${n}`, rest: ` of ${of}` }),
    previous: "Previous module",
    nextModule: "Next module",
    quiz: "Quiz",
    sub: {
      video: (id: string) => `Lesson ${id}`,
      quiz: (questions: number) => `${questions} questions`,
      project: "Project",
    },
    length: (minutes: number) => (minutes >= 120 ? `${Math.round(minutes / 60)} h` : `${minutes} min`),
    state: {
      done: "Finished",
      locked: "Opens when you enroll",
      open: "Open now",
    },
    watched: (t: string, total: string) => `${t} of ${total}`,
    notes: (n: number) => `${n} ${n === 1 ? "note" : "notes"}`,
  },

  tutor: {
    chip: "AI",
    reads: (id: string) => `Has lesson ${id} open`,
    readsQuiz: (module: number) => `Has the module ${module} quiz open`,
    readsProject: "Has the project open",
    hintFor: (n: number) => `Hint for question ${n}`,
    thinking: "Reading the transcript",
    placeholder: "Ask about this lesson",
    send: "Send",
    scope: "Answers from this course only",
    play: (t: string) => `Play from ${t}`,
    open: (id: string) => `Open lesson ${id}`,
    you: "You",
    locked: "The tutor opens on every lesson once you enroll. Lesson one has it now.",
    toLessonOne: "Go to lesson one",
  },

  transcript: {
    search: "Search the transcript",
    matches: (n: number) => (n === 1 ? "1 match" : `${n} matches`),
    follow: "Follow the video",
    download: "Download .txt",
    none: "The captions for this lesson are still being checked. The transcript goes up with them.",
    locked: "The transcript opens with the tutor on every lesson once you enroll.",
    noMatch: (q: string) => `Nothing in this lesson says “${q}”.`,
  },

  notes: {
    new: (t: string) => `New note at ${t}`,
    // A note begun on one lesson that is still being written on the next.
    newIn: (t: string, id: string) => `New note at ${t} of lesson ${id}`,
    placeholder: "What do you want to find again?",
    save: "Save note",
    cancel: "Cancel",
    edit: "Edit note",
    remove: "Delete note",
    removed: "Note deleted",
    undo: "Undo",
    export: "Export .md",
    here: "This lesson",
    all: "All lessons",
    empty: "No notes on this lesson yet. Write one while the video plays and it keeps the minute you wrote it at.",
    emptyAll: "No notes in this course yet.",
    play: (t: string) => `Play from ${t}`,
  },

  check: {
    practice: "Practice",
    count: (i: number, n: number) => `Question ${i} of ${n}`,
    right: "Right.",
    wrong: "Not that one.",
    retry: "Try again",
    hint: "Get a hint",
    next: "Next question",
    previous: "Previous question",
    score: "See your score",
    again: "Practice again",
    firstTry: (right: number, n: number) => `${right} of ${n} on the first try`,
    watch: (t: string, lesson?: string) => (lesson ? `Watch ${t} of lesson ${lesson}` : `Play from ${t}`),
    quiz: (module: number) => `Module ${module} quiz`,
    pass: "Pass at 80%",
    finish: "Finish the quiz",
    toUnanswered: (n: number) => `Back to question ${n}`,
    passed: "Passed",
    notYet: "Not yet",
    result: (right: number, n: number) => `${right} of ${n} right`,
    passedBody: "The quiz is ticked off in the contents.",
    notYetBody: "Four in five passes. The explanations say which minute to watch again.",
    retake: "Retake the quiz",
    missing: "The instructor's team is still checking this quiz's questions. They go up with the module's captions.",
    onward: (module: number) => `Continue to module ${module}`,
  },

  resources: {
    transcript: "Transcript",
    notes: "Your notes on this lesson",
    download: "Download",
    none: "This lesson has no files to download.",
  },

  locked: {
    title: (id: string) => `Lesson ${id} opens when you enroll`,
    body: "Lesson one is open now, with the tutor and its practice set.",
    toLessonOne: "Go to lesson one",
  },

  project: {
    brief: "The brief",
    review: (first: string) => `Reviewed by ${first}’s team`,
    handIn: "Hand in",
    upload: "Choose a file",
    submit: "Submit for review",
    change: "Choose another file",
    submitted: (date: string) => `Submitted on ${date}`,
    submittedBody: "The instructor's team reviews every project within five working days, and the review lands in My learning.",
  },

  enrolling: {
    title: "What enrolling opens",
    lessons: (n: number) => `The other ${n} lessons, each with its transcript`,
    tutor: "The tutor on every lesson",
    checks: (quizzes: number) => `${quizzes} ${quizzes === 1 ? "quiz" : "quizzes"} and the closing project`,
    credential: (c: Credential) =>
      c === "Course"
        ? "A course certificate once every item is done"
        : c === "Guided Project"
          ? "A project certificate once every item is done"
          : `The ${c} once every item is done`,
  },

  upNext: {
    label: "Up next",
    end: "Course finished",
    endBody: "Every lesson, quiz and the project are done.",
    toDashboard: "Go to My learning",
    left: "Still to finish",
    leftBody: (n: number) => `${n} ${n === 1 ? "item" : "items"} before the certificate`,
  },
};

// The tutor's own sentences, in the language of the lesson it has open. The
// minute and the line it quotes are the lesson's; these are the frame.
type TutorVoice = {
  /** One line, whatever the lesson: the thread's first message. */
  intro: (id: string) => string;
  project: string;
  noTranscript: (id: string) => string;
  quiz: (module: number) => string;
  line: (t: string, line: string) => string;
  elsewhere: (here: string, id: string, title: string) => string;
  nothing: string;
  noAnswer: (t: string) => string;
  hint: (n: number, t: string, lesson: string) => string;
};

export const tutorVoice: Record<Language, TutorVoice> = {
  English: {
    intro: (id) => `Ask me about any minute of lesson ${id}.`,
    project: "The project is yours to write. Ask which lesson a question draws on and I will point you there.",
    noTranscript: (id) =>
      `The captions for lesson ${id} are still being checked, so I can find a topic in the syllabus for you but not a minute in this video.`,
    quiz: (module) =>
      `The module ${module} quiz is open, so I give hints and the minute to watch again, and I leave the choosing to you.`,
    line: (t, line) => `At ${t} the lesson says: “${line}”`,
    elsewhere: (here, id, title) =>
      `Lesson ${here} does not cover that. Lesson ${id}, ${title}, is where the course takes it up.`,
    nothing: "No lesson in this course covers that, and I only answer from its lessons. Try a question about the minute you are on.",
    noAnswer: (t) =>
      `I will leave the choice to you. The lesson covers it at ${t}: watch that minute, then tell me which option you would pick and why.`,
    hint: (n, t, lesson) =>
      `Question ${n} comes from ${t} of lesson ${lesson}. Watch that minute before you choose.`,
  },
  Spanish: {
    intro: (id) => `Pregúntame por cualquier minuto de la lección ${id}.`,
    project: "El proyecto lo escribes tú. Pregúntame de qué lección sale cada punto y te llevo allí.",
    noTranscript: (id) =>
      `Los subtítulos de la lección ${id} todavía se están revisando, así que puedo buscarte un tema en el temario, pero no un minuto de este vídeo.`,
    quiz: (module) =>
      `Tienes abierto el test del módulo ${module}: te doy pistas y el minuto que conviene volver a ver, y la respuesta la eliges tú.`,
    line: (t, line) => `En el ${t} la lección dice: «${line}»`,
    elsewhere: (here, id, title) =>
      `La lección ${here} no trata eso. La lección ${id}, ${title}, es donde el curso lo explica.`,
    nothing: "Ninguna lección de este curso trata eso, y solo respondo desde sus lecciones. Prueba con algo del minuto en el que estás.",
    noAnswer: (t) =>
      `La respuesta la eliges tú. La lección lo explica en el ${t}: vuelve a ver ese minuto y dime qué opción elegirías y por qué.`,
    hint: (n, t, lesson) =>
      `La pregunta ${n} sale del ${t} de la lección ${lesson}. Mira ese minuto antes de elegir.`,
  },
  Portuguese: {
    intro: (id) => `Pergunte sobre qualquer minuto da aula ${id}.`,
    project: "O projeto é você quem escreve. Pergunte de qual aula vem cada item e eu levo você até lá.",
    noTranscript: (id) =>
      `As legendas da aula ${id} ainda estão em revisão, então consigo achar um tema no programa, mas não um minuto deste vídeo.`,
    quiz: (module) =>
      `O quiz do módulo ${module} está aberto: eu dou dicas e o minuto para rever, e a escolha fica com você.`,
    line: (t, line) => `Em ${t} a aula diz: “${line}”`,
    elsewhere: (here, id, title) =>
      `A aula ${here} não trata disso. A aula ${id}, ${title}, é onde o curso explica.`,
    nothing: "Nenhuma aula deste curso trata disso, e eu só respondo a partir das aulas. Tente uma pergunta sobre o minuto em que você está.",
    noAnswer: (t) =>
      `A escolha fica com você. A aula explica isso em ${t}: reveja esse minuto e me diga qual opção escolheria e por quê.`,
    hint: (n, t, lesson) =>
      `A pergunta ${n} vem de ${t} da aula ${lesson}. Veja esse minuto antes de escolher.`,
  },
  French: {
    intro: (id) => `Posez vos questions sur la leçon ${id}.`,
    project: "Le projet, c’est vous qui l’écrivez. Demandez de quelle leçon part chaque point et je vous y emmène.",
    noTranscript: (id) =>
      `Les sous-titres de la leçon ${id} sont encore en relecture : je peux retrouver un sujet dans le programme, pas une minute de cette vidéo.`,
    quiz: (module) =>
      `Le quiz du module ${module} est ouvert : je donne des indices et la minute à revoir, et le choix vous revient.`,
    line: (t, line) => `À ${t}, la leçon dit : « ${line} »`,
    elsewhere: (here, id, title) =>
      `La leçon ${here} ne traite pas ce point. La leçon ${id}, ${title}, est celle où le cours l’aborde.`,
    nothing: "Aucune leçon de ce cours ne traite ce point, et je ne réponds qu’à partir de ses leçons. Essayez une question sur la minute en cours.",
    noAnswer: (t) =>
      `Le choix vous revient. La leçon l’explique à ${t} : revoyez cette minute, puis dites-moi quelle option vous choisiriez et pourquoi.`,
    hint: (n, t, lesson) =>
      `La question ${n} vient de ${t} dans la leçon ${lesson}. Regardez cette minute avant de choisir.`,
  },
};
