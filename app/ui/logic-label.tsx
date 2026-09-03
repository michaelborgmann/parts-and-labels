import type { LogicPart } from "../../lib/catalog/schema";
import { logicSpecifications } from "../../lib/catalog/logic-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type LogicLabelProps = { part: LogicPart; locale: Locale; messages: Messages };

export function LogicLabel({ part, locale, messages }: LogicLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {logicSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
      {part.specifications.function === "nand" && part.specifications.inputsPerGate === 2 && (
        <svg width="160" height="80" viewBox="0 0 160 80" role="img" aria-label={messages.logic.nandSymbol}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 25H45 M10 55H45 M45 10H80 A30 30 0 0 1 80 70H45Z" />
            <circle cx="115" cy="40" r="5" />
            <path d="M120 40H150" />
          </g>
        </svg>
      )}
    </LabelFrame>
  );
}
