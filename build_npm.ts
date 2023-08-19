import { build, emptyDir } from "https://deno.land/x/dnt@0.38.0/mod.ts";

await emptyDir("./npm");

await build({
  compilerOptions: {
    lib: ["ESNext", "DOM"],
  },
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/uuid",
    version: "3.0.12",
    description:
      "A JavaScript UUID generator, implements the version 4 UUID defined in RFC 4122.",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/uuid.es#readme",
    keywords: [
      "uuid",
      "browser",
      "deno",
      "nodejs",
      "zero-dependency",
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/uuid.es.git",
    },
    bugs: {
      url: "https://github.com/i-xi-dev/uuid.es/issues",
    },
    publishConfig: {
      access: "public",
    },
    files: [
      "esm",
      "types",
    ],
  },
  typeCheck: "both",
  declaration: "inline",
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
