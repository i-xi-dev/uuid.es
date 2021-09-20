globalThis.crypto = (await import("node:crypto")).webcrypto;

export { Uuid, UuidUrn } from "../dist/uuid.js";
