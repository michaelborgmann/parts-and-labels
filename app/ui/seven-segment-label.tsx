import type { SevenSegmentPart } from "../../lib/catalog/schema";
import { sevenSegmentSpecifications } from "../../lib/catalog/seven-segment-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type SevenSegmentLabelProps = { part: SevenSegmentPart; locale: Locale; messages: Messages };

export function SevenSegmentLabel({ part, locale, messages }: SevenSegmentLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {sevenSegmentSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
