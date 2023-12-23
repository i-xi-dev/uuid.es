import { Uuid } from "https://www.unpkg.com/@i-xi-dev/uuid@3.0.4/esm/mod.js";
// https://cdn.skypack.dev/@i-xi-dev/uuid@3.0.4

const i1 = document.getElementById("i1");
const i1a1 = document.getElementById("i1a1");
const i1a2 = document.getElementById("i1a2");
const a1 = document.getElementById("a1");
const o1 = document.getElementById("o1");
const o2 = document.getElementById("o2");

i1a1.addEventListener("click", () => {
  i1.value = Uuid.generateRandom().toString();
}, { passive: true });

i1a2.addEventListener("click", () => {
  i1.value = Uuid.nil().toString();
}, { passive: true });

a1.addEventListener("click", () => {
  try {
    const uuid = Uuid.fromString(i1.value);
    o1.value = uuid.variant;
    o2.value = uuid.version;
  } catch {
    o1.value = "error";
    o2.value = "error";
  }
}, { passive: true });

document.querySelector("*.progress").hidden = true;
