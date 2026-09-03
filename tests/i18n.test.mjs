import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Compile the actual TypeScript/TSX modules for Node render tests.
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

const { getMessages, formatQuantity } = require("../lib/i18n.ts");
const { Catalog } = require("../app/ui/catalog.tsx");
const { createElement } = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const part = {
  id: "test",
  type: "resistor",
  name: "330 Ω",
  manufacturer: "YAGEO",
  quantity: 20,
  specifications: { resistanceOhms: 330 },
};

function render(locale, parts = [part]) {
  return renderToStaticMarkup(
    createElement(Catalog, { parts, locale, messages: getMessages(locale) }),
  );
}

test("Nichicon bipolar capacitor and JFET validate and render in both languages", () => {
  const { partSchema } = require("../lib/catalog/schema.ts");
  const capacitor = require("../data/parts/nichicon-ues1h1r0.json");
  const jfet = require("../data/parts/chanzon-2n5457.json");
  assert.equal(capacitor.quantity, 5);
  assert.equal(jfet.quantity, 10);
  for (const component of [capacitor, jfet]) {
    assert.equal(partSchema.safeParse(component).success, true);
    for (const locale of ["de", "en"]) {
      const html = render(locale, [component]);
      assert.ok(html.includes(component.name));
      assert.ok(html.includes(component.link));
      if (component.type === "jfet") {
        assert.match(html, /TO-92/);
        assert.ok(html.includes(locale === "de" ? "N-Kanal" : "N-channel"));
      } else {
        assert.match(html, /50 V/);
      }
    }
  }
  assert.equal(partSchema.safeParse({
    ...jfet, specifications: { channel: "npn" },
  }).success, false);
});

function leafKeys(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof child === "string" ? [path] : leafKeys(child, path);
  }).sort();
}

test("Murata capacitor validates and renders in both languages", () => {
  const capacitor = require("../data/parts/murata-100nf.json");
  const { partSchema } = require("../lib/catalog/schema.ts");
  assert.equal(partSchema.safeParse(capacitor).success, true);
  for (const locale of ["de", "en"]) {
    const html = render(locale, [capacitor]);
    for (const value of ["MURATA", "RDER71H104K0S1H03A", "100 nF", "±10 %", "50 V", "X7R", ...capacitor.datasheets, capacitor.link]) {
      assert.ok(html.includes(value), `Missing capacitor detail: ${value}`);
    }
    assert.match(html, locale === "de" ? /2,5 mm/ : /2.5 mm/);
    assert.doesNotMatch(html, /Anzahl der Farbringe|Number of color bands/);
  }
  const invalid = structuredClone(capacitor);
  invalid.specifications.resistanceOhms = 330;
  assert.equal(partSchema.safeParse(invalid).success, false);
  delete invalid.specifications.resistanceOhms;
  invalid.specifications.capacitanceFarads = 0;
  assert.equal(partSchema.safeParse(invalid).success, false);
});

test("capacitor units and missing optional properties render correctly", () => {
  const capacitor = require("../data/parts/murata-100nf.json");
  for (const [farads, expected] of [[1e-12, "1 pF"], [1e-9, "1 nF"], [1e-6, "1 µF"], [1, "1 F"]]) {
    const html = render("en", [{
      ...capacitor,
      specifications: { capacitanceFarads: farads },
      datasheets: [],
      link: undefined,
    }]);
    assert.ok(html.includes(expected));
    assert.doesNotMatch(html, /Rated voltage|Lead spacing|Dielectric/);
  }
});

test("fixed resistor labels derive values and ring colors from each part", () => {
  const { ResistorLabel } = require("../app/ui/resistor-label.tsx");
  const { fiveBandCode } = require("../lib/catalog/resistor.ts");
  for (const [ohms, title, colors] of [
    [330, "330 Ω", ["#ef8222", "#ef8222", "#171717", "#171717", "#804220"]],
    [10000, "10 kΩ", ["#804220", "#171717", "#171717", "#c5272d", "#804220"]],
  ]) {
    assert.deepEqual(fiveBandCode(ohms, 1).map(band => band.color), colors);
    const resistor = {
      ...part,
      manufacturer: "Test maker",
      specifications: { resistanceOhms: ohms, tolerancePercent: 1, bandCount: 5 },
      link: "https://example.com/product",
    };
    const html = renderToStaticMarkup(createElement(ResistorLabel, {
      part: resistor, locale: "en", messages: getMessages("en"),
    }));
    assert.ok(html.includes(title));
    assert.match(html, /Calculated five-band color code/);
    assert.match(html, /IEC/);
    assert.match(html, /US/);
    assert.match(html, /href="https:\/\/example.com\/product"/);
    assert.doesNotMatch(html, /YAGEO|Reichelt|pieces|checkbox|<input/);
  }
});

test("labels omit QR without a link and do not invent unsupported color codes", () => {
  const { ResistorLabel } = require("../app/ui/resistor-label.tsx");
  for (const specifications of [
    { resistanceOhms: 330 },
    { resistanceOhms: 0, tolerancePercent: 1, bandCount: 5 },
    { resistanceOhms: 330.123, tolerancePercent: 1, bandCount: 5 },
    { resistanceOhms: 330, tolerancePercent: 3, bandCount: 5 },
  ]) {
    const html = renderToStaticMarkup(createElement(ResistorLabel, {
      part: { ...part, specifications }, locale: "en", messages: getMessages("en"),
    }));
    assert.doesNotMatch(html, /fixed-label-qr|fixed-label-bands/);
    assert.match(html, /No representable color code/);
    assert.match(html, /fixed-label-symbols/);
  }
});

test("capacitor preview is selected by type with no resistor graphics or controls", () => {
  const { LabelPreview } = require("../app/ui/label-preview.tsx");
  const capacitor = require("../data/parts/murata-100nf.json");
  const html = renderToStaticMarkup(createElement(LabelPreview, {
    part: capacitor, locale: "de", messages: getMessages("de"),
  }));
  for (const text of ["Label-Vorschau", "100 nF", "MURATA", "±10 %", "50 V", "X7R", "2,5 mm", capacitor.link]) {
    assert.ok(html.includes(text), `Missing label value: ${text}`);
  }
  assert.doesNotMatch(html, /fixed-label-bands|fixed-label-symbols|checkbox|<input|10 Stück/);
});

test("German and English dictionaries have identical keys", () => {
  assert.deepEqual(leafKeys(getMessages("de")), leafKeys(getMessages("en")));
});

test("quantity formatting handles unknown, zero, singular and plural", () => {
  const en = getMessages("en");
  const de = getMessages("de");
  assert.equal(formatQuantity(null, "en", en), "Stock unknown");
  assert.equal(formatQuantity(null, "de", de), "Bestand unbekannt");
  assert.equal(formatQuantity(0, "en", en), "0 pieces");
  assert.equal(formatQuantity(1, "en", en), "1 piece");
  assert.equal(formatQuantity(20, "en", en), "20 pieces");
  assert.equal(formatQuantity(1000, "en", en), "1,000 pieces");
  assert.equal(formatQuantity(1000, "de", de), "1.000 Stück");
});

test("the actual catalog renders German UI without changing part data", () => {
  const html = render("de");
  assert.match(html, /Ein Platz für jedes Bauteil/);
  assert.match(html, /20 Stück/);
  assert.match(html, /YAGEO/);
  assert.match(html, /330 Ω/);
});

test("the actual catalog renders English text and accessible labels", () => {
  const html = render("en");
  assert.match(html, /A place for every part/);
  assert.match(html, /20 pieces/);
  assert.match(html, /aria-label="Parts catalog"/);
  assert.match(html, /aria-label="Selected part"/);
  assert.doesNotMatch(html, /Bauteil|Stück|Deine Werkbank/);
});

test("empty and unknown states are localized", () => {
  assert.match(render("en", []), /No parts added yet/);
  assert.match(render("en", []), /No part selected/);
  assert.match(render("de", []), /Noch keine Bauteile erfasst/);
  const html = render("en", [{ ...part, manufacturer: undefined, quantity: null }]);
  assert.match(html, /Unknown manufacturer/);
  assert.match(html, /Stock unknown/);
});

test("details show every field and preserve source URLs", () => {
  const complete = {
    ...part,
    manufacturerPartNumber: "TEST-330",
    specifications: {
      resistanceOhms: 330,
      tolerancePercent: 1,
      bandCount: 5,
    },
    datasheets: ["https://example.com/first.pdf", "https://example.com/second.pdf"],
    link: "https://example.com/product",
  };
  const html = render("de", [complete]);
  for (const text of [
    "TEST-330", "Interne ID", "20 Stück", "330", "±1 %", "Anzahl der Farbringe",
    "Datenblatt 1", "Datenblatt 2", "Produktseite",
    ...complete.datasheets, complete.link,
  ]) {
    assert.ok(html.includes(text), `Missing detail: ${text}`);
  }
  const english = render("en", [complete]);
  assert.match(english, /Technical specifications/);
  assert.match(english, /Number of color bands/);
  assert.match(english, /Datasheet 2/);
  assert.match(english, /Product page/);
});

test("details omit absent optional fields and format decimal values", () => {
  const minimal = { ...part, specifications: { resistanceOhms: 0.5 } };
  const de = render("de", [minimal]);
  const en = render("en", [minimal]);
  assert.match(de, /0,5/);
  assert.match(en, /0.5/);
  assert.doesNotMatch(de, /Toleranz|Anzahl der Farbringe|Datenblätter|Produktseite/);
  assert.match(render("en", [{ ...minimal, quantity: 0 }]), /0 pieces/);
  const zero = { ...minimal, specifications: { resistanceOhms: 0 } };
  assert.match(render("de", [zero]), /<td>0 Ω<\/td>/);
});
