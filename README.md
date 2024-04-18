# @i-xi-dev/uuid

A JavaScript UUID generator, implements the version 3, 4, and 5 UUID defined in [RFC 4122](https://datatracker.ietf.org/doc/rfc4122/). And this generator implements version 7 draft proposed in RFC 4122 bis.


## Requirement

### `Uuid.generateRandom` and `Uuid.generateUnixTimeBased` methods

This requires [`Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.0.0+ |

### `Uuid.fromName` methods

Generating version 5 requires [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.0.0+ |

`SubtleCrypto` is available in secure contexts, in browsers.

## Installation

### npm

```console
$ npm i @i-xi-dev/uuid@3.2.2
```

```javascript
import { Uuid } from "@i-xi-dev/uuid";
```

### CDN

Example for UNPKG
```javascript
import { Uuid } from "https://www.unpkg.com/@i-xi-dev/uuid@3.2.2/esm/mod.js";
```


## Usage

### [`Uuid`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/uuid.es/3.2.2/mod.ts/~/Uuid) class

#### Creates a version 4 UUID
```javascript
const uuid = Uuid.generateRandom();
// uuid.toString();
//   → for example "5eb893ba-ec79-4f55-958d-66731227b662"

// Gets the variant, and the version
// uuid.variant;
//   → 2
// uuid.version;
//   → 4

// Gets the URN
const urn = uuid.toURN();
// urn.toString();
//   → for example "urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662"
```

#### Creates an instance from string
```javascript
const uuidB = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
const uuidC = Uuid.fromString("5eb893baec794f55958d66731227b662");
const uuidD = Uuid.fromString("5EB893BA-EC79-4F55-958D-66731227B662");
const uuidE = Uuid.fromString("5EB893BAEC794F55958D66731227B662");
const uuidF = Uuid.fromString("urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662");

// uuidB.equals(uuidC);
//   → true
// uuidB.equals(uuidD);
//   → true
// uuidB.equals(uuidE);
//   → true
// uuidB.equals(uuidF);
//   → true

// uuidB.equals("5eb893ba-ec79-4f55-958d-66731227b662");
//   → true
// uuidB.equals("5eb893baec794f55958d66731227b662");
//   → true
// uuidB.equals("5EB893BA-EC79-4F55-958D-66731227B662");
//   → true
// uuidB.equals("5EB893BAEC794F55958D66731227B662");
//   → true
// uuidB.equals("urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662");
//   → true
```

```javascript
const uuidX = Uuid.fromString(crypto.randomUUID());
```

#### Creates a version 5 UUID
```javascript
const namespace = Uuid.Namespace.URL; // 6ba7b811-9dad-11d1-80b4-00c04fd430c8
const uuid = await Uuid.fromName(namespace, "https://example.com/sample/123");
// uuid.toString();
//   → "7fdb2afb-a771-50eb-a0ae-7f02b933a569"
```

#### Creates a version 3 UUID
```javascript
const namespace = Uuid.Namespace.URL; // 6ba7b811-9dad-11d1-80b4-00c04fd430c8
const uuid = await Uuid.fromName(namespace, "https://example.com/sample/123", 3);
// uuid.toString();
//   → "b131a200-1fa6-313e-b5d2-6b7a9b00570c"
```

#### Creates a version 7 UUID proposal
```javascript
const uuid = Uuid.generateUnixTimeBased();
// uuid.toString();
//   → for example "018d8e7b-f31f-7000-98b7-4593649d25e1"
// new Date(uuid.unixTimeMilliseconds).toISOString();
//   → for example "2024-02-09T15:28:24.351Z"
```

The precision of the time is the greater of the following:
- 1 millisecond
- The precision of the time of `performance.now()` in execution environment

Note that some browsers have `performance.now()` precision greater than 1 millisecond, depending on settings and other factors.

## Examples

- [Parse UUID](https://i-xi-dev.github.io/uuid.es/example/parse.html)
