import type { AudioModulePart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function audioModuleSpecifications(part: AudioModulePart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.audioModule;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [{ label: text.codec, value: s.codec }];
  if (s.compatibleWith) rows.push({ label: text.compatibleWith, value: s.compatibleWith.join(" / ") });
  if (s.sampleRateHz !== undefined) rows.push({ label: text.sampleRate, value: number.format(s.sampleRateHz / 1000) + " kHz" });
  if (s.bitDepth !== undefined) rows.push({ label: text.bitDepth, value: number.format(s.bitDepth) + " bit" });
  return rows;
}

