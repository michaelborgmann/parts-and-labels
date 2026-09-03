import type { AmplifierPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function amplifierSpecifications(part: AmplifierPart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.amplifier;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [
    { label: text.form, value: text.forms[s.form] },
    { label: text.channelCount, value: number.format(s.channelCount) },
  ];
  if (s.amplifierClass) rows.push({ label: text.amplifierClass, value: s.amplifierClass });
  if (s.chip) rows.push({ label: text.chip, value: s.chip });
  if (s.package) rows.push({ label: messages.details.package, value: s.package });
  return rows;
}
