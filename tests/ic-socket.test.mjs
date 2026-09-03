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
const part = require("../data/parts/gs-14p.json");

test("GS 14P validates; invalid socket properties are rejected", () => {
  assert.equal(partSchema.safeParse(part).success, true);
  for (const patch of [
    { pinCount: 0 }, { pinCount: 2.5 }, { rowSpacingMm: -1 },
    { rowSpacingMm: Infinity }, { contactType: "" }, { contactPlating: "" },
    { voltage: 5 },
  ]) {
    assert.equal(partSchema.safeParse({
      ...part, specifications: { ...part.specifications, ...patch },
    }).success, false);
  }
});

test("socket details and preview display supplied facts in both languages", () => {
  for (const locale of ["de", "en"]) {
    const messages = getMessages(locale);
    for (const Component of [PartDetails, LabelPreview]) {
      const html = renderToStaticMarkup(createElement(Component, { part, locale, messages }));
      for (const value of [
        "GS 14P", "14", part.link, messages.details.types["ic-socket"],
        messages.icSocket.machined, messages.icSocket.gold,
        locale === "de" ? "7,62 mm" : "7.62 mm",
      ]) assert.ok(html.includes(value), `Missing ${value}`);
      assert.doesNotMatch(html, /undefined|NaN|FREI|NAND|fixed-label-bands/);
      if (Component === PartDetails) {
        assert.match(html, locale === "de" ? /10 Stück/ : /10 pieces/);
        assert.doesNotMatch(html, /<h3>Datenblätter|<h3>Datasheets/);
      } else {
        assert.match(html, /fixed-label-qr/);
        assert.doesNotMatch(html, /10 Stück|10 pieces/);
      }
    }
  }
});

test("minimal socket omits absent values and QR; unknown contact values are preserved", () => {
  const minimal = {
    id: "socket-test", type: "ic-socket", name: "Test socket", quantity: null,
    specifications: { pinCount: 8 },
  };
  assert.equal(partSchema.safeParse(minimal).success, true);
  const render = value => renderToStaticMarkup(createElement(LabelPreview, {
    part: value, locale: "en", messages: getMessages("en"),
  }));
  assert.doesNotMatch(render(minimal), /fixed-label-qr|Row spacing|Contact type|Contact plating|Gold/);
  assert.match(render({
    ...minimal, specifications: { pinCount: 8, contactType: "custom-contact" },
  }), /custom-contact/);
});

test("catalog renders a socket as initial selection", () => {
  const html = renderToStaticMarkup(createElement(Catalog, {
    parts: [part], locale: "de", messages: getMessages("de"),
  }));
  assert.match(html, /GS 14P/);
  assert.match(html, /Hersteller unbekannt/);
  assert.match(html, /Label-Vorschau/);
});
