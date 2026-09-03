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

const part = require("../data/parts/diptronics-dts-61k.json");

test("DTS-61K validates; invalid switch properties are rejected", () => {
  assert.equal(partSchema.safeParse(part).success, true);
  for (const patch of [
    { poleCount: 0 }, { poleCount: 1.5 }, { action: "invalid" },
    { style: "" }, { contactForm: "" }, { voltage: 12 },
    { dimensionsMm: { length: 6, width: 6, height: 0 } },
    { dimensionsMm: { length: 6, width: 6 } },
    { dimensionsMm: { length: Infinity, width: 6, height: 4.3 } },
  ]) {
    assert.equal(partSchema.safeParse({
      ...part, specifications: { ...part.specifications, ...patch },
    }).success, false);
  }
});

test("switch details and label render in German and English", () => {
  for (const locale of ["de", "en"]) {
    const messages = getMessages(locale);
    for (const Component of [PartDetails, LabelPreview]) {
      const html = renderToStaticMarkup(createElement(Component, { part, locale, messages }));
      for (const value of [
        "DTS-61K", "DIPTRONICS", messages.switch.tactile,
        messages.switch.actions.momentary, messages.switch.normallyOpen,
        messages.switch.throughHole, part.link,
        locale === "de" ? "6 × 6 × 4,3 mm" : "6 × 6 × 4.3 mm",
      ]) assert.ok(html.includes(value), `Missing ${value}`);
      assert.doesNotMatch(html, /undefined|NaN|NAND|fixed-label-bands/);
      if (Component === PartDetails) {
        for (const url of part.datasheets) assert.ok(html.includes(url));
        assert.match(html, locale === "de" ? /6 Stück/ : /6 pieces/);
      } else {
        assert.match(html, /fixed-label-qr/);
        assert.doesNotMatch(html, /6 Stück|6 pieces/);
      }
    }
  }
});

test("minimal switch supports latching, preserves other styles and omits optional fields", () => {
  const minimal = {
    id: "test-switch", type: "switch", name: "Test switch", quantity: null,
    specifications: { style: "custom-style", action: "latching", contactForm: "custom-contact", poleCount: 1 },
  };
  assert.equal(partSchema.safeParse(minimal).success, true);
  const html = renderToStaticMarkup(createElement(LabelPreview, {
    part: minimal, locale: "en", messages: getMessages("en"),
  }));
  assert.match(html, /custom-style/);
  assert.match(html, /custom-contact/);
  assert.match(html, /Latching/);
  assert.doesNotMatch(html, /fixed-label-qr|Dimensions|Mounting|DIPTRONICS/);
});

test("catalog renders switch as initial selection", () => {
  const html = renderToStaticMarkup(createElement(Catalog, {
    parts: [part], locale: "de", messages: getMessages("de"),
  }));
  assert.match(html, /DTS-61K/);
  assert.match(html, /6 Stück/);
  assert.match(html, /Label-Vorschau/);
});
