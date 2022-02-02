import assert from "node:assert";
import { Uuid } from "./uuid";

describe("Uuid.nil", () => {
  it("nil()", () => {
    const uuid = Uuid.nil();
    assert.strictEqual(uuid.type, 0);
    assert.strictEqual(uuid.subtype, Number.NaN);
    assert.strictEqual(uuid.toString(), "00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.generateRandom", () => {
  it("generateRandom()", () => {
    const uuids = [];
    for (let i = 0; i < 100; i++) {
      const uuid = Uuid.generateRandom();
      assert.strictEqual(uuid.type, 2);
      assert.strictEqual(uuid.variant, 2);
      assert.strictEqual(uuid.subtype, 4);
      assert.strictEqual(uuid.version, 4);
      assert.strictEqual(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid.toString()), true);
      uuids.push(uuid);
    };
    assert.strictEqual(uuids.length, (new Set(uuids)).size);
  });

});

describe("Uuid.fromString", () => {
  it("fromString(string) nil 1", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    assert.strictEqual(uuid.type, 0);
    assert.strictEqual(uuid.subtype, Number.NaN);
    assert.strictEqual(uuid.toString(), "00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) nil 2", () => {
    const uuid = Uuid.fromString("00000000000000000000000000000000");
    assert.strictEqual(uuid.type, 0);
    assert.strictEqual(uuid.subtype, Number.NaN);
    assert.strictEqual(uuid.toString(), "00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) nil 3", () => {
    const uuid = Uuid.fromString("urn:uuid:00000000-0000-0000-0000-000000000000");
    assert.strictEqual(uuid.type, 0);
    assert.strictEqual(uuid.subtype, Number.NaN);
    assert.strictEqual(uuid.toString(), "00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) v4 1", () => {
    const uuid = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    assert.strictEqual(uuid.type, 2);
    assert.strictEqual(uuid.subtype, 4);
    assert.strictEqual(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 2", () => {
    const uuid = Uuid.fromString("5EB893BA-EC79-4F55-958D-66731227B662");
    assert.strictEqual(uuid.type, 2);
    assert.strictEqual(uuid.subtype, 4);
    assert.strictEqual(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 3", () => {
    const uuid = Uuid.fromString("URN:UUID:5EB893BA-EC79-4F55-958D-66731227B662");
    assert.strictEqual(uuid.type, 2);
    assert.strictEqual(uuid.subtype, 4);
    assert.strictEqual(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 4", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.type, 2);
    assert.strictEqual(uuid.subtype, 4);
    assert.strictEqual(uuid.toString(), "4525970b-49cb-4d89-9987-54ba4263ac99");

  });

  it("fromString(*)", () => {
    assert.throws(() => {
      Uuid.fromString(1 as unknown as string);
    }, {
      name: "TypeError",
      message: "uuidString"
    });

    assert.throws(() => {
      Uuid.fromString("4525970B49CB4D89998754BA4263AC9G");
    }, {
      name: "RangeError",
      message: "uuidString"
    });

  });

});

describe("Uuid.prototype.format", () => {
  it("format()", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.format(), "4525970b-49cb-4d89-9987-54ba4263ac99");

  });

  it("format({})", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.format({}), "4525970b-49cb-4d89-9987-54ba4263ac99");
    assert.strictEqual(uuid.format({upperCase:true}), "4525970B-49CB-4D89-9987-54BA4263AC99");
    assert.strictEqual(uuid.format({hyphenate:false}), "4525970b49cb4d89998754ba4263ac99");
    assert.strictEqual(uuid.format({upperCase:true,hyphenate:false}), "4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.format({upperCase:true,noHyphens:true}), "4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.format({upperCase:true,hyphenate:true,noHyphens:true}), "4525970B49CB4D89998754BA4263AC99");
    assert.strictEqual(uuid.format({upperCase:true,hyphenate:false,noHyphens:false}), "4525970B-49CB-4D89-9987-54BA4263AC99");

  });

});

describe("Uuid.toJSON", () => {
  it("toJSON()", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    assert.strictEqual(uuid.toJSON(), "00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.toURN", () => {
  it("toURN()", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    assert.strictEqual(uuid.toURN().toString(), "urn:uuid:00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.prototype.type", () => {
  it("type - 0", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-0000-000000000000");
    assert.strictEqual(uuid.type, 0);

  });

  it("type - 2", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
    assert.strictEqual(uuid.type, 2);

  });

  it("type - 6", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-C000-000000000000");
    assert.strictEqual(uuid.type, 6);

  });

  it("type - 7", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-f000-000000000000");
    assert.strictEqual(uuid.type, 7);

  });

});

describe("Uuid.prototype.subtype", () => {
  it("subtype - 5", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
    assert.strictEqual(uuid.subtype, 5);

  });

  it("subtype - 4", () => {
    const uuid = Uuid.fromString("00000000-0000-4000-9000-000000000000");
    assert.strictEqual(uuid.subtype, 4);

  });

  it("subtype - 3", () => {
    const uuid = Uuid.fromString("00000000-0000-3000-9000-000000000000");
    assert.strictEqual(uuid.subtype, 3);

  });

  it("subtype - 2", () => {
    const uuid = Uuid.fromString("00000000-0000-2000-9000-000000000000");
    assert.strictEqual(uuid.subtype, 2);

  });

  it("subtype - 1", () => {
    const uuid = Uuid.fromString("00000000-0000-1000-9000-000000000000");
    assert.strictEqual(uuid.subtype, 1);

  });

});

describe("Uuid.prototype.equals", () => {
  it("equals(Uuid)", () => {
    const uuid0 = Uuid.nil();
    assert.strictEqual(uuid0.equals(Uuid.nil()), true);
    assert.strictEqual(uuid0 !== Uuid.nil(), true);

    const uuid1 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
    assert.strictEqual(uuid0.equals(uuid1), false);
    assert.strictEqual(uuid1b.equals(uuid1), true);
    assert.strictEqual(uuid2.equals(uuid1), false);

  });

  it("equals(string)", () => {
    const uuid0 = Uuid.nil();
    assert.strictEqual(uuid0.equals("00000000-0000-0000-0000-000000000000"), true);
    assert.strictEqual(uuid0.equals("urn:uuid:00000000-0000-0000-0000-000000000000"), true);
    assert.strictEqual(uuid0.equals("00000000000000000000000000000000"), true);
    assert.strictEqual(uuid0.equals("00000000000000000000000000000001"), false);
    assert.strictEqual(uuid0.equals("0"), false);

    const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
    assert.strictEqual(uuid0.equals("5eb893ba-ec79-4f55-958d-66731227b662"), false);
    assert.strictEqual(uuid1b.equals("5eb893ba-ec79-4f55-958d-66731227b662"), true);
    assert.strictEqual(uuid2.equals("5eb893ba-ec79-4f55-958d-66731227b662"), false);

  });

  it("equals(*)", () => {
    const uuid0 = Uuid.nil();
    assert.throws(() => {
      uuid0.equals(0 as unknown as string);
    }, {
      name: "TypeError",
      message: "other"
    });

  });

});
