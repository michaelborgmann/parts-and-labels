import type { Locale } from "../i18n";

export function formatValue(
  value: number,
  unit: "Ω" | "F",
  locale: Locale,
): string {
  let scale = 1;
  let prefix = "";

  if (unit === "Ω") {
    if (value >= 1e6) { scale = 1e6; prefix = "M"; }
    else if (value >= 1e3) { scale = 1e3; prefix = "k"; }
  } else {
    if (value < 1e-9) { scale = 1e-12; prefix = "p"; }
    else if (value < 1e-6) { scale = 1e-9; prefix = "n"; }
    else if (value < 1) { scale = 1e-6; prefix = "µ"; }
  }

  const number = new Intl.NumberFormat(locale, { maximumSignificantDigits: 12 });
  return `${number.format(value / scale)} ${prefix}${unit}`;
}
