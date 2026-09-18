"use client";

import { useEffect, useRef, useState } from "react";
import type { Part } from "../../lib/catalog/schema";
import type { Locale, Messages } from "../../lib/i18n";
import { CatalogDetail } from "./catalog-detail";
import { CatalogSidebar } from "./catalog-sidebar";

type CatalogProps = {
  parts: Part[];
  locale: Locale;
  messages: Messages;
};

export function Catalog({ parts, locale, messages }: CatalogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    parts[0]?.id ?? null,
  );
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const selectedPart = parts.find((part) => part.id === selectedId);

  useEffect(() => {
    detailRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  function selectPart(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          parts<span>+</span>labels
        </div>
      </header>

      <main
        className="workspace catalog-shell"
        data-mobile-detail={mobileDetailOpen}
      >
        <div className="intro">
          <p className="eyebrow">{messages.catalog.eyebrow}</p>
          <h1>{messages.catalog.title}</h1>
        </div>

        <div className="columns">
          <CatalogSidebar
            parts={parts}
            selectedId={selectedId}
            locale={locale}
            messages={messages}
            onSelect={selectPart}
          />

          <CatalogDetail
            ref={detailRef}
            part={selectedPart}
            locale={locale}
            messages={messages}
            onBack={() => setMobileDetailOpen(false)}
          />
        </div>
      </main>
    </div>
  );
}
