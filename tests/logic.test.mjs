import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

const require = createRequire(import.meta.url);
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022, esModuleInterop: true,
      },
    });
    module._compile(outputText, filename);
  };
}
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { partSchema } = require("../lib/catalog/schema.ts");
const { getMessages } = require("../lib/i18n.ts");
const { PartDetails } = require("../app/ui/part-details.tsx");
const { LabelPreview } = require("../app/ui/label-preview.tsx");
const { Catalog } = require("../app/ui/catalog.tsx");
const part = require("../data/parts/74hc00.json");

test("74HC00 validates and invalid logic specifications fail", () => {
  assert.equal(partSchema.safeParse(part).success, true);
  for (const patch of [
    { function: "unsupported" }, { gateCount: 0 }, { inputsPerGate: 1.5 },
    { supplyVoltageMinVolts: 7 }, { supplyVoltageMaxVolts: -1 },
    { supplyVoltageMaxVolts: Infinity }, { unknown: true },
  ]) {
    assert.equal(partSchema.safeParse({
      ...part, specifications: { ...part.specifications, ...patch },
    }).success, false);
  }
});

test("logic details and preview render in German and English", () => {
  for (const locale of ["de", "en"]) {
    const messages = getMessages(locale);
    for (const Component of [PartDetails, LabelPreview]) {
      const html = renderToStaticMarkup(createElement(Component, { part, locale, messages }));
      for (const value of ["74HC00", "74HC", "DIP-14", "NAND", "2 V", "6 V", part.link, messages.logic.inputsPerGate]) {
        assert.ok(html.includes(value), `Missing ${value}`);
      }
      assert.doesNotMatch(html, /undefined|NaN|FREI/);
      if (Component === PartDetails) {
        for (const url of part.datasheets) assert.ok(html.includes(url));
        assert.match(html, locale === "de" ? /2 Stück/ : /2 pieces/);
      } else {
        assert.match(html, /fixed-label-qr/);
        assert.ok(html.includes(messages.logic.nandSymbol));
      }
    }
  }
});

test("minimal logic part renders without invented properties or QR", () => {
  const minimal = {
    id: "test-logic", type: "logic", name: "Test", quantity: null,
    specifications: { function: "nand", gateCount: 1, inputsPerGate: 3 },
  };
  assert.equal(partSchema.safeParse(minimal).success, true);
  const html = renderToStaticMarkup(createElement(LabelPreview, {
    part: minimal, locale: "en", messages: getMessages("en"),
  }));
  assert.doesNotMatch(html, /fixed-label-qr|Two-input NAND|Supply min|DIP-14|74HC/);
});

test("Catalog accepts a logic IC as initial selection", () => {
  const html = renderToStaticMarkup(createElement(Catalog, {
    parts: [part], locale: "de", messages: getMessages("de"),
  }));
  assert.match(html, /74HC00/);
  assert.match(html, /Label-Vorschau/);
  assert.match(html, /Hersteller unbekannt/);
});
