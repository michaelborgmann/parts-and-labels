import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readCatalogDirectory } from "../lib/catalog/read-files.ts";
import { catalogPartSchema, inventorySchema } from "../lib/catalog/schema.ts";
import { filterParts, partTitle, specifications } from "../lib/catalog/presentation.ts";
import { fiveBandCode } from "../lib/catalog/resistor.ts";

const catalog = await readCatalogDirectory(new URL("../data", import.meta.url).pathname);
const resistor = catalog.parts.find(part => part.id === "R-001");

test("real JSON preserves identity, source conflicts and unknown stock", () => {
  assert.equal(catalog.parts.length, 6);
  assert.equal(resistor.manufacturerPartNumber, "MF0207FTE52-330R");
  assert.equal(resistor.resistor.resistanceOhms, 330);
  assert.deepEqual(resistor.sections.find(s => s.title === "Spannungsangaben").entries.map(e => e.value), [250, 300, 350]);
  assert.equal(catalog.inventory.purchases[0].quantity, 20);
  assert.equal(catalog.inventory.stocks[0].quantity, null);
  assert.ok(resistor.sources.find(s => s.id === resistor.label.qrSourceId).url.endsWith("-11733"));
});

test("generic formatting, search and resistor code derive from values", () => {
  const other = structuredClone(resistor);
  other.id = "another-resistor";
  other.resistor.resistanceOhms = 10000;
  assert.equal(partTitle(other), "10 kΩ");
  assert.equal(specifications(other)[0].value, "10 kΩ");
  assert.equal(filterParts([other], "10 kΩ").length, 1);
  assert.equal(filterParts(catalog.parts, "YAGEO 330").length, 1);
  assert.deepEqual(fiveBandCode(330, 1).map(b => b.name), ["Orange", "Orange", "Schwarz", "Schwarz", "Braun"]);
  assert.deepEqual(fiveBandCode(10000, 1).map(b => b.name), ["Braun", "Schwarz", "Schwarz", "Rot", "Braun"]);
  assert.throws(() => fiveBandCode(330.123, 1));
});

test("schema rejects malformed properties and dangling sources", () => {
  for (const mutate of [
    p => { p.resistor.resistanceOhms = -1; },
    p => { p.label.qrSourceId = "missing"; },
    p => { p.sources[0].url = "javascript:alert(1)"; },
    p => { p.sources.push(p.sources[0]); },
    p => { p.unexpected = true; },
  ]) {
    const part = structuredClone(resistor); mutate(part);
    assert.equal(catalogPartSchema.safeParse(part).success, false);
  }
  assert.equal(inventorySchema.safeParse({ schemaVersion: 1, purchases: [], stocks: [{ partId: "R-001", quantity: 20, status: "unknown" }] }).success, false);
});

test("loader discovers added files without imports and rejects broken references", async () => {
  const root = await mkdtemp(join(tmpdir(), "parts-json-test-"));
  const write = (path, value) => writeFile(join(root, path), JSON.stringify(value));
  try {
    await mkdir(join(root, "parts"));
    await write("inventory.json", { schemaVersion: 1, purchases: [], stocks: [] });
    assert.equal((await readCatalogDirectory(root)).parts.length, 0);
    await write("parts/first.json", resistor);
    const second = structuredClone(resistor); second.id = "new-part"; second.resistor.resistanceOhms = 10000;
    await write("parts/second.json", second);
    assert.equal((await readCatalogDirectory(root)).parts.length, 2);
    await write("parts/second.json", resistor);
    await assert.rejects(readCatalogDirectory(root), /Duplicate component ID/);
    await write("parts/second.json", second);
    await write("inventory.json", { schemaVersion: 1, purchases: [], stocks: [{ partId: "missing", quantity: null, status: "unknown" }] });
    await assert.rejects(readCatalogDirectory(root), /unknown component/);
    await write("inventory.json", { schemaVersion: 1, purchases: [], stocks: [] });
    await writeFile(join(root, "parts/second.json"), "{broken");
    await assert.rejects(readCatalogDirectory(root), /second.json/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
