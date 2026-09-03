import type { Part } from "../../lib/catalog/schema";
import { formatQuantity, type Locale, type Messages } from "../../lib/i18n";
import { PartSpecifications } from "./part-specifications";

type PartDetailsProps = {
  part: Part;
  locale: Locale;
  messages: Messages;
};

export function PartDetails({ part, locale, messages }: PartDetailsProps) {
  const text = messages.details;
  const number = new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 15,
  });

  return (
    <section className="panel" aria-label={messages.catalog.selectionLabel}>
      <div className="detail-heading">
        <p className="eyebrow">{text.types[part.type]}</p>
        <h2>{part.name}</h2>
      </div>

      <div className="detail-body">
        <dl className="facts">
          <div>
            <dt>{text.id}</dt>
            <dd>{part.id}</dd>
          </div>
          {part.manufacturer && (
            <div>
              <dt>{text.manufacturer}</dt>
              <dd>{part.manufacturer}</dd>
            </div>
          )}
          {part.manufacturerPartNumber && (
            <div>
              <dt>{text.manufacturerPartNumber}</dt>
              <dd>{part.manufacturerPartNumber}</dd>
            </div>
          )}
          <div>
            <dt>{text.stock}</dt>
            <dd>{formatQuantity(part.quantity, locale, messages)}</dd>
          </div>
        </dl>

        <h3>{text.specifications}</h3>
        <PartSpecifications part={part} locale={locale} messages={messages} />

        {!!part.datasheets?.length && (
          <section className="technical-section" aria-label={text.datasheets}>
            <h3>{text.datasheets}</h3>
            <ul className="technical-sources">
              {part.datasheets.map((url, index) => (
                <li key={`${index}-${url}`}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {text.datasheet} {number.format(index + 1)} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {part.link && (
          <p className="source-note">
            <a href={part.link} target="_blank" rel="noreferrer">
              {text.productPage} ↗
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
