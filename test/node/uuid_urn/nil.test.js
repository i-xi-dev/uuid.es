import assert from "node:assert";
import { UuidUrn } from "../../../node.mjs";

describe("UuidUrn.nil", () => {
  it("nil()", () => {
    assert.strictEqual(UuidUrn.nil(), "urn:uuid:00000000-0000-0000-0000-000000000000");

  });

});
