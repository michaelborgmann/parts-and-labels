import type { SwitchPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function switchSpecifications(part: SwitchPart, locale: Locale, messages: Messages) {
  const specs = part.specifications;
  const text = messages.switch;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.style, value: specs.style === "tactile" ? text.tactile : specs.style === "slide" ? text.slide : specs.style },
    { label: text.action, value: text.actions[specs.action] },
    { label: text.contactForm, value: specs.contactForm === "normally-open" ? text.normallyOpen : specs.contactForm === "changeover" ? text.changeover : specs.contactForm },
    { label: text.poleCount, value: number.format(specs.poleCount) },
  ];
  if (specs.mounting) {
    rows.push({ label: text.mounting, value: specs.mounting === "through-hole" ? text.throughHole : specs.mounting });
  }
  if (specs.dimensionsMm) {
    const { length, width, height } = specs.dimensionsMm;
    rows.push({
      label: text.dimensions,
      value: [length, width, height].map(value => number.format(value)).join(" × ") + " mm",
    });
  }
  if (specs.leadSpacingMm !== undefined) {
    rows.push({ label: messages.details.leadSpacing, value: number.format(specs.leadSpacingMm) + " mm" });
  }
  return rows;
}
