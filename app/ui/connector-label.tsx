import type { ConnectorPart } from "../../lib/catalog/schema";
import { connectorSpecifications } from "../../lib/catalog/connector-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type ConnectorLabelProps = { part: ConnectorPart; locale: Locale; messages: Messages };

export function ConnectorLabel({ part, locale, messages }: ConnectorLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {connectorSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}

