import type { LogicPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function logicSpecifications(part: LogicPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.logic;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.function, value: text.functions[s.function] },
    { label: text.gateCount, value: number.format(s.gateCount) },
    { label: text.inputsPerGate, value: number.format(s.inputsPerGate) },
  ];
  if (s.family) rows.push({ label: text.family, value: s.family });
  if (s.inputType) rows.push({ label: text.inputType, value: text.inputTypes[s.inputType] });
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  if (s.supplyVoltageMinVolts !== undefined) {
    rows.push({ label: text.supplyVoltageMin, value: `${number.format(s.supplyVoltageMinVolts)} V` });
  }
  if (s.supplyVoltageMaxVolts !== undefined) {
    rows.push({ label: text.supplyVoltageMax, value: `${number.format(s.supplyVoltageMaxVolts)} V` });
  }
  return rows;
}
