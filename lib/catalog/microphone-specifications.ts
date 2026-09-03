import type { MicrophonePart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function microphoneSpecifications(part: MicrophonePart, locale: Locale, messages: Messages) {
  const s = part.specifications;
  const text = messages.microphone;
  const rows = [{ label: text.technology, value: text.technologies[s.technology] }];
  return rows;
}
