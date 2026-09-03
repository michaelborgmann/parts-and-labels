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

const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { fileURLToPath } = require("node:url");
const directory = fileURLToPath(new URL("../data/parts/", import.meta.url));
const parts = readdirSync(directory).filter(f => f.endsWith(".json"))
  .map(f => partSchema.parse(JSON.parse(readFileSync(join(directory, f), "utf8"))));
const render = (Component, part, locale = "en") => renderToStaticMarkup(
  createElement(Component, { part, locale, messages: getMessages(locale) }),
);

test("every catalog part renders details and a fixed label in both languages", () => {
  for (const part of parts) {
    for (const locale of ["de", "en"]) {
      const details = render(PartDetails, part, locale);
      const label = render(LabelPreview, part, locale);
      assert.match(label, /class="fixed-label"/, part.id);
      assert.doesNotMatch(details + label, /undefined|NaN/, part.id);
      assert.ok(details.includes(part.id), part.id);
      if (part.link) {
        assert.ok(details.includes(part.link), part.id);
        assert.ok(label.includes(part.link), part.id);
        assert.match(label, /fixed-label-qr/, part.id);
      }
      for (const url of part.datasheets ?? []) assert.ok(details.includes(url), part.id);
    }
  }
});

const inverter = {
  id: "test-inverter", type: "logic", name: "Test inverter", quantity: null,
  specifications: { function: "inverter", inputType: "schmitt-trigger", gateCount: 6, inputsPerGate: 1 },
};
test("inverters require one input; input characteristics are validated", () => {
  assert.equal(partSchema.safeParse(inverter).success, true);
  for (const patch of [{ inputsPerGate: 2 }, { inputType: "unknown" }]) {
    assert.equal(partSchema.safeParse({
      ...inverter, specifications: { ...inverter.specifications, ...patch },
    }).success, false);
  }
});
test("Schmitt inverters show their function without a NAND symbol", () => {
  for (const locale of ["de", "en"]) {
    const text = getMessages(locale).logic;
    for (const Component of [PartDetails, LabelPreview]) {
      const html = render(Component, inverter, locale);
      assert.ok(html.includes(text.functions.inverter));
      assert.ok(html.includes(text.inputTypes["schmitt-trigger"]));
      assert.ok(!html.includes(text.nandSymbol));
    }
  }
});

const timer = {
  id: "test-timer", type: "timer", name: "Test timer", quantity: null,
  specifications: { channelCount: 1 },
};
test("timer validates optional properties and rejects reversed voltage limits", () => {
  assert.equal(partSchema.safeParse(timer).success, true);
  for (const patch of [
    { channelCount: 0 }, { channelCount: 1.5 },
    { supplyVoltageMinVolts: 10, supplyVoltageMaxVolts: 5 },
    { supplyVoltageMaxVolts: Infinity }, { unknown: true },
  ]) {
    assert.equal(partSchema.safeParse({
      ...timer, specifications: { ...timer.specifications, ...patch },
    }).success, false);
  }
});
test("minimal timer and catalog render without invented specifications", () => {
  const html = render(LabelPreview, timer);
  assert.match(html, /Timer IC/);
  assert.doesNotMatch(html, /fixed-label-qr|DIP-8|Supply min|Bipolar/);
  assert.match(renderToStaticMarkup(createElement(Catalog, {
    parts: [timer], locale: "en", messages: getMessages("en"),
  })), /Test timer/);
});
test("dual-leaf sockets and slide switches are translated in both languages", () => {
  const socket = {
    id: "test-socket", type: "ic-socket", name: "Socket", quantity: 1,
    specifications: { pinCount: 8, contactType: "dual-leaf" },
  };
  const slide = {
    id: "test-slide", type: "switch", name: "Slide", quantity: 1,
    specifications: { style: "slide", action: "latching", contactForm: "changeover", poleCount: 1, leadSpacingMm: 4.7 },
  };
  for (const locale of ["de", "en"]) {
    const messages = getMessages(locale);
    assert.ok(render(LabelPreview, socket, locale).includes(messages.icSocket.dualLeaf));
    const html = render(LabelPreview, slide, locale);
    assert.ok(html.includes(messages.switch.slide));
    assert.ok(html.includes(messages.switch.changeover));
    assert.ok(html.includes(locale === "de" ? "4,7 mm" : "4.7 mm"));
  }
});
test("unknown capacitor voltage is omitted instead of inferred", () => {
  const capacitor = {
    id: "test-capacitor", type: "capacitor", name: "Capacitor", quantity: 1,
    specifications: { capacitanceFarads: 1e-7, dielectric: "X7R", leadSpacingMm: 5 },
  };
  const html = render(LabelPreview, capacitor);
  assert.doesNotMatch(html, /50 V|100 V/);
});
