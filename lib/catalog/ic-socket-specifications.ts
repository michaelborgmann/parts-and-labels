import type { IcSocketPart } from "./schema";
import type { Locale, Messages } from "../i18n";

export function icSocketSpecifications(part: IcSocketPart, locale: Locale, messages: Messages) {
  const specs = part.specifications;
  const text = messages.icSocket;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const rows = [{ label: text.pinCount, value: number.format(specs.pinCount) }];

  if (specs.rowSpacingMm !== undefined) {
    rows.push({ label: text.rowSpacing, value: `${number.format(specs.rowSpacingMm)} mm` });
  }
  if (specs.contactType) {
    rows.push({
      label: text.contactType,
      value: specs.contactType === "machined" ? text.machined
        : specs.contactType === "dual-leaf" ? text.dualLeaf : specs.contactType,
    });
  }
  if (specs.contactPlating) {
    rows.push({
      label: text.contactPlating,
      value: specs.contactPlating === "gold" ? text.gold : specs.contactPlating,
    });
  }
  return rows;
}
