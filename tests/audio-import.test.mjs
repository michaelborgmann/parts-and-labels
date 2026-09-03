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

const readPart = file => partSchema.parse(require("../data/parts/" + file));
const render = (Component, part, locale) => renderToStaticMarkup(
  createElement(Component, { part, locale, messages: getMessages(locale) }),
);
const pot = readPart("alps-rk09k113-log10k.json");
const connector = {
  id: "test-header", type: "connector", name: "Header", quantity: 2,
  specifications: { style: "pin-header", rows: 1, pinsPerRow: 14, pitchMm: 2.54 },
  link: "https://example.com/header",
};
const display = readPart("adafruit-938.json");
const audio = readPart("pjrc-teensy-audio4.json");

test("new part types reject invalid values and unknown fields", () => {
  for (const [part, changes] of [
    [pot, { taper: "unknown" }], [pot, { resistanceOhms: 0 }],
    [pot, { gangCount: 0.5 }], [pot, { shaftDiameterMm: -1 }],
    [connector, { rows: 0 }], [connector, { pinsPerRow: 1.5 }],
    [connector, { pitchMm: 0 }], [connector, { orientation: "unknown" }],
    [display, { widthPixels: -1 }], [display, { heightPixels: 1.5 }],
    [display, { interfaces: [] }], [display, { diagonalInches: 0 }],
    [audio, { sampleRateHz: Infinity }], [audio, { bitDepth: 0 }],
    [audio, { compatibleWith: [] }], [audio, { codec: "" }],
  ]) {
    assert.equal(partSchema.safeParse({
      ...part, specifications: { ...part.specifications, ...changes },
    }).success, false);
  }
  for (const part of [pot, connector, display, audio]) {
    assert.equal(partSchema.safeParse({
      ...part, specifications: { ...part.specifications, unknown: true },
    }).success, false);
  }
});

test("linear and logarithmic pots remain distinct in details and labels", () => {
  const linear = readPart("alps-rk09k113-lin10k.json");
  assert.notEqual(pot.id, linear.id);
  for (const locale of ["de", "en"]) {
    const text = getMessages(locale).potentiometer;
    for (const part of [pot, linear]) {
      for (const Component of [PartDetails, LabelPreview]) {
        const html = render(Component, part, locale);
        assert.ok(html.includes(text.tapers[part.specifications.taper]));
        assert.ok(html.includes("10 kΩ"));
        assert.doesNotMatch(html, /fixed-label-bands|fixed-label-symbols/);
      }
    }
  }
});

test("new labels show core specifications and product QR links in both languages", () => {
  for (const locale of ["de", "en"]) {
    for (const [part, values] of [
      [connector, ["1 × 14", locale === "de" ? "2,54 mm" : "2.54 mm"]],
      [display, ["128 × 64 px", "SSD1306", "I²C / SPI"]],
      [audio, ["SGTL5000", "Teensy 4.0 / Teensy 4.1", "16 bit", locale === "de" ? "44,1 kHz" : "44.1 kHz"]],
    ]) {
      for (const Component of [PartDetails, LabelPreview]) {
        const html = render(Component, part, locale);
        for (const value of values) assert.ok(html.includes(value), value);
      }
      const html = render(LabelPreview, part, locale);
      assert.ok(html.includes(part.link));
      assert.match(html, /fixed-label-qr/);
    }
  }
});

test("minimal new parts render without invented optional specifications", () => {
  for (const [part, specifications] of [
    [pot, { resistanceOhms: 10000, taper: "linear", gangCount: 1 }],
    [connector, { style: "socket-header", rows: 1, pinsPerRow: 2, pitchMm: 2.54 }],
    [display, { technology: "OLED", widthPixels: 128, heightPixels: 64 }],
    [audio, { codec: "Test codec" }],
  ]) {
    const minimal = partSchema.parse({ ...part, specifications, link: undefined });
    const html = render(LabelPreview, minimal, "en");
    assert.doesNotMatch(html, /undefined|NaN|fixed-label-qr|Shaft diameter|Height|Interfaces|Compatible with|Sample rate/);
    assert.match(html, /class="fixed-label"/);
  }
});
