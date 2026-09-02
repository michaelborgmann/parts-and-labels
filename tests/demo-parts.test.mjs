import assert from "node:assert/strict";
import test from "node:test";
import { demoParts, filterParts } from "../app/ui/demo-parts.ts";

test("empty search returns all demo parts", () => {
  assert.equal(filterParts(demoParts, "  ").length, 6);
});
test("search matches names, categories, IDs and specifications", () => {
  for (const query of ["330 Ω", "WIDERSTAND", "R-001", "0,6 W", "MF0207FTE52-330R", "METALL 330"]) {
    assert.equal(filterParts(demoParts, query)[0].id, "R-001");
  }
  assert.equal(filterParts(demoParts, "dip")[0].id, "IC-001");
  assert.equal(filterParts(demoParts, "m3 edelstahl")[0].id, "M-001");
});
test("unknown query yields no results", () => {
  assert.deepEqual(filterParts(demoParts, "unknown-part"), []);
});
test("demo identifiers are unique", () => {
  assert.equal(new Set(demoParts.map((part) => part.id)).size, demoParts.length);
});
