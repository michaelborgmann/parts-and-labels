import { forwardRef } from "react";
import type { Part } from "../../lib/catalog/schema";
import type { Locale, Messages } from "../../lib/i18n";
import { LabelPreview } from "./label-preview";
import { PartDetails } from "./part-details";

type CatalogDetailProps = {
  part?: Part;
  locale: Locale;
  messages: Messages;
  onBack: () => void;
};

export const CatalogDetail = forwardRef<HTMLDivElement, CatalogDetailProps>(
  function CatalogDetail({ part, locale, messages, onBack }, ref) {
    return (
      <div ref={ref} className="catalog-detail-column">
        <button className="mobile-back" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span> {messages.catalog.backToCatalog}
        </button>

        {part ? (
          <>
            <PartDetails part={part} locale={locale} messages={messages} />
            <LabelPreview part={part} locale={locale} messages={messages} />
          </>
        ) : (
          <section
            className="panel"
            aria-label={messages.catalog.selectionLabel}
          >
            <div className="detail-heading">
              <h2>{messages.catalog.noSelection}</h2>
            </div>
          </section>
        )}
      </div>
    );
  },
);
