import type { VoltageRegulatorPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function voltageRegulatorSpecifications(part: VoltageRegulatorPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.voltageRegulator;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.technology, value: text.technologies[s.technology] },
    { label: text.outputVoltage, value: number.format(s.outputVoltageVolts) + " V" },
  ];
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  return rows;
}
