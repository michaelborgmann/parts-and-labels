import type { CounterPart } from "../../lib/catalog/schema";
import { counterSpecifications } from "../../lib/catalog/counter-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type CounterLabelProps = { part: CounterPart; locale: Locale; messages: Messages };

export function CounterLabel({ part, locale, messages }: CounterLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {counterSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
