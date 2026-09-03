import { connection } from "next/server";
import { Catalog } from "./ui/catalog";
import { loadParts } from "../lib/catalog/load-parts";
import { defaultLocale, getMessages } from "../lib/i18n";

export default async function Home() {
  await connection();

  const parts = await loadParts();

  return (
    <Catalog
      parts={parts}
      locale={defaultLocale}
      messages={getMessages(defaultLocale)}
    />
  );
}