import type { LedPart } from "../../lib/catalog/schema";
import { ledSpecifications } from "../../lib/catalog/led-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type LedLabelProps = {
  part: LedPart;
  locale: Locale;
  messages: Messages;
};

export function LedLabel({ part, locale, messages }: LedLabelProps) {
  const rows = ledSpecifications(part, locale, messages);

  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </LabelFrame>
  );
}
