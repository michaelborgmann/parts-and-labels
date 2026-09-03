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
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
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
const led = require("../data/parts/kingbright-l-7113gd.json");

test("real LED validates; invalid LED properties are rejected", () => {
  assert.equal(partSchema.safeParse(led).success, true);
  for (const patch of [
    { color: "" }, { diameterMm: 0 }, { viewingAngleDegrees: 361 },
    { luminousIntensityMillicandelas: -1 }, { polarity: "npn" },
  ]) {
    assert.equal(partSchema.safeParse({
      ...led, specifications: { ...led.specifications, ...patch },
    }).success, false);
  }
});

test("LED details and label render all supplied properties in both languages", () => {
  for (const locale of ["de", "en"]) {
    for (const Component of [PartDetails, LabelPreview]) {
      const html = renderToStaticMarkup(createElement(Component, {
        part: led, locale, messages: getMessages(locale),
      }));
      for (const value of ["KINGBRIGHT", "L-7113GD", "5 mm", "20 mcd", "30°", led.link]) {
        assert.ok(html.includes(value), `Missing: ${value}`);
      }
      assert.match(html, locale === "de" ? /Grün/ : /Green/);
      assert.doesNotMatch(html, /fixed-label-bands|fixed-label-symbols|NaN|undefined/);
      if (Component === PartDetails) assert.ok(html.includes(led.datasheets[0]));
      else assert.match(html, /fixed-label-qr/);
    }
  }
});

test("minimal LED omits optional properties and the QR code", () => {
  const minimal = {
    id: "test-led", type: "led", name: "Test LED", quantity: null,
    specifications: { color: "red" },
  };
  assert.equal(partSchema.safeParse(minimal).success, true);
  const html = renderToStaticMarkup(createElement(LabelPreview, {
    part: minimal, locale: "en", messages: getMessages("en"),
  }));
  assert.match(html, /Red/);
  assert.doesNotMatch(html, /fixed-label-qr|Diameter|Viewing angle|KINGBRIGHT/);
});

test("catalog can select an LED as its initial part", () => {
  const html = renderToStaticMarkup(createElement(Catalog, {
    parts: [led], locale: "de", messages: getMessages("de"),
  }));
  assert.match(html, /L-7113GD/);
  assert.match(html, /10 Stück/);
  assert.match(html, /Label-Vorschau/);
});
