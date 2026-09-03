import type { RelayPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function relaySpecifications(part: RelayPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.relay;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.coilVoltage, value: number.format(s.coilVoltageVolts) + " V " + s.coilSupply.toUpperCase() },
    { label: text.contactForm, value: text.contactForms[s.contactForm] },
    { label: text.poleCount, value: number.format(s.poleCount) },
  ];
  return rows;
}
