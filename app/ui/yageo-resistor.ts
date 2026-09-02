// Product data supplied by the owner from Reichelt; not a datasheet verification.
export const yageoResistor = {
  manufacturer: "YAGEO",
  manufacturerPartNumber: "MF0207FTE52-330R",
  supplierPartNumber: "METALL 330",
  sourceUrl: "https://www.reichelt.de/de/de/shop/produkt/widerstand_metallschicht_330_ohm_0207_0_6_w_1_-11733",
  description: "Metallschichtwiderstand",
  resistanceOhms: 330,
  tolerancePercent: 1,
  powerWatts: 0.6,
  package: "0207",
  purchase: { date: "2025-12-30", quantity: 20 },
  stock: null,
} as const;

const colors = [
  ["Schwarz", "#171717"], ["Braun", "#804220"], ["Rot", "#c5272d"],
  ["Orange", "#ef8222"], ["Gelb", "#f2ce30"], ["Grün", "#287543"],
  ["Blau", "#285baa"], ["Violett", "#874690"], ["Grau", "#858585"], ["Weiß", "#ffffff"],
] as const;

/** Five-band encoding for positive values with at most three significant digits. */
export function fiveBandCode(ohms: number, tolerance: number) {
  if (!Number.isFinite(ohms) || ohms <= 0) throw new Error("Invalid resistance");
  const exponent = Math.floor(Math.log10(ohms)) - 2;
  const significand = ohms / 10 ** exponent;
  if (Math.abs(significand - Math.round(significand)) > 1e-7 || exponent < -2 || exponent > 9) {
    throw new Error("Resistance cannot be represented with five bands");
  }
  const toleranceColors: Record<number, readonly [string, string]> = {
    1: colors[1], 2: colors[2], 0.5: colors[5], 0.25: colors[6], 0.1: colors[7], 0.05: colors[8],
    5: ["Gold", "#b29138"], 10: ["Silber", "#a9afb3"],
  };
  const toleranceColor = toleranceColors[tolerance];
  if (!toleranceColor) throw new Error("Unsupported tolerance");
  const multiplier = exponent === -2 ? toleranceColors[10] : exponent === -1 ? toleranceColors[5] : colors[exponent];
  return [...String(Math.round(significand)).split("").map((digit) => colors[Number(digit)]), multiplier, toleranceColor]
    .map(([name, color]) => ({ name, color }));
}

export const resistanceText = `${yageoResistor.resistanceOhms} Ω`;
export const powerText = `${String(yageoResistor.powerWatts).replace(".", ",")} W`;
