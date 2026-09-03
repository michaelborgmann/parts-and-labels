import type { SpeakerPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function speakerSpecifications(part: SpeakerPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.speaker;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [{ label: text.impedance, value: number.format(s.impedanceOhms) + " Ω" }];
  if (s.ratedPowerWatts !== undefined) rows.push({ label: text.ratedPower, value: number.format(s.ratedPowerWatts) + " W" });
  return rows;
}
