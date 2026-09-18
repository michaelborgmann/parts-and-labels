"use client";

import { useMemo, useState } from "react";
import { filterParts } from "../../lib/catalog/filter-parts";
import type { Part } from "../../lib/catalog/schema";
import { formatQuantity, type Locale, type Messages } from "../../lib/i18n";

type CatalogSidebarProps = {
  parts: Part[];
  selectedId: string | null;
  locale: Locale;
  messages: Messages;
  onSelect: (id: string) => void;
};

export function CatalogSidebar({
  parts,
  selectedId,
  locale,
  messages,
  onSelect,
}: CatalogSidebarProps) {
  const [query, setQuery] = useState("");
  const [openTypes, setOpenTypes] = useState<Set<Part["type"]>>(
    () => new Set(parts[0] ? [parts[0].type] : []),
  );
  const filteredParts = useMemo(
    () => filterParts(parts, query, locale, (type) => messages.details.types[type]),
    [parts, query, locale, messages],
  );
  const groups = useMemo(
    () => groupParts(filteredParts, locale, messages),
    [filteredParts, locale, messages],
  );
  const resultText = messages.catalog.resultCount
    .replace("{count}", new Intl.NumberFormat(locale).format(filteredParts.length))
    .replace("{total}", new Intl.NumberFormat(locale).format(parts.length));

  function setGroupOpen(type: Part["type"], open: boolean) {
    setOpenTypes((current) => {
      const next = new Set(current);
      if (open) next.add(type);
      else next.delete(type);
      return next;
    });
  }

  return (
    <aside
      className="panel catalog-list-column"
      aria-label={messages.catalog.listLabel}
    >
      <div className="catalog-tools">
        <label className="search-label" htmlFor="part-search">
          {messages.catalog.searchLabel}
        </label>
        <div className="search-field">
          <input
            id="part-search"
            className="search-input"
            type="search"
            value={query}
            placeholder={messages.catalog.searchPlaceholder}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="clear-search"
              type="button"
              aria-label={messages.catalog.clearSearch}
              title={messages.catalog.clearSearch}
              onClick={() => setQuery("")}
            >
              ×
            </button>
          )}
        </div>
        <p className="count" aria-live="polite">{resultText}</p>
      </div>

      <div className="catalog-groups">
        {groups.map((group) => (
          <details
            className="category-group"
            key={group.type}
            open={Boolean(query) || openTypes.has(group.type)}
            onToggle={(event) => {
              if (!query) setGroupOpen(group.type, event.currentTarget.open);
            }}
          >
            <summary>
              <span>{group.label}</span>
              <span className="category-count">{group.parts.length}</span>
            </summary>
            <ul className="part-list">
              {group.parts.map((part) => (
                <li key={part.id}>
                  <button
                    className="part-button"
                    type="button"
                    aria-current={part.id === selectedId ? "true" : undefined}
                    onClick={() => onSelect(part.id)}
                  >
                    <span className="part-copy">
                      <span className="part-title">{part.name}</span>
                      <span className="part-meta">
                        {part.manufacturer ?? messages.catalog.unknownManufacturer}
                      </span>
                    </span>
                    <span
                      className="part-stock"
                      title={formatQuantity(part.quantity, locale, messages)}
                    >
                      ×{part.quantity ?? "?"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}

        {parts.length === 0 && (
          <p className="empty">{messages.catalog.empty}</p>
        )}
        {parts.length > 0 && filteredParts.length === 0 && (
          <div className="empty">
            <p>{messages.catalog.noResults}</p>
            <button className="reset" type="button" onClick={() => setQuery("")}>
              {messages.catalog.clearSearch}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function groupParts(parts: Part[], locale: Locale, messages: Messages) {
  const groups = new Map<Part["type"], Part[]>();

  for (const part of parts) {
    const group = groups.get(part.type) ?? [];
    group.push(part);
    groups.set(part.type, group);
  }

  return Array.from(groups, ([type, groupedParts]) => ({
    type,
    label: messages.details.types[type],
    parts: groupedParts,
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}
