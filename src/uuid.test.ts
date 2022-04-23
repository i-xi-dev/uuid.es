import { expect } from '@esm-bundle/chai';
import { Uuid } from "./index";

describe("Uuid.nil", () => {
  it("nil()", () => {
    const uuid = Uuid.nil();
    expect(uuid.type).to.equal(0);
    expect(uuid.subtype).to.be.NaN;
    expect(uuid.toString()).to.equal("00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.generateRandom", () => {
  it("generateRandom()", () => {
    const uuids = [];
    for (let i = 0; i < 100; i++) {
      const uuid = Uuid.generateRandom();
      expect(uuid.type).to.equal(2);
      expect(uuid.variant).to.equal(2);
      expect(uuid.subtype).to.equal(4);
      expect(uuid.version).to.equal(4);
      expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid.toString())).to.equal(true);
      uuids.push(uuid);
    };
    expect(uuids.length).to.equal((new Set(uuids)).size);
  });

});

describe("Uuid.fromString", () => {
  it("fromString(string) nil 1", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    expect(uuid.type).to.equal(0);
    expect(uuid.subtype).to.be.NaN;
    expect(uuid.toString()).to.equal("00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) nil 2", () => {
    const uuid = Uuid.fromString("00000000000000000000000000000000");
    expect(uuid.type).to.equal(0);
    expect(uuid.subtype).to.be.NaN;
    expect(uuid.toString()).to.equal("00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) nil 3", () => {
    const uuid = Uuid.fromString("urn:uuid:00000000-0000-0000-0000-000000000000");
    expect(uuid.type).to.equal(0);
    expect(uuid.subtype).to.be.NaN;
    expect(uuid.toString()).to.equal("00000000-0000-0000-0000-000000000000");

  });

  it("fromString(string) v4 1", () => {
    const uuid = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    expect(uuid.type).to.equal(2);
    expect(uuid.subtype).to.equal(4);
    expect(uuid.toString()).to.equal("5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 2", () => {
    const uuid = Uuid.fromString("5EB893BA-EC79-4F55-958D-66731227B662");
    expect(uuid.type).to.equal(2);
    expect(uuid.subtype).to.equal(4);
    expect(uuid.toString()).to.equal("5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 3", () => {
    const uuid = Uuid.fromString("URN:UUID:5EB893BA-EC79-4F55-958D-66731227B662");
    expect(uuid.type).to.equal(2);
    expect(uuid.subtype).to.equal(4);
    expect(uuid.toString()).to.equal("5eb893ba-ec79-4f55-958d-66731227b662");

  });

  it("fromString(string) v4 4", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    expect(uuid.type).to.equal(2);
    expect(uuid.subtype).to.equal(4);
    expect(uuid.toString()).to.equal("4525970b-49cb-4d89-9987-54ba4263ac99");

  });

  it("fromString(*)", () => {
    expect(() => {
      Uuid.fromString(1 as unknown as string);
    }).to.throw(TypeError, "uuidString").with.property("name", "TypeError");

    expect(() => {
      Uuid.fromString("4525970B49CB4D89998754BA4263AC9G");
    }).to.throw(RangeError, "uuidString").with.property("name", "RangeError");

  });

});

describe("Uuid.prototype.format", () => {
  it("format()", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    expect(uuid.format()).to.equal("4525970b-49cb-4d89-9987-54ba4263ac99");

  });

  it("format({})", () => {
    const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
    expect(uuid.format({})).to.equal("4525970b-49cb-4d89-9987-54ba4263ac99");
    expect(uuid.format({upperCase:true})).to.equal("4525970B-49CB-4D89-9987-54BA4263AC99");
    expect(uuid.format({upperCase:true,noHyphens:true})).to.equal("4525970B49CB4D89998754BA4263AC99");
    expect(uuid.format({upperCase:true,noHyphens:false})).to.equal("4525970B-49CB-4D89-9987-54BA4263AC99");

  });

});

describe("Uuid.toJSON", () => {
  it("toJSON()", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    expect(uuid.toJSON()).to.equal("00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.toURN", () => {
  it("toURN()", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
    expect(uuid.toURN().toString()).to.equal("urn:uuid:00000000-0000-0000-0000-000000000000");

  });

});

describe("Uuid.prototype.type", () => {
  it("type - 0", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-0000-000000000000");
    expect(uuid.type).to.equal(0);

  });

  it("type - 2", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
    expect(uuid.type).to.equal(2);

  });

  it("type - 6", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-C000-000000000000");
    expect(uuid.type).to.equal(6);

  });

  it("type - 7", () => {
    const uuid = Uuid.fromString("00000000-0000-0000-f000-000000000000");
    expect(uuid.type).to.equal(7);

  });

});

describe("Uuid.prototype.subtype", () => {
  it("subtype - 5", () => {
    const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
    expect(uuid.subtype).to.equal(5);

  });

  it("subtype - 4", () => {
    const uuid = Uuid.fromString("00000000-0000-4000-9000-000000000000");
    expect(uuid.subtype).to.equal(4);

  });

  it("subtype - 3", () => {
    const uuid = Uuid.fromString("00000000-0000-3000-9000-000000000000");
    expect(uuid.subtype).to.equal(3);

  });

  it("subtype - 2", () => {
    const uuid = Uuid.fromString("00000000-0000-2000-9000-000000000000");
    expect(uuid.subtype).to.equal(2);

  });

  it("subtype - 1", () => {
    const uuid = Uuid.fromString("00000000-0000-1000-9000-000000000000");
    expect(uuid.subtype).to.equal(1);

  });

});

describe("Uuid.prototype.equals", () => {
  it("equals(Uuid)", () => {
    const uuid0 = Uuid.nil();
    expect(uuid0.equals(Uuid.nil())).to.equal(true);
    expect(uuid0 !== Uuid.nil()).to.equal(true);

    const uuid1 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
    expect(uuid0.equals(uuid1)).to.equal(false);
    expect(uuid1b.equals(uuid1)).to.equal(true);
    expect(uuid2.equals(uuid1)).to.equal(false);

  });

  it("equals(string)", () => {
    const uuid0 = Uuid.nil();
    expect(uuid0.equals("00000000-0000-0000-0000-000000000000")).to.equal(true);
    expect(uuid0.equals("urn:uuid:00000000-0000-0000-0000-000000000000")).to.equal(true);
    expect(uuid0.equals("00000000000000000000000000000000")).to.equal(true);
    expect(uuid0.equals("00000000000000000000000000000001")).to.equal(false);
    expect(uuid0.equals("0")).to.equal(false);

    const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
    const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
    expect(uuid0.equals("5eb893ba-ec79-4f55-958d-66731227b662")).to.equal(false);
    expect(uuid1b.equals("5eb893ba-ec79-4f55-958d-66731227b662")).to.equal(true);
    expect(uuid2.equals("5eb893ba-ec79-4f55-958d-66731227b662")).to.equal(false);

  });

  it("equals(*)", () => {
    const uuid0 = Uuid.nil();
    expect(() => {
      uuid0.equals(0 as unknown as string);
    }).to.throw(TypeError, "other").with.property("name", "TypeError");

  });

});
