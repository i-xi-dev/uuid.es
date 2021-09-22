globalThis.crypto = (await import("node:crypto")).webcrypto;

export { Uuid } from "../dist/index.js";
