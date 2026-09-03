import type { LedPart } from "./schema";
import type { Locale, Messages } from "../i18n";

// Shared by the detail table and the fixed LED label.
export function ledSpecifications(
  part: LedPart,
  locale: Locale,
  messages: Messages,
): { label: string; value: string }[] {
  const specs = part.specifications;
  const text = messages.led;
  const colors: Record<string, string> = text.colors;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [{ label: text.color, value: colors[specs.color] ?? specs.color }];

  if (specs.diameterMm !== undefined) {
    rows.push({ label: text.diameter, value: `${number.format(specs.diameterMm)} mm` });
  }
  if (specs.mounting) {
    rows.push({
      label: text.mounting,
      value: specs.mounting === "through-hole" ? text.throughHole : specs.mounting,
    });
  }
  if (specs.luminousIntensityMillicandelas !== undefined) {
    rows.push({
      label: text.luminousIntensity,
      value: `${number.format(specs.luminousIntensityMillicandelas)} mcd`,
    });
  }
  if (specs.viewingAngleDegrees !== undefined) {
    rows.push({
      label: text.viewingAngle,
      value: `${number.format(specs.viewingAngleDegrees)}°`,
    });
  }
  return rows;
}
