import type { CapacitorPart } from "../../lib/catalog/schema";
import { formatValue } from "../../lib/catalog/format-value";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type CapacitorLabelProps = {
  part: CapacitorPart;
  locale: Locale;
  messages: Messages;
};

export function CapacitorLabel({ part, locale, messages }: CapacitorLabelProps) {
  const specs = part.specifications;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  const tolerance = specs.tolerancePercent === undefined
    ? undefined : `±${number.format(specs.tolerancePercent)} %`;

  return (
    <LabelFrame part={part} messages={messages}
      value={formatValue(specs.capacitanceFarads, "F", locale)} tolerance={tolerance}>
      <dl className="fixed-label-specs">
        {specs.ratedVoltageVolts !== undefined && (
          <div><dt>{messages.details.ratedVoltage}</dt><dd>{number.format(specs.ratedVoltageVolts)} V</dd></div>
        )}
        {specs.dielectric && (
          <div><dt>{messages.details.dielectric}</dt><dd>{specs.dielectric}</dd></div>
        )}
        {specs.leadSpacingMm !== undefined && (
          <div><dt>{messages.details.leadSpacing}</dt><dd>{number.format(specs.leadSpacingMm)} mm</dd></div>
        )}
      </dl>
    </LabelFrame>
  );
}
