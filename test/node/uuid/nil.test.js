import assert from "node:assert";
import { Uuid } from "../../../node/index.mjs";

describe("Uuid.NIL", () => {
  it("NIL", () => {
    assert.strictEqual(Uuid.NIL, "00000000-0000-0000-0000-000000000000");

  });

});
