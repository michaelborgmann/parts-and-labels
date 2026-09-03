import { fiveBandCode } from "../../lib/catalog/resistor";
import type { Messages } from "../../lib/i18n";

type ResistorGraphicProps = {
  resistanceOhms: number;
  tolerancePercent?: number;
  bandCount?: number;
  messages: Messages;
};

export function ResistorGraphic({
  resistanceOhms, tolerancePercent, bandCount, messages,
}: ResistorGraphicProps) {
  let bands: ReturnType<typeof fiveBandCode> = [];

  if (bandCount === 5 && tolerancePercent !== undefined && resistanceOhms > 0) {
    try {
      bands = fiveBandCode(resistanceOhms, tolerancePercent);
    } catch {
      // Never draw a rounded or guessed code for unsupported values.
    }
  }

  return (
    <>
      {bands.length > 0 ? (
        <svg className="fixed-label-bands" viewBox="0 0 400 80" role="img"
          aria-label={messages.labels.calculatedBands}>
          <path d="M10 40H390" stroke="#666" strokeWidth="4" />
          <rect x="55" y="14" width="290" height="52" rx="14" fill="#cfdfeb" stroke="#222" strokeWidth="2" />
          {bands.map((band, index) => (
            <rect key={index} x={[85, 130, 175, 220, 300][index]}
              y="15" width="14" height="50" fill={band.color} />
          ))}
        </svg>
      ) : (
        <p className="fixed-label-note">{messages.labels.noColorCode}</p>
      )}
      <svg className="fixed-label-symbols" viewBox="0 0 300 42" role="img"
        aria-label={messages.labels.resistorSymbols}>
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h25m45 0h25" />
          <rect x="30" y="5" width="45" height="14" />
          <path d="M180 12h15l5-7 10 14 10-14 10 14 10-14 5 7h20" />
        </g>
        <g fontSize="12" fill="currentColor" textAnchor="middle">
          <text x="52" y="38">IEC</text>
          <text x="222" y="38">US</text>
        </g>
      </svg>
    </>
  );
}
