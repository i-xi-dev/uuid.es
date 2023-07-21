import { assertEquals, assertStrictEquals, assertThrows } from "./deps.ts";
import { Uuid } from "../mod.ts";

Deno.test("Uuid.nil()", () => {
  const uuid = Uuid.nil();
  assertStrictEquals(uuid.type, 0);
  assertEquals(uuid.subtype, Number.NaN);
  assertStrictEquals(uuid.toString(), "00000000-0000-0000-0000-000000000000");
});

Deno.test("Uuid.generateRandom()", () => {
  const uuids = [];
  for (let i = 0; i < 100; i++) {
    const uuid = Uuid.generateRandom();
    assertStrictEquals(uuid.type, 2);
    assertStrictEquals(uuid.variant, 2);
    assertStrictEquals(uuid.subtype, 4);
    assertStrictEquals(uuid.version, 4);
    assertStrictEquals(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        .test(uuid.toString()),
      true,
    );
    uuids.push(uuid);
  }
  assertStrictEquals(uuids.length, (new Set(uuids)).size);
});

Deno.test("Uuid.fromString(string) nil 1", () => {
  const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
  assertStrictEquals(uuid.type, 0);
  assertEquals(uuid.subtype, Number.NaN);
  assertStrictEquals(uuid.toString(), "00000000-0000-0000-0000-000000000000");
});

Deno.test("Uuid.fromString(string) nil 2", () => {
  const uuid = Uuid.fromString("00000000000000000000000000000000");
  assertStrictEquals(uuid.type, 0);
  assertEquals(uuid.subtype, Number.NaN);
  assertStrictEquals(uuid.toString(), "00000000-0000-0000-0000-000000000000");
});

Deno.test("Uuid.fromString(string) nil 3", () => {
  const uuid = Uuid.fromString("urn:uuid:00000000-0000-0000-0000-000000000000");
  assertStrictEquals(uuid.type, 0);
  assertEquals(uuid.subtype, Number.NaN);
  assertStrictEquals(uuid.toString(), "00000000-0000-0000-0000-000000000000");
});

Deno.test("Uuid.fromString(string) v4 1", () => {
  const uuid = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
  assertStrictEquals(uuid.type, 2);
  assertStrictEquals(uuid.subtype, 4);
  assertStrictEquals(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");
});

Deno.test("Uuid.fromString(string) v4 2", () => {
  const uuid = Uuid.fromString("5EB893BA-EC79-4F55-958D-66731227B662");
  assertStrictEquals(uuid.type, 2);
  assertStrictEquals(uuid.subtype, 4);
  assertStrictEquals(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");
});

Deno.test("Uuid.fromString(string) v4 3", () => {
  const uuid = Uuid.fromString("URN:UUID:5EB893BA-EC79-4F55-958D-66731227B662");
  assertStrictEquals(uuid.type, 2);
  assertStrictEquals(uuid.subtype, 4);
  assertStrictEquals(uuid.toString(), "5eb893ba-ec79-4f55-958d-66731227b662");
});

Deno.test("Uuid.fromString(string) v4 4", () => {
  const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
  assertStrictEquals(uuid.type, 2);
  assertStrictEquals(uuid.subtype, 4);
  assertStrictEquals(uuid.toString(), "4525970b-49cb-4d89-9987-54ba4263ac99");
});

Deno.test("Uuid.fromString(*)", () => {
  assertThrows(
    () => {
      Uuid.fromString(1 as unknown as string);
    },
    TypeError,
    "uuidString",
  );

  assertThrows(
    () => {
      Uuid.fromString("4525970B49CB4D89998754BA4263AC9G");
    },
    RangeError,
    "uuidString",
  );
});

Deno.test("Uuid.prototype.format()", () => {
  const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
  assertStrictEquals(uuid.format(), "4525970b-49cb-4d89-9987-54ba4263ac99");
});

Deno.test("Uuid.prototype.format({})", () => {
  const uuid = Uuid.fromString("4525970B49CB4D89998754BA4263AC99");
  assertStrictEquals(uuid.format({}), "4525970b-49cb-4d89-9987-54ba4263ac99");
  assertStrictEquals(
    uuid.format({ upperCase: true }),
    "4525970B-49CB-4D89-9987-54BA4263AC99",
  );
  assertStrictEquals(
    uuid.format({ upperCase: true, noHyphens: true }),
    "4525970B49CB4D89998754BA4263AC99",
  );
  assertStrictEquals(
    uuid.format({ upperCase: true, noHyphens: false }),
    "4525970B-49CB-4D89-9987-54BA4263AC99",
  );
});

Deno.test("Uuid.prototype.toJSON()", () => {
  const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
  assertStrictEquals(uuid.toJSON(), "00000000-0000-0000-0000-000000000000");
});

Deno.test("Uuid.prototype.toURN()", () => {
  const uuid = Uuid.fromString("00000000-0000-0000-0000-000000000000");
  assertStrictEquals(
    uuid.toURN().toString(),
    "urn:uuid:00000000-0000-0000-0000-000000000000",
  );
});

Deno.test("Uuid.prototype.type - 0", () => {
  const uuid = Uuid.fromString("00000000-0000-5000-0000-000000000000");
  assertStrictEquals(uuid.type, 0);
});

Deno.test("Uuid.prototype.type - 2", () => {
  const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
  assertStrictEquals(uuid.type, 2);
});

Deno.test("Uuid.prototype.type - 6", () => {
  const uuid = Uuid.fromString("00000000-0000-0000-C000-000000000000");
  assertStrictEquals(uuid.type, 6);
});

Deno.test("Uuid.prototype.type - 7", () => {
  const uuid = Uuid.fromString("00000000-0000-0000-f000-000000000000");
  assertStrictEquals(uuid.type, 7);
});

Deno.test("Uuid.prototype.subtype - 5", () => {
  const uuid = Uuid.fromString("00000000-0000-5000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 5);
});

Deno.test("Uuid.prototype.subtype - 4", () => {
  const uuid = Uuid.fromString("00000000-0000-4000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 4);
});

Deno.test("Uuid.prototype.subtype - 3", () => {
  const uuid = Uuid.fromString("00000000-0000-3000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 3);
});

Deno.test("Uuid.prototype.subtype - 2", () => {
  const uuid = Uuid.fromString("00000000-0000-2000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 2);
});

Deno.test("Uuid.prototype.subtype - 1", () => {
  const uuid = Uuid.fromString("00000000-0000-1000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 1);
});

Deno.test("Uuid.prototype.equals(Uuid)", () => {
  const uuid0 = Uuid.nil();
  assertStrictEquals(uuid0.equals(Uuid.nil()), true);
  assertStrictEquals(uuid0 !== Uuid.nil(), true);

  const uuid1 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
  const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
  const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
  assertStrictEquals(uuid0.equals(uuid1), false);
  assertStrictEquals(uuid1b.equals(uuid1), true);
  assertStrictEquals(uuid2.equals(uuid1), false);
});

Deno.test("Uuid.prototype.equals(string)", () => {
  const uuid0 = Uuid.nil();
  assertStrictEquals(
    uuid0.equals("00000000-0000-0000-0000-000000000000"),
    true,
  );
  assertStrictEquals(
    uuid0.equals("urn:uuid:00000000-0000-0000-0000-000000000000"),
    true,
  );
  assertStrictEquals(uuid0.equals("00000000000000000000000000000000"), true);
  assertStrictEquals(uuid0.equals("00000000000000000000000000000001"), false);
  assertStrictEquals(uuid0.equals("0"), false);

  const uuid1b = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
  const uuid2 = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b663");
  assertStrictEquals(
    uuid0.equals("5eb893ba-ec79-4f55-958d-66731227b662"),
    false,
  );
  assertStrictEquals(
    uuid1b.equals("5eb893ba-ec79-4f55-958d-66731227b662"),
    true,
  );
  assertStrictEquals(
    uuid2.equals("5eb893ba-ec79-4f55-958d-66731227b662"),
    false,
  );
});

Deno.test("Uuid.prototype.equals(*)", () => {
  const uuid0 = Uuid.nil();
  assertThrows(
    () => {
      uuid0.equals(0 as unknown as string);
    },
    TypeError,
    "other",
  );
});
