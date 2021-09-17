//

/**
 * UUID
 * 
 * Implements version 4 UUID and Nil UUID.
 * 
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4122 RFC 4122}
 */
interface Uuid {
  /**
   * @returns A string that represents the version 4 UUID.
   */
  generateRandom(): string;

  /**
   * @returns A string that represents the nil UUID.
   */
  NIL: string;
}

type Fields = [ Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array ];

function fieldsOf(bytes: Uint8Array): Readonly<Fields> {
  return [
    bytes.subarray(0, 4),
    bytes.subarray(4, 6),
    bytes.subarray(6, 8),
    bytes.subarray(8, 10),
    bytes.subarray(10),
  ] as const;
}

function fieldsToString(fields: Readonly<Fields>): string {
  return fields.map((field) => {
    return [ ...field ].map((i) => i.toString(16).padStart(2, "0")).join("");
  }).join("-");
}

const Uuid: Uuid = {
  generateRandom(): string {
    const randomBytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    const fields = fieldsOf(randomBytes);

    // フィールド3の先頭4ビット（7バイト目の上位4ビット）は0100₂固定（13桁目の文字列表現は"4"固定）
    fields[2][0] = (fields[2][0] as number) & 0x0F | 0x40;

    // フィールド4の先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    fields[3][0] = (fields[3][0] as number) & 0x3F | 0x80;

    return fieldsToString(fields);
  },

  NIL: fieldsToString(fieldsOf(new Uint8Array(16))),
};
Object.freeze(Uuid);

const URN_PREFIX = "urn:uuid:";

const UuidUrn: Uuid = {
  generateRandom(): string {
    return URN_PREFIX + Uuid.generateRandom();
  },

  NIL: URN_PREFIX + Uuid.NIL,
};
Object.freeze(UuidUrn);

export {
  Uuid,
  UuidUrn,
};
