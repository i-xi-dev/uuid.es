# @i-xi-dev/uuid

A JavaScript UUID generator, implements the version 4 UUID defined in [RFC 4122](https://datatracker.ietf.org/doc/rfc4122/).


## Requirement

This module delegates the random bytes generation to the [`Crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto).

| Chrome | Edge | Firefox | Safari | Deno | Node.js |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅<br />15.0.0+ |


## Installation

### npm

```console
$ npm i @i-xi-dev/uuid@3.0.4
```

```javascript
import { Uuid } from "@i-xi-dev/uuid";
```

### CDN

Example for Skypack
```javascript
import { Uuid } from "https://cdn.skypack.dev/@i-xi-dev/uuid@3.0.4";
```


## Usage

### [`Uuid`](https://doc.deno.land/https://raw.githubusercontent.com/i-xi-dev/uuid.es/3.0.4/mod.ts/~/Uuid) class

#### Creates a version 4 UUID
```javascript
const uuid = Uuid.generateRandom();
// → random UUID
uuid.toString();
// → for example "5eb893ba-ec79-4f55-958d-66731227b662"
```

Gets the variant, and the version
```javascript
uuid.variant;
// → 2
uuid.version;
// → 4
```

Gets the URN
```javascript
const urn = uuid.toURN();
// → URL object
urn.toString();
// → for example "urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662"
```

#### Creates an instance from string
```javascript
const uuidB = Uuid.fromString("5eb893ba-ec79-4f55-958d-66731227b662");
const uuidC = Uuid.fromString("5eb893baec794f55958d66731227b662");
const uuidD = Uuid.fromString("5EB893BA-EC79-4F55-958D-66731227B662");
const uuidE = Uuid.fromString("5EB893BAEC794F55958D66731227B662");
const uuidF = Uuid.fromString("urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662");

uuidB.equals(uuidC);
// → true
uuidB.equals(uuidD);
// → true
uuidB.equals(uuidE);
// → true
uuidB.equals(uuidF);
// → true

uuidB.equals("5eb893ba-ec79-4f55-958d-66731227b662");
// → true
uuidB.equals("5eb893baec794f55958d66731227b662");
// → true
uuidB.equals("5EB893BA-EC79-4F55-958D-66731227B662");
// → true
uuidB.equals("5EB893BAEC794F55958D66731227B662");
// → true
uuidB.equals("urn:uuid:5eb893ba-ec79-4f55-958d-66731227b662");
// → true
```

```javascript
const uuidX = Uuid.fromString(crypto.randomUUID());
```
