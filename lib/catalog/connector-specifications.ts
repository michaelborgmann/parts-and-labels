import type { ConnectorPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function connectorSpecifications(part: ConnectorPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.connector;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.style, value: text.styles[s.style] },
    { label: text.layout, value: number.format(s.rows) + " × " + number.format(s.pinsPerRow) },
    { label: text.pitch, value: number.format(s.pitchMm) + " mm" },
  ];
  if (s.orientation) rows.push({ label: text.orientation, value: text.orientations[s.orientation] });
  if (s.heightMm !== undefined) rows.push({ label: text.height, value: number.format(s.heightMm) + " mm" });
  return rows;
}

