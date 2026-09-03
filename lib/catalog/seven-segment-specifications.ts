import type { SevenSegmentPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function sevenSegmentSpecifications(part: SevenSegmentPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.sevenSegment;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.digitCount, value: number.format(s.digitCount) },
    { label: text.commonPin, value: text.commonPins[s.commonPin] },
    { label: messages.led.color, value: messages.led.colors[s.color as keyof typeof messages.led.colors] ?? s.color },
  ];
  if (s.digitHeightMm !== undefined) rows.push({ label: text.digitHeight, value: number.format(s.digitHeightMm) + " mm" });
  return rows;
}
