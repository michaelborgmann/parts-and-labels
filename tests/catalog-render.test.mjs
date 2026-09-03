import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";
import { readCatalogDirectory } from "../lib/catalog/read-files.ts";

// Compile the actual TSX components for server-render assertions; no Next server
// or browser is needed. This test file runs in its own Node test process.
const require = createRequire(import.meta.url);
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const result = ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    });
    module._compile(result.outputText, filename);
  };
}
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { Catalog } = require("../app/ui/catalog.tsx");
const { ResistorLabel } = require("../app/ui/resistor-label.tsx");
const catalog = await readCatalogDirectory(new URL("../data", import.meta.url).pathname);
const options = { showSpecifications: true, showPackage: true, showCode: true, showSymbols: true, showQr: true };

test("actual catalog renders JSON identity, detail sources, stock and label", () => {
  const html = renderToStaticMarkup(createElement(Catalog, catalog));
  assert.match(html, /MF0207FTE52-330R/);
  assert.match(html, /Spannungsangabe ungeklärt/);
  assert.match(html, /30.12.2025/);
  assert.match(html, /Unbekannt/);
  assert.match(html, /Berechneter Fünfring-Farbcode/);
  assert.match(html, /11733/);
});

test("another resistor uses the same UI without leaking the original product", () => {
  const part = structuredClone(catalog.parts.find(p => p.kind === "resistor"));
  part.id = "new-resistor"; part.manufacturer = "Test maker"; part.manufacturerPartNumber = "TEST-10K";
  part.resistor.resistanceOhms = 10000; part.resistor.powerWatts = 0.25;
  part.description = "Test component"; part.shortDescription = "Test resistor";
  part.sources = [{ id: "test", label: "Test source", url: "https://example.com/part" }];
  part.suppliers = []; part.label.qrSourceId = "test";
  part.facts = []; part.notices = []; part.sections = [];
  const html = renderToStaticMarkup(createElement(Catalog, { parts: [part], inventory: { schemaVersion: 1, purchases: [], stocks: [] } }));
  assert.match(html, /10 kΩ/); assert.match(html, /0,25 W/);
  assert.match(html, /TEST-10K/); assert.match(html, /https:\/\/example.com\/part/);
  assert.doesNotMatch(html, /YAGEO|Reichelt|MF0207|R-001/);
  const hidden = renderToStaticMarkup(createElement(ResistorLabel, { ...options, part, showQr: false, showCode: false, showSymbols: false }));
  assert.doesNotMatch(hidden, /<svg/);
  part.resistor.bandCount = null;
  assert.doesNotMatch(renderToStaticMarkup(createElement(ResistorLabel, { ...options, part, showQr: false, showSymbols: false })), /<svg/);
});

test("empty catalog renders a useful state", () => {
  assert.match(renderToStaticMarkup(createElement(Catalog, { parts: [], inventory: { schemaVersion: 1, purchases: [], stocks: [] } })), /Keine Auswahl/);
});
