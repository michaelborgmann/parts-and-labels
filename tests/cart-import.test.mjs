import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { partSchema } from "../lib/catalog/schema.ts";

const read = name => JSON.parse(readFileSync(new URL("../data/parts/" + name + ".json", import.meta.url), "utf8"));
const cases = [
  ["vis-k50-8", { impedanceOhms: 0 }],
  ["aom-5024l-hd-r", { technology: "unknown" }],
  ["debo-pam8403", { channelCount: 0 }],
  ["1n-4148-dio", { function: "unknown" }],
  ["lm7805ct", { outputVoltageVolts: Infinity }],
  ["mos-4026", { counterCount: 0 }],
  ["sc-56-11-rt", { digitCount: 0 }],
  ["g5v-2-h1-5dc", { poleCount: 0 }],
];
test("new component types validate their own properties", () => {
  for (const [file, invalid] of cases) {
    const part = read(file);
    assert.equal(partSchema.safeParse(part).success, true, file);
    for (const changes of [invalid, { unknown: true }]) {
      assert.equal(partSchema.safeParse({ ...part, specifications: { ...part.specifications, ...changes } }).success, false, file);
    }
  }
});
test("trimmers can omit an unverified taper", () => {
  const part = read("ft-63es-203");
  assert.equal(part.specifications.style, "trimmer");
  assert.equal(part.specifications.taper, undefined);
  assert.equal(partSchema.safeParse(part).success, true);
});
test("logic functions and counter structures remain distinct", () => {
  for (const [file, fn, gates, inputs] of [
    ["74hc-08", "and", 4, 2], ["74hc-32", "or", 4, 2],
    ["74hc-02", "nor", 4, 2], ["74hc-27", "nor", 3, 3],
  ]) {
    const s = read(file).specifications;
    assert.equal(s.function, fn);
    assert.equal(s.gateCount, gates);
    assert.equal(s.inputsPerGate, inputs);
  }
  assert.equal(read("mos-4026").specifications.function, "decade-seven-segment");
  assert.equal(read("mos-4026").specifications.bitsPerCounter, undefined);
  assert.equal(read("74hc-393").specifications.bitsPerCounter, 4);
  assert.equal(read("74hc-393").specifications.counterCount, 2);
});
test("same-value variants keep separate identities", () => {
  for (const names of [
    ["murata-100nf", "x7r-2-5-100n-kom"],
    ["kingbright-l-7113gd", "led-5mm-2ma-gn"],
    ["x7r-5-10nf", "x7r-2-5-10n"],
  ]) {
    const [a,b] = names.map(read);
    assert.notEqual(a.id, b.id);
    assert.notEqual(a.link, b.link);
  }
});
