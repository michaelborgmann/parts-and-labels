import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Part } from "../../lib/catalog/schema";
import type { Messages } from "../../lib/i18n";

type LabelFrameProps = {
  part: Part;
  value: string;
  tolerance?: string;
  messages: Messages;
  children?: ReactNode;
};

export function LabelFrame({
  part, value, tolerance, messages, children,
}: LabelFrameProps) {
  return (
    <article className="fixed-label" aria-label={value}>
      <header className="fixed-label-heading">
        <h3>{value}</h3>
        {tolerance && <span>{tolerance}</span>}
      </header>
      <div className="fixed-label-body">
        <div className="fixed-label-identity">
          {part.manufacturer && <strong>{part.manufacturer}</strong>}
          {part.manufacturerPartNumber && <span>{part.manufacturerPartNumber}</span>}
        </div>
        <p className="fixed-label-type">{messages.details.types[part.type]}</p>
        {children}
        <footer className="fixed-label-footer">
          <small>{part.id}</small>
          {part.link && (
            <a className="fixed-label-qr" href={part.link} target="_blank" rel="noreferrer">
              <QRCodeSVG
                value={part.link}
                size={112}
                level="M"
                marginSize={4}
                title={messages.details.productPage}
              />
              <span>{messages.details.productPage} ↗</span>
            </a>
          )}
        </footer>
      </div>
    </article>
  );
}
