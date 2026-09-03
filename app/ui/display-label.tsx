import type { DisplayPart } from "../../lib/catalog/schema";
import { displaySpecifications } from "../../lib/catalog/display-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type DisplayLabelProps = { part: DisplayPart; locale: Locale; messages: Messages };

export function DisplayLabel({ part, locale, messages }: DisplayLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {displaySpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}

