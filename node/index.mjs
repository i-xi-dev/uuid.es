import { webcrypto } from "node:crypto";
globalThis.crypto = webcrypto;

export * from "../dist/index.js";
