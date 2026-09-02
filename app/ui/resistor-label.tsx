import { QRCodeSVG } from "qrcode.react";
import { fiveBandCode, yageoResistor as part, resistanceText, powerText } from "./yageo-resistor";

export function ResistorLabel({ showPackage, showSpecifications, showCode, showSymbols, showQr }: {
  showPackage: boolean; showSpecifications: boolean; showCode: boolean; showSymbols: boolean; showQr: boolean;
}) {
  const bands = fiveBandCode(part.resistanceOhms, part.tolerancePercent);
  return <article className="resistor-label" aria-label="Label-Vorschau für YAGEO 330 Ω">
    <header className="resistor-heading"><h3>{resistanceText}</h3><span>±{part.tolerancePercent} %</span></header>
    <div className="resistor-content">
      <div className="resistor-identity"><strong>{part.manufacturer}</strong><span>{part.manufacturerPartNumber}</span></div>
      {showCode && <svg className="five-band" viewBox="0 0 440 122" role="img" aria-label={`Berechneter Fünfring-Farbcode: ${bands.map((band) => band.name).join(", ")}`}>
        <path d="M12 40H428" stroke="#626a73" strokeWidth="4" />
        <rect x="55" y="14" width="330" height="52" rx="14" fill="#cfdfeb" stroke="#28394a" strokeWidth="2" />
        {bands.map((band, index) => {
          const x = [85, 148, 211, 274, 351][index];
          return <g key={index}>
            <rect x={x - 7} y="15" width="14" height="50" fill={band.color} />
            <path d={`M${x} 69v12`} stroke="#333" />
            <text x={x} y="101" textAnchor="middle" fill="#111" fontSize="13">{band.name}</text>
          </g>;
        })}
      </svg>}
      {showSymbols && <svg className="resistor-symbols" viewBox="0 0 300 38" role="img" aria-label="Widerstandssymbole: Rechteck (IEC) und Zickzack (US)">
        <g fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h25m45 0h25" /><rect x="30" y="5" width="45" height="14" /><path d="M180 12h15l5-7 10 14 10-14 10 14 10-14 5 7h20" /></g>
        <g fontSize="10" fill="currentColor" textAnchor="middle"><text x="52" y="35">IEC</text><text x="222" y="35">US</text></g>
      </svg>}
      <p className="resistor-description">{part.description}</p>
      <div className="resistor-bottom"><div className="resistor-specs">
        {showSpecifications && <p><span>Nennleistung</span><strong>{powerText}</strong></p>}
        {showPackage && <><p><span>Bauform</span><strong>{part.package}</strong></p><p><span>Anschlüsse</span><strong>axial / THT</strong></p></>}
        <small>Reichelt · {part.supplierPartNumber}</small>
      </div>
      {showQr && <a className="resistor-qr" href={part.sourceUrl} target="_blank" rel="noreferrer" aria-label="Produkt bei Reichelt öffnen">
        <QRCodeSVG value={part.sourceUrl} size={120} level="M" marginSize={4} title="Reichelt-Produktseite" />
        <span>Produktseite ↗</span>
      </a>}
      </div>
    </div>
  </article>;
}
