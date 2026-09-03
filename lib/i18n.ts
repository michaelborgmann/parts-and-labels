import de from "../locales/de.json";
import en from "../locales/en.json";

export type Locale = "de" | "en";
export type Messages = typeof de;

// Change this to "en" to use English throughout the page.
export const defaultLocale: Locale = "de";

const dictionaries: Record<Locale, Messages> = { de, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export function formatQuantity(
  quantity: number | null,
  locale: Locale,
  messages: Messages,
): string {
  if (quantity === null) {
    return messages.inventory.unknownStock;
  }

  const category = new Intl.PluralRules(locale).select(quantity);
  const template = category === "one"
    ? messages.inventory.quantity.one
    : messages.inventory.quantity.other;
  const count = new Intl.NumberFormat(locale).format(quantity);

  return template.replace("{count}", count);
}
