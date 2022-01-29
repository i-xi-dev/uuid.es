//

import { type uint8 } from "@i-xi-dev/fundamental";
import { ByteSequence } from "@i-xi-dev/bytes";

type UuidFormatOptions = {
  upperCase?: boolean;
  hyphenate?: boolean;
}

/**
 * UUID
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
    if ((bytes instanceof ByteSequence) !== true) {
      throw new TypeError("bytes");
    }
    if (bytes.byteLength !== 16) {
      throw new RangeError("bytes");
    }
    this.#bytes = bytes;
    this.#timeLow = ByteSequence.fromArrayBufferView(bytes.getUint8View(0, 4));
    this.#timeMid = ByteSequence.fromArrayBufferView(bytes.getUint8View(4, 2));
    this.#timeHighAndVersion = ByteSequence.fromArrayBufferView(bytes.getUint8View(6, 2));
    this.#clockSeqAndReserved = ByteSequence.fromArrayBufferView(bytes.getUint8View(8, 1));
    this.#clockSeqLow = ByteSequence.fromArrayBufferView(bytes.getUint8View(9, 1));
    this.#node = ByteSequence.fromArrayBufferView(bytes.getUint8View(10));
    Object.freeze(this);
  }

  static nil(): Uuid {
    return new Uuid(ByteSequence.allocate(16));
  }

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

  format(options: UuidFormatOptions = {}): string {
    const upperCase = (typeof options?.upperCase === "boolean") ? options.upperCase : false;
    const hyphenate = (typeof options?.hyphenate === "boolean") ? options.hyphenate : true;
    const separator = (hyphenate === true) ? "-" : "";

    return [
      this.#timeLow.format({ upperCase }),
      this.#timeMid.format({ upperCase }),
      this.#timeHighAndVersion.format({ upperCase }),
      this.#clockSeqAndReserved.format({ upperCase }) + this.#clockSeqLow.format({ upperCase }),
      this.#node.format({ upperCase }),
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
   * Returns an URN that represents the UUID.
   * 
   * @returns An URN that represents the UUID.
   */
  toURN(): URL {
    return new URL("urn:uuid:" + this.toString());
  }

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
    return false;
  }

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

  get variant(): number {
    return this.type;
  }

  get version(): number {
    if (this.type === 2) {

    }
    else {
      return Number.NaN;
    }
  }

  get subtype(): number {
    return this.version;
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
}
Object.freeze(Uuid);

export {
  type UuidFormatOptions,
  Uuid,
};
