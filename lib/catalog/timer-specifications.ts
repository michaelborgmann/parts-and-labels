import type { TimerPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function timerSpecifications(part: TimerPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.timer;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [{ label: text.channelCount, value: number.format(s.channelCount) }];
  if (s.technology) {
    rows.push({ label: text.technology, value: s.technology === "bipolar" ? text.bipolar : s.technology });
  }
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  if (s.supplyVoltageMinVolts !== undefined) {
    rows.push({ label: messages.logic.supplyVoltageMin, value: number.format(s.supplyVoltageMinVolts) + " V" });
  }
  if (s.supplyVoltageMaxVolts !== undefined) {
    rows.push({ label: messages.logic.supplyVoltageMax, value: number.format(s.supplyVoltageMaxVolts) + " V" });
  }
  return rows;
}
