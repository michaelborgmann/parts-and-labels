import assert from "node:assert/strict";
import test from "node:test";
import { partInputSchema } from "../lib/parts/schema.ts";

test("minimal part is trimmed and receives empty specifications", () => {
  assert.deepEqual(partInputSchema.parse({ name: "  NE555  ", category: "IC" }), {
    name: "NE555", category: "IC", specifications: [],
  });
});

test("supports electronic and mechanical properties", () => {
  for (const category of ["Resistor", "Screw"]) {
    const input = {
      name: "Example", category,
      specifications: [
        { name: "Resistance", value: 10000, unit: "Ω", note: "Nominal" },
        { name: "Package", value: "Axial" },
        { name: "RoHS", value: true },
      ],
    };
    assert.deepEqual(partInputSchema.parse(input), input);
  }
});

test("rejects missing names, invalid values and unexpected fields", () => {
  for (const fields of [
    { name: " " }, { category: "" }, { createdAt: "injected" },
    { specifications: [{ name: "Voltage", value: Infinity }] },
    { datasheetUrl: "javascript:alert(1)" }, { datasheetUrl: "file:///etc/passwd" },
    { specifications: Array.from({ length: 101 }, () => ({ name: "x", value: 1 })) },
  ]) {
    assert.equal(partInputSchema.safeParse({ name: "Part", category: "Other", ...fields }).success, false);
  }
});

test("accepts HTTPS datasheet links", () => {
  assert.equal(partInputSchema.safeParse({
    name: "NE555", category: "IC", datasheetUrl: "https://example.com/ne555.pdf",
  }).success, true);
});
