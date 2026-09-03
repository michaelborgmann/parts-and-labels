"use client";

import { useState } from "react";
import type { Part } from "../../lib/catalog/schema";
import type { Locale, Messages } from "../../lib/i18n";
import { PartDetails } from "./part-details";
import { LabelPreview } from "./label-preview";

type CatalogProps = {
  parts: Part[];
  locale: Locale;
  messages: Messages;
};

export function Catalog({ parts, locale, messages }: CatalogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    parts[0]?.id ?? null,
  );

  const selectedPart = parts.find((part) => part.id === selectedId);

  return (
    <>
      <header className="topbar">
        <div className="brand">
          parts<span>+</span>labels
        </div>
      </header>

      <main className="workspace">
        <div className="intro">
          <p className="eyebrow">{messages.catalog.eyebrow}</p>
          <h1>{messages.catalog.title}</h1>
        </div>

        <div className="columns">
          <section className="panel" aria-label={messages.catalog.listLabel}>
            <ul className="part-list">
              {parts.map((part) => (
                <li key={part.id}>
                  <button
                    className="part-button"
                    aria-pressed={part.id === selectedId}
                    onClick={() => setSelectedId(part.id)}
                  >
                    <span>
                      <span className="part-title">{part.name}</span>
                      <span className="part-meta">
                        {part.manufacturer ?? messages.catalog.unknownManufacturer}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {parts.length === 0 && (
              <p className="empty">{messages.catalog.empty}</p>
            )}
          </section>

          {selectedPart ? (
            <div>
              <PartDetails
                part={selectedPart}
                locale={locale}
                messages={messages}
              />
              <LabelPreview
                part={selectedPart}
                locale={locale}
                messages={messages}
              />
            </div>
          ) : (
            <section className="panel" aria-label={messages.catalog.selectionLabel}>
              <div className="detail-heading">
                <h2>{messages.catalog.noSelection}</h2>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}