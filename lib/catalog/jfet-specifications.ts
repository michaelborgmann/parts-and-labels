import type { JfetPart } from "./schema";
import type { Messages } from "../i18n";

export function jfetSpecifications(part: JfetPart, messages: Messages) {
  const rows = [{
    label: messages.jfet.channel,
    value: messages.jfet.channels[part.specifications.channel],
  }];
  if (part.specifications.package) {
    rows.push({ label: messages.details.package, value: part.specifications.package });
  }
  return rows;
}
