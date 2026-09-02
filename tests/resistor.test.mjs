import assert from "node:assert/strict";
import test from "node:test";
import { fiveBandCode, yageoResistor } from "../app/ui/yageo-resistor.ts";

test("330 ohms at 1 percent has five correctly ordered rings", () => {
  assert.deepEqual(fiveBandCode(330, 1).map(b => b.name), ["Orange", "Orange", "Schwarz", "Schwarz", "Braun"]);
});
test("supports another value and fractional multipliers", () => {
  assert.deepEqual(fiveBandCode(10000, 1).map(b => b.name), ["Braun", "Schwarz", "Schwarz", "Rot", "Braun"]);
  assert.equal(fiveBandCode(4.7, 5)[3].name, "Silber");
});
test("rejects unrepresentable input instead of silently rounding", () => {
  for (const value of [0, -1, NaN, Infinity, 330.5]) assert.throws(() => fiveBandCode(value, 1));
  assert.throws(() => fiveBandCode(330, 3));
});
test("purchase quantity is not presented as current stock", () => {
  assert.equal(yageoResistor.purchase.quantity, 20);
  assert.equal(yageoResistor.stock, null);
  assert.equal(new URL(yageoResistor.sourceUrl).hostname, "www.reichelt.de");
});
