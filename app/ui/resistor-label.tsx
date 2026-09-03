import type { ResistorPart } from "../../lib/catalog/schema";
import { formatValue } from "../../lib/catalog/format-value";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";
import { ResistorGraphic } from "./resistor-graphic";

type ResistorLabelProps = {
  part: ResistorPart;
  locale: Locale;
  messages: Messages;
};

export function ResistorLabel({ part, locale, messages }: ResistorLabelProps) {
  const specs = part.specifications;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const tolerance = specs.tolerancePercent === undefined
    ? undefined : `±${number.format(specs.tolerancePercent)} %`;

  return (
    <LabelFrame part={part} messages={messages}
      value={formatValue(specs.resistanceOhms, "Ω", locale)} tolerance={tolerance}>
      <ResistorGraphic
        resistanceOhms={specs.resistanceOhms}
        tolerancePercent={specs.tolerancePercent}
        bandCount={specs.bandCount}
        messages={messages}
      />
    </LabelFrame>
  );
}
