import type { DiodePart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function diodeSpecifications(part: DiodePart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.diode;
  const rows = [{ label: text.function, value: text.functions[s.function] }];
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  return rows;
}
