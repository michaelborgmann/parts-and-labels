import type { PotentiometerPart } from "./schema";
import type { Locale, Messages } from "../i18n";
import { formatValue } from "./format-value";

export function potentiometerSpecifications(part: PotentiometerPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.potentiometer;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: messages.details.resistance, value: formatValue(s.resistanceOhms, "Ω", locale) },
    { label: text.gangCount, value: number.format(s.gangCount) },
  ];
  if (s.taper) rows.push({ label: text.taper, value: text.tapers[s.taper] });
  if (s.style) rows.push({ label: text.style, value: text.styles[s.style] });
  if (s.shaftDiameterMm !== undefined) rows.push({ label: text.shaftDiameter, value: number.format(s.shaftDiameterMm) + " mm" });
  return rows;
}
