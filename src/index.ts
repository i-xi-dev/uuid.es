//

import { type uint8 } from "@i-xi-dev/fundamental";
import { ByteSequence } from "@i-xi-dev/bytes";

/**
 * The object representation of UUID.
 * The `Uuid` instances are immutable.
 * 
 * Implements version 4 UUID.
 * 
 * @see [RFC 4122](https://datatracker.ietf.org/doc/html/rfc4122)
 */
class Uuid {
  #bytes: ByteSequence;
  #timeLow: ByteSequence;
  #timeMid: ByteSequence;
  #timeHighAndVersion: ByteSequence;
  #clockSeqAndReserved: ByteSequence;
  #clockSeqLow: ByteSequence;
  #node: ByteSequence;

  private constructor(bytes: ByteSequence) {
    this.#bytes = bytes;
    this.#timeLow = ByteSequence.fromArrayBufferView(bytes.getUint8View(0, 4));
    this.#timeMid = ByteSequence.fromArrayBufferView(bytes.getUint8View(4, 2));
    this.#timeHighAndVersion = ByteSequence.fromArrayBufferView(bytes.getUint8View(6, 2));
    this.#clockSeqAndReserved = ByteSequence.fromArrayBufferView(bytes.getUint8View(8, 1));
    this.#clockSeqLow = ByteSequence.fromArrayBufferView(bytes.getUint8View(9, 1));
    this.#node = ByteSequence.fromArrayBufferView(bytes.getUint8View(10));
    Object.freeze(this);
  }

  /**
   * Gets the [variant](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1) of this UUID.
   */
  get type(): number {
    const byte8 = this.#clockSeqAndReserved.getUint8View()[0] as uint8;
    if ((byte8 & 0b11100000) === 0b11100000) {
      return 7;
    }
    else if ((byte8 & 0b11000000) === 0b11000000) {
      return 6;
    }
    else if ((byte8 & 0b10000000) === 0b10000000) {
      return 2;
    }
    else { // if ((byte8 & 0b00000000) === 0b00000000) {
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
      const byte6 = this.#timeHighAndVersion.getUint8View()[0] as uint8;
      if ((byte6 & 0b01010000) === 0b01010000) {
        return 5;
      }
      else if ((byte6 & 0b01000000) === 0b01000000) {
        return 4;
      }
      else if ((byte6 & 0b00110000) === 0b00110000) {
        return 3;
      }
      else if ((byte6 & 0b00100000) === 0b00100000) {
        return 2;
      }
      else if ((byte6 & 0b00010000) === 0b00010000) {
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
   * Creates an `Uuid` object that represents the [nil UUID](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.7).
   * 
   * @returns An `Uuid` object that represents the nil UUID.
   */
  static nil(): Uuid {
    return new Uuid(ByteSequence.allocate(16));
  }

  /**
   * Creates an `Uuid` object that represents the version 4 UUID.
   * 
   * @returns An `Uuid` object that represents the version 4 UUID.
   */
  static generateRandom(): Uuid {
    const randomBytes = ByteSequence.generateRandom(16);
    const uint8View = randomBytes.getUint8View();

    // timeHighAndVersionの先頭4ビット（7バイト目の上位4ビット）は0100₂固定（13桁目の文字列表現は"4"固定）
    uint8View[6] = (uint8View[6] as uint8) & 0x0F | 0x40;

    // clockSeqAndReservedの先頭2ビット（9バイト目の上位2ビット）は10₂固定（17桁目の文字列表現は"8","9","A","B"のどれか）
    uint8View[8] = (uint8View[8] as uint8) & 0x3F | 0x80;

    return new Uuid(randomBytes);
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
    if (/^(?:(?:urn:uuid:)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i.test(uuidString) !== true) {
      throw new RangeError("uuidString");
    }

    const formattedBytes = uuidString.toLowerCase().replace(/^urn:uuid:/, "").replace(/-/g, "");
    const parsedBytes = ByteSequence.parse(formattedBytes);
    return new Uuid(parsedBytes);
  }

  /**
   * Returns a string representation of this UUID.
   * 
   * @param options - The `Uuid.FormatOptions` dictionary.
   * @returns A string representation of this UUID.
   */
  format(options: Uuid.FormatOptions = {}): string {
    const upperCase = (typeof options?.upperCase === "boolean") ? options.upperCase : false;
    const noHyphens = (typeof options?.noHyphens === "boolean") ? options.noHyphens : false;
    const separator = (noHyphens === true) ? "" : "-";

    const bytesOptions = {
      lowerCase: !upperCase,
    };
    return [
      this.#timeLow.format(bytesOptions),
      this.#timeMid.format(bytesOptions),
      this.#timeHighAndVersion.format(bytesOptions),
      this.#clockSeqAndReserved.format(bytesOptions) + this.#clockSeqLow.format(bytesOptions),
      this.#node.format(bytesOptions),
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

  /**
   * Determines whether this UUID is equal to the UUID represented by another object.
   * 
   * @param other - The object or string that represents a UUID.
   * @returns If this is equal to the specified UUID, `true`; otherwise, `false`.
   * @throws {TypeError} The `other` is not type of `Uuid` or string.
   */
  equals(other: Uuid | string): boolean {
    if (other instanceof Uuid) {
      return this.#bytes.equals(other.#bytes);
    }
    else if (typeof other === "string") {
      try {
        const otherUuid = Uuid.fromString(other);
        return this.#bytes.equals(otherUuid.#bytes);
      }
      catch {
        return false;
      }
    }
    throw new TypeError("other");
  }
}

namespace Uuid {
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
}

Object.freeze(Uuid);

export {
  Uuid,
};
