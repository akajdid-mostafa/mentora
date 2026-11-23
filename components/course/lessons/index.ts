// Every course's lesson packs in one lookup. The lesson player's page reads
// this on the server and hands the client the one course it shows, the way
// the course page hands over one syllabus, so no browser downloads the
// transcripts of all thirty-six to play one lesson.

import { business } from "@/components/course/lessons/business";
import { data } from "@/components/course/lessons/data";
import { design } from "@/components/course/lessons/design";
import { engineering } from "@/components/course/lessons/engineering";
import { sqlForAnalysis } from "@/components/course/lessons/sql-for-analysis";
import type { CoursePack } from "@/components/course/lessons/types";

const packs: Record<string, CoursePack> = {
  ...sqlForAnalysis,
  ...data,
  ...engineering,
  ...design,
  ...business,
};

export const packOf = (courseId: string): CoursePack | undefined => packs[courseId];
