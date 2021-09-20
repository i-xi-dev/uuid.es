import assert from "node:assert";
import { UuidUrn } from "../../../node/index.mjs";

describe("UuidUrn.NIL", () => {
  it("NIL", () => {
    assert.strictEqual(UuidUrn.NIL, "urn:uuid:00000000-0000-0000-0000-000000000000");

  });

});
