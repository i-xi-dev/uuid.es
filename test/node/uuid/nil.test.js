import assert from "node:assert";
import { Uuid } from "../../../node.mjs";

describe("Uuid.nil", () => {
  it("nil()", () => {
    assert.strictEqual(Uuid.nil(), "00000000-0000-0000-0000-000000000000");

  });

});
