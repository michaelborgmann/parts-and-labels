import type { DiodePart } from "../../lib/catalog/schema";
import { diodeSpecifications } from "../../lib/catalog/diode-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type DiodeLabelProps = { part: DiodePart; locale: Locale; messages: Messages };

export function DiodeLabel({ part, locale, messages }: DiodeLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {diodeSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
