// How a new password is judged: three rules a reader can tick off and a
// four-step reading of how hard it is to guess. The rules decide whether the
// form goes through; the reading only advises, as a real product's would.

export type Rule = { id: "length" | "mix" | "own"; met: boolean };

/** The three rules, in the order the list prints them. `own` fails a
 *  password that carries the reader's first name or the part of their email
 *  before the @, which is the first thing anyone guessing would try. */
export function rulesOf(password: string, name: string, email: string): Rule[] {
  const p = password.toLowerCase();
  const words = [
    ...name.toLowerCase().split(/\s+/),
    email.toLowerCase().split("@")[0],
  ].filter((w) => w.length >= 3);
  return [
    { id: "length", met: password.length >= 8 },
    { id: "mix", met: /[\d\W_]/.test(password) },
    {
      id: "own",
      met: password.length > 0 && !words.some((w) => p.includes(w)),
    },
  ];
}

/** 0 to 4: nothing yet, weak, fair, good, strong. Length carries it, and a
 *  password breaking a rule never reads above weak. */
export function scoreOf(password: string, rules: Rule[]) {
  if (!password) return 0;
  if (rules.some((r) => !r.met)) return 1;
  let score = 2;
  if (password.length >= 12) score++;
  if (
    password.length >= 16 ||
    (/[a-z]/.test(password) && /[A-Z]/.test(password))
  )
    score++;
  return Math.min(4, score);
}
