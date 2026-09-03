import type { VoltageRegulatorPart } from "../../lib/catalog/schema";
import { voltageRegulatorSpecifications } from "../../lib/catalog/voltage-regulator-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type VoltageRegulatorLabelProps = { part: VoltageRegulatorPart; locale: Locale; messages: Messages };

export function VoltageRegulatorLabel({ part, locale, messages }: VoltageRegulatorLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {voltageRegulatorSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
