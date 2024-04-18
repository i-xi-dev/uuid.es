import { Uuid } from "https://www.unpkg.com/@i-xi-dev/uuid@3.2.2/esm/mod.js";
// https://cdn.skypack.dev/@i-xi-dev/uuid@3.2.2

const i1 = document.getElementById("i1");
const i1a1 = document.getElementById("i1a1");
const i1a2 = document.getElementById("i1a2");
const a1 = document.getElementById("a1");
const o1 = document.getElementById("o1");
const o2 = document.getElementById("o2");
const o3 = document.getElementById("o3");
const o4 = document.getElementById("o4");

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
    o3.value = uuid.toString();
    o4.value = uuid.toURN().toString();
  } catch {
    o1.value = "error";
    o2.value = "error";
    o3.value = "error";
    o4.value = "error";
  }
}, { passive: true });

document.querySelector("*.progress").hidden = true;
