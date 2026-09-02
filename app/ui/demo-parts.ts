import { yageoResistor, resistanceText, powerText } from "./yageo-resistor.ts";
// The first entry is sourced from the owner's order. Others remain illustrative.
export type DemoPart = {
  id: string;
  name: string;
  category: string;
  mark: string;
  description: string;
  package: string;
  specifications: { name: string; value: string }[];
  colorBands?: { name: string; color: string }[];
};

export const demoParts: DemoPart[] = [
  {
    id: "R-001", name: resistanceText, category: "Widerstand", mark: "R",
    description: `${yageoResistor.description} · ${yageoResistor.manufacturer} · ${yageoResistor.manufacturerPartNumber}`, package: "0207 · axial · THT",
    specifications: [{ name: "Widerstand", value: resistanceText }, { name: "Toleranz", value: `±${yageoResistor.tolerancePercent} %` }, { name: "Nennleistung", value: powerText }, { name: "Händler-Artikelnummer", value: yageoResistor.supplierPartNumber }],
  },
  {
    id: "IC-001", name: "NE555", category: "IC", mark: "IC",
    description: "Timer-Baustein für Taktgeber, Impulse und Zeitverzögerungen.", package: "DIP-8 · THT",
    specifications: [{ name: "Funktion", value: "Timer" }, { name: "Anschlüsse", value: "8" }],
  },
  {
    id: "C-001", name: "100 nF", category: "Kondensator", mark: "C",
    description: "Keramikkondensator, beispielsweise zur lokalen Entkopplung.", package: "Radial · THT",
    specifications: [{ name: "Kapazität", value: "100 nF" }, { name: "Nennspannung", value: "50 V" }, { name: "Rastermaß", value: "2,54 mm" }],
  },
  {
    id: "J-001", name: "Stiftleiste 1×03", category: "Steckverbinder", mark: "J",
    description: "Einreihige, gerade Stiftleiste mit drei Kontakten.", package: "Gerade · THT",
    specifications: [{ name: "Kontakte", value: "3" }, { name: "Rastermaß", value: "2,54 mm" }],
  },
  {
    id: "D-001", name: "LED rot", category: "LED", mark: "D",
    description: "Rote Anzeige-LED mit bedrahteten Anschlüssen.", package: "Rund · THT",
    specifications: [{ name: "Farbe", value: "Rot" }, { name: "Durchmesser", value: "5 mm" }],
  },
  {
    id: "M-001", name: "M3 × 10 mm", category: "Mechanik", mark: "M",
    description: "Zylinderschraube mit Innensechskant für mechanische Aufbauten.", package: "Zylinderkopf",
    specifications: [{ name: "Gewinde", value: "M3" }, { name: "Länge", value: "10 mm" }, { name: "Material", value: "Edelstahl" }],
  },
];

export function filterParts(parts: DemoPart[], query: string): DemoPart[] {
  const terms = query.trim().toLocaleLowerCase("de").split(/\s+/).filter(Boolean);
  return parts.filter((part) => {
    const text = [part.id, part.name, part.category, part.description, part.package,
      ...part.specifications.flatMap((spec) => [spec.name, spec.value])].join(" ").toLocaleLowerCase("de");
    return terms.every((term) => text.includes(term));
  });
}
