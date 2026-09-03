import type { SwitchPart } from "../../lib/catalog/schema";
import { switchSpecifications } from "../../lib/catalog/switch-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type SwitchLabelProps = { part: SwitchPart; locale: Locale; messages: Messages };

export function SwitchLabel({ part, locale, messages }: SwitchLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {switchSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
