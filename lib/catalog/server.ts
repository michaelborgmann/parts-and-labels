import "server-only";
import { join } from "node:path";
import { readCatalogDirectory } from "./read-files.ts";

export function loadCatalog() {
  return readCatalogDirectory(join(process.cwd(), "data"));
}
