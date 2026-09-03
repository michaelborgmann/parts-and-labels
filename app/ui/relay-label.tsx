import type { RelayPart } from "../../lib/catalog/schema";
import { relaySpecifications } from "../../lib/catalog/relay-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type RelayLabelProps = { part: RelayPart; locale: Locale; messages: Messages };

export function RelayLabel({ part, locale, messages }: RelayLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {relaySpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
