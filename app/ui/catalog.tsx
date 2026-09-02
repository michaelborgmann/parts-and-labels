"use client";

import { useState } from "react";
import { demoParts, filterParts, type DemoPart } from "./demo-parts";
import { ResistorLabel } from "./resistor-label";
import { yageoResistor } from "./yageo-resistor";

function PartLabel({ part, showSpecifications, showPackage, showCode }: {
  part: DemoPart; showSpecifications: boolean; showPackage: boolean; showCode: boolean;
}) {
  return (
    <div className="part-label" aria-label={`Label-Vorschau für ${part.name}`}>
      <div className="label-top"><span>{part.category}</span><span>{part.id}</span></div>
      <h3 className="label-title">{part.name}</h3>
      {showPackage && <p className="label-subtitle">{part.package}</p>}
      {showCode && part.colorBands && (
        <svg className="resistor-code" viewBox="0 0 320 64" role="img" aria-label={`Vier-Ring-Farbcode: ${part.colorBands.map((band) => band.name).join(", ")}`}>
          <path d="M20 32H300" stroke="#555" strokeWidth="3" />
          <rect x="70" y="13" width="180" height="38" rx="10" fill="#eee0bf" stroke="#777" />
          {part.colorBands.map((band, index) => <rect key={band.name} x={[95, 124, 153, 216][index]} y="14" width="12" height="36" fill={band.color} />)}
        </svg>
      )}
      {showSpecifications && <dl className="label-specs">{part.specifications.map((spec) => (
        <div key={spec.name}><dt>{spec.name}</dt><dd>{spec.value}</dd></div>
      ))}</dl>}
      <div className="label-footer">BEISPIEL · KEIN GEPRÜFTES DATENBLATT</div>
    </div>
  );
}

export function Catalog() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(demoParts[0].id);
  const [showSpecifications, setShowSpecifications] = useState(true);
  const [showPackage, setShowPackage] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [showSymbols, setShowSymbols] = useState(true);
  const [showQr, setShowQr] = useState(true);
  const filtered = filterParts(demoParts, query);
  const selected = filtered.find((part) => part.id === selectedId) ?? filtered[0];

  return (
    <>
      <header className="topbar"><div className="brand">parts<span>+</span>labels</div><span className="demo-badge">Demo · ohne Datenbank</span></header>
      <main className="workspace">
        <div className="intro"><p className="eyebrow">Deine Werkbank / Bauteilkatalog</p><h1>Ein Platz für jedes Bauteil.</h1><p>Bauteil auswählen, Eigenschaften ansehen und ein Label zusammenstellen.</p></div>
        <div className="columns">
          <section className="panel" aria-label="Bauteilkatalog">
            <div className="catalog-tools">
              <label className="search-label" htmlFor="part-search">Bauteile suchen</label>
              <input id="part-search" className="search-input" type="search" placeholder="Name, Kategorie oder Eigenschaft …" value={query} onChange={(event) => setQuery(event.target.value)} />
              <p className="count" role="status">{filtered.length} von {demoParts.length} Einträgen · 1 echter Artikel, 5 Beispiele</p>
            </div>
            <ul className="part-list">{filtered.map((part) => (
              <li key={part.id}><button className="part-button" aria-pressed={selected?.id === part.id} onClick={() => setSelectedId(part.id)}>
                <span className="part-mark" aria-hidden="true">{part.mark}</span>
                <span><span className="part-title">{part.name}</span><span className="part-meta">{part.category} · {part.id}</span></span>
                <span className="arrow" aria-hidden="true">↗</span>
              </button></li>
            ))}</ul>
            {filtered.length === 0 && <div className="empty"><h2>Keine Bauteile gefunden</h2><p>Versuche zum Beispiel „Widerstand“, „DIP“ oder „M3“.</p><button className="reset" onClick={() => setQuery("")}>Suche zurücksetzen</button></div>}
          </section>
          {selected ? <div>
            <section className="panel" aria-label={`Details zu ${selected.name}`}>
              <div className="detail-heading"><p className="eyebrow">{selected.id} / {selected.category}</p><h2>{selected.name}</h2><p>{selected.description}</p></div>
              <div className="detail-body">
                <dl className="facts"><div><dt>Bauform</dt><dd>{selected.package}</dd></div><div><dt>Datenquelle</dt><dd>{selected.id === "R-001" ? "Reichelt / deine Bestellung" : "Illustrative Beispieldaten"}</dd></div></dl>
                {selected.id === "R-001" && <>
                  <dl className="facts"><div><dt>Hersteller</dt><dd>{yageoResistor.manufacturer}</dd></div><div><dt>Hersteller-Teilenummer</dt><dd>{yageoResistor.manufacturerPartNumber}</dd></div><div><dt>Gekauft am 30.12.2025</dt><dd>{yageoResistor.purchase.quantity} Stück</dd></div><div><dt>Aktueller Bestand</dt><dd>Unbekannt · noch nicht gezählt</dd></div></dl>
                  <p className="source-note"><a href={yageoResistor.sourceUrl} target="_blank" rel="noreferrer">Reichelt-Produktseite ↗</a> · Händlerangaben, noch nicht anhand des Datenblatts geprüft. Weitere Käufe und Projektverwendungen sind noch nicht erfasst.</p>
                </>}
                <h2>Technische Eigenschaften</h2>
                <table className="spec-table" aria-label="Technische Eigenschaften"><tbody>{selected.specifications.map((spec) => <tr key={spec.name}><th scope="row">{spec.name}</th><td>{spec.value}</td></tr>)}</tbody></table>
              </div>
            </section>
            <section className="panel preview-section" aria-labelledby="preview-title">
              <div className="preview-heading"><h2 id="preview-title">Label-Vorschau</h2><span>Noch kein Druckmaßstab</span></div>
              <div className="label-stage">{selected.id === "R-001" ? <ResistorLabel showSpecifications={showSpecifications} showPackage={showPackage} showCode={showCode} showSymbols={showSymbols} showQr={showQr} /> : <PartLabel part={selected} showSpecifications={showSpecifications} showPackage={showPackage} showCode={showCode} />}</div>
              <fieldset className="label-options"><legend>Auf dem Label anzeigen</legend>
                <label><input type="checkbox" checked={showPackage} onChange={(event) => setShowPackage(event.target.checked)} />Bauform</label>
                <label><input type="checkbox" checked={showSpecifications} onChange={(event) => setShowSpecifications(event.target.checked)} />Eigenschaften</label>
                {(selected.colorBands || selected.id === "R-001") && <label><input type="checkbox" checked={showCode} onChange={(event) => setShowCode(event.target.checked)} />Farbcode</label>}
                {selected.id === "R-001" && <><label><input type="checkbox" checked={showSymbols} onChange={(event) => setShowSymbols(event.target.checked)} />Schaltzeichen</label><label><input type="checkbox" checked={showQr} onChange={(event) => setShowQr(event.target.checked)} />QR-Code</label></>}
              </fieldset>
            </section>
            <p className="footnote">Nur Vorschau: kein Speichern, Drucken oder PDF-Export. Deine Auswahl wird beim Neuladen zurückgesetzt.</p>
          </div> : <section className="panel empty"><h2>Keine Auswahl</h2><p>Ändere die Suche, um ein Bauteil und sein Label anzusehen.</p></section>}
        </div>
      </main>
    </>
  );
}
