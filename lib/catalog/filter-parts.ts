import type { Part } from "./schema";

type TypeLabel = (type: Part["type"]) => string;

export function filterParts(
  parts: Part[],
  query: string,
  locale: string,
  typeLabel: TypeLabel,
): Part[] {
  const terms = normalize(query, locale).split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return parts;
  }

  return parts.filter((part) => {
    const searchableText = normalize(
      [
        part.id,
        part.name,
        part.manufacturer,
        part.manufacturerPartNumber,
        typeLabel(part.type),
        JSON.stringify(part.specifications),
      ].filter(Boolean).join(" "),
      locale,
    );
    const compactText = compact(searchableText);

    return terms.every(
      (term) => searchableText.includes(term) || compactText.includes(compact(term)),
    );
  });
}

function normalize(value: string, locale: string): string {
  return value.normalize("NFKC").toLocaleLowerCase(locale);
}

function compact(value: string): string {
  return value
    .replace(/[µμ]/g, "u")
    .replace(/ω/g, "ohm")
    .replace(/,/g, ".")
    .replace(/[\s·×_-]+/g, "");
}
