import type { MicrophonePart } from "../../lib/catalog/schema";
import { microphoneSpecifications } from "../../lib/catalog/microphone-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type MicrophoneLabelProps = { part: MicrophonePart; locale: Locale; messages: Messages };

export function MicrophoneLabel({ part, locale, messages }: MicrophoneLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {microphoneSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
