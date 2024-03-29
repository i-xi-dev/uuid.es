import { assertEquals, assertStrictEquals, assertThrows } from "./deps.ts";
import { Uuid } from "../mod.ts";

Deno.test("Uuid.nil()", () => {
  const uuid = Uuid.nil();
  assertStrictEquals(uuid.type, 0);
  assertEquals(uuid.subtype, Number.NaN);
  assertStrictEquals(uuid.toString(), "00000000-0000-0000-0000-000000000000");
});

// Deno.test("Uuid.max()", () => {
//   const uuid = Uuid.max();
//   assertStrictEquals(uuid.type, 7);
//   assertEquals(uuid.subtype, Number.NaN);
//   assertStrictEquals(uuid.toString(), "ffffffff-ffff-ffff-ffff-ffffffffffff");
// });

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

Deno.test("Uuid.fromName(Uuid, string)", async () => {
  const u1 = await Uuid.fromName(Uuid.Namespace.URL, "string");
  assertStrictEquals(u1.toString(), "64be9091-88e8-5476-996b-8b541f7bf3e5");
  assertStrictEquals(u1.type, 2);
  assertStrictEquals(u1.subtype, 5);

  const u1t = await Uuid.fromName(
    "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    "string",
  );
  assertStrictEquals(u1t.toString(), "64be9091-88e8-5476-996b-8b541f7bf3e5");
  assertStrictEquals(u1t.type, 2);
  assertStrictEquals(u1t.subtype, 5);

  const u1t2 = await Uuid.fromName(
    "urn:uuid:6BA7B811-9DAD-11D1-80B4-00C04FD430C8",
    "string",
  );
  assertStrictEquals(u1t2.toString(), "64be9091-88e8-5476-996b-8b541f7bf3e5");
  assertStrictEquals(u1t2.type, 2);
  assertStrictEquals(u1t2.subtype, 5);

  const u2 = await Uuid.fromName(Uuid.Namespace.URL, "あ");
  assertStrictEquals(u2.toString(), "fb641640-27a6-5bda-9a60-110bdf397598");
  assertStrictEquals(u2.type, 2);
  assertStrictEquals(u2.subtype, 5);
});

Deno.test("Uuid.fromName(Uuid, string, 5)", async () => {
  const u1 = await Uuid.fromName(Uuid.Namespace.URL, "string");
  assertStrictEquals(u1.toString(), "64be9091-88e8-5476-996b-8b541f7bf3e5");
  assertStrictEquals(u1.type, 2);
  assertStrictEquals(u1.subtype, 5);

  const u2 = await Uuid.fromName(Uuid.Namespace.URL, "あ");
  assertStrictEquals(u2.toString(), "fb641640-27a6-5bda-9a60-110bdf397598");
  assertStrictEquals(u2.type, 2);
  assertStrictEquals(u2.subtype, 5);

  const u3 = await Uuid.fromName(
    Uuid.Namespace.URL,
    "https://example.com/sample/123",
  );
  assertStrictEquals(u3.toString(), "7fdb2afb-a771-50eb-a0ae-7f02b933a569");
  assertStrictEquals(u3.type, 2);
  assertStrictEquals(u3.subtype, 5);
});

Deno.test("Uuid.fromName(Uuid, string, 3)", async () => {
  const u1 = await Uuid.fromName(Uuid.Namespace.URL, "string", 3);
  assertStrictEquals(u1.toString(), "724533da-66b6-35a1-ad9e-20205be920e9");
  assertStrictEquals(u1.type, 2);
  assertStrictEquals(u1.subtype, 3);

  const u2 = await Uuid.fromName(Uuid.Namespace.URL, "あ", 3);
  assertStrictEquals(u2.toString(), "72bfcf35-4daf-306d-a757-b3a2ebac5e95");
  assertStrictEquals(u2.type, 2);
  assertStrictEquals(u2.subtype, 3);

  const u3 = await Uuid.fromName(
    Uuid.Namespace.URL,
    "https://example.com/sample/123",
    3,
  );
  assertStrictEquals(u3.toString(), "b131a200-1fa6-313e-b5d2-6b7a9b00570c");
  assertStrictEquals(u3.type, 2);
  assertStrictEquals(u3.subtype, 3);
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

Deno.test("Uuid.prototype.subtype - 8", () => {
  const uuid = Uuid.fromString("00000000-0000-8000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 8);
});

Deno.test("Uuid.prototype.subtype - 7", () => {
  const uuid = Uuid.fromString("00000000-0000-7000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 7);
});

Deno.test("Uuid.prototype.subtype - 6", () => {
  const uuid = Uuid.fromString("00000000-0000-6000-9000-000000000000");
  assertStrictEquals(uuid.subtype, 6);
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

Deno.test("Uuid.generateUnixTimeBased()", () => {
  const uuid = Uuid.generateUnixTimeBased();
  //console.log(uuid.toString());
  assertStrictEquals(uuid.type, 2);
  assertStrictEquals(uuid.variant, 2);
  assertStrictEquals(uuid.subtype, 7);
  assertStrictEquals(uuid.version, 7);

  let prev = Uuid.nil().toString();
  let curr = "";
  for (let i = 0; i <= 0xFFF; i++) {
    curr = Uuid.generateUnixTimeBased().toString();
    assertStrictEquals(curr > prev, true);
    prev = curr;
  }
});

Deno.test("Uuid.prototype.unixTimeMilliseconds", async () => {
  // const uuid = Uuid.generateUnixTimeBased();
  // console.log(new Date(uuid.unixTimeMilliseconds).toISOString());

  assertStrictEquals(
    Number.isFinite(Uuid.generateUnixTimeBased().unixTimeMilliseconds),
    true,
  );
  assertStrictEquals(
    Number.isFinite(Uuid.generateRandom().unixTimeMilliseconds),
    false,
  );
  assertStrictEquals(
    Number.isFinite(
      (await Uuid.fromName(Uuid.Namespace.URL, "a")).unixTimeMilliseconds,
    ),
    false,
  );
});
