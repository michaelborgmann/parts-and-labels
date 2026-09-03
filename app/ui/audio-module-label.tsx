import type { AudioModulePart } from "../../lib/catalog/schema";
import { audioModuleSpecifications } from "../../lib/catalog/audio-module-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type AudioModuleLabelProps = { part: AudioModulePart; locale: Locale; messages: Messages };

export function AudioModuleLabel({ part, locale, messages }: AudioModuleLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {audioModuleSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}

