import type { AmplifierPart } from "../../lib/catalog/schema";
import { amplifierSpecifications } from "../../lib/catalog/amplifier-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type AmplifierLabelProps = { part: AmplifierPart; locale: Locale; messages: Messages };

export function AmplifierLabel({ part, locale, messages }: AmplifierLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {amplifierSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
