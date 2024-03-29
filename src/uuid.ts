import {
  _crypto,
  BufferUtils,
  BytesFormat,
  Digest,
  SafeInteger,
  StringEx,
  Uint8,
} from "../deps.ts";

let _encoder: TextEncoder;
function _encodeText(input: string): Uint8Array {
  if (!_encoder) {
    _encoder = new TextEncoder();
  }
  return _encoder.encode(input);
}

const _timeOrigin = globalThis.performance.timeOrigin;

function _timestamp(): SafeInteger {
  // performance.nowの精度がミリ秒に下がった実装が多いが、単調増加することは保証されているのでDate.now()ではなくこちらを採用
  // ただし、fingerprint対策で精度をさらに下げるよう設定できる実装が存在する（少なくともFirefox）
  return Math.trunc(_timeOrigin + globalThis.performance.now());
}

/**
 * The object representation of UUID.
 * The `Uuid` instances are immutable.
 *
 * Implements version 4 UUID.
 *
 * @see [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122)
 */
export class Uuid {
  readonly #bytes: Uint8Array;

  static #prevV7Timestamp: SafeInteger = 0;

  static #v7Counter: SafeInteger = 0;

  private constructor(bytes: Uint8Array) {
    this.#bytes = bytes;
    Object.freeze(this);
  }

  get #timeLow(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(0, 4));
  }

  get #timeMid(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(4, 6));
  }

  get #timeHighAndVersion(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(6, 8));
  }

  get #clockSeqAndReserved(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(8, 9));
  }

  get #clockSeqLow(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(9, 10));
  }

  get #node(): Uint8Array {
    return Uint8Array.from(this.#bytes.subarray(10));
  }

  /**
   * Gets the [variant](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1) of this UUID.
   */
  get type(): number {
    const byte8 = this.#clockSeqAndReserved[0] as Uint8;
    if ((byte8 & 0b11100000) === 0b11100000) {
      return 7;
    } else if ((byte8 & 0b11000000) === 0b11000000) {
      return 6;
    } else if ((byte8 & 0b10000000) === 0b10000000) {
      return 2;
    } else { // if ((byte8 & 0b00000000) === 0b00000000) {
      return 0;
    }
  }

  /**
   * The alias for the `type` getter.
   */
  get variant(): number {
    return this.type;
  }

  /**
   * Gets the [version](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.3) of this UUID.
   */
  get subtype(): number {
    if (this.type === 2) {
      const byte6 = this.#timeHighAndVersion[0] as Uint8;
      //TODO ドラフトでは15までは予約されてる
      //TODO 網羅しなくても計算できる
      if ((byte6 & 0b1000_0000) === 0b1000_0000) {
        return 8;
      } else if ((byte6 & 0b0111_0000) === 0b0111_0000) {
        return 7;
      } else if ((byte6 & 0b0110_0000) === 0b0110_0000) {
        return 6;
      } else if ((byte6 & 0b0101_0000) === 0b0101_0000) {
        return 5;
      } else if ((byte6 & 0b0100_0000) === 0b0100_0000) {
        return 4;
      } else if ((byte6 & 0b0011_0000) === 0b0011_0000) {
        return 3;
      } else if ((byte6 & 0b0010_0000) === 0b0010_0000) {
        return 2;
      } else if ((byte6 & 0b0001_0000) === 0b0001_0000) {
        return 1;
      }
    }
    return Number.NaN;
  }

  /**
   * The alias for the `subtype` getter.
   */
  get version(): number {
    return this.subtype;
  }

  /**
   * Timestamp of when the UUID was generated if the UUID version is 7.
   * If the UUID version is not 7, returns `NaN`.
   */
  get unixTimeMilliseconds(): number {
    if (this.subtype === 7) {
      let work = (new DataView(this.#bytes.buffer)).getBigUint64(0);
      work = work >> 16n;
      return Number(work);
    }
    return Number.NaN;
  }

  /**
   * Creates an `Uuid` object that represents the [nil UUID](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.7).
   *
   * @returns An `Uuid` object that represents the nil UUID.
   */
  static nil(): Uuid {
    return new Uuid(new Uint8Array(16));
  }

  // /**
  //  * Creates an `Uuid` object that represents the max UUID proposal.
  //  *
  //  * @experimental
  //  */
  // static max(): Uuid {
  //   const bytes = new Uint8Array(16);
  //   bytes.fill(0xFF);
  //   return new Uuid(bytes);
  // }

  /**
   * Creates an `Uuid` object that represents the version 4 UUID.
   *
   * @returns An `Uuid` object that represents the version 4 UUID.
   */
  static generateRandom(): Uuid {
    const randomBytes = _crypto.getRandomValues(new Uint8Array(16));

    // timeHighAndVersionの先頭4ビット（7バイト目の上位4ビット）は0100₂固定（13桁目の文字列表現は"4"固定）
    randomBytes[6] = (randomBytes[6] as Uint8) & 0x0F | 0x40;

    // clockSeqAndReservedの先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    randomBytes[8] = (randomBytes[8] as Uint8) & 0x3F | 0x80;

    return new Uuid(randomBytes);
  }

  /**
   * Creates an `Uuid` object that represents the version 5 or 3 UUID.
   *
   * @param namespace - The UUID to be used as namespace ID.
   * @param name - The name.
   * @param subtype - The version. Defaults to 5 if omitted.
   * @returns An `Uuid` object that represents the version 5 or 3 UUID.
   */
  static async fromName(
    namespace: string | Uuid,
    name: string,
    subtype: 3 | 5 = 5,
  ): Promise<Uuid> {
    let namespaceBytes: Uint8Array | null = null;
    if (namespace instanceof Uuid) {
      namespaceBytes = namespace.#toUint8Array();
    } else if (typeof namespace === "string") {
      try {
        const namespaceUuid = Uuid.fromString(namespace);
        namespaceBytes = namespaceUuid.#toUint8Array();
      } catch {
        throw new RangeError("namespace");
      }
    } else {
      throw new TypeError("namespace");
    }

    if (StringEx.isString(name) !== true) {
      throw new TypeError("name");
    }
    const nameBytes = _encodeText(name);

    if ([3, 5].includes(subtype) !== true) {
      throw new TypeError("subtype");
    }

    const bytes = new Uint8Array(namespaceBytes.length + nameBytes.length);
    bytes.set(namespaceBytes, 0);
    bytes.set(nameBytes, namespaceBytes.length);

    const digest = (subtype === 5)
      ? await Digest.Sha1.compute(bytes)
      : await Digest.Md5.compute(bytes);
    const digestBytes = new Uint8Array(digest);

    if (subtype === 5) {
      // timeHighAndVersionの先頭4ビット（7バイト目の上位4ビット）は0101₂固定（13桁目の文字列表現は"5"固定）
      digestBytes[6] = (digestBytes[6] as Uint8) & 0x0F | 0x50;
    } else {
      // timeHighAndVersionの先頭4ビット（7バイト目の上位4ビット）は0011₂固定（13桁目の文字列表現は"3"固定）
      digestBytes[6] = (digestBytes[6] as Uint8) & 0x0F | 0x30;
    }

    // clockSeqAndReservedの先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    digestBytes[8] = (digestBytes[8] as Uint8) & 0x3F | 0x80;

    return new Uuid(digestBytes.slice(0, 16));
  }

  /**
   * Creates an `Uuid` object that represents the version 7 UUID proposal.
   *
   * @experimental
   */
  static generateUnixTimeBased(): Uuid {
    const bytes = _crypto.getRandomValues(new Uint8Array(16));

    // 先頭48ビットにミリ秒精度の現在時刻をビッグエンディアンでセット
    const millis = _timestamp();
    const workBuffer = new ArrayBuffer(8);
    const workView = new DataView(workBuffer);
    workView.setBigUint64(0, BigInt(millis));
    bytes.set(new Uint8Array(workBuffer, 2), 0);

    // 仕様上ミリ秒未満ナノ秒までをセットすることもできるが、
    // ミリ秒未満をブラウザで確実に取る方法が結局のところ無いので、
    // RFC4122bisの6.2の方法1を実装する（rand_aをランダム値ではなくタイムスタンプが前回と同じ場合+1するカウンターとする）
    if (this.#prevV7Timestamp === millis) {
      this.#v7Counter = this.#v7Counter + 1;
    } else {
      this.#prevV7Timestamp = millis;
      this.#v7Counter = 0;
    }
    workView.setBigUint64(0, 0n);
    workView.setUint16(0, this.#v7Counter);
    bytes.set(new Uint8Array(workBuffer, 0, 2), 6);

    // timeHighAndVersionの先頭4ビット（7バイト目の上位4ビット）は0111₂固定（13桁目の文字列表現は"7"固定）
    bytes[6] = (bytes[6] as Uint8) & 0x0F | 0x70;

    // clockSeqAndReservedの先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    bytes[8] = (bytes[8] as Uint8) & 0x3F | 0x80;

    return new Uuid(bytes);
  }

  /**
   * Creates an `Uuid` object from a string that represents the UUID.
   *
   * @returns An `Uuid` object.
   * @throws {TypeError} The `uuidString` is not type of string.
   * @throws {RangeError} The `uuidString` is not reperesent the UUID.
   */
  static fromString(uuidString: string): Uuid {
    if (typeof uuidString !== "string") {
      throw new TypeError("uuidString");
    }
    if (
      /^(?:(?:urn:uuid:)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i
        .test(uuidString) !== true
    ) {
      throw new RangeError("uuidString");
    }

    const formattedBytes = uuidString.toLowerCase().replace(/^urn:uuid:/, "")
      .replace(/-/g, "");
    const parsedBytes = BytesFormat.parse(formattedBytes);
    return new Uuid(parsedBytes);
  }

  /**
   * Returns a string representation of this UUID.
   *
   * @param options - The `UuidFormat.Options` dictionary.
   * @returns A string representation of this UUID.
   */
  format(options: Uuid.FormatOptions = {}): string {
    const upperCase = (typeof options?.upperCase === "boolean")
      ? options.upperCase
      : false;
    const noHyphens = (typeof options?.noHyphens === "boolean")
      ? options.noHyphens
      : false;
    const separator = (noHyphens === true) ? "" : "-";

    const bytesOptions = {
      lowerCase: !upperCase,
    };
    return [
      BytesFormat.format(this.#timeLow, bytesOptions),
      BytesFormat.format(this.#timeMid, bytesOptions),
      BytesFormat.format(this.#timeHighAndVersion, bytesOptions),
      BytesFormat.format(this.#clockSeqAndReserved, bytesOptions) +
      BytesFormat.format(this.#clockSeqLow, bytesOptions),
      BytesFormat.format(this.#node, bytesOptions),
    ].join(separator);
  }

  /**
   * Returns a string that represents the UUID.
   *
   * @returns A string that represents the UUID.
   */
  toString(): string {
    return this.format();
  }

  /**
   * The alias for the `toString` method.
   *
   * @returns A string that represents the UUID.
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Returns an URN that represents the UUID.
   *
   * @returns An URN that represents the UUID.
   */
  toURN(): URL {
    return new URL("urn:uuid:" + this.toString());
  }

  #toUint8Array(): Uint8Array {
    return Uint8Array.from(this.#bytes);
  }

  /**
   * Determines whether this UUID is equal to the UUID represented by another object.
   *
   * @param other - The object or string that represents a UUID.
   * @returns If this is equal to the specified UUID, `true`; otherwise, `false`.
   * @throws {TypeError} The `other` is not type of `Uuid` or string.
   */
  equals(other: Uuid | string): boolean {
    if (other instanceof Uuid) {
      return BufferUtils.bytesAEqualsBytesB(this.#bytes, other.#bytes);
    } else if (typeof other === "string") {
      try {
        const otherUuid = Uuid.fromString(other);
        return BufferUtils.bytesAEqualsBytesB(this.#bytes, otherUuid.#bytes);
      } catch {
        return false;
      }
    }
    throw new TypeError("other");
  }
}

export namespace Uuid {
  /**
   * The object with the following optional fields.
   */
  export type FormatOptions = {
    /**
     * Whether the formatted string is uppercase or not.
     * The default is `false`.
     */
    upperCase?: boolean;

    /**
     * Whether to omit hyphens to join fields.
     * The default is `false`.
     */
    noHyphens?: boolean;
  };

  export const Namespace = {
    DNS: Uuid.fromString("6ba7b810-9dad-11d1-80b4-00c04fd430c8"),
    URL: Uuid.fromString("6ba7b811-9dad-11d1-80b4-00c04fd430c8"),
    OID: Uuid.fromString("6ba7b812-9dad-11d1-80b4-00c04fd430c8"),
    X500: Uuid.fromString("6ba7b814-9dad-11d1-80b4-00c04fd430c8"),
  } as const;
}
