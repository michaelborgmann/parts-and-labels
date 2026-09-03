import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { catalogPartSchema, inventorySchema } from "./schema.ts";

async function readJson(path: string): Promise<unknown> {
  try { return JSON.parse(await readFile(path, "utf8")); }
  catch (error) { throw new Error(`Cannot read JSON ${path}: ${String(error)}`); }
}
export async function readCatalogDirectory(root: string) {
  const directory = join(root, "parts");
  const files = (await readdir(directory, { withFileTypes: true })).filter(f => f.isFile() && f.name.endsWith(".json")).map(f => f.name).sort();
  const parts = await Promise.all(files.map(async file => {
    const result = catalogPartSchema.safeParse(await readJson(join(directory, file)));
    if (!result.success) throw new Error(`Invalid component ${file}: ${result.error.message}`);
    return result.data;
  }));
  const ids = new Set<string>();
  for (const part of parts) {
    if (ids.has(part.id)) throw new Error(`Duplicate component ID: ${part.id}`);
    ids.add(part.id);
  }
  const result = inventorySchema.safeParse(await readJson(join(root, "inventory.json")));
  if (!result.success) throw new Error(`Invalid inventory.json: ${result.error.message}`);
  const inventory = result.data;
  for (const record of [...inventory.purchases, ...inventory.stocks]) if (!ids.has(record.partId)) throw new Error(`Inventory references unknown component: ${record.partId}`);
  if (new Set(inventory.purchases.map(p => p.id)).size !== inventory.purchases.length) throw new Error("Duplicate purchase ID");
  if (new Set(inventory.stocks.map(s => s.partId)).size !== inventory.stocks.length) throw new Error("Duplicate stock entry");
  parts.sort((a, b) => Number(a.example) - Number(b.example) || a.id.localeCompare(b.id));
  return { parts, inventory };
}
