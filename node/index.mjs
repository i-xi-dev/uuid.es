import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

export { Uuid } from "../dist/index.js";
