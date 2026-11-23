// What a card field checks before anything is sent: which network a number
// belongs to, where its spaces go, whether its digits add up, and whether its
// expiry is still ahead. The checks a payment provider's own fields would run
// in the browser; the demo runs them here because nothing is sent anywhere.

export type Brand = "Visa" | "Mastercard" | "Amex" | "Discover";

/** The network, read off the first digits as they are typed. */
export function brandOf(digits: string): Brand | null {
  if (/^4/.test(digits)) return "Visa";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(5[1-5]|2(2[2-9][1-9]|2[3-9]\d|[3-6]\d\d|7[01]\d|720))/.test(digits)) return "Mastercard";
  if (/^(6011|65|64[4-9])/.test(digits)) return "Discover";
  return null;
}

/** How many digits a number on that network has. */
export const lengthOf = (brand: Brand | null) => (brand === "Amex" ? 15 : 16);

/** How many digits its security code has: four on the front of an Amex,
 *  three on the back of everything else. */
export const cvcOf = (brand: Brand | null) => (brand === "Amex" ? 4 : 3);

/** The number in the groups printed on the card: 4-6-5 on an Amex, fours
 *  everywhere else. */
export function formatNumber(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const brand = brandOf(digits);
  const kept = digits.slice(0, lengthOf(brand));
  const groups = brand === "Amex" ? [4, 6, 5] : [4, 4, 4, 4];
  const out: string[] = [];
  let at = 0;
  for (const size of groups) {
    if (at >= kept.length) break;
    out.push(kept.slice(at, at + size));
    at += size;
  }
  return out.join(" ");
}

/** The Luhn sum every card number is issued to pass, so a digit typed wrong
 *  is caught before the bank sees it. */
export function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** "MM / YY" as it is typed: the slash arrives after the month, and a first
 *  digit over 1 is a month on its own. */
export function formatExpiry(raw: string) {
  let digits = raw.replace(/\D/g, "").slice(0, 4);
  if (/^[2-9]/.test(digits)) digits = `0${digits}`.slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

/** Why an expiry will not do, if it will not: a month that does not exist,
 *  or a card whose last month is behind `today` ("YYYY-MM-DD"). */
export function expiryProblem(value: string, today: string): "format" | "month" | "past" | null {
  const m = value.match(/^(\d{2}) \/ (\d{2})$/);
  if (!m) return "format";
  const month = Number(m[1]);
  if (month < 1 || month > 12) return "month";
  const year = 2000 + Number(m[2]);
  const [ty, tm] = today.split("-").map(Number);
  // a card works through the last day of the month printed on it
  if (year < ty || (year === ty && month < tm)) return "past";
  return null;
}

/** The expiry the demo's test card rests at: three years on from today, so
 *  it never lapses on the day somebody walks through the demo. */
export function restingExpiry(today: string) {
  const [y, m] = today.split("-");
  return `${m} / ${String((Number(y) + 3) % 100).padStart(2, "0")}`;
}

/** The last four digits, which is all a receipt prints of a card. */
export const lastFour = (formatted: string) => formatted.replace(/\D/g, "").slice(-4);
