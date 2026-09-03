import type { IcSocketPart } from "../../lib/catalog/schema";
import { icSocketSpecifications } from "../../lib/catalog/ic-socket-specifications";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelFrame } from "./label-frame";

type IcSocketLabelProps = { part: IcSocketPart; locale: Locale; messages: Messages };

export function IcSocketLabel({ part, locale, messages }: IcSocketLabelProps) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {icSocketSpecifications(part, locale, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
