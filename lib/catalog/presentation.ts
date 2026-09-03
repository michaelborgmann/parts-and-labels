import type { CatalogPart, Specification } from "./schema.ts";

export const number = (value: number) => String(Number(value.toPrecision(12))).replace(".", ",");
export function resistanceText(ohms: number) {
  return ohms >= 1e6 ? `${number(ohms / 1e6)} MΩ` : ohms >= 1e3 ? `${number(ohms / 1e3)} kΩ` : `${number(ohms)} Ω`;
}
export const partTitle = (part: CatalogPart) => part.kind === "resistor" ? resistanceText(part.resistor.resistanceOhms) : part.name;
export const packageText = (part: CatalogPart) => Object.values(part.package).join(" · ");
export const formatSpecification = (spec: Specification) => `${typeof spec.value === "number" ? number(spec.value) : typeof spec.value === "boolean" ? (spec.value ? "Ja" : "Nein") : spec.value}${spec.unit ? ` ${spec.unit}` : ""}`;
export function specifications(part: CatalogPart): Specification[] {
  return part.kind === "resistor" ? [
    { label: "Widerstand", value: resistanceText(part.resistor.resistanceOhms) },
    { label: "Toleranz", value: `±${number(part.resistor.tolerancePercent)} %` },
    { label: "Nennleistung", value: part.resistor.powerWatts, unit: "W" },
  ] : part.specifications;
}
export function filterParts(parts: CatalogPart[], query: string) {
  const terms = query.trim().toLocaleLowerCase("de").split(/\s+/).filter(Boolean);
  return parts.filter(part => {
    const text = [JSON.stringify(part), partTitle(part), ...specifications(part).map(formatSpecification)].join(" ").toLocaleLowerCase("de");
    return terms.every(term => text.includes(term));
  });
}
