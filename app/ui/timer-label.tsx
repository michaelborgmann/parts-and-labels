import type { TimerPart } from "../../lib/catalog/schema";
import { timerSpecifications } from "../../lib/catalog/timer-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type TimerLabelProps = { part: TimerPart; locale: Locale; messages: Messages };

export function TimerLabel({ part, locale, messages }: TimerLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {timerSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
