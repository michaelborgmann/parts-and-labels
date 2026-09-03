import type { JfetPart } from "../../lib/catalog/schema";
import type { Messages } from "../../lib/i18n";
import { jfetSpecifications } from "../../lib/catalog/jfet-specifications";
import { LabelFrame } from "./label-frame";

export function JfetLabel({ part, messages }: { part: JfetPart; messages: Messages }) {
  return (
    <LabelFrame part={part} value={part.name} messages={messages}>
      <dl className="fixed-label-specs">
        {jfetSpecifications(part, messages).map(({ label, value }) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>
    </LabelFrame>
  );
}
