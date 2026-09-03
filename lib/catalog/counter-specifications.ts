import type { CounterPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function counterSpecifications(part: CounterPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.counter;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.function, value: text.functions[s.function] },
    { label: text.counterCount, value: number.format(s.counterCount) },
  ];
  if (s.bitsPerCounter !== undefined) rows.push({ label: text.bitsPerCounter, value: number.format(s.bitsPerCounter) });
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  return rows;
}
