import type { BjtPart } from "../../lib/catalog/schema";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type BjtLabelProps = {
  part: BjtPart;
  locale: Locale;
  messages: Messages;
};

export function BjtLabel({ part, locale, messages }: BjtLabelProps) {
  const specs = part.specifications;
  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });

  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        <div>
          <dt>{messages.details.polarity}</dt>
          <dd>{specs.polarity.toUpperCase()}</dd>
        </div>
        {specs.package && (
          <div>
            <dt>{messages.details.package}</dt>
            <dd>{specs.package}</dd>
          </div>
        )}
        {specs.maxCollectorEmitterVoltageVolts !== undefined && (
          <div>
            <dt>{messages.details.maxCollectorEmitterVoltage}</dt>
            <dd>{number.format(specs.maxCollectorEmitterVoltageVolts)} V</dd>
          </div>
        )}
        {specs.maxCollectorCurrentAmps !== undefined && (
          <div>
            <dt>{messages.details.maxCollectorCurrent}</dt>
            <dd>{number.format(specs.maxCollectorCurrentAmps)} A</dd>
          </div>
        )}
      </dl>
    </LabelFrame>
  );
}
