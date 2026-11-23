// Row 12's six questions and the words around them. The index a reader sees
// is a question's place in this list, and each group's questions sit together,
// so the label beside a row reads as a heading for the rows under it rather
// than as a tag repeated at random.

export type Faq = { group: string; q: string; a: string };

export const faqCopy = {
  eyebrow: "Questions",
  heading: "The six that come up before anybody pays",
  foot: "A person answers anything this list does not.",
  footLink: "Ask us",
};

export const faqs: Faq[] = [
  {
    group: "AI",
    q: "Does the AI grade my work instead of the instructor?",
    a: "It grades the quizzes, which are multiple choice and have one right answer. Projects and written submissions go to the instructor or their reviewers, and the review carries a name. No grade that counts toward a certificate has ever been issued by a model here.",
  },
  {
    group: "AI",
    q: "Are courses drafted with the studio labeled as AI-written?",
    a: "The studio drafts structure: chapters, lesson order and quiz questions from a transcript. The instructor records the teaching. A lesson whose text was generated rather than written carries an AI drafted badge on its syllabus, and 41 lessons on the platform carry one today.",
  },
  {
    group: "What you get",
    q: "Is a Mentora certificate recognized anywhere?",
    a: "By the school that issued it and by anyone who follows the verify link, which shows what you completed and when. It is not an accredited qualification and we do not describe it as one. What it is good for is a hiring manager who wants to see the work behind a line on a résumé.",
  },
  {
    group: "What you get",
    q: "Can I watch without a connection?",
    a: "On Plus and Teams, yes. Lessons download to the mobile apps and expire 30 days after the last time you signed in. Transcripts and notes come with them. The AI tutor needs a connection, because the answer is generated against the transcript rather than stored beside it.",
  },
  {
    group: "Money",
    q: "What does the refund cover?",
    a: "Thirty days from purchase, whatever you have watched, on single courses and on the first month of Plus. One click in your account, no form. Refunds on Teams invoices go through your named contact because the seat count has to be reconciled first.",
  },
  {
    group: "Money",
    q: "What does an instructor keep?",
    a: "70% of a single-course sale, paid monthly. On Plus, the pool is split by minutes watched, not by enrollments, which is what instructors ask about most. The share is in the contract before you record a lesson.",
  },
];
