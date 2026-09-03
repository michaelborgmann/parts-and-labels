import type { PotentiometerPart } from "../../lib/catalog/schema";
import { potentiometerSpecifications } from "../../lib/catalog/potentiometer-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";
import { formatValue } from "../../lib/catalog/format-value";

type PotentiometerLabelProps = { part: PotentiometerPart; locale: Locale; messages: Messages };

export function PotentiometerLabel({ part, locale, messages }: PotentiometerLabelProps) {
  return (
    <LabelFrame part={part} value={formatValue(part.specifications.resistanceOhms, "Ω", locale)} messages={messages}>
      <dl className="fixed-label-specs">
        {potentiometerSpecifications(part, locale, messages).slice(1).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}

