import type { DisplayPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function displaySpecifications(part: DisplayPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.display;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.technology, value: s.technology },
    { label: text.resolution, value: number.format(s.widthPixels) + " × " + number.format(s.heightPixels) + " px" },
  ];
  if (s.diagonalInches !== undefined) rows.push({ label: text.diagonal, value: number.format(s.diagonalInches) + "″" });
  if (s.controller) rows.push({ label: text.controller, value: s.controller });
  if (s.interfaces) rows.push({ label: text.interfaces, value: s.interfaces.join(" / ") });
  return rows;
}

