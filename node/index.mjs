globalThis.crypto = (await import("node:crypto")).webcrypto;

export { Uuid } from "../dist/uuid.js";
