import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loadParts } from "../lib/catalog/load-parts.ts";
import { partSchema } from "../lib/catalog/schema.ts";

const component = {
  id: "test-resistor",
  type: "resistor",
  name: "Test resistor",
  quantity: null,
  specifications: { resistanceOhms: 330 },
};

async function temporaryDirectory(context) {
  const directory = await mkdtemp(join(tmpdir(), "parts-loader-test-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

async function writePart(directory, filename, part = component) {
  await writeFile(join(directory, filename), JSON.stringify(part));
}

test("loads the real simplified component file", async () => {
  const directory = fileURLToPath(new URL("../data/parts/", import.meta.url));
  const parts = await loadParts(directory);
  const resistor = parts.find((part) => part.id === "r-001");

  assert.ok(resistor);
  assert.equal(resistor.manufacturer, "YAGEO");
  const source = JSON.parse(await readFile(join(directory, "yageo-330ohm.json"), "utf8"));
  assert.equal(resistor.quantity, source.quantity);
  assert.equal(resistor.specifications.resistanceOhms, 330);
  assert.equal(resistor.datasheets.length, 2);
});

test("accepts minimal data, unknown quantity and zero-ohm resistors", () => {
  assert.deepEqual(partSchema.parse(component), component);
  const zero = structuredClone(component);
  zero.quantity = 0;
  zero.specifications.resistanceOhms = 0;
  assert.equal(partSchema.safeParse(zero).success, true);
});

test("rejects invalid quantities and unexpected fields", () => {
  for (const quantity of [-1, 1.5, "20", undefined]) {
    assert.equal(partSchema.safeParse({ ...component, quantity }).success, false);
  }
  assert.equal(partSchema.safeParse({ ...component, facts: [] }).success, false);
});

test("rejects malformed and non-HTTP URLs without throwing", () => {
  for (const url of ["not a URL", "javascript:alert(1)", "file:///tmp/test"]) {
    assert.equal(partSchema.safeParse({ ...component, link: url }).success, false);
    assert.equal(
      partSchema.safeParse({ ...component, datasheets: [url] }).success,
      false,
    );
  }
  assert.equal(
    partSchema.safeParse({ ...component, link: "https://example.com/part" }).success,
    true,
  );
});

test("returns an empty array for an empty directory", async (context) => {
  const directory = await temporaryDirectory(context);
  assert.deepEqual(await loadParts(directory), []);
});

test("discovers new files, ignores other files and does not read subdirectories", async (context) => {
  const directory = await temporaryDirectory(context);
  await writePart(directory, "b.json");
  await writeFile(join(directory, "README.md"), "Notes");
  await mkdir(join(directory, "archive.json"));
  await writePart(join(directory, "archive.json"), "old.json");

  assert.equal((await loadParts(directory)).length, 1);

  await writePart(directory, "a.json", { ...component, id: "second" });
  assert.deepEqual(
    (await loadParts(directory)).map((part) => part.id),
    ["second", "test-resistor"],
  );
});

test("reports both filenames for duplicate IDs", async (context) => {
  const directory = await temporaryDirectory(context);
  await writePart(directory, "a.json");
  await writePart(directory, "b.json");
  await assert.rejects(loadParts(directory), /Duplicate component ID.*a.json.*b.json/);
});

test("identifies malformed JSON separately from invalid component data", async (context) => {
  const directory = await temporaryDirectory(context);
  await writeFile(join(directory, "broken.json"), "{");
  await assert.rejects(loadParts(directory), /Invalid JSON.*broken.json/);

  await writePart(directory, "broken.json", { ...component, quantity: -1 });
  await assert.rejects(loadParts(directory), /Invalid component.*broken.json/);
});

test("does not silently treat a missing directory as an empty catalog", async (context) => {
  const directory = await temporaryDirectory(context);
  await assert.rejects(
    loadParts(join(directory, "missing")),
    (error) => error.code === "ENOENT",
  );
});
