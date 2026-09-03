import type { SpeakerPart } from "../../lib/catalog/schema";
import { speakerSpecifications } from "../../lib/catalog/speaker-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type SpeakerLabelProps = { part: SpeakerPart; locale: Locale; messages: Messages };

export function SpeakerLabel({ part, locale, messages }: SpeakerLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {speakerSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
