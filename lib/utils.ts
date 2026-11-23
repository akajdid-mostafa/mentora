import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// A path segment from a name or a title: "Tomás Oliveira" → "tomas-oliveira",
// the same shape as the lesson routes already use. Accents come off rather
// than out, so the slug still reads as the name it came from.
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// A stable number from a string: the same text gives the same number on the
// server, in every browser and on every render, which is what mock data needs
// when a lesson's length or a cohort's free seats are worked out rather than
// typed. Not a checksum and not random.
export function hash(text: string) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return Math.abs(h)
}

// A figure with its noun, the noun made plural past one: "1 lesson",
// "19 lessons", "5 quizzes". Mock data counts come from the data, so a buyer
// who trims a syllabus to one of anything gets the singular without a check.
export function count(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}

// A text value as a calendar file must carry it (RFC 5545 § 3.3.11): the
// backslash, the semicolon, the comma and a line break each escaped, or a
// calendar splits the value at the first one.
export function icsText(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n")
}
