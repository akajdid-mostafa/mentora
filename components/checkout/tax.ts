// The countries the checkout sells into and the tax each one adds to an
// online course. Sample data at each country's standard rate, which is what a
// digital service is charged at in most of them: a real store reads the rate
// from its tax provider at the moment of sale, by the buyer's address, and
// this table is the one place to swap for that call.
//
// Prices on the site are set before tax, as a US store lists them, so the tax
// is a line of its own above the total rather than a share hidden inside it.

export type Country = {
  code: string;
  name: string;
  /** What the tax is called on an invoice there, and its rate in percent.
   *  Missing where an online course carries none at the national level. */
  tax?: { name: string; rate: number };
  /** What the postal code is called where a card check asks for it. */
  postal?: { label: string; pattern: RegExp; example: string };
};

export const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    postal: { label: "ZIP code", pattern: /^\d{5}(-\d{4})?$/, example: "10001" },
  },
  {
    code: "CA",
    name: "Canada",
    tax: { name: "GST", rate: 5 },
    postal: { label: "Postal code", pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, example: "M5V 2T6" },
  },
  {
    code: "GB",
    name: "United Kingdom",
    tax: { name: "VAT", rate: 20 },
    postal: { label: "Postcode", pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/, example: "EC1V 9HX" },
  },
  { code: "IE", name: "Ireland", tax: { name: "VAT", rate: 23 } },
  { code: "DE", name: "Germany", tax: { name: "VAT", rate: 19 } },
  { code: "FR", name: "France", tax: { name: "VAT", rate: 20 } },
  { code: "ES", name: "Spain", tax: { name: "VAT", rate: 21 } },
  { code: "PT", name: "Portugal", tax: { name: "VAT", rate: 23 } },
  { code: "NL", name: "Netherlands", tax: { name: "VAT", rate: 21 } },
  { code: "SE", name: "Sweden", tax: { name: "VAT", rate: 25 } },
  { code: "AU", name: "Australia", tax: { name: "GST", rate: 10 } },
  { code: "NZ", name: "New Zealand", tax: { name: "GST", rate: 15 } },
  { code: "SG", name: "Singapore", tax: { name: "GST", rate: 9 } },
  { code: "IN", name: "India", tax: { name: "GST", rate: 18 } },
  { code: "JP", name: "Japan", tax: { name: "JCT", rate: 10 } },
];

export const countryOf = (code: string) => countries.find((c) => c.code === code) ?? countries[0];

/** The tax on an amount in cents, rounded to the cent as an invoice rounds it. */
export const taxOn = (cents: number, country: Country) =>
  country.tax ? Math.round((cents * country.tax.rate) / 100) : 0;
