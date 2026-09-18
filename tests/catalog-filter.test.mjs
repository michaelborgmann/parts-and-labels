import assert from "node:assert/strict";
import test from "node:test";
import { filterParts } from "../lib/catalog/filter-parts.ts";

const parts = [
  {
    id: "r-001",
    type: "resistor",
    name: "330 Ω",
    manufacturer: "YAGEO",
    manufacturerPartNumber: "MF0207FTE52-330R",
    quantity: 20,
    specifications: { resistanceOhms: 330, tolerancePercent: 1, bandCount: 5 },
  },
  {
    id: "logic-001",
    type: "logic",
    name: "74HC00",
    quantity: 2,
    specifications: { function: "nand", gateCount: 4, inputsPerGate: 2 },
  },
];

const typeLabel = type => ({ resistor: "Widerstand", logic: "Logik-IC" })[type];

test("catalog search matches identity, localized type and specifications", () => {
  assert.deepEqual(filterParts(parts, "yageo 330", "de", typeLabel), [parts[0]]);
  assert.deepEqual(filterParts(parts, "Widerstand", "de", typeLabel), [parts[0]]);
  assert.deepEqual(filterParts(parts, "330ohm", "de", typeLabel), [parts[0]]);
  assert.deepEqual(filterParts(parts, "nand", "de", typeLabel), [parts[1]]);
  assert.deepEqual(filterParts(parts, "missing", "de", typeLabel), []);
  assert.deepEqual(filterParts(parts, "   ", "de", typeLabel), parts);
});
